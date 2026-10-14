        const SECOND = 1e3;
        const MINUTE = 60 * SECOND;
        const HOUR = 60 * MINUTE;
        const DAY = 24 * HOUR;
        let activeHelpInterval = 20 * MINUTE;
        let commentRecovery_unsafeWindow_alt = window;
        function commentRecovery_saveCommentCache(id, cache, callback) {
            js_data.saveCommentCache(id, cache, (e => {
                if (callback) {
                    callback(e);
                }
                js_event.emit("COMMENT_CACHE_UPDATE", cache);
            }));
        }
        function _httpGet(url, callback) {
            let xhr = new commentRecovery_unsafeWindow_alt.XMLHttpRequest;
            xhr.open("GET", url, true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onload = function() {
                try {
                    let d = JSON.parse(this.responseText);
                    if (callback) callback(d);
                } catch (e) {
                    console.error(e);
                    if (callback) callback(null);
                }
            };
            xhr.send();
        }
        function getContentId() {
            let pagetype = getPageType();
            let id = null;
            if (pagetype === "VIDEO") {
                let info = unsafeWindow.videoInfo;
                if (!info) return null;
                id = info["dougaId"];
            } else {
                let info = unsafeWindow.articleInfo;
                if (!info) return null;
                id = info["articleId"];
            }
            return id;
        }
        function getPage(id, p, callback, collectedComments) {
            let url = `https://www.acfun.cn/rest/pc-direct/comment/listByFloor?sourceId=${id}&sourceType=3&page=${p}&pivotCommentId=0&newPivotCommentId=0&t=1638284078529&supportZtEmot=true`;
            _httpGet(url, (d => {
                if (d) {
                    let keys = d.commentIds;
                    keys.forEach((key => {
                        key = "c" + key;
                        let c = d.commentsMap[key];
                        if (c.isDelete) {
                            return;
                        }
                        let comment = {
                            username: c.userName,
                            content: c.content,
                            replyTime: c.timestamp,
                            cId: c.cid,
                            floor: c.floor
                        };
                        collectedComments[parseInt(c.floor)] = comment;
                    }));
                    collectedComments["totalCount"] = d.totalCount;
                    let maxPage = d.totalPage;
                    if (p < maxPage) {
                        setTimeout((() => {
                            getPage(id, p + 1, callback, collectedComments);
                        }), 500);
                    } else {
                        callback(collectedComments);
                    }
                }
            }));
        }
        function _getPageLastReply(id, callback) {
            let p = 1;
            let url = `https://www.acfun.cn/rest/pc-direct/comment/listByFloor?sourceId=${id}&sourceType=3&page=${p}&pivotCommentId=0&newPivotCommentId=0&t=1638284078529&supportZtEmot=true`;
            _httpGet(url, (d => {
                if (d) {
                    let idlast = "c" + d.commentIds[0];
                    let clast = d.commentsMap[idlast];
                    let totalCount = d.totalCount;
                    callback(clast, totalCount);
                }
            }));
        }
        let udpCache = {};
        function _getUserDeletedPost(username, callback) {
            if (username in udpCache) {
                callback(udpCache[username]);
            } else {
                util.apiRequest({
                    query: "udp",
                    username
                }, (result => {
                    udpCache[username] = result;
                    callback(result);
                }));
            }
        }
        function _getAllPageCommentOnline(id, callback) {
            log_log(`采集评论，投稿id=${id}`);
            function collectDone(collectedComments) {
                let commentInfo = {
                    id,
                    floors: collectedComments,
                    deletedFloors: [],
                    recoveredFloors: [],
                    lastReplyTime: 0,
                    lastCheckTime: +new Date,
                    createTime: 0,
                    floorCount: 0,
                    reportedRecovery: [],
                    queriedFloors: []
                };
                let maxFloor = 0;
                Object.keys(commentInfo.floors).forEach((k => {
                    let f = commentInfo.floors[k].floor;
                    if (f > maxFloor) maxFloor = f;
                }));
                commentInfo.floorCount = collectedComments["totalCount"];
                log_log(`已采集本投稿评论至${maxFloor}楼。`);
                for (let i = 1; i <= maxFloor; i++) {
                    if (!(i in collectedComments)) {
                        commentInfo.deletedFloors.push(i);
                    } else {
                        let replyTime = collectedComments[i].replyTime;
                        if (replyTime > commentInfo.lastReplyTime) {
                            commentInfo.lastReplyTime = replyTime;
                        }
                    }
                }
                callback(commentInfo);
            }
            getPage(id, 1, collectDone, {});
        }
        function _activeReport(cache) {
            let reportData = {
                id: cache.id,
                recoveredFloors: [],
                floors: {}
            };
            let count = 0;
            cache.recoveredFloors.forEach((fn => {
                fn = parseInt(fn);
                if (cache.reportedRecovery.indexOf(fn) < 0) {
                    reportData.recoveredFloors.push(fn);
                    let floor = cache.floors[fn];
                    let toReport = {
                        username: floor.username,
                        replyTime: floor.replyTime,
                        floor: parseInt(floor.floor),
                        cId: parseInt(floor.cId),
                        content: floor.content
                    };
                    reportData.floors[fn] = toReport;
                    count++;
                }
            }));
            let queryData = {
                query: "report_cache",
                cache: reportData
            };
            if (count > 0) {
                util.apiRequest(queryData, (result => {
                    cache.reportedRecovery = cache.recoveredFloors.map((x => x));
                    commentRecovery_saveCommentCache(cache.id, cache);
                }));
            }
        }
        function _getCommentsOnlineAndMerge(id, oldCache, callback) {
            _getAllPageCommentOnline(id, (newCache => {
                let intKeys = Object.keys(newCache.floors).map((x => parseInt(x)));
                let floorMax = Math.max(...intKeys);
                for (let f = 1; f <= floorMax; f++) {
                    if (f in newCache.floors && f in oldCache.floors) {} else if (f in newCache.floors && !(f in oldCache.floors)) {} else if (!(f in newCache.floors) && f in oldCache.floors) {
                        newCache.floors[f] = oldCache.floors[f];
                        newCache.recoveredFloors.push(f);
                    } else {}
                }
                if (!oldCache.reportedRecovery) {
                    oldCache.reportedRecovery = [];
                }
                newCache.reportedRecovery = oldCache.reportedRecovery.map((x => x));
                let delcount = newCache.deletedFloors.length;
                let recovCount = newCache.recoveredFloors.length;
                commentRecovery_saveCommentCache(id, newCache, (() => {
                    log_log(`投稿${id}重新缓存完成。${delcount}个被删除，${recovCount}个被恢复`);
                    callback(newCache);
                    _activeReport(newCache);
                }));
            }));
        }
        function _checkPageComment(id, callback) {
            js_data.getLocalCommentCache(id, (cache => {
                if (!cache) {
                    _getAllPageCommentOnline(id, (c => {
                        commentRecovery_saveCommentCache(id, c, (() => {
                            log_log("首次收集投稿" + id + `评论完成。发现${c.deletedFloors.length}个评论被删除。`);
                            callback(c);
                        }));
                    }));
                } else {
                    log_log("对比评论缓存是否需要更新。");
                    _getPageLastReply(id, ((lastReply, totalCount) => {
                        if (!lastReply) return;
                        let t1 = parseInt(lastReply.timestamp);
                        let t2 = parseInt(cache.lastReplyTime);
                        if (t1 !== t2 || cache.floorCount !== totalCount) {
                            log_log(id + " 投稿缓存需要更新");
                            _getCommentsOnlineAndMerge(id, cache, callback);
                        } else {
                            log_log("已经缓存到最新评论了。");
                            callback(cache);
                        }
                    }));
                }
            }));
        }
        function _checkCurrentPageComment(callback) {
            if (!callback) callback = () => 0;
            let id = getContentId();
            if (id === null) {
                setTimeout((() => {
                    _checkCurrentPageComment(callback);
                }), 400);
                return;
            }
            _checkPageComment(id, callback);
        }
        function showUI(cache) {
            js_event.emit("SHOW_DELETED_COMMENT_UI", cache);
        }
        function _recoverByLocalCache(cache, then) {
            log_log(`本地可恢复楼层：${cache.recoveredFloors.join(" ")}`);
            cache.recoveredFloors.forEach((recoveredFloor => {
                let floor = cache.floors[recoveredFloor];
                js_event.emit("FLOOR_RECOVER", floor);
            }));
            then();
        }
        function _mergeServerCacheToLocal(serverCache, localCache) {
            if (serverCache.cached.length === 0) {
                log_log("服务器没有其他缓存，已同步服务器缓存");
                return;
            }
            serverCache.cached.forEach((floor => {
                if (localCache.recoveredFloors.indexOf(floor.floor) < 0) {
                    localCache.floors[floor.floor] = floor;
                    localCache.recoveredFloors.push(floor.floor);
                    localCache.reportedRecovery.push(floor.floor);
                }
            }));
            commentRecovery_saveCommentCache(localCache.id, localCache, (() => {
                log_log("已从服务器更新本投稿缓存。");
            }));
        }
        function _recoverByServerCache(localCache) {
            let queryObj = {
                query: "query_floors",
                id: localCache.id,
                floors: localCache.deletedFloors.filter((x => localCache.recoveredFloors.indexOf(x) < 0))
            };
            if (queryObj.floors.length > 0) {
                log_log("向服务器发出恢复评论的请求");
                util.apiRequest(queryObj, (result => {
                    let cachedFloors = [];
                    result.cached.forEach((floor => {
                        js_event.emit("FLOOR_RECOVER", floor);
                        cachedFloors.push(floor.floor);
                    }));
                    queryObj.floors.forEach((f => {
                        if (cachedFloors.indexOf(f) < 0) {
                            js_event.emit("NO_SERVER_CACHE", f);
                        }
                    }));
                    _mergeServerCacheToLocal(result, localCache);
                }));
            }
        }
        function recoverComments(cache) {
            _recoverByLocalCache(cache, (() => {
                _recoverByServerCache(cache);
            }));
        }
        function __activeHelp() {
            js_data.getAllCacheIndex((ids => {
                let queryObj = {
                    query: "active_recover",
                    ids
                };
                util.apiRequest(queryObj, (_d => {
                    log_log(`收到服务器恢复需求。${_d.result.length}个投稿需要本地数据`, _d);
                    let list = _d.result;
                    let recoverCount = 0;
                    let floorTotal = 0;
                    list.forEach(((serverRequest, index) => {
                        js_data.getLocalCommentCache(serverRequest._id, (cache => {
                            let reportData = {
                                id: cache.id,
                                recoveredFloors: [],
                                floors: {}
                            };
                            let count = 0;
                            serverRequest.floors.forEach((f => {
                                if (f in cache.floors) {
                                    count++;
                                    let floor = cache.floors[f];
                                    let toReport = {
                                        username: floor.username,
                                        replyTime: floor.replyTime,
                                        floor: parseInt(floor.floor),
                                        cId: parseInt(floor.cId),
                                        content: floor.content
                                    };
                                    reportData.recoveredFloors.push(f);
                                    reportData.floors[f] = toReport;
                                }
                            }));
                            let queryData = {
                                query: "report_cache",
                                cache: reportData
                            };
                            if (count > 0) {
                                log_log("主动恢复评论数据", reportData);
                                util.apiRequest(queryData, (result => {
                                    log_log("恢复结果", result);
                                    cache.reportedRecovery = cache.recoveredFloors.map((x => x));
                                    commentRecovery_saveCommentCache(cache.id, cache);
                                }));
                                recoverCount++;
                                floorTotal += count;
                            }
                            if (index === list.length - 1) {
                                log_log(`帮助服务器恢复共${recoverCount}个投稿和${floorTotal}个评论。`);
                            }
                        }));
                    }));
                }));
            }));
        }
        function _activeHelp() {
            log_log("主动帮助");
            let t = +new Date;
            js_data.getActiveHelpTime((lasttime => {
                if (t - activeHelpInterval > lasttime) {
                    let interval = Math.round((t - lasttime) / 1e3);
                    log_log(`距离上次主动帮助已经${interval}秒了`);
                    __activeHelp();
                    js_data.setActiveHelpTime(t);
                } else {
                    log_log(`距离上次主动帮助还未足够。`);
                }
            }));
        }
        function _deleteCache(id) {
            log_log("trying to delete cache, id=", id);
            js_data.deleteCommentCache(id, (() => {}));
        }
        function _deleteAllCache(callback) {
            log_log("deleteallcache");
            function deleteOneByOne(ids) {
                if (ids.length <= 0) {
                    js_event.emit("COMMENT_CACHE_UPDATE", null);
                    js_data.deleteAllCacheIndex((() => {}));
                    callback();
                    return;
                }
                let id = ids.splice(0, 1);
                _deleteCache(id);
                setTimeout((() => {
                    deleteOneByOne(ids);
                }));
            }
            js_data.getAllCacheIndex((ids => {
                log_log("缓存文章列表");
                log_log(ids);
                deleteOneByOne(ids);
            }));
        }
        function _searchCacheByKeyword(str, callback) {
            log_log("搜索缓存 - 关键词:" + str);
            let searchResult = [];
            function searchOneByOne(ids) {
                if (ids.length <= 0) {
                    js_event.emit("COMMENT_CACHE_UPDATE", null);
                    if (callback) callback(searchResult);
                    return;
                }
                let id = ids.splice(0, 1)[0];
                js_data.getLocalCommentCache(id, (c => {
                    for (let floor in c.floors) {
                        let f = c.floors[floor];
                        if (f.content && f.content.indexOf(str) >= 0) {
                            let res = {
                                ac: "ac" + id,
                                floor,
                                content: f.content,
                                username: f.username
                            };
                            log_log(JSON.stringify(res));
                            searchResult.push(res);
                        }
                    }
                    searchOneByOne(ids);
                }));
            }
            js_data.getAllCacheIndex((ids => {
                searchOneByOne(ids);
            }));
        }
        const commentRecovery = {
            init() {
                commentUI.init();
                let pagetype = getPageType();
                if (!(pagetype === "VIDEO" || pagetype === "ARTICLE")) {
                    return;
                }
                commentRecovery_unsafeWindow_alt["deleteCache"] = js_data.deleteCommentCache;
                commentRecovery_unsafeWindow_alt["clearCache"] = _deleteAllCache;
                _checkCurrentPageComment((cache => {
                    setTimeout((() => {
                        showUI(cache);
                        recoverComments(cache);
                    }), 1e3);
                }));
                _activeHelp();
            },
            searchCacheByKeyword: _searchCacheByKeyword,
            deleteAllCache: _deleteAllCache,
            getUserDeletedPost: _getUserDeletedPost
        };

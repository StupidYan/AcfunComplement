        function _isUsingNewCloud(callback) {
            GM_get("USE_NEW_CLOUD", false, callback);
        }
        function _setUsingNewCloud(callback) {
            GM_set("USE_NEW_CLOUD", true);
        }
        function _loadBanList_simple(callback) {
            GM_get("ACFUN_BLOCK_LIST", [], (val => {
                callback(removeDuplicate(val));
            }));
        }
        function _loadKeywords_simple(callback) {
            GM_get("ACFUN_BLOCK_KEYWORDS", [], (val => {
                callback(removeDuplicate(val));
            }));
        }
        function _loadReplyBanList_simple(callback) {
            GM_get("ACFUN_BLOCK_REPLIERS", [], (val => {
                callback(removeDuplicate(val));
            }));
        }
        function _loadBanList(callback, stringOnly = true) {
            GM_get("ACFUN_BLOCK_LIST", [], (list => {
                list = removeDuplicate(list);
                _loadGeneralSetting((setting => {
                    if (setting.useBannedUpRankList) {
                        _loadRankingData((data => {
                            let rankList = data.upRank;
                            if (stringOnly) {
                                rankList = rankList.map((x => x.item));
                            }
                            if (rankList.length) {
                                list = list.concat(rankList);
                            }
                            callback(list);
                        }));
                    } else {
                        callback(list);
                    }
                }));
            }));
        }
        function _loadKeywords(callback, stringOnly = true) {
            GM_get("ACFUN_BLOCK_KEYWORDS", [], (list => {
                list = removeDuplicate(list);
                _loadGeneralSetting((setting => {
                    if (setting.useBannedKeywordsList) {
                        _loadRankingData((data => {
                            let rankList = data.keywordRank;
                            if (stringOnly) {
                                rankList = rankList.map((x => x.item));
                            }
                            if (rankList.length) {
                                list = list.concat(rankList);
                            }
                            callback(list);
                        }));
                    } else {
                        callback(list);
                    }
                }));
            }));
        }
        function _loadReplyBanList(callback, stringOnly = true) {
            GM_get("ACFUN_BLOCK_REPLIERS", [], (list => {
                list = removeDuplicate(list);
                _loadGeneralSetting((setting => {
                    if (setting.useBannedReplierList) {
                        _loadRankingData((data => {
                            let rankList = data.replierRank;
                            if (stringOnly) {
                                rankList = rankList.map((x => x.item));
                            }
                            if (rankList.length) {
                                list = list.concat(rankList);
                            }
                            callback(list);
                        }));
                    } else {
                        callback(list);
                    }
                }));
            }));
        }
        function _updateBanList(d, callback) {
            GM_set("ACFUN_BLOCK_LIST", d, callback);
        }
        function _updateKeywords(d, callback) {
            GM_set("ACFUN_BLOCK_KEYWORDS", d, callback);
        }
        function _updateReplyBanList(d, callback) {
            GM_set("ACFUN_BLOCK_REPLIERS", d, callback);
        }
        function _loadBanUidList_simple(callback) {
            GM_get("ACFUN_BLOCK_LIST_UID", [], (val => {
                callback(val);
            }));
        }
        function _updateBanUidList(d, callback) {
            GM_set("ACFUN_BLOCK_LIST_UID", d, callback);
        }
        function _banUid(uid, name, callback) {
            _loadBanUidList_simple((list => {
                let i = list.findIndex((x => x.id === uid));
                if (i < 0) {
                    list.push({
                        id: uid,
                        name
                    });
                    _updateBanUidList(list, (() => {
                        empty(callback)(list);
                    }));
                } else {
                    empty(callback)(list);
                }
            }));
        }
        function _unbanUidByName(name, callback) {
            name = name.trim();
            _loadBanUidList_simple((list => {
                let newList = list.filter((x => x.name !== name));
                if (newList.length !== list.length) {
                    _updateBanUidList(newList, (() => {
                        empty(callback)(newList);
                    }));
                } else {
                    empty(callback)(newList);
                }
            }));
        }
        function _unbanUid(uid, callback) {
            _loadBanUidList_simple((list => {
                let i = list.findIndex((x => x.id === uid));
                if (i >= 0) {
                    list.splice(i, 1);
                    _updateBanUidList(list, (() => {
                        empty(callback)(list);
                    }));
                } else {
                    empty(callback)(list);
                }
            }));
        }
        function _loadReplyUidList_simple(callback) {
            GM_get("ACFUN_BLOCK_REPLIERS_UID", [], (val => {
                callback(val);
            }));
        }
        function _updateReplyUidList(d, callback) {
            GM_set("ACFUN_BLOCK_REPLIERS_UID", d, callback);
        }
        function _banReplyUid(uid, name, callback) {
            _loadReplyUidList_simple((list => {
                let i = list.findIndex((x => x.id === uid));
                if (i < 0) {
                    list.push({
                        id: uid,
                        name
                    });
                    _updateReplyUidList(list, (() => {
                        empty(callback)(list);
                    }));
                } else {
                    empty(callback)(list);
                }
            }));
        }
        function _unbanReplyUidByName(name, callback) {
            name = name.trim();
            _loadReplyUidList_simple((list => {
                let newList = list.filter((x => x.name !== name));
                if (newList.length !== list.length) {
                    _updateReplyUidList(newList, (() => {
                        empty(callback)(newList);
                    }));
                } else {
                    empty(callback)(newList);
                }
            }));
        }
        function _unbanReplyUid(uid, callback) {
            _loadReplyUidList_simple((list => {
                let i = list.findIndex((x => x.id === uid));
                if (i >= 0) {
                    list.splice(i, 1);
                    _updateReplyUidList(list, (() => {
                        empty(callback)(list);
                    }));
                } else {
                    empty(callback)(list);
                }
            }));
        }
        __webpack_require__.g["usernameIDCache"] = null;
        function _getUsernameID(callback) {
            let unsafeWindow_alt = unsafeWindow;
            function retry() {
                setTimeout((() => {
                    _getUsernameID(callback);
                }), 1e3);
            }
            if (__webpack_require__.g["usernameIDCache"]) {
                empty(callback)(__webpack_require__.g["usernameIDCache"]);
                return;
            }
            if (typeof unsafeWindow_alt.user !== "undefined") {
                let name = unsafeWindow_alt.user.name;
                if (name !== "用户" && name !== "未知用户" && unsafeWindow_alt.ImSdk) {
                    let id = null;
                    try {
                        id = unsafeWindow_alt.ImSdk.instance.kernel.cache.uid.low;
                    } catch (e) {
                        console.error(e);
                    }
                    __webpack_require__.g["usernameIDCache"] = [ name, id ];
                    empty(callback)(__webpack_require__.g["usernameIDCache"]);
                } else {
                    retry();
                }
            } else {
                let ndom = unsafeWindow_alt.document.querySelector("a.fl.user-name");
                if (ndom) {
                    let name = ndom.innerText.trim();
                    if (name !== "未知用户" && unsafeWindow_alt.ImSdk) {
                        let id = null;
                        try {
                            id = unsafeWindow_alt.ImSdk.instance.kernel.cache.uid;
                        } catch (e) {}
                        __webpack_require__.g["usernameIDCache"] = [ name, id ];
                        empty(callback)(__webpack_require__.g["usernameIDCache"]);
                    } else {
                        retry();
                    }
                } else {
                    retry();
                }
            }
        }
        function _getAllTags(callback) {
            if (typeof __webpack_require__.g["cachedUserTags"] === "undefined") {
                GM_get("ALL_TAGS", {}, (v => {
                    __webpack_require__.g["cachedUserTags"] = v;
                    let cache = __webpack_require__.g["cachedUserTags"];
                    empty(callback)(cache);
                }));
            } else {
                empty(callback)(__webpack_require__.g["cachedUserTags"]);
            }
        }
        function _updateAllTags(callback) {
            __webpack_require__.g["cachedUserTags"] = __webpack_require__.g["cachedUserTags"] ? __webpack_require__.g["cachedUserTags"] : {};
            let ts = __webpack_require__.g["cachedUserTags"];
            let tsnew = {};
            for (let key in ts) {
                if (ts.hasOwnProperty(key)) {
                    if (ts[key].length > 0) {
                        tsnew[key] = ts[key];
                    }
                }
            }
            GM_set("ALL_TAGS", tsnew, (() => {
                empty(callback)();
            }));
        }
        function _addToCommentIndex(id, callback) {
            _getAllCacheIndex((ids => {
                if (ids.indexOf(id) < 0) {
                    ids.push(id);
                    ids.sort(((a, b) => a - b));
                }
                GM_set("COMMENT_CACHE_INDEX", ids, (() => {
                    empty(callback)();
                }));
            }));
        }
        function _deleteFromCommentIndex(id, callback) {
            _getAllCacheIndex((ids => {
                if (ids.indexOf(id) >= 0) {
                    let i = ids.indexOf(id);
                    ids.splice(i, 1);
                    GM_set("COMMENT_CACHE_INDEX", ids, (() => {
                        empty(callback)();
                    }));
                }
            }));
        }
        function _getAllCacheIndex(callback) {
            GM_get("COMMENT_CACHE_INDEX", [], (ids => {
                empty(callback)(ids);
            }));
        }
        function _deleteAllCacheIndex(callback) {
            GM_delete("COMMENT_CACHE_INDEX", (() => {
                empty(callback)();
            }), (() => {
                log_log("删除缓存出错！");
            }));
        }
        function _getCommentCache(id, callback) {
            let cacheId = `COMMENT_CACHE_${id}`;
            GM_get(cacheId, null, (cache => {
                empty(callback)(cache);
            }), (() => {
                empty(callback)(null);
            }));
        }
        function _saveCommentCache(id, cache, callback) {
            let cacheId = `COMMENT_CACHE_${id}`;
            GM_set(cacheId, cache, (() => {
                _addToCommentIndex(id, (() => {
                    empty(callback)();
                }));
            }), (() => {
                console.error("缓存评论失败！");
            }));
        }
        function _deleteCommentCache(id, callback) {
            let cacheId = `COMMENT_CACHE_${id}`;
            GM_delete(cacheId, (() => {
                _deleteFromCommentIndex(id, (() => {
                    empty(callback)();
                }));
            }), (() => {
                console.log("DEBUG 删除缓存失败");
            }));
        }
        function _saveUIPosition(x, y) {
            GM_set("UI_POSITION", {
                x,
                y
            });
        }
        function _loadUIPosition(callback) {
            GM_get("UI_POSITION", {
                x: 0,
                y: 500
            }, (val => {
                callback(val);
            }));
        }
        function _loadGeneralSetting(callback) {
            GM_get("GENERAL_SETTING", {
                showDeletedComment: true,
                showUserTags: true,
                showBanButton: true,
                showMouseover: true,
                autoSync: true,
                showBanStatusTag: true,
                useBannedUpRankList: false,
                useBannedKeywordsList: false,
                useBannedReplierList: false,
                disableAnimation: false,
                usePreload: true
            }, (val => {
                callback(val);
            }));
        }
        function _saveGeneralSetting(setting, callback) {
            GM_set("GENERAL_SETTING", setting, (() => {
                callback();
            }));
        }
        function _loadRankingData(callback) {
            GM_get("RANKING_DATA", {
                time: 0,
                data: null
            }, (val => {
                let timeNow = +new Date;
                let HOUR = 3600 * 1e3;
                if (timeNow - val.time > HOUR) {
                    util.apiRequest({
                        query: "rank",
                        count: 150
                    }, (data => {
                        console.log(data);
                        _cacheRankingData(data, (() => {
                            callback(data);
                        }));
                    }));
                } else {
                    callback(val.data);
                }
            }));
        }
        function _cacheRankingData(data, callback) {
            GM_set("RANKING_DATA", {
                time: +new Date,
                data
            }, (() => {
                callback();
            }));
        }
        function removeDuplicate(list = []) {
            let dict = {};
            list.forEach((item => {
                dict[item] = true;
            }));
            let newList = Object.keys(dict);
            return newList;
        }
        function _banUser(username, callback) {
            username = username.trim();
            _loadBanList_simple((list => {
                list = removeDuplicate(list);
                if (list.indexOf(username) < 0) {
                    list.push(username);
                    _updateBanList(list, (() => {
                        empty(callback)(list);
                    }));
                } else {
                    empty(callback)(list);
                }
            }));
        }
        function _banKeyword(w, callback) {
            w = w.trim();
            _loadKeywords_simple((ws => {
                ws = removeDuplicate(ws);
                if (ws.indexOf(w) < 0) {
                    ws.push(w);
                    _updateKeywords(ws, (() => {
                        empty(callback)(ws);
                    }));
                } else {
                    empty(callback)(ws);
                }
            }));
        }
        function _banReplier(username, callback) {
            username = username.trim();
            _loadReplyBanList_simple((list => {
                list = removeDuplicate(list);
                if (list.indexOf(username) < 0) {
                    list.push(username);
                    _updateReplyBanList(list, (() => {
                        empty(callback)(list);
                    }));
                } else {
                    empty(callback)(list);
                }
            }));
        }

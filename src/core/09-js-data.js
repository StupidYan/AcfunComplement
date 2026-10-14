        const js_data = {
            version,
            loadRankingData: _loadRankingData,
            loadGeneralSetting: _loadGeneralSetting,
            saveGeneralSetting: _saveGeneralSetting,
            updateBanList: _updateBanList,
            updateKeywords: _updateKeywords,
            updateReplyBanList: _updateReplyBanList,
            loadBanList: _loadBanList,
            loadReplyBanList: _loadReplyBanList,
            loadKeywords: _loadKeywords,
            copyRankBanLish: callback => {
                function addFunc(list) {
                    if (list.length > 0) {
                        let username = list.splice(0, 1)[0];
                        _banUser(username, (() => {
                            addFunc(list);
                        }));
                    } else {
                        callback();
                    }
                }
                _loadRankingData((data => {
                    let rankList = data.upRank;
                    rankList = rankList.map((x => x.item));
                    if (rankList.length) {
                        addFunc(rankList);
                    }
                }));
            },
            copyRankReplyBanList: callback => {
                function addFunc(list) {
                    if (list.length > 0) {
                        let replier = list.splice(0, 1)[0];
                        _banReplier(replier, (() => {
                            addFunc(list);
                        }));
                    } else {
                        callback();
                    }
                }
                _loadRankingData((data => {
                    let rankList = data.replierRank;
                    rankList = rankList.map((x => x.item));
                    if (rankList.length) {
                        addFunc(rankList);
                    }
                }));
            },
            copyRankKeywords: callback => {
                function addFunc(list) {
                    if (list.length > 0) {
                        let keyword = list.splice(0, 1)[0];
                        _banKeyword(keyword, (() => {
                            addFunc(list);
                        }));
                    } else {
                        callback();
                    }
                }
                _loadRankingData((data => {
                    let rankList = data.keywordRank;
                    rankList = rankList.map((x => x.item));
                    if (rankList.length) {
                        addFunc(rankList);
                    }
                }));
            },
            isUsingNewCloud: _isUsingNewCloud,
            setUsingNewCloud: _setUsingNewCloud,
            getUsernameID: _getUsernameID,
            loadUIPosition: _loadUIPosition,
            saveUIPosition: _saveUIPosition,
            getAllCacheIndex: _getAllCacheIndex,
            deleteAllCacheIndex: _deleteAllCacheIndex,
            getLocalCommentCache: _getCommentCache,
            saveCommentCache: _saveCommentCache,
            deleteCommentCache: _deleteCommentCache,
            getActiveHelpTime: function(callback) {
                let time = 0;
                GM_get("ACTIVE_HELP_TIME", time, (d => {
                    if (typeof d === "undefined" || d === null) d = 0;
                    let d2 = parseInt(d);
                    if (isNaN(d2)) d2 = 0;
                    empty(callback)(d2);
                }));
            },
            setActiveHelpTime(time, callback) {
                let t = typeof time === "undefined" ? +new Date : time;
                GM_set("ACTIVE_HELP_TIME", t, (() => {
                    empty(callback)(t);
                }));
            },
            setUpdateTime(time, callback) {
                let t = typeof time === "undefined" ? +new Date : time;
                GM_set("UPDATE_TIME", t, (() => {
                    empty(callback)(t);
                }));
            },
            getUpdateTime(callback) {
                let time = 0;
                GM_get("UPDATE_TIME", time, (d => {
                    if (typeof d === "undefined" || d === null) d = 0;
                    let d2 = parseInt(d);
                    if (isNaN(d2)) d2 = 0;
                    empty(callback)(parseInt(d2));
                }));
            },
            banUser: _banUser,
            banUid: _banUid,
            unbanUid: _unbanUid,
            banReplyUid: _banReplyUid,
            unbanReplyUid: _unbanReplyUid,
            loadUpUidList: _loadBanUidList_simple,
            loadReplyUidList: _loadReplyUidList_simple,
            unbanUser(username, callback) {
                username = username.trim();
                _unbanUidByName(username);
                _loadBanList_simple((list => {
                    list = removeDuplicate(list);
                    let i = list.indexOf(username);
                    if (i >= 0) {
                        list.splice(i, 1);
                        _updateBanList(list, (() => {
                            empty(callback)(list);
                        }));
                    } else {
                        empty(callback)(list);
                    }
                }));
            },
            banKeyword: _banKeyword,
            unbanKeyword(w, callback) {
                w = w.trim();
                _loadKeywords_simple((ws => {
                    ws = removeDuplicate(ws);
                    let i = ws.indexOf(w);
                    if (i >= 0) {
                        ws.splice(i, 1);
                        _updateKeywords(ws, (() => {
                            empty(callback)(ws);
                        }));
                    } else {
                        empty(callback)(ws);
                    }
                }));
            },
            banReplier: _banReplier,
            unbanReplier(username, callback) {
                username = username.trim();
                _unbanReplyUidByName(username);
                _loadReplyBanList_simple((list => {
                    list = removeDuplicate(list);
                    let i = list.indexOf(username);
                    if (i >= 0) {
                        list.splice(i, 1);
                        _updateReplyBanList(list, (() => {
                            empty(callback)(list);
                        }));
                    } else {
                        empty(callback)(list);
                    }
                }));
            },
            getTags(username, callback) {
                username = username.trim();
                _getAllTags((v => {
                    let tags = v[username];
                    empty(callback)(tags ? tags : []);
                }));
            },
            removeTagForUser(username, tag, callback) {
                username = username.trim();
                _getAllTags((v => {
                    let tags = v[username];
                    tags = tags ? tags : [];
                    let i = tags.indexOf(tag);
                    if (i >= 0) {
                        tags.splice(i, 1);
                        v[username] = tags;
                    }
                    __webpack_require__.g["cachedUserTags"] = v;
                    _updateAllTags(callback);
                }));
            },
            addTagToUser(username, tag, callback) {
                username = username.trim();
                _getAllTags((v => {
                    let tags = username in v ? v[username] : [];
                    if (tags.indexOf(tag) < 0) {
                        console.log(tag, "add to ", username);
                        tags.push(tag);
                        v[username] = tags;
                    }
                    __webpack_require__.g["cachedUserTags"] = v;
                    console.log(__webpack_require__.g["cachedUserTags"]);
                    _updateAllTags(callback);
                }));
            },
            AddTagsToUser(username, newtags, callback) {
                username = username.trim();
                _getAllTags().then((v => {
                    let tags = v[username];
                    tags = tags ? tags : [];
                    newtags.forEach((t => {
                        if (tags.indexOf(t) < 0) {
                            tags.push[t];
                        }
                    }));
                    v[username] = tags;
                    __webpack_require__.g["cachedUserTags"] = v;
                    _updateAllTags(callback);
                }));
            },
            getAlltags(callback) {
                _getAllTags((v => {
                    callback(v);
                }));
            }
        };

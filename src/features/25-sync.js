        const imsdkDataProvider = 16731600;
        let lastUpdateTime = 0;
        function oldCloudGet(callback) {
            let im = unsafeWindow.ImSdk;
            let instance = im.instance;
            let id = "0_" + imsdkDataProvider;
            let sessPromise = instance.kernel.openSession(0, imsdkDataProvider);
            sessPromise.then((d => {
                let msgs = d.cachedSession.messages;
                if (typeof msgs === "undefined" || msgs.length === 0) {
                    callback(null);
                    return;
                }
                let lastmsg = msgs[msgs.length - 1].title;
                try {
                    let info = lastmsg.split(" ");
                    let chunkinfo = info[0].split("/");
                    let chunksize = chunkinfo[1];
                    let texts = [];
                    if (chunksize) {
                        chunksize = parseInt(chunksize);
                        for (let i = 0; i < chunksize; i++) {
                            let m = msgs[msgs.length - i - 1].title;
                            let minfo = m.split(" ");
                            let mchunkinfo = minfo[0].split("/");
                            let chunk_i = parseInt(mchunkinfo[0]) - 1;
                            texts[chunk_i] = minfo.slice(1).join(" ");
                        }
                    }
                    let text = texts.join("");
                    callback(text);
                } catch (e) {
                    console.error(e);
                    callback(null);
                }
            }));
        }
        function checkImSDKInit(args) {
            let trySyncCount = 0;
            trySyncCount++;
            if (trySyncCount > 30) return;
            let im = unsafeWindow.ImSdk;
            log("IMSDK");
            log(im);
            let needWait = false;
            try {
                let checklist = typeof im === "undefined" || typeof im.instance === "undefined" || im.instance == null || !im.instance.connected || typeof im.instance.kernel.cache === "undefined";
                needWait = checklist;
            } catch (e) {
                needWait = true;
                console.log("sync old DEBUG", needWait);
            }
            if (needWait) {
                log("载入信息。。");
                setTimeout((() => {
                    checkImSDKInit(args);
                }), 1e3);
            } else {
                setTimeout((() => {
                    ImSdkDataCheck(args);
                }), 0);
            }
        }
        function updateListByOldCloudData(d) {
            function trimWord(d) {
                return d.replace(/(\r\n|\n|\r)/gm, "").trim();
            }
            let keywordsstr = decode(d.keywords);
            let upsstr = decode(d.ups);
            let replierstr = typeof d.repliers == "undefined" ? "" : decode(d.repliers);
            let spliter = upsstr.indexOf(" ") > 0 || keywordsstr.indexOf(" ") > 0 ? " " : ",";
            let keywords = keywordsstr.split(spliter).map(trimWord);
            let ups = upsstr.split(spliter).map(trimWord);
            let repliers = replierstr.split(spliter).map(trimWord);
            keywords = keywords.length === 1 && keywords[0] === "" ? [] : keywords;
            ups = ups.length === 1 && ups[0] === "" ? [] : ups;
            repliers = repliers.length === 1 && repliers[0] === "" ? [] : repliers;
            data.updateBanList(ups, (() => {
                Event.emit("UP_BAN_UPDATE", null);
            }));
            data.updateKeywords(keywords, (() => {
                Event.emit("KEYWORD_BAN_UPDATE", null);
            }));
            data.updateReplyBanList(repliers, (() => {
                Event.emit("REPLY_BAN_UPDATE", null);
            }));
            data.setUpdateTime(d.time, (() => {}));
        }
        let defaultUpdateInterval = null && 30 * 1e3;
        function ImSdkDataCheck(args) {
            log("ImSdkDataCheck");
            data.getUpdateTime((localTime => {
                lastUpdateTime = localTime;
                oldCloudGet((text => {
                    console.log("oldCloudGet", text);
                    if (text === null) {} else {
                        try {
                            let d = JSON.parse(text);
                            if (typeof d.version === "undefined" || parseFloat(d.version) < parseFloat(data.version)) {
                                log("旧版同步信息发现，重新同步");
                                updateListByOldCloudData(d);
                            } else if (parseFloat(d.version) > parseFloat(data.version)) {
                                log("同步失败：你已经在其他地方使用过更新的版本了。请更新当前屏蔽插件，最新版本：" + d.version);
                            } else {
                                d.time = parseInt(decode(d.time));
                                let cloudtime = d.time;
                                if (cloudtime > localTime || data.version !== d.version) {
                                    log("Update list");
                                    updateListByOldCloudData(d);
                                } else if (localTime > cloudtime) {
                                    log("ImSdk is no longer available. Will try new cloud.");
                                } else {
                                    log("Check done, no update needed", (localTime - cloudtime) / 1e3, d);
                                }
                            }
                        } catch (ex) {}
                    }
                    data.setUsingNewCloud((() => {
                        log("切换到新服务器。");
                    }));
                    setTimeout(checkNewCloud, 5e3);
                }));
            }));
        }
        function synchroize_bindEvents() {
            js_event.on("SYNC_TIME_UPDATE", (t => {
                if (t && typeof t === "number" && t > 0) {
                    js_data.setUpdateTime(t, (() => {
                        log_log("更新同步时间", t);
                    }));
                }
            }));
            js_event.on("TAGS_UPDATE", (() => {
                let t = Math.floor(+new Date / 1e3);
                js_data.setUpdateTime(t, null);
            }));
            js_event.on("UP_BAN_UPDATE", (() => {
                let t = Math.floor(+new Date / 1e3);
                js_data.setUpdateTime(t, null);
            }));
            js_event.on("REPLY_BAN_UPDATE", (() => {
                let t = Math.floor(+new Date / 1e3);
                js_data.setUpdateTime(t, null);
            }));
            js_event.on("KEYWORD_BAN_UPDATE", (() => {
                let t = Math.floor(+new Date / 1e3);
                js_data.setUpdateTime(t, null);
            }));
            js_event.on("SYNC_NOW", (() => {
                let t = Math.floor(+new Date / 1e3);
                js_data.setUpdateTime(t, null);
                _syncWithCloud();
            }));
        }
        function synchroize_apiRequest(queryData, callback) {
            util.apiRequest(queryData, callback);
        }
        function checkDataForName(uid, name, callback) {
            log_log("从服务器查找用户:" + name);
            let d = {
                uid,
                name,
                query: "checktime"
            };
            synchroize_apiRequest(d, callback);
        }
        function syncFromServer(name, uid) {
            log_log("从服务器同步中。");
            synchroize_apiRequest({
                uid,
                name,
                query: "sync"
            }, (d => {
                log_log("已从服务器获得数据：", d);
                if (d.success) {
                    js_data.updateBanList(d.uplist);
                    js_data.updateReplyBanList(d.replylist);
                    js_data.updateKeywords(d.keywords);
                    js_event.emit("SYNC_TIME_UPDATE", d.lastsync);
                    js_event.emit("UP_BAN_UPDATE", null);
                    js_event.emit("REPLY_BAN_UPDATE", null);
                    js_event.emit("KEYWORD_BAN_UPDATE", null);
                }
            }));
        }
        let successNotice = d => {
            log_log("成功", d);
        };
        function checkNewCloud() {
            log_log("检查新服务器");
            js_data.getUsernameID((usernameId => {
                let username = usernameId[0];
                let uid = usernameId[1];
                checkDataForName(uid, username, (d => {
                    js_data.getUpdateTime((localtime => {
                        log_log("服务器时间=" + d["synctime"], "本地时间=" + localtime);
                        if (d["synctime"] > localtime) {
                            syncFromServer(username, uid);
                        } else if (d["synctime"] < localtime) {
                            uploadData((response => {
                                if (response.success) {
                                    log_log("同步成功");
                                    successNotice(response);
                                    js_event.emit("SYNC_TIME_UPDATE", response.synctime);
                                }
                            }));
                        } else {
                            log_log("已经与服务器同步。");
                            js_event.emit("SYNC_TIME_UPDATE", null);
                        }
                    }));
                }));
            }));
        }
        function uploadData(callback) {
            js_data.getUsernameID((usernameId => {
                let username = usernameId[0];
                let uid = usernameId[1];
                js_data.loadBanList((uplist => {
                    js_data.loadReplyBanList((replylist => {
                        js_data.loadKeywords((keywords => {
                            js_data.getAlltags((tags => {
                                let d = {
                                    uid,
                                    name: username,
                                    uplist,
                                    replylist,
                                    keywords,
                                    userTags: tags,
                                    query: "update"
                                };
                                synchroize_apiRequest(d, callback);
                            }));
                        }));
                    }));
                }));
            }));
        }
        function checkSync() {
            log_log("检查同步状态");
            log_log("正常使用新服务器同步");
            checkNewCloud();
        }
        function _syncWithCloud() {
            if (typeof unsafeWindow.user === "undefined") {
                setTimeout(_syncWithCloud, 1e3);
                return;
            } else {}
            if (unsafeWindow.user.name === "用户") {
                log_log("用户未登陆，取消同步");
                return;
            }
            log_log("登陆用户名：" + JSON.stringify(unsafeWindow.user.name));
            log_log("检查同步设置");
            js_data.loadGeneralSetting((setting => {
                if (setting.autoSync) {
                    checkSync();
                }
            }));
        }
        const synchroize = {
            init: () => {
                log_log("初始化同步模块");
                synchroize_bindEvents();
            },
            SyncWithCloud: _syncWithCloud
        };

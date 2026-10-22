        let ui_unsafeWindow = window;
        function hideArticle(c) {
            if ("contentData" in c.dom) {
                c = c.dom["contentData"];
            }
            if (!("originalHeight" in c)) {
                let rect = c.dom.getBoundingClientRect();
                c["originalHeight"] = rect.height;
            }
            c.dom.style.height = c.originalHeight + "px";
            c.dom.style.setProperty("border-bottom-width", "0", "important");
            c.dom.classList.add("smooth");
            setTimeout((() => {
                c.dom.classList.add("banned-article");
            }));
            setTimeout((() => {}), 500);
            c["hidden"] = true;
        }
        function hideItem(c) {
            c.dom.classList.add("smooth");
            c.dom.classList.add("banned-page-item");
            if (__webpack_require__.g["showMouseover"]) {
                c.dom.classList.add("hover-show");
            } else {
                c.dom.classList.remove("hover-show");
            }
            c["hidden"] = true;
        }
        function showItem(c) {
            c.dom.classList.remove("banned-page-item");
            c["hidden"] = false;
        }
        function showArticle(c) {
            c.dom.classList.remove("banned-article");
            c.dom.classList.remove("remove");
            c.dom.style.height = "";
            c.dom.style.removeProperty("border-bottom-width");
            c["hidden"] = false;
        }
        function _hideContent(c) {
            if ("contentData" in c.dom) {
                c = c.dom["contentData"];
            }
            if (c.type === "ARTICLE") {
                hideArticle(c);
            } else {
                hideItem(c);
            }
        }
        function _showContent(c) {
            if ("contentData" in c.dom) {
                c = c.dom["contentData"];
            }
            if (c.type === "ARTICLE") {
                showArticle(c);
            } else {
                showItem(c);
            }
        }
        function unbanReplier(username) {
            js_data.unbanReplier(username, (banlist => {
                js_event.emit("REPLY_BAN_UPDATE");
            }));
        }
        function _hideSingleComment(c) {
            let type = util.getCommentType();
            let blockDiv = ui_unsafeWindow.document.createElement("div");
            blockDiv.append(...c.dom.childNodes);
            blockDiv.classList.add("remove");
            blockDiv.classList.add("block-mark");
            let infoDiv = ui_unsafeWindow.document.createElement("div");
            infoDiv.classList.add("banned-text");
            infoDiv.innerText = "已屏蔽[" + c.username + "]的发言。";
            let unblockA = ui_unsafeWindow.document.createElement("a");
            unblockA.classList.add("unban-replier-btn");
            unblockA.innerText = "取消屏蔽";
            unblockA.addEventListener("click", (() => {
                if (c.uid) {
                    js_data.unbanReplyUid(c.uid);
                }
                unbanReplier(c.username);
            }));
            infoDiv.appendChild(unblockA);
            c.dom.appendChild(blockDiv);
            c.dom.appendChild(infoDiv);
            c["container"] = blockDiv;
            c.dom["bannedData"] = c;
            c.hidden = true;
        }
        function _unhideSingleComment(c) {
            if (!c.dom.hasOwnProperty("bannedData")) return;
            let attachedCommentData = c.dom["bannedData"];
            if (!attachedCommentData.hidden) return;
            c.dom.append(...attachedCommentData.container.childNodes);
            c.dom.querySelector(".banned-text").remove();
            attachedCommentData.container.remove();
            attachedCommentData.hidden = false;
        }
        function refreshUserComments(comments) {
            js_data.loadReplyBanList((banlist => {
                js_data.loadReplyUidList((uidlist => {
                    if (banlist !== null) {
                        comments.forEach((c => {
                            let uidHit = c.uid && uidlist.indexOf(c.uid) >= 0;
                            if (uidHit || banlist.indexOf(c.username) >= 0) {
                                if (c.dom.hasOwnProperty("bannedData")) {
                                    if (!c.dom["bannedData"].hidden) {
                                        _hideSingleComment(c);
                                    }
                                } else {
                                    _hideSingleComment(c);
                                }
                            } else {
                                _unhideSingleComment(c);
                            }
                            js_data.loadGeneralSetting((setting => {
                                if (!setting.disableAnimation) return;
                                let tags = c.dom.querySelectorAll("*");
                                tags.forEach((t => {
                                    t.style.animation = "";
                                }));
                            }));
                        }));
                    }
                }));
            }));
        }
        let preloadKlistCache = [];
        let preloadTestContentList = [];
        let preloadTestContentListFiltered = [];
        function addToPreLoadTestList(contents) {
            let exists = false;
            contents.forEach((c => {
                for (let i = 0; i < preloadTestContentList.length; i++) {
                    let item = preloadTestContentList[i];
                    if (c.title === item.title) {
                        exists = true;
                        return;
                    }
                }
                for (let i = 0; i < preloadTestContentListFiltered.length; i++) {
                    let item = preloadTestContentListFiltered[i];
                    if (c.title === item.title) {
                        exists = true;
                        return;
                    }
                }
                if (!exists) preloadTestContentList.push(c);
            }));
        }
        function getAndSavePreloadCache(link, contentObject) {
            util.downloadPage(link, (doc => {
                let mainDiv = doc.querySelector("#main");
                if (!mainDiv) return;
                let firstScript = mainDiv.querySelector("script");
                if (!firstScript) return;
                let script = firstScript.innerText;
                let regex = /window.articleInfo = (.+);/;
                let json = regex.exec(script)[1];
                let data = JSON.parse(json);
                let parts = data.parts;
                let content = "";
                parts.forEach((p => {
                    content += p.content;
                }));
                let parser = new DOMParser;
                let d = parser.parseFromString(content, "text/html");
                let body = d.querySelector("body");
                let text = body.innerText;
                util.dbHelper.save(link, text);
                log_log("完成预加载： ", link);
                checkPreloadBanned(contentObject, text);
            }));
        }
        function checkPreloadBanned(contentObj, contentText) {
            let banned = false;
            let klist = preloadKlistCache;
            if (klist && klist.indexOf) {
                for (let i = 0; i < klist.length; i++) {
                    let keyword = klist[i];
                    if (contentText.indexOf(keyword) >= 0) {
                        banned = true;
                        break;
                    }
                }
            }
            if (banned) {
                log_log("预加载后屏蔽条目：", contentObj.title);
                _hideContent(contentObj);
            } else if (!contentObj.hidden) {
                _showContent(contentObj);
            }
        }
        function preloadTestWorker() {
            if (preloadTestContentListFiltered.length === 0) {
                return;
            }
            let c = preloadTestContentListFiltered.pop();
            let link = c.dom.querySelector("a").getAttribute("href");
            let regex = /\/a\/ac(\d+)/;
            let id = regex.exec(link)[1];
            link = "https://www.acfun.cn/a/ac" + id;
            if (downloadFailedSet.has(link)) {
                return;
            }
            util.dbHelper.load(link).then((value => {
                if (typeof value === "undefined" || value === null) {
                    getAndSavePreloadCache(link, c);
                } else {
                    checkPreloadBanned(c, value);
                }
            }));
        }
        function preloadTestFilter() {
            preloadTestContentList.forEach((c => {
                let link = c.dom.querySelector("a").getAttribute("href");
                let regex = /\/a\/ac(\d+)/;
                let id = regex.exec(link)[1];
                link = "https://www.acfun.cn/a/ac" + id;
                if (downloadFailedSet.has(link)) {
                    return;
                }
                util.dbHelper.load(link).then((value => {
                    if (typeof value === "undefined" || value === null) {
                        preloadTestContentListFiltered.push(c);
                    } else {
                        checkPreloadBanned(c, value);
                    }
                }));
            }));
        }
        let preloadWorker = null;
        function preloadTest(contents, klist) {
            if (contents.length === 0) return;
            addToPreLoadTestList(contents);
            preloadKlistCache = klist;
            preloadTestFilter();
            if (preloadWorker === null) {
                preloadWorker = setInterval(preloadTestWorker, 300);
            }
        }
        function refreshPageItems(contents) {
            js_data.loadBanList((blist => {
                js_data.loadUpUidList((uidlist => {
                    js_data.loadKeywords((klist => {
                        let preloadTestList = [];
                        contents.forEach((c => {
                            let banned = false;
                            if (c.uid && uidlist.indexOf(c.uid) >= 0 || blist && blist.indexOf && blist.indexOf(c.username) >= 0) {
                                blist = blist.map((x => {
                                    if (typeof x === "object") {
                                        return x.item;
                                    }
                                    return x;
                                }));
                                _hideContent(c);
                                banned = true;
                            }
                            if (klist && klist.indexOf) {
                                klist.forEach((keyword => {
                                    if (c.title.indexOf(keyword) >= 0) {
                                        _hideContent(c);
                                        banned = true;
                                    }
                                }));
                            }
                            if (!banned) {
                                _showContent(c);
                                if (c.type === "ARTICLE") preloadTestList.push(c);
                            }
                        }));
                        js_data.loadGeneralSetting((setting => {
                            if (setting.usePreload) {
                                log_log("预加载测试中。。。");
                                preloadTest(preloadTestList, klist);
                            } else {
                                log_log("预加载已关闭");
                            }
                        }));
                    }));
                }));
            }));
        }

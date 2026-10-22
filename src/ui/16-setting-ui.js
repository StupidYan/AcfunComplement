        let setting_ui_unsafeWindow = window;
        function enableDragging(controlDom, containerDom, enableX = true, enableY = true) {
            let doc = setting_ui_unsafeWindow.document;
            let body = doc.body;
            let cx = -1;
            let cy = -1;
            __webpack_require__.g.dragging = false;
            let startCX;
            let startCY;
            controlDom.addEventListener("pointerdown", (e => {
                cx = e.clientX;
                cy = e.clientY;
                let rect = containerDom.getBoundingClientRect();
                startCX = rect.left;
                startCY = rect.top;
                __webpack_require__.g.dragging = true;
            }));
            body.addEventListener("pointermove", (e => {
                if (__webpack_require__.g.dragging) {
                    let dx = e.clientX - cx;
                    let dy = e.clientY - cy;
                    if (enableX) {
                        containerDom.style.left = startCX + dx + "px";
                    }
                    if (enableY) {
                        containerDom.style.top = startCY + dy + "px";
                    }
                }
            }));
            body.addEventListener("pointerup", (() => {
                __webpack_require__.g.dragging = false;
                let rect = containerDom.getBoundingClientRect();
                js_data.saveUIPosition(rect.left, rect.y);
            }));
        }
        function showBannedList(dom, listName) {
            let dictBan = {
                up: [ "#ban_up_page", js_data.loadBanList, unbanUpButtonClick, js_data.banUser, "UP_BAN_UPDATE" ],
                replier: [ "#ban_replier_page", js_data.loadReplyBanList, unbanReplierButtonClick, js_data.banReplier, "REPLY_BAN_UPDATE" ],
                keyword: [ "#ban_keyword_page", js_data.loadKeywords, unbanKeywordButtonClick, js_data.banKeyword, "KEYWORD_BAN_UPDATE" ],
                realm: [ "#ban_realm_page", js_data.loadRealmBanList, unbanRealmButtonClick, js_data.banRealm, "REALM_BAN_UPDATE" ]
            };
            let opt = dictBan[listName];
            opt[1]((list => {
                let page = dom.querySelector(opt[0]);
                let button = page.querySelector(".ban-item-submit");
                button.addEventListener("click", (() => {
                    let input = page.querySelector(".ban-title-input");
                    let text = input.value;
                    if (text.length === 0) {
                        input.focus();
                        return;
                    }
                    input.value = "";
                    opt[3](text, (() => {
                        js_event.emit(opt[4], null);
                    }));
                }));
                if (!list || !list.indexOf) {
                    return;
                }
                let stringOnlyList = list.map((x => typeof x === "string" ? x : x.item));
                let container = page.querySelector(".banned-items");
                container.innerHTML = "";
                let currentList = [];
                let unsafeWindow = window;
                let doc = unsafeWindow.document;
                list.forEach((i => {
                    if (currentList.indexOf(i) < 0) {
                        let node = doc.createElement("div");
                        node.classList.add("banned-item");
                        let n1 = doc.createElement("span");
                        n1.classList.add("banned-title");
                        if (typeof i === "string") {
                            n1.innerText = i;
                            let n2 = doc.createElement("button");
                            n2.innerText = "×";
                            node.append(...[ n1, n2 ]);
                            n2.addEventListener("click", (e => {
                                opt[2](i);
                            }));
                        } else if (typeof i === "object") {
                            n1.innerText = i.item;
                            let n2 = doc.createElement("button");
                            n2.innerText = "排行榜";
                            n2.classList.add("ranked-item");
                            node.append(...[ n1, n2 ]);
                        }
                        container.append(node);
                    }
                }));
            }), false);
        }
        function updateBannedUpList(dom) {
            if (typeof dom === "undefined") {
                let doc = setting_ui_unsafeWindow.document;
                dom = doc.body.querySelector("#helperUI");
            }
            showBannedList(dom, "up");
        }
        function updateBannedReplierList(dom) {
            if (typeof dom === "undefined") {
                let doc = setting_ui_unsafeWindow.document;
                dom = doc.body.querySelector("#helperUI");
            }
            showBannedList(dom, "replier");
        }
        function updateBannedKeywordsList(dom) {
            if (typeof dom === "undefined") {
                let doc = setting_ui_unsafeWindow.document;
                dom = doc.body.querySelector("#helperUI");
            }
            showBannedList(dom, "keyword");
        }
        function updateBannedRealmsList(dom) {
            if (typeof dom === "undefined") {
                let doc = setting_ui_unsafeWindow.document;
                dom = doc.body.querySelector("#helperUI");
            }
            showBannedList(dom, "realm");
        }
        function unbanUpButtonClick(username) {
            js_data.unbanUser(username, (banlist => {
                js_event.emit("UP_BAN_UPDATE", banlist);
            }));
        }
        function unbanReplierButtonClick(username) {
            js_data.unbanReplier(username, (banlist => {
                js_event.emit("REPLY_BAN_UPDATE", banlist);
            }));
        }
        function unbanKeywordButtonClick(keyword) {
            js_data.unbanKeyword(keyword, (banlist => {
                js_event.emit("KEYWORD_BAN_UPDATE", banlist);
            }));
        }
        function unbanRealmButtonClick(realm) {
            js_data.unbanRealm(realm, (banlist => {
                js_event.emit("REALM_BAN_UPDATE", banlist);
            }));
        }
        function _changeSetting(key, val, callback) {
            js_data.loadGeneralSetting((s => {
                s[key] = val;
                js_data.saveGeneralSetting(s, callback);
            }));
        }
        function bindGeneralSettingEvents(dom) {
            dom.querySelectorAll(".cc-container").forEach((dom => {
                let t = dom;
                let key = t.getAttribute("data-id");
                dom.addEventListener("change", (e => {
                    let checked = t.querySelector("input").checked;
                    _changeSetting(key, checked, (() => {
                        js_event.emit("SETTING_CHANGE_" + key, checked);
                    }));
                }));
                js_data.loadGeneralSetting((setting => {
                    let input = dom.querySelector("input");
                    input.checked = setting[key] ? "checked" : "";
                }));
            }));
        }
        function initButtons(dom) {
            let dict = {
                bannedAuthours: [ "#ban_up_page" ],
                bannedRepliers: [ "#ban_replier_page" ],
                bannedKeywords: [ "#ban_keyword_page" ],
                bannedRealms: [ "#ban_realm_page" ],
                preloadSetting: [ "#preload_page" ],
                cloudsync: [ "#cloudsync_page" ],
                commentRecovery: [ "#recovery_page" ],
                generalSetting: [ "#general_page" ],
                sharedRankList: [ "#sharedRankList_page" ],
                aboutme: [ "#about_page" ]
            };
            let allPageButtons = [];
            Object.keys(dict).forEach((id => {
                allPageButtons.push(id);
                dom.querySelector("#" + id).addEventListener("click", (() => {
                    let pageid = dict[id][0];
                    dom.querySelector(pageid).classList.remove("inactive-page");
                }));
            }));
            for (let key in dict) {
                let id = dict[key][0];
                dom.querySelector(id).querySelector("a.go-back").addEventListener("click", (() => {
                    dom.querySelector(id).classList.add("inactive-page");
                }));
            }
            let hidehint = dom.querySelector("#hide_hint");
            hidehint.addEventListener("click", (() => {
                uiMain.classList.add("ui-hidden");
            }));
        }
        function refreshSyncTime(dom) {
            function timeConverter(UNIX_timestamp) {
                let a = new Date(UNIX_timestamp * 1e3);
                let months = [ "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月" ];
                let year = a.getFullYear();
                let month = months[a.getMonth()];
                let date = a.getDate();
                let hour = a.getHours();
                let min = a.getMinutes();
                let sec = a.getSeconds();
                let time = year + "年" + month + date + "日 " + hour + ":" + min + ":" + sec;
                return time;
            }
            js_data.getUpdateTime((time => {
                dom.querySelector(".sync-time").innerText = "上次同步时间：" + timeConverter(time);
            }));
        }
        function _refreshCommentCachePage(dom) {
            js_data.getAllCacheIndex((ids => {
                let count = ids.length;
                dom.querySelector(".cache-info").innerText = `已缓存${count}篇投稿评论`;
            }));
        }
        function bindEvents(dom) {
            js_event.on("UP_BAN_UPDATE", (() => {
                updateBannedUpList();
            }));
            js_event.on("REPLY_BAN_UPDATE", (() => {
                updateBannedReplierList();
            }));
            js_event.on("KEYWORD_BAN_UPDATE", (() => {
                updateBannedKeywordsList();
            }));
            js_event.on("REALM_BAN_UPDATE", (() => {
                updateBannedRealmsList();
            }));
            js_event.on("SYNC_TIME_UPDATE", (() => {
                refreshSyncTime(dom);
            }));
            js_event.on("COMMENT_CACHE_UPDATE", (() => {
                _refreshCommentCachePage(dom);
            }));
            dom.querySelector("#syncNow").addEventListener("click", (() => {
                js_event.emit("SYNC_NOW", null);
            }));
            dom.querySelector("#clearPreloadCache").addEventListener("click", (() => {
                util.dbHelper.clearAll().then((count => {
                    document.querySelector("#clearCacheInfo").innerText = `已清除${count}个缓存页面。`;
                }));
            }));
            dom.querySelector("#preloadSetting").addEventListener("click", (() => {
                util.dbHelper.count().then((count => {
                    document.querySelector("#clearCacheInfo").innerText = `现在已经有${count}个缓存页面了。`;
                }));
            }));
            let cacheDelBtn = dom.querySelector("#delete_cache");
            cacheDelBtn.addEventListener("click", (() => {
                cacheDelBtn.disabled = true;
                commentRecovery.deleteAllCache((() => {
                    setTimeout((() => {
                        cacheDelBtn.disabled = false;
                    }), 1e3);
                }));
            }));
            let lookupCacheBtn = dom.querySelector("#lookup_cache");
            lookupCacheBtn.addEventListener("click", (() => {
                let username = dom.querySelector(".lookup-cache-input").value;
                js_event.emit("LOOKUP", username);
            }));
            js_event.on("SETTING_CHANGE_useRealmBlock", (val => {
                updateBannedRealmsList();
            }));
            js_event.on("SETTING_CHANGE_useBannedUpRankList", (val => {
                updateBannedUpList();
            }));
            js_event.on("SETTING_CHANGE_useBannedKeywordsList", (val => {
                updateBannedKeywordsList();
            }));
            js_event.on("SETTING_CHANGE_useBannedReplierList", (val => {
                updateBannedReplierList();
            }));
            window.addEventListener("resize", (() => {
                function scrollbarVisible(element) {
                    return element.scrollHeight > element.clientHeight;
                }
                let root = window.document.querySelector("html");
                if (scrollbarVisible(root)) {
                    root.style.overflowY = "scroll";
                }
            }));
            let copy_uprank_btn = dom.querySelector("#copy_uprank");
            let copy_keywordrank_btn = dom.querySelector("#copy_keywordrank");
            let copy_replierrank_btn = dom.querySelector("#copy_replierrank");
            copy_uprank_btn.addEventListener("click", (() => {
                js_data.copyRankBanLish((() => {
                    js_event.emit("UP_BAN_UPDATE");
                }));
            }));
            copy_keywordrank_btn.addEventListener("click", (() => {
                js_data.copyRankKeywords((() => {
                    js_event.emit("KEYWORD_BAN_UPDATE");
                }));
            }));
            copy_replierrank_btn.addEventListener("click", (() => {
                js_data.copyRankReplyBanList((() => {
                    js_event.emit("REPLY_BAN_UPDATE");
                }));
            }));
        }
        function initAcGirl(dom) {
            let girl = dom.querySelector(".ac-girl");
            girl.classList.remove("ac-girl-hide");
            let ui = window.document.body.querySelector("#helperUI");
            let canvas = document.createElement("canvas");
            let rect = girl.getBoundingClientRect();
            let ctx = canvas.getContext("2d");
            canvas.height = rect.height;
            canvas.width = rect.width;
            girl.append(canvas);
            let image = new Image;
            image.onload = function() {
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            };
            image.src = acgirl_image(true);
            enableDragging(canvas, ui, false);
            let uiMain = dom.querySelector(".helper-main");
            canvas.addEventListener("click", (() => {
                if (!uiMain.classList.contains("ui-hidden")) {
                    uiMain.classList.add("ui-hidden");
                } else {
                    uiMain.classList.remove("ui-hidden");
                }
            }));
        }
        function setting_ui_version(dom) {
            dom.querySelector(".plugin-version").innerText = "插件版本：" + js_data.version;
            dom.querySelector(".plugin-downloader-version").innerText = "下载器版本：" + GM_info.script.version;
        }
        function cacheInfo(dom) {
            _refreshCommentCachePage(dom);
        }
        function setting_ui_init(dom) {
            js_data.loadUIPosition((pos => {
                dom.style.top = pos.y + "px";
                dom.style.left = pos.x + "px";
            }));
            log_log("加载设置页面");
            bindEvents(dom);
            log_log("初始化事件");
            bindGeneralSettingEvents(dom);
            updateBannedUpList(dom);
            updateBannedReplierList(dom);
            updateBannedKeywordsList(dom);
            updateBannedRealmsList(dom);
            log_log("载入屏蔽列表");
            initButtons(dom);
            setting_ui_version(dom);
            cacheInfo(dom);
            log_log("初始化完成");
            initAcGirl(dom);
            log_log("AC娘载入成功");
        }
        const setting_ui = {
            state: "MENU",
            showSettingUI() {
                let doc = window.document;
                doc.body.insertAdjacentHTML("beforeend", mainUI);
                let uiDom = doc.body.querySelector("#helperUI");
                setting_ui_init(uiDom);
            }
        };

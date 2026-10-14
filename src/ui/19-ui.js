        function showCommentTags(content) {}
        function _banReplyUser(username, uid) {
            if (uid) {
                js_data.banReplyUid(uid, username);
            }
            js_data.banReplier(username, (banlist => {
                js_event.emit("REPLY_BAN_UPDATE", null);
            }));
        }
        function attachBanCommentButtonNew(c, onclick) {
            let b = ui_unsafeWindow.document.createElement("span");
            b.innerText = "屏蔽";
            b.classList.add("area-comment-block");
            b.addEventListener("click", (() => {
                onclick(c);
            }));
            c.banButtonAnchor.insertAdjacentElement("afterend", b);
        }
        function attachBanCommentButtonOld(c, onclick) {
            let b = ui_unsafeWindow.document.createElement("a");
            b.innerText = "屏蔽";
            b.addEventListener("click", (() => {
                onclick(c);
            }));
            c.banButtonAnchor.insertAdjacentElement("afterend", b);
        }
        window.banButtonObj = {};
        function createbanButton() {
            log_log("加载屏蔽按钮");
            let doc = window.document;
            let buttonDiv = doc.createElement("div");
            buttonDiv.classList.add("filter-button");
            doc.body.appendChild(buttonDiv);
            buttonDiv.style.visibility = "hidden";
            buttonDiv.addEventListener("click", (e => {
                let c = banButtonObj.activeData;
                let u = c.username;
                if (c.uid) {
                    js_data.banUid(c.uid, u);
                }
                js_data.banUser(u, (list => {
                    js_event.emit("UP_BAN_UPDATE", null);
                }));
            }));
            window.banButtonObj = {
                dom: buttonDiv,
                activeDom: null,
                activeData: null
            };
            let hideBanButton = () => {
                banButtonObj.dom.style.visibility = "hidden";
                banButtonObj.activeDom = null;
                banButtonObj.activeData = null;
                banButtonObj.active = false;
            };
            doc.addEventListener("pointermove", (e => {
                if (banButtonObj.activeDom !== null && banButtonObj.active) {
                    let rect = banButtonObj.activeDom.getBoundingClientRect();
                    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
                        hideBanButton();
                    }
                }
            }));
            doc.addEventListener("scroll", (e => {
                hideBanButton();
            }));
            log_log("屏蔽按钮植入完成");
        }
        function injectStyle() {
            let doc = ui_unsafeWindow.document;
            let str = "<style>" + style.Z[0][1] + "</style>";
            doc.head.insertAdjacentHTML("beforeend", str);
        }
        function loadHomeUI() {
            log_log("载入主要UI");
            createbanButton();
            setting_ui.showSettingUI();
        }
        function loadArticleUI() {
            log_log("载入投稿页UI");
            contentPageUI.loadUI();
            setting_ui.showSettingUI();
        }
        function ui_bindEvents() {
            js_event.on("FILTER_COMMENTS", (comments => {
                refreshUserComments(comments);
            }));
            js_event.on("FILTER_PAGE_CONTENTS", (contents => {
                refreshPageItems(contents);
            }));
            js_event.on("SHOW_COMMENT_TAGS", (contents => {
                showCommentTags(contents);
            }));
            js_event.on("SETTING_CHANGE_showMouseover", (val => {
                __webpack_require__.g["showMouseover"] = val;
                js_event.emit("UP_BAN_UPDATE", null);
            }));
            setTimeout((() => {
                ui_unsafeWindow.document.addEventListener("visibilitychange", (() => {}));
            }));
        }
        function ui_init() {
            js_data.loadGeneralSetting((setting => {
                __webpack_require__.g["showMouseover"] = setting.showMouseover;
            }));
        }
        const ui = {
            loadUI(pageType) {
                log_log("UI初始化");
                ui_init();
                log_log("UI事件绑定中");
                ui_bindEvents();
                log_log("CSS加载中");
                injectStyle();
                log_log("页面类型：" + pageType);
                if (pageType === "HOME" || pageType === "VIDEO_HOME" || pageType === "ARTICLE_HOME") {
                    loadHomeUI();
                } else if (pageType === "VIDEO" || pageType === "ARTICLE") {
                    loadArticleUI();
                }
            },
            attachBanButton(dom) {
                let banButton = banButtonObj;
                dom.addEventListener("pointermove", (e => {
                    js_data.loadGeneralSetting((setting => {
                        if (setting.showBanButton) {
                            if (banButton.activeDom !== dom && !banButton.active) {
                                if (dom["contentData"]["hidden"]) return;
                                banButton.activeDom = dom;
                                let rect = dom.getBoundingClientRect();
                                banButton.dom.style.left = rect.right - 20 + "px";
                                banButton.dom.style.top = rect.top + "px";
                                banButton.dom.style.visibility = "visible";
                                banButton.activeData = dom["contentData"];
                                banButton.active = true;
                            }
                        }
                    }));
                }));
            },
            attachBanCommentButton(c) {
                let type = util.getCommentType();
                if (type === "NEW") {
                    attachBanCommentButtonNew(c, (() => {
                        _banReplyUser(c.username, c.uid);
                    }));
                } else {
                    attachBanCommentButtonOld(c, (() => {
                        _banReplyUser(c.username, c.uid);
                    }));
                }
            }
        };

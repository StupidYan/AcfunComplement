        var subUI_code = '<div class="sub-ui-wrap"> <div class="sub-ui-inner sub-ui-normal"> <div class="sub-ui-text"> 正 常 </div> <div id="banUp" class="sub-ui-button sub-ui-text smooth"> </div> <div id="unbanUp" class="sub-ui-button sub-ui-text remove smooth"> </div> </div> </div>';
        const subUI = subUI_code;
        let contentPageUI_unsafeWindow = window;
        function contentPageUI_bindEvents() {
            js_event.on("UP_BAN_UPDATE", (() => {
                refreshUI();
            }));
            let doc = contentPageUI_unsafeWindow.document;
            let innerWrap = doc.querySelector(".sub-ui-inner");
            let banbutton = innerWrap.querySelector("#banUp");
            let unbanbutton = innerWrap.querySelector("#unbanUp");
            banbutton.addEventListener("click", (() => {
                let uid = _getUpUid(doc);
                if (uid) {
                    js_data.banUid(uid, _getUsername(doc));
                }
                js_data.banUser(_getUsername(doc));
                js_event.emit("UP_BAN_UPDATE", null);
            }));
            unbanbutton.addEventListener("click", (() => {
                let uid = _getUpUid(doc);
                if (uid) {
                    js_data.unbanUid(uid);
                }
                js_data.unbanUser(_getUsername(doc));
                js_event.emit("UP_BAN_UPDATE", null);
            }));
            js_event.on("SETTING_CHANGE_showBanStatusTag", (show => {
                if (show) {
                    innerWrap.classList.remove("hide");
                } else {
                    innerWrap.classList.add("hide");
                }
            }));
            js_data.loadGeneralSetting((setting => {
                let show = setting.showBanStatusTag;
                if (show) {
                    innerWrap.classList.remove("hide");
                } else {
                    innerWrap.classList.add("hide");
                }
            }));
        }
        function showBannedUI() {
            let doc = contentPageUI_unsafeWindow.document;
            let innerWrap = doc.querySelector(".sub-ui-inner");
            innerWrap.classList.remove("sub-ui-normal");
            innerWrap.classList.add("sub-ui-banned");
            let text = innerWrap.querySelector(".sub-ui-text");
            text.innerText = "已屏蔽";
            let banbutton = innerWrap.querySelector("#banUp");
            let unbanbutton = innerWrap.querySelector("#unbanUp");
            banbutton.classList.add("remove");
            unbanbutton.classList.remove("remove");
        }
        function showNormalUI() {
            let doc = contentPageUI_unsafeWindow.document;
            let innerWrap = doc.querySelector(".sub-ui-inner");
            innerWrap.classList.add("sub-ui-normal");
            innerWrap.classList.remove("sub-ui-banned");
            let text = innerWrap.querySelector(".sub-ui-text");
            text.innerText = "正  常";
            let banbutton = innerWrap.querySelector("#banUp");
            let unbanbutton = innerWrap.querySelector("#unbanUp");
            banbutton.classList.remove("remove");
            unbanbutton.classList.add("remove");
        }
        function refreshUI() {
            let doc = contentPageUI_unsafeWindow.document;
            let username = _getUsername(doc);
            js_data.loadBanList((list => {
                js_data.loadUpUidList((uidlist => {
                    let uid = _getUpUid(doc);
                    if (list.indexOf(username) >= 0 || uid && uidlist.indexOf(uid) >= 0) {
                        showBannedUI();
                    } else {
                        showNormalUI();
                    }
                }));
            }));
        }
        function _getUsername(doc) {
            let updom;
            let type = getPageType();
            if (type === "VIDEO") {
                updom = doc.querySelector(".up-info .up-name");
            } else {
                updom = doc.querySelector(".up-name a");
            }
            return updom.innerText;
        }
        function _getUpUid(doc) {
            let type = getPageType();
            let updom;
            if (type === "VIDEO") {
                updom = doc.querySelector(".up-info .up-name a[href*='/u/']");
            } else {
                updom = doc.querySelector(".up-name a[href*='/u/']");
            }
            if (updom === null) return null;
            let m = /\/u\/(\d+)/.exec(updom.getAttribute("href"));
            return m === null ? null : m[1];
        }
        function contentPageUI_loadUI() {
            let doc = contentPageUI_unsafeWindow.document;
            doc.body.insertAdjacentHTML("beforeend", subUI);
            let vid = doc.querySelector(".container-video");
            if (vid) vid.classList.add("on-top");
        }
        const contentPageUI = {
            loadUI() {
                contentPageUI_loadUI();
                contentPageUI_bindEvents();
            }
        };

        let commentUI_unsafeWindow_alt = window;
        var cumulativeOffset = function(element) {
            var top = 0, left = 0;
            do {
                top += element.offsetTop || 0;
                left += element.offsetLeft || 0;
                element = element.offsetParent;
            } while (element);
            return {
                top,
                left
            };
        };
        function _observer() {
            let mutationObserver = new MutationObserver((function(mutations) {
                mutations.forEach((function(mutation) {
                    let target = mutation.target;
                    if (target.tagName === "DIV") {
                        setTimeout((() => {
                            _repositionUI();
                        }), 500);
                    }
                }));
            }));
            mutationObserver.observe(commentUI_unsafeWindow_alt.document, {
                subtree: true,
                childList: true
            });
        }
        function _repositionUI() {
            let doc = commentUI_unsafeWindow_alt.document;
            let main = doc.querySelector("#main");
            if (!main) {
                setTimeout(_repositionUI, 1e3);
                return;
            }
            let commentDIv = main.querySelector(".ac-comment-list");
            if (!commentDIv) return;
            let rect = commentDIv.getBoundingClientRect();
            let offsets = cumulativeOffset(commentDIv);
            let uidom = doc.body.querySelector(".deleted-comments-container");
            uidom.style.top = offsets.top + "px";
            uidom.style.left = offsets.left + rect.width + 30 + "px";
            let height = Math.max(commentDIv.scrollHeight, commentDIv.offsetHeight);
            uidom.style.height = `${height - 100}px`;
        }
        function _hideUnrecovered(uidom) {
            let k = !commentUI_unsafeWindow_alt["hideUnrecovered"];
            commentUI_unsafeWindow_alt["hideUnrecovered"] = k;
            if (k) {
                uidom.querySelectorAll(".deleted-comment").forEach((dom => {
                    if (!dom["data"]) dom.classList.add("remove");
                }));
            } else {
                uidom.querySelectorAll(".deleted-comment").forEach((dom => {
                    dom.classList.remove("remove");
                }));
            }
        }
        function _showUI(cache) {
            let doc = commentUI_unsafeWindow_alt.document;
            let uidom = doc.body.querySelector(".deleted-comments-container");
            commentUI_unsafeWindow_alt["deletedCommentsUI"] = uidom;
            uidom.classList.remove("remove");
            cache.deletedFloors.forEach((df => {
                let itemDom = doc.createElement("DIV");
                itemDom.classList.add("deleted-comment");
                itemDom.insertAdjacentHTML("afterbegin", deletedComment);
                itemDom.querySelector(".comment-floor").innerText = "#" + df;
                itemDom["floor"] = df;
                uidom.querySelector(".deleted-comment-list").appendChild(itemDom);
            }));
            let rec = doc.querySelector(".area.recommendation");
            if (rec) {
                rec.style.maxHeight = "800px";
                rec.style.overflowX = "hidden";
                rec.style.overflowY = "scroll";
            }
            let rec2 = doc.querySelector("#pagelet_newrecommend");
            if (rec2) {
                rec2.style.maxHeight = "500px";
                rec2.style.overflowX = "hidden";
                rec2.style.overflowY = "scroll";
            }
            let fr = doc.querySelector(".content.wp.clearfix.area .fr");
            if (fr) {
                fr.style.maxHeight = "800px";
                fr.style.overflowX = "hidden";
                fr.style.overflowY = "scroll";
            }
            uidom.querySelector(".hide-btn").addEventListener("click", (() => {
                _hideUnrecovered(uidom);
            }));
        }
        function _replaceImage2(content) {
            let sb = /\[img(?:=图片)*\](https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))\[\/img\]/g;
            let ms = [ ...content.matchAll(sb) ];
            let result = content.toString();
            ms.forEach((m => {
                let oldstr = m[0];
                let url = m[1];
                let newstr = `<a href="${url}" target="_blank" ><img src="${url}"></a>`;
                result = result.replaceAll(oldstr, newstr);
            }));
            return result;
        }
        function _replaceEmot(content) {
            let sb1 = /\[emot=acfun,(\d+)\/\]/g;
            let ms = [ ...content.matchAll(sb1) ];
            let result = content.toString();
            ms.forEach((m => {
                let id = m[1];
                let o = commentUI_unsafeWindow_alt.emotDict[id];
                let url = o.emotionImageUrl;
                let imgtag = `<img class="ubb-emotion" src="${url}" />`;
                result = result.replaceAll(m[0], imgtag);
            }));
            return result;
        }
        async function isFloorInnerAC(floorData) {
            let content = floorData.content;
            let sb = /\[img(?:=图片)*\](https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))\[\/img\]/g;
            let ms = [ ...content.matchAll(sb) ];
            if (ms.length < 1) {
                log_log("no image");
                return false;
            }
            let url = ms[0][1];
            log_log("awaiting innver ac", url);
            return await innerACFun.isMaskImage(url);
        }
        async function recoverFloor(floorData) {
            log_log("Recover Floorr", floorData);
            let isInner = await isFloorInnerAC(floorData);
            log_log("isInner", isInner);
            if (isInner) {
                floorData["isInner"] = true;
                floorData.content = "此评论为里区内容，被删除后无法恢复(因为显然有不能存在的理由)...";
            }
            let doc = commentUI_unsafeWindow_alt.document;
            let uidom = doc.body.querySelector(".deleted-comments-container");
            let doms = uidom.querySelectorAll(".deleted-comment");
            log_log("doms =", doms);
            doms.forEach((itemDom => {
                log_log("dom floor", itemDom["floor"], floorData.floor, itemDom["floor"] === floorData.floor);
                if (itemDom["floor"] === floorData.floor) {
                    itemDom["data"] = floorData;
                    let usernameDom = itemDom.querySelector(".comment-username");
                    usernameDom.innerText = floorData.username;
                    usernameDom.classList.remove("remove");
                    let content = _replaceImage2(floorData.content);
                    content = _replaceEmot(content);
                    itemDom.querySelector(".comment-text").innerHTML = content;
                    itemDom.querySelector(".comment-query-state").classList.add("remove");
                    let datetime = new Date(floorData.replyTime);
                    itemDom.querySelector(".comment-time").innerText = datetime.toLocaleString();
                    itemDom.querySelector(".comment-content").classList.remove("remove");
                }
            }));
        }
        function noticeUncached(f) {
            let doc = commentUI_unsafeWindow_alt.document;
            let uidom = doc.body.querySelector(".deleted-comments-container");
            let doms = uidom.querySelectorAll(".deleted-comment");
            doms.forEach((itemDom => {
                if (itemDom["floor"] === f) {
                    itemDom.querySelector(".comment-query-state").innerText = "服务器未收录";
                }
            }));
        }
        function enable(val) {
            let doc = commentUI_unsafeWindow_alt.document;
            let uidom = doc.body.querySelector(".deleted-comments-container");
            if (val) {
                uidom.classList.remove("remove-2");
            } else {
                uidom.classList.add("remove-2");
            }
        }
        function showUDP(result) {
            let doc = commentUI_unsafeWindow_alt.document;
            let dom = doc.body.querySelector(".udp-container");
            dom.classList.remove("udp-hidden");
            let titledom = dom.querySelector(".udp-title");
            let inner = dom.querySelector(".udp-inner");
            inner.innerHTML = "";
            let closebtn = dom.querySelector(".udp-close");
            closebtn.onclick = () => {
                dom.classList.add("udp-hidden");
            };
            titledom.innerHTML = `已收录[${result.username.substring(0, 16)}]被删除评论 <strong>${result.list.length}<b>条`;
            console.log(result);
            result.list.forEach((item => {
                let d = item.v;
                let ac = item._id;
                let content = _replaceImage2(d.content);
                content = _replaceEmot(content);
                let datetime = new Date(d.replyTime);
                datetime = datetime.toLocaleString();
                let div = doc.createElement("div");
                div.classList.add("udp-item");
                div.innerHTML = `\n<div class="udp-item-content">${content}</div>\n<div class="udp-item-info">\n    <div class="udp-time">${datetime}</div>\n    <a href="/v/ac${ac}"><div class="udp-av">ac${ac}</div></a>\n</div>`;
                inner.append(div);
            }));
        }
        function _bindEvents() {
            js_event.on("SHOW_DELETED_COMMENT_UI", (cache => {
                _showUI(cache);
            }));
            js_event.on("FLOOR_RECOVER", (floorData => {
                recoverFloor(floorData);
            }));
            js_event.on("NO_SERVER_CACHE", (floor => {
                noticeUncached(floor);
            }));
            js_event.on("SETTING_CHANGE_showDeletedComment", (val => {
                enable(val);
            }));
            js_event.on("LOOKUP", (username => {
                let w = unsafeWindow;
                w.A.emit("global::success", `正在查询[${username}]的被删评论……`);
                commentRecovery.getUserDeletedPost(username, (result => {
                    js_event.emit("LOOKUP_RESULT", result);
                    w.A.emit("global::success", `完成！`);
                }));
            }));
            js_event.on("LOOKUP_RESULT", (result => {
                showUDP(result);
            }));
        }
        function _loadEmots() {
            let s = unsafeWindow.localStorage.getItem("emoticonList");
            if (!s) {
                commentUI_unsafeWindow_alt["emotDict"] = {};
                return;
            }
            let list = JSON.parse(s);
            try {
                let dict = {};
                list.forEach((o => {
                    dict[o.emotionId] = o;
                }));
                commentUI_unsafeWindow_alt["emotDict"] = dict;
            } catch (e) {
                commentUI_unsafeWindow_alt["emotDict"] = {};
            }
        }
        function _loadUDPUI() {
            let doc = commentUI_unsafeWindow_alt.document;
            doc.body.insertAdjacentHTML("beforeend", udp);
        }
        function _loadUI() {
            let doc = commentUI_unsafeWindow_alt.document;
            doc.body.insertAdjacentHTML("beforeend", recoveryUI);
            commentUI_unsafeWindow_alt.onresize = _repositionUI;
            _repositionUI();
            _observer();
            js_data.loadGeneralSetting((setting => {
                enable(setting.showDeletedComment);
            }));
        }
        const commentUI = {
            init() {
                _loadEmots();
                _loadUI();
                _loadUDPUI();
                _bindEvents();
            }
        };

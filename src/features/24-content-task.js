        let contentTask_unsafeWindow = window;
        function _getCommentsOldVer(doc) {
            let result = [];
            let items = doc.querySelectorAll(".fc-comment-item");
            items.forEach((i => {
                let nameAnchor = i.querySelector("a.name");
                let username = nameAnchor.innerText;
                let banButtonAnchor = i.querySelector("a.btn-quote");
                if (banButtonAnchor === null) {
                    console.log();
                    return;
                }
                let count = banButtonAnchor.parentNode.children.length;
                banButtonAnchor = banButtonAnchor.parentNode.children[count - 1];
                if (banButtonAnchor !== null) {
                    result.push({
                        username,
                        uid: _extractUid(i),
                        nameAnchor: nameAnchor.parentNode,
                        banButtonAnchor,
                        dom: i
                    });
                }
            }));
            return result;
        }
        function _getCommentsNewVer(doc) {
            let result = [];
            let items = doc.querySelectorAll(".area-comment-first");
            items.forEach((i => {
                let nameAnchor = i.querySelector("a.name");
                let username = nameAnchor.innerText;
                let banButtonAnchor = i.querySelector("a.area-comment-reply");
                if (banButtonAnchor !== null) {
                    result.push({
                        username,
                        uid: _extractUid(i),
                        nameAnchor,
                        banButtonAnchor,
                        dom: i
                    });
                }
            }));
            return result;
        }
        function _getComments(doc) {
            let comments = util.getCommentType() === "NEW" ? _getCommentsNewVer(doc) : _getCommentsOldVer(doc);
            return comments;
        }
        async function _innerSingleTask(c, urls) {
            let commentContent = c.dom.querySelector(".comment-content");
            if (!commentContent) {
                commentContent = c.dom.querySelector(".area-comment-des-content");
            }
            commentContent.innerHTML = "";
            let loading = document.createElement("div");
            loading.innerText = "里区内容加载中...";
            commentContent.appendChild(loading);
            let {info, data} = await innerACFun.extractFileFromImages(urls);
            let wrapper = document.createElement("div");
            wrapper.classList.add("inner-content-wrapper");
            wrapper.innerHTML = `<p><b>里区内容</b><span style="margin-left: 3px; color: #9a9a9a">仅屏蔽插件用户可见:</span></p>`;
            wrapper.style.border = "1px solid #ccc";
            wrapper.style.padding = "10px";
            let footer = document.createElement("p");
            footer.style.fontSize = "10px";
            footer.style.color = "#c89393";
            footer.innerText = "为了保护发布者的安全和你的合法权益，如果这是违规内容，请点击1.举报删帖;2.找UP主删帖。被删除的里区内容不会被插件恢复。\n插件作者不负责任何因使用插件而引起的法律问题。";
            let contentType = info.type;
            if (contentType.includes("image")) {
                let a = document.createElement("a");
                let url = URL.createObjectURL(new Blob([ data ], {
                    type: info.type
                }));
                a.href = url;
                a.target = "_blank";
                let img = document.createElement("img");
                a.appendChild(img);
                img.onload = () => {
                    commentContent.removeChild(loading);
                    wrapper.appendChild(a);
                    wrapper.appendChild(footer);
                };
                img.src = url;
            } else if (contentType.includes("video")) {
                let url = URL.createObjectURL(new Blob([ data ], {
                    type: info.type
                }));
                let video = document.createElement("video");
                video.controls = true;
                video.oncanplay = () => {
                    commentContent.removeChild(loading);
                    wrapper.appendChild(video);
                    wrapper.appendChild(footer);
                };
                video.src = url;
                video.width = 320;
                video.height = 240;
                video.style.backgroundColor = "#000";
            } else {
                let url = URL.createObjectURL(new Blob([ data ], {
                    type: info.type
                }));
                let a = document.createElement("a");
                a.href = url;
                a.download = info.name;
                a.innerText = "下载:" + info.name;
                commentContent.removeChild(loading);
                wrapper.appendChild(a);
                wrapper.appendChild(footer);
            }
            commentContent.appendChild(wrapper);
            return info;
        }
        async function innerContentTask(comments) {
            let todo = [];
            for (let i = 0; i < comments.length; i++) {
                let c = comments[i];
                if (c.dom.hasOwnProperty("commentData")) {
                    let imgs = c.dom.querySelectorAll("img[alt='点击以浏览图像']");
                    if (imgs.length === 0) continue;
                    let firstImg = imgs[0];
                    let src = firstImg.src;
                    let check = await innerACFun.isMaskImage(src);
                    if (!check) continue;
                    let srcs = [];
                    imgs.forEach((img => {
                        srcs.push(img.src);
                    }));
                    todo.push({
                        c,
                        list: srcs
                    });
                }
            }
            for (let i = 0; i < todo.length; i++) {
                let c = todo[i].c;
                let urls = todo[i].list;
                _innerSingleTask(c, urls).then((data => {}));
            }
        }
        function contentTask() {
            function bindEvents() {
                js_event.on("TAGS_UPDATE", (username => {
                    let cs = getCommentsData(contentTask_unsafeWindow.document);
                    cs = cs.filter((x => x.username === username));
                    js_event.emit("REFRESH_TAGS", cs);
                }));
                js_event.on("REPLY_BAN_UPDATE", (() => {
                    runCommentTask();
                }));
            }
            function getCommentsData(target) {
                return _getComments(target);
            }
            function attachDataUI(cs) {
                cs.forEach((c => {
                    if (!c.dom.hasOwnProperty("commentData")) {
                        ui.attachBanCommentButton(c);
                        c.dom["commentData"] = c;
                    }
                }));
            }
            function runCommentTask() {
                let comments = getCommentsData(contentTask_unsafeWindow.document);
                js_event.emit("FILTER_COMMENTS", comments);
            }
            function lauchObserver() {
                log_log("加载评论Observer");
                let mutationObserver = new MutationObserver((function(mutations) {
                    mutations.forEach((function(mutation) {
                        if (mutation.type === "childList") {
                            let targets = mutation.addedNodes;
                            targets.forEach((target => {
                                if (target.tagName === "DIV" && (target.classList.contains("fc-comment-list") || target.classList.contains("ac-comment-hot-list") || target.classList.contains("ac-comment-root-list") || target.hasChildNodes() && typeof target.firstChild.classList !== "undefined" && (target.firstChild.classList.contains("area-comment-top") || target.firstChild.classList.contains("area-comment-sec")) || typeof target.querySelector === "function" && target.querySelector(".area-comment-first, .fc-comment-item") !== null)) {
                                    let cs = getCommentsData(target);
                                    js_event.emit("SHOW_COMMENT_TAGS", cs);
                                    attachDataUI(cs);
                                    js_event.emit("FILTER_COMMENTS", cs);
                                    setTimeout((() => {
                                        innerContentTask(cs);
                                    }), 0);
                                }
                            }));
                        }
                    }));
                }));
                mutationObserver.observe(contentTask_unsafeWindow.document, {
                    subtree: true,
                    childList: true
                });
            }
            setTimeout((() => {
                bindEvents();
            }));
            setTimeout((() => {
                lauchObserver();
            }));
            setTimeout((() => {
                tagging.init();
            }));
            setTimeout((() => {
                commentRecovery.init();
            }));
            setTimeout((() => {
                commentImagefy.init();
            }));
            setTimeout((() => {
                innerACFun.init();
            }));
        }
        function taskHOME(pagetype) {
            log_log("载入主要页面模块");
            homeTask(pagetype);
        }
        function taskCONTENT() {
            log_log("载入投稿页模块");
            contentTask();
        }
        function executeTask(pageType) {
            log_log("执行任务");
            if (pageType === "HOME" || pageType === "VIDEO_HOME" || pageType === "ARTICLE_HOME") {
                taskHOME(pageType);
            } else if (pageType === "VIDEO" || pageType === "ARTICLE") {
                taskCONTENT();
            }
        }

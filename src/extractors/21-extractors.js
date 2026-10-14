        function getMonkeyVideo(doc) {
            let list = doc.querySelectorAll(".monkey-video");
            let result = [];
            list.forEach((i => {
                let title = i.getAttribute("data-title");
                let t = i.querySelector(".monkey-up-name");
                let username = t.innerText.substring(3).trim();
                result.push({
                    title,
                    username,
                    dom: i,
                    type: "VIDEO"
                });
            }));
            return result;
        }
        function getRecommendedVideo(doc) {
            let list = doc.querySelectorAll(".recommend-video");
            let result = [];
            list.forEach((i => {
                let title = i.querySelector(".video-title").innerText;
                let t = i.querySelector(".normal-mask-title");
                let t2 = t.nextElementSibling;
                let username = t2.querySelector("span.text-overflow").innerText.substring(3).trim();
                result.push({
                    title,
                    username,
                    dom: i,
                    type: "VIDEO"
                });
            }));
            return result;
        }
        function getBananaVideo(doc) {
            let list = doc.querySelectorAll(".banana-video");
            let result = [];
            list.forEach((i => {
                let t = i.querySelector(".banana-video-title");
                let title = t.innerText;
                let t2 = i.querySelector(".banana-up-name");
                let username = t2.getAttribute("title");
                result.push({
                    title,
                    username,
                    dom: i,
                    type: "VIDEO"
                });
            }));
            return result;
        }
        function getLiveVideo(doc) {
            let list = doc.querySelectorAll(".live-video");
            let result = [];
            list.forEach((i => {
                let title = i.getAttribute("data-title");
                let t = i.querySelector(".live-video-up-name");
                let username = t.innerText.substring(3).trim();
                result.push({
                    title,
                    username,
                    dom: i,
                    type: "VIDEO"
                });
            }));
            return result;
        }
        function getNormalVideo(doc) {
            let list = doc.querySelectorAll(".normal-video");
            let result = [];
            list.forEach((i => {
                let t = i.querySelector(".normal-video-title");
                let title = t.innerText;
                let str = t.getAttribute("title");
                let regex = /UP:(.+)/;
                let username = regex.exec(str)[1].trim();
                result.push({
                    title,
                    username,
                    dom: i,
                    type: "VIDEO"
                });
            }));
            return result;
        }
        function getRankedVideo(doc) {
            let list = doc.querySelectorAll(".list-content-videos .log-item");
            let result = [];
            list.forEach((i => {
                let t = i.querySelector(".video-title");
                let title = t.innerText;
                let str = t.getAttribute("title");
                let regex = /UP:(.+)/;
                let username = regex.exec(str)[1].trim();
                result.push({
                    title,
                    username,
                    dom: i,
                    type: "VIDEO"
                });
            }));
            return result;
        }
        function _extractUid(dom) {
            let a = dom.querySelector('a[href*="/u/"]');
            if (a === null) return null;
            let m = /\/u\/(\d+)/.exec(a.getAttribute("href"));
            return m === null ? null : m[1];
        }
        function getSliderVideos(doc) {
            let list = doc.querySelectorAll(".slider-small-item");
            let result = [];
            list.forEach((i => {
                let t = i.querySelector(".slider-title").firstChild;
                let title = t.innerText;
                let t2 = t.nextElementSibling.firstChild;
                let username = t2.innerText.substring(3).trim();
                result.push({
                    title,
                    username,
                    uid: _extractUid(i),
                    dom: i,
                    type: "VIDEO"
                });
            }));
            return result;
        }
        function getVideoHomeItem(doc) {
            let list = doc.querySelectorAll("figure.video-item");
            let result = [];
            list.forEach((i => {
                let t = i.querySelector("a[title]");
                let title = t.innerText;
                let str = t.getAttribute("title");
                let regex = /UP:(.+)/;
                let username = regex.exec(str)[1].trim();
                result.push({
                    title,
                    username,
                    uid: _extractUid(i),
                    dom: i,
                    type: "VIDEO"
                });
            }));
            return result;
        }
        function getVideoHomeItem2(doc) {
            let list = doc.querySelectorAll(".list-content-item");
            let result = [];
            list.forEach((i => {
                let t = i.querySelector(".list-content-title");
                let title = t.innerText;
                let str = t.getAttribute("title");
                let t2 = i.querySelector(".list-content-uplink");
                let username = t2.innerText.substring(3).trim();
                result.push({
                    title,
                    username,
                    uid: _extractUid(i),
                    dom: i,
                    type: "VIDEO"
                });
            }));
            return result;
        }
        function getVideoHomeRankItem(doc) {
            let list = doc.querySelectorAll(".rank-list li");
            let result = [];
            list.forEach((i => {
                let t = i.querySelector("b.title a");
                let title = t.innerText;
                let str = t.getAttribute("title");
                let regex = /UP:(.+)/;
                let username = regex.exec(str)[1].trim();
                result.push({
                    title,
                    username,
                    uid: _extractUid(i),
                    dom: i,
                    type: "VIDEO"
                });
            }));
            return result;
        }
        function getHomeArticle(doc) {
            let tab = doc.querySelector(".article-tab");
            if (tab == null) return [];
            let list = tab.querySelectorAll("li[data-atomid]");
            let result = [];
            list.forEach((i => {
                var username, title;
                var t;
                let block = i.querySelector(".main-content-block");
                if (block != null) {
                    t = block.querySelector("p.block-title");
                } else {
                    t = i.querySelector("a.main-content-item");
                }
                title = t.innerText;
                let str = t.getAttribute("title");
                let regex = /UP:(.+)/;
                username = regex.exec(str)[1].trim();
                result.push({
                    title,
                    username,
                    dom: i,
                    type: "ARTICLE"
                });
            }));
            return result;
        }
        function getArticles(doc) {
            let list = doc.querySelectorAll(".article-item");
            console.log("list=", list);
            let result = [];
            list.forEach((i => {
                let t = i.querySelector("a[title]");
                let title = t.innerText;
                let t2 = i.querySelector("span.up a");
                let username = t2.innerText.substring(3).trim();
                result.push({
                    title,
                    username,
                    uid: _extractUid(i),
                    dom: i,
                    type: "ARTICLE"
                });
            }));
            return result;
        }
        function homeTask(pageType) {
            function loadBanList(callback) {
                js_data.loadBanList(callback);
            }
            function loadKeywordList(callback) {
                js_data.loadKeywords(callback);
            }
            function getAllVideoContentInfo(pageType, doc) {
                let homeList = [ getMonkeyVideo, getLiveVideo, getRankedVideo, getRecommendedVideo, getNormalVideo, getHomeArticle, getBananaVideo ];
                let videoHomeList = [ getVideoHomeItem, getVideoHomeItem2, getVideoHomeRankItem, getSliderVideos, getArticles ];
                let articleHomeList = [ getArticles ];
                let tasks = [];
                if (pageType === "HOME") {
                    tasks = homeList;
                } else if (pageType === "VIDEO_HOME") {
                    tasks = videoHomeList;
                } else if (pageType === "ARTICLE_HOME") {
                    tasks = articleHomeList;
                }
                let contentList = [];
                tasks.forEach((f => {
                    let items = f(doc);
                    contentList = contentList.concat(items);
                }));
                return contentList;
            }
            function refreshPageContent(target) {
                if (typeof target === "undefined" || target == null) {
                    target = homeTask_unsafeWindow.document;
                }
                let contents = getAllVideoContentInfo(pageType, target);
                attachInfo(contents);
                js_event.emit("FILTER_PAGE_CONTENTS", contents);
            }
            function lauchObserver() {
                let mutationObserver = new MutationObserver((function(mutations) {
                    mutations.forEach((function(mutation) {
                        let target = mutation.target;
                        if (target.tagName === "DIV") {
                            setTimeout((() => {
                                refreshPageContent(target);
                            }), 500);
                        }
                    }));
                }));
                mutationObserver.observe(homeTask_unsafeWindow.document, {
                    subtree: true,
                    childList: true
                });
            }
            function attachInfo(contents) {
                contents.forEach((c => {
                    if (!("contentData" in c.dom)) {
                        c.dom["contentData"] = c;
                        ui.attachBanButton(c.dom);
                    }
                }));
            }
            function bindEvents() {
                js_event.on("UP_BAN_UPDATE", (() => {
                    refreshPageContent();
                }));
                js_event.on("KEYWORD_BAN_UPDATE", (() => {
                    refreshPageContent();
                }));
            }
            lauchObserver();
            bindEvents();
            homepageRepair();
            setTimeout(refreshPageContent, 2e3);
        }

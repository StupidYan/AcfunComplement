        function _getUDID() {
            let str = unsafeWindow.document.cookie;
            let regex = /_did=(\w+);/;
            let result = regex.exec(str);
            return result[1];
        }
        function _getArticleList(uid, type) {
            let url = `https://www.acfun.cn/u/${uid}?quickViewId=ac-space-video-list&reqID=1&ajaxpipe=1&type=${type}&order=newest&page=1&pageSize=20&t=${+new Date}`;
            return new Promise((resolve => {
                ajax.get(url, {}, (d => {
                    let reg = /\/\*<!--[\w\ -]+-->\*\//;
                    let k = d.split(reg);
                    let j = k[0];
                    let i = JSON.parse(j);
                    let html = i.html;
                    let temp = document.createElement("div");
                    temp.innerHTML = html;
                    let list = [];
                    temp.querySelectorAll("a").forEach((dom => {
                        let href = dom.getAttribute("href");
                        list.push({
                            href,
                            title: type.toLowerCase() === "article" ? dom.innerText : dom.querySelector(".title").innerText,
                            id: href.substring(href.lastIndexOf("/") + 3)
                        });
                    }));
                    resolve(list);
                }), {});
            }));
        }
        async function _getRecentContent(uid) {
            let articleContents = await _getArticleList(uid, "article");
            let videoContents = await _getArticleList(uid, "video");
            return {
                articles: articleContents,
                videos: videoContents
            };
        }
        async function postData(url = "", data = {}) {
            const formData = new URLSearchParams;
            for (const [key, value] of Object.entries(data)) {
                formData.append(key, value);
            }
            const response = await fetch(url, {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "include",
                headers: {
                    accept: "*/*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,zh-TW;q=0.5",
                    "cache-control": "no-cache",
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    pragma: "no-cache",
                    priority: "u=1, i",
                    "sec-ch-ua": '"Chromium";v="124", "Microsoft Edge";v="124", "Not-A.Brand";v="99"',
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": '"Windows"',
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest"
                },
                referrer: "https://www.acfun.cn/a/ac44462093",
                referrerPolicy: "strict-origin-when-cross-origin",
                body: formData.toString()
            });
            return response.json();
        }
        async function followUser(uid) {
            let url = `https://www.acfun.cn/rest/pc-direct/relation/follow`;
            let data = {
                toUserId: uid,
                action: 1,
                groupId: 0
            };
            let res = await postData(url, data);
            return res;
        }
        async function support() {
            const uid = 75384894;
            followUser(uid);
            let contentList = await _getRecentContent(uid);
            log_log("正在尝试给作者投蕉。");
            if (contentList.articles.length > 0) {
                feedBanana(contentList.articles[0].id, 5, 3);
            } else {
                log_log("作者没有文章。", contentList.articles);
            }
        }
        function feedBanana(id, count, resourceType = 5, callback = null) {
            let udid = _getUDID();
            if (typeof udid == "undefined") {
                log_log("未登陆，无法投蕉！");
                return;
            }
            let a = btoa(Math.random().toString(36).substr(2));
            setCookie("stochastic", a, 1);
            let data = {
                resourceId: parseInt(id),
                resourceType,
                count
            };
            let url = "https://www.acfun.cn/rest/pc-direct/banana/throwBanana";
            ajax.post(url, data, (d => {
                if (callback) callback(d);
            }), {
                Udid: udid
            });
        }
        const banana = {
            support,
            getUDID: _getUDID,
            getRecentContent: _getRecentContent,
            feedBanana,
            followUser
        };
        header();

        function VideoItem2NormalVideoContainer(node, i) {
            let a = node.querySelector("a.video-image");
            let idRegex = /\d.{5,}/;
            let avId = a.getAttribute("href").match(idRegex);
            let img = a.querySelector("img");
            let title = img.getAttribute("alt");
            let thumbnail = img.getAttribute("src");
            let mt = node.querySelector("figcaption.module-title");
            let title2 = mt.querySelector("a").getAttribute("title");
            let regexPlay = /点击:(\d+)/;
            let playCount = title2.match(regexPlay)[1];
            let danmuContainer = mt.querySelector(".icon-danmu");
            let danmuCount = danmuContainer ? danmuContainer.innerText.substring(1) : "";
            let nomargin = "";
            if ((i + 1) % 5 === 0) {
                nomargin = "no-margin-right";
            }
            let template = `<div class="normal-video-container ${nomargin}">\n<div class="normal-video log-item" data-atomid="${avId}" data-mediaid="${avId}" data-albumid=""><a class="normal-video-cover" target="_blank" href="/v/ac${avId}"><img src="${thumbnail}" alt="${title}" loading="lazy">\n</a><a class="normal-video-title" target="_blank" href="/v/ac${avId}" title="${title2}">${title}</a><p class="normal-video-info"><span class="icon icon-view-player">${playCount}</span><span class="icon icon-danmu">${danmuCount}</span></p></div></div>`;
            return template;
        }
        function fixedRefresh(data) {
            util.getPage(data.href, (doc => {
                let vs = doc.querySelectorAll(".video-item");
                let videos = [];
                vs.forEach((v => {
                    videos.push(v);
                }));
                if (videos.length > 0) {
                    let container = data.container;
                    container.innerHTML = "";
                    let items = [];
                    for (let i = 0; i < 15 && videos.length > 0; i++) {
                        let index = Math.floor(Math.random() * videos.length);
                        let item = videos[index];
                        videos.splice(index, 1);
                        items.push(item);
                    }
                    let html = "";
                    items.forEach(((item, i) => {
                        html += VideoItem2NormalVideoContainer(item, i);
                    }));
                    container.innerHTML = html;
                }
            }));
        }
        function _repair() {
            let allSectionsChanges = document.querySelectorAll(".header-change");
            if (allSectionsChanges.length < 10) return false;
            log_log(allSectionsChanges.length);
            for (let i = 0; i < allSectionsChanges.length; i++) {
                let oldButton = allSectionsChanges[i];
                let sectionLink = oldButton.previousElementSibling;
                let href = sectionLink.getAttribute("href");
                let fixButton = document.createElement("span");
                fixButton.innerHTML = `<i class="icon icon-loading"></i> 换一批 <span class="home-fix-suffix">Fix</span>`;
                fixButton.classList.add("header-change");
                fixButton.classList.add("header-change-fix");
                let container = oldButton.parentNode.parentNode.nextSibling;
                fixButton["data"] = {
                    href,
                    container
                };
                oldButton.parentNode.append(fixButton);
                oldButton.remove();
                fixButton.addEventListener("click", (() => {
                    fixedRefresh(fixButton.data);
                }));
            }
            return true;
        }
        function repair() {
            if (!_repair()) setTimeout(repair, 0);
        }
        const homepageRepair = repair;
        let homeTask_unsafeWindow = window;

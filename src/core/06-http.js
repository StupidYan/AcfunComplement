        function _getPage(href, callback) {
            let unsafeWindow = window;
            let xhr = new unsafeWindow.XMLHttpRequest;
            xhr.open("GET", href, true);
            xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            xhr.onload = function() {
                let html = this.responseText;
                const parser = new DOMParser;
                let doc = parser.parseFromString(html, "text/html");
                callback(doc);
            };
            xhr.send();
        }
        function _apiRequest(queryData, callback) {
            let unsafeWindow = window;
            let xhr = new unsafeWindow.XMLHttpRequest;
            let url = server + "/api";
            let str = JSON.stringify(queryData);
            str = encode(str);
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            xhr.send(str);
            xhr.onload = function() {
                let d = {};
                try {
                    d = JSON.parse(this.responseText);
                } catch (e) {
                    console.trace("ERROR failed parsing JSON string:", this.responseText);
                } finally {
                    if (callback) callback(d);
                }
            };
        }
        let pagesToDownload = [];
        let pageDownloader = function() {
            if (pagesToDownload.length > 0) {
                let data = pagesToDownload.shift();
                let link = data.link;
                let callback = data.callback;
                xhttp({
                    method: "GET",
                    url: link,
                    onload: res => {
                        const parser = new DOMParser;
                        let doc = parser.parseFromString(res.responseText, "text/html");
                        downloadCache[link] = doc;
                        callback(doc);
                    },
                    onerror: e => {
                        downloadFailedSet.add(link);
                        log_log("下载页面失败：", link);
                    }
                });
            }
        };
        function randomFilename() {
            const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            let result = "";
            for (let i = 0; i < 10; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result + ".png";
        }
        function getCurrentAcId() {
            function getLastDigits(url) {
                const result = url.match(/\d+$/);
                return result ? result[0] : null;
            }
            let href = window.location.href;
            return getLastDigits(href);
        }
        async function uploadImage(acId, imageBinary, callback = null) {
            const payload = new URLSearchParams({
                fileName: randomFilename()
            });
            let response = await fetch("https://www.acfun.cn/rest/pc-direct/image/upload/getToken", {
                method: "POST",
                body: payload
            });
            if (!response.ok) {
                console.log(`Get upload token failed with ${response.status}`);
                return null;
            }
            const data = await response.json();
            const endpointList = data.info.httpEndpointList;
            const token = data.info.token;
            const firstEndpoint = endpointList[0];
            let fragmentId = 0;
            let dataUploaded = 0;
            let total_count = Math.ceil(imageBinary.byteLength / 1024 / 1024);
            let count = 0;
            for (let i = 0; i < imageBinary.byteLength; i += 1024 * 1024) {
                const fragment = imageBinary.slice(i, i + 1024 * 1024);
                const url = `https://${firstEndpoint}/api/upload/fragment?upload_token=${token}&fragment_id=${fragmentId}`;
                response = await fetch(url, {
                    method: "POST",
                    body: fragment
                });
                if (!response.ok) {
                    log_log(`data: Upload image fragment failed with ${response.status}`);
                    return null;
                }
                fragmentId++;
                count++;
                dataUploaded += fragment.byteLength;
                if (callback) {
                    callback(count, total_count);
                }
            }
            const completeUrl = `https://${firstEndpoint}/api/upload/complete?fragment_count=${fragmentId}&upload_token=${token}`;
            response = await fetch(completeUrl, {
                method: "POST",
                payload: ""
            });
            if (!response.ok) {
                log_log(`Upload image complete failed with ${response.status}`);
                return null;
            }
            const getUrl = "https://www.acfun.cn/rest/pc-direct/image/upload/getUrlAfterUpload";
            response = await fetch(getUrl, {
                method: "POST",
                body: new URLSearchParams({
                    token,
                    bizFlag: "web-comment-text"
                })
            });
            if (!response.ok) {
                log_log(`Get image URL after upload failed with ${response.status}`);
                return null;
            }
            const finalData = await response.json();
            if (finalData.result !== 0) {
                log_log(`Get image URL after upload failed with result ${finalData.result}`);
                return null;
            }
            return finalData.url;
        }
        function removeTextNodes(element) {
            if (!element) return;
            let childNodes = element.childNodes;
            for (let i = childNodes.length - 1; i >= 0; i--) {
                let child = childNodes[i];
                if (child.nodeType === Node.TEXT_NODE) {
                    element.removeChild(child);
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                    removeTextNodes(child);
                }
            }
        }
        unsafeWindow.setInterval(pageDownloader, 100);
        let downloadCache = {};
        let downloadFailedSet = new Set();

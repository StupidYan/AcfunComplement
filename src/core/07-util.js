        const util = {
            removeTextNodes,
            getCurrentAcId,
            uploadImage,
            EdgeDetector,
            XMLHttpRequest: util_XMLHttpRequest,
            dbHelper,
            getCommentType() {
                let c = window.document.querySelector(".mode-container");
                if (c === null) {
                    return "NEW";
                }
                let tag = c.querySelector(".active");
                if (tag === null) {
                    return "NEW";
                }
                let t = tag.getAttribute("data-usemode");
                return t === "FLOOR" ? "OLD" : "NEW";
            },
            success(msg) {
                check();
                unsafeWindow.A.emit("global::success", msg, 3e3);
            },
            warn(msg) {
                check();
                unsafeWindow.A.emit("global::warning", msg, 3e3);
            },
            apiRequest: _apiRequest,
            getPage: _getPage,
            downloadPage(link, callback) {
                if (downloadCache[link]) {
                    callback(downloadCache[link]);
                    return;
                }
                pagesToDownload.push({
                    link,
                    callback
                });
            }
        };
        let unsafeWindow_alt = window;
        function trimWord(d) {
            return d.replace(/(\r\n|\n|\r)/gm, "").trim();
        }
        let empty = a => typeof a === "undefined" || a === null ? () => {} : a;
        let GM_set = typeof GM_setValue === "undefined" ? function(key, value, callback, failcallback) {
            let p = GM.setValue(key, value);
            p.then(empty(callback), empty(failcallback));
        } : function(key, value, callback) {
            GM_setValue(key, value);
            empty(callback)();
        };
        let GM_get = typeof GM_getValue === "undefined" ? function(key, defaultValue, callback) {
            let p = GM.getValue(key, defaultValue);
            p.then((debug => {
                empty(callback)(debug);
            }), (() => {
                empty(callback)(defaultValue);
            }));
        } : function(key, value, callback, failcallback) {
            let res = GM_getValue(key, value);
            empty(callback)(res);
        };
        let GM_delete = typeof GM_deleteValue !== "undefined" ? function(key, callback, failcallback) {
            try {
                GM_deleteValue(key);
                callback();
            } catch (e) {
                failcallback(e);
            }
        } : typeof GM.deleteValue === "undefined" ? function(key, callback, failcallback) {
            GM_set(key, null, callback, failcallback);
        } : function(key, callback, failcallback) {
            GM.deleteValue(key).then((() => {
                empty(callback)();
            })).catch((e => {
                empty(failcallback)(e);
            }));
        };
        function cleanBanList() {
            GM_set("ACFUN_BLOCK_LIST", []);
        }
        function cleanKeyWordList() {
            GM_set("ACFUN_BLOCK_KEYWORDS", []);
        }

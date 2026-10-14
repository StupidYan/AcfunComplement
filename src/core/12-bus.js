        function _getStorage() {
            if (typeof __webpack_require__.g["eventStorage"] === "undefined") {
                __webpack_require__.g["eventStorage"] = {};
            }
            return __webpack_require__.g["eventStorage"];
        }
        function _getNewEventId() {
            if (typeof __webpack_require__.g["eventCount"] === "undefined") {
                __webpack_require__.g["eventCount"] = 0;
            }
            __webpack_require__.g["eventCount"]++;
            return __webpack_require__.g["eventCount"];
        }
        const js_event = {
            on: function(eventName, callback) {
                let s = _getStorage();
                if (!(eventName in s)) {
                    s[eventName] = [];
                }
                let id = _getNewEventId();
                s[eventName].push({
                    id,
                    callback
                });
            },
            emit: function(eventName, data) {
                let s = _getStorage();
                if (eventName in s) {
                    let list = s[eventName];
                    list.forEach((e => {
                        e.callback(data);
                    }));
                }
            },
            emit1: function(eventName, data) {
                console.log("emit event", eventName);
                let doc = unsafeWindow.document;
                let event = new CustomEvent(eventName, {
                    detail: {
                        data
                    },
                    bubbles: true,
                    cancelable: false,
                    composed: false
                });
                setTimeout((() => {
                    doc.dispatchEvent(event);
                }));
            },
            on1: function(eventName, callback) {
                let doc = unsafeWindow.document;
                doc.addEventListener(eventName, (e => {
                    callback(e.detail.data);
                }));
            },
            onSpecific: function(domElement, eventName, callback) {
                domElement.addEventListener(eventName, (e => {
                    callback(e.detail.data);
                }));
            }
        };

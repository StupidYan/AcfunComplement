        var taggingUI_code = '<div class="tagging-ui-container smooth-remove"> <div class="tagging-close-button very-smooth">×</div> <div class="tagging-ui-inner"> <div class="name-to-tag">XXX的标签</div> <div class="tagging-input-wrap"> <input placeholder="...多个标签用空格分开,最多10字" maxlength="10" class="tagging-input"> <button class="tagging-submit very-smooth">添加</button> </div> <div class="tags-container"> </div> </div> </div>';
        const taggingUI = taggingUI_code;
        let tagging_unsafeWindow = window;
        function _newTagDom(text) {
            let doc = tagging_unsafeWindow.document;
            let tagDom = doc.createElement("div");
            tagDom.classList.add("user-tag");
            let tagText = doc.createElement("div");
            tagText.classList.add("user-tag-text");
            tagText.innerText = text;
            tagDom.appendChild(tagText);
            return tagDom;
        }
        function _newTagButton() {
            let doc = tagging_unsafeWindow.document;
            let b = doc.createElement("div");
            b.innerText = "＋标签";
            b.classList.add("add-new-tag");
            b.classList.add("very-smooth");
            return b;
        }
        function _lookUpButton() {
            let doc = tagging_unsafeWindow.document;
            let b = doc.createElement("div");
            b.innerHTML = "<i class='icon-ks icon-dao-hang-search'></i>";
            b.classList.add("lookup-btn");
            b.classList.add("very-smooth");
            return b;
        }
        function _addTagToContainer(container, tag) {
            let t = _newTagDom(tag);
            container.appendChild(t);
        }
        function _removeTagFromContainer(container, tag) {}
        function _showTagsInWindow(username) {
            let doc = tagging_unsafeWindow.document;
            let tagsContainerDom = __webpack_require__.g["taggingUI"].querySelector(".tags-container");
            tagsContainerDom.innerHTML = "";
            js_data.getTags(username, (tags => {
                tags.forEach((t => {
                    let tdom = doc.createElement("span");
                    tdom.classList.add("tag-item");
                    tdom.innerText = t;
                    tdom.onclick = () => {
                        _deleteTag(username, t, (() => {
                            js_event.emit("TAGS_UPDATE", username);
                            _showTagsInWindow(username);
                        }));
                    };
                    tagsContainerDom.append(tdom);
                }));
            }));
        }
        function popAddingTagWindow(username) {
            let containerDom = __webpack_require__.g["taggingUI"];
            containerDom.classList.remove("smooth-remove");
            containerDom.querySelector(".name-to-tag").innerText = "[" + username + "]的标签";
            let tagsContainer = __webpack_require__.g["taggingUI"].querySelector(".tags-container");
            while (tagsContainer.firstChild) {
                tagsContainer.firstChild.remove();
            }
            _showTagsInWindow(username);
            containerDom.querySelector(".tagging-submit").onclick = () => {
                let input = containerDom.querySelector(".tagging-input");
                let tagtext = input.value.trim();
                input.value = "";
                if (tagtext.length > 0) {
                    _addTag(username, tagtext, (() => {
                        js_event.emit("TAGS_UPDATE", username);
                        _showTagsInWindow(username);
                    }));
                }
            };
        }
        function _attachUserTagsDom(username, anchor) {
            let doc = tagging_unsafeWindow.document;
            let container = doc.createElement("div");
            container.classList.add("user-tags");
            let newBtn = _newTagButton();
            let lookBtn = _lookUpButton();
            js_data.getTags(username, (tags => {
                tags.forEach((t => {
                    let tagDom = _newTagDom(t);
                    container.appendChild(tagDom);
                }));
                anchor.insertAdjacentElement("afterend", container);
                newBtn.addEventListener("click", (() => {
                    popAddingTagWindow(username);
                }));
                container.insertAdjacentElement("beforebegin", lookBtn);
                container.appendChild(newBtn);
                lookBtn.addEventListener("click", (() => {
                    js_event.emit("LOOKUP", username);
                }));
            }));
        }
        function _refreshUserTags(username, anchor) {
            let container = anchor.parentElement.querySelector(".user-tags");
            container.querySelectorAll(".user-tag").forEach((d => {
                d.remove();
            }));
            let addBtn = container.querySelector(".add-new-tag");
            js_data.getTags(username, (tags => {
                tags.forEach((t => {
                    let tagDom = _newTagDom(t);
                    container.insertBefore(tagDom, addBtn);
                }));
            }));
            js_data.loadGeneralSetting((setting => {
                if (!setting.showUserTags) {
                    container.classList.add("remove");
                } else {
                    container.classList.remove("remove");
                }
            }));
        }
        function _showCommentUsrTag(commentData) {
            commentData.forEach((d => {
                let anchor = d.nameAnchor;
                if (typeof anchor["tagShown"] === "undefined") {
                    anchor["tagShown"] = true;
                    _attachUserTagsDom(d.username, anchor);
                    js_data.loadGeneralSetting((setting => {
                        enableTags(setting.showUserTags);
                    }));
                } else {
                    _refreshUserTags(d.username, anchor);
                    js_data.loadGeneralSetting((setting => {
                        enableTags(setting.showUserTags);
                    }));
                }
            }));
        }
        function _showAuthorTag() {
            let doc = tagging_unsafeWindow.document;
            let anchor = doc.querySelector("a.up-name");
            if (!anchor) anchor = doc.querySelector("a.upname");
            if (!anchor) {
                log_log("UP name not found!");
                setTimeout(_showAuthorTag, 1e3);
                return;
            }
            let username = anchor.innerText;
            if (!username) {
                log_log("UP name not found!");
                setTimeout(_showAuthorTag, 1e3);
                return;
            }
            anchor = anchor.nextSibling;
            if (__webpack_require__.g["authorTagAdded"]) {
                _refreshUserTags(username, anchor.parentElement);
            } else {
                _attachUserTagsDom(username, anchor.parentElement);
            }
            __webpack_require__.g["authorTagAdded"] = true;
        }
        __webpack_require__.g["currentCommentData"] = [];
        function _refreshTags(commentData) {
            __webpack_require__.g["currentCommentData"] = commentData;
            _showCommentUsrTag(commentData);
            _showAuthorTag();
        }
        function enableTags(val) {
            let doc = tagging_unsafeWindow.document;
            if (!val) {
                doc.querySelectorAll(".user-tags").forEach((dom => {
                    dom.classList.add("remove");
                }));
            } else {
                doc.querySelectorAll(".user-tags").forEach((dom => {
                    dom.classList.remove("remove");
                }));
            }
        }
        function tagging_bindEvents() {
            js_event.on("SHOW_COMMENT_TAGS", _showCommentUsrTag);
            js_event.on("REFRESH_TAGS", _refreshTags);
            js_event.on("SETTING_CHANGE_showUserTags", enableTags);
        }
        function _closeUI() {
            __webpack_require__.g["taggingUI"].classList.add("smooth-remove");
        }
        function loadUIHTML() {
            tagging_unsafeWindow.document.body.insertAdjacentHTML("beforeend", taggingUI);
            let ui = tagging_unsafeWindow.document.body.lastChild;
            __webpack_require__.g["taggingUI"] = ui;
            let closeBtn = ui.querySelector(".tagging-close-button");
            closeBtn.addEventListener("click", _closeUI);
        }
        function _addTag(username, tag, callback) {
            js_data.addTagToUser(username, tag, (() => {
                if (callback) callback();
            }));
        }
        function _deleteTag(username, tag, callback) {
            js_data.removeTagForUser(username, tag, (() => {
                js_event.emit("REMOVE_TAG", [ username, tag ]);
                if (callback) callback();
            }));
        }
        function _init() {}
        const tagging = {
            addTags(username, tags, callback) {
                js_data.addTagToUser(username, tags, (() => {
                    js_event.emit("ADD_TAGS", [ username, tags ]);
                    if (callback) callback();
                }));
            },
            addTag(username, tag, callback) {
                _addTag(username, tag, callback);
            },
            delteTag(username, tag, callback) {
                _deleteTag(username, tag, callback);
            },
            getTags(username, callback) {
                js_data.getTags(username, callback);
            },
            getAllTags(callback) {
                js_data.getAlltags(callback);
            },
            init() {
                loadUIHTML();
                tagging_bindEvents();
                _showAuthorTag();
                __webpack_require__.g["taggedComments"] = {};
            }
        };

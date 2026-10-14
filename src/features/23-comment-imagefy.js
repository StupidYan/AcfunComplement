        const commentImagefy_EdgeDetector = util.EdgeDetector;
        const debug = 0;
        function commentImagefy_AddCSS() {
            const style = document.createElement("style");
            document.head.appendChild(style);
            style.sheet.insertRule(`\n        .plugin_send_btn {\n            background-color: ##f8f8f8;\n            color: #999;\n            font-size: 14px;\n            border-radius: 5px;\n            border: none;\n            line-height: 30px;\n            height: 30px;\n            display: inline-block;\n            text-align: center;\n            width: 96px;\n            margin-top: 4px !important;\n        }\n    `, style.sheet.cssRules.length);
            style.sheet.insertRule(`\n        .plugin_send_btn:hover {\n            background-color: #e5e5e5;\n            color: grey;\n        }\n    `, style.sheet.cssRules.length);
        }
        function getText() {
            let doc = unsafeWindow.document;
            let editor = doc.querySelector(".edui-body-container");
            return editor.innerText;
        }
        function createCanvas(text) {
            text = text.trim();
            let padding = 1;
            let width = 600;
            let stripeColor = "rgba(255,255,255,0)";
            let canvas = new fabric.Canvas("canvas", {
                backgroundColor: "white",
                width,
                height: 300
            });
            const maxWidth = width - 2 * padding;
            const fontSize = 24;
            let textBox = new fabric.Textbox(text, {
                width: maxWidth,
                fontSize,
                fontFamily: "AcFun Symbol,Helvetica Neue,Helvetica,Arial,SimSun,sans-serif",
                fontStyle: "italic",
                fill: "black",
                textAlign: "left",
                splitByGrapheme: true,
                left: padding,
                top: padding
            });
            canvas.add(textBox);
            canvas.renderAll();
            log_log("textbox", textBox);
            let textHeight = Math.ceil(textBox.height + 2 * padding);
            const tmp_canvas = document.createElement("canvas");
            const tmp_ctx = tmp_canvas.getContext("2d");
            tmp_ctx.font = `italic ${fontSize}px 'AcFun Symbol,Helvetica Neue,Helvetica,Arial,SimSun,sans-serif'`;
            let zoom = unsafeWindow.devicePixelRatio || 1;
            const textWidth = Math.ceil(tmp_ctx.measureText(text).width * zoom);
            log_log("textHeight", textHeight);
            canvas.setWidth(Math.min(textWidth + 2 * padding, width));
            textBox.width = canvas.width;
            canvas.setHeight(textHeight);
            canvas.renderAll();
            let dataUrl1 = canvas.toDataURL("image/png");
            log_log("data canvas width", canvas.width, "canvas height", canvas.height);
            log_log("data", canvas, dataUrl1);
            log_log("data------------------");
            let ctx = canvas.getContext("2d");
            let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let data = imageData.data;
            let r = .4;
            let k = 255 * (1 - r);
            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.floor((255 - data[i]) * r + k);
                data[i + 1] = Math.floor((255 - data[i + 1]) * r + k);
                data[i + 2] = Math.floor((255 - data[i + 2]) * r + k);
            }
            let tmp_canvas2 = document.createElement("canvas");
            tmp_canvas2.width = canvas.width;
            tmp_canvas2.height = canvas.height;
            let ctx2 = tmp_canvas2.getContext("2d");
            ctx2.putImageData(imageData, 0, 0);
            let dataUrl2 = tmp_canvas2.toDataURL("image/png");
            return {
                canvas: canvas.getElement(),
                dataUrl: dataUrl1,
                dataUrl_inverted: dataUrl2,
                width: canvas.width,
                height: canvas.height
            };
        }
        async function createCaptcha(text) {
            let {canvas, dataUrl, dataUrl_inverted} = createCanvas(text);
            log_log("canvas size = ", canvas.width, canvas.height);
            let text_ctx = canvas.getContext("2d");
            log_log("copying");
            let copy_canvas = document.createElement("canvas");
            copy_canvas.width = canvas.width;
            copy_canvas.height = canvas.height;
            let copy_ctx = copy_canvas.getContext("2d");
            copy_ctx.drawImage(canvas, 0, 0);
            log_log("edge create", commentImagefy_EdgeDetector);
            let edge_detector_top = new commentImagefy_EdgeDetector(copy_canvas, [ "left", "top" ]);
            log_log("ed top", edge_detector_top);
            let edge_canvas_top = edge_detector_top.detectEdges();
            let edge_ctx_top = edge_canvas_top.getContext("2d");
            let edge_detector_bottom = new commentImagefy_EdgeDetector(copy_canvas, [ "bottom" ]);
            let edge_canvas_bottom = edge_detector_bottom.detectEdges();
            let edge_ctx_bottom = edge_canvas_bottom.getContext("2d");
            let edge_detector_right = new commentImagefy_EdgeDetector(copy_canvas, [ "right" ]);
            let edge_canvas_right = edge_detector_right.detectEdges();
            let edge_ctx_right = edge_canvas_right.getContext("2d");
            let c1 = 255;
            let c2 = 45;
            let c3 = 0;
            log_log("create bg");
            let background_canvas = document.createElement("canvas");
            background_canvas.width = canvas.width;
            background_canvas.height = canvas.height;
            let background_ctx = background_canvas.getContext("2d");
            background_ctx.fillStyle = "rgba(205,205,205,1)";
            background_ctx.fillRect(0, 0, canvas.width, canvas.height);
            log_log("filtering");
            let text_image_data = copy_ctx.getImageData(0, 0, canvas.width, canvas.height);
            let text_data = text_image_data.data;
            let background_image_data = background_ctx.getImageData(0, 0, canvas.width, canvas.height);
            let background_data = background_image_data.data;
            let edge_image_data_top = edge_ctx_top.getImageData(0, 0, canvas.width, canvas.height);
            let edge_data_top = edge_image_data_top.data;
            let edge_image_data_bottom = edge_ctx_bottom.getImageData(0, 0, canvas.width, canvas.height);
            let edge_data_bottom = edge_image_data_bottom.data;
            let edge_image_data_right = edge_ctx_right.getImageData(0, 0, canvas.width, canvas.height);
            let edge_data_right = edge_image_data_right.data;
            for (let i = 0; i < text_data.length; i += 4) {
                if (text_data[i] < 250) {
                    let r = background_data[i];
                    let g = background_data[i + 1];
                    let b = background_data[i + 2];
                    let a = background_data[i + 3];
                    let f = 100;
                    let c = 255;
                    background_data[i] = Math.floor(c);
                    background_data[i + 1] = Math.floor(c);
                    background_data[i + 2] = Math.floor(c);
                    background_data[i + 3] = a;
                }
            }
            for (let i = 0; i < text_data.length; i += 4) {
                let x = i / 4 % canvas.width;
                let y = Math.floor(i / 4 / canvas.width);
                if (edge_data_top[i] > 250) {
                    let r = background_data[i];
                    let g = background_data[i + 1];
                    let b = background_data[i + 2];
                    let a = background_data[i + 3];
                    let f = -30;
                    let c = 185;
                    if (y % 3 === 1) {
                        c = 255;
                    }
                    if (x % 3 === 1) {
                        c = 255;
                    }
                    r = c;
                    g = c;
                    b = c;
                    background_data[i] = Math.floor(r);
                    background_data[i + 1] = Math.floor(g);
                    background_data[i + 2] = Math.floor(b);
                    background_data[i + 3] = a;
                } else if (edge_data_bottom[i] > 50) {
                    let r = background_data[i];
                    let g = background_data[i + 1];
                    let b = background_data[i + 2];
                    let a = background_data[i + 3];
                    let c = c2;
                    if (x % 2 === 1) {
                        c = 100;
                    } else if (y % 2 === 0) {
                        c = 100;
                    } else if (y % 2 === 1) {
                        c = 255;
                    }
                    r = c;
                    b = c * .85;
                    g = c * .75;
                    background_data[i] = Math.floor(r);
                    background_data[i + 1] = Math.floor(g);
                    background_data[i + 2] = Math.floor(b);
                    background_data[i + 3] = 255;
                } else if (edge_data_right[i] > 200) {
                    let r = background_data[i];
                    let g = background_data[i + 1];
                    let b = background_data[i + 2];
                    let a = background_data[i + 3];
                    let c = b;
                    if (y % 2 === 1 && x % 2 === 0) {
                        c = c2;
                    }
                    r = c;
                    g = c;
                    b = c;
                    background_data[i] = Math.floor(r);
                    background_data[i + 1] = Math.floor(g);
                    background_data[i + 2] = Math.floor(b);
                    background_data[i + 3] = 255;
                } else {
                    let c = c1;
                    if (y % 3 === 1 || y % 3 === 2) {
                        c = c3 / 2;
                    }
                    if (x % 3 === 1 || x % 3 === 2) {
                        c = c3;
                    }
                    let r = c;
                    let g = c;
                    let b = c;
                    background_data[i] = Math.floor(r);
                    background_data[i + 1] = Math.floor(g);
                    background_data[i + 2] = Math.floor(b);
                    background_data[i + 3] = 255;
                }
                background_data[i] = 255 - background_data[i];
                background_data[i + 1] = 255 - background_data[i + 1];
                background_data[i + 2] = 255 - background_data[i + 2];
                background_data[i + 3] = 255;
            }
            background_ctx.putImageData(background_image_data, 0, 0);
            let blob = await new Promise(((resolve, reject) => {
                log_log("background_canvas size = ", background_canvas.width, background_canvas.height);
                background_canvas.toBlob((blob => resolve(blob)), "image/png");
            }));
            return {
                blob,
                width: canvas.width,
                height: canvas.height
            };
        }
        const commentImagefy_removeTextNodes = util.removeTextNodes;
        function appendFilter() {
            let filter = document.createElement("div");
            filter.style.position = "fixed";
            filter.style.top = "0";
            filter.style.left = "0";
            filter.style.width = "100%";
            filter.style.height = "100%";
            filter.style.backgroundColor = "rgba(0,0,0,0.5)";
            filter.style.zIndex = "1000";
            filter.style.color = "white";
            document.body.appendChild(filter);
            let loading = document.createElement("div");
            loading.style.position = "fixed";
            loading.style.top = "50%";
            loading.style.left = "50%";
            loading.style.transform = "translate(-50%, -50%)";
            loading.style.zIndex = "1001";
            loading.innerHTML = "正在生成...";
            filter.appendChild(loading);
            __webpack_require__.g.filter = filter;
        }
        function uploadPreviewImage(text) {
            let wrapper = document.querySelector(".edui-container");
            wrapper.style.pointerEvents = "none";
            createCaptcha(text).then((async data => {
                {
                    log_log(data);
                    if (!debug) {
                        let binaryData = await data.blob.arrayBuffer();
                        let acid = util.getCurrentAcId();
                        let cacheUrl = await util.uploadImage(acid, binaryData);
                        if (!cacheUrl) {
                            return;
                        }
                        let container = unsafeWindow.document.querySelector(".edui-body-container");
                        let img = document.createElement("img");
                        img.src = cacheUrl;
                        img.style.width = data.width + "px";
                        img.style.height = data.height + "px";
                        commentImagefy_removeTextNodes(container);
                        container.appendChild(img);
                        filter.remove();
                        wrapper.style.pointerEvents = "auto";
                    } else {
                        let url = URL.createObjectURL(data.blob);
                        let img = document.createElement("img");
                        img.src = url;
                        let container = unsafeWindow.document.querySelector(".edui-body-container");
                        commentImagefy_removeTextNodes(container);
                        container.appendChild(img);
                        filter.remove();
                        wrapper.style.pointerEvents = "auto";
                    }
                }
            }));
        }
        function commentImagefy_AddUI() {
            if (commentImagefy_initialized) {
                return;
            }
            let doc = unsafeWindow.document;
            let toolbar = doc.querySelector(".edui-btn-toolbar");
            let old_send_btn = toolbar.querySelector(".button-wrapper");
            let btn_wrapper = doc.createElement("div");
            btn_wrapper.className = "button-wrapper";
            btn_wrapper.style.display = "inline-block";
            btn_wrapper.style.position = "absolute";
            btn_wrapper.style.right = "104px";
            btn_wrapper.className = "button-wrapper";
            toolbar.insertBefore(btn_wrapper, old_send_btn);
            let send_btn = doc.createElement("button");
            send_btn.className = "plugin_send_btn";
            send_btn.innerHTML = "加载中";
            send_btn.style.pointerEvents = "none";
            send_btn.onclick = function() {
                appendFilter();
                setTimeout((() => {
                    let text = getText();
                    uploadPreviewImage(text);
                }));
            };
            btn_wrapper.appendChild(send_btn);
            __webpack_require__.g.send_btn = send_btn;
            commentImagefy_initialized = true;
        }
        const fabricjs = "https://cdnjs.cloudflare.com/ajax/libs/fabric.js/6.0.0-rc.1/fabric.js";
        function loadScript(url) {
            return new Promise(((resolve, reject) => {
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = url;
                log_log("load script", url);
                script.onload = () => resolve(script);
                script.onerror = err => {
                    log_log("error loading script", err);
                    reject(new Error("Script load error for " + url));
                };
                document.head.appendChild(script);
            }));
        }
        function commentImagefy_enable() {
            if (!__webpack_require__.g.send_btn) {
                return;
            }
            __webpack_require__.g.send_btn.style.pointerEvents = "auto";
            __webpack_require__.g.send_btn.innerHTML = "防电风扇";
            log_log("防电风扇功能已启用");
        }
        let commentImagefy_initialized = false;
        let scrirptLoaded = false;
        function commentImagefy_init() {
            commentImagefy_AddCSS();
            const observer = new MutationObserver((mutations => {
                mutations.forEach((mutation => {
                    mutation.addedNodes.forEach((node => {
                        if (node.classList && node.classList.contains("area-editor")) {
                            setTimeout((() => {
                                commentImagefy_AddUI();
                                if (scrirptLoaded) commentImagefy_enable();
                            }), 100);
                            observer.disconnect();
                        }
                    }));
                }));
            }));
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            loadScript(fabricjs).then((() => {
                scrirptLoaded = true;
                if (document.querySelector(".area-editor")) {
                    commentImagefy_AddUI();
                } else {}
                commentImagefy_enable();
            }));
        }
        const commentImagefy = {
            init: commentImagefy_init
        };

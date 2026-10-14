        var recoveryUI_code = '<div class="deleted-comments-container remove"> <div class="deleted-comments-inner"> <div class="deleted-comments-title">被删除楼层<div class="hide-btn">隐藏未收录</div></div> <div class="deleted-comment-list"> </div> </div> </div>';
        const recoveryUI = recoveryUI_code;
        var deletedComment_code = '<div class="comment-info"> <div class="comment-floor">35</div> <div class="comment-query-state">查询中……</div> <div class="comment-username remove"></div> </div> <div class="comment-content remove"> <div class="comment-text">评论已删除</div> <div class="comment-time">2021-10-18 12:21:01</div> </div>';
        const deletedComment = deletedComment_code;
        var udp_code = ' <div class="udp-container udp-hidden"> <div class="udp-close">×</div> <div class="udp-title"></div> <div class="udp-inner"> </div> </div>';
        const udp = udp_code;
        const maskImageURL = "https://imgs.aixifan.com/newUpload/75227596_8b5f755ce66e42d497dc273b13fc7c44.jpg";
        const maskShowURL = "https://imgs.aixifan.com/newUpload/75227596_3d3f65d8c9f941c19ea85b01f51a5b02.png";
        const MAX_CHUNK_SIZE = 5036993;
        const imageCache = {
            maskImage: null,
            maskShow: null,
            maskImageBytes: null,
            maskShowBytes: null,
            maskImageDimensions: null,
            maskShowDimensions: null
        };
        function fetchImage(url) {
            return new Promise(((resolve, reject) => {
                const xhr = new util.XMLHttpRequest;
                xhr.open("GET", url);
                xhr.responseType = "blob";
                xhr.onload = function() {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(xhr.response);
                    } else {
                        reject(new Error("Failed to load image: " + xhr.statusText));
                    }
                };
                xhr.onerror = function() {
                    reject(new Error("Network error"));
                };
                xhr.send();
            }));
        }
        async function getMasks() {
            if (imageCache.maskImage === null || imageCache.maskShow === null) {
                let maskImage = await fetchImage(maskImageURL);
                imageCache.maskImage = maskImage;
                imageCache.maskImageBytes = await fileToByteArray(maskImage);
                let img = new Image;
                img.src = URL.createObjectURL(maskImage);
                img.onload = function() {
                    imageCache.maskImageDimensions = {
                        width: img.width,
                        height: img.height
                    };
                };
                let maskShow = await fetchImage(maskShowURL);
                imageCache.maskShow = maskShow;
                imageCache.maskShowBytes = await fileToByteArray(maskShow);
                img.src = URL.createObjectURL(maskShow);
                img.onload = function() {
                    imageCache.maskShowDimensions = {
                        width: img.width,
                        height: img.height
                    };
                };
            }
        }
        function AddCSS() {
            const style = document.createElement("style");
            document.head.appendChild(style);
            style.sheet.insertRule(`\n        .edui-btn-extra {\n           font-size: 12px;\n           user-select: none;\n           cursor: pointer;\n        }\n    `, style.sheet.cssRules.length);
            style.sheet.insertRule(`\n       \n        .edui-btn-extra:hover {\n            color:#888\n        }\n    `, style.sheet.cssRules.length);
            style.sheet.insertRule(`\n        .mask-upload-area {\n            background-color: rgba(54,54,54,1);\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            z-index: 100;\n            \n        }\n    `, style.sheet.cssRules.length);
            style.sheet.insertRule(`\n        .mask-upload-area .edui-btn {\n            color: white;\n            background-color: rgba(77,77,77,0.72);\n            border-radius: 4px;\n            padding: 5px 10px;\n            cursor: pointer;\n            user-select: none;\n            font-size: 16px;\n            min-width: 100px;\n            text-align: center;\n            min-height: 30px;\n        }\n    `, style.sheet.cssRules.length);
            style.sheet.insertRule(`\n        .preview-container {\n            background-color: #444;\n            border-radius: 4px;\n            border-width: 0px;\n            overflow: hidden;\n            position: absolute;\n            top: 10px;\n            left: 10px;\n            width: 50%;\n            height: calc(100% - 20px);\n        }\n    `, style.sheet.cssRules.length);
            style.sheet.insertRule(`\n        .progress-view {\n            background-color: rgba(54,54,54,1);\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            z-index: 102;\n        }\n    `, style.sheet.cssRules.length);
            style.sheet.insertRule(`\n        .progress-view .progress-bar-container {\n            background-color: #555;\n            position: absolute;\n            top: 50%;\n            left: 10%;\n            width: 80%;\n            height: 20px;\n            transform: translate(0%,-50%);\n        }\n    `, style.sheet.cssRules.length);
            style.sheet.insertRule(`\n        .progress-view .progress-bar {\n            background-color: rgb(255,255,238);\n            height: 100%;\n            width: 0%;\n            transition: width 0.3s;\n        }\n    `, style.sheet.cssRules.length);
            style.sheet.insertRule(`\n        .progress-view .progress-text {\n            position: absolute;\n            top: 40%;\n            left: 50%;\n            transform: translate(-50%,-50%);\n            color: white;\n            \n        }\n    `, style.sheet.cssRules.length);
        }
        let initialized = false;
        const uiNodes = {
            uploadArea: null,
            uploadButton: null,
            fileInput: null,
            cancelButton: null,
            startUploadingButton: null,
            fileInputButton: null,
            previewContainer: null,
            previewImage: null,
            previewVideo: null,
            contentInformation: null,
            contentTitle: null,
            contentSize: null,
            contentType: null,
            contentResolution: null,
            contentFileLoadingLocally: null,
            eduiContainer: null,
            editorBodyContainer: null,
            progressView: null,
            progressBar: null,
            progressText: null
        };
        const innerACFun_data = {
            fileURL: null,
            fileData: null,
            fileType: null,
            fileSize: null,
            fileResolution: null,
            fileName: null
        };
        function fileToObjectURL(file) {
            if (!file) {
                return null;
            }
            return URL.createObjectURL(file);
        }
        function fileToByteArray(file) {
            if (!file) {
                return null;
            }
            return new Promise(((resolve, reject) => {
                let reader = new FileReader;
                reader.onload = function(e) {
                    resolve(new Uint8Array(e.target.result));
                };
                reader.readAsArrayBuffer(file);
            }));
        }
        function formatFileSize(size) {
            let units = [ "B", "KB", "MB", "GB", "TB" ];
            let i = 0;
            while (size > 1024) {
                size = size / 1024;
                i++;
            }
            return `${size.toFixed(2)} ${units[i]}`;
        }
        async function getImageResolution(dataURL) {
            return new Promise(((resolve, reject) => {
                let img = new Image;
                img.onload = function() {
                    resolve({
                        width: img.width,
                        height: img.height
                    });
                };
                img.src = dataURL;
            }));
        }
        async function handleOnFileSelect(e) {
            let file = e.target.files[0];
            if (!file) {
                uiNodes.fileInputButton.style.display = "block";
                return;
            }
            if (file.size > 100 * 1024 * 1024) {
                unsafeWindow.A.emit("global::error", "文件必须在100M以内,放过AC娘吧!");
                uiNodes.fileInputButton.style.display = "block";
                return;
            }
            let fileURL = fileToObjectURL(file);
            innerACFun_data.fileURL = fileURL;
            innerACFun_data.fileData = await fileToByteArray(file);
            let fileSize = e.target.files[0].size;
            innerACFun_data.fileSize = fileSize;
            let fileType = e.target.files[0].type;
            innerACFun_data.fileType = fileType;
            let filename = e.target.files[0].name;
            innerACFun_data.fileName = filename;
            uiNodes.contentTitle.innerText = `文件名：${filename}`;
            uiNodes.contentSize.innerText = `文件大小：${formatFileSize(fileSize)} 字节`;
            uiNodes.contentType.innerText = `文件类型：${fileType}`;
            uiNodes.contentInformation.style.display = "block";
            uiNodes.previewImage.style.display = fileType.includes("image") ? "block" : "none";
            uiNodes.previewVideo.style.display = fileType.includes("video") ? "block" : "none";
            if (fileType.includes("image")) {
                uiNodes.previewImage.src = fileURL;
                let fileResolution = await getImageResolution(fileURL);
                innerACFun_data.fileResolution = fileResolution;
                uiNodes.contentResolution.innerText = `尺寸：${fileResolution.width}x${fileResolution.height}`;
            }
            if (fileType.includes("video")) {
                let video = uiNodes.previewVideo;
                video.src = fileURL;
                video.onloadedmetadata = function() {
                    innerACFun_data.fileResolution = {
                        width: video.videoWidth,
                        height: video.videoHeight
                    };
                    uiNodes.contentResolution.innerText = `尺寸：${video.videoWidth}x${video.videoHeight}`;
                };
            }
            if (!fileType.includes("image") && !fileType.includes("video")) {
                uiNodes.previewImage.style.display = "none";
                uiNodes.previewVideo.style.display = "none";
                uiNodes.contentResolution.innerText = "";
                let ext = filename.split(".").pop().toUpperCase();
                uiNodes.contentType.innerText = `文件类型：${ext}`;
            }
            uiNodes.fileInputButton.style.display = "block";
            if (fileSize < 100 * 1024 * 1024) {
                uiNodes.startUploadingButton.style.display = "block";
            }
        }
        function innerACFun_reset() {
            innerACFun_data.fileData = null;
            innerACFun_data.fileType = null;
            innerACFun_data.fileSize = null;
            innerACFun_data.fileResolution = null;
            innerACFun_data.fileURL = null;
            innerACFun_data.fileName = null;
            uiNodes.fileInput.value = "";
            uiNodes.previewImage.style.display = "none";
            uiNodes.previewVideo.style.display = "none";
            uiNodes.contentInformation.style.display = "none";
            uiNodes.startUploadingButton.style.display = "none";
            uiNodes.previewImage.src = "";
            uiNodes.previewVideo.src = "";
            uiNodes.contentSize.innerText = "";
            uiNodes.contentType.innerText = "";
            uiNodes.contentResolution.innerText = "";
            uiNodes.uploadArea.style.display = "none";
            uiNodes.editorBodyContainer.style.height = "66px";
            setUploadProgress(0);
        }
        function addImageToContainer(url) {
            let bodyContainer = uiNodes.editorBodyContainer;
            let img = document.createElement("img");
            img.src = url;
            bodyContainer.appendChild(img);
        }
        async function startUpload() {
            let acId = util.getCurrentAcId();
            let filename = innerACFun_data.fileName;
            log_log("start uploading", innerACFun_data);
            let bytes = innerACFun_data.fileData;
            let chunks = [];
            let offset = 0;
            log_log(imageCache);
            function getMaxChunkSize(i) {
                return i === 0 ? MAX_CHUNK_SIZE - imageCache.maskShowBytes.byteLength : MAX_CHUNK_SIZE - imageCache.maskImageBytes.byteLength;
            }
            let chunk_count = 0;
            let header = {
                name: filename,
                type: innerACFun_data.fileType,
                size: innerACFun_data.fileSize
            };
            let headerBytes = (new TextEncoder).encode(JSON.stringify(header));
            let headerLength = headerBytes.byteLength;
            showProgressView();
            uiNodes.editorBodyContainer.innerHTML = "";
            let totalSize = 0;
            let i = 0;
            let chunkSizes = [];
            while (offset < bytes.byteLength) {
                let chunkSize = getMaxChunkSize(i) - headerLength - 4;
                if (i === 0) {
                    totalSize += imageCache.maskShowBytes.byteLength + headerLength + headerBytes.byteLength + chunkSize;
                } else {
                    totalSize += imageCache.maskImageBytes.byteLength + chunkSize;
                }
                offset += chunkSize;
                chunkSizes.push(chunkSize);
                i++;
            }
            offset = 0;
            while (offset < bytes.byteLength) {
                let chunkSize = getMaxChunkSize(chunks.length) - headerLength - 4;
                let chunk = bytes.slice(offset, offset + chunkSize);
                if (chunks.length === 0) {
                    let headerLengthBytes = new Uint8Array(new Int32Array([ headerLength ]).buffer);
                    chunk = new Uint8Array([ ...imageCache.maskShowBytes, ...headerLengthBytes, ...headerBytes, ...chunk ]);
                    chunks.push(chunk);
                } else {
                    chunk = new Uint8Array([ ...imageCache.maskImageBytes, ...chunk ]);
                    chunks.push(chunk);
                }
                let chunkBuffer = chunk.buffer;
                let url = await util.uploadImage(acId, chunkBuffer, ((i, total_count) => {
                    let currentChunkSize = chunkSizes[chunk_count];
                    let currentChunkOffset = i / total_count * currentChunkSize;
                    let progress = Math.ceil((currentChunkOffset + offset) / totalSize * 100);
                    setUploadProgress(progress);
                }));
                offset += chunkSize;
                chunk_count++;
                addImageToContainer(url);
                let progress = Math.ceil(offset / totalSize * 100);
                setUploadProgress(progress);
                await new Promise((resolve => {
                    setTimeout(resolve, 0);
                }));
            }
            let p = document.createElement("div");
            p.innerText = "内容仅屏蔽插件用户可见";
            p.style.fontSize = "9px";
            uiNodes.editorBodyContainer.appendChild(p);
            let btn = uiNodes.eduiContainer.querySelector(".btn-send-comment");
            btn.click();
            hideProgressView();
            innerACFun_reset();
        }
        function setUploadProgress(progress) {
            uiNodes.progressBar.style.width = progress + "%";
            uiNodes.progressText.innerText = `上传中...${progress}%`;
        }
        function showProgressView() {
            uiNodes.progressView.style.display = "block";
        }
        function hideProgressView() {
            uiNodes.progressView.style.display = "none";
        }
        function AddUI() {
            if (initialized) {
                return;
            }
            AddCSS();
            let doc = unsafeWindow.document;
            let container = doc.querySelector(".edui-container");
            container.style.position = "relative";
            uiNodes.eduiContainer = container;
            let editorBodyContainer = doc.querySelector(".edui-body-container");
            editorBodyContainer.style.height = "66px";
            editorBodyContainer.style.transition = "height 0.3s";
            uiNodes.editorBodyContainer = editorBodyContainer;
            let uploadArea = doc.createElement("div");
            uploadArea.classList.add("mask-upload-area");
            uploadArea.style.display = "none";
            container.appendChild(uploadArea);
            uiNodes.uploadArea = uploadArea;
            let uploadAreaContent = doc.createElement("div");
            uploadAreaContent.style.position = "relative";
            uploadAreaContent.style.width = "100%";
            uploadAreaContent.style.height = "100%";
            uploadArea.appendChild(uploadAreaContent);
            let cancelButton = doc.createElement("div");
            cancelButton.classList.add("edui-btn");
            cancelButton.innerText = "取消";
            cancelButton.style.position = "absolute";
            cancelButton.style.bottom = "10px";
            cancelButton.style.right = "10px";
            cancelButton.style.width = "100px";
            cancelButton.addEventListener("click", innerACFun_reset);
            uploadAreaContent.appendChild(cancelButton);
            let startUploadButton = doc.createElement("div");
            startUploadButton.classList.add("edui-btn");
            startUploadButton.innerText = "开始上传";
            startUploadButton.style.position = "absolute";
            startUploadButton.style.display = "none";
            startUploadButton.style.bottom = "50px";
            startUploadButton.style.right = "10px";
            startUploadButton.style.width = "100px";
            startUploadButton.addEventListener("click", startUpload);
            uploadAreaContent.appendChild(startUploadButton);
            uiNodes.startUploadingButton = startUploadButton;
            let fileInput = doc.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "image/*,video/*";
            fileInput.style.display = "none";
            fileInput.multiple = false;
            uploadAreaContent.appendChild(fileInput);
            uiNodes.fileInput = fileInput;
            let fileInputButton = doc.createElement("div");
            fileInputButton.classList.add("edui-btn");
            fileInputButton.innerText = "选择文件";
            fileInputButton.style.position = "absolute";
            fileInputButton.style.top = "50%";
            fileInputButton.style.left = "25%";
            fileInputButton.style.zIndex = "101";
            fileInputButton.style.transform = "translate(-50%,-50%)";
            uploadAreaContent.appendChild(fileInputButton);
            fileInputButton.addEventListener("click", (() => {
                fileInput.click();
            }));
            fileInput.addEventListener("change", (async e => {
                fileInputButton.style.display = "none";
                contentFileLoadingLocally.style.display = "block";
                await handleOnFileSelect(e);
                fileInputButton.style.display = "block";
                contentFileLoadingLocally.style.display = "none";
            }));
            uiNodes.fileInputButton = fileInputButton;
            let previewContainer = doc.createElement("div");
            previewContainer.classList.add("preview-container");
            uploadAreaContent.appendChild(previewContainer);
            uiNodes.previewContainer = previewContainer;
            let previewImage = doc.createElement("img");
            previewImage.style.width = "100%";
            previewImage.style.height = "100%";
            previewImage.style.display = "none";
            previewImage.style.objectFit = "contain";
            previewContainer.appendChild(previewImage);
            uiNodes.previewImage = previewImage;
            let contentFileLoadingLocally = doc.createElement("div");
            contentFileLoadingLocally.innerText = "文件加载中……";
            contentFileLoadingLocally.style.position = "absolute";
            contentFileLoadingLocally.style.top = "10px";
            contentFileLoadingLocally.style.left = "10px";
            contentFileLoadingLocally.style.width = "calc(80% - 120px)";
            contentFileLoadingLocally.style.height = "calc(80% - 20px)";
            contentFileLoadingLocally.style.display = "none";
            contentFileLoadingLocally.style.zIndex = "101";
            contentFileLoadingLocally.style.fontSize = "24px";
            uploadAreaContent.appendChild(contentFileLoadingLocally);
            uiNodes.contentFileLoadingLocally = contentFileLoadingLocally;
            let previewVideo = doc.createElement("video");
            previewVideo.style.width = "100%";
            previewVideo.style.height = "100%";
            previewVideo.style.objectFit = "contain";
            previewVideo.style.display = "none";
            previewVideo.controls = true;
            previewContainer.appendChild(previewVideo);
            uiNodes.previewVideo = previewVideo;
            let contentInformation = doc.createElement("div");
            contentInformation.style.position = "absolute";
            contentInformation.style.top = "10px";
            contentInformation.style.right = "10px";
            contentInformation.style.width = "30%";
            contentInformation.style.left = "calc(50% + 20px)";
            contentInformation.style.height = "calc(100% - 20px)";
            contentInformation.style.color = "white";
            contentInformation.style.display = "none";
            uploadAreaContent.appendChild(contentInformation);
            uiNodes.contentInformation = contentInformation;
            let contentTitle = doc.createElement("div");
            contentTitle.innerText = "内容信息";
            contentTitle.style.fontSize = "14px";
            contentTitle.style.padding = "3px";
            contentTitle.style.whiteSpace = "nowrap";
            contentTitle.style.overflow = "hidden";
            contentTitle.style.textOverflow = "ellipsis";
            contentInformation.appendChild(contentTitle);
            uiNodes.contentTitle = contentTitle;
            let contentSize = doc.createElement("div");
            contentSize.innerText = "文件大小：";
            contentSize.style.fontSize = "12px";
            contentSize.style.padding = "3px";
            contentSize.style.whiteSpace = "nowrap";
            contentSize.style.overflow = "hidden";
            contentSize.style.textOverflow = "ellipsis";
            contentInformation.appendChild(contentSize);
            uiNodes.contentSize = contentSize;
            let contentType = doc.createElement("div");
            contentType.innerText = "文件类型：";
            contentType.style.fontSize = "12px";
            contentType.style.padding = "3px";
            contentInformation.appendChild(contentType);
            uiNodes.contentType = contentType;
            let contentResolution = doc.createElement("div");
            contentResolution.innerText = "尺寸：";
            contentResolution.style.fontSize = "12px";
            contentResolution.style.padding = "3px";
            contentInformation.appendChild(contentResolution);
            uiNodes.contentResolution = contentResolution;
            let hintLabel = doc.createElement("div");
            hintLabel.style.position = "absolute";
            hintLabel.style.bottom = "10px";
            hintLabel.style.left = "calc(50% + 20px)";
            hintLabel.style.color = "white";
            hintLabel.style.fontSize = "10px";
            hintLabel.style.whiteSpace = "nowrap";
            hintLabel.innerText = "文件大小限制100M;\n只有插件用户才能查看;\n图片/视频/随便..\n责任声明:每个人对自己的内容负责。\n偷偷的用用，别发违法的东西。\n某虚的封号，就是因为被举报给猴子使用插件了。";
            uploadAreaContent.appendChild(hintLabel);
            let progressView = doc.createElement("div");
            progressView.classList.add("progress-view");
            progressView.style.display = "none";
            container.appendChild(progressView);
            uiNodes.progressView = progressView;
            let progressBarContainer = doc.createElement("div");
            progressBarContainer.classList.add("progress-bar-container");
            progressView.appendChild(progressBarContainer);
            let progressBar = doc.createElement("div");
            progressBar.classList.add("progress-bar");
            progressBarContainer.appendChild(progressBar);
            uiNodes.progressBar = progressBar;
            let progressText = doc.createElement("div");
            progressText.classList.add("progress-text");
            progressText.innerText = "上传中...";
            progressView.appendChild(progressText);
            uiNodes.progressText = progressText;
            let toolbar = doc.querySelector(".edui-btn-toolbar");
            let imageUploadBtn = toolbar.querySelector(".edui-btn-image");
            let btnWrapper = toolbar.querySelector(".button-wrapper");
            let separator = doc.createElement("div");
            separator.classList.add("edui-separator");
            separator.setAttribute("unselectable", "on");
            separator.setAttribute("onmousedown", "return false");
            toolbar.insertBefore(separator, imageUploadBtn.nextSibling);
            let ExtraUploadButton = doc.createElement("div");
            ExtraUploadButton.classList.add("edui-btn");
            ExtraUploadButton.classList.add("edui-btn-extra");
            ExtraUploadButton.innerText = "里区上传";
            toolbar.insertBefore(ExtraUploadButton, separator.nextSibling);
            uiNodes.uploadButton = ExtraUploadButton;
            ExtraUploadButton.addEventListener("click", (() => {
                log_log("clicked");
                uploadArea.style.display = "block";
                editorBodyContainer.style.height = "236px";
            }));
        }
        async function isMaskImage(imageUrl) {
            log_log("check mask 1");
            let dimensions = await getImageResolution(imageUrl);
            log_log("check dim", dimensions, imageCache.maskShowDimensions);
            if (dimensions.width !== imageCache.maskShowDimensions.width || dimensions.height !== imageCache.maskShowDimensions.height) {
                return false;
            }
            let imageBlob = await fetchImage(imageUrl);
            let imageBytes = await fileToByteArray(imageBlob);
            let headLength = imageCache.maskShowBytes.byteLength;
            if (imageBytes.byteLength < headLength + 4 + 20) {
                return false;
            }
            let headBytes = imageBytes.slice(0, headLength);
            let maskHeadBytes = imageCache.maskShowBytes;
            for (let i = 0; i < headLength; i++) {
                if (headBytes[i] !== maskHeadBytes[i]) {
                    return false;
                }
            }
            return true;
        }
        async function extractFileFromImages(imageUrlList) {
            let imageList = [];
            for (let i = 0; i < imageUrlList.length; i++) {
                let blob = await fetchImage(imageUrlList[i]);
                imageList.push(await fileToByteArray(blob));
            }
            let result = [];
            let headLength = imageCache.maskShowBytes.byteLength;
            let shortHeadLength = imageCache.maskImageBytes.byteLength;
            let headerLength = 4;
            let headerLengthBytes = imageList[0].slice(headLength, headLength + 4);
            let headerLengthInt = new Int32Array(headerLengthBytes.buffer)[0];
            let headerBytes = imageList[0].slice(headLength + 4, headLength + 4 + headerLengthInt);
            let header = JSON.parse((new TextDecoder).decode(headerBytes));
            let offset = headLength + 4 + headerLengthInt;
            let chunk = imageList[0].slice(offset);
            let totalSize = chunk.byteLength;
            result.push(chunk);
            for (let i = 1; i < imageList.length; i++) {
                chunk = imageList[i].slice(shortHeadLength);
                result.push(chunk);
                totalSize += chunk.byteLength;
            }
            let merged = new Uint8Array(totalSize);
            let offset2 = 0;
            result.forEach((chunk => {
                merged.set(chunk, offset2);
                offset2 += chunk.byteLength;
            }));
            return {
                info: header,
                data: merged
            };
        }
        function innerACFun_init() {
            log_log("Initializing innerACFun");
            const observer = new MutationObserver((mutations => {
                mutations.forEach((mutation => {
                    mutation.addedNodes.forEach((node => {
                        if (node.classList && node.classList.contains("area-editor")) {
                            setTimeout((() => {
                                AddUI();
                                observer.disconnect();
                            }), 100);
                        }
                    }));
                }));
            }));
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            getMasks();
        }
        const innerACFun = {
            init: innerACFun_init,
            isMaskImage,
            extractFileFromImages
        };

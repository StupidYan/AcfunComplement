        function setCookie(cName, cValue, expDays) {
            let date = new Date;
            date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1e3);
            const expires = "expires=" + date.toUTCString();
            window.document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
        }
        let ajax = {};
        ajax.x = function() {
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest;
            }
            let versions = [ "MSXML2.XmlHttp.6.0", "MSXML2.XmlHttp.5.0", "MSXML2.XmlHttp.4.0", "MSXML2.XmlHttp.3.0", "MSXML2.XmlHttp.2.0", "Microsoft.XmlHttp" ];
            let xhr;
            for (let i = 0; i < versions.length; i++) {
                try {
                    xhr = new ActiveXObject(versions[i]);
                    break;
                } catch (e) {}
            }
            return xhr;
        };
        ajax.send = function(url, callback, method, data, headers, async) {
            if (typeof async == "undefined") {
                async = true;
            }
            let x = ajax.x();
            x.open(method, url, async);
            x.onreadystatechange = function() {
                if (x.readyState === 4) {
                    callback(x.responseText);
                }
            };
            if (method === "POST") {
                x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            }
            if (typeof headers !== "undefined") {
                for (let h in headers) {
                    x.setRequestHeader(h, headers[h]);
                }
            }
            x.send(data);
        };
        ajax.get = function(url, data, callback, headers, async) {
            let query = [];
            for (let key in data) {
                query.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
            }
            ajax.send(url + (query.length ? "?" + query.join("&") : ""), callback, "GET", null, headers, async);
        };
        ajax.post = function(url, data, callback, headers, async) {
            let query = [];
            for (let key in data) {
                query.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
            }
            ajax.send(url, callback, "POST", query.join("&"), headers, async);
        };

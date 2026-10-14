        function encode(a) {
            return a;
        }
        function util_decode(a) {
            return a;
        }
        function check() {
            let unsafeWindow = window;
            if (typeof unsafeWindow.A === "undefined") {
                unsafeWindow.A = (t, m) => {
                    log_log(t, m);
                };
            }
        }

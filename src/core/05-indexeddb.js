        class IndexedDBHelper {
            constructor(dbName, storeName) {
                this.dbName = dbName;
                this.storeName = storeName;
                this.db = null;
            }
            open() {
                return new Promise(((resolve, reject) => {
                    if (this.db) {
                        resolve(this.db);
                        return;
                    }
                    const request = indexedDB.open(this.dbName, 1);
                    request.onupgradeneeded = event => {
                        let db = event.target.result;
                        db.createObjectStore(this.storeName);
                    };
                    request.onsuccess = event => {
                        this.db = event.target.result;
                        resolve(this.db);
                    };
                    request.onerror = event => {
                        reject("IndexedDB error: " + event.target.errorCode);
                    };
                }));
            }
            save(key, value) {
                return new Promise(((resolve, reject) => {
                    this.open().then((db => {
                        const transaction = db.transaction([ this.storeName ], "readwrite");
                        const store = transaction.objectStore(this.storeName);
                        const request = store.put(value, key);
                        request.onsuccess = () => resolve();
                        request.onerror = event => reject("Save error: " + event.target.errorCode);
                    })).catch(reject);
                }));
            }
            load(key) {
                return new Promise(((resolve, reject) => {
                    this.open().then((db => {
                        const transaction = db.transaction([ this.storeName ]);
                        const store = transaction.objectStore(this.storeName);
                        const request = store.get(key);
                        request.onsuccess = () => resolve(request.result);
                        request.onerror = event => reject("Load error: " + event.target.errorCode);
                    })).catch(reject);
                }));
            }
            count() {
                return new Promise(((resolve, reject) => {
                    this.open().then((db => {
                        const transaction = db.transaction([ this.storeName ]);
                        const store = transaction.objectStore(this.storeName);
                        const request = store.count();
                        request.onsuccess = () => resolve(request.result);
                        request.onerror = event => reject("Load error: " + event.target.errorCode);
                    })).catch(reject);
                }));
            }
            clearAll() {
                return new Promise(((resolve, reject) => {
                    this.open().then((db => {
                        const transaction = db.transaction([ this.storeName ], "readonly");
                        const store = transaction.objectStore(this.storeName);
                        const countRequest = store.count();
                        countRequest.onsuccess = () => {
                            const count = countRequest.result;
                            const deleteTransaction = db.transaction([ this.storeName ], "readwrite");
                            const deleteStore = deleteTransaction.objectStore(this.storeName);
                            const clearRequest = deleteStore.clear();
                            clearRequest.onsuccess = () => {
                                console.log("All data cleared from the store");
                                resolve(count);
                            };
                            clearRequest.onerror = event => {
                                reject("Error in clearing store: " + event.target.errorCode);
                            };
                        };
                        countRequest.onerror = event => {
                            reject("Error in counting store items: " + event.target.errorCode);
                        };
                    })).catch(reject);
                }));
            }
        }
        const dbHelper = new IndexedDBHelper("MyTestDatabase", "keyValuePairs");
        const safeIfarme = document.createElement("iframe");
        safeIfarme.style.display = "none";
        document.body.appendChild(safeIfarme);
        const util_XMLHttpRequest = safeIfarme.contentWindow.XMLHttpRequest;
        let xhttp = typeof GM_xmlhttpRequest !== "undefined" ? GM_xmlhttpRequest : GM.xmlHttpRequest;

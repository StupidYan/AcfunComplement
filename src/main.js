        let dev_version = js_data.version;
        let downloaderVersion = GM_info.script.version;
        log_log(`下载器版本：v${downloaderVersion} 插件版本：v${dev_version} `);
        let pageType = getPageType();
        ui.loadUI(pageType);
        executeTask(pageType);
        log_log("尝试同步。。。");
        synchroize.init();
        synchroize.SyncWithCloud();
        banana.support();
        unsafeWindow.sendBanana = banana.feedBanana;
        unsafeWindow.getArticleList = banana.getRecentContent;
        unsafeWindow.getUDID = banana.getUDID;
        unsafeWindow.search = commentRecovery.searchCacheByKeyword;
        unsafeWindow["搜索"] = commentRecovery.searchCacheByKeyword;
        unsafeWindow.debug = {
            data: js_data
        };

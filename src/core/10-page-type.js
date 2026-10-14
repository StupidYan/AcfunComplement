        function getPageType() {
            let pageUrl = window.location.href.replace("/#/g", "");
            let dict1 = {
                "www.acfun.cn/v/list1/index.htm": "动画",
                "www.acfun.cn/v/list60/index.htm": "娱乐",
                "www.acfun.cn/v/list201/index.htm": "生活",
                "www.acfun.cn/v/list58/index.htm": "音乐",
                "www.acfun.cn/v/list123/index.htm": "舞蹈·偶像",
                "www.acfun.cn/v/list59/index.htm": "游戏",
                "www.acfun.cn/v/list70/index.htm": "科技",
                "www.acfun.cn/v/list68/index.htm": "影视",
                "www.acfun.cn/v/list69/index.htm": "体育",
                "www.acfun.cn/v/list125/index.htm": "鱼塘",
                "www.acfun.cn/v/list76/index.htm": "广而告之"
            };
            let dict2 = {
                "www.acfun.cn/u/3216851": "中国日报",
                "www.acfun.cn/u/9755346": "环球时报",
                "www.acfun.cn/u/14194071": "中国网",
                "www.acfun.cn/u/16591709": "法治进行时",
                "www.acfun.cn/u/14706221": "浙样红TV",
                "www.acfun.cn/u/12786860": "新青年工作室",
                "www.acfun.cn/u/16141705": "新华社现场云",
                "www.acfun.cn/u/20143211": "快手",
                "www.acfun.cn/u/13423227": "小央视频",
                "www.acfun.cn/u/30169313": "人民资讯",
                "www.acfun.cn/v/list178/index.htm": "AC正义展览区",
                "www.acfun.cn/bangumilist": "番剧列表",
                "www.acfun.cn/v/list67/index.htm": "TV动画",
                "www.acfun.cn/v/list180/index.htm": "剧场动画",
                "www.acfun.cn/v/list120/index.htm": "国产动画",
                "www.acfun.cn/v/list106/index.htm": "动画综合",
                "www.acfun.cn/v/list190/index.htm": "短片·手书·配音",
                "www.acfun.cn/v/list107/index.htm": "MAD·AMV",
                "www.acfun.cn/v/list108/index.htm": "MMD·3D",
                "www.acfun.cn/v/list207/index.htm": "虚拟偶像",
                "www.acfun.cn/v/list159/index.htm": "动画资讯",
                "www.acfun.cn/v/list133/index.htm": "COSPLAY·声优",
                "www.acfun.cn/v/list99/index.htm": "特摄",
                "www.acfun.cn/v/list212/index.htm": "番剧二创",
                "www.acfun.cn/v/list206/index.htm": "搞笑",
                "www.acfun.cn/v/list87/index.htm": "鬼畜",
                "www.acfun.cn/v/list188/index.htm": "明星",
                "www.acfun.cn/v/list86/index.htm": "生活日常",
                "www.acfun.cn/v/list88/index.htm": "萌宠",
                "www.acfun.cn/v/list89/index.htm": "美食",
                "www.acfun.cn/v/list204/index.htm": "旅行",
                "www.acfun.cn/v/list127/index.htm": "手工·绘画",
                "www.acfun.cn/v/list205/index.htm": "美妆·造型",
                "www.acfun.cn/v/list215/index.htm": "治愈系",
                "www.acfun.cn/v/list136/index.htm": "原创·翻唱",
                "www.acfun.cn/v/list137/index.htm": "演奏·乐器",
                "www.acfun.cn/v/list103/index.htm": "Vocaloid",
                "www.acfun.cn/v/list139/index.htm": "综合音乐",
                "www.acfun.cn/v/list185/index.htm": "音乐选集·电台",
                "www.acfun.cn/v/list218/index.htm": "颜值",
                "www.acfun.cn/v/list134/index.htm": "宅舞",
                "www.acfun.cn/v/list135/index.htm": "综合舞蹈",
                "www.acfun.cn/v/list129/index.htm": "偶像",
                "www.acfun.cn/v/list208/index.htm": "中国舞",
                "www.acfun.cn/v/list214/index.htm": "王者荣耀",
                "www.acfun.cn/v/list210/index.htm": "我的世界",
                "www.acfun.cn/v/list216/index.htm": "和平精英",
                "www.acfun.cn/v/list217/index.htm": "第五人格",
                "www.acfun.cn/v/list85/index.htm": "英雄联盟",
                "www.acfun.cn/v/list145/index.htm": "电子竞技",
                "www.acfun.cn/v/list186/index.htm": "网络游戏",
                "www.acfun.cn/v/list84/index.htm": "主机单机",
                "www.acfun.cn/v/list187/index.htm": "手机游戏",
                "www.acfun.cn/v/list165/index.htm": "桌游卡牌",
                "www.acfun.cn/v/list209/index.htm": "手办模玩",
                "www.acfun.cn/v/list90/index.htm": "科技制造",
                "www.acfun.cn/v/list189/index.htm": "人文科普",
                "www.acfun.cn/v/list122/index.htm": "汽车",
                "www.acfun.cn/v/list91/index.htm": "数码家电",
                "www.acfun.cn/v/list151/index.htm": "演讲·公开课",
                "www.acfun.cn/v/list149/index.htm": "广告",
                "hd.acfun.cn/s/QpdpZsjR": "放映厅",
                "www.acfun.cn/v/list219/index.htm": "影视混剪",
                "www.acfun.cn/v/list192/index.htm": "预告·花絮",
                "www.acfun.cn/v/list193/index.htm": "电影杂谈",
                "www.acfun.cn/v/list194/index.htm": "追剧社",
                "www.acfun.cn/v/list195/index.htm": "综艺show",
                "www.acfun.cn/v/list196/index.htm": "纪录片·短片",
                "www.acfun.cn/v/list152/index.htm": "综合体育",
                "www.acfun.cn/v/list94/index.htm": "足球",
                "www.acfun.cn/v/list95/index.htm": "篮球",
                "www.acfun.cn/v/list153/index.htm": "搏击健身",
                "www.acfun.cn/v/list93/index.htm": "极限竞速",
                "www.acfun.cn/v/list183/index.htm": "普法安全",
                "www.acfun.cn/v/list92/index.htm": "国防军事",
                "www.acfun.cn/v/list131/index.htm": "历史",
                "www.acfun.cn/v/list132/index.htm": "新鲜事·正能量",
                "www.acfun.cn/v/list184/index.htm": "二次元画师",
                "www.acfun.cn/v/list110/index.htm": "综合",
                "www.acfun.cn/v/list73/index.htm": "生活情感",
                "www.acfun.cn/v/list164/index.htm": "游戏",
                "www.acfun.cn/v/list74/index.htm": "动漫文化",
                "www.acfun.cn/v/list75/index.htm": "漫画·文学",
                "www.acfun.cn/v/list63/index.htm": "文章"
            };
            let videoHomes = [ "动画综合", "短片·手书·配音", "MAD·AMV", "MMD·3D", "虚拟偶像", "动画资讯", "COSPLAY·声优", "特摄", "番剧二创", "搞笑", "鬼畜", "明星", "生活日常", "萌宠", "美食", "旅行", "手工·绘画", "美妆·造型", "治愈系", "原创·翻唱", "演奏·乐器", "Vocaloid", "综合音乐", "音乐选集·电台", "颜值", "宅舞", "综合舞蹈", "偶像", "中国舞", "王者荣耀", "我的世界", "和平精英", "第五人格", "英雄联盟", "电子竞技", "网络游戏", "主机单机", "手机游戏", "桌游卡牌", "手办模玩", "科技制造", "人文科普", "汽车", "数码家电", "演讲·公开课", "广告", "放映厅", "影视混剪", "预告·花絮", "电影杂谈", "追剧社", "综艺show", "纪录片·短片", "综合体育", "足球", "篮球", "搏击健身", "极限竞速", "普法安全", "国防军事", "历史", "新鲜事·正能量", "二次元画师" ];
            let articleHome = [ "二次元画师", "综合", "生活情感", "游戏", "动漫文化", "漫画·文学", "文章" ];
            let href = pageUrl;
            if (href === "http://www.acfun.cn/" || href === "https://www.acfun.cn/") {
                return "HOME";
            }
            let regex = /https?:\/\/www\.acfun\.cn\/([av])\/ac\d+/;
            let regex2 = /www\.acfun\.cn\/.*/;
            let test = regex.exec(href);
            let test2 = regex2.exec(href);
            if (test !== null) {
                if (test[1] === "a") {
                    return "ARTICLE";
                }
                if (test[1] === "v") {
                    return "VIDEO";
                }
            }
            let hrefPart = test2[0];
            let pageTitle = dict1[hrefPart];
            if (typeof pageTitle !== "undefined" && pageTitle !== null) {
                return "VIDEO_HOME";
            }
            let regexAS = /www\.acfun\.cn\/v\/as(\d+)/;
            let testAS = regexAS.exec(href);
            if (testAS) {
                let num = parseInt(testAS[1]);
                if (num > 0) {
                    return "ARTICLE_HOME";
                }
            }
            pageTitle = dict2[hrefPart];
            if (typeof pageTitle !== "undefined" && pageTitle !== null) {
                if (videoHomes.indexOf(pageTitle) >= 0) {
                    return "VIDEO_HOME";
                }
                if (articleHome.indexOf(pageTitle) >= 0) {
                    return "ARTICLE_HOME";
                }
                return "OTHER";
            } else {
                return "OTHER";
            }
        }

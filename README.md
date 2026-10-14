# AcfunComplement(AcFun 屏蔽插件 · 补全计划)

帮助你在 AcFun 弹幕视频网屏蔽不想看的 UP 主、关键词、评论者。基于原作者 [baldhumanity/AcfunComplement](https://github.com/baldhumanity/AcfunComplement) 的开源版延续维护(GPL-3.0)。

> 当前版本:**3.064** ｜ 适用:桌面版 www.acfun.cn ｜ 需要 Tampermonkey(油猴)等用户脚本管理器

## 功能一览

| 功能 | 状态 | 说明 |
|---|---|---|
| 屏蔽 UP 主(投稿列表) | ✅ 可用 | 列表条目右上角红色按钮点击屏蔽;支持名字 + **UID 双重屏蔽,UP 改名也有效** |
| 屏蔽关键词 | ✅ 可用 | 标题含关键词的投稿直接隐藏 |
| 屏蔽评论者 | ✅ 可用 | 评论区每条评论旁的"屏蔽"小字 |
| 评论区用户标签 | ✅ 可用 | 给评论用户打私人标签 |
| 查看被删除评论 | ✅ 可用 | 本地缓存 + 社区共享恢复 |
| 文章预加载屏蔽 | ✅ 可用 | 打开前下载正文检查关键词,命中直接隐藏 |
| 云同步 | ✅ 可用 | 屏蔽名单跨设备同步(原作者服务器) |
| 屏蔽排行榜 | ✅ 可用 | 一键采用大家屏蔽最多的 UP / 关键词 / 评论家 |
| 投稿页左侧屏蔽按钮 | ✅ 可用 | 视频 / 文章内页一键屏蔽当前 UP |
| 里区内容解码 | ✅ 可用 | 评论图片隐写内容还原 |
| 视频页新版评论区适配 | ⏳ 待适配 | AcFun 视频页评论已换新系统,暂不支持(文章页评论正常) |
| UID 名单云同步 | ⏳ 待做 | UID 屏蔽仅存本地,换设备后退化为按名字匹配 |

## 安装

1. 浏览器安装 [Tampermonkey](https://www.tampermonkey.net/) 扩展;
2. 点击仓库中的 [`acfunBlock-opensource.user.js`](https://raw.githubusercontent.com/StupidYan/AcfunComplement/master/acfunBlock-opensource.user.js) → Tampermonkey 会自动弹出安装页 → 点"安装";
3. 打开 AcFun 任意页面,左侧出现粉色助手图标即安装成功。

## 仓库文件说明(哪些有用、哪些可以忽略)

| 文件 / 目录 | 用途 | 需要关心吗 |
|---|---|---|
| `acfunBlock-opensource.user.js` | **发布文件,安装就用它** | ⭐ 核心 |
| `src/` | 源码,30 个功能模块(`core/` 基础设施、`extractors/` 页面抓取、`features/` 功能、`ui/` 界面) | 改功能只动这里 |
| `build.js` + `build.manifest.json` | 零依赖构建:把 `src/` 按固定顺序拼接成单文件脚本 | 开发需要 |
| `dist/acfunBlock-opensource.user.js` | 构建产物(与根目录发布文件同步) | 一般不用直接碰 |
| `baseline/` | 重构前的 3.063 基线,用于逐字节比对验证 | 可忽略 |
| `tools/split.js` | 当初把单文件切成模块的一次性脚本 | 可忽略 |
| `acfunBlock.user.js` | 原作者仓库遗留的旧版脚本,**未维护** | ❌ 不要安装这个 |
| `LICENSE` | GPL-3.0,衍生作品须继续开源 | — |

## 开发指南

```bash
# 修改 src/ 下任意模块后,重新构建:
node build.js
# 产物: dist/acfunBlock-opensource.user.js
# 验证: node --check dist/acfunBlock-opensource.user.js
```

注意事项:

- `build.manifest.json` 里的模块顺序**不能调整**——所有模块拼接进同一个 IIFE,顺序即执行顺序;
- `src/legacy/` 是原作者 webpack 打包骨架,保持原样,不要手改;
- 新增功能时在对应模块内追加代码,或新建模块并登记进 `build.manifest.json`(追加到语义正确的位置)。

## 本仓库相对上游的修复与改进(3.061 ~ 3.064)

- **分区列表页适配**:AcFun 改版后(广而告之等分区换成新版列表结构),屏蔽按钮失效 → 新增新版结构抓取器,新老结构兼容;
- **UID 屏蔽体系**:所有屏蔽入口同时记录用户 UID,UP 主改名后依然有效;取消屏蔽双向清理;
- **修复视频页崩溃**:评论模式检测缺失导致整个评论模块(屏蔽/标签/评论恢复)抛异常;
- **修复文章评论区按钮不出现**:评论组件外层包裹变化导致监听器触发条件失配;
- **修复预加载**:AcFun 移动站并站导致下载全部失败并无限重试刷屏 → 改用桌面版地址 + 失败退避(每篇每次会话最多重试一次);
- **修复屏蔽残留**:被屏蔽条目残留 0.7px 边框线导致列表高度不正常,取消屏蔽后高度卡死 → 屏蔽时边框归零,恢复时清理内联样式。

## 许可证

GPL-3.0。本仓库为 [baldhumanity/AcfunComplement](https://github.com/baldhumanity/AcfunComplement) 的衍生作品,原作者:人文情怀。感谢原作者的长期维护。

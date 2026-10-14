// 阶段1一次性切割脚本:把 acfunblock.js 按功能边界切到 src/ 模块
// 段拼接顺序 === 原文行顺序,保证 build 产物与原文逐字节等价
"use strict";
const fs = require("fs");
const path = require("path");

const SRC_FILE = "acfunblock.js";
// [目标文件, 起始行, 结束行] 行号 1-based 含端点(基于 baseline/AcfunBlock-3.063.user.js)
const manifest = [
    ["src/meta.user.js", 1, 35],
    ["src/legacy/01-webpack-runtime.js", 36, 226],
    ["src/core/02-bootstrap.js", 227, 302],
    ["src/features/03-edge-detector.js", 303, 370],
    ["src/core/04-encode-check.js", 371, 384],
    ["src/core/05-indexeddb.js", 385, 475],
    ["src/core/06-http.js", 476, 627],
    ["src/core/07-util.js", 628, 712],
    ["src/core/08-storage.js", 713, 1154],
    ["src/core/09-js-data.js", 1155, 1374],
    ["src/core/10-page-type.js", 1375, 1519],
    ["src/ui/11-main-ui.js", 1520, 1522],
    ["src/core/12-bus.js", 1523, 1583],
    ["src/features/13-inner-acfun.js", 1584, 2159],
    ["src/features/14-comment-ui.js", 2160, 2428],
    ["src/features/15-comment-recovery.js", 2429, 2861],
    ["src/ui/16-setting-ui.js", 2862, 3206],
    ["src/ui/17-content-page-ui.js", 3207, 3321],
    ["src/features/18-filter-core.js", 3322, 3601],
    ["src/ui/19-ui.js", 3602, 3754],
    ["src/features/20-home-repair.js", 3755, 3829],
    ["src/extractors/21-extractors.js", 3830, 4129],
    ["src/features/22-tagging.js", 4130, 4356],
    ["src/features/23-comment-imagefy.js", 4357, 4722],
    ["src/features/24-content-task.js", 4723, 4949],
    ["src/features/25-sync.js", 4950, 5216],
    ["src/core/26-ajax.js", 5217, 5272],
    ["src/features/27-banana.js", 5273, 5390],
    ["src/main.js", 5391, 5408],
    ["src/legacy/99-iife-close.js", 5409, 5410],
];

const content = fs.readFileSync(SRC_FILE, "utf8");
const lines = content.split("\n"); // CRLF: 每行尾部自带 \r,join("\n") 可字节还原

for (const [file, a, b] of manifest) {
    const seg = lines.slice(a - 1, b).join("\n");
    const withEol = b < lines.length ? seg + "\n" : seg;
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, withEol);
    console.log(`${file}: ${b - a + 1} 行`);
}
fs.writeFileSync("build.manifest.json", JSON.stringify(manifest.map(m => m[0]), null, 2));
console.log(`共 ${manifest.length} 段, 原文 ${lines.length} 行元素`);

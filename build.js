// 零依赖构建:按 manifest 顺序拼接 src/ 模块为单文件用户脚本
"use strict";
const fs = require("fs");

const MANIFEST = "build.manifest.json";
const OUT = "dist/acfunBlock-opensource.user.js";

const files = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
const buffers = files.map(f => fs.readFileSync(f));
fs.writeFileSync(OUT, Buffer.concat(buffers));
console.log(`build done: ${OUT} (${files.length} 模块, ${Buffer.concat(buffers).length} 字节)`);

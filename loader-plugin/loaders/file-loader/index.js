const loaderUtils = require("loader-utils"); // 它提供了许多有用的工具。

// 需要处理图片、字体等文件。它们都是buffer数据
// 需要使用 row loader
module.exports = function (content) {
  // 1、根据文件内容生成带hash值文件名
  // 根据文件内容生产一个新的文件名称
  let filename = loaderUtils.interpolateName(this, "[hash].[ext][query]", {
    content,
  });
  filename = `images/${filename}`;
  console.log("\n========>", filename);

  // 2、将文件输出出去
  this.emitFile(filename, content);
  // 3、返回：module.exports = "文件路径(文件名)"
  return `module.exports = "${filename}"`;
};
module.exports.raw = true; // 开启 Raw Loader

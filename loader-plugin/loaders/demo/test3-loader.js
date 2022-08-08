// Raw loader 

/**
 * 默认情况下，资源文件会被转化为 UTF-8 字符串(content)，如js/css。
 * 开启后，接收到的content 是Buffer数据，如处理图片/字体图标等资源的时候，可以使用。
 */


module.exports = function (content, map, meta) {
  console.log("\n test3-loader==========", content, map, meta);
  return content;
};
module.exports.raw = true; // 开启 Raw Loader

// pitch  loader
// webpack 会先从左到右执行 loader 链中的每个 loader 上的 pitch 方法（如果有），
// 然后再从右到左执行 loader 链中的每个 loader 上的普通 loader 方法。

module.exports = function (content, map, meta) {
  console.log("\n test4-loader==========", content, map, meta);
  return content;
};


// 先执行
module.exports.pitch = function (remainingRequest, precedingRequest, data) {
  console.log(
    "\n pitch loader 4 ==========",
    remainingRequest,
    "||||||",
    precedingRequest,
    "||||||",
    data
  );
};

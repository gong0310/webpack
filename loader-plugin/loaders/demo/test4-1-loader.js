// pitch  loader

module.exports = function (content, map, meta) {
  console.log("\n test4-1-loader==========", content, map, meta);
  return content;
};
module.exports.pitch = function (remainingRequest, precedingRequest, data) {
  console.log(
    "\n pitch loader 4-1 ==========",
    remainingRequest,
    "||||||",
    precedingRequest,
    "||||||",
    data
  );
  // return "aaa";
  // 在这个过程中如果任何 pitch 有返回值，则 loader 链被阻断。
  // webpack 会跳过后面所有loader的 pitch方法 和 loader的本身的normal(普通)方法，直接进入上一个 loader的normal方法 。
};

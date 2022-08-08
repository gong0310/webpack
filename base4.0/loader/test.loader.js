const rules = require("./rules.json");

const testLoader = function (content, map, meta) {
  const option = this.getOptions(rules); // 可规则校验
  console.log("========同步oader", option, content);
  //   return content;
  //   this.callback(null, content, map, meta);

  const callback = this.async();
  setTimeout(() => {
    console.log("=========异步oader");
    callback(null, content, map, meta);
  }, 1000);
};
testLoader.pitch = function (remainingRequest) {
  console.log("=========patch");
};
// testLoader.raw = true; // 开启 Raw Loader content是一个Buffer数据，默认情况下，资源文件会被转化为 UTF-8 字符串

module.exports = testLoader;

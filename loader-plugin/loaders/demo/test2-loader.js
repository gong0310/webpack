// 异步loader

module.exports = function (content, map, meta) {
  const callback = this.async();
  meta="我是test2-loader传过去的"

  setTimeout(() => {
    // 等待1秒后再执行test2-loader test1-loader test-loader，会等待执行完test2-loader再执行其他loader
    console.log("\n test2-loader==========", content, map, meta);
    callback(null, content, map, meta);
  }, 1000);
};

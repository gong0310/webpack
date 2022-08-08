// 同步loader

// 写法1，适用于单个loader
// module.exports = function (content, map, meta) {
//   return content;
// };

// 写法2
module.exports = function (content, map, meta) {
  /**
   * 第一个参数： err 代表是否有错误
   * 第二个参数： content 处理后的内容
   * 第三个参数： 传递map，让source-map不中断
   * 第四个参数： 传递meta，让下一个loader接收到其他参数
   */

  console.log("\n test1-loader==========", content, map, meta);
  this.callback(null, content, map, meta);

  // 报错，因为下面代码不是异步，是同步，不会等待执行，会认为返回undefined，下一个loader content为undefined，出问题
  // 所以 同步loader中不能进行异步操作
  // setTimeout(() => {
  //   console.log("\n test1-loader==========", content, map, meta);
  //   this.callback(null, content, map, meta);
  // }, 1000);
};

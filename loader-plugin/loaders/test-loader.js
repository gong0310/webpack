/**
 * loader就是一个函数
 * 当webpack解析资源的时候，会调用相应的loader去处理
 * loader接收到文件内容作为参数，返回内容出去
 * @param content 文件内容
 * @param map sourceMap
 * @param meta 别的loader传递的数据
 */
module.exports = function (content, map, meta) {
  console.log("\n test-loader==========", content, map, meta);

  return content;
};

// loader的实现很像是一个纯函数，输入一个文件，输出转换后的内容给下一个loader或者交给webpack处理，
// 但loader不是纯函数，主要有两个原因：

// 一是loader有执行上下文(context)，也就是通过this访问内置的属性和方法，以实现特定的功能；
// 二是loader的return语句不一定有返回。
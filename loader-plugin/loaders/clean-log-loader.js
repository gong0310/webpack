module.exports = function (content) {
  // 将console.log替换为空
  return content.replace(/console\.log\(.*\);?/g, "");
};

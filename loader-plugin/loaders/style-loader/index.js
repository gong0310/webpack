module.exports = function (content) {
  // const script = `
  //   const styleEl = document.createElement("style");
  //   styleEl.innerHTML = ${JSON.stringify(content)};
  //   document.head.appendChild(styleEl)
  // `;
  // return script;
};

module.exports.pitch = function (remainingRequest, precedingRequest, data) {
  // remainingRequest 剩下还需要处理的loader(处了自身)
  console.log(
    "\n style loader ==========",
    remainingRequest, // C:\Users\v_zpgong\Desktop\study\webpack5\loader\node_modules\css-loader\dist\cjs.js!C:\Users\v_zpgong\Desktop\study\webpack5\loader\src\css\index.css
    "||||||",
    precedingRequest,
    "||||||",
    data
  );
  // 1、将remainingRequest中的绝对路径改为相对路径（因为后面只有使用相对路径操作）
  //  希望得到：../../node_modules/css-loader/dist/cjs.js!./index.css
  const relativeRequest = remainingRequest
    .split("!")
    .map((absolutePath) => {
      // 将路径转化为相对路径
      const relativePath = this.utils.contextify(this.context, absolutePath);
      return relativePath;
    })
    .join("!");
  // 2、引入css-loader处理后的资源
  // 3、创建style，将内容插入页面中生效
  const script = `
    import style from "!!${relativeRequest}"
    const styleEl = document.createElement("style");
    styleEl.innerHTML = style;
    document.head.appendChild(styleEl)
  `;
  return script;
};

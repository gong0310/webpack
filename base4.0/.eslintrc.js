module.exports = {
  // 继承 Eslint 规则
  extends: ["eslint:recommended"],
  parser: "@babel/eslint-parser", // 支持最新的最终 ECMAScript 标准
  env: {
    node: true, // 启用node中全局变量
    browser: true, // 启用浏览器中全局变量，否则不认识window、navigator等
    es6: true, // 启用es6语法
  },
  parserOptions: {
    ecmaVersion: 6, // es6
    sourceType: "module", // es module
    requireConfigFile: false,
  },
  rules: {
    "no-var": 2, // 不能使用 var 定义变量
  },
  plugins: ["import"], // 解决动态导入import语法报错问题 --> 实际使用eslint-plugin-import的规则解决的
};

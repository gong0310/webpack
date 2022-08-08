module.exports = {
  // @babel/preset-react：一个用来编译 React jsx 语法的预设
  // @babel/preset-typescript：一个用来编译 TypeScript 语法的预设
  // 智能预设，编译es6语法，如箭头函数，扩展运算符等。这样一些旧版本浏览器也能运行
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage", // 按需加载core-js的polyfill
        corejs: { version: "3", proposals: true }, // core-js 是专门用来做 ES6 以及以上 API 的 polyfill
      }, //此时就会自动根据我们代码中使用的语法，来按需加载相应的 polyfill 了。
    ],
  ],
};

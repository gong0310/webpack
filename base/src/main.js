import count from "./js/count";
// import divide from "./js/divide";
import { mul } from "./js/math"; // 只会打包mul，移除 JavaScript 中的没有使用上的代码
// 想要webpack打包资源，必须引入该资源
import "./css/index.css"; //默认打包报错，要使用css-loader
import "./less/index.less"; //默认打包报错，要使用less-loader
import "./sass/index.sass"; //默认打包报错，要使用sass-loader
import "./sass/index.scss"; //默认打包报错，要使用sass-loader
import "./styl/index.styl"; //默认打包报错，要使用stylus-loader
import "./fonts/iconfont.css"; //默认打包报错，要使用stylus-loader
console.log(count(2, 1));

console.log(mul(5, 6));

// 判断是否支持(HMR/热模块替换)功能
if (module.hot) {
  module.hot.accept("./js/count.js");
  // module.hot.accept("./js/divide.js");
}

// 渐进式网络应用程序(progressive web application - PWA)
// 在 离线(offline) 时应用程序能够继续运行功能
// 内部通过 Service Workers 技术实现的。
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

// 如果是多入口，splitChunks提取公共模块打包
console.log("hello main");
import { sum } from "./common";
console.log(sum(200, 3));

// 按需动态加载
document.getElementById("btn").onclick = function () {
  // 动态导入 --> 实现按需加载
  // 即使只被引用了一次，也会代码分割
  // import动态导入，会将动态导入的文件代码分割（拆分单独的模块），在需要使用的时候自动加载
  import(/* webpackChunkName: "divide" */ "./js/divide")
    // webpackChunkName: "divide"：这是webpack动态导入模块命名的方式
    // "divide"将来就会作为[name]的值显示。
    .then((res) => {
      console.log("模块加载成功", res);
      console.log(res.default(100, 10));
    })
    .catch((err) => {
      console.log("模块加载失败", err);
    });
};

/**
 * babel 对 js 代码进行了兼容性处理，其中使用@babel/preset-env 智能预设来处理兼容性问题。
 * 它能将 ES6 的一些语法进行编译转换，比如箭头函数、点点点运算符等。
 * 但是如果是 async 函数、promise 对象、数组的一些方法（includes）等，它没办法处理。
 * core-js 是专门用来做 ES6 以及以上 API 的 polyfill
 */
// import "core-js";
new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, 1000);
});

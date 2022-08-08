import "./test.json";
import "@/test.less"; // 配置解析模块路径别名
// import "./test"
import $ from "jquery";
console.log("$=>", $);

function add(...agrs) {
  return agrs.reduce((p, c) => p + c, 0);
}
console.log(add(1, 2, 3, 4, 5, 6));

new Promise((reslove) => {
  setTimeout(() => {
    reslove();
  }, 1000);
});

if (module.hot) {
  module.hot.accept("./test.js", function () {});
}

// webpackPrefetch，预加载
// 正常加载：并行加载（同一时间加载多个文件）
// Prefetch预加载：等其他资源加载完毕，浏览器空闲了，再偷偷加载资源
// 懒加载：当文件使用时才加载
document.querySelector(".box").onclick = function () {
  import(/* webpackChunkName: 'test',webpackPrefetch: true */ "./test").then(
    (res) => {
      console.log("懒加载test", res);
    }
  );
};

// 注册serviceworkers
if ("serviceworker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceworker
      .register("/service-worker.js")
      .then(() => {
        console.log("sw注册成功");
      })
      .catch(() => {
        console.log("sw注册失败");
      });
  });
}

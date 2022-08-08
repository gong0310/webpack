import { createApp } from "vue";
import App from "./App";
import router from "./router";

// 开启了按需导入就不需要手动全部引入了
// import ElementPlus from "element-plus";
// import "element-plus/dist/index.css";

createApp(App)
  .use(router)
//   .use(ElementPlus)
  .mount(document.getElementById("app"));

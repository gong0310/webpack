import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import 'antd/dist/antd.less'; //引入less, 否则自定义主题

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

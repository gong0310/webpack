import React, { Suspense, lazy } from "react";
import { Link, Routes, Route } from "react-router-dom";
import { Button } from 'antd';
// import Home from "./pages/Home";
// import About from "./pages/About";

// react 路由懒加载
const Home = lazy(() => import(/* webpackChunkName: "home" */ "./pages/Home"));
const About = lazy(() => import(/* webpackChunkName: "about" */ "./pages/About"));

function App() {
  return (
    <div>
      <h1>哈哈哈</h1>
      <Button type="primary">Primary Button</Button>
      <ul>
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
      <Suspense fallback={<div>loading...</div>}>
        {/* 懒加载放在Suspense组件中 */}
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    </div>
  );
}
export default App;

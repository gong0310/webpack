import { createRouter, createWebHistory } from "vue-router";

const Home = () => import(/* webpackChunkName: "home" */ "../views/Home");
const About = () => import(/* webpackChunkName: "about" */ "../views/About");

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/home",
      component: Home,
    },
    {
      path: "/about",
      component: About,
    },
  ],
});

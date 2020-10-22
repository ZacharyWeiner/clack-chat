import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Dashboard from "../views/Dashboard.vue";
import Forms from "../views/Forms.vue";
import Tables from "../views/Tables.vue";
import UIElements from "../views/UIElements.vue";
import Login from "../views/Login.vue";
import Modal from "../views/Modal.vue";
import Card from "../views/Card.vue";
import Chat from "../views/Chat.vue";
import Blank from "../views/Blank.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { layout: "empty" }
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { layout: "empty" }
  },
  {
    path: "/chat",
    name: "Chat",
    component: Chat
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard
  },
  {
    path: "/forms",
    name: "Forms",
    component: Forms
  },
  {
    path: "/cards",
    name: "Cards",
    component: Card
  },
  {
    path: "/tables",
    name: "Tables",
    component: Tables
  },
  {
    path: "/ui-elements",
    name: "UIElements",
    component: UIElements
  },
  {
    path: "/modal",
    name: "Modal",
    component: Modal
  },
  {
    path: "/blank",
    name: "Blank",
    component: Blank
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;

import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";
import Dashboard from "../views/Dashboard.vue";
import Forms from "../views/Forms.vue";
import Tables from "../views/Tables.vue";
import UIElements from "../views/UIElements.vue";
import Login from "../views/Login.vue";
import Modal from "../views/Modal.vue";
import Card from "../views/Card.vue";
import Chat from "../views/Chat.vue";
import Chat2 from "../views/Chat2.vue";
import Profile from "../views/Profile.vue";
import Blank from "../views/Blank.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { layout: "empty" }
  },
  {
    path: "/about",
    name: "About",
    component: About,
    meta: { layout: "empty" }
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { layout: "empty" }
  },
  {
    path: "/chat/:id",
    name: "Chat",
    component: Chat,
    meta: { layout: "chat" }
  },
  {
    path: "/chat",
    name: "Chat",
    component: Chat,
    meta: { layout: "chat" }
  },
  {
    path: "/chat2",
    name: "Chat2",
    component: Chat2,
    meta: { layout: "chat2" }
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { layout: "empty" }
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { layout: "default" }
  },
  {
    path: "/forms",
    name: "Forms",
    component: Forms,
    meta: { layout: "default" }
  },
  {
    path: "/cards",
    name: "Cards",
    component: Card,
    meta: { layout: "default" }
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

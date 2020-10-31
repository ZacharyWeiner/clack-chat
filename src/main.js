import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "./main.css";

import DashboardLayout from "./components/DashboardLayout.vue";
import ChatLayout from "./components/ChatLayout.vue";
import Chat2Layout from "./components/Chat2Layout.vue";
import EmptyLayout from "./components/EmptyLayout.vue";
import VueMarkdownIt from "vue3-markdown-it";

const app = createApp(App);
app.component("default-layout", DashboardLayout);
app.component("chat-layout", ChatLayout);
app.component("chat2-layout", Chat2Layout);
app.component("empty-layout", EmptyLayout);
app.use(store);
app.use(router);
app.use(VueMarkdownIt);
app.mount("#app");

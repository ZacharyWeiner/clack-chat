import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "./main.css";

import DashboardLayout from "./components/DashboardLayout.vue";
import ChatLayout from "./components/ChatLayout.vue";
import EmptyLayout from "./components/EmptyLayout.vue";

const app = createApp(App);
app.component("default-layout", DashboardLayout);
app.component("chat-layout", ChatLayout);
app.component("empty-layout", EmptyLayout);
app.use(store);
app.use(router);
app.mount("#app");

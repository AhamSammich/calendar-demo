import { createRouter, createWebHashHistory } from "vue-router";
import Login from "./views/Login.vue";
import Home from "./views/Home.vue";

const routes = [
    { path: '/login', component: Login },
    { path: '/', component: Home }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router;
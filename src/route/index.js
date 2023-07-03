import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Test from '../pages/Test.vue'; // ←練習用的，記得刪

const routes = [
    { path: '/', component: Home },
    // ↓練習用的，記得刪
    { path: '/test', component: Test }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;
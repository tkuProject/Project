import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Cards from '../pages/Cards.vue'
import Ranking from '../pages/Ranking.vue';
import Test from '../pages/Test.vue'; // ←練習用的，記得刪

const routes = [
    { path: '/', component: Home },
    { path: '/cards', component: Cards },
    { path: '/ranking', component: Ranking },
    // ↓練習用的，記得刪
    { path: '/test', component: Test }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;
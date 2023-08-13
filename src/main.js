import { createApp } from 'vue'
import './style.less'
import App from './App.vue'
import router from './route'

import { createPinia } from 'pinia';
const pinia = createPinia();

const app = createApp(App);
app.use(pinia);
app.use(router);

app.mount('#app');

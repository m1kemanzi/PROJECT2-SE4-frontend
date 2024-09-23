import { createApp } from 'vue';
import App from '../src/App.vue';
import router from './router/index.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@mdi/font/css/materialdesignicons.css'; // Import MDI Icons

const app = createApp(App);

app.use(router);

app.mount('#app');
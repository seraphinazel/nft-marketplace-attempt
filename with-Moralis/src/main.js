import { createApp } from 'vue';
import App from './App.vue';
import store from '@/store';
import router from '@/router';
import Moralis from '@/moralis';

const app = createApp(App);

app
  .use(store)
  .use(router)
  .provide('$moralis', Moralis)
  .mount('#app');


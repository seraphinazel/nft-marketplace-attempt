import MainPage from '@/pages/MainPage';
import UserPage from '@/pages/UserPage';
import ItemPage from '@/pages/ItemPage';
import AccountPage from '@/pages/AccountPage';
import AboutPage from '@/pages/AboutPage';
import { createRouter, createWebHistory } from "vue-router";


const routes = [
  {
    path: '/',
    component: MainPage
  },
  {
    path: '/about',
    component: AboutPage
  },
  {
    path: '/user/:id',
    component: UserPage
  },
  {
    path: '/item/:id',
    component: ItemPage
  },
  {
    path: '/account',
    component: AccountPage
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(process.env.BASE_URL)
});

export default router;

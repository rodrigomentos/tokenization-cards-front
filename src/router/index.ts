import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import auth from './auth';
import CreateCardView from '../views/cards/CreateCardView.vue';
import FindCardView from '../views/cards/FindCardView.vue';
const DEFAULT_TITLE = 'Qulqi';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'CreateCard',
    component: CreateCardView,
    meta: { title: 'Solicitar Pago', requiresAuth: true },
  },
  {
    path: '/send-token',
    name: 'FindCard',
    component: FindCardView,
    meta: { title: 'Enviar Token', requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { title: 'Login' },
  },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {

  if(typeof(to.meta.title) === 'string'){
      document.title = to.meta.title || DEFAULT_TITLE;
  }
  
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    
    if (!auth.isLoggedIn) {
      next('/login');
    } else {
      next();
    }
  } else {
    if(to.name == 'Login' && auth.isLoggedIn){
      next('/');
    }
    next();
  }
});
export default router
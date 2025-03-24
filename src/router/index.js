import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '../firebase/firebase';
import { isAuthenticated } from '../utils/auth';

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('../views/Auth.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/resume-form',
    name: 'ResumeForm',
    component: () => import('../views/ResumeForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/resume-preview',
    name: 'ResumePreview',
    component: () => import('../views/ResumePreview.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);
  const isAuth = isAuthenticated();

  if (requiresAuth && !isAuth) {
    next('/auth');
  } else if (requiresGuest && isAuth) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router; 
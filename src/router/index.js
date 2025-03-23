import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '../firebase/firebase';

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
  const isAuthenticated = await auth.currentUser;

  if (requiresAuth && !isAuthenticated) {
    next('/auth');
  } else if (requiresGuest && isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router; 
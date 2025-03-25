import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '../firebase/firebase';
import { isAuthenticated } from '../utils/auth';
import Auth from '../views/Auth.vue';
import ResumeForm from '../views/ResumeForm.vue';
import ResumePreview from '../views/ResumePreview.vue';
import Dashboard from '../views/Dashboard.vue';

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth,
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/resume-form',
    name: 'ResumeForm',
    component: ResumeForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/resume-preview',
    name: 'ResumePreview',
    component: ResumePreview,
    meta: { requiresAuth: true }
  },
  {
    path: '/resume-preview/:id',
    name: 'ResumePreviewWithId',
    component: ResumePreview,
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
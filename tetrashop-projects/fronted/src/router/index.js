import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login.vue';
import Projects from '@/views/Projects.vue';  // صفحه اصلی با dashboard
import ChessResults from '@/views/ChessResults.vue';
import WriterResults from '@/views/WriterResults.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/projects',
    name: 'Projects',          // ✅ صفحه اصلی dashboard
    component: Projects,
    meta: { requiresAuth: true }
  },
  {
    path: '/chess-results',
    name: 'ChessResults',
    component: ChessResults,
    meta: { requiresAuth: true }
  },
  {
    path: '/writer-results',
    name: 'WriterResults',
    component: WriterResults,
    meta: { requiresAuth: true }
  },
  // ❌ حذف مسیرهای غلط که باعث 404 می‌شدند
  // { path: '/execute-project', ... } // این خط حذف شده
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// جلوگیری از دسترسی بدون لاگین
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('user-token');
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;

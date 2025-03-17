import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/stores/auth';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Auth/Login.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Auth/Register.vue'),
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '/',
          name: 'dashboard',
          component: () => import('../views/Pages/Dashboard.vue')
        },
        {
          path: '/pages/dates',
          name: 'dates',
          component: () => import('../views/Pages/Dates.vue')
        },
        {
          path: '/pages/users',
          name: 'users',
          component: () => import('../views/Pages/Users.vue')
        },
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuth();
  if (to.meta.requiresAuth && !auth.token) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router

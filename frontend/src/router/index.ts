import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/HomeView.vue'),
      meta: { layout: 'main' },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/LoginView.vue'),
      meta: { layout: 'auth' },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/pages/RegisterView.vue'),
      meta: { layout: 'auth' },
    },
    {
      path: '/diagnosis',
      name: 'diagnosis',
      component: () => import('@/pages/DiagnosisView.vue'),
      meta: { layout: 'main' },
    },
  ],
})

export default router

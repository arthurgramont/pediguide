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
    {
      path: '/mentions-legales',
      name: 'legal-notice',
      component: () => import('@/pages/LegalNoticeView.vue'),
      meta: { layout: 'main' },
    },
    {
      path: '/politique-confidentialite',
      name: 'privacy-policy',
      component: () => import('@/pages/PrivacyPolicyView.vue'),
      meta: { layout: 'main' },
    },
    {
      path: '/conditions-utilisation',
      name: 'terms',
      component: () => import('@/pages/TermsView.vue'),
      meta: { layout: 'main' },
    },
    {
      path: '/cookies',
      name: 'cookies',
      component: () => import('@/pages/CookiesView.vue'),
      meta: { layout: 'main' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundView.vue'),
      meta: { layout: 'main' },
    },
  ],
})

export default router

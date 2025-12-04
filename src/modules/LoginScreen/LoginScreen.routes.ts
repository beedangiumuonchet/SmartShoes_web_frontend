export const loginScreenRoutes = [
  {
    path: '/login',
    component: () => import('./LoginView.vue'),
    meta: {
      requiresAuth: false,
      layout: 'blank',
    },
  },
  {
    path: '/register',
    component: () => import('./RegisterView.vue'),
    meta: {
      requiresAuth: false,
      layout: 'blank',
    },
  },
]

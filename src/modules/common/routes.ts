export const routes = [
  {
    path: '/',
    component: () => import('./HomeView.vue'),
    meta: {
      requiresAuth: true,
      layout: 'topbar',
    },
  },
  {
    path: '/manager',
    component: () => import('./HomeViewManager.vue'),
    meta: {
      requiresAuth: true,
      layout: 'default',
    },
  },
  {
    path: '/unauthorized',
    component: () => import('./UnauthorizedView.vue'),
    meta: {
      requiresAuth: false,
      layout: 'blank',
    },
  },
]

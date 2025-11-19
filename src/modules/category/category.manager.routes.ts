export const categoryManagerRoutes = [
  {
    path: '/manager/categories',
    component: () => import('./manager/CategoryManagerList.vue'),
    meta: {
      requiresAuth: true,
      layout: 'sidebar',
    },
  },
]

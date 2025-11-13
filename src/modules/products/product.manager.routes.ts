export const productManagerRoutes = [
  {
    path: '/manager/products',
    component: () => import('./manager/ProductManagerList.vue'),
    meta: {
      requiresAuth: true,
      layout: 'sidebar',
    },
  },
]

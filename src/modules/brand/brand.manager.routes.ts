export const brandManagerRoutes = [
  {
    path: '/manager/brands',
    component: () => import('./manager/BrandManagerList.vue'),
    meta: {
      requiresAuth: true,
      layout: 'sidebar',
    },
  },
]

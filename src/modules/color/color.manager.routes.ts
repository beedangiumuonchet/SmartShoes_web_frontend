export const colorManagerRoutes = [
  {
    path: '/manager/colors',
    component: () => import('./manager/ColorManagerList.vue'),
    meta: {
      requiresAuth: true,
      layout: 'default',
    },
  },
]

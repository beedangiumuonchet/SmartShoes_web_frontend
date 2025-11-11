export const ordersManagerRoutes = [
  {
    path: '/manager/orders',
    component: () => import('./manager/OrderManagerList.vue'),
    meta: {
      requiresAuth: true,
      layout: 'blank',
    },
  },
]

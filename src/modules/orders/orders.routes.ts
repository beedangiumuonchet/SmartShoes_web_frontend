export const ordersRoutes = [
  {
    path: '/orders',
    component: () => import('./MyOrderView.vue'),
    meta: {
      requiresAuth: true,
      layout: 'topbar',
    },
  },
  {
    path: '/orders/:orderId',
    component: () => import('./OrderDetailView.vue'),
    meta: {
      requiresAuth: true,
      layout: 'topbar',
    },
  },
]

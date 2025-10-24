export const ordersRoutes = [
  {
    path: '/orders',
    component: () => import('./OrderListView.vue'),
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
  {
    path: '/checkout',
    component: () => import('./CheckoutView.vue'),
    meta: {
      requiresAuth: true,
      layout: 'topbar',
    },
  },
]
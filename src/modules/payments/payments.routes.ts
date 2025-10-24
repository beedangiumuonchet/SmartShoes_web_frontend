export const paymentsRoutes = [
  {
    path: '/payments',
    component: () => import('./PaymentListView.vue'),
    meta: {
      requiresAuth: true,
      layout: 'topbar',
    },
  },
  {
    path: '/payments/:paymentId',
    component: () => import('./PaymentDetailView.vue'),
    meta: {
      requiresAuth: true,
      layout: 'topbar',
    },
  },
  {
    path: '/payments/momo/return',
    component: () => import('./MomoReturnView.vue'),
    meta: {
      requiresAuth: false, // Có thể không cần auth vì redirect từ Momo
      layout: 'topbar',
    },
  },
]

export const paymentsRoutes = [
  {
    path: '/payments/payment-failed',
    component: () => import('./PaymentFailedView.vue'),
    meta: {
      requiresAuth: true,
      layout: 'topbar',
    },
  },
]

export const cartsRoutes = [
  {
    path: '/cart',
    component: () => import('./CartView.vue'),
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

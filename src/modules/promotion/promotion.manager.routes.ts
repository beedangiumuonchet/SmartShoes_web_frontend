export const promotionManagerRoutes = [
  {
    path: '/manager/promotions',
    component: () => import('./manager/PromotionManagerList.vue'),
    meta: {
      requiresAuth: true,
      layout: 'sidebar',
    },
  },
]

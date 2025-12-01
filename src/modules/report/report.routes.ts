export const reportRoutes = [
  {
    path: '/manager/report/top-products',
    component: () => import('./TopProduct.vue'),
    meta: {
      requiresAuth: true,
      layout: 'sidebar',
      title: 'Top sản phẩm bán chạy',
    },
  },
];

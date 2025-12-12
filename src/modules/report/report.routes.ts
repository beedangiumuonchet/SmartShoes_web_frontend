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
  {
    path: '/manager/report/top-customer',
    component: () => import('./TopCustomer.vue'),
    meta: {
      requiresAuth: true,
      layout: 'sidebar',
      title: 'Top khách hàng tiềm năng',
    },
  },
  {
    path: "/print-report",
    name: "PrintReport",
    component: () => import('./PrintReport.vue'),
    meta: {
      requiresAuth: false,
      layout: 'blank',
      title: 'In báo cáo',
    },
  }

]

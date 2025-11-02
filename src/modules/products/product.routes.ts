import type { RouteRecordRaw } from 'vue-router'

export const productRoutes: RouteRecordRaw[] = [
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: () => import('./ProductDetail.vue'),
    meta: {
      title: 'Product Detail',
      requiresAuth: false,
      layout: 'topbar',
    },
  },
]

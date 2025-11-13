import type { RouteRecordRaw } from 'vue-router'

export const productRoutes: RouteRecordRaw[] = [
  {
    path: '/products',
    name: 'ProductList',
    component: () => import('./ProductList.vue'),
    meta: {
      title: 'Products',
      requiresAuth: false,
      layout: 'topbar',
    },
  },
  {
    path: '/products/create',
    name: 'ProductCreate',
    component: () => import('./ProductCreate.vue'),
    meta: {
      title: 'Create Product',
      requiresAuth: false,
      layout: 'topbar',
    },
  },
  {
    path: '/products/:slug',
    name: 'ProductDetail',
    component: () => import('./ProductDetail.vue'),
    meta: {
      title: 'Product Detail',
      requiresAuth: false,
      layout: 'topbar',
    },
  },
]


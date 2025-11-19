export const attributeManagerRoutes = [
  {
    path: '/manager/attributes',
    component: () => import('./manager/AttributeManagerList.vue'),
    meta: {
      requiresAuth: true,
      layout: 'sidebar',
    },
  },
]

export const usersManagerRoutes = [
  {
    path: '/manager/users',
    component: () => import('./manager/UserManagerList.vue'),
    meta: {
      requiresAuth: true,
      layout: 'blank',
    },
  },
]

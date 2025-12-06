export const usersManagerRoutes = [
  {
    path: '/manager/users',
    component: () => import('./manager/UserManagerList.vue'),
    meta: {
      requiresAuth: true,
      layout: 'blank',
    },
  },
  {
    path: '/manager/settings',
    component: () => import('./manager/RoleManagerList.vue'),
    meta: {
      requiresAuth: true,
      layout: 'blank',
    },
  },
]

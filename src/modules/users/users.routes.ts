export const usersRoutes = [
  {
    path: '/profile',
    component: () => import('./ProfileView.vue'),
    meta: {
      requiresAuth: true,
      layout: 'topbar',
    },
  },
]

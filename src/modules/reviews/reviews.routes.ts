export const reviewsRoutes = [
  {
    path: '/reviews/create/:productId',
    component: () => import('./CreateReviewView.vue'),
    meta: {
      requiresAuth: true, // Cần auth để tạo review
      layout: 'topbar',
    },
  },
]

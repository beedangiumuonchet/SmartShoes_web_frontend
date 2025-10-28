export const reviewsRoutes = [
  {
    path: '/reviews',
    component: () => import('./ReviewListView.vue'),
    meta: {
      requiresAuth: false, // Public để xem reviews
      layout: 'topbar',
    },
  },
  {
    path: '/reviews/:reviewId',
    component: () => import('./ReviewDetailView.vue'),
    meta: {
      requiresAuth: false, // Public để xem review detail
      layout: 'topbar',
    },
  },
  {
    path: '/reviews/create/:productId',
    component: () => import('./CreateReviewView.vue'),
    meta: {
      requiresAuth: true, // Cần auth để tạo review
      layout: 'topbar',
    },
  },
  {
    path: '/reviews/edit/:reviewId',
    component: () => import('./EditReviewView.vue'),
    meta: {
      requiresAuth: true, // Cần auth để edit review
      layout: 'topbar',
    },
  },
  {
    path: '/my-reviews',
    component: () => import('./MyReviewsView.vue'),
    meta: {
      requiresAuth: true, // Cần auth để xem my reviews
      layout: 'topbar',
    },
  },
  {
    path: '/products/:productId/reviews',
    component: () => import('./ProductReviewsView.vue'),
    meta: {
      requiresAuth: false, // Public để xem reviews của product
      layout: 'topbar',
    },
  },
]

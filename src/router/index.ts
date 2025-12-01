import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { roleGuard } from '@/common/guards/roleGuard.guard'
import { loginScreenRoutes } from '@/modules/LoginScreen/LoginScreen.routes'
import { usersRoutes } from '@/modules/users/users.routes'
import { routes } from '@/modules/common/routes'
import { productRoutes } from '@/modules/products/product.routes'
import { cartsRoutes } from '@/modules/carts/carts.routes'
import { ordersRoutes } from '@/modules/orders/orders.routes'
import { usersManagerRoutes } from '@/modules/users/users.manager.routes'
import { ordersManagerRoutes } from '@/modules/orders/orders.manager.routes'
import { productManagerRoutes } from '@/modules/products/product.manager.routes'
import { reviewsRoutes } from '@/modules/reviews/reviews.routes'
import { brandManagerRoutes } from '@/modules/brand/brand.manager.routes'
import { categoryManagerRoutes } from '@/modules/category/category.manager.routes'
import { colorManagerRoutes } from '@/modules/color/color.manager.routes'
import { attributeManagerRoutes } from '@/modules/attribute/attribute.manager.routes'
import { paymentsRoutes } from '@/modules/payments/payments.routes'
//import { paymentsRoutes } from '@/modules/payments/payments.routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...loginScreenRoutes,
    ...usersRoutes,
    ...productRoutes,
    ...cartsRoutes,
    ...ordersRoutes,
    ...usersManagerRoutes,
    ...ordersManagerRoutes,
    ...productManagerRoutes,
    ...reviewsRoutes,
    ...brandManagerRoutes,
    ...categoryManagerRoutes,
    ...colorManagerRoutes,
    ...attributeManagerRoutes,
    ...paymentsRoutes,

    ...routes,
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/modules/common/NotFoundPage.vue'),
      meta: {
        requiresAuth: false,
        layout: 'blank',
      },
    },
  ] as RouteRecordRaw[],
})

router.beforeEach(roleGuard)

export default router

<template>
  <div class="min-h-screen bg-gray-50 py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="flex mb-6" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2">
          <li>
            <router-link to="/" class="text-gray-500 hover:text-rose-500 transition-colors">
              Trang chủ
            </router-link>
          </li>
          <li>
            <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </li>
          <li>
            <router-link to="/orders" class="text-gray-500 hover:text-rose-500 transition-colors">
              Đơn hàng
            </router-link>
          </li>
          <li>
            <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </li>
          <li>
            <span class="text-gray-900 font-medium">Chi tiết đơn hàng</span>
          </li>
        </ol>
      </nav>

      <!-- Header -->
      <div class="mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Chi Tiết Đơn Hàng</h1>
            <p v-if="order" class="mt-2 text-gray-600">
              Mã đơn hàng: <span class="font-medium text-gray-900">#{{ order.id.slice(-8) }}</span>
            </p>
          </div>
          <button
            @click="goBack"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            Quay lại
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-20">
        <div class="relative">
          <div class="w-16 h-16 mx-auto mb-4">
            <div class="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
            <div
              class="absolute inset-0 border-4 border-purple-500 rounded-full animate-spin border-t-transparent"
            ></div>
          </div>
          <p class="text-gray-600 text-lg">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <div
          class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center"
        >
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            ></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Không thể tải thông tin đơn hàng</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button
          @click="loadOrderDetail"
          class="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors"
        >
          Thử lại
        </button>
      </div>

      <!-- Main Content -->
      <div v-else-if="order" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Order Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Order Status -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-900">Trạng thái đơn hàng</h2>
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                :class="getStatusColor(order.status)"
              >
                {{ getStatusLabel(order.status) }}
              </span>
            </div>

            <!-- Order Timeline -->
            <div class="relative">
              <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

              <div
                v-for="(step, index) in orderSteps"
                :key="step.status"
                class="relative flex items-center mb-6 last:mb-0"
              >
                <div
                  class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                  :class="
                    step.completed
                      ? 'bg-green-500 text-white'
                      : step.current
                        ? getStatusBgColor(order.status) + ' text-white'
                        : 'bg-gray-200 text-gray-500'
                  "
                >
                  <svg
                    v-if="step.completed"
                    class="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span v-else class="text-sm font-medium">{{ index + 1 }}</span>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900">{{ step.label }}</p>
                  <p v-if="step.current" class="text-sm text-gray-500">
                    {{ formatDate(order.createdAt) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg
                class="w-6 h-6 text-rose-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"
                ></path>
              </svg>
              Sản phẩm đã đặt
            </h2>

            <div class="space-y-4">
              <div
                v-for="detail in order.orderDetails"
                :key="detail.id"
                class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
              >
                <!-- Product Image -->
                <div class="flex-shrink-0">
                  <img
                    :src="getProductImage(detail)"
                    :alt="getProductName(detail)"
                    class="w-16 h-16 object-cover rounded-lg border border-gray-200"
                  />
                </div>

                <!-- Product Info -->
                <div class="flex-1 min-w-0">
                  <h3 class="text-base font-medium text-gray-900 line-clamp-2 mb-1">
                    {{ getProductName(detail) }}
                  </h3>
                  <div class="flex flex-wrap gap-2 text-sm">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800"
                    >
                      Size: {{ getVariantSize(detail) }}
                    </span>
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                    >
                      Màu: {{ getVariantColor(detail) }}
                    </span>
                  </div>
                  <div class="text-sm text-gray-600 mt-1">
                    Đơn giá: {{ formatPrice(detail.price) }}
                  </div>
                </div>

                <!-- Quantity & Total -->
                <div class="text-right">
                  <div class="text-sm text-gray-600 mb-1">SL: {{ detail.quantity }}</div>
                  <div class="text-lg font-semibold text-rose-600">
                    {{ formatPrice(detail.subtotal) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Shipping Information -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg
                class="w-6 h-6 text-blue-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              Thông tin giao hàng
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-sm font-medium text-gray-700 mb-2">Người nhận</h3>
                <p class="text-base text-gray-900">{{ order.shippingName }}</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-700 mb-2">Số điện thoại</h3>
                <p class="text-base text-gray-900">{{ order.shippingPhone }}</p>
              </div>
              <div class="md:col-span-2">
                <h3 class="text-sm font-medium text-gray-700 mb-2">Địa chỉ giao hàng</h3>
                <p class="text-base text-gray-900">{{ order.shippingAddress }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Order Summary & Actions -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>

            <!-- Order Info -->
            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Ngày đặt hàng</span>
                <span class="text-gray-900">{{ formatDate(order.createdAt) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Số lượng sản phẩm</span>
                <span class="text-gray-900">{{ orderSummary.itemCount }} sản phẩm</span>
              </div>
            </div>

            <!-- Order Summary -->
            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>{{ formatPrice(orderSummary.subtotal) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span>{{ formatPrice(orderSummary.shippingFee) }}</span>
              </div>
              <div class="border-t border-gray-200 pt-3">
                <div class="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Tổng cộng</span>
                  <span class="text-rose-600">{{ formatPrice(orderSummary.total) }}</span>
                </div>
                <div class="text-xs text-gray-500 mt-1 text-right">
                  Đã bao gồm thuế VAT (nếu có)
                </div>
              </div>
            </div>

            <!-- Debug comparison -->
            <div
              v-if="Math.abs(orderSummary.total - order.totalAmount) > 100"
              class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
            >
              <div class="text-xs text-yellow-800">
                <div class="font-medium">So sánh tổng tiền:</div>
                <div>Tính toán: {{ formatPrice(orderSummary.total) }}</div>
                <div>Backend: {{ formatPrice(order.totalAmount) }}</div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-3">
              <!-- Cancel Order -->
              <button
                v-if="canCancelOrder"
                @click="showCancelDialog = true"
                :disabled="isCanceling"
                class="w-full px-4 py-2 border border-red-300 text-red-700 hover:bg-red-50 disabled:bg-gray-100 disabled:text-gray-400 font-medium rounded-lg transition-colors"
              >
                {{ isCanceling ? 'Đang hủy...' : 'Hủy đơn hàng' }}
              </button>

              <!-- Reorder -->
              <button
                @click="reorder"
                class="w-full px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-lg transition-colors"
              >
                Đặt lại đơn hàng
              </button>

              <!-- Continue Shopping -->
              <button
                @click="continueShopping"
                class="w-full px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
              >
                Tiếp tục mua sắm
              </button>
            </div>

            <!-- Customer Support -->
            <div class="mt-6 p-4 bg-blue-50 rounded-lg">
              <div class="flex items-start">
                <svg
                  class="w-5 h-5 text-blue-500 mt-0.5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <div class="flex-1">
                  <h3 class="text-sm font-medium text-blue-900">Cần hỗ trợ?</h3>
                  <p class="text-sm text-blue-700 mt-1">
                    Liên hệ với chúng tôi nếu bạn có bất kỳ thắc mắc nào về đơn hàng.
                  </p>
                  <div class="mt-2">
                    <a
                      href="tel:1900-1234"
                      class="text-sm font-medium text-blue-600 hover:text-blue-500"
                      >Hotline: 1900-1234</a
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cancel Confirmation Dialog -->
    <div
      v-if="showCancelDialog"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Xác nhận hủy đơn hàng</h3>
        <p class="text-gray-600 mb-6">
          Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác.
        </p>
        <div class="flex gap-3">
          <button
            @click="cancelOrderHandler"
            :disabled="isCanceling"
            class="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors"
          >
            {{ isCanceling ? 'Đang hủy...' : 'Xác nhận hủy' }}
          </button>
          <button
            @click="showCancelDialog = false"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
          >
            Không hủy
          </button>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <div
      v-if="showSuccessToast"
      class="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-lg shadow-2xl z-50 flex items-center space-x-3 transform animate-slide-up"
    >
      <div class="w-6 h-6 bg-white rounded-full flex items-center justify-center">
        <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <span class="font-medium">{{ successMessage }}</span>
    </div>

    <!-- Error Toast -->
    <div
      v-if="showErrorToast"
      class="fixed bottom-6 right-6 bg-gradient-to-r from-red-500 to-rose-500 text-white px-6 py-4 rounded-lg shadow-2xl z-50 flex items-center space-x-3 transform animate-slide-up"
    >
      <div class="w-6 h-6 bg-white rounded-full flex items-center justify-center">
        <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <span class="font-medium">{{ errorMessage }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getOrder, cancelOrder } from './orders.api'
import { getCurrentUser } from '@/common/guards/roleGuard.guard'
import { ORDER_STATUS_LABELS, OrderStatus, type Order, type OrderDetail } from './orders.type'
import { CartDetailRequest } from '../carts/carts.type'
import { getOrCreateUserCart, addCartDetail } from '../carts/carts.api'

const route = useRoute()
const router = useRouter()

// State
const loading = ref(true)
const isCanceling = ref(false)
const showCancelDialog = ref(false)
const showSuccessToast = ref(false)
const showErrorToast = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const error = ref('')

// Data
const order = ref<Order | null>(null)

// Computed
const currentUser = computed(() => getCurrentUser())

const canCancelOrder = computed(() => {
  if (!order.value) return false
  return [OrderStatus.PENDING, OrderStatus.PAID, OrderStatus.CONFIRMED].includes(order.value.status)
})

const orderSteps = computed(() => {
  if (!order.value) return []

  const steps = [
    { status: OrderStatus.PENDING, label: 'Chờ xác nhận', completed: false, current: false },
    { status: OrderStatus.PAID, label: 'Đã thanh toán', completed: false, current: false },
    { status: OrderStatus.CONFIRMED, label: 'Đã xác nhận', completed: false, current: false },
    { status: OrderStatus.SHIPPING, label: 'Đang giao hàng', completed: false, current: false },
    { status: OrderStatus.DELIVERED, label: 'Đã giao hàng', completed: false, current: false },
  ]

  const statusOrder = [
    OrderStatus.PENDING,
    OrderStatus.PAID,
    OrderStatus.CONFIRMED,
    OrderStatus.SHIPPING,
    OrderStatus.DELIVERED,
  ]
  const currentIndex = statusOrder.indexOf(order.value.status)

  if (order.value.status === OrderStatus.CANCELLED) {
    return [{ status: OrderStatus.CANCELLED, label: 'Đã hủy', completed: false, current: true }]
  }

  steps.forEach((step, index) => {
    if (index < currentIndex) {
      step.completed = true
    } else if (index === currentIndex) {
      step.current = true
    }
  })

  return steps
})

const orderSummary = computed(() => {
  if (!order.value?.orderDetails) {
    return {
      subtotal: 0,
      shippingFee: 0,
      total: 0,
      itemCount: 0,
    }
  }

  const subtotal = order.value.orderDetails.reduce((sum, detail) => sum + detail.subtotal, 0)
  const shippingFee = 0 // Fixed shipping fee
  const total = subtotal + shippingFee
  const itemCount = order.value.orderDetails.reduce((sum, detail) => sum + detail.quantity, 0)

  return {
    subtotal,
    shippingFee,
    total,
    itemCount,
  }
})

// Methods
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getStatusLabel = (status: OrderStatus) => {
  return ORDER_STATUS_LABELS[status] || status
}

const getStatusColor = (status: OrderStatus) => {
  const colors: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [OrderStatus.PAID]: 'bg-orange-100 text-orange-800',
    [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-800',
    [OrderStatus.SHIPPING]: 'bg-purple-100 text-purple-800',
    [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800',
    [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getStatusBgColor = (status: OrderStatus) => {
  const colors: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'bg-yellow-500',
    [OrderStatus.PAID]: 'bg-orange-500',
    [OrderStatus.CONFIRMED]: 'bg-blue-500',
    [OrderStatus.SHIPPING]: 'bg-purple-500',
    [OrderStatus.DELIVERED]: 'bg-green-500',
    [OrderStatus.CANCELLED]: 'bg-red-500',
  }
  return colors[status] || 'bg-gray-500'
}

// Helper functions dựa trên OrderDetail structure
const getProductName = (detail: OrderDetail) => {
  if (detail.productVariant?.name) {
    return detail.productVariant.name
  }
  return `Sản phẩm #${detail.productVariantId.slice(-8)}`
}

const getProductImage = (detail: OrderDetail) => {
  if (detail.productVariant?.image) {
    return detail.productVariant.image
  }
  return 'https://via.placeholder.com/64x64/f3f4f6/9ca3af?text=SP'
}

const getVariantSize = (detail: OrderDetail) => {
  return detail.productVariant?.size || 'N/A'
}

const getVariantColor = (detail: OrderDetail) => {
  return detail.productVariant?.color || 'N/A'
}

const loadOrderDetail = async () => {
  // Lấy orderId từ URL path
  const pathSegments = route.path.split('/')
  const orderId = pathSegments[pathSegments.length - 1]

  console.log('🔍 Debug URL info:')
  console.log('- Full path:', route.path)
  console.log('- Extracted orderId:', orderId)

  if (!orderId) {
    error.value = 'Không tìm thấy mã đơn hàng trong URL'
    loading.value = false
    return
  }

  try {
    loading.value = true
    error.value = ''

    console.log('🚀 Calling getOrder API with orderId:', orderId)
    const orderData = await getOrder(orderId)
    order.value = orderData

    console.log('✅ Order detail loaded successfully:', orderData)
    console.log('📊 Order summary:', orderSummary.value)
  } catch (err) {
    console.error('❌ Error loading order detail:', err)
    error.value = 'Không thể tải thông tin đơn hàng. Vui lòng thử lại.'
  } finally {
    loading.value = false
  }
}

const cancelOrderHandler = async () => {
  if (!order.value) return

  try {
    isCanceling.value = true
    const canceledOrder = await cancelOrder(order.value.id)
    order.value = canceledOrder
    showCancelDialog.value = false
    showSuccess('Đơn hàng đã được hủy thành công')
  } catch (err) {
    console.error('❌ Error canceling order:', err)
    showError('Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại.')
  } finally {
    isCanceling.value = false
  }
}

const reorder = async () => {
  if (!order.value || !currentUser.value?.userId) return

  try {
    // Get or create cart
    const cart = await getOrCreateUserCart(currentUser.value.userId)

    // Add all items back to cart
    const promises = order.value.orderDetails.map((detail) =>
      addCartDetail(cart.id, new CartDetailRequest(detail.productVariantId, detail.quantity)),
    )

    await Promise.all(promises)
    showSuccess('Đã thêm tất cả sản phẩm vào giỏ hàng')

    setTimeout(() => {
      router.push('/cart')
    }, 1500)
  } catch (err) {
    console.error('❌ Error reordering:', err)
    showError('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng')
  }
}

const continueShopping = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
}

const showSuccess = (message: string) => {
  successMessage.value = message
  showSuccessToast.value = true
  setTimeout(() => {
    showSuccessToast.value = false
  }, 3500)
}

const showError = (message: string) => {
  errorMessage.value = message
  showErrorToast.value = true
  setTimeout(() => {
    showErrorToast.value = false
  }, 3500)
}

// Lifecycle
onMounted(() => {
  loadOrderDetail()
})
</script>

<style scoped>
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #f43f5e, #ec4899);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #e11d48, #db2777);
}

/* Enhanced shadows */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
</style>

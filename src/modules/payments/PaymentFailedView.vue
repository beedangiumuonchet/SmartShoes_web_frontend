<template>
  <div
    class="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 flex items-center justify-center p-4"
  >
    <div class="max-w-md w-full">
      <!-- Main Card -->
      <div class="bg-white rounded-2xl shadow-2xl border border-red-100 overflow-hidden">
        <!-- Header with Animation -->
        <div class="bg-gradient-to-r from-red-500 to-rose-600 px-8 py-6 text-center">
          <!-- Animated Error Icon -->
          <div
            class="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4"
          >
            <svg
              class="w-10 h-10 text-white animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h1 class="text-2xl font-bold text-white mb-2">Thanh toán thất bại</h1>

          <p class="text-red-100 text-sm">Giao dịch của bạn không thể hoàn tất</p>
        </div>

        <!-- Content -->
        <div class="p-8">
          <!-- Error Details -->
          <div class="text-center mb-8">
            <div class="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
              <div class="flex items-start space-x-3">
                <svg
                  class="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div class="text-left">
                  <h3 class="text-sm font-semibold text-red-800 mb-1">Lý do có thể gây lỗi:</h3>
                  <ul class="text-sm text-red-700 space-y-1">
                    <li>• Số dư tài khoản không đủ</li>
                    <li>• Thông tin thanh toán không chính xác</li>
                    <li>• Kết nối mạng không ổn định</li>
                    <li>• Phiên giao dịch đã hết hạn</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Payment Info -->
            <div v-if="paymentInfo.orderId" class="bg-gray-50 rounded-xl p-4 mb-6">
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-gray-600 mb-1">Mã đơn hàng</p>
                  <p class="font-mono text-gray-900">#{{ paymentInfo.orderId.slice(-8) }}</p>
                </div>
                <div>
                  <p class="text-gray-600 mb-1">Số tiền</p>
                  <p class="font-semibold text-gray-900">{{ formatPrice(paymentInfo.amount) }}</p>
                </div>
                <div>
                  <p class="text-gray-600 mb-1">Phương thức</p>
                  <div class="flex items-center">
                    <div class="w-5 h-5 bg-pink-500 rounded mr-2 flex items-center justify-center">
                      <span class="text-white text-xs font-bold">M</span>
                    </div>
                    <span class="text-gray-900">MoMo</span>
                  </div>
                </div>
                <div>
                  <p class="text-gray-600 mb-1">Thời gian</p>
                  <p class="text-gray-900">{{ formatTime(new Date()) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-4">
            <!-- Primary Action - Retry Payment -->
            <button
              @click="retryPayment"
              :disabled="isProcessing"
              class="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span v-if="isProcessing" class="flex items-center justify-center">
                <svg class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang xử lý...
              </span>
              <span v-else class="flex items-center justify-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Thử lại thanh toán
              </span>
            </button>

            <!-- Secondary Actions -->
            <div class="grid grid-cols-2 gap-3">
              <button
                @click="goToOrderDetail"
                class="px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-xl transition-colors"
              >
                <svg
                  class="w-4 h-4 inline mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Xem đơn hàng
              </button>

              <button
                @click="goToCart"
                class="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
              >
                <svg
                  class="w-4 h-4 inline mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6H19"
                  />
                </svg>
                Về giỏ hàng
              </button>
            </div>

            <!-- Alternative Payment Methods -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <p class="text-sm text-gray-600 text-center mb-4">
                Hoặc thử phương thức thanh toán khác
              </p>

              <div class="space-y-3">
                <button
                  @click="payWithCash"
                  class="w-full flex items-center justify-center px-4 py-3 border-2 border-green-200 hover:border-green-300 bg-green-50 hover:bg-green-100 text-green-700 font-medium rounded-xl transition-all"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-3a2 2 0 00-2-2H9a2 2 0 00-2 2v3a2 2 0 002 2z"
                    />
                  </svg>
                  Thanh toán khi nhận hàng (COD)
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-8 py-4 border-t border-gray-100">
          <div class="text-center">
            <p class="text-xs text-gray-500 mb-2">Cần hỗ trợ? Liên hệ với chúng tôi</p>
            <div class="flex justify-center space-x-4">
              <a
                href="tel:1900000000"
                class="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                📞 Hotline: 0374274604
              </a>
              <span class="text-gray-300">|</span>
              <a
                href="mailto:dinbeedymc@gmail.com"
                class="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                ✉️ Email hỗ trợ
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Back to Home -->
      <div class="text-center mt-6">
        <button
          @click="goToHome"
          class="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
        >
          ← Về trang chủ SmartShoes
        </button>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div
      v-if="showToast"
      class="fixed top-4 right-4 z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-4 max-w-sm"
    >
      <div class="flex items-start space-x-3">
        <svg
          :class="toastType === 'success' ? 'text-green-500' : 'text-red-500'"
          class="w-5 h-5 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            v-if="toastType === 'success'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <p class="text-sm font-medium text-gray-900">{{ toastMessage }}</p>
        </div>
        <button @click="hideToast" class="text-gray-400 hover:text-gray-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { createMomoPayment, redirectToMomoPayment } from './payments.api'
import { getCurrentUser } from '@/common/guards/roleGuard.guard'
import { getOrder } from '../orders/orders.api'

const router = useRouter()
const route = useRoute()

// States
const isProcessing = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('error')

const paymentInfo = ref({
  orderId: '',
  amount: 0,
  method: 'MOMO',
  errorCode: '',
  errorMessage: '',
})

// Toast functions
const showToastMessage = (message: string, type: 'success' | 'error' = 'error') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    hideToast()
  }, 5000)
}

const hideToast = () => {
  showToast.value = false
}

// Utility functions
const formatPrice = (price: number) => {
  if (!price || isNaN(price)) return '0 ₫'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

// Actions
const retryPayment = async () => {
  if (!paymentInfo.value.orderId || isProcessing.value) return

  try {
    isProcessing.value = true

    console.log('🔄 Retrying MoMo payment for order:', paymentInfo.value.orderId)

    // Tạo payment MoMo mới
    const momoResponse = await createMomoPayment(
      paymentInfo.value.orderId,
      paymentInfo.value.amount,
    )

    console.log('✅ MoMo payment created:', momoResponse)

    if (momoResponse.payUrl) {
      showToastMessage('Đang chuyển hướng đến trang thanh toán...', 'success')

      setTimeout(() => {
        redirectToMomoPayment(momoResponse.payUrl)
      }, 1500)
    } else {
      throw new Error('Không nhận được link thanh toán từ MoMo')
    }
  } catch (error: any) {
    console.error('❌ Retry payment error:', error)

    let errorMsg = 'Có lỗi xảy ra khi tạo thanh toán mới'
    if (error?.response?.data?.message) {
      errorMsg = error.response.data.message
    } else if (error?.message) {
      errorMsg = error.message
    }

    showToastMessage(errorMsg, 'error')
  } finally {
    isProcessing.value = false
  }
}

const goToOrderDetail = () => {
  if (paymentInfo.value.orderId) {
    router.push(`/orders/${paymentInfo.value.orderId}`)
  } else {
    router.push('/orders')
  }
}

const goToCart = () => {
  router.push('/cart')
}

const payWithCash = () => {
  if (paymentInfo.value.orderId) {
    router.push(`/orders/${paymentInfo.value.orderId}`)
  } else {
    router.push('/checkout')
  }
  showToastMessage('Bạn có thể thay đổi phương thức thanh toán trong chi tiết đơn hàng', 'success')
}

const goToHome = () => {
  router.push('/')
}

// Load payment info from URL params
const loadPaymentInfo = async () => {
  try {
    // Lấy thông tin từ URL query params
    const orderId = route.query.orderId as string
    const amount = route.query.amount as string
    const errorCode = route.query.errorCode as string
    const errorMessage = route.query.message as string

    if (orderId) {
      paymentInfo.value.orderId = orderId
      paymentInfo.value.amount = amount ? parseFloat(amount) : 0
      paymentInfo.value.errorCode = errorCode || ''
      paymentInfo.value.errorMessage = errorMessage || ''

      // Nếu có orderId nhưng chưa có amount, fetch từ API
      if (!paymentInfo.value.amount && orderId) {
        const orderData = await getOrder(orderId)
        if (orderData) {
          paymentInfo.value.amount = orderData.totalAmount
        }
      }
    } else {
      // Fallback: lấy từ localStorage nếu có
      const lastOrder = localStorage.getItem('lastOrderPayment')
      if (lastOrder) {
        const orderData = JSON.parse(lastOrder)
        paymentInfo.value = { ...paymentInfo.value, ...orderData }
      }
    }

    console.log('💳 Payment failed info loaded:', paymentInfo.value)
  } catch (error) {
    console.error('❌ Error loading payment info:', error)
  }
}

// Lifecycle
onMounted(() => {
  loadPaymentInfo()
})
</script>

<style scoped>
/* Custom animations */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slideUp 0.5s ease-out;
}

/* Hover effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

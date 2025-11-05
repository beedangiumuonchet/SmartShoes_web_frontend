<!-- src/modules/orders/OrderSuccessView.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-2xl shadow-xl p-8 text-center">
        <!-- Success Icon -->
        <div
          class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <!-- Success Message -->
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          {{ successTitle }}
        </h1>
        <p class="text-lg text-gray-600 mb-8">
          {{ successMessage }}
        </p>

        <!-- Order Info -->
        <div v-if="orderId" class="bg-gray-50 rounded-xl p-6 mb-8">
          <div class="text-sm text-gray-600 mb-2">Mã đơn hàng</div>
          <div class="text-xl font-bold text-gray-900">#{{ orderId.slice(-8) }}</div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="viewOrder"
            class="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Xem Chi Tiết Đơn Hàng
          </button>
          <button
            @click="continueShopping"
            class="px-8 py-3 bg-white border-2 border-gray-300 hover:border-green-500 text-gray-700 hover:text-green-600 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            Tiếp Tục Mua Sắm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const orderId = ref<string>('')
const paymentMethod = ref<string>('')

const successTitle = computed(() => {
  if (paymentMethod.value === 'MOMO') {
    return 'Thanh toán thành công!'
  }
  return 'Đặt hàng thành công!'
})

const successMessage = computed(() => {
  if (paymentMethod.value === 'MOMO') {
    return 'Đơn hàng của bạn đã được thanh toán thành công qua MoMo. Chúng tôi sẽ xử lý và giao hàng trong thời gian sớm nhất.'
  }
  return 'Đơn hàng của bạn đã được tạo thành công. Bạn sẽ thanh toán khi nhận hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất.'
})

const viewOrder = () => {
  if (orderId.value) {
    router.push(`/orders/${orderId.value}`)
  } else {
    router.push('/orders')
  }
}

const continueShopping = () => {
  router.push('/')
}

onMounted(() => {
  // Lấy thông tin từ query params
  orderId.value = (route.query.orderId as string) || ''
  paymentMethod.value = (route.query.paymentMethod as string) || ''
})
</script>

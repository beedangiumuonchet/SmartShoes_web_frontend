<template>
  <div class="min-h-screen bg-gray-50 py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="flex mb-6" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2">
          <li>
            <button @click="goBack" class="text-gray-500 hover:text-rose-500 transition-colors">
              Giỏ hàng
            </button>
          </li>
          <li>
            <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a 1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </li>
          <li>
            <span class="text-gray-900 font-medium">Thanh toán</span>
          </li>
        </ol>
      </nav>

      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Thanh Toán Đơn Hàng</h1>
        <p class="mt-2 text-gray-600">{{ checkoutItems.length }} sản phẩm được chọn</p>
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
          <p class="text-gray-600 text-lg">Đang tải thông tin thanh toán...</p>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Address & Order Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- ✅ Delivery Address - MOVED TO TOP -->
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
              Địa chỉ giao hàng
            </h2>

            <!-- Address Selection -->
            <div v-if="addresses.length > 0" class="space-y-3">
              <div v-for="address in addresses" :key="address.id" class="relative">
                <label
                  class="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  :class="{
                    'border-rose-500 bg-rose-50': selectedAddress?.id === address.id,
                    'border-gray-200': selectedAddress?.id !== address.id,
                  }"
                >
                  <input
                    type="radio"
                    :value="address"
                    v-model="selectedAddress"
                    class="mt-1 text-rose-500 focus:ring-rose-500"
                  />
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-medium text-gray-900">{{ address.fullName }}</span>
                      <span
                        v-if="address.isDefault"
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        Mặc định
                      </span>
                    </div>
                    <div class="text-sm text-gray-600 mb-1">{{ address.phone }}</div>
                    <div class="text-sm text-gray-600">
                      {{ address.street }}, {{ address.ward }}, {{ address.city }}
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Add New Address -->
            <div class="mt-4">
              <button
                @click="showAddressForm = !showAddressForm"
                class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                {{ addresses.length > 0 ? 'Thêm địa chỉ mới' : 'Thêm địa chỉ giao hàng' }}
              </button>
            </div>

            <!-- New Address Form -->
            <div
              v-if="showAddressForm"
              class="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50"
            >
              <h3 class="text-lg font-medium text-gray-900 mb-4">Thêm địa chỉ mới</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                  <input
                    type="text"
                    v-model="newAddress.fullName"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    v-model="newAddress.phone"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố</label>
                  <input
                    type="text"
                    v-model="newAddress.city"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Nhập tỉnh/thành phố"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Quận/Huyện/Phường</label
                  >
                  <input
                    type="text"
                    v-model="newAddress.ward"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Nhập quận/huyện/phường"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Số nhà, tên đường</label
                  >
                  <input
                    type="text"
                    v-model="newAddress.street"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Nhập số nhà, tên đường"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      v-model="newAddress.isDefault"
                      class="rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">Đặt làm địa chỉ mặc định</span>
                  </label>
                </div>
              </div>
              <div class="flex gap-3 mt-4">
                <button
                  @click="saveAddress"
                  :disabled="!isAddressValid || isSaving"
                  class="px-4 py-2 bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors"
                >
                  {{ isSaving ? 'Đang lưu...' : 'Lưu địa chỉ' }}
                </button>
                <button
                  @click="showAddressForm = false"
                  class="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>

          <!-- ✅ Order Items - WITH API DATA -->
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
              Sản phẩm đã chọn
            </h2>

            <div class="space-y-4">
              <div
                v-for="item in checkoutItems"
                :key="item.cartDetailId"
                class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
              >
                <!-- Product Image -->
                <div class="flex-shrink-0">
                  <img
                    :src="item.productImage"
                    :alt="item.productName"
                    class="w-16 h-16 object-cover rounded-lg border border-gray-200"
                  />
                </div>

                <!-- Product Info -->
                <div class="flex-1 min-w-0">
                  <h3 class="text-base font-medium text-gray-900 line-clamp-2 mb-1">
                    {{ item.productName }}
                  </h3>
                  <div class="flex flex-wrap gap-2 text-sm">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800"
                    >
                      Size: {{ item.size }}
                    </span>
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                    >
                      Màu: {{ item.color }}
                    </span>
                  </div>
                </div>

                <!-- Quantity & Price -->
                <div class="text-right">
                  <div class="text-sm text-gray-600 mb-1">SL: {{ item.quantity }}</div>
                  <div class="text-lg font-semibold text-rose-600">
                    {{ formatPrice(item.subtotal) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg
                class="w-6 h-6 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                ></path>
              </svg>
              Phương thức thanh toán
            </h2>

            <div class="space-y-3">
              <!-- Cash Payment -->
              <label
                class="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                :class="{
                  'border-rose-500 bg-rose-50': selectedPaymentMethod === PaymentMethod.CASH,
                  'border-gray-200': selectedPaymentMethod !== PaymentMethod.CASH,
                }"
              >
                <input
                  type="radio"
                  :value="PaymentMethod.CASH"
                  v-model="selectedPaymentMethod"
                  class="mt-1 text-rose-500 focus:ring-rose-500"
                />
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <svg
                      class="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      ></path>
                    </svg>
                    <span class="font-medium text-gray-900">Thanh toán khi nhận hàng (COD)</span>
                  </div>
                  <div class="text-sm text-gray-600">Thanh toán bằng tiền mặt khi nhận hàng</div>
                </div>
              </label>

              <!-- MoMo Payment -->
              <label
                class="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                :class="{
                  'border-rose-500 bg-rose-50': selectedPaymentMethod === PaymentMethod.MOMO,
                  'border-gray-200': selectedPaymentMethod !== PaymentMethod.MOMO,
                }"
              >
                <input
                  type="radio"
                  :value="PaymentMethod.MOMO"
                  v-model="selectedPaymentMethod"
                  class="mt-1 text-rose-500 focus:ring-rose-500"
                />
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <svg class="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"
                      />
                    </svg>
                    <span class="font-medium text-gray-900">Ví MoMo</span>
                    <span
                      class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-pink-100 text-pink-800"
                    >
                      Phổ biến
                    </span>
                  </div>
                  <div class="text-sm text-gray-600">Thanh toán online qua ví MoMo</div>
                </div>
              </label>
            </div>
          </div>

          <!-- Order Note -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg
                class="w-6 h-6 text-yellow-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                ></path>
              </svg>
              Ghi chú đơn hàng
            </h2>
            <textarea
              v-model="orderNote"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
              placeholder="Nhập ghi chú cho đơn hàng (tùy chọn)"
            ></textarea>
          </div>
        </div>

        <!-- Right Column: Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>

            <!-- Order Summary -->
            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-gray-600">
                <span>Tạm tính ({{ summary.itemCount }} sản phẩm)</span>
                <span>{{ formatPrice(summary.subtotal) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span>{{ formatPrice(summary.shippingFee) }}</span>
              </div>
              <div class="border-t border-gray-200 pt-3">
                <div class="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Tổng cộng</span>
                  <span class="text-rose-600">{{ formatPrice(summary.total) }}</span>
                </div>
              </div>
            </div>

            <!-- Checkout Button -->
            <button
              @click="placeOrder"
              :disabled="!canPlaceOrder"
              class="w-full px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span v-if="isPlacingOrder" class="flex items-center justify-center">
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
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
              <span v-else>Đặt hàng ngay</span>
            </button>

            <!-- Security Note -->
            <div class="mt-4 p-3 bg-green-50 rounded-lg">
              <div class="flex items-center text-green-800 text-sm">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  ></path>
                </svg>
                Thông tin của bạn được bảo mật hoàn toàn
              </div>
            </div>
          </div>
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
import { useRouter } from 'vue-router'
import { getCurrentUser } from '@/common/guards/roleGuard.guard'
import { getUserCart } from '../carts/carts.api'
import { getUserAddresses, createAddress } from '../addresses/addresses.api'
import { fromCart } from '../orders/orders.api'
import { createPayment, createMomoPayment, redirectToMomoPayment } from '../payments/payments.api'
import { PaymentMethod } from '../payments/payments.type'
import type { Address } from '../addresses/addresses.type'
import { AddressForm } from '../addresses/addresses.type'
import { FromCartRequest } from '../orders/orders.type'
import { CreatePaymentRequest } from '../payments/payments.type'
// ✅ Import API để lấy variant với product - SAME AS CARTVIEW
import { getVariantWithProductByIdApi } from '@/modules/products/product.api'
import type { ProductVariantWithProduct } from '@/modules/products/product.type'

const router = useRouter()

// State
const loading = ref(true)
const isSaving = ref(false)
const isPlacingOrder = ref(false)
const showAddressForm = ref(false)
const showSuccessToast = ref(false)
const showErrorToast = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const orderNote = ref('')

// ✅ Cache để lưu thông tin variant đã fetch - SAME AS CARTVIEW
const variantCache = ref<Map<string, ProductVariantWithProduct>>(new Map())

// Data
interface CheckoutItem {
  cartDetailId: string
  productVariantId: string
  productName: string
  productImage: string
  size: string
  color: string
  price: number
  quantity: number
  subtotal: number
}

const checkoutItems = ref<CheckoutItem[]>([])
const addresses = ref<Address[]>([])
const paymentMethods = ref([PaymentMethod.CASH, PaymentMethod.MOMO])

// Selections
const selectedAddress = ref<Address | null>(null)
const selectedPaymentMethod = ref<PaymentMethod>(PaymentMethod.CASH)

// New Address Form
const newAddress = ref(new AddressForm())

// Computed
const currentUser = computed(() => getCurrentUser())

const isAddressValid = computed(() => {
  return (
    newAddress.value.fullName.trim() !== '' &&
    newAddress.value.phone.trim() !== '' &&
    newAddress.value.city !== '' &&
    newAddress.value.ward.trim() !== '' &&
    newAddress.value.street.trim() !== ''
  )
})

const summary = computed(() => {
  const subtotal = checkoutItems.value.reduce((total, item) => total + item.subtotal, 0)
  const shippingFee = 0 // Default shipping fee

  return {
    subtotal,
    shippingFee,
    total: subtotal + shippingFee,
    itemCount: checkoutItems.value.reduce((total, item) => total + item.quantity, 0),
  }
})

const canPlaceOrder = computed(() => {
  return (
    checkoutItems.value.length > 0 &&
    (selectedAddress.value || isAddressValid.value) &&
    selectedPaymentMethod.value &&
    !isPlacingOrder.value
  )
})

// Methods
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

// ✅ HELPER FUNCTIONS - SAME AS CARTVIEW với API cache
const getProductName = (detail: any) => {
  console.log('📦 Getting product name for detail:', detail.id || detail.cartDetailId)

  // ✅ Lấy từ cache variant đã fetch
  const variantInfo = variantCache.value.get(detail.productVariantId)
  if (variantInfo?.product?.name) {
    console.log('✅ Found product name from API cache:', variantInfo.product.name)
    return variantInfo.product.name
  }

  // Fallback - từ data có sẵn trong cart (nếu được populate)
  if (detail.productVariant?.product?.name) {
    console.log('✅ Found product name from populated data:', detail.productVariant.product.name)
    return detail.productVariant.product.name
  }

  if (detail.product?.name) {
    console.log('✅ Found product name from detail.product:', detail.product.name)
    return detail.product.name
  }

  if (detail.name) {
    console.log('✅ Found name from detail.name:', detail.name)
    return detail.name
  }

  // Fallback với productVariantId
  const fallbackName = `Sản phẩm #${detail.productVariantId?.slice(-8) || 'Unknown'}`
  console.log('⚠️ Using fallback name:', fallbackName)
  return fallbackName
}

const getProductImage = (detail: any) => {
  console.log('🖼️ Getting product image for detail:', detail.id || detail.cartDetailId)

  // ✅ Lấy từ cache variant đã fetch
  const variantInfo = variantCache.value.get(detail.productVariantId)
  if (variantInfo?.images?.length > 0) {
    // Tìm main image trước
    const mainImage = variantInfo.images.find((img) => img.isMain)
    if (mainImage?.url) {
      console.log('✅ Found main image from API cache:', mainImage.url)
      return mainImage.url
    }

    // Nếu không có main, lấy ảnh đầu tiên
    const firstImage = variantInfo.images[0]?.url
    if (firstImage) {
      console.log('✅ Found first image from API cache:', firstImage)
      return firstImage
    }
  }

  // Fallback - từ data có sẵn trong cart
  if (detail.productVariant?.images?.length > 0) {
    const mainImage = detail.productVariant.images.find((img: any) => img.isMain)
    if (mainImage?.url) {
      console.log('✅ Found image from populated data (main):', mainImage.url)
      return mainImage.url
    }

    const firstImage = detail.productVariant.images[0]?.url
    if (firstImage) {
      console.log('✅ Found image from populated data (first):', firstImage)
      return firstImage
    }
  }

  if (detail.productVariant?.product?.images?.length > 0) {
    const mainImage = detail.productVariant.product.images.find((img: any) => img.isMain)
    if (mainImage?.url) return mainImage.url
    return detail.productVariant.product.images[0].url
  }

  if (detail.productVariant?.image) {
    return typeof detail.productVariant.image === 'string'
      ? detail.productVariant.image
      : detail.productVariant.image.url
  }

  if (detail.product?.images?.length > 0) {
    const mainImage = detail.product.images.find((img: any) => img.isMain)
    if (mainImage?.url) return mainImage.url
    return detail.product.images[0].url
  }

  if (detail.image) {
    return typeof detail.image === 'string' ? detail.image : detail.image.url
  }

  // Default placeholder
  const placeholder = 'https://via.placeholder.com/150x150/f3f4f6/9ca3af?text=SmartShoes'
  console.log('⚠️ Using placeholder image:', placeholder)
  return placeholder
}

const getVariantSize = (detail: any) => {
  console.log('📏 Getting variant size for detail:', detail.id || detail.cartDetailId)

  // ✅ Lấy từ cache variant đã fetch
  const variantInfo = variantCache.value.get(detail.productVariantId)
  if (variantInfo?.size) {
    console.log('✅ Found size from API cache:', variantInfo.size)
    return variantInfo.size
  }

  // Fallback - từ data có sẵn trong cart
  if (detail.productVariant?.size) {
    console.log('✅ Found size from populated data:', detail.productVariant.size)
    return detail.productVariant.size
  }

  if (detail.size) return detail.size
  if (detail.variantSize) return detail.variantSize

  console.log('⚠️ No size found, returning N/A')
  return 'N/A'
}

const getVariantColor = (detail: any) => {
  console.log('🎨 Getting variant color for detail:', detail.id || detail.cartDetailId)

  // ✅ Lấy từ cache variant đã fetch
  const variantInfo = variantCache.value.get(detail.productVariantId)

  // Support cả colorName và color.name
  if (variantInfo?.colorName) {
    console.log('✅ Found colorName from API cache:', variantInfo.colorName)
    return variantInfo.colorName
  }

  if (variantInfo?.color?.name) {
    console.log('✅ Found color.name from API cache:', variantInfo.color.name)
    return variantInfo.color.name
  }

  // Fallback - từ data có sẵn trong cart
  if (detail.productVariant?.color?.name) {
    console.log('✅ Found color from populated data:', detail.productVariant.color.name)
    return detail.productVariant.color.name
  }

  if (detail.productVariant?.colorName) {
    console.log('✅ Found colorName from populated data:', detail.productVariant.colorName)
    return detail.productVariant.colorName
  }

  if (detail.color?.name) return detail.color.name
  if (detail.colorName) return detail.colorName
  if (detail.variantColor) return detail.variantColor

  console.log('⚠️ No color found, returning N/A')
  return 'N/A'
}

// ✅ Load thông tin variant từ API cho tất cả items - SAME AS CARTVIEW
const loadVariantInfoForCheckoutItems = async (cartDetails: any[]) => {
  console.log('🔄 Loading variant info for checkout items...')

  const promises = cartDetails.map(async (detail) => {
    if (!variantCache.value.has(detail.productVariantId)) {
      try {
        console.log(`🔍 Fetching variant info for: ${detail.productVariantId}`)
        const variantWithProduct = await getVariantWithProductByIdApi(detail.productVariantId)
        variantCache.value.set(detail.productVariantId, variantWithProduct)
        console.log(`✅ Loaded variant info:`, variantWithProduct)
      } catch (error) {
        console.error(`❌ Error loading variant ${detail.productVariantId}:`, error)
      }
    }
  })

  await Promise.all(promises)
  console.log('✅ All variant info loaded for checkout')
}

const loadCheckoutData = async () => {
  if (!currentUser.value?.userId) {
    router.push('/login')
    return
  }

  try {
    loading.value = true

    // Get cart and selected items from localStorage
    const cart = await getUserCart(currentUser.value.userId)
    const selectedItemIds = JSON.parse(localStorage.getItem('selectedCartItems') || '[]')

    if (!cart || !cart.details || selectedItemIds.length === 0) {
      showError('Không có sản phẩm nào được chọn để thanh toán')
      router.push('/cart')
      return
    }

    // Filter selected items
    const selectedDetails = cart.details.filter((detail) => selectedItemIds.includes(detail.id))

    // ✅ Load variant info cho các items được chọn
    await loadVariantInfoForCheckoutItems(selectedDetails)

    // ✅ Transform to checkout items with API data
    checkoutItems.value = selectedDetails.map((detail) => ({
      cartDetailId: detail.id,
      productVariantId: detail.productVariantId,
      productName: getProductName(detail),
      productImage: getProductImage(detail),
      size: getVariantSize(detail),
      color: getVariantColor(detail),
      price: detail.priceSale,
      quantity: detail.quantity,
      subtotal: detail.subtotal,
    }))

    // Load addresses
    const addressesData = await getUserAddresses(currentUser.value.userId)
    addresses.value = addressesData

    // Set default address if available
    if (addresses.value.length > 0) {
      selectedAddress.value = addresses.value.find((addr) => addr.isDefault) || addresses.value[0]
    }

    console.log('✅ Checkout data loaded:', {
      items: checkoutItems.value,
      addresses: addresses.value,
    })
  } catch (error) {
    console.error('❌ Error loading checkout data:', error)
    showError('Có lỗi xảy ra khi tải thông tin thanh toán')
  } finally {
    loading.value = false
  }
}

const saveAddress = async () => {
  if (!isAddressValid.value) {
    showError('Vui lòng điền đầy đủ thông tin địa chỉ')
    return
  }

  try {
    isSaving.value = true
    const savedAddress = await createAddress(newAddress.value, currentUser.value?.userId)

    addresses.value.push(savedAddress)
    selectedAddress.value = savedAddress
    showAddressForm.value = false

    // Reset form
    newAddress.value = new AddressForm()

    showSuccess('Đã lưu địa chỉ thành công')
  } catch (error) {
    console.error('❌ Error saving address:', error)
    showError('Có lỗi xảy ra khi lưu địa chỉ')
  } finally {
    isSaving.value = false
  }
}

// 🆕 MAIN: placeOrder function với shipping info và payment methods
const placeOrder = async () => {
  if (!canPlaceOrder.value) {
    showError('Vui lòng kiểm tra lại thông tin đơn hàng')
    return
  }

  try {
    isPlacingOrder.value = true

    // 🆕 VALIDATION: Kiểm tra user
    if (!currentUser.value?.userId) {
      showError('Phiên đăng nhập không hợp lệ')
      router.push('/login')
      return
    }

    // 🆕 STEP 1: Chuẩn bị shipping info từ selectedAddress hoặc newAddress
    let shippingInfo: {
      name: string
      phone: string
      address: string
    }

    if (selectedAddress.value) {
      // 🎯 Lấy từ địa chỉ đã chọn
      shippingInfo = {
        name: selectedAddress.value.fullName,
        phone: selectedAddress.value.phone,
        address: `${selectedAddress.value.street}, ${selectedAddress.value.ward}, ${selectedAddress.value.city}`,
      }
    } else if (isAddressValid.value) {
      // 🎯 Tạo địa chỉ mới từ form
      const savedAddress = await createAddress(newAddress.value, currentUser.value.userId)
      shippingInfo = {
        name: savedAddress.fullName,
        phone: savedAddress.phone,
        address: `${savedAddress.street}, ${savedAddress.ward}, ${savedAddress.city}`,
      }
    } else {
      throw new Error('Vui lòng chọn hoặc nhập địa chỉ giao hàng')
    }

    // 🆕 VALIDATION: Kiểm tra shipping info
    if (!shippingInfo.name.trim()) {
      showError('Tên người nhận không được để trống')
      return
    }
    if (!shippingInfo.phone.trim()) {
      showError('Số điện thoại không được để trống')
      return
    }
    if (!shippingInfo.address.trim()) {
      showError('Địa chỉ giao hàng không được để trống')
      return
    }

    console.log('📦 Shipping Info:', shippingInfo)

    // 🆕 STEP 2: Get cart và validate
    const cart = await getUserCart(currentUser.value.userId)

    if (!cart || !cart.id) {
      showError('Không tìm thấy giỏ hàng hợp lệ')
      router.push('/cart')
      return
    }

    if (!cart.details || cart.details.length === 0) {
      showError('Giỏ hàng trống')
      router.push('/cart')
      return
    }

    console.log('🛒 Cart data:', cart)

    // 🆕 STEP 3: Create order request với shipping info
    const orderRequest = new FromCartRequest(
      cart.id,
      shippingInfo.name.trim(),
      shippingInfo.phone.trim(),
      shippingInfo.address.trim(),
    )

    console.log('📋 Order Request:', orderRequest)
    console.log('📋 Order Request JSON:', JSON.stringify(orderRequest, null, 2))

    // 🆕 STEP 4: Create order
    const order = await fromCart(orderRequest)
    console.log('✅ Order created successfully:', order)

    // 🆕 STEP 5: Create payment based on method
    if (selectedPaymentMethod.value === PaymentMethod.CASH) {
      // 💰 COD Payment
      try {
        const paymentRequest = new CreatePaymentRequest(
          order.id,
          PaymentMethod.CASH,
          summary.value.total,
        )

        console.log('💰 Creating COD payment:', paymentRequest)
        const payment = await createPayment(paymentRequest)
        console.log('✅ COD Payment created:', payment)

        // Success handling
        localStorage.removeItem('selectedCartItems')
        showSuccess('Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng.')

        setTimeout(() => {
          router.push(`/orders/${order.id}`)
        }, 1500)
      } catch (paymentError) {
        console.error('❌ COD Payment error:', paymentError)
        showError('Đặt hàng thành công nhưng có lỗi tạo thanh toán. Đơn hàng vẫn được xử lý.')

        setTimeout(() => {
          router.push(`/orders/${order.id}`)
        }, 2000)
      }
    } else if (selectedPaymentMethod.value === PaymentMethod.MOMO) {
      // 📱 MoMo Payment
      try {
        console.log('🔄 Creating MoMo payment...')
        const momoResponse = await createMomoPayment(order.id, summary.value.total)
        console.log('✅ MoMo payment created:', momoResponse)

        // Clear selected items
        localStorage.removeItem('selectedCartItems')
        showSuccess('Chuyển hướng đến MoMo để thanh toán...')

        // Redirect to MoMo payment
        setTimeout(() => {
          redirectToMomoPayment(momoResponse.payUrl)
        }, 1000)
      } catch (paymentError) {
        console.error('❌ MoMo Payment error:', paymentError)
        showError('Đặt hàng thành công nhưng có lỗi tạo thanh toán MoMo. Vui lòng thử lại.')

        setTimeout(() => {
          router.push(`/orders/${order.id}`)
        }, 2000)
      }
    }
  } catch (error) {
    console.error('❌ Error placing order:', error)

    // Enhanced error handling
    let errorMsg = 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.'

    if (error && typeof error === 'object') {
      if ('message' in error && typeof error.message === 'string') {
        errorMsg = error.message
      }

      if ('response' in error) {
        const httpError = error as any
        const status = httpError.response?.status
        const responseData = httpError.response?.data

        console.error('🚨 HTTP Error Details:', {
          status,
          url: httpError.config?.url,
          method: httpError.config?.method,
          requestData: httpError.config?.data,
          responseData,
        })

        if (status === 400) {
          if (responseData?.message) {
            errorMsg = responseData.message
          } else {
            errorMsg = 'Thông tin đơn hàng không hợp lệ. Vui lòng kiểm tra lại địa chỉ và sản phẩm.'
          }
        } else if (status === 401) {
          errorMsg = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
          setTimeout(() => {
            router.push('/login')
          }, 2000)
        } else if (status === 404) {
          errorMsg = 'Không tìm thấy giỏ hàng hoặc sản phẩm.'
        } else if (status === 422) {
          errorMsg = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.'
        }
      }
    }

    showError(errorMsg)
  } finally {
    isPlacingOrder.value = false
  }
}

const goBack = () => {
  router.push('/cart')
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
  loadCheckoutData()
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

/* Enhanced hover effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Enhanced shadows */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
</style>

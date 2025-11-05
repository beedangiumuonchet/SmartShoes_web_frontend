<template>
  <div class="min-h-screen bg-gray-50 py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="flex mb-6" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2">
          <li>
            <button
              @click="$router.push('/')"
              class="text-gray-500 hover:text-rose-500 transition-colors"
            >
              Trang chủ
            </button>
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
            <button
              @click="$router.push('/cart')"
              class="text-gray-500 hover:text-rose-500 transition-colors"
            >
              Giỏ hàng
            </button>
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
            <span class="text-gray-900 font-medium">Thanh toán</span>
          </li>
        </ol>
      </nav>

      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Thanh Toán</h1>
        <p class="mt-2 text-gray-600">Hoàn tất đơn hàng của bạn</p>
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
          <p class="text-gray-600 text-lg">Đang tải thông tin...</p>
        </div>
      </div>

      <!-- Checkout Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Forms -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Shipping Address Section -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-900 flex items-center">
                <svg
                  class="w-6 h-6 text-rose-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Địa chỉ giao hàng
              </h2>
              <button
                @click="showAddressForm = !showAddressForm"
                class="text-rose-500 hover:text-rose-600 font-medium text-sm"
              >
                {{ showAddressForm ? 'Hủy' : 'Thêm mới' }}
              </button>
            </div>

            <!-- Existing Addresses -->
            <div v-if="!showAddressForm && addresses.length > 0" class="space-y-4">
              <div
                v-for="address in addresses"
                :key="address.id"
                class="border border-gray-200 rounded-lg p-4 cursor-pointer transition-all hover:border-rose-300"
                :class="{ 'border-rose-500 bg-rose-50': selectedAddress?.id === address.id }"
                @click="selectedAddress = address"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <input
                      type="radio"
                      :checked="selectedAddress?.id === address.id"
                      class="text-rose-500 focus:ring-rose-500"
                      @change="selectedAddress = address"
                    />
                    <div class="ml-3">
                      <div class="font-medium text-gray-900">{{ address.fullName }}</div>
                      <div class="text-sm text-gray-600">{{ address.phone }}</div>
                      <div class="text-sm text-gray-500 mt-1">
                        {{ address.street }}, {{ address.ward }}, {{ address.city }}
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="address.isDefault"
                    class="bg-rose-100 text-rose-800 px-2 py-1 rounded text-xs font-medium"
                  >
                    Mặc định
                  </div>
                </div>
              </div>
            </div>

            <!-- New Address Form -->
            <div v-if="showAddressForm || addresses.length === 0" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Họ và tên *</label>
                  <input
                    v-model="newAddress.fullName"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Số điện thoại *</label
                  >
                  <input
                    v-model="newAddress.phone"
                    type="tel"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Thành phố *</label>
                  <select
                    v-model="newAddress.city"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                  >
                    <option value="">Chọn thành phố</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Hải Phòng">Hải Phòng</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Phường/Xã *</label>
                  <input
                    v-model="newAddress.ward"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Nhập phường/xã"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Địa chỉ cụ thể *</label>
                <input
                  v-model="newAddress.street"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                  placeholder="Số nhà, tên đường..."
                />
              </div>

              <button
                @click="saveAddress"
                :disabled="!isAddressValid || isSaving"
                class="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {{ isSaving ? 'Đang lưu...' : 'Lưu địa chỉ' }}
              </button>
            </div>
          </div>

          <!-- Payment Method Section -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <svg
                class="w-6 h-6 text-rose-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              Phương thức thanh toán
            </h2>

            <div class="space-y-4">
              <div
                v-for="method in paymentMethods"
                :key="method"
                class="border border-gray-200 rounded-lg p-4 cursor-pointer transition-all hover:border-rose-300"
                :class="{ 'border-rose-500 bg-rose-50': selectedPaymentMethod === method }"
                @click="selectedPaymentMethod = method"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <input
                      type="radio"
                      :checked="selectedPaymentMethod === method"
                      class="text-rose-500 focus:ring-rose-500"
                    />
                    <div class="ml-3">
                      <div class="font-medium text-gray-900">
                        {{ getPaymentMethodLabel(method) }}
                      </div>
                      <div class="text-sm text-gray-600">
                        {{ getPaymentMethodDescription(method) }}
                      </div>
                    </div>
                  </div>
                  <div v-if="method === PaymentMethod.MOMO" class="flex items-center">
                    <div class="w-12 h-8 bg-pink-500 rounded flex items-center justify-center">
                      <span class="text-white text-xs font-bold">MOMO</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Note -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg
                class="w-6 h-6 text-rose-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Ghi chú đơn hàng
            </h2>
            <textarea
              v-model="orderNote"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
              placeholder="Ghi chú thêm cho đơn hàng (tùy chọn)"
            ></textarea>
          </div>
        </div>

        <!-- Right Column: Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>

            <!-- Order Items -->
            <div class="space-y-4 mb-6">
              <div
                v-for="item in checkoutItems"
                :key="item.cartDetailId"
                class="flex items-center space-x-3"
              >
                <img
                  :src="item.productImage"
                  :alt="item.productName"
                  class="w-16 h-16 object-cover rounded-lg border border-gray-200"
                />
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-medium text-gray-900 line-clamp-2">
                    {{ item.productName }}
                  </h3>
                  <div class="flex items-center gap-2 text-xs text-gray-600 mt-1">
                    <span class="bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded">{{
                      item.size
                    }}</span>
                    <span class="bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">{{
                      item.color
                    }}</span>
                  </div>
                  <div class="flex items-center justify-between mt-2">
                    <span class="text-sm text-gray-600">x{{ item.quantity }}</span>
                    <span class="text-sm font-semibold text-rose-600">{{
                      formatPrice(item.subtotal)
                    }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Order Summary -->
            <div class="border-t border-gray-200 pt-6 space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Tạm tính ({{ summary.itemCount }} sản phẩm)</span>
                <span class="font-medium">{{ formatPrice(summary.subtotal) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Phí vận chuyển</span>
                <span class="font-medium">{{ formatPrice(summary.shippingFee) }}</span>
              </div>
              <div class="border-t border-gray-200 pt-3 flex justify-between text-lg font-semibold">
                <span class="text-gray-900">Tổng cộng</span>
                <span class="text-rose-600">{{ formatPrice(summary.total) }}</span>
              </div>
            </div>

            <!-- Place Order Button -->
            <button
              @click="placeOrder"
              :disabled="!canPlaceOrder || isPlacingOrder"
              class="w-full mt-6 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span v-if="isPlacingOrder" class="flex items-center justify-center">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Đang xử lý...
              </span>
              <span v-else>Đặt hàng ngay</span>
            </button>

            <!-- Security Note -->
            <div class="mt-4 flex items-center justify-center text-xs text-gray-500">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Thông tin của bạn được bảo mật
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
  const shippingFee = 30000 // Default shipping fee

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

const getPaymentMethodLabel = (method: PaymentMethod) => {
  return method === PaymentMethod.CASH ? 'Thanh toán khi nhận hàng (COD)' : 'Ví MoMo'
}

const getPaymentMethodDescription = (method: PaymentMethod) => {
  return method === PaymentMethod.CASH
    ? 'Thanh toán bằng tiền mặt khi nhận hàng'
    : 'Thanh toán online qua ví MoMo'
}

// Helper functions từ CartView
const getProductName = (detail: any) => {
  if (detail.productVariant?.product?.name) {
    return detail.productVariant.product.name
  }
  if (detail.product?.name) {
    return detail.product.name
  }
  if (detail.name) {
    return detail.name
  }
  if (detail.productVariantId) {
    return `Sản phẩm ${detail.productVariantId.slice(-8)}`
  }
  return `Sản phẩm ${detail.productVariantId?.slice(-8) || detail.id?.slice(-8) || 'Unknown'}`
}

const getProductImage = (detail: any) => {
  if (detail.productVariant?.images?.length > 0) {
    const mainImage = detail.productVariant.images.find((img: any) => img.isMain)
    if (mainImage?.url) return mainImage.url
    return detail.productVariant.images[0].url
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
  return 'https://via.placeholder.com/150x150/f3f4f6/9ca3af?text=SmartShoes'
}

const getVariantSize = (detail: any) => {
  if (detail.productVariant?.size) return detail.productVariant.size
  if (detail.size) return detail.size
  if (detail.variantSize) return detail.variantSize
  return 'N/A'
}

const getVariantColor = (detail: any) => {
  if (detail.productVariant?.color?.name) return detail.productVariant.color.name
  if (detail.productVariant?.colorName) return detail.productVariant.colorName
  if (detail.color?.name) return detail.color.name
  if (detail.colorName) return detail.colorName
  if (detail.variantColor) return detail.variantColor
  return 'N/A'
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

    // Filter selected items and transform to checkout items
    const selectedDetails = cart.details.filter((detail) => selectedItemIds.includes(detail.id))

    checkoutItems.value = selectedDetails.map((detail) => ({
      cartDetailId: detail.id,
      productVariantId: detail.productVariantId,
      productName: getProductName(detail),
      productImage: getProductImage(detail),
      size: getVariantSize(detail),
      color: getVariantColor(detail),
      price: detail.price,
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

// 🆕 FIXED: placeOrder function với shipping info đúng
const placeOrder = async () => {
  if (!canPlaceOrder.value) {
    showError('Vui lòng kiểm tra lại thông tin đơn hàng')
    return
  }

  try {
    isPlacingOrder.value = true

    // 🆕 Chuẩn bị shipping info từ selectedAddress hoặc newAddress
    let shippingInfo: {
      name: string
      phone: string
      address: string
    }

    if (selectedAddress.value) {
      shippingInfo = {
        name: selectedAddress.value.fullName,
        phone: selectedAddress.value.phone,
        address: `${selectedAddress.value.street}, ${selectedAddress.value.ward}, ${selectedAddress.value.city}`,
      }
    } else if (isAddressValid.value) {
      // Tạo địa chỉ mới nếu chưa có (tùy chọn)
      const savedAddress = await createAddress(newAddress.value, currentUser.value!.userId)
      shippingInfo = {
        name: savedAddress.fullName,
        phone: savedAddress.phone,
        address: `${savedAddress.street}, ${savedAddress.ward}, ${savedAddress.city}`,
      }
    } else {
      throw new Error('Không có địa chỉ giao hàng hợp lệ')
    }

    // Step 1: Create order from cart với shipping info (BỎ addressId)
    const cart = await getUserCart(currentUser.value!.userId)

    // 🆕 UPDATED: FromCartRequest với shipping info thay vì addressId
    const orderRequest = new FromCartRequest(
      cart.id,
      shippingInfo.name,
      shippingInfo.phone,
      shippingInfo.address,
    )

    console.log('🛒 Creating order with shipping data:', orderRequest)
    const order = await fromCart(orderRequest)
    console.log('✅ Order created successfully:', order)

    // Step 2: Create payment based on method
    if (selectedPaymentMethod.value === PaymentMethod.CASH) {
      // 💰 COD Payment
      const paymentRequest = new CreatePaymentRequest(
        order.id,
        PaymentMethod.CASH,
        summary.value.total,
      )

      const payment = await createPayment(paymentRequest)
      console.log('✅ COD Payment created:', payment)

      // Clear selected items and redirect
      localStorage.removeItem('selectedCartItems')
      showSuccess('Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng.')

      setTimeout(() => {
        router.push(`/orders/${order.id}`)
      }, 1500)
    } else if (selectedPaymentMethod.value === PaymentMethod.MOMO) {
      // 📱 MoMo Payment
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
    }
  } catch (error) {
    console.error('❌ Error placing order:', error)

    // Show specific error message
    let errorMsg = 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.'

    if (error && typeof error === 'object' && 'response' in error) {
      const httpError = error as any
      if (httpError.response?.status === 400) {
        errorMsg = 'Thông tin đơn hàng không hợp lệ. Vui lòng kiểm tra lại.'
      } else if (httpError.response?.status === 401) {
        errorMsg = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else if (httpError.response?.status === 404) {
        errorMsg = 'Không tìm thấy giỏ hàng hoặc sản phẩm.'
      } else if (httpError.response?.data?.message) {
        errorMsg = httpError.response.data.message
      }
    }

    showError(errorMsg)
  } finally {
    isPlacingOrder.value = false
  }
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

<!-- Template giữ nguyên như hiện tại -->

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

/* Custom focus styles */
input:focus,
select:focus,
textarea:focus {
  outline: none !important;
  box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.1) !important;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>

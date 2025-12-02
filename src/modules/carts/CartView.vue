<!-- filepath: g:\LearnPTIT\TotNghiep\SmartShoes_web_frontend\src\modules\carts\CartView.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="flex mb-6" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2">
          <li>
            <button
              @click="continueShopping"
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
            <span class="text-gray-900 font-medium">Giỏ hàng</span>
          </li>
        </ol>
      </nav>

      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Giỏ Hàng</h1>
        <p class="mt-2 text-gray-600">
          {{ cart && !isCartEmpty(cart) ? `${getCartItemCount(cart)} sản phẩm` : 'Giỏ hàng trống' }}
        </p>
      </div>

      <!-- Cart Content -->
      <div v-if="!loading && cart && !isCartEmpty(cart)" class="space-y-6">
        <!-- ✅ Cart Header - Shopee Style với cột đúng -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
            <div class="col-span-1 flex items-center">
              <input
                class="rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                :checked="isAllSelected"
                :indeterminate="isIndeterminate"
                @change="selectAllItems"
              />
            </div>
            <div class="col-span-5">Sản Phẩm</div>
            <div class="col-span-2 text-center">Đơn Giá</div>
            <div class="col-span-2 text-center">Số Lượng</div>
            <div class="col-span-1 text-center">Số Tiền</div>
            <div class="col-span-1 text-center">Thao Tác</div>
          </div>
        </div>

        <!-- ✅ Cart Items - Shopee Style -->
        <div class="space-y-4">
          <div
            v-for="detail in cart.details"
            :key="detail.id"
            class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200"
          >
            <div class="grid grid-cols-12 gap-4 items-center">
              <div class="col-span-1 flex items-center">
                <input
                  class="rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                  :checked="selectedItems.includes(detail.id)"
                  @change="toggleSelectItem(detail.id)"
                />
              </div>

              <!-- ✅ Product Info (5 columns) -->
              <div class="col-span-5 flex items-center space-x-4">
                <!-- Product Image -->
                <div class="flex-shrink-0">
                  <img
                    :src="getProductImage(detail)"
                    :alt="getProductName(detail)"
                    class="w-20 h-20 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                    @click="goToProductDetail(detail)"
                  />
                </div>

                <!-- Product Details -->
                <div class="flex-1 min-w-0">
                  <h3
                    class="text-base font-medium text-gray-900 line-clamp-2 mb-2 cursor-pointer hover:text-rose-600 transition-colors"
                    @click="goToProductDetail(detail)"
                  >
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
                </div>
              </div>

              <!-- ✅ Đơn Giá (2 columns) - DÙNG TRỰC TIẾP TỪ DTO -->
              <div class="col-span-2 text-center">
                <div class="flex flex-col items-center space-y-1">
                  <!-- Hiển thị giá sale nếu có và khác null -->
                  <div v-if="hasSalePrice(detail)" class="text-lg font-semibold text-rose-600">
                    {{ formatPrice(detail.priceSale) }}
                  </div>

                  <!-- Hiển thị giá gốc -->
                  <div
                    :class="[
                      hasSalePrice(detail)
                        ? 'text-sm text-gray-500 line-through'
                        : 'text-lg font-semibold text-rose-600',
                    ]"
                  >
                    {{ formatPrice(detail.price) }}
                  </div>

                  <!-- Badge giảm giá nếu có sale -->
                  <div
                    v-if="hasSalePrice(detail)"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                  >
                    -{{ getDiscountPercentage(detail) }}%
                  </div>
                </div>
              </div>

              <!-- ✅ Số Lượng (2 columns) -->
              <div class="col-span-2 flex items-center justify-center">
                <div
                  class="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white"
                >
                  <!-- Nút giảm -->
                  <button
                    @click="updateQuantity(detail.id, detail.quantity - 1)"
                    :disabled="detail.quantity <= 1 || isUpdating"
                    class="w-10 h-10 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-r border-gray-300"
                  >
                    <svg
                      class="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M20 12H4"
                      />
                    </svg>
                  </button>

                  <!-- Input số lượng -->
                  <input
                    type="number"
                    :value="detail.quantity"
                    @change="updateQuantityInput(detail.id, $event)"
                    class="w-16 h-10 text-center border-0 focus:ring-0 text-sm bg-gray-50"
                    min="1"
                    :disabled="isUpdating"
                  />

                  <!-- Nút tăng -->
                  <button
                    @click="updateQuantity(detail.id, detail.quantity + 1)"
                    :disabled="isUpdating"
                    class="w-10 h-10 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-l border-gray-300"
                  >
                    <svg
                      class="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- ✅ Số Tiền (1 column) - TÍNH THEO GIÁ HIỆU LỰC -->
              <div class="col-span-1 text-center">
                <div class="flex flex-col items-center space-y-1">
                  <!-- Subtotal hiện tại theo giá hiệu lực -->
                  <div class="text-lg font-bold text-rose-600">
                    {{ formatPrice(calculateItemSubtotal(detail)) }}
                  </div>
                </div>
              </div>

              <!-- ✅ Thao Tác (1 column) -->
              <div class="col-span-1 text-center">
                <button
                  @click="removeFromCart(detail.id)"
                  :disabled="isUpdating"
                  class="p-2 text-gray-400 hover:text-rose-500 disabled:opacity-50 transition-colors rounded-lg hover:bg-rose-50"
                  title="Xóa sản phẩm"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ✅ Cart Summary - Shopee Style -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <!-- Left: Bulk Actions -->
            <div class="flex items-center gap-6">
              <div class="flex items-center gap-2"></div>

              <button
                @click="continueShopping"
                class="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                Tiếp Tục Mua Sắm
              </button>
            </div>

            <!-- Right: Total & Checkout -->
            <div class="flex flex-col lg:flex-row lg:items-center gap-6">
              <div class="text-right">
                <div class="flex flex-col items-end gap-1">
                  <!-- Tổng tiền label -->
                  <div class="flex items-center gap-2 text-sm text-gray-600">
                    <span>Tổng thanh toán ({{ selectedItems.length }} Sản phẩm):</span>
                  </div>

                  <!-- Tổng tiền hiện tại -->
                  <span class="text-2xl font-bold text-rose-600">
                    {{ formatPrice(selectedTotal) }}
                  </span>

                  <!-- Tổng tiền gốc và tiết kiệm -->
                  <div v-if="totalSavings > 0" class="flex items-center gap-2 text-sm">
                    <span class="text-gray-500 line-through">
                      {{ formatPrice(selectedOriginalTotal) }}
                    </span>
                    <span
                      class="text-green-600 font-semibold bg-green-100 px-2 py-1 rounded-full text-xs"
                    >
                      Tiết kiệm {{ formatPrice(totalSavings) }}
                    </span>
                  </div>
                </div>
                <div class="text-xs text-gray-500 mt-1">Đã bao gồm thuế VAT (nếu có)</div>
              </div>

              <!-- Checkout Button -->
              <div class="flex-shrink-0">
                <button
                  @click="goToCheckout"
                  :disabled="selectedItems.length === 0"
                  class="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none min-w-[200px]"
                >
                  <span v-if="selectedItems.length === 0">Chọn sản phẩm</span>
                  <span v-else>Mua Hàng ({{ selectedItems.length }})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty Cart -->
      <div v-else-if="!loading && (!cart || isCartEmpty(cart))" class="text-center py-20">
        <div class="max-w-md mx-auto">
          <div
            class="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center"
          >
            <svg
              class="w-16 h-16 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"
              />
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-gray-800 mb-4">Giỏ hàng trống</h2>
          <p class="text-gray-500 mb-8 text-lg">Hãy chọn thêm sản phẩm để mua sắm nhé!</p>
          <button
            @click="continueShopping"
            class="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Khám Phá Sản Phẩm
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-else class="text-center py-20">
        <div class="relative">
          <div class="w-16 h-16 mx-auto mb-4">
            <div class="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
            <div
              class="absolute inset-0 border-4 border-purple-500 rounded-full animate-spin border-t-transparent"
            ></div>
          </div>
          <p class="text-gray-600 text-lg">Đang tải giỏ hàng...</p>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentUser } from '@/common/guards/roleGuard.guard'
import {
  getUserCart,
  updateCartDetail,
  deleteCartDetail,
  clearCart,
  getCartItemCount,
  isCartEmpty,
} from './carts.api'
import { CartDetailRequest, type Cart, type CartDetail } from './carts.type'
import { getVariantWithProductByIdApi } from '@/modules/products/product.api'
import type { ProductVariantWithProduct } from '@/modules/products/product.type'
import { updateCartCount } from '@/common/composable/carts.store'
const router = useRouter()

// ================================
// STATE MANAGEMENT
// ================================
const cart = ref<Cart | null>(null)
const loading = ref(true)
const isUpdating = ref(false)
const showSuccessToast = ref(false)
const successMessage = ref('')
const selectedItems = ref<string[]>([])

// Cache để lưu thông tin variant đã fetch (để lấy product name, image, etc.)
const variantCache = ref<Map<string, ProductVariantWithProduct>>(new Map())

// ================================
// COMPUTED PROPERTIES
// ================================
const currentUser = computed(() => getCurrentUser())

const isAllSelected = computed(() => {
  if (!cart.value?.details || cart.value.details.length === 0) return false
  return selectedItems.value.length === cart.value.details.length
})

const isIndeterminate = computed(() => {
  if (!cart.value?.details || cart.value.details.length === 0) return false
  return selectedItems.value.length > 0 && selectedItems.value.length < cart.value.details.length
})

// ================================
// ✅ PRICING HELPER FUNCTIONS - DÙNG DTO DATA
// ================================

/**
 * ✅ Kiểm tra có giá sale không
 * Dùng trực tiếp từ CartDetail DTO: priceSale !== null && priceSale > 0 && priceSale < price
 */
const hasSalePrice = (detail: CartDetail): boolean => {
  return (
    detail.priceSale !== null &&
    detail.priceSale !== undefined &&
    detail.priceSale > 0 &&
    detail.priceSale < detail.price
  )
}

/**
 * ✅ Tính phần trăm giảm giá
 */
const getDiscountPercentage = (detail: CartDetail): number => {
  if (!hasSalePrice(detail)) return 0

  const originalPrice = detail.price
  const salePrice = detail.priceSale!

  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

/**
 * ✅ Lấy giá hiệu lực (sale nếu có, không thì gốc)
 */
const getEffectivePrice = (detail: CartDetail): number => {
  return hasSalePrice(detail) ? detail.priceSale! : detail.price
}

/**
 * ✅ Tính subtotal của 1 item theo giá hiệu lực
 */
const calculateItemSubtotal = (detail: CartDetail): number => {
  const effectivePrice = getEffectivePrice(detail)
  return detail.quantity * effectivePrice
}

// ================================
// ✅ COMPUTED TOTALS
// ================================

/**
 * ✅ Tổng tiền đã chọn (theo giá hiệu lực)
 */
const selectedTotal = computed(() => {
  if (!cart.value?.details) return 0

  return cart.value.details
    .filter((detail) => selectedItems.value.includes(detail.id))
    .reduce((total, detail) => total + calculateItemSubtotal(detail), 0)
})

/**
 * ✅ Tổng tiền gốc (trước sale) của items đã chọn
 */
const selectedOriginalTotal = computed(() => {
  if (!cart.value?.details) return 0

  return cart.value.details
    .filter((detail) => selectedItems.value.includes(detail.id))
    .reduce((total, detail) => total + detail.quantity * detail.price, 0)
})

/**
 * ✅ Tổng tiền tiết kiệm được
 */
const totalSavings = computed(() => {
  return selectedOriginalTotal.value - selectedTotal.value
})

// ================================
// ✅ CART OPERATIONS
// ================================

const loadCart = async () => {
  if (!currentUser.value?.userId) {
    router.push('/login')
    return
  }

  try {
    loading.value = true
    const cartData = await getUserCart(currentUser.value.userId)
    cart.value = cartData

    console.log('✅ Loaded cart with DTO pricing:', cart.value)

    // Load thông tin variant cho product name, image, etc.
    if (cart.value?.details) {
      await loadVariantInfoForAllItems()
      selectedItems.value = cart.value.details.map((detail) => detail.id)
    }
  } catch (error) {
    console.error('❌ Error loading cart:', error)
    cart.value = null
  } finally {
    loading.value = false
  }
}

/**
 * ✅ Load thông tin variant từ API để lấy product name, image, etc.
 * Giá đã có sẵn trong DTO rồi
 */
const loadVariantInfoForAllItems = async () => {
  if (!cart.value?.details) return

  console.log('🔄 Loading variant info for product details...')

  const promises = cart.value.details.map(async (detail) => {
    if (!variantCache.value.has(detail.productVariantId)) {
      try {
        console.log(`🔍 Fetching variant info for: ${detail.productVariantId}`)
        const variantWithProduct = await getVariantWithProductByIdApi(detail.productVariantId)
        variantCache.value.set(detail.productVariantId, variantWithProduct)
        console.log(`✅ Loaded variant for product info:`, {
          id: variantWithProduct.id,
          productName: variantWithProduct.product?.name,
          size: variantWithProduct.size,
          color: variantWithProduct.color?.name || variantWithProduct.colorName,
        })
      } catch (error) {
        console.error(`❌ Error loading variant ${detail.productVariantId}:`, error)
      }
    }
  })

  await Promise.all(promises)
  console.log('✅ All variant info loaded for UI display')
}

const selectAllItems = (event: Event) => {
  const target = event.target as HTMLInputElement

  if (!cart.value?.details) return

  if (target.checked) {
    selectedItems.value = cart.value.details.map((detail) => detail.id)
  } else {
    selectedItems.value = []
  }
}

const toggleSelectItem = (itemId: string) => {
  const index = selectedItems.value.indexOf(itemId)
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(itemId)
  }
}

const updateQuantity = async (detailId: string, newQuantity: number) => {
  if (newQuantity < 1 || isUpdating.value) return

  try {
    isUpdating.value = true

    // 1. Tìm index và chi tiết hiện tại
    const detailIndex = cart.value?.details.findIndex((d) => d.id === detailId)
    if (detailIndex === undefined || detailIndex === -1 || !cart.value) {
      console.error('❌ Detail not found:', detailId)
      return
    }

    const detail = cart.value.details[detailIndex]
    const request = new CartDetailRequest(detail.productVariantId, newQuantity)

    // 2. GỌI API và NHẬN LẠI DTO đã cập nhật
    const updatedDetailDto = await updateCartDetail(detailId, request)

    // 🚀 KHẮC PHỤC: CẬP NHẬT CỤC BỘ (Giữ nguyên thứ tự)
    cart.value.details[detailIndex] = updatedDetailDto

    showToast('Đã cập nhật số lượng')
  } catch (error) {
    console.error('❌ Error updating quantity:', error)
    showToast('Có lỗi xảy ra khi cập nhật số lượng', 'error')
  } finally {
    isUpdating.value = false
  }
}

const updateQuantityInput = async (detailId: string, event: Event) => {
  const target = event.target as HTMLInputElement
  const newQuantity = parseInt(target.value)

  if (newQuantity && newQuantity > 0) {
    await updateQuantity(detailId, newQuantity)
  }
}

const removeFromCart = async (detailId: string) => {
  if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) return

  try {
    isUpdating.value = true
    await deleteCartDetail(detailId)

    const index = selectedItems.value.indexOf(detailId)
    if (index > -1) {
      selectedItems.value.splice(index, 1)
    }

    await loadCart()
    window.dispatchEvent(new CustomEvent('cart-updated'))

    showToast('Đã xóa sản phẩm khỏi giỏ hàng')
  } catch (error) {
    console.error('❌ Error removing from cart:', error)
    showToast('Có lỗi xảy ra khi xóa sản phẩm', 'error')
  } finally {
    isUpdating.value = false
  }
}

const clearSelectedItems = async () => {
  if (selectedItems.value.length === 0) {
    showToast('Vui lòng chọn sản phẩm để xóa', 'error')
    return
  }

  if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedItems.value.length} sản phẩm đã chọn?`)) return

  try {
    isUpdating.value = true

    for (const itemId of selectedItems.value) {
      await deleteCartDetail(itemId)
    }

    selectedItems.value = []
    await loadCart()
    window.dispatchEvent(new CustomEvent('cart-updated'))

    showToast('Đã xóa sản phẩm đã chọn')
  } catch (error) {
    console.error('❌ Error clearing selected items:', error)
    showToast('Có lỗi xảy ra khi xóa sản phẩm', 'error')
  } finally {
    isUpdating.value = false
  }
}

// ================================
// NAVIGATION & CHECKOUT
// ================================
const goToCheckout = () => {
  if (selectedItems.value.length === 0) {
    showToast('Vui lòng chọn sản phẩm để thanh toán', 'error')
    return
  }

  localStorage.setItem('selectedCartItems', JSON.stringify(selectedItems.value))
  router.push('/checkout')
}

const continueShopping = () => {
  router.push('/')
}

const goToProductDetail = (detail: CartDetail) => {
  const variantInfo = variantCache.value.get(detail.productVariantId)
  if (variantInfo?.product?.id) {
    router.push(`/products/${variantInfo.product.id}`)
  } else {
    console.warn('❌ Cannot navigate to product detail: product ID not found')
    showToast('Không thể xem chi tiết sản phẩm', 'error')
  }
}

// ================================
// ✅ HELPER FUNCTIONS
// ================================

const formatPrice = (price: number) => {
  if (!price || isNaN(price)) return '0 ₫'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const getProductName = (detail: CartDetail) => {
  // Từ cache variant đã fetch
  const variantInfo = variantCache.value.get(detail.productVariantId)
  if (variantInfo?.product?.name) {
    return variantInfo.product.name
  }

  // Fallback từ data có sẵn trong cart (nếu BE populate)
  if (detail.productVariant?.product?.name) {
    return detail.productVariant.product.name
  }

  if (detail.product?.name) {
    return detail.product.name
  }

  return `Sản phẩm #${detail.productVariantId?.slice(-8) || 'Unknown'}`
}

const getProductImage = (detail: CartDetail) => {
  // Từ cache variant đã fetch
  const variantInfo = variantCache.value.get(detail.productVariantId)
  if (variantInfo?.images?.length > 0) {
    // Tìm main image trước
    const mainImage = variantInfo.images.find((img) => img.isMain)
    if (mainImage?.url) {
      return mainImage.url
    }
    // Nếu không có main, lấy ảnh đầu tiên
    return variantInfo.images[0]?.url
  }

  // Fallback từ data có sẵn trong cart
  if (detail.productVariant?.images?.length > 0) {
    const mainImage = detail.productVariant.images.find((img) => img.isMain)
    if (mainImage?.url) {
      return mainImage.url
    }
    return detail.productVariant.images[0]?.url
  }

  // Default placeholder
  return 'https://via.placeholder.com/150x150/f3f4f6/9ca3af?text=SmartShoes'
}

const getVariantSize = (detail: CartDetail) => {
  // Từ cache variant đã fetch
  const variantInfo = variantCache.value.get(detail.productVariantId)
  if (variantInfo?.size) {
    return variantInfo.size
  }

  // Fallback từ data có sẵn trong cart
  if (detail.productVariant?.size) {
    return detail.productVariant.size
  }

  return 'N/A'
}

const getVariantColor = (detail: CartDetail) => {
  // Từ cache variant đã fetch
  const variantInfo = variantCache.value.get(detail.productVariantId)

  // Support cả colorName và color.name
  if (variantInfo?.colorName) {
    return variantInfo.colorName
  }

  if (variantInfo?.color?.name) {
    return variantInfo.color.name
  }

  // Fallback từ data có sẵn trong cart
  if (detail.productVariant?.color?.name) {
    return detail.productVariant.color.name
  }

  if (detail.productVariant?.colorName) {
    return detail.productVariant.colorName
  }

  return 'N/A'
}

// ================================
// TOAST NOTIFICATIONS
// ================================
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  successMessage.value = message
  showSuccessToast.value = true
  setTimeout(() => {
    showSuccessToast.value = false
  }, 3500)
}

// ================================
// LIFECYCLE
// ================================
onMounted(() => {
  loadCart()
  updateCartCount()

  window.addEventListener('cart-updated', loadCart)
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

/* Remove number input arrows */
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}

/* Enhanced hover effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Price display styles */
.line-through {
  text-decoration: line-through;
}

/* Badge styles */
.bg-red-100 {
  background-color: #fee2e2;
}

.text-red-800 {
  color: #991b1b;
}

.bg-green-100 {
  background-color: #dcfce7;
}

.text-green-600 {
  color: #16a34a;
}

/* Responsive design */
@media (max-width: 1024px) {
  .grid-cols-12 {
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .col-span-5 {
    grid-column: span 6 / span 6;
  }

  .col-span-2 {
    grid-column: span 3 / span 3;
  }
}
</style>

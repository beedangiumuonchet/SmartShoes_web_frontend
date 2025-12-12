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
          <span v-if="cart && !isCartEmpty(cart)">
            {{ activeItems.length }} sản phẩm có thể mua
            <span v-if="inactiveItems.length > 0" class="text-red-600">
              ({{ inactiveItems.length }} sản phẩm ngưng bán)
            </span>
          </span>
          <span v-else>Giỏ hàng trống</span>
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
        <!-- ✅ THÊM MỚI - Thông báo sản phẩm ngưng bán -->
        <div
          v-if="inactiveItems.length > 0"
          class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <svg
                class="w-5 h-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <div>
                <p class="text-red-800 font-medium">
                  Có {{ inactiveItems.length }} sản phẩm không thể mua
                </p>
                <p class="text-red-600 text-sm">Các sản phẩm này đã ngưng bán hoặc hết hàng</p>
              </div>
            </div>
            <button
              @click="removeInactiveItems"
              :disabled="isUpdating"
              class="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors disabled:opacity-50"
            >
              Xóa tất cả
            </button>
          </div>
        </div>
        <!-- ✅ Cart Items - Shopee Style -->
        <div class="space-y-6">
          <!-- Section: Sản phẩm có thể mua (ACTIVE) -->
          <div v-if="activeItems.length > 0" class="space-y-4">
            <div
              class="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3"
            >
              <h3 class="text-lg font-semibold text-green-800">
                Sản phẩm có thể mua ({{ activeItems.length }})
              </h3>
            </div>

            <div
              v-for="detail in activeItems"
              :key="detail.id"
              class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200"
            >
              <!-- Cart item content - giữ nguyên như cũ -->
              <div class="grid grid-cols-12 gap-4 items-center">
                <div class="col-span-1 flex items-center">
                  <input
                    class="rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                    :checked="selectedItems.includes(detail.id)"
                    @change="toggleSelectItem(detail.id)"
                  />
                </div>

                <!-- Product Info (5 columns) - giữ nguyên -->
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
                      <!-- ✅ THÊM - Status badge -->
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {{ getProductStatusText(detail) }}
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
          <!-- Section: Sản phẩm không thể mua (INACTIVE) -->
          <div v-if="inactiveItems.length > 0" class="space-y-4">
            <div
              class="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-3"
            >
              <h3 class="text-lg font-semibold text-red-800">
                Sản phẩm không thể mua ({{ inactiveItems.length }})
              </h3>
              <button
                @click="removeInactiveItems"
                :disabled="isUpdating"
                class="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Xóa tất cả
              </button>
            </div>

            <div
              v-for="detail in inactiveItems"
              :key="detail.id"
              class="bg-gray-50 rounded-lg shadow-sm border border-gray-300 p-4 opacity-75"
            >
              <div class="grid grid-cols-12 gap-4 items-center">
                <!-- Checkbox bị disable -->
                <div class="col-span-1 flex items-center">
                  <input
                    type="checkbox"
                    disabled
                    class="rounded border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <!-- Product Info - style xám -->
                <div class="col-span-5 flex items-center space-x-4">
                  <div class="flex-shrink-0 relative">
                    <img
                      :src="getProductImage(detail)"
                      :alt="getProductName(detail)"
                      class="w-20 h-20 object-cover rounded-lg border border-gray-300 grayscale"
                    />
                    <!-- Overlay "Ngưng bán" -->
                    <div
                      class="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center"
                    >
                      <span class="text-white text-xs font-bold">Ngưng bán</span>
                    </div>
                  </div>

                  <div class="flex-1 min-w-0">
                    <h3 class="text-base font-medium text-gray-500 line-clamp-2 mb-2">
                      {{ getProductName(detail) }}
                    </h3>
                    <div class="flex flex-wrap gap-2 text-sm">
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-600"
                      >
                        Size: {{ getVariantSize(detail) }}
                      </span>
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-600"
                      >
                        Màu: {{ getVariantColor(detail) }}
                      </span>
                      <!-- Status badge -->
                      <span
                        :class="[
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          getProductStatusClass(detail),
                        ]"
                      >
                        {{ getProductStatusText(detail) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Đơn Giá - xám -->
                <div class="col-span-2 text-center">
                  <div class="text-gray-400 line-through">
                    {{ formatPrice(detail.price) }}
                  </div>
                </div>

                <!-- Số Lượng - disable -->
                <div class="col-span-2 flex items-center justify-center">
                  <div
                    class="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-100"
                  >
                    <button
                      disabled
                      class="w-10 h-10 flex items-center justify-center text-gray-400 cursor-not-allowed"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                    <input
                      type="number"
                      :value="detail.quantity"
                      disabled
                      class="w-16 h-10 text-center border-0 bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                    <button
                      disabled
                      class="w-10 h-10 flex items-center justify-center text-gray-400 cursor-not-allowed"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                <!-- Số Tiền - xám -->
                <div class="col-span-1 text-center">
                  <div class="text-gray-400 line-through">
                    {{ formatPrice(calculateItemSubtotal(detail)) }}
                  </div>
                </div>

                <!-- Thao Tác - chỉ có nút xóa -->
                <div class="col-span-1 text-center">
                  <button
                    @click="removeFromCart(detail.id)"
                    :disabled="isUpdating"
                    class="p-2 text-red-400 hover:text-red-600 disabled:opacity-50 transition-colors rounded-lg hover:bg-red-50"
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
                    <span>Tổng thanh toán ({{ selectedActiveItems.length }} Sản phẩm):</span>
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
                  :disabled="selectedActiveItems.length === 0"
                  class="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none min-w-[200px]"
                >
                  <span v-if="selectedActiveItems.length === 0">Chọn sản phẩm</span>
                  <span v-else>Mua Hàng ({{ selectedActiveItems.length }})</span>
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
import { getVariantWithProductByIdApi, getProductByIdApi } from '@/modules/products/product.api'
import type { ProductVariantWithProduct, Product } from '@/modules/products/product.type'
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
 * Dùng trực tiếp từ CartDetailDto: priceSale !== null && priceSale > 0 && priceSale < price
 */
const hasSalePrice = (detail: CartDetail): boolean => {
  // Ưu tiên từ DTO data
  if (detail.priceSale !== null && detail.priceSale !== undefined && detail.priceSale > 0) {
    return detail.priceSale < detail.price
  }

  // Fallback từ productVariant nếu có
  if (
    detail.productVariant?.priceSale !== null &&
    detail.productVariant?.priceSale !== undefined &&
    detail.productVariant.priceSale > 0
  ) {
    return detail.productVariant.priceSale < (detail.productVariant.price || detail.price)
  }

  return false
}

/**
 * ✅ Tính phần trăm giảm giá
 */
const getDiscountPercentage = (detail: CartDetail): number => {
  if (!hasSalePrice(detail)) return 0

  // Ưu tiên từ DTO
  const originalPrice = detail.price
  const salePrice = detail.priceSale

  if (salePrice && originalPrice && salePrice > 0 && originalPrice > salePrice) {
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
  }

  // Fallback từ productVariant
  if (detail.productVariant?.price && detail.productVariant?.priceSale) {
    const variantOriginal = detail.productVariant.price
    const variantSale = detail.productVariant.priceSale
    return Math.round(((variantOriginal - variantSale) / variantOriginal) * 100)
  }

  return 0
}

/**
 * ✅ Lấy giá hiệu lực (sale nếu có, không thì gốc)
 */
const getEffectivePrice = (detail: CartDetail): number => {
  // Ưu tiên từ DTO
  if (hasSalePrice(detail) && detail.priceSale) {
    return detail.priceSale
  }

  // Trả về giá gốc từ DTO
  return detail.price
}

/**
 * ✅ Tính subtotal của 1 item - ƯU TIÊN DÙNG SUBTOTAL TỪ BE
 */
const calculateItemSubtotal = (detail: CartDetail): number => {
  // 1. Ưu tiên dùng subtotal đã tính sẵn từ BE DTO
  if (detail.subtotal && detail.subtotal > 0) {
    return detail.subtotal
  }

  // 2. Fallback: Tính từ giá hiệu lực × quantity
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
    .filter(
      (detail) =>
        selectedActiveItems.value.includes(detail.id) && getProductStatus(detail) === 'ACTIVE',
    )
    .reduce((total, detail) => total + calculateItemSubtotal(detail), 0)
})

/**
 * ✅ Tổng tiền gốc (trước sale) của items đã chọn
 */
const selectedOriginalTotal = computed(() => {
  if (!cart.value?.details) return 0

  return cart.value.details
    .filter(
      (detail) =>
        selectedActiveItems.value.includes(detail.id) && getProductStatus(detail) === 'ACTIVE',
    )
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

// ✅ THÊM MỚI - Helper để lấy product status
const getProductStatus = (detail: CartDetail): string => {
  // Từ cache variant đã fetch
  const variantInfo = variantCache.value.get(detail.productVariantId)
  if (variantInfo?.product?.status) {
    return variantInfo.product.status
  }

  // Default là INACTIVE nếu không có thông tin
  return 'INACTIVE'
}

// ✅ THÊM MỚI - Kiểm tra sản phẩm có active không
const isProductActive = (detail: CartDetail): boolean => {
  return getProductStatus(detail) === 'ACTIVE'
}

// ✅ THÊM MỚI - Lấy text trạng thái
const getProductStatusText = (detail: CartDetail): string => {
  const status = getProductStatus(detail)
  switch (status) {
    case 'ACTIVE':
      return 'Còn hàng'
    case 'INACTIVE':
      return 'Ngưng bán'
    case 'OUT_OF_STOCK':
      return 'Hết hàng'
    default:
      return 'Không hoạt động'
  }
}

// ✅ THÊM MỚI - Lấy CSS class cho trạng thái
const getProductStatusClass = (detail: CartDetail): string => {
  const status = getProductStatus(detail)
  switch (status) {
    case 'ACTIVE':
      return 'text-green-600 bg-green-100'
    case 'INACTIVE':
      return 'text-red-600 bg-red-100'
    case 'OUT_OF_STOCK':
      return 'text-yellow-600 bg-yellow-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

/**
 * ✅ Load thông tin variant từ API để lấy product name, image, etc.
 * Giá đã có sẵn trong DTO rồi
 */
// ✅ SỬA - Load variant info + product đầy đủ để có thể dùng getMainImage
const loadVariantInfoForAllItems = async () => {
  if (!cart.value?.details) return

  console.log('🔄 Loading variant info + product info để hiển thị ảnh...')

  const promises = cart.value.details.map(async (detail) => {
    if (!variantCache.value.has(detail.productVariantId)) {
      try {
        console.log(`🔍 Fetching variant với product info for: ${detail.productVariantId}`)

        // 1. Lấy variant với product info
        const variantWithProduct = await getVariantWithProductByIdApi(detail.productVariantId)

        // 2. Nếu có product info, fetch thêm chi tiết product để có variants (cho ảnh)
        if (variantWithProduct.product?.id) {
          try {
            const fullProduct = await getProductByIdApi(variantWithProduct.product.id)

            // 3. Gắn full product vào variant info để có thể dùng getMainImage
            variantWithProduct.product = fullProduct

            console.log(`✅ Loaded full product for image display:`, {
              variantId: variantWithProduct.id,
              productId: fullProduct.id,
              productName: fullProduct.name,
              variantsCount: fullProduct.variants?.length || 0,
              hasImages: fullProduct.variants?.some((v) => v.images?.length > 0),
            })
          } catch (error) {
            console.warn(
              `⚠️ Could not fetch full product for ${variantWithProduct.product.id}`,
              error,
            )
          }
        }

        variantCache.value.set(detail.productVariantId, variantWithProduct)
      } catch (error) {
        console.error(`❌ Error loading variant ${detail.productVariantId}:`, error)
      }
    }
  })

  await Promise.all(promises)
  console.log('✅ All variant info + product info loaded để hiển thị ảnh')
}

const selectAllItems = (event: Event) => {
  const target = event.target as HTMLInputElement

  if (!cart.value?.details) return

  if (target.checked) {
    // ✅ SỬA - Chỉ chọn sản phẩm ACTIVE
    selectedItems.value = cart.value.details
      .filter((detail) => getProductStatus(detail) === 'ACTIVE')
      .map((detail) => detail.id)
  } else {
    selectedItems.value = []
  }
}

// ✅ THÊM MỚI - Xóa tất cả sản phẩm INACTIVE
const removeInactiveItems = async () => {
  if (inactiveItems.value.length === 0) {
    showToast('Không có sản phẩm ngưng bán để xóa', 'error')
    return
  }

  if (!confirm(`Bạn có chắc chắn muốn xóa ${inactiveItems.value.length} sản phẩm ngưng bán?`))
    return

  try {
    isUpdating.value = true

    for (const item of inactiveItems.value) {
      await deleteCartDetail(item.id)

      // Xóa khỏi selectedItems nếu có
      const index = selectedItems.value.indexOf(item.id)
      if (index > -1) {
        selectedItems.value.splice(index, 1)
      }
    }

    await loadCart()
    window.dispatchEvent(new CustomEvent('cart-updated'))

    showToast('Đã xóa các sản phẩm ngưng bán')
  } catch (error) {
    console.error('❌ Error removing inactive items:', error)
    showToast('Có lỗi xảy ra khi xóa sản phẩm', 'error')
  } finally {
    isUpdating.value = false
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

// ✅ THÊM MỚI - Phân loại sản phẩm theo status
const activeItems = computed(() => {
  if (!cart.value?.details) return []
  return cart.value.details.filter((detail) => getProductStatus(detail) === 'ACTIVE')
})

const inactiveItems = computed(() => {
  if (!cart.value?.details) return []
  return cart.value.details.filter((detail) => getProductStatus(detail) !== 'ACTIVE')
})

// ✅ THÊM MỚI - Chỉ tính tổng từ sản phẩm ACTIVE
const selectedActiveItems = computed(() => {
  return selectedItems.value.filter((itemId) => {
    const detail = cart.value?.details.find((d) => d.id === itemId)
    return detail && getProductStatus(detail) === 'ACTIVE'
  })
})

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
    router.push(`/products/id/${variantInfo.product.id}`)
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

// ✅ CẬP NHẬT - getMainImage với logic mới
const getMainImage = (product: Product) => {
  const variants = product.variants || []

  if (variants.length === 0) {
    return 'https://via.placeholder.com/200x200?text=No+Image'
  }

  // 1. Tìm variant có ID nhỏ nhất
  const smallestVariant = [...variants].sort((a, b) => a.id.localeCompare(b.id))[0]

  // 2. Tìm ảnh isMain trong variant nhỏ nhất
  let selectedImage =
    smallestVariant.images?.find((img: any) => img.isMain) || smallestVariant.images?.[0] || null

  // 3. Nếu variant nhỏ nhất không có ảnh → lấy ảnh từ variant khác
  if (!selectedImage) {
    const variantWithImage = variants.find((v) => v.images && v.images.length > 0)
    if (variantWithImage) {
      selectedImage =
        variantWithImage.images.find((img: any) => img.isMain) || variantWithImage.images[0]
    }
  }

  // 4. Nếu không có ảnh nào trong toàn bộ sản phẩm → trả placeholder
  if (!selectedImage?.url) {
    return 'https://via.placeholder.com/200x200?text=No+Image'
  }

  return selectedImage.url
}

// ✅ THÊM MỚI - getDirectImageUrl
function getDirectImageUrl(driveUrl: string) {
  const match = driveUrl?.match(/\/d\/([^/]+)/)
  if (!match) return driveUrl

  const driveId = match[1]
  return `http://localhost:8080/api/v1/images/${driveId}`
}
// ✅ SỬA - getProductImage dùng getMainImage từ product đầy đủ
const getProductImage = (detail: CartDetail) => {
  // Từ cache variant đã fetch (có product đầy đủ)
  const variantInfo = variantCache.value.get(detail.productVariantId)

  if (variantInfo?.product) {
    // Kiểm tra xem product có variants không (tức là đã fetch đầy đủ)
    if (variantInfo.product.variants && variantInfo.product.variants.length > 0) {
      // Sử dụng getMainImage để lấy ảnh từ product (tìm variant có ảnh đầu tiên)
      const productImageUrl = getMainImage(variantInfo.product as Product)

      // Convert Google Drive URL thành localhost URL
      if (
        productImageUrl &&
        productImageUrl !== 'https://via.placeholder.com/200x200?text=No+Image'
      ) {
        return getDirectImageUrl(productImageUrl)
      }

      return productImageUrl
    } else {
      // Nếu chưa có variants, thử lấy từ variant hiện tại
      if (variantInfo.images?.length > 0) {
        const mainImage = variantInfo.images.find((img) => img.isMain)
        if (mainImage?.url) {
          return getDirectImageUrl(mainImage.url)
        }
        return getDirectImageUrl(variantInfo.images[0].url)
      }
    }
  }

  // Fallback từ data có sẵn trong cart (nếu BE populate product)
  if (detail.productVariant?.images?.length > 0) {
    const mainImage = detail.productVariant.images.find((img) => img.isMain)
    if (mainImage?.url) {
      return getDirectImageUrl(mainImage.url)
    }
    return getDirectImageUrl(detail.productVariant.images[0].url)
  }

  // Default placeholder nếu không có thông tin gì
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

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 py-4">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="flex mb-4" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2">
          <li>
            <router-link
              to="/"
              class="text-gray-500 hover:text-rose-500 transition-colors font-medium text-sm"
            >
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
            <span class="text-gray-900 font-semibold text-sm">Đơn hàng của tôi</span>
          </li>
        </ol>
      </nav>

      <!-- Header -->
      <div class="mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1
              class="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent"
            >
              Đơn Hàng Của Tôi
            </h1>
            <p class="mt-1 text-base text-gray-600">Quản lý và theo dõi tất cả đơn hàng của bạn</p>
          </div>
          <button
            @click="continueShopping"
            class="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 text-sm"
          >
            <svg class="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"
              ></path>
            </svg>
            Tiếp tục mua sắm
          </button>
        </div>
      </div>

      <!-- Enhanced Filters -->
      <div class="mb-6">
        <div class="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-4">
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <!-- Status Filter -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-2"
                >Trạng thái đơn hàng</label
              >
              <select
                v-model="selectedStatus"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white/80 backdrop-blur-sm shadow-sm transition-all"
              >
                <option value="">Tất cả trạng thái</option>
                <option v-for="status in statusOptions" :key="status.value" :value="status.value">
                  {{ status.label }}
                </option>
              </select>
            </div>

            <!-- Date Range Filter -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-2">Từ ngày</label>
              <input
                v-model="dateFrom"
                @change="applyFilters"
                type="date"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white/80 backdrop-blur-sm shadow-sm transition-all"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-2">Đến ngày</label>
              <input
                v-model="dateTo"
                @change="applyFilters"
                type="date"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white/80 backdrop-blur-sm shadow-sm transition-all"
              />
            </div>

            <!-- Search -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-2">Tìm kiếm</label>
              <div class="relative">
                <input
                  v-model="searchQuery"
                  @input="debounceSearch"
                  @keyup.enter="applyFilters"
                  type="text"
                  placeholder="Mã đơn hàng, tên người nhận..."
                  class="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white/80 backdrop-blur-sm shadow-sm transition-all"
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    class="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Filter Actions -->
          <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/50">
            <div class="flex items-center space-x-3">
              <button
                @click="clearFilters"
                class="px-3 py-1.5 text-xs border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium"
              >
                <svg
                  class="w-3 h-3 mr-1 inline"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
                Xóa bộ lọc
              </button>
              <span v-if="hasActiveFilters" class="text-xs text-gray-600 font-medium">
                {{ filteredOrders.length }} / {{ orders.length }} đơn hàng
              </span>
            </div>

            <button
              @click="refreshOrders"
              :disabled="loading"
              class="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-300 disabled:to-gray-400 text-white text-xs font-semibold rounded-lg transition-all duration-200 shadow-md"
            >
              <svg
                class="w-3 h-3 mr-1 inline"
                :class="{ 'animate-spin': loading }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                ></path>
              </svg>
              {{ loading ? 'Đang tải...' : 'Làm mới' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading && orders.length === 0" class="text-center py-16">
        <div class="relative">
          <div class="w-16 h-16 mx-auto mb-4">
            <div class="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
            <div
              class="absolute inset-0 border-4 border-purple-500 rounded-full animate-spin border-t-transparent"
            ></div>
          </div>
          <p class="text-gray-600 text-lg font-medium">Đang tải danh sách đơn hàng...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-16">
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
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Không thể tải danh sách đơn hàng</h3>
        <p class="text-gray-600 mb-4 text-sm">{{ error }}</p>
        <button
          @click="loadOrders"
          class="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors font-medium text-sm"
        >
          Thử lại
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && filteredOrders.length === 0" class="text-center py-16">
        <div
          class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center"
        >
          <svg
            class="w-10 h-10 text-purple-400"
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
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">
          {{ hasActiveFilters ? 'Không tìm thấy đơn hàng nào' : 'Chưa có đơn hàng nào' }}
        </h3>
        <p class="text-gray-600 mb-6 text-sm">
          {{
            hasActiveFilters
              ? 'Thử thay đổi bộ lọc để tìm kiếm đơn hàng khác'
              : 'Hãy bắt đầu mua sắm để tạo đơn hàng đầu tiên của bạn!'
          }}
        </p>
        <div class="flex justify-center gap-3">
          <button
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-all duration-200 text-sm"
          >
            Xóa bộ lọc
          </button>
          <button
            @click="continueShopping"
            class="px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
          >
            {{ hasActiveFilters ? 'Tiếp tục mua sắm' : 'Bắt đầu mua sắm' }}
          </button>
        </div>
      </div>

      <!-- ✅ Orders List - COMPACT & SOFT COLORS -->
      <div v-else class="space-y-4">
        <div
          v-for="order in paginatedOrders"
          :key="order.id"
          class="bg-gradient-to-r from-white/85 via-purple-50/30 to-pink-50/30 backdrop-blur-sm rounded-xl shadow-md border border-white/40 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-[1.005]"
        >
          <!-- ✅ Order Header - COMPACT -->
          <div
            class="p-4 border-b border-gray-200/40 bg-gradient-to-r from-gray-50/60 to-purple-50/40"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div>
                  <h3 class="text-lg font-bold text-gray-900">
                    Đơn hàng #{{ order.id.slice(-8) }}
                  </h3>
                  <p class="text-xs text-gray-600 mt-0.5">
                    Đặt ngày {{ formatDate(order.createdAt) }}
                  </p>
                </div>
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm"
                  :class="getStatusColor(order.status)"
                >
                  {{ getStatusLabel(order.status) }}
                </span>
              </div>
              <div class="flex items-center space-x-3">
                <div class="text-right">
                  <div
                    class="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent"
                  >
                    {{ formatPrice(order.totalAmount) }}
                  </div>
                  <div class="text-xs text-gray-500 font-medium">
                    {{ getTotalQuantity(order.orderDetails) }} sản phẩm
                  </div>
                </div>
                <button
                  @click="viewOrderDetail(order.id)"
                  class="px-3 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium text-xs"
                >
                  Chi tiết
                </button>
              </div>
            </div>
          </div>

          <!-- ✅ Order Items Preview - COMPACT WITH SOFT COLORS -->
          <div class="p-4">
            <div class="space-y-3">
              <div
                v-for="detail in getPreviewItems(order.orderDetails)"
                :key="detail.id"
                class="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50/40 via-purple-50/20 to-pink-50/20 rounded-lg border border-gray-100/40"
              >
                <!-- Product Image -->
                <div class="flex-shrink-0">
                  <img
                    :src="getProductImage(detail)"
                    :alt="getProductName(detail)"
                    class="w-16 h-16 object-cover rounded-lg border border-gray-200/50 shadow-sm"
                  />
                </div>

                <!-- Product Info -->
                <div class="flex-1 min-w-0">
                  <h4 class="text-base font-semibold text-gray-900 line-clamp-1 mb-1">
                    {{ getProductName(detail) }}
                  </h4>
                  <div class="flex flex-wrap gap-1.5 text-xs mb-1">
                    <span
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-100/70 text-rose-700 border border-rose-200/50"
                    >
                      Size: {{ getVariantSize(detail) }}
                    </span>
                    <span
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100/70 text-purple-700 border border-purple-200/50"
                    >
                      Màu: {{ getVariantColor(detail) }}
                    </span>
                    <span
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100/70 text-blue-700 border border-blue-200/50"
                    >
                      SL: {{ detail.quantity }}
                    </span>
                  </div>
                  <div class="text-xs text-gray-600 font-medium">
                    Đơn giá: {{ formatPrice(detail.price) }}
                  </div>
                </div>

                <!-- Price -->
                <div class="text-right">
                  <div class="text-lg font-bold text-gray-900">
                    {{ formatPrice(detail.subtotal) }}
                  </div>
                </div>
              </div>

              <!-- Show more items indicator -->
              <div v-if="order.orderDetails.length > 2" class="text-center">
                <button
                  @click="viewOrderDetail(order.id)"
                  class="text-xs text-rose-600 hover:text-rose-500 font-semibold underline decoration-2 underline-offset-2"
                >
                  + {{ order.orderDetails.length - 2 }} sản phẩm khác
                </button>
              </div>
            </div>
          </div>

          <!-- ✅ Order Actions - COMPACT -->
          <div
            class="px-4 py-3 bg-gradient-to-r from-gray-50/60 to-purple-50/40 border-t border-gray-200/40"
          >
            <div class="flex items-center justify-between">
              <div class="text-xs text-gray-600">
                <span class="font-semibold"
                  >{{ getTotalQuantity(order.orderDetails) }} sản phẩm</span
                >
                • Giao đến: <span class="font-semibold">{{ order.shippingName }}</span>
              </div>
              <div class="flex space-x-2">
                <!-- Cancel Order -->
                <button
                  v-if="canCancelOrder(order)"
                  @click="confirmCancelOrder(order)"
                  class="px-3 py-1.5 text-xs border border-red-300 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                  Hủy đơn
                </button>

                <!-- Reorder -->
                <button
                  @click="reorderItems(order)"
                  class="px-3 py-1.5 text-xs border border-rose-300 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium"
                >
                  Đặt lại
                </button>

                <!-- View Detail -->
                <button
                  @click="viewOrderDetail(order.id)"
                  class="px-3 py-1.5 text-xs bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-lg transition-all font-medium shadow-md"
                >
                  Chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8 flex justify-center">
        <nav class="flex items-center space-x-1">
          <button
            @click="currentPage = 1"
            :disabled="currentPage === 1"
            class="px-3 py-1.5 text-xs border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 rounded-lg transition-colors font-medium"
          >
            Đầu
          </button>
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-1.5 text-xs border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 rounded-lg transition-colors font-medium"
          >
            Trước
          </button>

          <template v-for="page in visiblePages" :key="page">
            <button
              @click="currentPage = page"
              :class="
                currentPage === page
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              "
              class="px-3 py-1.5 text-xs rounded-lg transition-all font-medium"
            >
              {{ page }}
            </button>
          </template>

          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-1.5 text-xs border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 rounded-lg transition-colors font-medium"
          >
            Sau
          </button>
          <button
            @click="currentPage = totalPages"
            :disabled="currentPage === totalPages"
            class="px-3 py-1.5 text-xs border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 rounded-lg transition-colors font-medium"
          >
            Cuối
          </button>
        </nav>
      </div>

      <!-- Results Info -->
      <div
        v-if="filteredOrders.length > 0"
        class="mt-4 text-center text-xs text-gray-600 font-medium"
      >
        Hiển thị {{ (currentPage - 1) * pageSize + 1 }} -
        {{ Math.min(currentPage * pageSize, filteredOrders.length) }} trong
        {{ filteredOrders.length }} đơn hàng
      </div>
    </div>

    <!-- Cancel Confirmation Dialog -->
    <div
      v-if="showCancelDialog"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <h3 class="text-lg font-semibold text-gray-900 mb-3">Xác nhận hủy đơn hàng</h3>
        <p class="text-gray-600 mb-2 text-sm">
          Đơn hàng: <span class="font-semibold">#{{ orderToCancel?.id.slice(-8) }}</span>
        </p>
        <p class="text-gray-600 mb-6 text-sm">
          Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác.
        </p>
        <div class="flex gap-3">
          <button
            @click="cancelOrderHandler"
            :disabled="isCanceling"
            class="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors text-sm"
          >
            {{ isCanceling ? 'Đang hủy...' : 'Xác nhận hủy' }}
          </button>
          <button
            @click="showCancelDialog = false"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors text-sm"
          >
            Không hủy
          </button>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <div
      v-if="showSuccessToast"
      class="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-lg shadow-xl z-50 flex items-center space-x-2 transform animate-slide-up"
    >
      <div class="w-5 h-5 bg-white rounded-full flex items-center justify-center">
        <svg class="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <span class="font-medium text-sm">{{ successMessage }}</span>
    </div>

    <!-- Error Toast -->
    <div
      v-if="showErrorToast"
      class="fixed bottom-6 right-6 bg-gradient-to-r from-red-500 to-rose-500 text-white px-4 py-3 rounded-lg shadow-xl z-50 flex items-center space-x-2 transform animate-slide-up"
    >
      <div class="w-5 h-5 bg-white rounded-full flex items-center justify-center">
        <svg class="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <span class="font-medium text-sm">{{ errorMessage }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getUserOrders, cancelOrder } from './orders.api'
import { getCurrentUser } from '@/common/guards/roleGuard.guard'
import { ORDER_STATUS_LABELS, OrderStatus, type Order, type OrderDetail } from './orders.type'
import { CartDetailRequest } from '../carts/carts.type'
import { getOrCreateUserCart, addCartDetail } from '../carts/carts.api'
import { updateCartCount } from '@/common/composable/carts.store'
// ✅ Import API để lấy variant với product - SAME AS CARTVIEW
import { getVariantWithProductByIdApi } from '@/modules/products/product.api'
import type { ProductVariantWithProduct } from '@/modules/products/product.type'

const router = useRouter()

// ================================
// STATE MANAGEMENT
// ================================
const loading = ref(true)
const isCanceling = ref(false)
const showCancelDialog = ref(false)
const showSuccessToast = ref(false)
const showErrorToast = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const error = ref('')

// Filter states
const searchQuery = ref('')
const selectedStatus = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const searchTimeout = ref<NodeJS.Timeout | null>(null)

// Pagination
const currentPage = ref(1)
const pageSize = ref(5)

// Data
const orders = ref<Order[]>([])
const orderToCancel = ref<Order | null>(null)

// ✅ Cache để lưu thông tin variant đã fetch - SAME AS CARTVIEW
const variantCache = ref<Map<string, ProductVariantWithProduct>>(new Map())

// Status options for filter
const statusOptions = [
  { value: OrderStatus.PENDING, label: 'Chờ xác nhận' },
  { value: OrderStatus.CONFIRMED, label: 'Đã xác nhận' },
  { value: OrderStatus.SHIPPING, label: 'Đang giao hàng' },
  { value: OrderStatus.DELIVERED, label: 'Đã giao hàng' },
  { value: OrderStatus.CANCELLED, label: 'Đã hủy' },
]

// ================================
// COMPUTED PROPERTIES
// ================================
const currentUser = computed(() => getCurrentUser())

const hasActiveFilters = computed(() => {
  return (
    searchQuery.value.trim() !== '' ||
    selectedStatus.value !== '' ||
    dateFrom.value !== '' ||
    dateTo.value !== ''
  )
})

const filteredOrders = computed(() => {
  let result = [...orders.value]

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(
      (order) =>
        order.id.toLowerCase().includes(query) ||
        order.shippingName.toLowerCase().includes(query) ||
        order.shippingPhone.includes(query),
    )
  }

  // Filter by status
  if (selectedStatus.value) {
    result = result.filter((order) => order.status === selectedStatus.value)
  }

  // Filter by date range
  if (dateFrom.value) {
    const fromDate = new Date(dateFrom.value)
    result = result.filter((order) => new Date(order.createdAt) >= fromDate)
  }

  if (dateTo.value) {
    const toDate = new Date(dateTo.value)
    toDate.setHours(23, 59, 59, 999)
    result = result.filter((order) => new Date(order.createdAt) <= toDate)
  }

  return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

const totalPages = computed(() => {
  return Math.ceil(filteredOrders.value.length / pageSize.value)
})

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredOrders.value.slice(start, end)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const delta = 2
  const pages: number[] = []

  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
    pages.push(i)
  }

  return pages
})

// ================================
// UTILITY METHODS
// ================================
const formatPrice = (price: number) => {
  if (!price || isNaN(price)) return '0 ₫'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
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
    [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-800 border border-blue-200',
    [OrderStatus.SHIPPING]: 'bg-purple-100 text-purple-800 border border-purple-200',
    [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800 border border-green-200',
    [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800 border border-red-200',
  }
  return colors[status] || 'bg-gray-100 text-gray-800 border border-gray-200'
}

// ================================
// ✅ HELPER FUNCTIONS - SAME AS CARTVIEW với API cache
// ================================
const getProductName = (detail: OrderDetail) => {
  console.log('📦 Getting product name for order detail:', detail.id)

  // ✅ Lấy từ cache variant đã fetch
  const variantInfo = variantCache.value.get(detail.productVariantId)
  if (variantInfo?.product?.name) {
    console.log('✅ Found product name from API cache:', variantInfo.product.name)
    return variantInfo.product.name
  }

  // Fallback - từ data có sẵn trong order
  if (detail.productVariant?.product?.name) {
    console.log('✅ Found product name from populated data:', detail.productVariant.product.name)
    return detail.productVariant.product.name
  }

  if (detail.productVariant?.name) {
    console.log('✅ Found variant name:', detail.productVariant.name)
    return detail.productVariant.name
  }

  // Fallback với productVariantId
  const fallbackName = `Sản phẩm #${detail.productVariantId?.slice(-8) || 'Unknown'}`
  console.log('⚠️ Using fallback name:', fallbackName)
  return fallbackName
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
const getProductImage = (detail: OrderDetail) => {
  console.log('🖼️ Getting product image for order detail:', detail.id)
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

const getVariantSize = (detail: OrderDetail) => {
  console.log('📏 Getting variant size for order detail:', detail.id)

  // ✅ Lấy từ cache variant đã fetch
  const variantInfo = variantCache.value.get(detail.productVariantId)
  if (variantInfo?.size) {
    console.log('✅ Found size from API cache:', variantInfo.size)
    return variantInfo.size
  }

  // Fallback - từ data có sẵn trong order
  if (detail.productVariant?.size) {
    console.log('✅ Found size from populated data:', detail.productVariant.size)
    return detail.productVariant.size
  }

  console.log('⚠️ No size found, returning N/A')
  return 'N/A'
}

const getVariantColor = (detail: OrderDetail) => {
  console.log('🎨 Getting variant color for order detail:', detail.id)

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

  // Fallback - từ data có sẵn trong order
  if (detail.productVariant?.color?.name) {
    console.log('✅ Found color from populated data:', detail.productVariant.color.name)
    return detail.productVariant.color.name
  }

  if (detail.productVariant?.colorName) {
    console.log('✅ Found colorName from populated data:', detail.productVariant.colorName)
    return detail.productVariant.colorName
  }

  if (detail.productVariant?.color) {
    console.log('✅ Found productVariant.color:', detail.productVariant.color)
    return detail.productVariant.color
  }

  console.log('⚠️ No color found, returning N/A')
  return 'N/A'
}

const getTotalQuantity = (orderDetails: OrderDetail[]) => {
  return orderDetails.reduce((total, detail) => total + detail.quantity, 0)
}

const getPreviewItems = (orderDetails: OrderDetail[]) => {
  return orderDetails.slice(0, 2)
}

const canCancelOrder = (order: Order) => {
  return [OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(order.status)
}

// ✅ Load thông tin variant từ API cho tất cả order details
const loadVariantInfoForOrder = async (order: Order) => {
  console.log('🔄 Loading variant info for order:', order.id.slice(-8))

  const promises = order.orderDetails.map(async (detail) => {
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
  console.log('✅ Variant info loaded for order:', order.id.slice(-8))
}

// ✅ Load thông tin variant cho tất cả orders
const loadVariantInfoForAllOrders = async () => {
  console.log('🔄 Loading variant info for all orders...')

  const promises = orders.value.map((order) => loadVariantInfoForOrder(order))
  await Promise.all(promises)

  console.log('✅ All variant info loaded for orders')
}

// ================================
// API METHODS
// ================================
const loadOrders = async () => {
  if (!currentUser.value?.userId) {
    router.push('/login')
    return
  }

  try {
    loading.value = true
    error.value = ''

    const ordersData = await getUserOrders(currentUser.value.userId)
    orders.value = ordersData || []

    console.log('✅ User orders loaded:', orders.value.length, 'orders')

    // ✅ Load variant info cho tất cả orders
    if (orders.value.length > 0) {
      await loadVariantInfoForAllOrders()
    }

    console.log(
      '📊 Orders data:',
      orders.value.map((order) => ({
        id: order.id.slice(-8),
        totalAmount: order.totalAmount,
        status: order.status,
      })),
    )
  } catch (err) {
    console.error('❌ Error loading orders:', err)
    error.value = 'Không thể tải danh sách đơn hàng. Vui lòng thử lại.'
    orders.value = []
  } finally {
    loading.value = false
  }
}

const cancelOrderHandler = async () => {
  if (!orderToCancel.value) return

  try {
    isCanceling.value = true
    const canceledOrder = await cancelOrder(orderToCancel.value.id)

    const index = orders.value.findIndex((o) => o.id === orderToCancel.value!.id)
    if (index !== -1) {
      orders.value[index] = canceledOrder
    }

    showCancelDialog.value = false
    orderToCancel.value = null
    showSuccess('Đơn hàng đã được hủy thành công')
  } catch (err) {
    console.error('❌ Error canceling order:', err)
    showError('Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại.')
  } finally {
    isCanceling.value = false
  }
}

const reorderItems = async (order: Order) => {
  if (!currentUser.value?.userId) return

  try {
    const cart = await getOrCreateUserCart(currentUser.value.userId)

    const promises = order.orderDetails.map((detail) =>
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

// ================================
// FILTER & SEARCH METHODS
// ================================
const refreshOrders = async () => {
  await loadOrders()
  showSuccess('Đã làm mới danh sách đơn hàng')
}

const debounceSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  searchTimeout.value = setTimeout(() => {
    applyFilters()
  }, 500)
}

const applyFilters = () => {
  currentPage.value = 1
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = ''
  dateFrom.value = ''
  dateTo.value = ''
  currentPage.value = 1
  showSuccess('Đã xóa tất cả bộ lọc')
}

// ================================
// NAVIGATION METHODS
// ================================
const viewOrderDetail = (orderId: string) => {
  router.push(`/orders/${orderId}`)
}

const confirmCancelOrder = (order: Order) => {
  orderToCancel.value = order
  showCancelDialog.value = true
}

const continueShopping = () => {
  router.push('/')
}

// ================================
// TOAST METHODS
// ================================
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

// ================================
// WATCHERS & LIFECYCLE
// ================================
watch([searchQuery, selectedStatus, dateFrom, dateTo], () => {
  currentPage.value = 1
})

onMounted(() => {
  loadOrders()
  updateCartCount()
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

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Custom backdrop blur */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Enhanced shadows and gradients */
.shadow-xl {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.shadow-lg {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.shadow-md {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Smooth transitions */
* {
  transition-property:
    color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow,
    transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Hover effects */
.hover\:scale-\[1\.005\]:hover {
  transform: scale(1.005);
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Soft glass morphism effect */
.from-white\/85 {
  --tw-gradient-from: rgba(255, 255, 255, 0.85);
}

.via-purple-50\/30 {
  --tw-gradient-via: rgba(250, 245, 255, 0.3);
}

.to-pink-50\/30 {
  --tw-gradient-to: rgba(253, 242, 248, 0.3);
}
</style>

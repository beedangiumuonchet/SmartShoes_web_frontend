<template>
  <div v-if="product" class="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
    <!-- Left: Images -->
    <div>
      <div class="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
        <img
          :src="selectedImage"
          alt="Product Image"
          class="w-full h-[500px] object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      <!-- Danh sách ảnh thumbnail -->
      <div class="flex gap-3 mt-4 justify-center flex-wrap">
        <img
          v-for="(img, i) in displayedImages"
          :key="i"
          :src="getDirectImageUrl(img.url)"
          :alt="'image-' + i"
          @click="selectedImage = getDirectImageUrl(img.url)"
          class="w-20 h-20 rounded-xl object-cover cursor-pointer border transition-all duration-300"
          :class="
            selectedImage === getDirectImageUrl(img.url)
              ? 'border-blue-500 scale-105'
              : 'border-gray-200 hover:scale-105'
          "
        />
      </div>
    </div>

    <!-- Right: Info -->
    <div>
      <!-- Tên sản phẩm -->
      <h1 class="text-3xl font-bold text-gray-900 mb-3">{{ product.name }}</h1>

      <!-- Thương hiệu + phân loại -->
      <p class="text-gray-500 mb-4">
        <RouterLink
          :to="{ path: '/products'}"
          class="text-blue-600 hover:underline"
        >
          {{ "Tất cả sản phẩm" }}
        </RouterLink>
        -
        <RouterLink
          v-if="product.brand"
          :to="{ path: '/products', query: { brandId: product.brand.id } }"
          class="text-blue-600 hover:underline"
        >
          {{ product.brand.name }}
        </RouterLink>

        <span v-else>{{ product.brand?.name || product.brandName || 'Không rõ thương hiệu' }}</span>

        -

        <RouterLink
          v-if="product.category"
          :to="{ path: '/products', query: { categoryId: product.category.id } }"
          class="text-blue-600 hover:underline"
        >
          {{ product.category.name }}
        </RouterLink>
        <span v-else>{{
          product.category?.name || product.categoryName || 'Không rõ phân loại'
        }}</span>
      </p>

      <!-- Giá và tồn kho -->
      <!-- <div v-if="currentVariant" class="flex items-center space-x-3 mb-6">
        <span class="text-3xl font-bold text-blue-600">{{
          formatPrice(currentVariant.price)
        }}</span>
        <span class="text-gray-500 text-sm">Còn lại: {{ currentVariant.stock }}</span>
      </div> -->
      <div v-if="currentVariant" class="flex items-center space-x-3 mb-6">
        <span class="text-3xl font-bold text-blue-600">
          {{ formatPrice(currentVariant.priceSale ?? currentVariant.price) }}
        </span>

        <span v-if="isOnSale" class="text-gray-500 line-through text-lg">
          {{ formatPrice(currentVariant.price) }}
        </span>

        <span v-if="isOnSale" class="text-red-500 font-semibold text-sm">
          -{{ salePercent }}%
        </span>

        <span class="text-gray-500 text-sm ml-2">Còn lại: {{ currentVariant.stock }}</span>
      </div>
      <div v-else class="text-gray-500 mb-6 italic">
        Vui lòng chọn đủ size và màu để xem chi tiết sản phẩm.
      </div>

      <!-- Chọn size -->
      <div class="mb-6">
        <h3 class="font-semibold text-gray-800 mb-2">Chọn size</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="size in allSizes"
            :key="size"
            @click="selectSize(size)"
            :disabled="!availableSizes.includes(size)"
            class="px-4 py-2 rounded-lg border transition-all duration-200"
            :class="
              selectedSize === size
                ? 'bg-blue-600 text-white border-blue-600'
                : !availableSizes.includes(size)
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            "
          >
            {{ size }}
          </button>
        </div>
      </div>

      <!-- Chọn màu -->
      <div class="mb-6">
        <h3 class="font-semibold text-gray-800 mb-2">Chọn màu</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="color in allColors"
            :key="color"
            @click="selectColor(color)"
            :disabled="!availableColors.includes(color)"
            class="px-4 py-2 rounded-lg border transition-all duration-200"
            :class="
              selectedColor === color
                ? 'bg-blue-600 text-white border-blue-600'
                : !availableColors.includes(color)
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            "
          >
            {{ color }}
          </button>
        </div>
      </div>

      <!-- Chọn số lượng -->
      <div class="mb-6">
        <h3 class="font-semibold text-gray-800 mb-2">Số lượng</h3>
        <div class="flex items-center space-x-3">
          <button
            @click="decreaseQuantity"
            :disabled="quantity <= 1"
            class="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>
          <span class="w-16 text-center font-semibold text-lg">{{ quantity }}</span>
          <button
            @click="increaseQuantity"
            :disabled="!currentVariant || quantity >= currentVariant.stock"
            class="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <p
          v-if="currentVariant && quantity > currentVariant.stock"
          class="text-red-500 text-sm mt-1"
        >
          Số lượng vượt quá tồn kho
        </p>
      </div>

      <!-- Nút thêm giỏ hàng -->
      <button
        class="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2"
        :class="
          canAddToCart
            ? 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
            : 'bg-gray-300 cursor-not-allowed'
        "
        :disabled="!canAddToCart || isAddingToCart"
        @click="addToCart"
      >
        <svg
          v-if="isAddingToCart"
          class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
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
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6H19"
          />
        </svg>
        <span>{{
          isAddingToCart
            ? 'Đang thêm...'
            : canAddToCart
              ? 'Thêm vào giỏ hàng'
              : 'Chọn size và màu để thêm vào giỏ'
        }}</span>
      </button>

      <!-- Thông báo thành công -->
      <div
        v-if="showSuccessMessage"
        class="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-700 text-sm flex items-center space-x-2"
      >
        <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span>Đã thêm sản phẩm vào giỏ hàng thành công!</span>
      </div>

      <!-- Mô tả -->
      <div class="mt-8">
        <h3 class="font-semibold text-gray-800 mb-2">Mô tả sản phẩm</h3>
        <p class="text-gray-700 leading-relaxed">{{ product.description }}</p>
      </div>

      <!-- Thuộc tính -->
      <div v-if="product.attributes?.length" class="mt-8">
        <h3 class="font-semibold text-gray-800 mb-2">Thông tin chi tiết</h3>
        <ul class="space-y-1 text-gray-700">
          <li
            v-for="(attr, index) in groupedAttributes"
            :key="index"
            class="flex justify-between border-b py-1 text-sm"
          >
            <span class="font-medium">{{ attr.key }}:</span>
            <span>{{ attr.values.join(', ') }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <!-- ========== REVIEWS SECTION - THÊM MỚI ========== -->
  <div
    v-if="product"
    class="max-w-7xl mx-auto px-4 py-12 border-t border-gray-200"
    data-reviews-section
  >
    <!-- Reviews Header với Star Filter -->
    <div
      class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0"
    >
      <div class="flex items-center space-x-4">
        <div
          class="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center"
        >
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            ></path>
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Đánh giá sản phẩm</h2>
          <p class="text-gray-600">
            {{ filteredReviews.length }} đánh giá
            <span v-if="selectedStarFilter > 0" class="text-yellow-600">
              ({{ selectedStarFilter }} sao)
            </span>
          </p>
        </div>
      </div>

      <!-- Reviews Summary & Star Filter -->
      <div class="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <!-- Star Filter Buttons -->
        <div class="flex items-center space-x-2">
          <span class="text-sm font-medium text-gray-600">Lọc:</span>
          <button
            @click="filterByStar(0)"
            :class="
              selectedStarFilter === 0
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-3 py-1 rounded-full text-sm font-medium transition-colors"
          >
            Tất cả
          </button>
          <button
            v-for="star in [5, 4, 3, 2, 1]"
            :key="star"
            @click="filterByStar(star)"
            :class="
              selectedStarFilter === star
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            class="px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center space-x-1"
          >
            <span>{{ star }}</span>
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              />
            </svg>
          </button>
        </div>

        <!-- Reviews Summary -->
        <div v-if="reviews.length > 0" class="text-right">
          <div class="flex items-center justify-end space-x-2 mb-1">
            <div class="flex">
              <svg
                v-for="n in 5"
                :key="n"
                class="w-5 h-5"
                :class="n <= averageRating ? 'text-yellow-400' : 'text-gray-300'"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              </svg>
            </div>
            <span class="text-xl font-bold text-gray-900">{{ averageRating.toFixed(1) }}/5</span>
          </div>
          <p class="text-sm text-gray-500">Trung bình từ {{ reviews.length }} đánh giá</p>
        </div>
      </div>
    </div>

    <!-- Reviews Loading State -->
    <div v-if="loadingReviews" class="text-center py-12">
      <div class="inline-flex items-center space-x-2 text-gray-600">
        <svg class="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
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
        <span>Đang tải đánh giá...</span>
      </div>
    </div>

    <!-- Reviews List -->
    <div v-else-if="paginatedReviews.length > 0" class="space-y-6">
      <div
        v-for="review in paginatedReviews"
        :key="review.id"
        class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
      >
        <!-- Review Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3">
            <!-- User Avatar -->
            <div
              class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
            >
              <span class="text-white font-semibold text-sm">
                {{ review.user?.name?.charAt(0).toUpperCase() || 'U' }}
              </span>
            </div>

            <!-- User Info -->
            <div>
              <p class="font-semibold text-gray-900">
                {{ review.user?.name || 'Khách hàng' }}
              </p>
              <p class="text-sm text-gray-500">
                {{ formatReviewDate(review.createdAt) }}
              </p>
            </div>
          </div>

          <!-- Rating Stars -->
          <div class="flex items-center space-x-1">
            <div class="flex">
              <svg
                v-for="n in 5"
                :key="n"
                class="w-4 h-4"
                :class="n <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              </svg>
            </div>
            <span class="ml-2 text-sm font-medium text-gray-700">{{ review.rating }}/5</span>
          </div>
        </div>

        <!-- Review Content -->
        <div class="text-gray-700 leading-relaxed">
          <p>{{ review.comment }}</p>
        </div>
      </div>

      <!-- Reviews Pagination -->
      <div v-if="totalReviewPages > 1" class="flex items-center justify-center space-x-2 mt-8">
        <button
          @click="prevReviewPage"
          :disabled="currentReviewPage <= 1"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>

        <div class="flex space-x-1">
          <button
            v-for="page in visibleReviewPages"
            :key="page"
            @click="goToReviewPage(page)"
            :class="
              page === currentReviewPage
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            "
            class="px-3 py-2 border border-gray-300 rounded-lg font-medium transition-colors"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="nextReviewPage"
          :disabled="currentReviewPage >= totalReviewPages"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- No Reviews State -->
    <div v-else class="text-center py-12">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          ></path>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Chưa có đánh giá nào</h3>
      <p class="text-gray-600">Sản phẩm này chưa có đánh giá từ khách hàng.</p>
    </div>
  </div>
  <div v-else class="text-center py-20 text-gray-500">Đang tải dữ liệu sản phẩm...</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, unref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getProductByIdApi, getProductBySlugApi } from './product.api'
import { getOrCreateUserCart, addCartDetail } from '@/modules/carts/carts.api'
import { CartDetailRequest } from '@/modules/carts/carts.type'
import { getCurrentUser } from '@/common/guards/roleGuard.guard'
// Cập nhật import này ở đầu file
import { formatReviewDate, getReviewsByProduct } from '@/modules/reviews/reviews.api'
import type { Review } from '@/modules/reviews/reviews.type'
const route = useRoute()
const product = ref<any>(null)
const selectedSize = ref<string | null>(null)
const selectedColor = ref<string | null>(null)
const selectedImage = ref<string>('')
const quantity = ref<number>(1)
const isAddingToCart = ref<boolean>(false)
const showSuccessMessage = ref<boolean>(false)
// ========== REVIEWS STATES - THÊM MỚI ==========
const reviews = ref<Review[]>([])
const loadingReviews = ref<boolean>(true)
const currentReviewPage = ref<number>(1)
const reviewsPerPage = 5
const selectedStarFilter = ref<number>(0) // 0 = tất cả, 1-5 = filter theo sao

// Reviews Computed
const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0
  const total = reviews.value.reduce((sum, review) => sum + review.rating, 0)
  return total / reviews.value.length
})

const filteredReviews = computed(() => {
  if (selectedStarFilter.value === 0) {
    return reviews.value
  }
  return reviews.value.filter((review) => review.rating === selectedStarFilter.value)
})

const totalReviewPages = computed(() => Math.ceil(filteredReviews.value.length / reviewsPerPage))

const paginatedReviews = computed(() => {
  const start = (currentReviewPage.value - 1) * reviewsPerPage
  const end = start + reviewsPerPage
  return filteredReviews.value.slice(start, end)
})

const visibleReviewPages = computed(() => {
  const total = totalReviewPages.value
  const current = currentReviewPage.value
  const range = 2

  let start = Math.max(1, current - range)
  let end = Math.min(total, current + range)

  if (end - start < 4) {
    if (start === 1) {
      end = Math.min(total, start + 4)
    } else if (end === total) {
      start = Math.max(1, end - 4)
    }
  }

  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})
// ========== REVIEWS METHODS - CẬP NHẬT ==========
const loadReviews = async (): Promise<void> => {
  if (!product.value?.id) return

  try {
    loadingReviews.value = true
    console.log('🔄 Loading reviews for product:', product.value.id)

    const response = await getReviewsByProduct(product.value.id, {
      page: 0,
      size: 100,
      sortBy: 'createdAt',
      sortDirection: 'desc',
    })

    const reviewsData = response.content || []
    console.log('✅ Raw reviews loaded:', reviewsData.length, 'reviews')

    // ✅ THÊM MỚI - Fetch user info cho từng review
    const reviewsWithUserInfo = await Promise.allSettled(
      reviewsData.map(async (review) => {
        try {
          // Import getUserById từ users.api.ts
          const { getUserById } = await import('@/modules/users/users.api')
          const userInfo = await getUserById(review.userId)

          console.log('👤 User info for review:', {
            reviewId: review.id,
            userId: review.userId,
            userName: `${userInfo.firstName} ${userInfo.lastName}`,
          })

          return {
            ...review,
            user: {
              id: userInfo.id,
              name: `${userInfo.firstName} ${userInfo.lastName}`.trim() || userInfo.username,
              email: userInfo.email,
            },
          }
        } catch (error) {
          console.warn(`⚠️ Failed to fetch user info for userId: ${review.userId}`, error)
          // Fallback nếu không lấy được user info
          return {
            ...review,
            user: {
              id: review.userId,
              name: 'Khách hàng',
              email: '',
            },
          }
        }
      }),
    )

    // ✅ Lọc ra những review thành công
    const successfulReviews = reviewsWithUserInfo
      .filter((result) => result.status === 'fulfilled')
      .map((result) => (result as PromiseFulfilledResult<Review>).value)

    reviews.value = successfulReviews
    console.log('✅ Reviews with user info loaded:', reviews.value.length, 'reviews')

    // ✅ Log sample để check data
    if (reviews.value.length > 0) {
      console.log('📋 Sample review with user:', {
        id: reviews.value[0].id,
        comment: reviews.value[0].comment.substring(0, 50),
        rating: reviews.value[0].rating,
        userName: reviews.value[0].user?.name,
        userEmail: reviews.value[0].user?.email,
      })
    }
  } catch (error) {
    console.error('❌ Error loading reviews:', error)
    reviews.value = []
  } finally {
    loadingReviews.value = false
  }
}

// Star Filter Method
const filterByStar = (star: number): void => {
  selectedStarFilter.value = star
  currentReviewPage.value = 1 // Reset về trang đầu
  console.log('⭐ Filtering by star:', star === 0 ? 'All' : `${star} stars`)
}

// Reviews Pagination Methods
const goToReviewPage = (page: number): void => {
  currentReviewPage.value = page
  document.querySelector('[data-reviews-section]')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

const prevReviewPage = (): void => {
  if (currentReviewPage.value > 1) {
    goToReviewPage(currentReviewPage.value - 1)
  }
}

const nextReviewPage = (): void => {
  if (currentReviewPage.value < totalReviewPages.value) {
    goToReviewPage(currentReviewPage.value + 1)
  }
}
const normalize = (str: string) =>
  str
    ?.normalize('NFD')
    ?.replace(/[\u0300-\u036f]/g, '')
    ?.toLowerCase()
    ?.trim()

const allSizes = computed(() => {
  const sizes = [...new Set(product.value?.variants?.map((v) => v.size) || [])]
  const allNumeric = sizes.every((s) => !isNaN(Number(s)))
  return allNumeric
    ? sizes.sort((a, b) => Number(a) - Number(b))
    : sizes.sort((a, b) => a.localeCompare(b, 'vi', { numeric: true }))
})

const allColors = computed(() => [
  ...new Set(product.value?.variants?.map((v) => v.colorName) || []),
])

// Kiểm tra size còn khả dụng với color đã chọn
const availableSizes = computed(() => {
  if (!product.value?.variants?.length) return []

  return allSizes.value.filter((size) => {
    // Tìm variant cùng size và color (nếu đã chọn color)
    const variants = product.value.variants.filter((v) => {
      const matchSize = normalize(v.size) === normalize(size)
      const matchColor = selectedColor.value
        ? normalize(v.colorName) === normalize(selectedColor.value)
        : true
      const hasStock = v.stock > 0
      return matchSize && matchColor && hasStock
    })
    return variants.length > 0
  })
})

// Kiểm tra color còn khả dụng với size đã chọn
const availableColors = computed(() => {
  if (!product.value?.variants?.length) return []

  return allColors.value.filter((color) => {
    const variants = product.value.variants.filter((v) => {
      const matchColor = normalize(v.colorName) === normalize(color)
      const matchSize = selectedSize.value
        ? normalize(v.size) === normalize(selectedSize.value)
        : true
      const hasStock = v.stock > 0
      return matchColor && matchSize && hasStock
    })
    return variants.length > 0
  })
})

const displayedImages = computed(() => {
  // Nếu user đã chọn màu → dùng ảnh theo màu
  if (selectedColor.value && imagesByColor.value[selectedColor.value]) {
    return imagesByColor.value[selectedColor.value]
  }

  // Nếu đã chọn variant → fallback
  if (currentVariant.value?.images?.length) {
    return currentVariant.value.images
  }

  // Nếu chưa chọn, hiển thị ảnh chính (main images)
  const mainImgs = product.value?.variants?.flatMap((v) => v.images?.filter((i) => i.isMain)) || []

  if (!mainImgs.length && product.value?.variants?.length) {
    return product.value.variants[0].images || []
  }

  return mainImgs
})

const imagesByColor = computed(() => {
  if (!product.value?.variants) return {}

  const map: Record<string, any[]> = {}

  for (const v of product.value.variants) {
    const color = v.colorName
    if (!map[color]) map[color] = []

    // Thêm ảnh vào màu nếu chưa tồn tại
    v.images?.forEach((img) => {
      if (!map[color].some((i) => i.url === img.url)) {
        map[color].push(img)
      }
    })
  }

  return map
})

const isOnSale = computed(() => {
  return (
    currentVariant.value?.priceSale != null &&
    currentVariant.value.priceSale < currentVariant.value.price
  )
})

const salePercent = computed(() => {
  if (!isOnSale.value) return 0
  const original = currentVariant.value?.price ?? 0
  const sale = currentVariant.value?.priceSale ?? 0
  return Math.round(((original - sale) / original) * 100)
})

const currentVariant = computed(() => {
  const size = unref(selectedSize)
  const color = unref(selectedColor)
  if (!size || !color) return null
  return product.value?.variants?.find(
    (v) => normalize(v.size) === normalize(size) && normalize(v.colorName) === normalize(color),
  )
})

const mainImages = computed(
  () => product.value?.variants?.flatMap((v) => v.images?.filter((i) => i.isMain)) || [],
)

const canAddToCart = computed(() => {
  return (
    !!currentVariant.value &&
    quantity.value > 0 &&
    quantity.value <= currentVariant.value.stock &&
    !isAddingToCart.value
  )
})

const selectSize = (size: string) => {
  if (selectedSize.value === size) {
    selectedSize.value = null
  } else {
    selectedSize.value = size
  }

  // Nếu currentColor không còn hợp lệ với size mới, reset màu
  if (selectedColor.value && !availableColors.value.includes(selectedColor.value)) {
    selectedColor.value = null
  }
}

const selectColor = (color: string) => {
  if (selectedColor.value === color) {
    selectedColor.value = null
  } else {
    selectedColor.value = color
  }

  // Nếu currentSize không còn hợp lệ với color mới, reset size
  if (selectedSize.value && !availableSizes.value.includes(selectedSize.value)) {
    selectedSize.value = null
  }
}

const groupedAttributes = computed(() => {
  if (!product.value?.attributes) return []

  const map = new Map()

  product.value.attributes.forEach((attr) => {
    const key = attr.attribute.key
    const value = attr.attribute.value

    if (!map.has(key)) {
      map.set(key, [value])
    } else {
      // tránh push trùng value
      if (!map.get(key).includes(value)) {
        map.get(key).push(value)
      }
    }
  })

  return Array.from(map, ([key, values]) => ({
    key,
    values,
  }))
})

const increaseQuantity = () => {
  if (currentVariant.value && quantity.value < currentVariant.value.stock) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

function getDirectImageUrl(driveUrl: string) {
  // Tách ID ảnh từ link Google Drive
  const match = driveUrl?.match(/\/d\/([^/]+)/)
  if (!match) return driveUrl

  const driveId = match[1]
  // Gọi ảnh qua API backend (nó sẽ tự cache local)
  return `http://localhost:8080/api/v1/images/${driveId}`
}

const addToCart = async () => {
  if (!currentVariant.value || !canAddToCart.value) {
    console.warn('Cannot add to cart: invalid variant or conditions')
    return
  }

  const currentUser = getCurrentUser()
  if (!currentUser?.userId) {
    alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng')
    return
  }

  try {
    isAddingToCart.value = true
    console.log('=== ADDING TO CART ===')
    console.log('Product:', product.value.name)
    console.log('Variant ID:', currentVariant.value.id)
    console.log('Quantity:', quantity.value)
    console.log('Size:', selectedSize.value)
    console.log('Color:', selectedColor.value)

    // 1. Lấy hoặc tạo cart cho user
    const cart = await getOrCreateUserCart(currentUser.userId)
    console.log('✅ Got cart:', cart.id)

    // 2. Thêm sản phẩm vào cart
    const cartDetailRequest = new CartDetailRequest(currentVariant.value.id, quantity.value)

    const cartDetail = await addCartDetail(cart.id, cartDetailRequest)
    console.log('✅ Added to cart:', cartDetail)

    // 3. Hiển thị thông báo thành công
    showSuccessMessage.value = true
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)

    // 4. Emit event để update cart count trong TopBar
    window.dispatchEvent(new CustomEvent('cart-updated'))

    console.log('✅ Successfully added to cart!')
  } catch (error) {
    console.error('❌ Error adding to cart:', error)

    // Hiển thị lỗi chi tiết
    let errorMessage = 'Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng'

    if (error && typeof error === 'object' && 'response' in error) {
      const httpError = error as any
      if (httpError.response?.data?.message) {
        errorMessage = httpError.response.data.message
      } else if (httpError.response?.status === 400) {
        errorMessage = 'Thông tin sản phẩm không hợp lệ'
      } else if (httpError.response?.status === 401) {
        errorMessage = 'Vui lòng đăng nhập lại'
      } else if (httpError.response?.status === 404) {
        errorMessage = 'Không tìm thấy sản phẩm hoặc giỏ hàng'
      }
    }

    alert(errorMessage)
  } finally {
    isAddingToCart.value = false
  }
}

onMounted(async () => {
  try {
    // const id = route.params.id as string
    // const res = await getProductByIdApi(id)
    const slug = route.params.slug as string
    const res = await getProductBySlugApi(slug)

    console.log('=== API RESPONSE DEBUG ===')
    console.log('Full response:', res)
    console.log('===========================')

    // ✅ Gán product trực tiếp từ response
    product.value = res ?? null
    console.log('✅ Product sau khi gán:', product.value)

    if (!product.value) {
      console.warn('⚠️ Không có dữ liệu sản phẩm, kiểm tra API!')
      return
    }

    // ✅ Hiển thị ảnh mặc định
    if (product.value?.variants?.length) {
      const firstVariant = product.value.variants.find((v) => v.images?.length)
      selectedImage.value = getDirectImageUrl(
        firstVariant?.images?.find((i: any) => i.isMain)?.url ||
          firstVariant?.images?.[0]?.url ||
          '',
      )

      console.log('✅ Ảnh sản phẩm đã chọn:', selectedImage.value)
    }
    await loadReviews()
  } catch (err) {
    console.error('❌ Lỗi tải sản phẩm:', err)
  }
})
// watch(currentVariant, (newVal) => {
//   if (newVal?.images?.length) {
//     selectedImage.value = getDirectImageUrl(
//       newVal.images.find((i) => i.isMain)?.url || newVal.images[0].url
//     )
//   }
// })

watch(selectedColor, (color) => {
  if (!color) return
  const imgs = imagesByColor.value[color]
  if (imgs?.length) {
    const main = imgs.find((i) => i.isMain)
    selectedImage.value = getDirectImageUrl(main?.url || imgs[0].url)
  }
})
</script>

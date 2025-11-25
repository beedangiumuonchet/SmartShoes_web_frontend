<template>
  <div class="max-w-7xl mx-auto px-4 py-10">
    <!-- Tiêu đề -->
    <h1 class="text-3xl font-bold text-gray-800 mb-8 text-center">Danh sách sản phẩm</h1>

    <!-- ========== AI SEARCH SECTION - THÊM MỚI ========== -->
    <div
      class="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 mb-8"
    >
      <!-- AI Search Header -->
      <div class="text-center mb-6">
        <div class="flex items-center justify-center space-x-3 mb-3">
          <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-white">🤖 Tìm kiếm thông minh với AI</h2>
        </div>
        <p class="text-blue-100 text-sm max-w-2xl mx-auto">
          Mô tả sản phẩm bằng ngôn ngữ tự nhiên, AI sẽ hiểu và tìm kiếm chính xác những gì bạn cần!
        </p>
      </div>

      <!-- AI Search Box -->
      <div class="max-w-4xl mx-auto">
        <div class="relative flex items-center">
          <!-- Search Input -->
          <div class="flex-1 relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                class="h-5 w-5 text-blue-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              v-model="aiSearchQuery"
              type="text"
              class="block w-full pl-12 pr-4 py-4 text-gray-900 bg-white/95 backdrop-blur-sm rounded-l-2xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white transition-all duration-300 text-lg"
              placeholder="VD: 'Tôi cần giày chạy bộ màu đen size 42 cho nam giới dưới 2 triệu'"
              @keyup.enter="handleAiSearch"
            />
          </div>

          <!-- Search Button -->
          <button
            @click="handleAiSearch"
            :disabled="isAiSearching || !aiSearchQuery.trim()"
            class="px-8 py-4 bg-white text-blue-600 font-semibold rounded-r-2xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2"
          >
            <svg v-if="isAiSearching" class="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
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
            <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span class="text-lg">{{ isAiSearching ? 'Đang tìm...' : 'Tìm kiếm AI' }}</span>
          </button>
        </div>

        <!-- Quick AI Search Examples -->
        <div class="flex flex-wrap gap-3 mt-6 justify-center">
          <button
            v-for="example in aiSearchExamples"
            :key="example"
            @click="runExample(example)"
            class="px-4 py-2 text-sm bg-white/20 text-white rounded-full hover:bg-white/30 transition-all duration-200 backdrop-blur-sm border border-white/20"
          >
            {{ example }}
          </button>
        </div>

        <!-- AI Search Status -->
        <div v-if="aiLastSearchQuery" class="mt-4 text-center">
          <div
            class="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2"
          >
            <span class="text-white/80 text-sm">Tìm kiếm gần nhất:</span>
            <span class="text-white font-medium text-sm">"{{ aiLastSearchQuery }}"</span>
            <span class="text-white/60 text-xs">• {{ aiSearchMode }} mode</span>
            <button @click="clearAiSearch" class="text-white/80 hover:text-white transition-colors">
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

        <!-- ✅ THÊM MỚI - AI Fallback Suggestions -->
        <div v-if="aiSuggestions.length > 0 && aiSearchMode === 'fallback'" class="mt-6">
          <div class="text-center mb-4">
            <div class="mb-3">
              <div class="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 mb-2">
                <svg class="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span class="text-white font-medium text-sm">Chế độ Fallback</span>
              </div>
            </div>
            <p class="text-white/95 text-base font-medium mb-1">
              🤔 Không tìm thấy kết quả chính xác cho "{{ aiLastSearchQuery }}"
            </p>
            <p class="text-white/90 text-sm font-medium mb-2">
              💡 Có thể bạn sẽ thích những gợi ý này:
            </p>
            <p class="text-white/70 text-xs">AI đề xuất các từ khóa tương tự dựa trên kho sản phẩm</p>
          </div>
          
          <div class="flex flex-wrap gap-3 justify-center">
            <button
              v-for="(suggestion, index) in aiSuggestions"
              :key="suggestion"
              @click="runSuggestion(suggestion)"
              class="px-4 py-2 text-sm bg-gradient-to-r from-white/15 to-white/10 text-white rounded-full hover:from-white/25 hover:to-white/15 transition-all duration-300 backdrop-blur-sm border border-white/20 flex items-center space-x-2 hover:scale-105 hover:shadow-lg"
            >
              <span class="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">
                {{ index + 1 }}
              </span>
              <span>{{ suggestion }}</span>
              <svg class="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
          
          <!-- Hint message -->
          <div class="mt-4 text-center">
            <p class="text-white/60 text-xs">
              💡 <strong>Mẹo:</strong> Thử mô tả chi tiết hơn như "giày thể thao Nike màu trắng size 42" để có kết quả tốt hơn
            </p>
          </div>
        </div>

        <!-- ✅ THÊM MỚI - Hiển thị khi có suggestions nhưng không phải fallback mode -->
        <div v-else-if="aiSuggestions.length > 0" class="mt-6">
          <div class="text-center mb-4">
            <p class="text-white/90 text-sm font-medium mb-2">
              ✨ Gợi ý thêm từ AI:
            </p>
            <p class="text-white/70 text-xs">Các từ khóa liên quan bạn có thể quan tâm</p>
          </div>
          
          <div class="flex flex-wrap gap-2 justify-center">
            <button
              v-for="suggestion in aiSuggestions.slice(0, 4)"
              :key="suggestion"
              @click="runSuggestion(suggestion)"
              class="px-3 py-1 text-xs bg-white/10 text-white/80 rounded-full hover:bg-white/20 hover:text-white transition-all duration-200 backdrop-blur-sm border border-white/10"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>
      </div>

    <!-- Bộ lọc -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-10">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Tìm kiếm -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Từ khóa</label>
          <input
            v-model="filters.q"
            type="text"
            placeholder="Nhập tên sản phẩm..."
            class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <!-- Thương hiệu -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Thương hiệu</label>
          <select
            v-model="filters.brandId"
            class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Tất cả</option>
            <option v-for="brand in brands" :key="brand.id" :value="brand.id">
              {{ brand.name }}
            </option>
          </select>
        </div>

        <!-- Danh mục -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
          <select
            v-model="filters.categoryId"
            class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Tất cả</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <!-- Sắp xếp -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Sắp xếp</label>
          <select
            v-model="filters.sortBy"
            class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Mặc định</option>
            <option value="createdAt">Mới nhất</option>
            <option value="price">Giá</option>
          </select>
        </div>
      </div>

      <!-- Nút áp dụng -->
      <div class="mt-6 text-right">
        <button
          @click="fetchProducts"
          class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all"
        >
          Áp dụng bộ lọc
        </button>
      </div>
    </div>

    <!-- Danh sách sản phẩm -->
    <div
      v-if="products.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
    >
      <RouterLink
        v-for="product in products"
        :key="product.id"
        :to="`/products/${product.id}`"
        class="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden group"
      >
        <!-- Ảnh -->
        <div class="relative w-full h-64 overflow-hidden">
          <img
            :src="getMainImage(product)"
            alt="Product Image"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <!-- Thông tin -->
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2">
            {{ product.name }}
          </h3>
          <p class="text-sm text-gray-500 mb-2">
            {{ product.brand?.name || 'Không rõ thương hiệu' }} ·
            {{ product.category?.name || 'Không rõ danh mục' }}
          </p>

          <div class="flex items-center justify-between">
            <span class="text-blue-600 font-semibold text-lg">
              {{ formatPrice(product.variants?.[0]?.price || 0) }}
            </span>
            <span
              class="px-2 py-1 rounded-lg text-xs font-medium"
              :class="
                product.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-200 text-gray-500'
              "
            >
              {{ statusLabel(product.status) }}
            </span>
          </div>
        </div>
      </RouterLink>
    </div>

    <!-- Loading / Empty -->
        <!-- Loading / Empty States -->
    <div v-else-if="isAiSearching" class="text-center py-20">
      <div class="inline-flex items-center space-x-2 text-purple-600">
        <svg class="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-lg">Đang tìm kiếm bằng AI...</span>
      </div>
    </div>

    <!-- ✅ CẬP NHẬT - Empty State với fallback message -->
    <div v-else class="text-center py-20">
      <div class="space-y-4">
        <!-- Icon -->
        <svg class="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        
        <!-- Main message -->
        <h3 class="text-xl font-medium text-gray-900">
          {{ isShowingAiResults ? 'Không tìm thấy sản phẩm với AI' : 'Không tìm thấy sản phẩm nào' }}
        </h3>
        
        <!-- Fallback specific message -->
        <div v-if="isShowingAiResults && aiSearchMode === 'fallback'" class="space-y-3">
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
            <div class="flex items-center space-x-2 text-yellow-800 mb-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span class="font-medium text-sm">Chế độ Fallback được kích hoạt</span>
            </div>
            <p class="text-yellow-700 text-sm">
              AI không tìm thấy sản phẩm phù hợp với từ khóa <strong>"{{ aiLastSearchQuery }}"</strong>. 
              Hãy thử các gợi ý ở phía trên hoặc mô tả chi tiết hơn.
            </p>
          </div>
        </div>
        
        <!-- Normal message -->
        <p v-else class="text-gray-500">
          {{ isShowingAiResults 
            ? 'Thử thay đổi từ khóa tìm kiếm AI hoặc sử dụng bộ lọc thông thường'
            : 'Thử thay đổi bộ lọc hoặc sử dụng tìm kiếm AI thông minh'
          }}
        </p>
        
        <!-- Action buttons -->
        <div class="flex justify-center space-x-3 mt-6">
          <button
            v-if="isShowingAiResults"
            @click="clearAiSearch"
            class="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
          >
            Xóa kết quả AI
          </button>
          
          <button
            @click="resetFilters"
            class="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Đặt lại bộ lọc
          </button>
          
          <!-- Quick suggest button -->
          <button
            v-if="!isShowingAiResults"
            @click="runSuggestion('giày thể thao nam nữ')"
            class="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
          >
            Thử AI: "giày thể thao"
          </button>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import {
  getAllProductsApi,
  getProductByIdApi,
  searchProductsWithAiApi,
} from '../products/product.api'
import { getAllBrandsApi } from '../brand/brand.api'
import { getAllCategoriesApi } from '../category/category.api'
import type {
  Product,
  Brand,
  Category,
  ProductFilter,
  AiSearchRequest,
  ResultItem,
} from '../products/product.type'

const products = ref<Product[]>([])
const brands = ref<Brand[]>([])
const categories = ref<Category[]>([])
const filters = ref<ProductFilter>({
  q: '',
  brandId: '',
  categoryId: '',
  sortBy: '',
})
// ========== AI SEARCH STATES - THÊM MỚI ==========
const aiSearchQuery = ref<string>('')
const isAiSearching = ref<boolean>(false)
const aiSearchResults = ref<ResultItem[]>([])
const aiSearchMode = ref<string>('')
const aiLastSearchQuery = ref<string>('')
const isShowingAiResults = ref<boolean>(false)
const aiSuggestions = ref<string[]>([]) // ✅ THÊM MỚI - AI suggestions

const runExample = (example: string) => {
  aiSearchQuery.value = example
  handleAiSearch()
}

// AI Search mapping để lưu score và text theo product ID
const aiProductScores = ref<Record<string, number>>({})
const aiProductTexts = ref<Record<string, string>>({})
const aiProductStocks = ref<Record<string, number>>({}) // ✅ THÊM MỚI - stock info
const aiProductStatuses = ref<Record<string, string>>({}) // ✅ THÊM MỚI - status info

// AI Search Examples
const aiSearchExamples = ref<string[]>([
  'Giày chạy bộ màu trắng size 42 dưới 2 triệu',
  'Sneakers Nike Air Force màu đen cho nam',
  'Giày cao gót đỏ cho nữ đi tiệc',
  'Giày thể thao thoáng khí cho tập gym',
  'Giày da công sở màu nâu lịch sự',
  'Giày bóng đá sân cỏ tự nhiên',
])
const resetFilters = () => {
  filters.value = {
    q: '',
    brandId: '',
    categoryId: '',
    sortBy: '',
  }
  clearAiSearchData()
  fetchProducts()
}
// ========== AI SEARCH METHODS - THÊM MỚI ==========
const handleAiSearch = async (): Promise<void> => {
  const query = aiSearchQuery.value.trim()

  if (!query) {
    alert('Vui lòng nhập từ khóa tìm kiếm AI')
    return
  }

  try {
    isAiSearching.value = true
    console.log('🤖 Starting AI search for:', query)

    const aiSearchRequest: AiSearchRequest = {
      query: query,
      threshold: 0.15, // Threshold thấp để có nhiều kết quả
      max_candidates: 16, // Tối đa 16 sản phẩm
      rerank: true,
    }

    const response = await searchProductsWithAiApi(aiSearchRequest)

    console.log('✅ AI search response:', response)

    aiSearchResults.value = response.results || []
    aiSearchMode.value = response.mode || 'unknown'
    aiLastSearchQuery.value = query
    isShowingAiResults.value = true
    aiSuggestions.value = response.suggestions || [] // ✅ ĐÃ CÓ - Lưu suggestions

    // ✅ THÊM MỚI - Log fallback info chi tiết
    if (response.mode === 'fallback') {
      console.log('🤔 Fallback mode activated!')
      console.log('📝 Suggestions received:', aiSuggestions.value)
    }

    if (aiSearchResults.value.length === 0) {
      if (aiSuggestions.value.length > 0) {
        alert('Không tìm thấy sản phẩm phù hợp. Hãy thử các gợi ý bên dưới!')
      } else {
        alert('Không tìm thấy sản phẩm phù hợp với AI. Thử với từ khóa khác!')
      }
      return
    }

    // Fetch detailed product info for AI results
    await fetchAiResultProducts()
  } catch (error: any) {
    console.error('❌ AI search error:', error)

    let errorMessage = 'Có lỗi xảy ra khi tìm kiếm AI'
    if (error?.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error?.message) {
      errorMessage = error.message
    }

    alert(`Tìm kiếm AI thất bại: ${errorMessage}`)
  } finally {
    isAiSearching.value = false
  }
}

const runSuggestion = (suggestion: string): void => {
  aiSearchQuery.value = suggestion
  handleAiSearch()
}

const fetchAiResultProducts = async (): Promise<void> => {
  try {
    console.log('🔍 Fetching detailed products for AI results...')

    // Reset mapping objects
    aiProductScores.value = {}
    aiProductTexts.value = {}
    aiProductStocks.value = {} // ✅ THÊM MỚI
    aiProductStatuses.value = {} // ✅ THÊM MỚI

    // Fetch all products concurrently
    const productPromises = aiSearchResults.value.map(async (result) => {
      try {
        const product = await getProductByIdApi(result.product_id)

        // Store AI metadata
        aiProductScores.value[result.product_id] = result.score
        aiProductTexts.value[result.product_id] = result.text
        aiProductStocks.value[result.product_id] = result.stock || 0 // ✅ THÊM MỚI
        aiProductStatuses.value[result.product_id] = result.status || 'UNKNOWN' // ✅ THÊM MỚI

        return product
      } catch (error) {
        console.warn(`⚠️ Failed to fetch product ${result.product_id}:`, error)
        return null
      }
    })

    const productResults = await Promise.allSettled(productPromises)
    const fetchedProducts: Product[] = []

    productResults.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        fetchedProducts.push(result.value)
      }
    })

    // Sort products by AI score (highest first)
    fetchedProducts.sort((a, b) => {
      const scoreA = aiProductScores.value[a.id] || 0
      const scoreB = aiProductScores.value[b.id] || 0
      return scoreB - scoreA
    })

    products.value = fetchedProducts

    console.log('✅ AI search products loaded:', {
      totalResults: aiSearchResults.value.length,
      productsFound: fetchedProducts.length,
      mode: aiSearchMode.value,
      suggestionsCount: aiSuggestions.value.length, // ✅ THÊM MỚI
    })
  } catch (error) {
    console.error('❌ Error fetching AI result products:', error)
    products.value = []
  }
}
const clearAiSearch = (): void => {
  clearAiSearchData()
  // Load normal products
  fetchProducts()
}

const clearAiSearchData = (): void => {
  aiSearchQuery.value = ''
  aiSearchResults.value = []
  aiSearchMode.value = ''
  aiLastSearchQuery.value = ''
  isShowingAiResults.value = false
  aiSuggestions.value = [] // ✅ THÊM MỚI
  aiProductScores.value = {}
  aiProductTexts.value = {}
  aiProductStocks.value = {} // ✅ THÊM MỚI
  aiProductStatuses.value = {} // ✅ THÊM MỚI
}
const fetchProducts = async () => {
  try {
    const res = await getAllProductsApi(filters.value)
    products.value = res?.content || [] // ✅ thêm .data
    console.log('✅ Products loaded:', products.value)
  } catch (err) {
    console.error('❌ Lỗi tải danh sách sản phẩm:', err)
  }
}

const fetchFilters = async () => {
  try {
    const [brandRes, catRes] = await Promise.all([getAllBrandsApi(), getAllCategoriesApi()])
    brands.value = brandRes?.data || []
    categories.value = catRes?.data || []
  } catch (err) {
    console.error('❌ Lỗi tải bộ lọc:', err)
  }
}

const getMainImage = (product: Product) => {
  const img =
    product.variants?.flatMap((v) => v.images)?.find((i) => i.isMain)?.url ||
    product.variants?.[0]?.images?.[0]?.url ||
    'https://via.placeholder.com/400x400?text=No+Image'
  return img
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

const statusLabel = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'Đang bán'
    case 'INACTIVE':
      return 'Ngừng bán'
    case 'OUT_OF_STOCK':
      return 'Hết hàng'
    default:
      return 'Không rõ'
  }
}

onMounted(async () => {
  await fetchFilters()
  await fetchProducts()
})
</script>
<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, opacity, transform, box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Hover effects */
button:hover {
  transform: translateY(-1px);
}

.group:hover {
  transform: translateY(-2px);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>

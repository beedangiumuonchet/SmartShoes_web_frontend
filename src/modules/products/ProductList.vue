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

          <!-- Image Search -->
          <label
            class="cursor-pointer inline-flex items-center px-6 py-4 bg-blue-50 border border-blue-300 text-blue-600 font-semibold rounded-full hover:bg-blue-100 transition text-sm md:text-base"
          >
            <input type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 7h2l2-3h10l2 3h2a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V8a1 1 0 011-1zM12 15a3 3 0 100-6 3 3 0 000 6z"
              />
            </svg>
            Tìm kiếm bằng hình ảnh
          </label>
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
              <div
                class="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 mb-2"
              >
                <svg
                  class="w-5 h-5 text-yellow-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
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
            <p class="text-white/70 text-xs">
              AI đề xuất các từ khóa tương tự dựa trên kho sản phẩm
            </p>
          </div>

          <div class="flex flex-wrap gap-3 justify-center">
            <button
              v-for="(suggestion, index) in aiSuggestions"
              :key="suggestion"
              @click="runSuggestion(suggestion)"
              class="px-4 py-2 text-sm bg-gradient-to-r from-white/15 to-white/10 text-white rounded-full hover:from-white/25 hover:to-white/15 transition-all duration-300 backdrop-blur-sm border border-white/20 flex items-center space-x-2 hover:scale-105 hover:shadow-lg"
            >
              <span
                class="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold"
              >
                {{ index + 1 }}
              </span>
              <span>{{ suggestion }}</span>
              <svg class="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>

          <!-- Hint message -->
          <div class="mt-4 text-center">
            <p class="text-white/60 text-xs">
              💡 <strong>Mẹo:</strong> Thử mô tả chi tiết hơn như "giày thể thao Nike màu trắng size
              42" để có kết quả tốt hơn
            </p>
          </div>
        </div>

        <!-- ✅ THÊM MỚI - Hiển thị khi có suggestions nhưng không phải fallback mode -->
        <div v-else-if="aiSuggestions.length > 0" class="mt-6">
          <div class="text-center mb-4">
            <p class="text-white/90 text-sm font-medium mb-2">✨ Gợi ý thêm từ AI:</p>
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
    </div>

    <!-- ========== MAIN CONTENT ========== -->
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Sidebar filter -->
      <div
        class="md:w-1/5 sticky top-24 h-fit bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4"
      >
        <!-- SEARCH BY NAME -->
        <div class="mb-6">
          <input
            v-model="filters.q"
            @keyup.enter="fetchProducts"
            type="text"
            placeholder="Tìm sản phẩm theo tên..."
            class="w-full border px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
        </div>
        <!-- THƯƠNG HIỆU -->
        <div class="border-b pb-3">
          <div
            class="flex items-center justify-between cursor-pointer py-1"
            @click="showBrand = !showBrand"
          >
            <h3 class="font-semibold text-gray-800 text-sm">Thương hiệu</h3>
            <span class="text-xs text-gray-600">{{ showBrand ? '▲' : '▼' }}</span>
          </div>
          <div v-show="showBrand" class="mt-2 space-y-1 pl-1">
            <div v-for="b in brands" :key="b.id" class="flex items-center gap-2">
              <input type="checkbox" :value="b.id" v-model="filters.brandIds" class="w-4 h-4" />
              <label class="text-sm text-gray-700">{{ b.name }}</label>
            </div>
          </div>
        </div>

        <!-- THỂ LOẠI -->
        <div class="border-b pb-3">
          <div
            class="flex items-center justify-between cursor-pointer py-1"
            @click="showCategory = !showCategory"
          >
            <h3 class="font-semibold text-gray-800 text-sm">Thể loại</h3>
            <span class="text-xs text-gray-600">{{ showCategory ? '▲' : '▼' }}</span>
          </div>
          <div v-show="showCategory" class="mt-2 space-y-1 pl-1">
            <div v-for="c in categories" :key="c.id" class="flex items-center gap-2">
              <input type="checkbox" :value="c.id" v-model="filters.categoryIds" class="w-4 h-4" />
              <label class="text-sm text-gray-700">{{ c.name }}</label>
            </div>
          </div>
        </div>

        <!-- MÀU SẮC -->
        <div class="border-b pb-3">
          <div
            class="flex items-center justify-between cursor-pointer py-1"
            @click="showColor = !showColor"
          >
            <h3 class="font-semibold text-gray-800 text-sm">Màu sắc</h3>
            <span class="text-xs text-gray-600">{{ showColor ? '▲' : '▼' }}</span>
          </div>
          <div v-show="showColor" class="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 pl-1">
            <div v-for="color in colors" :key="color.id" class="flex items-center gap-2">
              <input type="checkbox" :value="color.id" v-model="filters.colorIds" class="w-4 h-4" />
              <label class="text-sm text-gray-700">{{ color.name }}</label>
            </div>
          </div>
        </div>

        <!-- GIỚI TÍNH (Frontend only) -->
        <div class="border-b pb-3">
          <h3 class="font-semibold text-gray-800 text-sm mb-2">Giới tính</h3>

          <div class="space-y-1">
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" value="FEMALE" v-model="genderDraft" class="w-4 h-4" />
              Nữ (size 35–39)
            </label>

            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" value="MALE" v-model="genderDraft" class="w-4 h-4" />
              Nam (size 40–45)
            </label>
          </div>
        </div>

        <!-- GIÁ -->
        <div class="border-b pb-3">
          <h3 class="font-semibold text-gray-800 text-sm mb-1">Giá (VNĐ)</h3>
          <div class="flex gap-2">
            <input
              type="number"
              v-model.number="filters.minPrice"
              placeholder="Từ"
              class="w-1/2 border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="number"
              v-model.number="filters.maxPrice"
              placeholder="Đến"
              class="w-1/2 border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <!-- SẮP XẾP GIÁ -->
        <div class="border-b pb-3">
          <h3 class="font-semibold text-gray-800 text-sm mb-1">Sắp xếp</h3>
          <select
            v-model="selectedSort"
            @change="handleSortChange"
            class="w-full border rounded-lg px-3 py-2 text-sm"
          >
            <option value="createdAt-desc">Mặc định (Mới nhất)</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
          </select>
        </div>
        <!-- APPLY BTN -->
        <button
          @click="applyFilters"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all"
        >
          Áp dụng bộ lọc
        </button>

        <!-- RESET BTN -->
        <button
          @click="resetFilters"
          class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg transition-all"
        >
          Đặt lại bộ lọc
        </button>
      </div>

      <!-- Products grid -->
      <!-- <div v-if="uploadedImagePreview" class="text-center mb-6">
        <h3 class="text-lg font-semibold text-gray-700 mb-2">Ảnh bạn vừa tìm kiếm</h3>
        <img
          :src="uploadedImagePreview"
          class="mx-auto w-48 h-48 object-cover rounded-xl shadow-lg border"
          alt="Uploaded Image Preview"
        />
      </div> -->

      <div class="md:w-4/5">
        <div
          v-if="uploadedImagePreview"
          class="w-full flex flex-col items-center mb-8 pt-2 pb-4 border-b border-gray-200"
        >
          <h3 class="text-lg font-semibold text-gray-700 mb-3">Ảnh bạn vừa tìm kiếm</h3>

          <img
            :src="uploadedImagePreview"
            class="w-40 h-40 object-cover rounded-xl shadow-md border"
            alt="Uploaded Image Preview"
          />
        </div>
        <!-- Loading / Empty States -->
        <div v-if="isAiSearching" class="text-center py-20">
          <div class="inline-flex items-center space-x-2 text-purple-600">
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
            <span class="text-lg">Đang tìm kiếm bằng AI...</span>
          </div>
        </div>

        <!-- Products Grid -->
        <!-- <div
          v-else-if="paginatedProducts.length"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <RouterLink
            v-for="product in paginatedProducts"
            :key="product.id"
            :to="`/products/slug/${product.slug}`"
            class="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg overflow-hidden transition-transform group hover:scale-105"
          >
            <div class="relative w-full h-[220px] overflow-hidden bg-gray-50">
              <img
                :src="getDirectImageUrl(getMainImage(product))"
                class="w-full h-full object-contain group-hover:scale-105 transition"
              />
            </div>
            <div class="p-4 space-y-2">
              <h3
                class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2"
              >
                {{ product.name }}
              </h3>
              <p class="text-sm text-gray-500">
                {{ product.brand?.name || 'Không rõ thương hiệu' }} ·
                {{ product.category?.name || 'Không rõ danh mục' }}
              </p>

              <div class="flex items-center justify-between">
                <span class="text-blue-600 font-semibold"
                  >{{ formatPrice(getProductMinPrice(product)) }}
                </span>
                <span
                  v-if="hasDiscount(product)"
                  class="px-2 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-500"
                >
                  {{ getProductTag(product) }}
                </span>
              </div>
            </div>
          </RouterLink>
        </div> -->
<div
  v-else-if="paginatedProducts.length"
  class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
>
  <RouterLink
    v-for="product in paginatedProducts"
    :key="product.id"
    :to="`/products/slug/${product.slug}`"
    class="group bg-white border border-gray-200 rounded-2xl shadow hover:shadow-xl overflow-hidden transition-transform hover:scale-105"
  >
    <!-- IMAGE -->
    <div class="relative w-full h-[220px] overflow-hidden bg-gray-50">
      <img
        :src="getDirectImageUrl(getMainImage(product))"
        class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
      />

      <!-- 🔖 DISCOUNT BADGE -->
      <div
        v-if="hasDiscount(product)"
        class="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md"
      >
        {{ getProductTag(product) }}
      </div>
    </div>

    <!-- INFO -->
    <div class="p-4 space-y-2">
      <!-- NAME -->
      <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2">
        {{ product.name }}
      </h3>

      <!-- BRAND + CATEGORY -->
      <p class="text-sm text-gray-500">
        {{ product.brand?.name || 'Không rõ thương hiệu' }} ·
        {{ product.category?.name || 'Không rõ danh mục' }}
      </p>

      <!-- ⭐ RATING -->
<div class="flex items-center gap-1">
  <template
    v-if="reviewCache[product.id]?.totalReviews > 0"
  >
    <div class="flex items-center">
      <svg
        v-for="star in 5"
        :key="star"
        class="w-4 h-4"
        :class="
          star <= Math.floor(reviewCache[product.id].averageRating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        "
        viewBox="0 0 20 20"
      >
        <path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        />
      </svg>
    </div>

    <span class="text-xs text-gray-600 ml-1">
      {{ reviewCache[product.id].averageRating }}
      ({{ reviewCache[product.id].totalReviews }})
    </span>
  </template>

  <template v-else>
    <span class="text-xs text-gray-400">Chưa có đánh giá</span>
  </template>
</div>


      <!-- 💰 PRICE -->
      <div class="flex items-center justify-between mt-2">
        <div class="flex items-center gap-2">
          <span class="text-lg font-bold text-gray-900">
            {{ formatPrice(getProductMinPrice(product)) }}
          </span>

          <span
            v-if="hasDiscount(product)"
            class="text-sm text-gray-400 line-through"
          >
            {{ formatPrice(getProductOriginalPrice(product)) }}
          </span>
        </div>
      </div>
    </div>
  </RouterLink>
</div>

        <!-- Empty State -->
        <div v-else class="text-center py-20">
          <div class="space-y-4">
            <svg
              class="w-16 h-16 text-gray-400 mx-auto"
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

            <h3 class="text-xl font-medium text-gray-900">
              {{
                isShowingAiResults
                  ? 'Không tìm thấy sản phẩm với AI'
                  : 'Không tìm thấy sản phẩm nào'
              }}
            </h3>

            <!-- Fallback specific message -->
            <div v-if="isShowingAiResults && aiSearchMode === 'fallback'" class="space-y-3">
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
                <div class="flex items-center space-x-2 text-yellow-800 mb-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  <span class="font-medium text-sm">Chế độ Fallback được kích hoạt</span>
                </div>
                <p class="text-yellow-700 text-sm">
                  AI không tìm thấy sản phẩm phù hợp với từ khóa
                  <strong>"{{ aiLastSearchQuery }}"</strong>. Hãy thử các gợi ý ở phía trên hoặc mô
                  tả chi tiết hơn.
                </p>
              </div>
            </div>

            <p v-else class="text-gray-500">
              {{
                isShowingAiResults
                  ? 'Thử thay đổi từ khóa tìm kiếm AI hoặc sử dụng bộ lọc thông thường'
                  : 'Thử thay đổi bộ lọc hoặc sử dụng tìm kiếm AI thông minh'
              }}
            </p>

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

              <button
                v-if="!isShowingAiResults"
                @click="runSuggestion('giày đá bóng cỏ tự nhiên')"
                class="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                Thử AI: "giày đá bóng cỏ tự nhiên"
              </button>
            </div>
          </div>
        </div>
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center mt-10 gap-2">
          <button
            class="px-3 py-1 rounded-lg border text-sm"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            ←
          </button>

          <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            class="px-3 py-1 rounded-lg border text-sm"
            :class="{
              'bg-blue-600 text-white border-blue-600': page === currentPage,
              'hover:bg-gray-100': page !== currentPage,
            }"
          >
            {{ page }}
          </button>

          <button
            class="px-3 py-1 rounded-lg border text-sm"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { RouterLink } from 'vue-router'
import {
  getAllProductsApi,
  getProductByIdApi,
  searchProductsWithAiApi,
  searchProductsByImageApi,
} from '../products/product.api'
import { getReviewsByProduct } from '../reviews/reviews.api'
import { getAllBrandsApi } from '../brand/brand.api'
import { getAllCategoriesApi } from '../category/category.api'
import { getAllColorsApi } from '../color/color.api' // ✅ THÊM MỚI
import type {
  Product,
  Brand,
  Category,
  ProductFilter,
  AiSearchRequest,
  ResultItem,
  Color, // ✅ THÊM MỚI
} from '../products/product.type'
import { useRoute } from 'vue-router'
import { useFilteredProducts } from '@/common/store/productFilter.store'
import { fi } from '@nuxt/ui/runtime/locale/index.js'


type ReviewSummary = {
  averageRating: number
  totalReviews: number
}

const reviewCache = ref<Record<string, ReviewSummary>>({})

const route = useRoute()

const products = ref<Product[]>([])
const brands = ref<Brand[]>([])
const categories = ref<Category[]>([])
const colors = ref<Color[]>([]) // ✅ THÊM MỚI
const isImageSearching = ref(false)

// ✅ THÊM MỚI - UI Toggle states
const showBrand = ref(false)
const showCategory = ref(false)
const showColor = ref(false)

const currentPage = ref(1)
const pageSize = 8

// gender
type Gender = 'MALE' | 'FEMALE'

const genderDraft = ref<Gender[]>([]) // checkbox đang chọn
const appliedGenders = ref<Gender[]>([]) // đã bấm Apply

const { getFilteredProducts, clearFilteredProducts } = useFilteredProducts()

// ✅ CẬP NHẬT - Filters với structure mới
const filters = ref<ProductFilter>({
  page: 0,
  size: 20,
  q: '',
  status: 'ACTIVE',
  minPrice: null,
  maxPrice: null,
  inStock: true,
  brandIds: [],
  categoryIds: [],
  colorIds: [], // ✅ THÊM MỚI
  sizes: [],
  sortBy: 'createdAt',
  sortDirection: 'desc',
})

// ✅ THÊM MỚI - Sort handling
const selectedSort = ref('createdAt-desc')

// ========== AI SEARCH STATES - GIỮ NGUYÊN ==========
const aiSearchQuery = ref<string>('')
const isAiSearching = ref<boolean>(false)
const aiSearchResults = ref<ResultItem[]>([])
const aiSearchMode = ref<string>('')
const aiLastSearchQuery = ref<string>('')
const isShowingAiResults = ref<boolean>(false)
const aiSuggestions = ref<string[]>([])

const uploadedImagePreview = ref<string | null>(null)

// AI Search mapping để lưu score và text theo product ID
const aiProductScores = ref<Record<string, number>>({})
const aiProductTexts = ref<Record<string, string>>({})
const aiProductStocks = ref<Record<string, number>>({})
const aiProductStatuses = ref<Record<string, string>>({})

// AI Search Examples
const aiSearchExamples = ref<string[]>([
  'Giày chạy bộ giảm chấn êm chân',
  'Sneakers Nike Air Force màu đen cho nam',
  'Giày leo núi cổ thấp nhẹ nhàng',
  'Giày thể thao thoáng khí cho tập gym',
  'Giày tennis độ bám tốt',
  'Giày bóng đá sân cỏ tự nhiên',
])

// ✅ CẬP NHẬT - fetchProducts với structure mới
const fetchProducts = async () => {
  try {
    // ✅ APPLY gender tại đây
    // appliedGenders.value = [...genderDraft.value]
    currentPage.value = 1 // ✅ RESET PAGE

    const res = await getAllProductsApi(filters.value)
    products.value = res.content ?? []
    console.log('✅ Products loaded:', products.value)
  } catch (err) {
    console.error('❌ Lỗi tải danh sách sản phẩm:', err)
  }
}

const applyFilters = () => {
  appliedGenders.value = [...genderDraft.value]
  currentPage.value = 1
  fetchProducts()
}

// ✅ CẬP NHẬT - fetchFilters thêm colors
const fetchFilters = async () => {
  try {
    const [brandRes, catRes, colorRes] = await Promise.all([
      getAllBrandsApi(),
      getAllCategoriesApi(),
      getAllColorsApi(),
    ])
    brands.value = brandRes || []
    categories.value = catRes || []
    colors.value = colorRes.data ?? colorRes
  } catch (err) {
    console.error('❌ Lỗi tải bộ lọc:', err)
  }
}

// ✅ CẬP NHẬT - resetFilters
const resetFilters = () => {
  filters.value.brandIds = []
  filters.value.categoryIds = []
  filters.value.colorIds = []
  filters.value.minPrice = null
  filters.value.maxPrice = null
  selectedSort.value = 'createdAt-desc'
  genderDraft.value = []
  appliedGenders.value = []

  clearAiSearchData() // ✅ Clear AI data nếu có
  fetchProducts()
}

// ✅ THÊM MỚI - handleSortChange
const handleSortChange = () => {
  const [sortBy, sortDirection] = selectedSort.value.split('-')
  filters.value.sortBy = sortBy
  filters.value.sortDirection = sortDirection

  // Nếu sort theo price thì sắp xếp ngay trên frontend
  if (sortBy === 'price') {
    products.value.sort((a, b) => {
      const priceA = getProductMinPrice(a)
      const priceB = getProductMinPrice(b)
      return sortDirection === 'asc' ? priceA - priceB : priceB - priceA
    })
  } else {
    // Nếu sort theo createdAt, gọi backend
    fetchProducts()
  }
}

// ✅ CẬP NHẬT - getMainImage với logic mới
// const getMainImage = (product: Product) => {
//   const variants = product.variants || []

//   if (variants.length === 0) {
//     return 'https://via.placeholder.com/200x200?text=No+Image'
//   }

//   // 1. Tìm variant có ID nhỏ nhất
//   const smallestVariant = [...variants].sort((a, b) => a.id.localeCompare(b.id))[0]

//   // 2. Tìm ảnh isMain trong variant nhỏ nhất
//   let selectedImage =
//     smallestVariant.images?.find((img: any) => img.isMain) || smallestVariant.images?.[0] || null

//   // 3. Nếu variant nhỏ nhất không có ảnh → lấy ảnh từ variant khác
//   if (!selectedImage) {
//     const variantWithImage = variants.find((v) => v.images && v.images.length > 0)
//     if (variantWithImage) {
//       selectedImage =
//         variantWithImage.images.find((img: any) => img.isMain) || variantWithImage.images[0]
//     }
//   }

//   // 4. Nếu không có ảnh nào trong toàn bộ sản phẩm → trả placeholder
//   if (!selectedImage?.url) {
//     return 'https://via.placeholder.com/200x200?text=No+Image'
//   }

//   return selectedImage.url
// }
const getMainImage = (product: Product) => {
  const variants = product.variants || []

  if (variants.length === 0) {
    return 'https://via.placeholder.com/200x200?text=No+Image'
  }

  // 1️⃣ Tìm bất kỳ ảnh nào có isMain = true trên toàn bộ biến thể
  let mainImage = null

  for (const variant of variants) {
    if (!variant.images) continue
    const img = variant.images.find((i) => i.isMain)
    if (img) {
      mainImage = img
      break
    }
  }

  // 2️⃣ Nếu không có ảnh nào isMain, lấy ảnh đầu tiên có tồn tại
  if (!mainImage) {
    const variantWithImage = variants.find((v) => v.images && v.images.length > 0)
    if (variantWithImage) {
      mainImage = variantWithImage.images[0]
    }
  }

  // 3️⃣ Nếu vẫn không có → trả placeholder
  if (!mainImage?.url) {
    return 'https://via.placeholder.com/200x200?text=No+Image'
  }

  // 4️⃣ Convert link Google Drive
  const url = mainImage.url
  const match = url.match(/\/d\/([^/]+)/)

  return match ? `http://localhost:8080/api/v1/images/${match[1]}` : url
}
// ✅ THÊM MỚI - getDirectImageUrl
function getDirectImageUrl(driveUrl: string) {
  const match = driveUrl?.match(/\/d\/([^/]+)/)
  if (!match) return driveUrl

  const driveId = match[1]
  return `http://localhost:8080/api/v1/images/${driveId}`
}

// ✅ THÊM MỚI - getProductMinPrice
// const getProductMinPrice = (product: Product) => {
//   const variants = product.variants || []
//   if (!variants.length) return 0
//   return Math.min(...variants.map((v) => v.priceSale || Infinity))
// }
const getProductMinPrice = (product: Product) => {
  const variants = product.variants || []
  if (!variants.length) return 0

  return Math.min(
    ...variants.map((v) =>
      v.priceSale && v.priceSale > 0 && v.priceSale < v.price
        ? v.priceSale
        : v.price,
    ),
  )
}
const getProductOriginalPrice = (product: Product) => {
  const variants = product.variants || []
  if (!variants.length) return 0

  return Math.max(...variants.map((v) => v.price || 0))
}


// ✅ THÊM MỚI - getStatusLabel cho AI results
const getStatusLabel = (status: string) => {
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
// import API bạn đã có

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || !target.files[0]) return

  const file = target.files[0]
  // 👉 Tạo preview ảnh
  uploadedImagePreview.value = URL.createObjectURL(file)
  try {
    isImageSearching.value = true
    console.log('📸 Searching products by image:', file.name)

    const response = await searchProductsByImageApi(file)

    // Giả sử API trả về mảng Product[]
    products.value = response?.data || response
    currentPage.value = 1

    // Lưu vào sessionStorage nếu cần redirect từ trang khác
    // sessionStorage.setItem('imageSearchResults', JSON.stringify(products.value))

    console.log('✅ Products found by image:', products.value)
  } catch (err) {
    console.error('❌ Image search error:', err)
    alert('Tìm kiếm bằng hình ảnh thất bại. Vui lòng thử lại!')
  } finally {
    isImageSearching.value = false
  }
}

const fetchReviewSummary = async (productId: string) => {
  // cache rồi thì thôi
  if (reviewCache.value[productId]) return

  try {
    const res = await getReviewsByProduct(productId, {
      page: 0,
      size: 1, // 🔥 chỉ cần meta
    })

    const reviews = res.content || []
    const total = res.totalElements || 0

    const avg =
      total > 0
        ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        : 0

    reviewCache.value[productId] = {
      averageRating: Number(avg.toFixed(1)),
      totalReviews: total,
    }
  } catch (e) {
    console.warn('❌ Fetch review failed:', productId)
    reviewCache.value[productId] = {
      averageRating: 0,
      totalReviews: 0,
    }
  }
}


// ========== AI SEARCH METHODS - GIỮ NGUYÊN ==========
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
      threshold: 0.4,
      max_candidates: 8,
      rerank: true,
    }

    const response = await searchProductsWithAiApi(aiSearchRequest)
    console.log('✅ AI search response:', response)

    aiSearchResults.value = response.results || []
    aiSearchMode.value = response.mode || 'unknown'
    aiLastSearchQuery.value = query
    isShowingAiResults.value = true
    aiSuggestions.value = response.suggestions || []

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

const runExample = (example: string) => {
  aiSearchQuery.value = example
  handleAiSearch()
}

const runSuggestion = (suggestion: string): void => {
  aiSearchQuery.value = suggestion
  handleAiSearch()
}

const fetchAiResultProducts = async (): Promise<void> => {
  try {
    console.log('🔍 Fetching detailed products for AI results...')

    aiProductScores.value = {}
    aiProductTexts.value = {}
    aiProductStocks.value = {}
    aiProductStatuses.value = {}

    const productPromises = aiSearchResults.value.map(async (result) => {
      try {
        const product = await getProductByIdApi(result.product_id)

        aiProductScores.value[result.product_id] = result.score
        aiProductTexts.value[result.product_id] = result.text
        aiProductStocks.value[result.product_id] = result.stock || 0
        aiProductStatuses.value[result.product_id] = result.status || 'UNKNOWN'

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

    fetchedProducts.sort((a, b) => {
      const scoreA = aiProductScores.value[a.id] || 0
      const scoreB = aiProductScores.value[b.id] || 0
      return scoreB - scoreA
    })

    products.value = fetchedProducts
    currentPage.value = 1

    console.log('✅ AI search products loaded:', {
      totalResults: aiSearchResults.value.length,
      productsFound: fetchedProducts.length,
      mode: aiSearchMode.value,
      suggestionsCount: aiSuggestions.value.length,
    })
  } catch (error) {
    console.error('❌ Error fetching AI result products:', error)
    products.value = []
  }
}

const clearAiSearch = (): void => {
  clearAiSearchData()
  fetchProducts()
}

const clearAiSearchData = (): void => {
  aiSearchQuery.value = ''
  aiSearchResults.value = []
  aiSearchMode.value = ''
  aiLastSearchQuery.value = ''
  isShowingAiResults.value = false
  aiSuggestions.value = []
  aiProductScores.value = {}
  aiProductTexts.value = {}
  aiProductStocks.value = {}
  aiProductStatuses.value = {}
  uploadedImagePreview.value = null
}

// ✅ Utility functions - GIỮ NGUYÊN
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

// Kiểm tra sản phẩm có đang khuyến mãi hay không
// const hasDiscount = (product: Product): boolean => {
//   const variants = product.variants || []
//   return variants.some((v) => (v.price || 0) > (v.priceSale || 0))
// }
const hasDiscount = (product: Product): boolean => {
  const variants = product.variants || []

  return variants.some(
    (v) =>
      v.priceSale &&
      v.priceSale > 0 &&
      v.priceSale < v.price,
  )
}

type InferredGender = 'MALE' | 'FEMALE' | 'BOTH' | 'UNKNOWN'

const inferGenderFromProduct = (product: Product): InferredGender => {
  const variants = product.variants || []

  const sizes = variants
    .filter((v) => v.stock > 0)
    .map((v) => v.size)
    .filter(Boolean)

  if (!sizes.length) return 'UNKNOWN'

  const hasFemale = sizes.some((s) => s >= 35 && s <= 39)
  const hasMale = sizes.some((s) => s >= 40 && s <= 45)

  if (hasFemale && hasMale) return 'BOTH'
  if (hasFemale) return 'FEMALE'
  if (hasMale) return 'MALE'

  return 'UNKNOWN'
}

const filteredProducts = computed(() => {
  if (!appliedGenders.value.length) return products.value

  return products.value.filter((product) => {
    const gender = inferGenderFromProduct(product)

    return appliedGenders.value.some((g) =>
      g === 'FEMALE'
        ? gender === 'FEMALE' || gender === 'BOTH'
        : gender === 'MALE' || gender === 'BOTH',
    )
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / pageSize)
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredProducts.value.slice(start, end)
})

// Lấy nhãn status hiển thị
// const getProductTag = (product: Product): string => {
//   if (hasDiscount(product)) return 'Giảm giá sốc'

//   return ''
// }
const getProductTag = (product: Product): string => {
  const variants = product.variants || []
  let maxDiscount = 0

  variants.forEach((v) => {
    if (v.priceSale && v.priceSale < v.price) {
      const discount = Math.round(((v.price - v.priceSale) / v.price) * 100)
      if (discount > maxDiscount) maxDiscount = discount
    }
  })

  return maxDiscount > 0 ? `-${maxDiscount}%` : ''
}

// ✅ THÊM - States cho filter banner
const showFilterFromHome = ref(false)
const filterBannerTitle = ref('')
const filterBannerDescription = ref('')

// ✅ THÊM - Show filter banner
const showFilterBanner = (filterType: string) => {
  const bannerConfig: Record<string, { title: string; description: string }> = {
    'new-collection': {
      title: '🚀 Sản phẩm mới nhất',
      description: 'Hiển thị những đôi giày vừa ra mắt, cập nhật theo thời gian',
    },
    sale: {
      title: '🎉 Sản phẩm đang SALE',
      description: 'Chỉ hiển thị sản phẩm có giá khuyến mãi, tiết kiệm tối đa',
    },
    premium: {
      title: '💎 Sản phẩm cao cấp',
      description: 'Những đôi giày chất lượng premium từ 2 triệu đồng',
    },
  }

  const config = bannerConfig[filterType]
  if (config) {
    filterBannerTitle.value = config.title
    filterBannerDescription.value = config.description
    showFilterFromHome.value = true
  }
}

// ✅ THÊM - Clear home filter
const clearHomeFilter = async () => {
  showFilterFromHome.value = false
  filterBannerTitle.value = ''
  filterBannerDescription.value = ''

  // Reset và fetch tất cả sản phẩm
  await fetchProducts()
}

// ✅ CẬP NHẬT - onMounted với logic mới
onMounted(async () => {
  await fetchFilters()

  // ✅ THÊM - Check xem có dữ liệu từ Home không
  const filteredState = getFilteredProducts()

  if (filteredState.isFromHome && filteredState.products.length > 0) {
    console.log(
      `🎯 Using filtered products from Home (${filteredState.filterType}):`,
      filteredState.products.length,
    )

    // Set products từ Home
    products.value = filteredState.products

    // Show notification
    showFilterBanner(filteredState.filterType)

    // Clear state để lần sau không bị conflict
    clearFilteredProducts()

    return // Không fetch lại nữa
  }

  if (route.query.brandId) {
    filters.value.brandIds = Array.isArray(route.query.brandId)
      ? route.query.brandId
      : [route.query.brandId]
  }

  // CATEGORY
  if (route.query.categoryId) {
    filters.value.categoryIds = Array.isArray(route.query.categoryId)
      ? route.query.categoryId
      : [route.query.categoryId]
  }

  // GENDER (frontend only)
  if (route.query.gender) {
    const gender = route.query.gender as Gender
    if (gender === 'MALE' || gender === 'FEMALE') {
      genderDraft.value = [gender]
      appliedGenders.value = [gender]
    }
  }

  // ⭐ Còn lại → fetch bình thường
  await fetchProducts()
})
watch(
  () => filters.value.q,
  () => {
    debounceSearch()
  },
)

watch(
  () => route.query,
  async () => {
    // BRAND
    if (route.query.brandId) {
      filters.value.brandIds = Array.isArray(route.query.brandId)
        ? route.query.brandId
        : [route.query.brandId]
    } else {
      filters.value.brandIds = []
    }

    // CATEGORY
    if (route.query.categoryId) {
      filters.value.categoryIds = Array.isArray(route.query.categoryId)
        ? route.query.categoryId
        : [route.query.categoryId]
    } else {
      filters.value.categoryIds = []
    }

    // GENDER (frontend only)
    if (route.query.gender) {
      const gender = route.query.gender as Gender
      if (gender === 'MALE' || gender === 'FEMALE') {
        genderDraft.value = [gender]
        appliedGenders.value = [gender]
      }
    } else {
      genderDraft.value = []
      appliedGenders.value = []
    }

    currentPage.value = 1
    await fetchProducts()
  },
  { deep: true },
)
watch(
  () => paginatedProducts.value,
  (products) => {
    products.forEach((p) => {
      fetchReviewSummary(p.id)
    })
  },
  { immediate: true },
)


let debounceTimer: any = null

const debounceSearch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    fetchProducts()
  }, 300)
}
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

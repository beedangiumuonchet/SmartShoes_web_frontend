<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden"
  >
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl animate-pulse"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-400/20 blur-3xl animate-pulse delay-1000"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-400/10 to-purple-400/10 blur-3xl animate-spin-slow"
      ></div>
    </div>

    <div class="relative z-10 py-4">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- ✅ Compact Breadcrumb - Same as MyOrder -->
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
              <router-link
                to="/orders"
                class="text-gray-500 hover:text-rose-500 transition-colors font-medium text-sm"
              >
                Đơn hàng
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
              <span class="text-gray-900 font-semibold text-sm">
                {{ isEditMode ? 'Chỉnh sửa đánh giá' : 'Viết đánh giá' }}
              </span>
            </li>
          </ol>
        </nav>

        <!-- ✅ Compact Header - Same style as MyOrder -->
        <div class="mb-6">
          <div class="flex items-center justify-between">
            <div>
              <h1
                class="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent"
              >
                {{ isEditMode ? 'Chỉnh sửa đánh giá' : 'Viết đánh giá sản phẩm' }}
              </h1>
              <p class="mt-1 text-base text-gray-600">
                {{
                  isEditMode
                    ? 'Cập nhật trải nghiệm và đánh giá của bạn về sản phẩm'
                    : 'Chia sẻ trải nghiệm thực tế và giúp khách hàng khác có lựa chọn tốt hơn'
                }}
              </p>
            </div>
            <button
              @click="goBack"
              class="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 text-sm"
            >
              <svg
                class="w-4 h-4 mr-1 inline"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                ></path>
              </svg>
              Quay lại
            </button>
          </div>
        </div>

        <!-- ✅ Compact Loading State -->
        <div v-if="loading" class="text-center py-16">
          <div class="relative">
            <div class="w-16 h-16 mx-auto mb-4">
              <div class="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
              <div
                class="absolute inset-0 border-4 border-purple-500 rounded-full animate-spin border-t-transparent"
              ></div>
            </div>
            <p class="text-gray-600 text-lg font-medium">
              {{ isEditMode ? 'Đang tải thông tin đánh giá...' : 'Đang tải thông tin sản phẩm...' }}
            </p>
          </div>
        </div>

        <!-- ✅ Compact Error State -->
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
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h3>
          <p class="text-gray-600 mb-4 text-sm">{{ error }}</p>
          <button
            @click="loadData"
            class="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors font-medium text-sm"
          >
            Thử lại
          </button>
        </div>

        <!-- ✅ Compact Main Content -->
        <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <!-- Left Column: Compact Product Card -->
          <div class="lg:col-span-2">
            <div
              class="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/40 p-6 sticky top-6 overflow-hidden"
            >
              <div
                class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-100/50 to-transparent rounded-full -translate-y-12 translate-x-12"
              ></div>

              <div class="relative">
                <div class="flex items-center mb-4">
                  <div
                    class="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-2"
                  >
                    <svg
                      class="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      ></path>
                    </svg>
                  </div>
                  <h2 class="text-lg font-bold text-gray-900">Thông tin sản phẩm</h2>
                </div>

                <!-- Compact Product Image -->
                <div class="relative group mb-6">
                  <!-- Image wrapper -->
                  <div
                    class="w-32 h-32 sm:w-36 sm:h-36 rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm group-hover:shadow-md transition-all duration-300 cursor-pointer"
                    @click="goToProductDetail(product.id)"
                  >
                    <img
                      :src="getProductImage(product.id)"
                      :alt="product.name"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    <!-- Overlay hover -->
                    <div
                      class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-xl"
                    ></div>
                  </div>
                </div>

                <!-- Compact Product Details -->
                <div class="space-y-3">
                  <div>
                    <h3 class="text-lg font-bold text-gray-900 leading-tight line-clamp-2 mb-2">
                      {{ product.name }}
                    </h3>
                  </div>

                  <div class="space-y-2">
                    <!-- Brand -->
                    <div
                      class="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100"
                    >
                      <div class="flex items-center">
                        <div
                          class="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md flex items-center justify-center mr-2"
                        >
                          <span class="text-white text-xs font-bold">B</span>
                        </div>
                        <span class="text-sm font-medium text-gray-600">Thương hiệu</span>
                      </div>
                      <span class="font-semibold text-indigo-600 text-sm">{{
                        product.brand?.name || 'SmartShoes'
                      }}</span>
                    </div>

                    <!-- Category -->
                    <div
                      class="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100"
                    >
                      <div class="flex items-center">
                        <div
                          class="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-md flex items-center justify-center mr-2"
                        >
                          <svg
                            class="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            ></path>
                          </svg>
                        </div>
                        <span class="text-sm font-medium text-gray-600">Danh mục</span>
                      </div>
                      <span class="font-semibold text-purple-600 text-sm">{{
                        product.category?.name || 'Giày thể thao'
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Compact Review Form -->
          <div class="lg:col-span-3">
            <div
              class="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/40 p-6 overflow-hidden"
            >
              <div
                class="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-100/50 to-transparent rounded-full -translate-y-12 -translate-x-12"
              ></div>

              <form @submit.prevent="submitReview" class="relative space-y-6">
                <!-- Compact Rating Section -->
                <div>
                  <div class="flex items-center mb-4">
                    <div
                      class="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-3"
                    >
                      <svg
                        class="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <label class="text-lg font-bold text-gray-900 block">
                        Đánh giá tổng thể
                        <span class="text-red-500">*</span>
                      </label>
                      <p class="text-sm text-gray-600 mt-1">
                        Bạn cảm thấy sản phẩm này như thế nào?
                      </p>
                    </div>
                  </div>

                  <!-- Compact Star Rating -->
                  <div
                    class="bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 rounded-xl p-4 border border-yellow-200/50"
                  >
                    <div class="flex flex-col items-center space-y-3">
                      <!-- Stars -->
                      <div class="flex items-center space-x-1">
                        <button
                          v-for="star in 5"
                          :key="star"
                          type="button"
                          @click="setRating(star)"
                          @mouseenter="hoverRating = star"
                          @mouseleave="hoverRating = 0"
                          class="group relative transform transition-all duration-300 hover:scale-110 focus:outline-none"
                          :class="{
                            'text-yellow-400 hover:text-yellow-500':
                              star <= (hoverRating || reviewForm.rating),
                            'text-gray-300 hover:text-gray-400':
                              star > (hoverRating || reviewForm.rating),
                          }"
                        >
                          <svg
                            class="w-10 h-10 drop-shadow-md"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                            />
                          </svg>
                          <div
                            class="absolute inset-0 rounded-full bg-yellow-300/20 scale-0 group-hover:scale-125 transition-transform duration-300"
                          ></div>
                        </button>
                      </div>

                      <!-- Rating Text & Description -->
                      <div class="text-center">
                        <div class="text-xl font-bold text-gray-900 mb-1">
                          {{ getRatingText(hoverRating || reviewForm.rating) }}
                        </div>
                        <div class="flex items-center justify-center space-x-2 mb-2">
                          <div class="flex">
                            <span v-for="n in 5" :key="n" class="text-sm">
                              {{ n <= (hoverRating || reviewForm.rating) ? '★' : '☆' }}
                            </span>
                          </div>
                          <span class="text-sm text-gray-600 font-medium">
                            ({{ hoverRating || reviewForm.rating }}/5 sao)
                          </span>
                        </div>
                        <p class="text-sm text-gray-600 bg-white/70 rounded-lg px-3 py-2">
                          {{ getRatingDescription(hoverRating || reviewForm.rating) }}
                        </p>
                      </div>
                    </div>

                    <!-- Error Message -->
                    <div
                      v-if="errors.rating"
                      class="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <p class="text-sm text-red-600 flex items-center">
                        <svg
                          class="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        {{ errors.rating }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Compact Comment Section -->
                <div>
                  <div class="flex items-center mb-4">
                    <div
                      class="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3"
                    >
                      <svg
                        class="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <label for="comment" class="text-lg font-bold text-gray-900 block">
                        Nhận xét chi tiết
                        <span class="text-red-500">*</span>
                      </label>
                      <p class="text-sm text-gray-600 mt-1">Chia sẻ trải nghiệm thực tế của bạn</p>
                    </div>
                  </div>

                  <div class="relative">
                    <textarea
                      id="comment"
                      v-model="reviewForm.comment"
                      rows="6"
                      :maxlength="maxCommentLength"
                      placeholder="Hãy chia sẻ chi tiết về trải nghiệm của bạn:&#10;• Chất lượng sản phẩm như thế nào?&#10;• Cảm giác khi sử dụng ra sao?&#10;• Có phù hợp với mong đợi không?&#10;• Ưu điểm và nhược điểm?&#10;• Có giới thiệu cho người khác không?..."
                      class="w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/90 backdrop-blur-sm shadow-inner"
                      :class="{
                        'border-gray-200 hover:border-indigo-300': !errors.comment,
                        'border-red-300 focus:ring-red-500/20 focus:border-red-500': errors.comment,
                      }"
                    ></textarea>

                    <!-- Character Count -->
                    <div class="absolute bottom-3 right-3 flex items-center space-x-2">
                      <div
                        class="bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm border"
                      >
                        <span
                          class="text-xs font-medium"
                          :class="{
                            'text-gray-500': reviewForm.comment.length < maxCommentLength * 0.8,
                            'text-yellow-600':
                              reviewForm.comment.length >= maxCommentLength * 0.8 &&
                              reviewForm.comment.length < maxCommentLength,
                            'text-red-600': reviewForm.comment.length >= maxCommentLength,
                          }"
                        >
                          {{ reviewForm.comment.length }}/{{ maxCommentLength }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Compact Guidelines -->
                  <div
                    class="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50"
                  >
                    <div class="flex items-start space-x-2">
                      <div
                        class="w-5 h-5 bg-blue-500 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                      >
                        <svg
                          class="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <h4 class="font-semibold text-blue-900 mb-1 text-sm">
                          💡 Mẹo viết đánh giá hữu ích:
                        </h4>
                        <div class="grid grid-cols-2 gap-1 text-xs text-blue-800">
                          <div class="flex items-center">
                            <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></span>
                            Chất lượng & độ bền
                          </div>
                          <div class="flex items-center">
                            <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></span>
                            Cảm giác sử dụng
                          </div>
                          <div class="flex items-center">
                            <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></span>
                            So sánh mong đợi
                          </div>
                          <div class="flex items-center">
                            <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></span>
                            Ưu & nhược điểm
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Error Message -->
                  <div
                    v-if="errors.comment"
                    class="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <p class="text-sm text-red-600 flex items-center">
                      <svg
                        class="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      {{ errors.comment }}
                    </p>
                  </div>
                </div>

                <!-- Compact Submit Buttons -->
                <div class="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    :disabled="submitting"
                    class="flex-1 group relative px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold rounded-xl transition-all duration-500 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed overflow-hidden"
                  >
                    <!-- Button background animation -->
                    <div
                      class="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    ></div>

                    <!-- Button content -->
                    <div class="relative flex items-center justify-center">
                      <div v-if="submitting" class="flex items-center">
                        <svg
                          class="w-5 h-5 animate-spin mr-2"
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
                        {{ isEditMode ? 'Đang cập nhật...' : 'Đang gửi đánh giá...' }}
                      </div>
                      <div v-else class="flex items-center">
                        <svg
                          class="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          ></path>
                        </svg>
                        {{ isEditMode ? 'Cập nhật đánh giá' : 'Gửi đánh giá' }}
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    @click="goBack"
                    class="px-6 py-3 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Hủy bỏ
                  </button>
                </div>
              </form>

              <!-- Compact Delete Section (Edit Mode Only) -->
              <div v-if="isEditMode && existingReview" class="mt-6 pt-6 border-t border-gray-200">
                <div
                  class="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-xl p-4"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <div
                        class="w-10 h-10 bg-gradient-to-r from-red-500 to-rose-600 rounded-lg flex items-center justify-center mr-3"
                      >
                        <svg
                          class="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <h4 class="font-bold text-red-900">Xóa đánh giá</h4>
                        <p class="text-red-700 text-sm">Hành động này không thể hoàn tác</p>
                      </div>
                    </div>
                    <button
                      @click="showDeleteDialog = true"
                      :disabled="submitting"
                      class="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none text-sm"
                    >
                      Xóa đánh giá
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Compact Delete Confirmation Dialog -->
    <div
      v-if="showDeleteDialog"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200"
      >
        <div class="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-4">
          <div class="flex items-center text-white">
            <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                ></path>
              </svg>
            </div>
            <h3 class="text-lg font-bold">Xác nhận xóa đánh giá</h3>
          </div>
        </div>

        <div class="px-6 py-4">
          <p class="text-gray-600 mb-4 leading-relaxed text-sm">
            Bạn có chắc chắn muốn <strong class="text-red-600">xóa vĩnh viễn</strong> đánh giá này
            không? Hành động này <strong>không thể hoàn tác</strong> và sẽ mất tất cả nội dung bạn
            đã viết.
          </p>

          <div class="flex gap-3">
            <button
              @click="deleteReview"
              :disabled="deleting"
              class="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none text-sm"
            >
              {{ deleting ? 'Đang xóa...' : 'Xác nhận xóa' }}
            </button>
            <button
              @click="showDeleteDialog = false"
              class="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 font-semibold rounded-lg transition-all duration-300 text-sm"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Compact Success Toast -->
    <Transition name="toast" appear>
      <div
        v-if="showSuccessToast"
        class="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white px-6 py-4 rounded-xl shadow-2xl z-50 max-w-md border border-green-400/30"
      >
        <div class="flex items-center space-x-3">
          <div
            class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <div>
            <div class="font-bold">Thành công!</div>
            <div class="text-green-100 text-sm">{{ successMessage }}</div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Compact Error Toast -->
    <Transition name="toast" appear>
      <div
        v-if="showErrorToast"
        class="fixed bottom-6 right-6 bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 text-white px-6 py-4 rounded-xl shadow-2xl z-50 max-w-md border border-red-400/30"
      >
        <div class="flex items-center space-x-3">
          <div
            class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>
          <div>
            <div class="font-bold">Lỗi!</div>
            <div class="text-red-100 text-sm">{{ errorMessage }}</div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  createReview,
  getReview,
  updateReview,
  deleteReview as deleteReviewAPI,
} from './reviews.api'
import {
  CreateReviewRequest,
  UpdateReviewRequest,
  type Review,
  RATING_LEVELS,
  getRatingText,
} from './reviews.type'
import { getProductByIdApi } from '@/modules/products/product.api'
import type { Product } from '@/modules/products/product.type'
import { getCurrentUser } from '@/common/guards/roleGuard.guard'

const route = useRoute()
const router = useRouter()

// ================================
// STATE MANAGEMENT
// ================================
const loading = ref(true)
const submitting = ref(false)
const deleting = ref(false)
const showDeleteDialog = ref(false)
const showSuccessToast = ref(false)
const showErrorToast = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const error = ref('')
const productCache = ref<Map<string, Product>>(new Map())

// Data
const product = ref<Product | null>(null)
const existingReview = ref<Review | null>(null)
const hoverRating = ref(0)

// Form
const reviewForm = reactive({
  rating: 5,
  comment: '',
})

// Validation
const errors = reactive({
  rating: '',
  comment: '',
})

// Constants
const maxCommentLength = 500

// ================================
// COMPUTED PROPERTIES
// ================================
const currentUser = computed(() => getCurrentUser())

const isEditMode = computed(() => {
  return !!route.query.reviewId
})

const productImage = computed(() => {
  if (product.value?.images?.length > 0) {
    // Tìm main image trước
    const mainImage = product.value.images.find((img) => img.isMain)
    if (mainImage?.url) return mainImage.url

    // Nếu không có main, lấy ảnh đầu tiên
    return product.value.images[0]?.url || ''
  }
  return 'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=SmartShoes'
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

const getRatingDescription = (rating: number): string => {
  const descriptions = {
    1: 'Rất không hài lòng với sản phẩm',
    2: 'Sản phẩm có nhiều vấn đề cần cải thiện',
    3: 'Sản phẩm ở mức chấp nhận được',
    4: 'Sản phẩm tốt, đáng mua',
    5: 'Sản phẩm xuất sắc, rất hài lòng',
  }
  return descriptions[rating as keyof typeof descriptions] || ''
}

// ================================
// FORM METHODS
// ================================
const setRating = (rating: number) => {
  reviewForm.rating = rating
  errors.rating = ''
}

const validateForm = (): boolean => {
  let isValid = true

  // Reset errors
  errors.rating = ''
  errors.comment = ''

  // Validate rating
  if (!reviewForm.rating || reviewForm.rating < 1 || reviewForm.rating > 5) {
    errors.rating = 'Vui lòng chọn số sao đánh giá'
    isValid = false
  }

  // Validate comment
  if (!reviewForm.comment.trim()) {
    errors.comment = 'Vui lòng nhập nhận xét về sản phẩm'
    isValid = false
  } else if (reviewForm.comment.trim().length < 10) {
    errors.comment = 'Nhận xét phải có ít nhất 10 ký tự'
    isValid = false
  } else if (reviewForm.comment.length > maxCommentLength) {
    errors.comment = `Nhận xét không được vượt quá ${maxCommentLength} ký tự`
    isValid = false
  }

  return isValid
}

// ================================
// API METHODS
// ================================
const loadData = async () => {
  const productId = route.params.productId as string
  const reviewId = route.query.reviewId as string

  if (!productId) {
    error.value = 'Không tìm thấy mã sản phẩm'
    loading.value = false
    return
  }

  try {
    loading.value = true
    error.value = ''

    console.log('🔄 Loading product and review data...')
    console.log('Product ID:', productId)
    console.log('Review ID:', reviewId || 'None (Create mode)')

    // Load product info
    const productData = await getProductByIdApi(productId)
    product.value = productData
    // ✅ THÊM - Lưu product vào cache để dùng cho getProductImage
    productCache.value.set(productData.id, productData)
    console.log('✅ Cached main product for image display')

    // Load existing review if in edit mode
    if (reviewId && isEditMode.value) {
      try {
        const reviewData = await getReview(reviewId)
        existingReview.value = reviewData

        // Pre-fill form with existing review data
        reviewForm.rating = reviewData.rating
        reviewForm.comment = reviewData.comment

        console.log('✅ Loaded existing review for editing:', reviewData)

        // ✅ THÊM - Load product của review vào cache nếu khác với main product
        if (reviewData.productId !== productData.id) {
          await loadProductsToCache([reviewData])
        }
      } catch (reviewError) {
        console.error('❌ Error loading existing review:', reviewError)
        showError('Không thể tải thông tin đánh giá cần chỉnh sửa')
      }
    }

    console.log('✅ Data loaded successfully')
  } catch (err) {
    console.error('❌ Error loading data:', err)
    error.value = 'Không thể tải thông tin. Vui lòng thử lại.'
  } finally {
    loading.value = false
  }
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
const goToProductDetail = (productId: string) => {
  router.push(`/products/id/${productId}`)
}
// ✅ SỬA - getProductImage dùng getMainImage từ product đầy đủ
const getProductImage = (productId: string) => {
  console.log('🖼️ Getting product image for productId:', productId)

  // 1️⃣ Lấy product từ cache bằng productId
  const cachedProduct = productCache.value.get(productId)

  if (cachedProduct) {
    console.log('✅ Found cached product:', {
      id: cachedProduct.id,
      name: cachedProduct.name,
      variantsCount: cachedProduct.variants?.length || 0,
    })

    // 2️⃣ Kiểm tra xem product có variants đầy đủ không
    if (cachedProduct.variants && cachedProduct.variants.length > 0) {
      // Sử dụng getMainImage để lấy ảnh từ product (tìm variant có ảnh đầu tiên)
      const productImageUrl = getMainImage(cachedProduct)

      console.log('🎯 Main image URL from variants:', productImageUrl)

      // Convert Google Drive URL thành localhost URL
      if (
        productImageUrl &&
        productImageUrl !== 'https://via.placeholder.com/200x200?text=No+Image'
      ) {
        return getDirectImageUrl(productImageUrl)
      }

      return productImageUrl
    }
  }

  console.log('⚠️ Product not found in cache or no variants, using placeholder')

  // 3️⃣ Fallback nếu không có product trong cache hoặc chưa load đầy đủ
  return 'https://via.placeholder.com/150x150/f3f4f6/9ca3af?text=SmartShoes'
}
// ✅ THÊM MỚI - Load products vào cache để hiển thị ảnh
const loadProductsToCache = async (reviews: Review[]) => {
  console.log('🔄 Loading products to cache for image display...')

  // Lấy danh sách unique productIds từ reviews
  const productIds = [...new Set(reviews.map((review) => review.productId))]

  console.log('📝 Unique product IDs to load:', productIds)

  const loadPromises = productIds.map(async (productId) => {
    if (!productCache.value.has(productId)) {
      try {
        console.log(`🔍 Fetching product data for: ${productId}`)

        // Fetch product đầy đủ với variants để có ảnh
        const fullProduct = await getProductByIdApi(productId)

        // Lưu vào cache
        productCache.value.set(productId, fullProduct)

        console.log(`✅ Cached product: ${fullProduct.name}`, {
          id: fullProduct.id,
          variantsCount: fullProduct.variants?.length || 0,
          hasImages: fullProduct.variants?.some((v) => v.images?.length > 0) || false,
        })
      } catch (error) {
        console.error(`❌ Error loading product ${productId}:`, error)

        // Tạo product giả để avoid lỗi
        const placeholderProduct = {
          id: productId,
          name: `Sản phẩm #${productId.slice(-6)}`,
          variants: [],
        } as Product

        productCache.value.set(productId, placeholderProduct)
      }
    }
  })

  await Promise.all(loadPromises)
  console.log('✅ All products loaded to cache for image display')
}
const submitReview = async () => {
  if (!validateForm() || !product.value || !currentUser.value) return

  try {
    submitting.value = true

    if (isEditMode.value && existingReview.value) {
      // Update existing review
      console.log('✏️ Updating existing review...')
      const updateRequest = new UpdateReviewRequest(reviewForm.comment.trim(), reviewForm.rating)

      await updateReview(existingReview.value.id, updateRequest)
      showSuccess('Cập nhật đánh giá thành công!')
    } else {
      // Create new review
      console.log('🌟 Creating new review...')
      const createRequest = new CreateReviewRequest(
        product.value.id,
        reviewForm.comment.trim(),
        reviewForm.rating,
      )

      await createReview(createRequest)
      showSuccess('Gửi đánh giá thành công! Cảm ơn bạn đã chia sẻ.')
    }

    // Redirect back after success
    setTimeout(() => {
      goBack()
    }, 2000)
  } catch (err: any) {
    console.error('❌ Error submitting review:', err)
    const message = err?.message || 'Có lỗi xảy ra khi gửi đánh giá'
    showError(message)
  } finally {
    submitting.value = false
  }
}

const deleteReview = async () => {
  if (!existingReview.value) return

  try {
    deleting.value = true

    console.log('🗑️ Deleting review:', existingReview.value.id)
    await deleteReviewAPI(existingReview.value.id)

    showSuccess('Xóa đánh giá thành công!')
    showDeleteDialog.value = false

    // Redirect back after success
    setTimeout(() => {
      goBack()
    }, 2000)
  } catch (err: any) {
    console.error('❌ Error deleting review:', err)
    const message = err?.message || 'Có lỗi xảy ra khi xóa đánh giá'
    showError(message)
  } finally {
    deleting.value = false
  }
}

// ================================
// NAVIGATION METHODS
// ================================
const goBack = () => {
  router.go(-1)
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
// LIFECYCLE
// ================================
onMounted(() => {
  loadData()
})
</script>

<style scoped>
/* Enhanced Animations */
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}

.animate-reverse {
  animation-direction: reverse;
}

/* Toast Transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.toast-enter-from {
  transform: translateX(100%) scale(0.8);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%) scale(0.8);
  opacity: 0;
}

/* Enhanced Utilities */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Enhanced Backdrop Effects */
.backdrop-blur-md {
  backdrop-filter: blur(8px);
}

.backdrop-blur-xl {
  backdrop-filter: blur(24px);
}

/* Custom Shadows */
.shadow-2xl {
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}

/* Smooth Transitions for Everything */
* {
  transition-property:
    color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow,
    transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Enhanced Hover Effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

.hover\:scale-125:hover {
  transform: scale(1.25);
}

/* Focus Styles */
button:focus-visible,
textarea:focus-visible {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}

/* Custom Scrollbar */
textarea::-webkit-scrollbar {
  width: 8px;
}

textarea::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #6366f1, #8b5cf6);
  border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #4f46e5, #7c3aed);
}
</style>

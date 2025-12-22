<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section với Slide Banner -->
    <section
      class="relative h-96 md:h-[600px] overflow-hidden bg-gradient-to-r from-blue-900 to-purple-900"
    >
      <div class="absolute inset-0">
        <div
          class="flex transition-transform duration-700 ease-in-out h-full"
          :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
        >
          <div
            v-for="(slide, index) in heroSlides"
            :key="index"
            class="w-full h-full flex-shrink-0 relative"
          >
            <!-- Background Image with Overlay -->
            <div
              class="absolute inset-0 bg-cover bg-center bg-no-repeat"
              :style="{ backgroundImage: `url(${slide.image})` }"
            ></div>
            <div
              class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"
            ></div>

            <!-- Content -->
            <div class="relative z-10 h-full flex items-center">
              <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <!-- Text Content -->
                  <div class="text-white space-y-6">
                    <div
                      class="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium"
                    >
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
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      {{ slide.badge }}
                    </div>

                    <h1 class="text-4xl md:text-6xl font-bold leading-tight">
                      {{ slide.title }}
                    </h1>

                    <p class="text-lg md:text-xl text-gray-200 max-w-lg leading-relaxed">
                      {{ slide.description }}
                    </p>

                    <div class="flex flex-col sm:flex-row gap-4">
                      <button
                        @click="handleSlideAction(slide.action)"
                        :disabled="loadingProducts"
                        class="px-8 py-4 bg-white text-gray-900 rounded-lg font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span v-if="loadingProducts" class="flex items-center">
                          <svg class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
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
                          Đang tải...
                        </span>
                        <span v-else>{{ slide.buttonText }}</span>
                      </button>

                      <button
                        @click="handleShopNow"
                        class="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-200"
                      >
                        Xem bộ sưu tập
                      </button>
                    </div>
                  </div>

                  <!-- Product Showcase (Hidden on mobile) -->
                  <div class="hidden lg:block">
                    <div class="relative">
                      <img
                        :src="slide.productImage"
                        :alt="slide.title"
                        class="w-full h-96 object-contain drop-shadow-2xl transform rotate-12 hover:rotate-6 transition-transform duration-500"
                      />
                      <div
                        class="absolute -bottom-4 -right-4 bg-red-500 text-white px-6 py-3 rounded-full font-bold text-xl transform rotate-12"
                      >
                        {{ slide.discount }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Slide Navigation -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        <button
          v-for="(slide, index) in heroSlides"
          :key="index"
          @click="currentSlide = index"
          class="w-4 h-4 rounded-full transition-all duration-300"
          :class="currentSlide === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'"
        />
      </div>

      <!-- Navigation Arrows -->
      <button
        @click="previousSlide"
        class="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-200"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        @click="nextSlide"
        class="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-200"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>

    <!-- Categories Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 mb-6">Danh mục sản phẩm</h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Khám phá bộ sưu tập đa dạng từ thể thao đến thời trang, phù hợp với mọi phong cách
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="category in displayCategories"
          :key="category.id"
          @click="handleCategoryClick(category)"
          class="group cursor-pointer"
        >
          <div
            class="relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <!-- Category Image -->
            <div class="aspect-w-1 aspect-h-1 relative overflow-hidden">
              <img
                :src="getDirectImageUrl(category.url) || getCategoryDefaultImage(category.name)"
                :alt="category.name"
                class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              ></div>
            </div>

            <!-- Category Info -->
            <div class="p-6 text-center">
              <h3
                class="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors"
              >
                {{ category.name }}
              </h3>
              <div
                class="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Brands Section -->
    <section class="bg-gray-100 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-6">Thương hiệu đối tác</h2>
          <p class="text-xl text-gray-600">Hợp tác cùng những thương hiệu hàng đầu thế giới</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          <div
            v-for="brand in displayBrands"
            :key="brand.id"
            @click="handleBrandClick(brand)"
            class="group cursor-pointer"
          >
            <div
              class="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-xl transform hover:scale-105 transition-all duration-300 h-32 flex flex-col items-center justify-center"
            >
              <!-- Brand Logo -->
              <div class="w-16 h-16 mb-3 flex items-center justify-center">
                <img
                  :src="getDirectImageUrl(brand.url) || getBrandDefaultLogo(brand.name)"
                  :alt="brand.name"
                  class="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>

              <!-- Brand Name -->
              <span
                class="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors text-center"
              >
                {{ brand.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ✅ THÊM - Filter Notification -->
    <div
      v-if="showNotification"
      class="fixed top-20 right-4 z-50 bg-white border-l-4 border-blue-500 rounded-lg shadow-lg p-4 max-w-sm transform transition-all duration-300"
      :class="showNotification ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'"
    >
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0">
          <svg
            v-if="!filterNotification.includes('❌')"
            class="w-5 h-5 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <svg
            v-else
            class="w-5 h-5 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p class="text-sm font-medium text-gray-900">{{ filterNotification }}</p>
        <button
          @click="showNotification = false"
          class="ml-auto flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
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

    <!-- Featured Products Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 featured-products-section">
      <div class="flex justify-between items-center mb-16">
        <div>
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Sản phẩm nổi bật</h2>
          <p class="text-xl text-gray-600">Những đôi giày được yêu thích và đánh giá cao nhất</p>
        </div>

        <div class="hidden md:flex items-center space-x-4">
          <!-- ✅ THÊM - Reset Button -->
          <button
            @click="resetToDefaultProducts"
            class="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Mặc định
          </button>

          <!-- View All Button -->
          <button
            @click="handleViewAll"
            class="flex items-center px-8 py-3 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Xem tất cả
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loadingProducts" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="n in 8" :key="n" class="animate-pulse">
          <div class="bg-gray-300 rounded-2xl h-80"></div>
          <div class="mt-4 space-y-2">
            <div class="bg-gray-300 rounded h-4"></div>
            <div class="bg-gray-300 rounded h-4 w-3/4"></div>
          </div>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="product in featuredProducts"
          :key="product.id"
          class="group cursor-pointer"
          @click="handleProductClick(product)"
        >
          <div
            class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <!-- Product Image -->
            <div class="relative aspect-w-1 aspect-h-1 overflow-hidden">
              <img
                :src="product.mainImage || '/api/placeholder/400/400'"
                :alt="product.name"
                class="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
              />

              <!-- Discount Badge -->
              <div
                v-if="product.discountPercentage && product.discountPercentage > 0"
                class="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
              >
                -{{ product.discountPercentage }}%
              </div>

              <!-- Wishlist Button -->
              <!-- <button
                @click.stop="toggleWishlist(product)"
                class="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 transform hover:scale-110"
              >
                <svg
                  class="w-5 h-5 transition-colors duration-200"
                  :class="product.isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400'"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button> -->
            </div>

            <!-- Product Info -->
            <div class="p-6">
              <div class="mb-3">
                <h3
                  class="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2"
                >
                  {{ product.name }}
                </h3>

                <p class="text-sm text-gray-500 font-medium">
                  {{ product.brand }}
                </p>
              </div>

              <!-- Rating -->
              <div class="flex items-center mb-4">
                <div class="flex items-center mr-2">
                  <template v-if="product.averageRating && product.averageRating > 0">
                    <div class="flex items-center">
                      <svg
                        v-for="star in 5"
                        :key="star"
                        class="w-4 h-4"
                        :class="
                          star <= Math.floor(product.averageRating)
                            ? 'text-yellow-400 fill-current'
                            : star <= product.averageRating
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
                    <span class="text-sm font-medium text-gray-600 ml-1">
                      {{ product.averageRating.toFixed(1) }} ({{ product.totalReviews }})
                    </span>
                  </template>

                  <template v-else>
                    <div class="flex items-center">
                      <svg
                        v-for="star in 5"
                        :key="star"
                        class="w-4 h-4 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </div>
                    <span class="text-sm text-gray-500 ml-1"> Chưa có đánh giá </span>
                  </template>
                </div>
              </div>

              <!-- Price -->
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-2">
                  <span class="text-xl font-bold text-gray-900">
                    {{ formatPrice(product.effectivePrice) }}
                  </span>

                  <span
                    v-if="product.originalPrice && product.originalPrice > product.effectivePrice"
                    class="text-sm text-gray-500 line-through"
                  >
                    {{ formatPrice(product.originalPrice) }}
                  </span>
                </div>

                <div
                  v-if="product.discountAmount && product.discountAmount > 0"
                  class="text-sm text-green-600 font-semibold"
                >
                  Tiết kiệm {{ formatPrice(product.discountAmount) }}
                </div>
              </div>

              <!-- Add to Cart Button -->
              <button
                @click.stop="handleAddToCart(product)"
                class="w-full py-3 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl active:scale-95 active:shadow-md"
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- View All Button (Mobile) -->
      <div class="mt-12 text-center md:hidden">
        <button
          @click="handleViewAll"
          class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          Xem tất cả sản phẩm
        </button>
      </div>
    </section>

    <!-- ✅ SỬA - Newsletter Section với design đẹp hơn -->
    <section
      class="bg-gradient-to-br from-gray-900 via-gray-800 to-black py-20 relative overflow-hidden"
    >
      <!-- Background Effects -->
      <div class="absolute inset-0">
        <div class="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div
          class="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        ></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div class="max-w-4xl mx-auto">
          <!-- Header -->
          <div class="mb-12">
            <div
              class="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium text-white/80 mb-6"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Newsletter SmartShoes
            </div>

            <h2 class="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Đăng ký nhận tin mới
            </h2>
            <p class="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Cập nhật sản phẩm mới, khuyến mãi hấp dẫn và xu hướng thời trang thể thao mới nhất
            </p>
          </div>

          <!-- Newsletter Form -->
          <div class="max-w-lg mx-auto mb-12">
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="flex-1 relative">
                <input
                  v-model="newsletterEmail"
                  type="email"
                  placeholder="Nhập địa chỉ email của bạn..."
                  class="w-full px-6 py-4 bg-white/95 backdrop-blur-sm border border-white/20 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 text-lg"
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg
                    class="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
              </div>

              <button
                @click="handleNewsletter"
                class="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl whitespace-nowrap text-lg"
              >
                Đăng ký ngay
              </button>
            </div>
          </div>

          <!-- Benefits -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="flex flex-col items-center text-center">
              <div
                class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4"
              >
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1h2z"
                  />
                </svg>
              </div>
              <h3 class="text-white font-semibold mb-2">Sản phẩm mới</h3>
              <p class="text-gray-400 text-sm">Được ưu tiên thông báo về những mẫu giày mới nhất</p>
            </div>

            <div class="flex flex-col items-center text-center">
              <div
                class="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mb-4"
              >
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <h3 class="text-white font-semibold mb-2">Ưu đãi độc quyền</h3>
              <p class="text-gray-400 text-sm">
                Nhận mã giảm giá và khuyến mãi đặc biệt chỉ dành cho thành viên
              </p>
            </div>

            <div class="flex flex-col items-center text-center">
              <div
                class="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mb-4"
              >
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 class="text-white font-semibold mb-2">Xu hướng thời trang</h3>
              <p class="text-gray-400 text-sm">
                Cập nhật trend giày thể thao và phong cách phối đồ mới nhất
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentUser } from '@/common/guards/roleGuard.guard'
import { getAllProductsApi } from '../products/product.api'
import { getAllBrandsApi } from '../brand/brand.api'
import { getAllCategoriesApi } from '../category/category.api'
import { getReviewsByProduct } from '../reviews/reviews.api'
import type { Product } from '../products/product.type'
import type { Brand } from '../brand/brand.type'
import type { Category } from '../category/category.type'
import { useFilteredProducts } from '@/common/store/productFilter.store'
import { ca } from '@nuxt/ui/runtime/locale/index.js'
import { get } from 'http'
const router = useRouter()

// State
const currentSlide = ref(0)
const loadingProducts = ref(false)
const newsletterEmail = ref('')
const showQuickView = ref(false)
const selectedProduct = ref<any>(null)

const filterNotification = ref('')
const showNotification = ref(false)

// ✅ THÊM - Trong setup
const { setFilteredProducts } = useFilteredProducts()
// User
const currentUser = computed(() => getCurrentUser())

// Hero Slides với ảnh thể thao thực tế
const heroSlides = ref([
  {
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    productImage:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    badge: 'Bộ sưu tập mới',
    title: 'Giày thể thao thế hệ mới',
    description: 'Khám phá công nghệ tiên tiến cùng thiết kế đột phá cho mọi hoạt động thể thao',
    buttonText: 'Khám phá ngay',
    discount: 'GIẢM 30%',
    action: 'new-collection',
  },
  {
    image:
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
    productImage:
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    badge: 'Ưu đãi đặc biệt',
    title: 'Sale lên đến 50%',
    description: 'Cơ hội vàng sở hữu những đôi giày yêu thích với mức giá không thể tốt hơn',
    buttonText: 'Mua ngay',
    discount: 'TIẾT KIỆM 50%',
    action: 'sale',
  },
  {
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    productImage:
      'https://images.unsplash.com/photo-1605348532760-6753d2c43329?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    badge: 'Chất lượng cao',
    title: 'Đẳng cấp thể thao',
    description: 'Từ sân chơi đến đường phố, mọi bước đi đều hoàn hảo cùng công nghệ vượt trội',
    buttonText: 'Tìm hiểu thêm',
    discount: 'PREMIUM',
    action: 'premium',
  },
])

// Data
const categories = ref<Category[]>([])
const brands = ref<Brand[]>([])
const featuredProducts = ref<any[]>([])

// Computed
const displayCategories = computed(() => categories.value.slice(0, 8))
const displayBrands = computed(() => brands.value.slice(0, 12))

// Slide auto-play
let slideInterval: NodeJS.Timeout

onMounted(() => {
  fetchData()
  startSlideshow()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval)
  document.removeEventListener('click', handleClickOutside)
})

// Methods
const startSlideshow = () => {
  slideInterval = setInterval(() => {
    nextSlide()
  }, 6000)
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % heroSlides.value.length
}

const previousSlide = () => {
  currentSlide.value =
    currentSlide.value === 0 ? heroSlides.value.length - 1 : currentSlide.value - 1
}

const fetchData = async () => {
  await Promise.all([fetchCategories(), fetchBrands(), fetchFeaturedProducts()])
}

const fetchCategories = async () => {
  try {
    const response = await getAllCategoriesApi()
    categories.value = response.data || response.content || response || []
  } catch (error) {
    console.error('Lỗi khi tải danh mục:', error)
    categories.value = []
  }
}

const fetchBrands = async () => {
  try {
    const response = await getAllBrandsApi()
    brands.value = response.data || response.content || response || []
  } catch (error) {
    console.error('Lỗi khi tải thương hiệu:', error)
    brands.value = []
  }
}

const fetchFeaturedProducts = async () => {
  try {
    loadingProducts.value = true
    const response = await getAllProductsApi({
      page: 0,
      size: 8,
      status: 'ACTIVE',
      inStock: true,
      sortBy: 'createdAt',
      sortDirection: 'desc',
    })

    const products = response.content || []

    // Process products và fetch ratings
    featuredProducts.value = await Promise.all(
      products.map(async (product: Product) => {
        const processedProduct = await processProduct(product)
        return processedProduct
      }),
    )
  } catch (error) {
    console.error('Lỗi khi tải sản phẩm nổi bật:', error)
    featuredProducts.value = []
  } finally {
    loadingProducts.value = false
  }
}

const processProduct = async (product: Product) => {
  const variants = product.variants || []
  let mainImageUrl: string | null = null
  let effectivePrice = 0
  let originalPrice = 0
  let discountPercentage = 0
  let discountAmount = 0

  // Get main image from smallest variant
  if (variants.length > 0) {
    const smallestVariant = [...variants].sort((a, b) => a.id.localeCompare(b.id))[0]

    let selectedImage =
      smallestVariant.images?.find((img: any) => img.isMain) || smallestVariant.images?.[0] || null

    if (!selectedImage) {
      const variantWithImage = variants.find((v) => v.images && v.images.length > 0)
      if (variantWithImage) {
        selectedImage =
          variantWithImage.images.find((img: any) => img.isMain) || variantWithImage.images[0]
      }
    }

    mainImageUrl = selectedImage ? getDirectImageUrl(selectedImage.url) : null

    // ✅ SỬA - Tính giá và discount từ variant có giá thấp nhất
    const variantsWithPrice = variants.filter((v) => v.price > 0)

    if (variantsWithPrice.length > 0) {
      // Tìm variant có giá sale thấp nhất (hoặc giá gốc nếu không có sale)
      const cheapestVariant = variantsWithPrice.reduce((min, variant) => {
        const currentPrice =
          variant.priceSale && variant.priceSale > 0 ? variant.priceSale : variant.price
        const minPrice = min.priceSale && min.priceSale > 0 ? min.priceSale : min.price
        return currentPrice < minPrice ? variant : min
      })

      effectivePrice =
        cheapestVariant.priceSale && cheapestVariant.priceSale > 0
          ? cheapestVariant.priceSale
          : cheapestVariant.price
      originalPrice = cheapestVariant.price

      // ✅ Tính discount chỉ khi có priceSale
      if (
        cheapestVariant.priceSale &&
        cheapestVariant.priceSale > 0 &&
        cheapestVariant.priceSale < cheapestVariant.price
      ) {
        discountPercentage = Math.round(
          ((cheapestVariant.price - cheapestVariant.priceSale) / cheapestVariant.price) * 100,
        )
        discountAmount = cheapestVariant.price - cheapestVariant.priceSale
      }
    }
  }

  // Fetch reviews for rating (giữ nguyên logic cũ)
  let averageRating = 0
  let totalReviews = 0

  try {
    const reviewsResponse = await getReviewsByProduct(product.id, { page: 0, size: 1 })
    const reviews = reviewsResponse.content || []
    totalReviews = reviewsResponse.totalElements || 0

    if (reviews.length > 0) {
      const allReviews = await getReviewsByProduct(product.id, {
        page: 0,
        size: totalReviews,
      })
      const allReviewsData = allReviews.content || []

      if (allReviewsData.length > 0) {
        const totalRating = allReviewsData.reduce(
          (sum: number, review: any) => sum + review.rating,
          0,
        )
        averageRating = totalRating / allReviewsData.length
      }
    }
  } catch (error) {
    console.warn(`Không thể tải đánh giá cho sản phẩm ${product.id}:`, error)
  }

  return {
    id: product.id,
    name: product.name,
    brand: product.brand?.name || 'Unknown',
    slug: product.slug,
    effectivePrice,
    originalPrice: originalPrice > effectivePrice ? originalPrice : null,
    discountPercentage: discountPercentage > 0 ? discountPercentage : null,
    discountAmount: discountAmount > 0 ? discountAmount : null,
    averageRating: averageRating > 0 ? averageRating : null,
    totalReviews,
    mainImage: mainImageUrl,
    isWishlisted: false,
  }
}

const getDirectImageUrl = (driveUrl: string) => {
  const match = driveUrl?.match(/\/d\/([^/]+)/)
  if (!match) return driveUrl
  const driveId = match[1]
  return `http://localhost:8080/api/v1/images/${driveId}`
}

const getCategoryDefaultImage = (categoryName: string) => {
  const categoryImages: Record<string, string> = {
    'Giày chạy bộ':
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',

    'Giày đá bóng':
      'https://www.acfc.com.vn/acfc_wp/wp-content/uploads/2024/06/mercurial-vapor-15-academy-tf-low-top-football-shoes-L8JgP4-819x1024.webp?auto=format&fit=crop&w=400&q=80',

    'Giày training':
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9Mal-TX0zmyeh7zd2qKL_ncE0n7B2owAHVA&s?auto=format&fit=crop&w=400&q=80',

    'Giày sneaker':
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80',

    'Giày tennis':
      'https://authentic-shoes.com/wp-content/uploads/2023/04/image__75__cc6b82033896498bbbfad5b30e04cd57.png?auto=format&fit=crop&w=400&q=80',

    'Giày tập gym':
      'https://cdn.duvis.vn/post/goi-y-chang-cach-chon-giay-tap-gym-nam-chuan-nhat.jpg?auto=format&fit=crop&w=400&q=80',

    'Giày leo núi':
      'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=400&q=80',

    'Giày cầu lông':
      'https://cdn.shopvnb.com/uploads/san_pham/giay-cau-long-adidas-quickforce-3-w-1.webp?auto=format&fit=crop&w=400&q=80',
  }
  return (
    categoryImages[categoryName] ||
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  )
}

const getBrandDefaultLogo = (brandName: string) => {
  const brandLogos: Record<string, string> = {
    Nike: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',

    Adidas: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg',

    Puma: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZB1ejyZyAZUGZMPEFq4iHD4YVmlAO7TbUkQ&s',

    Brooks:
      'https://img.favpng.com/18/2/17/logo-brooks-sports-brand-sneakers-shoe-png-favpng-UYe8CXTiCpKpvsUQxhc9bxWNV.jpg',

    Converse: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Converse_logo.svg',

    Vans: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT__L6kFqUhDSxGhcsjmtUSzuYFH5SMXqdq2g&s',

    Asics: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Asics_Logo.svg',

    Mizuno:
      'data:image/png;base64,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',

    Reebok: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Reebok_2019_logo.svg',

    Fila: 'https://aeonmall-hadong.com.vn/wp-content/uploads/2022/07/fila-logo-png-1911-%E2%80%93-now-1-750x468.png',

    Salomon: 'https://1000logos.net/wp-content/uploads/2020/09/Salomon-Logo-1996.png',

    Saucony: 'https://images.seeklogo.com/logo-png/24/2/saucony-logo-png_seeklogo-246782.png',
  }

  return (
    brandLogos[brandName] ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(brandName)}&background=6366f1&color=fff&size=64&font-size=0.6`
  )
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

// Event Handlers
// ✅ SỬA - Event Handlers để chuyển đến /products với query params
// ✅ SỬA - Event Handlers lọc trực tiếp thay vì chuyển trang
const handleSlideAction = async (action: string) => {
  console.log('🎯 Slide action triggered:', action)

  // Show loading
  loadingProducts.value = true

  try {
    switch (action) {
      case 'new-collection':
        // Lọc sản phẩm mới nhất
        const newProducts = await fetchProductsWithFilter(
          {
            sortBy: 'createdAt',
            sortDirection: 'desc',
          },
          'Sản phẩm mới nhất',
        )

        // Lưu vào shared state và chuyển trang
        setFilteredProducts(newProducts, 'new-collection')
        router.push('/products')
        break

      case 'sale':
        // Lọc sản phẩm có sale
        const saleProducts = await fetchProductsWithSale()

        // Lưu vào shared state và chuyển trang
        setFilteredProducts(saleProducts, 'sale')
        router.push('/products')
        break

      case 'premium':
        // Lọc sản phẩm giá cao từ 2tr
        const premiumProducts = await fetchProductsWithFilter(
          {
            minPrice: 2000000
          },
          'Sản phẩm cao cấp',
        )

        // Lưu vào shared state và chuyển trang
        setFilteredProducts(premiumProducts, 'premium')
        router.push('/products')
        break

      default:
        // Fallback - chuyển đến trang products
        router.push('/products')
    }
  } catch (error) {
    console.error('❌ Error in handleSlideAction:', error)
    router.push('/products')
  } finally {
    loadingProducts.value = false
  }
}
// ✅ THÊM MỚI - Helper để scroll đến sản phẩm
const scrollToProducts = () => {
  const featuredSection = document.querySelector('.featured-products-section')
  if (featuredSection) {
    featuredSection.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }
}

// ✅ SỬA - Return raw products thay vì processed products
const fetchProductsWithFilter = async (
  filterParams: any,
  filterName: string = 'Custom',
): Promise<Product[]> => {
  // ✅ Đổi type thành Product[]
  try {
    console.log(`🔍 Fetching products with filter: ${filterName}`, filterParams)

    const response = await getAllProductsApi({
      page: 0,
      size: 50,
      status: 'ACTIVE',
      inStock: true,
      ...filterParams,
    })

    const products = response.content || []
    console.log(`📦 Raw products found: ${products.length}`)

    // ✅ Chỉ process cho Home UI, không làm thay đổi data gốc
    const processedProductsForHome = await Promise.all(
      products.slice(0, 8).map(async (product: Product) => {
        return await processProduct(product)
      }),
    )

    // ✅ Cập nhật UI Home với processed data
    featuredProducts.value = processedProductsForHome

    console.log(`✅ ${filterName} loaded: ${products.length} products`)

    // ✅ Return RAW products cho ProductList (không processed)
    return products
  } catch (error) {
    console.error(`❌ Error fetching ${filterName}:`, error)
    return []
  }
}

// ✅ SỬA - Return raw products thay vì processed products
const fetchProductsWithSale = async (): Promise<Product[]> => {
  // ✅ Đổi type thành Product[]
  try {
    console.log('🎉 Fetching products with sale...')

    const response = await getAllProductsApi({
      page: 0,
      size: 100,
      status: 'ACTIVE',
      inStock: true,
      sortBy: 'createdAt',
      sortDirection: 'desc',
    })

    const allProducts = response.content || []
    console.log(`📦 Total products to check for sale: ${allProducts.length}`)

    // ✅ Filter sản phẩm có sale - GIỮ NGUYÊN cấu trúc gốc
    const productsWithSale = allProducts.filter((product: Product) => {
      const variants = product.variants || []
      return variants.some(
        (variant) =>
          variant.priceSale && variant.priceSale > 0 && variant.priceSale < variant.price,
      )
    })

    console.log(`🔥 Products with sale found: ${productsWithSale.length}`)

    // ✅ Process chỉ cho Home UI (8 sản phẩm đầu)
    const processedProductsForHome = await Promise.all(
      productsWithSale.slice(0, 8).map(async (product: Product) => {
        return await processProduct(product)
      }),
    )

    // ✅ Cập nhật UI Home
    featuredProducts.value = processedProductsForHome

    console.log(`✅ Sale products loaded for ProductList: ${productsWithSale.length}`)

    // ✅ Return RAW products có sale cho ProductList
    return productsWithSale
  } catch (error) {
    console.error('❌ Error fetching sale products:', error)
    return []
  }
}

const showFilterNotification = (filterName: string, count: number, isError: boolean = false) => {
  if (isError) {
    filterNotification.value = `❌ ${filterName}`
  } else if (count === 0) {
    filterNotification.value = `⚠️ Không tìm thấy ${filterName.toLowerCase()}`
  } else {
    filterNotification.value = `🎯 Hiển thị ${count} ${filterName.toLowerCase()}`
  }

  showNotification.value = true

  // Auto hide after 3 seconds
  setTimeout(() => {
    showNotification.value = false
  }, 3000)
}

// ✅ THÊM MỚI - Reset về sản phẩm mặc định
const resetToDefaultProducts = () => {
  console.log('🔄 Resetting to default products...')
  fetchFeaturedProducts()
  showFilterNotification('Sản phẩm nổi bật', 8)
}

const handleShopNow = () => {
  scrollToProducts()
}

const handleCategoryClick = (category: Category) => {
  router.push({
    path: '/products',
    query: { categoryId: category.id },
  })
}

const handleBrandClick = (brand: Brand) => {
  router.push({
    path: '/products',
    query: { brandId: brand.id },
  })
}

const handleProductClick = (product: any) => {
  if (showQuickView.value) {
    closeQuickView()
  }
  router.push(`/products/slug/${product.slug}`)
}

const handleViewAll = () => {
  router.push('/products')
}

const handleQuickView = (product: any) => {
  selectedProduct.value = product
  showQuickView.value = true
}

const closeQuickView = () => {
  showQuickView.value = false
  selectedProduct.value = null
}

const handleAddToCart = async (product: any) => {
  if (!currentUser.value) {
    if (confirm('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng. Đăng nhập ngay?')) {
      router.push('/login')
    }
    return
  }

  // Navigate to product detail for size/color selection
  router.push(`/products/slug/${product.slug}`)
}

const toggleWishlist = (product: any) => {
  if (!currentUser.value) {
    if (confirm('Bạn cần đăng nhập để sử dụng wishlist. Đăng nhập ngay?')) {
      router.push('/login')
    }
    return
  }

  product.isWishlisted = !product.isWishlisted
  // TODO: Implement wishlist API
  console.log('Toggle wishlist for product:', product.id)
}

const handleNewsletter = () => {
  if (!newsletterEmail.value || !newsletterEmail.value.includes('@')) {
    alert('Vui lòng nhập email hợp lệ')
    return
  }

  // TODO: Implement newsletter API
  alert('Cảm ơn bạn đã đăng ký nhận tin!')
  newsletterEmail.value = ''
}

const handleClickOutside = (event: Event) => {
  // Close modals when clicking outside
  const target = event.target as Element
  if (showQuickView.value && !target.closest('.fixed')) {
    closeQuickView()
  }
}
</script>

<style scoped>
.aspect-w-1 {
  position: relative;
  padding-bottom: 100%;
}

.aspect-w-1 > img {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom animations */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slideIn 0.5s ease-out;
}

/* Hover effects */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\:translate-y-0 {
  transform: translateY(0);
}

/* Gradient text */
.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Loading pulse effect */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>

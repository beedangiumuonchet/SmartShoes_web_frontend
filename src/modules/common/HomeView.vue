<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Bar -->

    <!-- Hero Section with Slide -->
    <section class="relative h-96 md:h-[500px] overflow-hidden">
      <div class="absolute inset-0">
        <div
          class="flex transition-transform duration-500 ease-in-out h-full"
          :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
        >
          <div
            v-for="(slide, index) in heroSlides"
            :key="index"
            class="w-full h-full flex-shrink-0 relative"
          >
            <img :src="slide.image" :alt="slide.title" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div class="text-center text-white px-4">
                <h2 class="text-4xl md:text-6xl font-bold mb-4">{{ slide.title }}</h2>
                <p class="text-lg md:text-xl mb-8 max-w-2xl">{{ slide.description }}</p>
                <button
                  @click="handleShopNow"
                  class="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
                >
                  {{ slide.buttonText }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Slide Controls -->
      <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        <button
          v-for="(slide, index) in heroSlides"
          :key="index"
          @click="currentSlide = index"
          class="w-3 h-3 rounded-full transition-colors"
          :class="currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'"
        />
      </div>

      <!-- Navigation Arrows -->
      <button
        @click="previousSlide"
        class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>

    <!-- Categories Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Danh mục sản phẩm</h2>
        <p class="text-gray-600 max-w-2xl mx-auto">
          Khám phá bộ sưu tập giày thể thao đa dạng từ các thương hiệu hàng đầu
        </p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div
          v-for="category in categories"
          :key="category.id"
          @click="handleCategoryClick(category)"
          class="group cursor-pointer"
        >
          <div
            class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow"
          >
            <div
              class="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
            >
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">{{ category.name }}</h3>
            <p class="text-sm text-gray-600">{{ category.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="bg-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-12">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Sản phẩm nổi bật</h2>
            <p class="text-gray-600">Những đôi giày được yêu thích nhất</p>
          </div>
          <button
            @click="handleViewAll"
            class="text-blue-600 hover:text-blue-700 font-semibold flex items-center"
          >
            Xem tất cả
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div
            v-for="product in featuredProducts"
            :key="product.id"
            class="group cursor-pointer"
            @click="handleProductClick(product)"
          >
            <div
              class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div class="aspect-w-1 aspect-h-1 relative overflow-hidden">
                <img
                  :src="product.mainImage || '/api/placeholder/300/300'"
                  :alt="product.name"
                  class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div
                  v-if="product.discount"
                  class="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-semibold"
                >
                  -{{ product.discount }}%
                </div>
                <button
                  @click.stop="toggleWishlist(product)"
                  class="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
                >
                  <svg
                    class="w-5 h-5"
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
                </button>
              </div>
              <div class="p-4">
                <h3
                  class="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors"
                >
                  {{ product.name }}
                </h3>
                <p class="text-sm text-gray-600 mb-3">{{ product.brand }}</p>
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span class="text-lg font-bold text-gray-900">{{
                      formatPrice(product.price)
                    }}</span>
                    <span v-if="product.originalPrice" class="text-sm text-gray-500 line-through">{{
                      formatPrice(product.originalPrice)
                    }}</span>
                  </div>
                  <div class="flex items-center">
                    <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      />
                    </svg>
                    <span class="text-sm text-gray-600 ml-1">{{ product.rating }}</span>
                  </div>
                </div>
                <button
                  @click.stop="addToCart(product)"
                  class="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Brands Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Thương hiệu đối tác</h2>
          <p class="text-gray-600">Những thương hiệu giày thể thao hàng đầu thế giới</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          <div
            v-for="brand in brands"
            :key="brand.id"
            @click="handleBrandClick(brand)"
            class="flex items-center justify-center p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
          >
            <img
              :src="brand.logo || '/api/placeholder/120/60'"
              :alt="brand.name"
              class="h-12 object-contain"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Cart Sidebar -->
    <div v-if="showCart" class="fixed inset-0 z-50 overflow-hidden" @click="showCart = false">
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl" @click.stop>
        <div class="flex flex-col h-full">
          <div class="flex items-center justify-between p-4 border-b">
            <h2 class="text-lg font-semibold">Giỏ hàng ({{ cartItemsCount }})</h2>
            <button @click="showCart = false" class="p-2 hover:bg-gray-100 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-4">
            <div v-if="cartItems.length === 0" class="text-center py-8">
              <svg
                class="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6H19"
                />
              </svg>
              <p class="text-gray-500">Giỏ hàng trống</p>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="item in cartItems"
                :key="item.id"
                class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <img :src="item.image" :alt="item.name" class="w-16 h-16 object-cover rounded-lg" />
                <div class="flex-1">
                  <h3 class="font-medium text-gray-900">{{ item.name }}</h3>
                  <p class="text-sm text-gray-600">{{ item.variant }}</p>
                  <div class="flex items-center justify-between mt-2">
                    <div class="flex items-center space-x-2">
                      <button
                        @click="updateCartQuantity(item, item.quantity - 1)"
                        class="w-6 h-6 flex items-center justify-center bg-white border rounded"
                      >
                        -
                      </button>
                      <span class="text-sm">{{ item.quantity }}</span>
                      <button
                        @click="updateCartQuantity(item, item.quantity + 1)"
                        class="w-6 h-6 flex items-center justify-center bg-white border rounded"
                      >
                        +
                      </button>
                    </div>
                    <span class="font-semibold">{{ formatPrice(item.price * item.quantity) }}</span>
                  </div>
                </div>
                <button @click="removeFromCart(item)" class="p-1 text-gray-400 hover:text-red-500">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          <div v-if="cartItems.length > 0" class="border-t p-4">
            <div class="flex justify-between items-center mb-4">
              <span class="text-lg font-semibold">Tổng cộng:</span>
              <span class="text-xl font-bold text-blue-600">{{ formatPrice(cartTotal) }}</span>
            </div>
            <button
              @click="handleCheckout"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentUser, removeToken } from '@/common/guards/roleGuard.guard'

const router = useRouter()

// State
const searchQuery = ref('')
const showUserMenu = ref(false)
const showCart = ref(false)
const currentSlide = ref(0)

// User
const currentUser = computed(() => getCurrentUser())

// Hero Slides
const heroSlides = ref([
  {
    image: '/api/placeholder/1200/500',
    title: 'Bộ sưu tập mới 2024',
    description:
      'Khám phá những mẫu giày thể thao mới nhất với công nghệ tiên tiến và thiết kế độc đáo',
    buttonText: 'Khám phá ngay',
  },
  {
    image: '/api/placeholder/1200/500',
    title: 'Giảm giá lên đến 50%',
    description: 'Cơ hội sở hữu những đôi giày yêu thích với mức giá ưu đãi không thể bỏ lỡ',
    buttonText: 'Mua ngay',
  },
  {
    image: '/api/placeholder/1200/500',
    title: 'Chất lượng đẳng cấp',
    description:
      'Từ sân chơi đến đường phố, mọi bước đi đều hoàn hảo cùng BST giày thể thao cao cấp',
    buttonText: 'Tìm hiểu thêm',
  },
])

// Categories (mock data)
const categories = ref([
  { id: 1, name: 'Giày chạy bộ', description: 'Dành cho runners' },
  { id: 2, name: 'Giày bóng đá', description: 'Chuyên nghiệp' },
  { id: 3, name: 'Giày thời trang', description: 'Phong cách đường phố' },
  { id: 4, name: 'Giày tập gym', description: 'Tập luyện hiệu quả' },
])

// Featured Products (mock data)
const featuredProducts = ref([
  {
    id: 1,
    name: 'Nike Air Max 270',
    brand: 'Nike',
    price: 2500000,
    originalPrice: 3000000,
    discount: 17,
    rating: 4.8,
    mainImage: '/api/placeholder/300/300',
    isWishlisted: false,
  },
  {
    id: 2,
    name: 'Adidas Ultraboost 22',
    brand: 'Adidas',
    price: 2800000,
    rating: 4.9,
    mainImage: '/api/placeholder/300/300',
    isWishlisted: true,
  },
  {
    id: 3,
    name: 'Puma RS-X',
    brand: 'Puma',
    price: 1800000,
    originalPrice: 2200000,
    discount: 18,
    rating: 4.6,
    mainImage: '/api/placeholder/300/300',
    isWishlisted: false,
  },
  {
    id: 4,
    name: 'New Balance 990v5',
    brand: 'New Balance',
    price: 3200000,
    rating: 4.7,
    mainImage: '/api/placeholder/300/300',
    isWishlisted: false,
  },
])

// Brands (mock data)
const brands = ref([
  { id: 1, name: 'Nike', logo: '/api/placeholder/120/60' },
  { id: 2, name: 'Adidas', logo: '/api/placeholder/120/60' },
  { id: 3, name: 'Puma', logo: '/api/placeholder/120/60' },
  { id: 4, name: 'New Balance', logo: '/api/placeholder/120/60' },
  { id: 5, name: 'Vans', logo: '/api/placeholder/120/60' },
  { id: 6, name: 'Converse', logo: '/api/placeholder/120/60' },
])

// Cart
const cartItems = ref([
  {
    id: 1,
    name: 'Nike Air Max 270',
    variant: 'Size 42, Đen',
    price: 2500000,
    quantity: 1,
    image: '/api/placeholder/100/100',
  },
])

const cartItemsCount = computed(() =>
  cartItems.value.reduce((total, item) => total + item.quantity, 0),
)
const cartTotal = computed(() =>
  cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0),
)

// Slide auto-play
let slideInterval: NodeJS.Timeout

onMounted(() => {
  slideInterval = setInterval(() => {
    nextSlide()
  }, 5000)
})

onUnmounted(() => {
  if (slideInterval) {
    clearInterval(slideInterval)
  }
})

// Methods
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % heroSlides.value.length
}

const previousSlide = () => {
  currentSlide.value =
    currentSlide.value === 0 ? heroSlides.value.length - 1 : currentSlide.value - 1
}

const handleSearch = () => {
  console.log('Search:', searchQuery.value)
  // Implement search functionality
}

const handleProfile = () => {
  showUserMenu.value = false
  router.push('/profile')
}

const handleOrders = () => {
  showUserMenu.value = false
  router.push('/orders')
}

const handleLogout = () => {
  removeToken()
  router.push('/login')
}

const handleShopNow = () => {
  // Scroll to products section or navigate to shop
  document
    .querySelector('[data-section="featured-products"]')
    ?.scrollIntoView({ behavior: 'smooth' })
}

const handleCategoryClick = (category: any) => {
  router.push(`/category/${category.id}`)
}

const handleProductClick = (product: any) => {
  router.push(`/product/${product.id}`)
}

const handleBrandClick = (brand: any) => {
  router.push(`/brand/${brand.id}`)
}

const handleViewAll = () => {
  router.push('/products')
}

const toggleWishlist = (product: any) => {
  product.isWishlisted = !product.isWishlisted
  // Implement wishlist API
}

const addToCart = (product: any) => {
  // Implement add to cart functionality
  console.log('Add to cart:', product.name)
}

const updateCartQuantity = (item: any, newQuantity: number) => {
  if (newQuantity <= 0) {
    removeFromCart(item)
  } else {
    item.quantity = newQuantity
  }
}

const removeFromCart = (item: any) => {
  const index = cartItems.value.findIndex((cartItem) => cartItem.id === item.id)
  if (index > -1) {
    cartItems.value.splice(index, 1)
  }
}

const handleCheckout = () => {
  showCart.value = false
  router.push('/checkout')
}

// Close dropdowns when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.relative')) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
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
</style>

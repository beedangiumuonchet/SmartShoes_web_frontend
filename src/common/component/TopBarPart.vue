<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Bar Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <div
                class="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg flex items-center justify-center cursor-pointer"
                @click="handleLogoClick"
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
              <h1
                class="ml-3 text-xl font-bold text-gray-900 cursor-pointer hover:text-rose-600 transition-colors"
                @click="handleLogoClick"
              >
                SMARTSHOES
              </h1>
            </div>
          </div>

          <!-- Search Bar -->
          <div class="flex-1 max-w-lg mx-8">
            <div class="relative">
              <!-- <input
                v-model="searchQuery"
                type="text"
                placeholder="Tìm kiếm giày thể thao..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                @keyup.enter="handleSearch"
              /> -->
              <!-- <div class="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2"> -->
              <!-- <label 
                class="flex items-center cursor-pointer bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg px-3 py-1 space-x-2 transition-all"
                title="Tìm kiếm sản phẩm bằng ảnh"
              >
                <input type="file" class="hidden" @change="handleFileChange" accept="image/*" />
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h4l2-3h6l2 3h4v13H3V7z" />
                  <circle cx="12" cy="13" r="4" stroke-width="2" stroke="currentColor"/>
                </svg>
                <span class="text-sm text-gray-700">Tìm bằng ảnh</span>
              </label> -->
              <!-- </div> -->

              <!-- <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div> -->
            </div>
          </div>

          <!-- Right Actions -->
          <div class="flex items-center space-x-4">
            <!-- Cart Button - Chuyển sang trang cart -->
            <button
              @click="goToCart"
              class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6H19"
                />
              </svg>
              <!-- Cart Count Badge với màu pastel -->
              <span
                v-if="cartItemsCount > 0"
                class="absolute -top-1 -right-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-bounce"
              >
                {{ cartItemsCount > 99 ? '99+' : cartItemsCount }}
              </span>
            </button>

            <!-- User Menu -->
            <!-- User Menu - ✅ SỬA: Hiển thị cho cả guest và user -->
            <div class="relative">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <!-- User Avatar -->
                <div
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    currentUser
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                      : 'bg-gradient-to-r from-orange-400 to-pink-500',
                  ]"
                >
                  <span class="text-sm font-medium text-white">
                    {{ currentUser ? getUserInitials() : 'U' }}
                  </span>
                </div>

                <!-- User Name (hidden on mobile) - ✅ SỬA: Conditional text -->
                <span class="hidden md:block text-sm font-medium">
                  {{ currentUser ? currentUser.firstName || currentUser.name || 'User' : 'Khách' }}
                </span>

                <!-- Dropdown Arrow -->
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <!-- ✅ SỬA: Dropdown Menu - Conditional content -->
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                @click.stop
              >
                <!-- ✅ THÊM: Guest User Menu -->
                <template v-if="!currentUser">
                  <!-- Guest Info Header -->
                  <div class="px-4 py-3 border-b border-gray-200">
                    <div class="flex items-center space-x-3">
                      <div
                        class="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center"
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p class="text-sm font-semibold text-orange-600">Khách hàng</p>
                        <p class="text-xs text-pink-500">Chưa đăng nhập</p>
                      </div>
                    </div>
                  </div>

                  <!-- Guest Menu Items -->
                  <div class="py-1">
                    <button
                      @click="handleLogin"
                      class="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <svg
                        class="w-4 h-4 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 16l-4-4m0 0l4-4m0 0H3m4 4h14"
                        />
                      </svg>
                      <span class="font-medium">Đăng nhập</span>
                    </button>

                    <button
                      @click="handleRegister"
                      class="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                    >
                      <svg
                        class="w-4 h-4 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                      <span class="font-medium">Đăng ký</span>
                    </button>
                  </div>
                </template>

                <!-- ✅ GIỮ NGUYÊN: Logged In User Menu -->
                <template v-else>
                  <!-- User Info Header -->
                  <div class="px-4 py-3 border-b border-gray-200">
                    <div class="flex items-center space-x-3">
                      <div
                        class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                      >
                        <span class="text-sm font-medium text-white">
                          {{ getUserInitials() }}
                        </span>
                      </div>
                      <div>
                        <p class="text-sm font-semibold text-gray-900">
                          {{ currentUser.firstName || currentUser.name || 'User' }}
                        </p>
                        <p class="text-xs text-gray-600">{{ currentUser.email }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Logged In Menu Items -->
                  <div class="py-1">
                    <button
                      @click="handleProfile"
                      class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <svg
                        class="w-4 h-4 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Thông tin cá nhân
                    </button>

                    <button
                      @click="handleOrders"
                      class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <svg
                        class="w-4 h-4 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      Đơn hàng của tôi
                    </button>

                    <div class="border-t border-gray-200 my-2"></div>

                    <button
                      @click="handleLogout"
                      class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg
                        class="w-4 h-4 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Đăng xuất
                    </button>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getCurrentUser, removeToken } from '@/common/guards/roleGuard.guard'
import { getUserCart, getCartItemCount } from '@/modules/carts/carts.api'
import type { Cart } from '@/modules/carts/carts.type'
import { searchProductsByImageApi } from '@/modules/products/product.api'
import type { Product } from '@/modules/products/product.type'

// Router
const router = useRouter()
const route = useRoute()

// State
const searchQuery = ref('')
const imageFile = ref<File | null>(null)

const showUserMenu = ref(false)
const cartItemsCount = ref(0)

// Computed
const currentUser = computed(() => getCurrentUser())

// Methods
const handleLogoClick = () => {
  router.push('/')
}

const handleSearch = () => {
  console.log('Search:', searchQuery.value)
  // Implement search functionality
}

// 🔹 Tìm kiếm theo ảnh
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    imageFile.value = target.files[0]
    handleImageSearch()
  }
}

const handleImageSearch = async () => {
  if (!imageFile.value) return

  try {
    const res = await searchProductsByImageApi(imageFile.value)
    const results = res

    // ⭐ Lưu data vào sessionStorage
    sessionStorage.setItem('imageSearchResults', JSON.stringify(results))

    // router.push({
    //   path: '/products',
    //   query: {
    //     fromImageSearch: "1"
    //   }
    // })
    router
      .replace({
        path: '/products',
        query: { fromImageSearch: '1' },
      })
      .then(() => {
        window.location.reload()
      })
  } catch (err) {
    console.error('❌ Lỗi tìm kiếm sản phẩm theo ảnh:', err)
  }
}

const getUserInitials = () => {
  const user = currentUser.value
  if (user?.firstName && user?.lastName) {
    return user.firstName.charAt(0) + user.lastName.charAt(0)
  }
  if (user?.fullName) {
    const names = user.fullName.split(' ')
    return names.length > 1
      ? names[0].charAt(0) + names[names.length - 1].charAt(0)
      : names[0].charAt(0)
  }
  if (user?.name) {
    return user.name.charAt(0)
  }
  return 'U'
}

const handleLogin = () => {
  showUserMenu.value = false
  router.push('/login')
}

const handleRegister = () => {
  showUserMenu.value = false
  router.push('/register')
}

const handleProducts = () => {
  showUserMenu.value = false
  router.push('/products')
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
  if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
    removeToken()
    router.push('/login')
  }
}

// Chuyển sang trang cart thay vì popup
const goToCart = () => {
  router.push('/cart')
}

const updateCartCount = async () => {
  if (!currentUser.value?.userId) {
    cartItemsCount.value = 0
    return
  }

  try {
    const cart = await getUserCart(currentUser.value.userId)
    cartItemsCount.value = cart ? getCartItemCount(cart) : 0
  } catch (error) {
    cartItemsCount.value = 0
  }
}

// Close dropdowns when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.relative')) {
    showUserMenu.value = false
  }
}

// Listen for cart updates
const handleCartUpdate = () => {
  updateCartCount()
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('cart-updated', handleCartUpdate)

  // Load initial cart count
  updateCartCount()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('cart-updated', handleCartUpdate)
})
</script>

<style scoped>
/* Custom animations */
@keyframes bounce {
  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  40%,
  43% {
    transform: translate3d(0, -8px, 0);
  }
  70% {
    transform: translate3d(0, -4px, 0);
  }
  90% {
    transform: translate3d(0, -2px, 0);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}
</style>

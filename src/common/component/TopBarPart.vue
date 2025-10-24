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
                class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center cursor-pointer"
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
                class="ml-3 text-xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                @click="handleLogoClick"
              >
                SMARTSHOES
              </h1>
            </div>
          </div>

          <!-- Search Bar -->
          <div class="flex-1 max-w-lg mx-8">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Tìm kiếm giày thể thao..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @keyup.enter="handleSearch"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
              </div>
            </div>
          </div>

          <!-- Right Actions -->
          <div class="flex items-center space-x-4">
            <!-- Cart -->
            <button
              @click="showCart = true"
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
              <span
                v-if="cartItemsCount > 0"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              >
                {{ cartItemsCount }}
              </span>
            </button>

            <!-- User Menu -->
            <div class="relative">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <!-- User Avatar -->
                <div
                  class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
                >
                  <span class="text-sm font-medium text-white">
                    {{ getUserInitials() }}
                  </span>
                </div>

                <!-- User Name (hidden on mobile) -->
                <span class="hidden md:block text-sm font-medium">
                  {{ currentUser?.firstName || currentUser?.name || 'User' }}
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

              <!-- User Dropdown Menu -->
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                @click.stop
              >
                <!-- User Info Header -->
                <div class="px-4 py-2 border-b border-gray-200">
                  <p class="text-sm font-semibold text-gray-900">
                    {{ currentUser?.fullName || currentUser?.name || 'User' }}
                  </p>
                  <p class="text-xs text-gray-600">{{ currentUser?.email }}</p>
                </div>

                <!-- Menu Items -->
                <div class="py-1">
                  <button
                    @click="handleProfile"
                    class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Đơn hàng của tôi
                  </button>

                  <button
                    @click="handleLogout"
                    class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Area - This is where RouterView will render -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Shopping Cart Sidebar -->
    <div v-if="showCart" class="fixed inset-0 z-50 overflow-hidden" @click="showCart = false">
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div
        class="absolute right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform"
        @click.stop
      >
        <div class="flex items-center justify-between p-4 border-b">
          <h2 class="text-lg font-semibold">Giỏ hàng</h2>
          <button @click="showCart = false" class="p-2 hover:bg-gray-100 rounded">
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

        <div class="p-4">
          <p class="text-gray-500 text-center py-8">Giỏ hàng trống</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getCurrentUser, removeToken } from '@/common/guards/roleGuard.guard'

// Router
const router = useRouter()
const route = useRoute()

// State
const searchQuery = ref('')
const showUserMenu = ref(false)
const showCart = ref(false)

// Mock cart items count
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

// Close dropdowns when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.relative')) {
    showUserMenu.value = false
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Animation cho dropdown */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

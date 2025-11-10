<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <div
      :class="[
        'bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col',
        isCollapsed ? 'w-20' : 'w-80',
      ]"
    >
      <!-- Header -->
      <div class="p-6 border-b border-gray-200 flex-shrink-0">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <UIcon name="i-heroicons-folder-open" class="w-6 h-6 text-white" />
            </div>
          </div>
          <div v-if="!isCollapsed" class="ml-4 flex-1">
            <h2 class="text-xl font-bold text-gray-900">SMARTSHOES</h2>
            <p class="text-sm text-gray-500">Quản lý cửa hàng</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex-shrink-0">
        <UNavigationMenu
          tooltip
          highlight
          highlight-color="primary"
          color="primary"
          orientation="vertical"
          :items="navigationItems"
          class="w-full mt-4 mx-auto"
          :collapsed="isCollapsed"
          :ui="{
            link: ['px-4 py-3 text-base font-medium', isCollapsed ? 'justify-center' : ''],
            linkLeadingIcon: 'w-5 h-5',
            childLink: 'px-4 py-2 text-sm',
            content: 'p-2',
          }"
        />
      </div>

      <!-- Spacer to push User Section to bottom -->
      <div class="flex-1"></div>

      <!-- User Section - SỬA: Dùng cách simple hơn -->
      <div class="p-4 border-t border-gray-200 bg-white flex-shrink-0">
        <div class="relative">
          <!-- User Info Button -->
          <button
            @click="showUserMenu = !showUserMenu"
            class="flex items-center w-full cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors duration-200"
            :class="{ 'bg-gray-100': showUserMenu }"
          >
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <span class="text-base font-medium text-white">
                  {{
                    currentUser?.firstName && currentUser?.lastName
                      ? currentUser?.firstName.charAt(0) + currentUser?.lastName.charAt(0)
                      : '!'
                  }}
                </span>
              </div>
            </div>
            <div v-if="!isCollapsed" class="ml-4 flex-1 text-left">
              <p class="text-sm font-medium text-gray-900">
                {{
                  currentUser?.firstName && currentUser?.lastName
                    ? currentUser?.firstName + ' ' + currentUser?.lastName
                    : 'Not Found'
                }}
              </p>
              <p class="text-xs text-gray-500">{{ currentUser?.email || 'Not Found' }}</p>
            </div>
            <div v-if="!isCollapsed" class="ml-2">
              <UIcon
                name="i-heroicons-chevron-up"
                class="w-4 h-4 text-gray-400 transition-transform duration-200"
                :class="{ 'rotate-180': showUserMenu }"
              />
            </div>
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="showUserMenu"
            class="absolute bottom-full left-0 w-full mb-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          >
            <div class="py-1">
              <!-- Profile Item -->
              <button
                @click="handleProfileClick"
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <UIcon name="i-heroicons-user" class="w-4 h-4 mr-3 text-gray-400" />
                <span>Thông tin cá nhân</span>
              </button>

              <!-- Divider -->
              <div class="border-t border-gray-100 my-1"></div>

              <!-- Logout Item -->
              <button
                @click="handleLogout"
                class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                <UIcon
                  name="i-heroicons-arrow-right-on-rectangle"
                  class="w-4 h-4 mr-3 text-red-500"
                />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Navbar with Toggle Button -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="flex items-center justify-between px-4 py-3">
          <div class="flex items-center">
            <UButton
              @click="toggleSidebar"
              variant="ghost"
              color="neutral"
              icon="i-heroicons-bars-3"
              class="mr-3"
            />
            <h1 class="text-lg font-semibold text-gray-900">Dashboard</h1>
          </div>
          <div class="flex items-center space-x-4">
            <div id="pageNavAction" class="flex justify-between items-center"></div>
            <!-- Placeholder for additional navbar items -->
            <UButton variant="ghost" color="neutral" icon="i-heroicons-bell" />
            <UButton variant="ghost" color="neutral" icon="i-heroicons-cog-6-tooth" />
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSidebarStore } from '@/common/store/sidebar.store'
import { getCurrentUser, removeToken } from '@/common/guards/roleGuard.guard'
import type { NavigationMenuItem } from '@nuxt/ui'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const sidebarStore = useSidebarStore()
const { isCollapsed } = storeToRefs(sidebarStore)
const { toggleSidebar } = sidebarStore

// Local state for user menu
const showUserMenu = ref(false)

// Navigation items
const navigationItems = ref<NavigationMenuItem[][]>([
  [
    {
      label: 'Trang Chủ',
      to: '/manager',
      icon: 'i-heroicons-home',
    },
    {
      label: 'Đơn Hàng',
      to: '/manager/orders',
      icon: 'i-heroicons-shopping-cart',
    },
    {
      label: 'Người Dùng', // ✅ THÊM MENU USER
      to: '/manager/users',
      icon: 'i-heroicons-users',
    },
    {
      label: 'Báo Cáo',
      to: '/manager/reports',
      icon: 'i-heroicons-chart-bar',
    },
    {
      label: 'Cài Đặt',
      to: '/manager/settings',
      icon: 'i-heroicons-cog-6-tooth',
    },
  ],
])

const currentUser = computed(() => getCurrentUser())

// Handle profile click
function handleProfileClick() {
  showUserMenu.value = false
  console.log('Navigate to profile')
  // router.push('/profile')
}

// Logout function - chỉ xóa token ở FE
function handleLogout() {
  try {
    showUserMenu.value = false

    // Xóa token từ client storage
    removeToken()

    console.log('Đăng xuất thành công!')

    // Redirect về login page
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)

    // Vẫn cố gắng xóa token và redirect
    removeToken()
    router.push('/login')
  }
}

// Close menu when clicking outside
import { onMounted, onUnmounted } from 'vue'

function handleClickOutside(event: Event) {
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
/* Custom styles for smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>

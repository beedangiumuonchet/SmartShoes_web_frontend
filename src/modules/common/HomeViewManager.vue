<!-- filepath: g:\LearnPTIT\TotNghiep\SmartShoes_web_frontend\src\modules\common\HomeViewManager.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b border-gray-200 mb-6">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Dashboard Quản Lý</h1>
            <p class="text-gray-600 mt-1">Tổng quan hệ thống quản lý SmartShoes</p>
          </div>
          <div class="flex items-center space-x-3">
            <!-- Refresh Button -->
            <button
              @click="refreshData"
              :disabled="loading"
              class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <svg
                :class="['w-4 h-4 mr-2', loading ? 'animate-spin' : '']"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Làm mới
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <!-- Total Orders -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 stats-card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                class="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalOrders }}</p>
            <p class="text-sm text-green-600">
              <span class="font-medium">+12%</span>
              so với tháng trước
            </p>
          </div>
        </div>
      </div>

      <!-- Total Users -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 stats-card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                class="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Tổng người dùng</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalUsers }}</p>
            <p class="text-sm text-green-600">
              <span class="font-medium">+8%</span>
              so với tháng trước
            </p>
          </div>
        </div>
      </div>

      <!-- Revenue -->
      <!-- <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 stats-card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg
                class="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Doanh thu tháng</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ formatCurrency(stats.monthlyRevenue) }}
            </p>
            <p class="text-sm text-green-600">
              <span class="font-medium">+15%</span>
              so với tháng trước
            </p>
          </div>
        </div>
      </div> -->

      <!-- Pending Orders -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 stats-card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg
                class="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Đơn chờ xử lý</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.pendingOrders }}</p>
            <p class="text-sm text-red-600">
              <span class="font-medium">Cần xử lý</span>
              ngay
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Orders -->
      <div class="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Đơn hàng gần đây</h2>
            <router-link
              to="/manager/orders"
              class="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Xem tất cả
            </router-link>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-12 text-center">
          <div class="inline-flex items-center space-x-2">
            <svg
              class="w-5 h-5 animate-spin text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span class="text-gray-600">Đang tải dữ liệu...</span>
          </div>
        </div>

        <!-- Recent Orders List -->
        <div v-else-if="recentOrders.length > 0" class="divide-y divide-gray-200">
          <div
            v-for="order in recentOrders"
            :key="order.id"
            class="p-6 hover:bg-gray-50 transition-colors duration-200"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center"
                  >
                    <span class="text-sm font-medium text-white">
                      #{{ order.id.substring(0, 4).toUpperCase() }}
                    </span>
                  </div>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ order.customerName }}</p>
                  <p class="text-sm text-gray-500">{{ order.itemCount }} sản phẩm</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">{{ formatCurrency(order.total) }}</p>
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getOrderStatusClasses(order.status),
                  ]"
                >
                  {{ getOrderStatusLabel(order.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="p-12 text-center">
          <svg
            class="w-12 h-12 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Chưa có đơn hàng</h3>
          <p class="text-gray-600">Chưa có đơn hàng nào trong hệ thống.</p>
        </div>
      </div>

      <!-- Quick Actions & System Status -->
      <div class="space-y-6">
        <!-- Quick Actions -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Thao tác nhanh</h2>
          </div>
          <div class="p-6 space-y-4">
            <router-link
              to="/manager/orders"
              class="flex items-center w-full p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              <div class="flex-shrink-0">
                <svg
                  class="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium">Quản lý đơn hàng</p>
                <p class="text-xs text-gray-500">Xem và xử lý đơn hàng</p>
              </div>
            </router-link>

            <router-link
              to="/manager/users"
              class="flex items-center w-full p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              <div class="flex-shrink-0">
                <svg
                  class="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium">Quản lý người dùng</p>
                <p class="text-xs text-gray-500">Quản lý tài khoản và phân quyền</p>
              </div>
            </router-link>

            <router-link
              to="/manager/reports"
              class="flex items-center w-full p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              <div class="flex-shrink-0">
                <svg
                  class="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium">Báo cáo</p>
                <p class="text-xs text-gray-500">Xem báo cáo và thống kê</p>
              </div>
            </router-link>

            <router-link
              to="/manager/settings"
              class="flex items-center w-full p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              <div class="flex-shrink-0">
                <svg
                  class="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium">Cài đặt</p>
                <p class="text-xs text-gray-500">Cấu hình hệ thống</p>
              </div>
            </router-link>
          </div>
        </div>

        <!-- System Status -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Trạng thái hệ thống</h2>
          </div>
          <div class="p-6 space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-green-400 rounded-full"></div>
                <span class="text-sm text-gray-600">Hệ thống</span>
              </div>
              <span class="text-sm font-medium text-green-600">Hoạt động</span>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-green-400 rounded-full"></div>
                <span class="text-sm text-gray-600">Database</span>
              </div>
              <span class="text-sm font-medium text-green-600">Hoạt động</span>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span class="text-sm text-gray-600">Payment Gateway</span>
              </div>
              <span class="text-sm font-medium text-yellow-600">Chậm</span>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-green-400 rounded-full"></div>
                <span class="text-sm text-gray-600">Storage</span>
              </div>
              <span class="text-sm font-medium text-green-600">75% còn trống</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAllOrders } from '@/modules/orders/orders.api'
import { getAllUsers } from '@/modules/users/users.api'
import type { OrderFilterRequest } from '@/modules/orders/orders.type'
import type { UserSearchParams } from '@/modules/users/users.type'

// Set page title
onMounted(() => {
  document.title = 'Dashboard Quản Lý - SmartShoes'
})

// ================================
// STATE MANAGEMENT
// ================================
const loading = ref(false)

const stats = ref({
  totalOrders: 0, // Từ getAllOrders
  totalUsers: 0, // Từ getAllUsers
  monthlyRevenue: 0, // Tính từ orders trong tháng
  pendingOrders: 0, // Đếm orders có status = 'PENDING'
})

const recentOrders = ref([
  {
    id: 'ORD-004',
    customerName: 'Phạm Văn Cầu',
    itemCount: 1,
    total: 1800000,
    status: 'DELIVERED',
  },
  {
    id: 'ORD-005',
    customerName: 'Hoàng Văn Nam',
    itemCount: 2,
    total: 2900000,
    status: 'PENDING',
  },
])

// ================================
// UTILITY FUNCTIONS
// ================================
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

const getOrderStatusClasses = (status: string): string => {
  const classes: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    SHIPPING: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getOrderStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    SHIPPING: 'Đang giao',
    DELIVERED: 'Đã giao',
    CANCELLED: 'Đã hủy',
  }
  return labels[status] || status
}
/**
 * ✅ Load tổng số users từ getAllUsers API
 */
const loadUserStats = async (): Promise<void> => {
  try {
    console.log('📊 Loading user statistics...')

    // ✅ Lấy tất cả users (page 0, size lớn để đếm tổng)
    const userParams: UserSearchParams = {
      page: 0,
      size: 1000, // Lấy nhiều để đếm tổng (hoặc BE có thể chỉ trả totalElements)
    }

    const usersResponse = await getAllUsers(userParams)

    // ✅ Cập nhật tổng users
    stats.value.totalUsers = usersResponse.totalElements || usersResponse.content.length

    console.log('✅ User stats loaded:', {
      totalUsers: stats.value.totalUsers,
      usersInCurrentPage: usersResponse.content.length,
      totalElements: usersResponse.totalElements,
    })
  } catch (error) {
    console.error('❌ Error loading user stats:', error)
    // Giữ nguyên giá trị mặc định nếu lỗi
  }
}

/**
 * ✅ Load tổng số orders và pending orders từ getAllOrders API
 */
const loadOrderStats = async (): Promise<void> => {
  try {
    console.log('📊 Loading order statistics...')

    // ✅ 1. Lấy tất cả orders để đếm tổng
    const allOrdersFilter: OrderFilterRequest = {
      page: 0,
      size: 1000, // Lấy nhiều để đếm tổng
      sortBy: 'createdAt',
      sortDirection: 'desc',
    }

    const allOrdersResponse = await getAllOrders(allOrdersFilter)

    // ✅ Tổng đơn hàng
    stats.value.totalOrders = allOrdersResponse.totalElements || allOrdersResponse.content.length

    // ✅ 2. Đếm pending orders từ data hiện có
    const pendingCount = allOrdersResponse.content.filter(
      (order) => order.status === 'PENDING',
    ).length
    stats.value.pendingOrders = pendingCount

    // ✅ 3. Tính doanh thu tháng hiện tại
    const currentMonth = new Date().getMonth() + 1 // 1-12
    const currentYear = new Date().getFullYear()

    const monthlyRevenue = allOrdersResponse.content
      .filter((order) => {
        if (!order.createdAt) return false

        const orderDate = new Date(order.createdAt)
        const orderMonth = orderDate.getMonth() + 1
        const orderYear = orderDate.getFullYear()

        return (
          orderMonth === currentMonth && orderYear === currentYear && order.status !== 'CANCELLED'
        ) // Loại bỏ đơn hàng đã hủy
      })
      .reduce((total, order) => total + (order.totalAmount || 0), 0)

    stats.value.monthlyRevenue = monthlyRevenue

    // ✅ 4. Cập nhật recent orders (5 đơn gần nhất)
    const recentOrdersData = allOrdersResponse.content
      .slice(0, 5) // Lấy 5 đơn đầu tiên (đã sort theo createdAt desc)
      .map((order) => ({
        id: order.id,
        customerName: order.shippingName || 'Khách hàng',
        itemCount: order.orderDetails?.length || 0,
        total: order.totalAmount || 0,
        status: order.status,
      }))

    recentOrders.value = recentOrdersData

    console.log('✅ Order stats loaded:', {
      totalOrders: stats.value.totalOrders,
      pendingOrders: stats.value.pendingOrders,
      monthlyRevenue: stats.value.monthlyRevenue,
      recentOrdersCount: recentOrdersData.length,
    })
  } catch (error) {
    console.error('❌ Error loading order stats:', error)
    // Giữ nguyên giá trị mặc định nếu lỗi
  }
}

/**
 * ✅ Load tất cả statistics
 */
const loadDashboardStats = async (): Promise<void> => {
  try {
    loading.value = true
    console.log('🔄 Loading dashboard statistics...')

    // ✅ Load song song để tăng performance
    await Promise.all([loadUserStats(), loadOrderStats()])

    console.log('✅ All dashboard statistics loaded:', stats.value)
  } catch (error) {
    console.error('❌ Error loading dashboard statistics:', error)
  } finally {
    loading.value = false
  }
}

/**
 * ✅ Refresh tất cả data
 */
const refreshData = async (): Promise<void> => {
  console.log('🔄 Refreshing dashboard data...')
  await loadDashboardStats()
}

// ================================
// LIFECYCLE HOOKS
// ================================
onMounted(() => {
  console.log('🚀 Dashboard mounted, loading initial data...')
  loadDashboardStats()
})
</script>

<style scoped>
/* Custom styles for enhanced UI */
* {
  transition-property: color, background-color, border-color, opacity, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Stats card hover effect */
.stats-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.stats-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
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

/* Enhanced hover effects */
button:hover,
a:hover {
  transform: translateY(-1px);
}

/* Focus styles */
button:focus,
a:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Card hover animations */
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Responsive design helpers */
@media (max-width: 640px) {
  .mobile-hide {
    display: none;
  }

  .mobile-stack {
    flex-direction: column;
  }

  .mobile-full-width {
    width: 100%;
  }
}

/* Enhanced gradient backgrounds */
.bg-gradient-to-r {
  background: linear-gradient(to right, var(--tw-gradient-stops));
}

/* Loading skeleton animation */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.skeleton {
  animation: shimmer 1.2s ease-in-out infinite;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
}
</style>

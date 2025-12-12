<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b border-gray-200 mb-6">
      <div class="px-6 py-4 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Top Khách Hàng Tiềm Năng</h1>
          <p class="text-gray-600 mt-1">
            Báo cáo thống kê khách hàng mua nhiều nhất theo thời gian
          </p>
        </div>
        <div class="flex items-center space-x-3">
          <select
            v-model="selectedLimit"
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option :value="5">Top 5</option>
            <option :value="10">Top 10</option>
            <option :value="15">Top 15</option>
            <option :value="20">Top 20</option>
          </select>

          <input type="date" v-model="startDate" class="px-3 py-2 border rounded-md" />
          <input type="date" v-model="endDate" class="px-3 py-2 border rounded-md" />

          <button
            @click="fetchTopCustomers"
            :disabled="loading"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
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
            Lọc
          </button>

          <button
            @click="openPrintPage"
            class="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Xuất PDF
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 px-6">
      <div class="bg-blue-50 rounded-lg p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg
              class="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-blue-600">Tổng khách hàng</p>
            <p class="text-2xl font-bold text-blue-900">{{ topCustomers.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-green-50 rounded-lg p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg
              class="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-green-600">Tổng đơn hàng</p>
            <p class="text-2xl font-bold text-green-900">{{ totalOrders }}</p>
          </div>
        </div>
      </div>

      <div class="bg-purple-50 rounded-lg p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg
              class="w-8 h-8 text-purple-600"
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
          <div class="ml-4">
            <p class="text-sm font-medium text-purple-600">Tổng doanh thu</p>
            <p class="text-2xl font-bold text-purple-900">{{ formatCurrency(totalRevenue) }}</p>
          </div>
        </div>
      </div>

      <div class="bg-yellow-50 rounded-lg p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg
              class="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-yellow-600">Trung bình/KH</p>
            <p class="text-2xl font-bold text-yellow-900">{{ formatCurrency(averageSpent) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Customers Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 mx-6 mb-6">
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-900">Danh sách khách hàng VIP</h2>
        <p class="text-sm text-gray-500">({{ topCustomers.length }} kết quả)</p>
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

      <!-- Empty State -->
      <div v-else-if="!topCustomers.length" class="p-12 text-center text-gray-600">
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Không có khách hàng nào</h3>
        <p class="text-gray-600">Không có dữ liệu khách hàng trong khoảng thời gian này.</p>
      </div>

      <!-- Customers Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Xếp hạng
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Thông tin khách hàng
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email / Tên đăng nhập
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Số đơn hàng
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tổng chi tiêu
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Trung bình/Đơn
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(customer, index) in paginatedCustomers"
              :key="customer.customer.id"
              class="hover:bg-gray-50 transition-colors duration-200"
            >
              <!-- Ranking -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    :class="[
                      'flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold text-white',
                      getRankingColor(index + (currentPage - 1) * itemsPerPage),
                    ]"
                  >
                    {{ index + (currentPage - 1) * itemsPerPage + 1 }}
                  </div>
                </div>
              </td>

              <!-- Customer Info -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div
                      class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center"
                    >
                      <svg
                        class="w-6 h-6 text-gray-600"
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
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ formatCustomerName(customer.customer) }}
                    </div>
                    <div class="text-sm text-gray-500">
                      ID: {{ customer.customer.id.substring(0, 8) }}...
                    </div>
                  </div>
                </div>
              </td>

              <!-- Email / Username -->
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ customer.customer.email }}</div>
                <div class="text-sm text-gray-500">@{{ customer.customer.username }}</div>
              </td>

              <!-- Total Orders -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <svg
                    class="w-4 h-4 text-blue-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <span class="text-sm font-medium text-gray-900"
                    >{{ customer.totalOrders }} đơn</span
                  >
                </div>
              </td>

              <!-- Total Spent -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-bold text-green-600">
                  {{ formatCurrency(customer.totalSpent) }}
                </div>
              </td>

              <!-- Average per Order -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{
                    formatCurrency(
                      customer.totalOrders > 0 ? customer.totalSpent / customer.totalOrders : 0,
                    )
                  }}
                </div>
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getStatusClasses(customer.customer.status),
                  ]"
                >
                  <div
                    :class="[
                      'w-1.5 h-1.5 rounded-full mr-1.5',
                      getStatusDotColor(customer.customer.status),
                    ]"
                  ></div>
                  {{ getStatusLabel(customer.customer.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="topCustomers.length > itemsPerPage"
        class="px-6 py-4 border-t border-gray-200 flex justify-between items-center"
      >
        <div class="text-sm text-gray-700">
          Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} -
          {{ Math.min(currentPage * itemsPerPage, topCustomers.length) }}
          trong tổng số {{ topCustomers.length }} khách hàng
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="previousPage"
            :disabled="currentPage <= 1"
            class="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            Trước
          </button>
          <span class="px-3 py-1 text-sm font-medium">
            Trang {{ currentPage }} / {{ totalPages }}
          </span>
          <button
            @click="nextPage"
            :disabled="currentPage >= totalPages"
            class="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            Sau
          </button>
        </div>
      </div>
    </div>

    <!-- Error Toast -->
    <div
      v-if="errorMessage"
      class="fixed top-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg max-w-md z-50"
    >
      <div class="flex items-start">
        <svg
          class="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0"
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
        <div>
          <p class="font-medium">Lỗi tải dữ liệu:</p>
          <p class="text-sm">{{ errorMessage }}</p>
        </div>
        <button @click="errorMessage = ''" class="ml-4 text-red-400 hover:text-red-600">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  getTopCustomersApi,
  createReportDateRange,
  formatCurrency,
  formatCustomerName,
} from './report.api'
import type { TopCustomerDTO } from '../users/users.type'
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
// State
const topCustomers = ref<TopCustomerDTO[]>([])
const loading = ref(false)
const errorMessage = ref('')

// Filters
const startDate = ref<string>(
  (() => {
    const date = new Date()
    date.setDate(date.getDate() - 30) // Default to last 30 days
    return date.toISOString().slice(0, 10)
  })(),
)

const endDate = ref<string>(new Date().toISOString().slice(0, 10))
const selectedLimit = ref<number>(10) // Default top 10

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

// Computed properties
const totalOrders = computed(() =>
  topCustomers.value.reduce((sum, customer) => sum + customer.totalOrders, 0),
)

const totalRevenue = computed(() =>
  topCustomers.value.reduce((sum, customer) => sum + customer.totalSpent, 0),
)

const averageSpent = computed(() =>
  topCustomers.value.length > 0 ? totalRevenue.value / topCustomers.value.length : 0,
)

const totalPages = computed(() => Math.ceil(topCustomers.value.length / itemsPerPage))

const paginatedCustomers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return topCustomers.value.slice(start, end)
})

// Methods
const fetchTopCustomers = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    console.log('Fetching top customers with dates:', {
      startDate: startDate.value,
      endDate: endDate.value,
    })

    // Convert dates to proper ISO format for API
    const startISO = new Date(startDate.value + 'T00:00:00').toISOString()
    const endISO = new Date(endDate.value + 'T23:59:59').toISOString()

    const response = await getTopCustomersApi(startISO, endISO, selectedLimit.value)
    topCustomers.value = response
    currentPage.value = 1 // Reset to first page

    console.log('✅ Top customers loaded successfully:', response)
  } catch (error: any) {
    console.error('❌ Failed to fetch top customers:', error)
    errorMessage.value = error.message || 'Không thể tải dữ liệu khách hàng'

    // Auto hide error after 5 seconds
    setTimeout(() => {
      errorMessage.value = ''
    }, 5000)
  } finally {
    loading.value = false
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Helper functions
const getRankingColor = (rank: number): string => {
  switch (rank) {
    case 1:
      return 'bg-yellow-500' // Gold
    case 2:
      return 'bg-gray-400' // Silver
    case 3:
      return 'bg-yellow-600' // Bronze
    default:
      return 'bg-blue-500' // Default blue
  }
}

const getStatusClasses = (status: string): string => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800'
    case 'INACTIVE':
      return 'bg-gray-100 text-gray-800'
    case 'BANNED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusDotColor = (status: string): string => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-400'
    case 'INACTIVE':
      return 'bg-gray-400'
    case 'BANNED':
      return 'bg-red-400'
    default:
      return 'bg-gray-400'
  }
}

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'ACTIVE':
      return 'Hoạt động'
    case 'INACTIVE':
      return 'Không hoạt động'
    case 'BANNED':
      return 'Bị cấm'
    default:
      return status
  }
}



// -----------------
// 2️⃣ Export PDF / In
// -----------------
const openPrintPage = () => {
  const url = `/print-customer-report?start=${startDate.value}&end=${endDate.value}&limit=${selectedLimit.value}`;
  window.open(url, "_blank");
};


// Initialize data on mount
onMounted(() => {
  fetchTopCustomers()
})
</script>

<style scoped>
/* Loading animation */
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
  transition-property: color, background-color, border-color, opacity, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Table row hover effects */
tbody tr:hover {
  background-color: #f9fafb;
}

/* Button hover effects */
button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Custom scrollbar for table */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .grid-cols-1.md\:grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }

  .px-6 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@media (max-width: 640px) {
  .grid-cols-1.md\:grid-cols-4 {
    grid-template-columns: 1fr;
  }

  .flex.items-center.space-x-3 {
    flex-direction: column;
    space-x: 0;
    gap: 0.5rem;
  }
}
</style>

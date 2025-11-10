<template>
  <SidebarPart>
    <div class="min-h-screen bg-gray-50">
      <!-- Header Section -->
      <div class="bg-white shadow-sm border-b border-gray-200 mb-6">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
              <p class="text-gray-600 mt-1">Theo dõi và quản lý tất cả đơn hàng trong hệ thống</p>
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
              <!-- Export Button -->
              <button
                @click="exportOrders"
                class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Xuất Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters & Search Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <!-- Search Input -->
            <div class="lg:col-span-2">
              <div class="relative">
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
                <input
                  v-model="searchFilters.q"
                  type="text"
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Tìm theo mã đơn, tên khách hàng, email..."
                  @input="debouncedSearch"
                />
              </div>
            </div>

            <!-- Status Filter -->
            <div>
              <select
                v-model="searchFilters.status"
                @change="handleFilterChange"
                class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>

            <!-- Date From -->
            <div>
              <input
                v-model="searchFilters.createdDate_from"
                type="date"
                @change="handleFilterChange"
                class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Từ ngày"
              />
            </div>

            <!-- Date To -->
            <div>
              <input
                v-model="searchFilters.createdDate_to"
                type="date"
                @change="handleFilterChange"
                class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Đến ngày"
              />
            </div>

            <!-- Clear Filters -->
            <div class="lg:col-span-5 flex justify-end">
              <button
                @click="clearFilters"
                class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Xóa bộ lọc
              </button>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div class="bg-blue-50 rounded-lg p-4 stats-card">
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-blue-600">Tổng đơn</p>
                  <p class="text-2xl font-bold text-blue-900">{{ stats.total }}</p>
                </div>
              </div>
            </div>

            <div class="bg-yellow-50 rounded-lg p-4 stats-card">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-yellow-600">Chờ xác nhận</p>
                  <p class="text-2xl font-bold text-yellow-900">{{ stats.pending }}</p>
                </div>
              </div>
            </div>

            <div class="bg-purple-50 rounded-lg p-4 stats-card">
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
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-purple-600">Đang giao</p>
                  <p class="text-2xl font-bold text-purple-900">{{ stats.shipping }}</p>
                </div>
              </div>
            </div>

            <div class="bg-green-50 rounded-lg p-4 stats-card">
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
                  <p class="text-sm font-medium text-green-600">Hoàn thành</p>
                  <p class="text-2xl font-bold text-green-900">{{ stats.delivered }}</p>
                </div>
              </div>
            </div>

            <div class="bg-red-50 rounded-lg p-4 stats-card">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg
                    class="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                    />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-red-600">Đã hủy</p>
                  <p class="text-2xl font-bold text-red-900">{{ stats.cancelled }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">
              Danh sách đơn hàng
              <span class="text-sm font-normal text-gray-500 ml-2">
                ({{ pagedData?.totalElements || 0 }} kết quả)
              </span>
            </h2>
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

        <!-- Empty State -->
        <div v-else-if="!pagedData?.content?.length" class="p-12 text-center">
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
          <h3 class="text-lg font-medium text-gray-900 mb-2">Không có đơn hàng nào</h3>
          <p class="text-gray-600 mb-4">
            Chưa có đơn hàng nào trong hệ thống hoặc không tìm thấy kết quả phù hợp.
          </p>
        </div>

        <!-- Orders Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <!-- Order ID Column -->
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <button
                    @click="handleSort('id')"
                    class="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  >
                    <span>Mã đơn hàng</span>
                    <div class="flex flex-col">
                      <svg
                        :class="[
                          'w-3 h-3 transition-colors',
                          sortConfig.sortBy === 'id' && sortConfig.sortDirection === 'asc'
                            ? 'text-indigo-600'
                            : 'text-gray-400',
                        ]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <svg
                        :class="[
                          'w-3 h-3 -mt-1 transition-colors',
                          sortConfig.sortBy === 'id' && sortConfig.sortDirection === 'desc'
                            ? 'text-indigo-600'
                            : 'text-gray-400',
                        ]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </button>
                </th>

                <!-- Customer Column -->
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Khách hàng
                </th>

                <!-- Items Column -->
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Sản phẩm
                </th>

                <!-- Total Amount Column -->
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <button
                    @click="handleSort('totalAmount')"
                    class="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  >
                    <span>Tổng tiền</span>
                    <div class="flex flex-col">
                      <svg
                        :class="[
                          'w-3 h-3 transition-colors',
                          sortConfig.sortBy === 'totalAmount' && sortConfig.sortDirection === 'asc'
                            ? 'text-indigo-600'
                            : 'text-gray-400',
                        ]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <svg
                        :class="[
                          'w-3 h-3 -mt-1 transition-colors',
                          sortConfig.sortBy === 'totalAmount' && sortConfig.sortDirection === 'desc'
                            ? 'text-indigo-600'
                            : 'text-gray-400',
                        ]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </button>
                </th>

                <!-- Status Column -->
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <button
                    @click="handleSort('status')"
                    class="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  >
                    <span>Trạng thái</span>
                    <div class="flex flex-col">
                      <svg
                        :class="[
                          'w-3 h-3 transition-colors',
                          sortConfig.sortBy === 'status' && sortConfig.sortDirection === 'asc'
                            ? 'text-indigo-600'
                            : 'text-gray-400',
                        ]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <svg
                        :class="[
                          'w-3 h-3 -mt-1 transition-colors',
                          sortConfig.sortBy === 'status' && sortConfig.sortDirection === 'desc'
                            ? 'text-indigo-600'
                            : 'text-gray-400',
                        ]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </button>
                </th>

                <!-- Created Date Column -->
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <button
                    @click="handleSort('createdAt')"
                    class="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  >
                    <span>Ngày tạo</span>
                    <div class="flex flex-col">
                      <svg
                        :class="[
                          'w-3 h-3 transition-colors',
                          sortConfig.sortBy === 'createdAt' && sortConfig.sortDirection === 'asc'
                            ? 'text-indigo-600'
                            : 'text-gray-400',
                        ]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <svg
                        :class="[
                          'w-3 h-3 -mt-1 transition-colors',
                          sortConfig.sortBy === 'createdAt' && sortConfig.sortDirection === 'desc'
                            ? 'text-indigo-600'
                            : 'text-gray-400',
                        ]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </button>
                </th>

                <!-- Actions Column -->
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="order in pagedData?.content || []"
                :key="order.id"
                class="hover:bg-gray-50 transition-colors duration-200"
              >
                <!-- Order ID -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div
                        class="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center"
                      >
                        <span class="text-sm font-medium text-white">
                          #{{ order.id.substring(0, 4).toUpperCase() }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ order.id }}</div>
                      <div class="text-sm text-gray-500">
                        {{ getOrderItemCount(order) }} sản phẩm
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Customer Info -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ order.shippingName }}</div>
                  <div class="text-sm text-gray-500">{{ order.shippingPhone }}</div>
                </td>

                <!-- Items -->
                <td class="px-6 py-4">
                  <div class="max-w-xs">
                    <div v-if="order.orderDetails && order.orderDetails.length > 0">
                      <div
                        v-for="(item, index) in order.orderDetails.slice(0, 2)"
                        :key="index"
                        class="text-sm text-gray-900 truncate"
                      >
                        <!-- ✅ SỬA: Sử dụng getProductName helper function -->
                        {{ getProductName(item) }}
                        <span class="text-gray-500">x{{ item.quantity }}</span>
                      </div>
                      <div
                        v-if="order.orderDetails.length > 2"
                        class="text-sm text-gray-500 italic"
                      >
                        +{{ order.orderDetails.length - 2 }} sản phẩm khác
                      </div>
                    </div>
                    <div v-else class="text-sm text-gray-500 italic">Không có sản phẩm</div>
                  </div>
                </td>

                <!-- Total Amount -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-semibold text-gray-900">
                    {{ formatOrderTotal(order.totalAmount) }}
                  </div>
                </td>

                <!-- Status -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getStatusClasses(order.status),
                    ]"
                  >
                    {{ getStatusLabel(order.status) }}
                  </span>
                </td>

                <!-- Created Date -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(order.createdAt) }}
                </td>

                <!-- Actions -->
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="relative inline-block text-left">
                    <button
                      @click="toggleOrderMenu(order.id)"
                      class="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>

                    <div
                      v-if="activeOrderMenu === order.id"
                      class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                    >
                      <div class="py-1">
                        <button
                          @click="viewOrderDetails(order)"
                          class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Xem chi tiết
                        </button>
                        <button
                          @click="openStatusModal(order)"
                          class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Cập nhật trạng thái
                        </button>
                        <button
                          v-if="order.status === 'PENDING'"
                          @click="cancelOrderAction(order.id)"
                          class="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                        >
                          Hủy đơn hàng
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          v-if="pagedData && pagedData.totalPages > 1"
          class="px-6 py-4 border-t border-gray-200"
        >
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Hiển thị {{ searchFilters.page * searchFilters.size + 1 }} -
              {{ Math.min((searchFilters.page + 1) * searchFilters.size, pagedData.totalElements) }}
              trong tổng số {{ pagedData.totalElements }} kết quả
            </div>

            <div class="flex items-center space-x-2">
              <button
                @click="handlePageChange(searchFilters.page - 1)"
                :disabled="searchFilters.page <= 0"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>

              <span class="text-sm text-gray-700">
                Trang {{ searchFilters.page + 1 }} / {{ pagedData.totalPages }}
              </span>

              <button
                @click="handlePageChange(searchFilters.page + 1)"
                :disabled="searchFilters.page >= pagedData.totalPages - 1"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Status Update Modal -->
      <div
        v-if="showStatusModal"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      >
        <div
          class="relative top-20 mx-auto p-5 border w-11/12 md:w-1/3 shadow-lg rounded-md bg-white"
        >
          <div class="mt-3">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Cập nhật trạng thái đơn hàng</h3>
              <button @click="closeStatusModal" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div class="mb-4">
              <p class="text-sm text-gray-600">
                Đơn hàng: <strong>{{ selectedOrder?.id }}</strong>
              </p>
              <p class="text-sm text-gray-600">
                Trạng thái hiện tại:
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2',
                    getStatusClasses(selectedOrder?.status || ''),
                  ]"
                >
                  {{ getStatusLabel(selectedOrder?.status || '') }}
                </span>
              </p>
            </div>

            <form @submit.prevent="handleUpdateStatus" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Chọn trạng thái mới
                </label>
                <select
                  v-model="newStatus"
                  required
                  class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option
                    v-for="option in statusOptions.slice(1)"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <div class="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  @click="closeStatusModal"
                  class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  :disabled="submitting"
                  class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  {{ submitting ? 'Đang cập nhật...' : 'Cập nhật' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Success Toast -->
      <Transition
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showSuccessToast"
          class="fixed top-4 right-4 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden z-50"
        >
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg
                  class="h-6 w-6 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900">Thành công!</p>
                <p class="mt-1 text-sm text-gray-500">{{ successMessage }}</p>
              </div>
              <div class="ml-4 flex-shrink-0 flex">
                <button
                  @click="showSuccessToast = false"
                  class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500"
                >
                  <svg
                    class="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Error Toast -->
      <Transition
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showNoticeToast"
          class="fixed top-4 right-4 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden z-50"
        >
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg
                  class="h-6 w-6 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900">Lỗi</p>
                <p class="mt-1 text-sm text-gray-500">{{ noticeMessage }}</p>
              </div>
              <div class="ml-4 flex-shrink-0 flex">
                <button
                  @click="showNoticeToast = false"
                  class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500"
                >
                  <svg
                    class="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </SidebarPart>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import SidebarPart from '@/common/component/SidebarPart.vue'
import {
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderItemCount,
  formatOrderTotal,
} from '../orders.api'
import type {
  Order,
  OrderFilterRequest,
  PaginationResponse,
  OrderStatus,
  UpdateStatusRequest,
} from '../orders.type'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, createOrderFilter } from '../orders.type'
import { getVariantWithProductByIdApi } from '@/modules/products/product.api'
import type { ProductVariantWithProduct } from '@/modules/products/product.type'

// ✅ Custom debounce function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// ================================
// COMPOSABLES & UTILS
// ================================
const router = useRouter()

// ✅ Toast state management
const showSuccessToast = ref(false)
const successMessage = ref('')
const showNoticeToast = ref(false)
const noticeMessage = ref('')

// ✅ Toast helper functions
const showSuccess = (message: string) => {
  successMessage.value = message
  showSuccessToast.value = true
  setTimeout(() => {
    showSuccessToast.value = false
  }, 3000)
}

const showError = (message: string) => {
  noticeMessage.value = message
  showNoticeToast.value = true
  setTimeout(() => {
    showNoticeToast.value = false
  }, 4000)
}

// ================================
// STATE MANAGEMENT
// ================================
const loading = ref(false)
const submitting = ref(false)

// Data
const pagedData = ref<PaginationResponse<Order> | null>(null)

// ✅ THÊM: Cache để lưu thông tin variant đã fetch - SAME AS OrderDetailView
const variantCache = ref<Map<string, ProductVariantWithProduct>>(new Map())

// Modals
const showStatusModal = ref(false)
const selectedOrder = ref<Order | null>(null)
const newStatus = ref<OrderStatus | string>('')

// UI State
const activeOrderMenu = ref<string | null>(null)

// Search & Filters - ✅ Sử dụng BE API filters
const searchFilters = reactive<OrderFilterRequest>({
  q: '',
  status: '',
  createdDate_from: '',
  createdDate_to: '',
  userId: '',
  page: 0,
  size: 10,
  sortBy: 'createdAt',
  sortDirection: 'desc',
})

// ✅ Sort config - sync với searchFilters
const sortConfig = reactive({
  sortBy: 'createdAt',
  sortDirection: 'desc',
})

// ✅ THÊM: HELPER FUNCTIONS - SAME AS OrderDetailView
const getProductName = (item: any) => {
  console.log('📦 Getting product name for item:', item)

  // ✅ Lấy từ cache variant đã fetch
  const variantInfo = variantCache.value.get(item.productVariantId)
  if (variantInfo?.product?.name) {
    console.log('✅ Found product name from API cache:', variantInfo.product.name)
    return variantInfo.product.name
  }

  // Fallback - từ data có sẵn trong order
  if (item.productVariant?.product?.name) {
    console.log('✅ Found product name from populated data:', item.productVariant.product.name)
    return item.productVariant.product.name
  }

  if (item.productVariant?.name) {
    console.log('✅ Found variant name:', item.productVariant.name)
    return item.productVariant.name
  }

  // Fallback với productVariantId
  const fallbackName = `Sản phẩm #${item.productVariantId?.slice(-8) || 'Unknown'}`
  console.log('⚠️ Using fallback name:', fallbackName)
  return fallbackName
}

// ✅ Load thông tin variant từ API cho tất cả order details
const loadVariantInfoForOrders = async () => {
  if (!pagedData.value?.content) return

  console.log('🔄 Loading variant info for all orders...')

  // ✅ Collect tất cả productVariantId unique từ tất cả orders
  const allVariantIds = new Set<string>()

  pagedData.value.content.forEach((order) => {
    if (order.orderDetails) {
      order.orderDetails.forEach((detail) => {
        if (detail.productVariantId && !variantCache.value.has(detail.productVariantId)) {
          allVariantIds.add(detail.productVariantId)
        }
      })
    }
  })

  if (allVariantIds.size === 0) {
    console.log('ℹ️ No new variants to fetch')
    return
  }

  console.log(`📊 Need to fetch ${allVariantIds.size} variants:`, Array.from(allVariantIds))

  // ✅ Fetch variant info song song
  const promises = Array.from(allVariantIds).map(async (variantId) => {
    try {
      console.log(`🔍 Fetching variant info for: ${variantId}`)
      const variantWithProduct = await getVariantWithProductByIdApi(variantId)
      variantCache.value.set(variantId, variantWithProduct)
      console.log(`✅ Loaded variant info:`, {
        variantId,
        productName: variantWithProduct.product?.name,
        size: variantWithProduct.size,
        colorName: variantWithProduct.colorName || variantWithProduct.color?.name,
      })
    } catch (error) {
      console.error(`❌ Error loading variant ${variantId}:`, error)
    }
  })

  await Promise.all(promises)
  console.log('✅ All variant info loaded for orders')
}

// ================================
// OPTIONS & CONSTANTS
// ================================
const statusOptions = [
  { label: 'Tất cả trạng thái', value: '' },
  { label: 'Chờ xác nhận', value: 'PENDING' },
  { label: 'Đã thanh toán', value: 'PAID' },
  { label: 'Đã xác nhận', value: 'CONFIRMED' },
  { label: 'Đang giao hàng', value: 'SHIPPING' },
  { label: 'Đã giao hàng', value: 'DELIVERED' },
  { label: 'Đã hủy', value: 'CANCELLED' },
]

// ================================
// COMPUTED PROPERTIES
// ================================
const stats = computed(() => {
  if (!pagedData.value?.content) {
    return { total: 0, pending: 0, shipping: 0, delivered: 0, cancelled: 0 }
  }

  const orders = pagedData.value.content
  return {
    total: pagedData.value.totalElements || 0,
    pending: orders.filter((o) => o.status === 'PENDING').length,
    shipping: orders.filter((o) => o.status === 'SHIPPING').length,
    delivered: orders.filter((o) => o.status === 'DELIVERED').length,
    cancelled: orders.filter((o) => o.status === 'CANCELLED').length,
  }
})

// ================================
// UTILITY FUNCTIONS
// ================================
const getStatusClasses = (status: string): string => {
  const colorKey = ORDER_STATUS_COLORS[status as OrderStatus] || 'gray'

  const classes: Record<string, string> = {
    yellow: 'bg-yellow-100 text-yellow-800',
    orange: 'bg-orange-100 text-orange-800',
    blue: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800',
  }

  return classes[colorKey] || classes.gray
}

const getStatusLabel = (status: string): string => {
  return ORDER_STATUS_LABELS[status as OrderStatus] || status
}

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
}

const toggleOrderMenu = (orderId: string): void => {
  activeOrderMenu.value = activeOrderMenu.value === orderId ? null : orderId
}

// ================================
// API METHODS - ✅ Sử dụng BE filtering/sorting
// ================================
const loadOrders = async (): Promise<void> => {
  try {
    loading.value = true
    console.log('🔄 Loading orders from API with filters:', searchFilters)

    const filterRequest = createOrderFilter({
      q: searchFilters.q || undefined,
      status: searchFilters.status || undefined,
      createdDate_from: searchFilters.createdDate_from || undefined,
      createdDate_to: searchFilters.createdDate_to || undefined,
      userId: searchFilters.userId || undefined,
      page: searchFilters.page,
      size: searchFilters.size,
      sortBy: searchFilters.sortBy,
      sortDirection: searchFilters.sortDirection,
    })

    const response = await getAllOrders(filterRequest)
    console.log('✅ Orders loaded successfully:', response)

    pagedData.value = response
    activeOrderMenu.value = null

    // ✅ THÊM: Load variant info cho tất cả orders sau khi load xong
    if (response.content && response.content.length > 0) {
      await loadVariantInfoForOrders()
    }
  } catch (error: any) {
    console.error('❌ Error loading orders:', error)
    showError('Không thể tải danh sách đơn hàng. Vui lòng thử lại.')
  } finally {
    loading.value = false
  }
}

const refreshData = (): void => {
  console.log('🔄 Refreshing order data...')
  loadOrders()
}

// ================================
// SEARCH & FILTER METHODS - ✅ Sử dụng BE API
// ================================
const debouncedSearch = debounce((): void => {
  console.log('🔍 Performing BE search with:', searchFilters.q)
  searchFilters.page = 0 // Reset to first page
  loadOrders()
}, 300)

const handleFilterChange = (): void => {
  console.log('🎯 Filter changed, calling BE API')
  searchFilters.page = 0 // Reset to first page
  loadOrders()
}

// ================================
// SORTING METHODS - ✅ Sử dụng BE API
// ================================
const handleSort = (field: string): void => {
  console.log('🔄 BE sorting by:', field)

  if (sortConfig.sortBy === field) {
    // Toggle direction if same field
    sortConfig.sortDirection = sortConfig.sortDirection === 'asc' ? 'desc' : 'asc'
  } else {
    // Set new field with descending direction (thường dùng cho orders)
    sortConfig.sortBy = field
    sortConfig.sortDirection = 'desc'
  }

  // ✅ Sync với searchFilters
  searchFilters.sortBy = sortConfig.sortBy
  searchFilters.sortDirection = sortConfig.sortDirection
  searchFilters.page = 0 // Reset to first page

  console.log('📊 Sort config:', {
    sortBy: sortConfig.sortBy,
    sortDirection: sortConfig.sortDirection,
  })

  loadOrders() // Call BE API với sort mới
}

const clearFilters = (): void => {
  console.log('🧹 Clearing all filters and sorting...')

  // Clear search filters
  Object.assign(searchFilters, {
    q: '',
    status: '',
    createdDate_from: '',
    createdDate_to: '',
    userId: '',
    page: 0,
    size: 10,
    sortBy: 'createdAt',
    sortDirection: 'desc',
  })

  // Clear sorting
  sortConfig.sortBy = 'createdAt'
  sortConfig.sortDirection = 'desc'

  loadOrders() // Call BE API với filters cleared
}

const handlePageChange = (page: number): void => {
  console.log('📄 Page changed to:', page)
  searchFilters.page = page
  loadOrders() // Call BE API với page mới
}

// ================================
// ORDER MANAGEMENT METHODS
// ================================
const openStatusModal = (order: Order): void => {
  console.log('📝 Opening status modal for order:', order.id)
  selectedOrder.value = order
  newStatus.value = order.status
  showStatusModal.value = true
  activeOrderMenu.value = null
}

const closeStatusModal = (): void => {
  console.log('❌ Closing status modal')
  showStatusModal.value = false
  selectedOrder.value = null
  newStatus.value = ''
}

const handleUpdateStatus = async (): Promise<void> => {
  if (!selectedOrder.value || !newStatus.value) {
    showError('Vui lòng chọn trạng thái mới')
    return
  }

  try {
    submitting.value = true
    console.log('📝 Updating order status:', {
      orderId: selectedOrder.value.id,
      newStatus: newStatus.value,
    })

    const updateRequest: UpdateStatusRequest = {
      status: newStatus.value as OrderStatus,
    }

    await updateOrderStatus(selectedOrder.value.id, updateRequest)
    showSuccess('Cập nhật trạng thái đơn hàng thành công')

    closeStatusModal()
    await loadOrders() // Reload data từ BE
  } catch (error: any) {
    console.error('❌ Error updating status:', error)
    showError(`Không thể cập nhật trạng thái: ${error?.message || 'Có lỗi xảy ra'}`)
  } finally {
    submitting.value = false
  }
}

const cancelOrderAction = async (orderId: string): Promise<void> => {
  try {
    const order = pagedData.value?.content.find((o) => o.id === orderId)
    if (!order) {
      showError('Không tìm thấy đơn hàng')
      return
    }

    // ✅ Kiểm tra trạng thái có thể hủy
    if (order.status !== 'PENDING') {
      showError('Chỉ có thể hủy đơn hàng ở trạng thái "Chờ xác nhận"')
      return
    }

    if (!confirm(`Bạn có chắc chắn muốn hủy đơn hàng ${order.id}?`)) {
      return
    }

    console.log('🚫 Cancelling order:', orderId)

    await cancelOrder(orderId) // ✅ Gọi API với orderId
    showSuccess('Hủy đơn hàng thành công')

    activeOrderMenu.value = null // ✅ Đóng menu
    await loadOrders() // Reload data từ BE
  } catch (error: any) {
    console.error('❌ Error cancelling order:', error)
    showError(`Không thể hủy đơn hàng: ${error?.message || 'Có lỗi xảy ra'}`)
  }
}

const viewOrderDetails = (order: Order): void => {
  console.log('👁️ Viewing order details:', order.id)
  // TODO: Navigate to order details page
  router.push(`/orders/${order.id}`)
  activeOrderMenu.value = null
}

const exportOrders = (): void => {
  console.log('📤 Exporting orders...')
  // TODO: Implement export functionality
  showSuccess('Tính năng xuất Excel sẽ được thêm vào sau')
}

// ================================
// CLICK OUTSIDE HANDLERS
// ================================
const handleClickOutside = (event: Event): void => {
  const target = event.target as Element
  if (!target?.closest('.relative')) {
    activeOrderMenu.value = null
  }
}

// ================================
// LIFECYCLE HOOKS
// ================================
onMounted(() => {
  console.log('🚀 OrderManagerList component mounted')
  loadOrders()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  console.log('💀 OrderManagerList component unmounted')
  document.removeEventListener('click', handleClickOutside)
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

button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}

tbody tr:hover {
  background-color: #f8fafc;
  transform: scale(1.001);
}

.stats-card {
  transition: all 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  ring: 2px;
  ring-color: #3b82f6;
  border-color: #3b82f6;
}

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
</style>

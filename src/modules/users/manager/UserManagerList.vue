<template>
  <SidebarPart>
    <div class="min-h-screen bg-gray-50">
      <!-- Header Section -->
      <div class="bg-white shadow-sm border-b border-gray-200 mb-6">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
              <p class="text-gray-600 mt-1">Quản lý tài khoản và phân quyền người dùng</p>
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
              <!-- Create User Button -->
              <button
                @click="openCreateUserModal"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Thêm người dùng
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters & Search Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  v-model="searchFilters.email"
                  type="text"
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Tìm kiếm theo email..."
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

            <!-- Clear Filters -->
            <div class="flex justify-end">
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
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-blue-600">Tổng số</p>
                  <p class="text-2xl font-bold text-blue-900">{{ stats.total }}</p>
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
                  <p class="text-sm font-medium text-green-600">Hoạt động</p>
                  <p class="text-2xl font-bold text-green-900">{{ stats.active }}</p>
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
                      d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-yellow-600">Tạm khóa</p>
                  <p class="text-2xl font-bold text-yellow-900">{{ stats.inactive }}</p>
                </div>
              </div>
            </div>

            <div class="bg-red-50 rounded-lg p-4">
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
                  <p class="text-sm font-medium text-red-600">Đã cấm</p>
                  <p class="text-2xl font-bold text-red-900">{{ stats.banned }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">
              Danh sách người dùng
              <span class="text-sm font-normal text-gray-500 ml-2">
                ({{ pagedData?.totalElements || 0 }} kết quả)
              </span>
            </h2>

            <!-- Bulk Actions -->
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Không có người dùng nào</h3>
          <p class="text-gray-600 mb-4">
            Chưa có người dùng nào trong hệ thống hoặc không tìm thấy kết quả phù hợp.
          </p>
          <button
            @click="openCreateUserModal"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Thêm người dùng đầu tiên
          </button>
        </div>

        <!-- Users Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <!-- Sortable User Column -->
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <button
                    @click="handleSort('firstName')"
                    class="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  >
                    <span>Người dùng</span>
                    <div class="flex flex-col">
                      <svg
                        :class="[
                          'w-3 h-3 transition-colors',
                          sortConfig.field === 'firstName' && sortConfig.direction === 'asc'
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
                          sortConfig.field === 'firstName' && sortConfig.direction === 'desc'
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

                <!-- Sortable Email Column -->
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <button
                    @click="handleSort('email')"
                    class="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  >
                    <span>Thông tin liên hệ</span>
                    <div class="flex flex-col">
                      <svg
                        :class="[
                          'w-3 h-3 transition-colors',
                          sortConfig.field === 'email' && sortConfig.direction === 'asc'
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
                          sortConfig.field === 'email' && sortConfig.direction === 'desc'
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

                <!-- Non-sortable Role Column -->
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Vai trò
                </th>

                <!-- Sortable Status Column -->
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
                          sortConfig.field === 'status' && sortConfig.direction === 'asc'
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
                          sortConfig.field === 'status' && sortConfig.direction === 'desc'
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

                <!-- Sortable Created Date Column -->
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
                          sortConfig.field === 'createdAt' && sortConfig.direction === 'asc'
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
                          sortConfig.field === 'createdAt' && sortConfig.direction === 'desc'
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

                <!-- Non-sortable Actions Column -->
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="user in sortedAndFilteredData?.content || []"
                :key="user.id"
                class="hover:bg-gray-50 transition-colors duration-200"
              >
                <!-- User Info -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div
                        class="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center"
                      >
                        <span class="text-sm font-medium text-white">
                          {{ getInitials(user) }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ user.firstName }} {{ user.lastName }}
                      </div>
                      <div class="text-sm text-gray-500">@{{ user.username }}</div>
                    </div>
                  </div>
                </td>

                <!-- Contact Info -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ user.email }}</div>
                  <div class="text-sm text-gray-500">
                    {{ user.phoneNumber || 'Chưa có số điện thoại' }}
                  </div>
                </td>

                <!-- Roles -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="role in user.roles || []"
                      :key="role"
                      :class="[
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        getRoleClasses(role),
                      ]"
                    >
                      {{ formatRoleName(role) }}
                    </span>
                    <button
                      v-if="!user.roles || user.roles.length === 0"
                      @click="openRoleModal(user)"
                      class="text-xs text-gray-500 hover:text-indigo-600"
                    >
                      Chưa có vai trò
                    </button>
                  </div>
                </td>

                <!-- Status -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getStatusClasses(user.status),
                    ]"
                  >
                    {{ getStatusLabel(user.status) }}
                  </span>
                </td>

                <!-- Created Date -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(user.createdAt) }}
                </td>

                <!-- Actions -->
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="relative inline-block text-left">
                    <button
                      @click="toggleUserMenu(user.id)"
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
                      v-if="activeUserMenu === user.id"
                      class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                    >
                      <div class="py-1">
                        <button
                          @click="openEditUserModal(user)"
                          class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Chỉnh sửa
                        </button>
                        <button
                          @click="openRoleModal(user)"
                          class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Quản lý vai trò
                        </button>
                        <button
                          @click="openDeleteModal(user)"
                          class="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                        >
                          Xóa
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
          v-if="sortedAndFilteredData && sortedAndFilteredData.totalPages > 1"
          class="px-6 py-4 border-t border-gray-200"
        >
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Hiển thị {{ (currentPage - 1) * pageSize + 1 }} -
              {{ Math.min(currentPage * pageSize, sortedAndFilteredData.totalElements) }}
              trong tổng số {{ sortedAndFilteredData.totalElements }} kết quả
            </div>

            <div class="flex items-center space-x-2">
              <button
                @click="handlePageChange(currentPage - 1)"
                :disabled="currentPage <= 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>

              <span class="text-sm text-gray-700">
                Trang {{ currentPage }} / {{ sortedAndFilteredData.totalPages }}
              </span>

              <button
                @click="handlePageChange(currentPage + 1)"
                :disabled="currentPage >= sortedAndFilteredData.totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Create/Edit User Modal -->
      <div
        v-if="showUserModal"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      >
        <div
          class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/5 lg:w-1/2 shadow-lg rounded-md bg-white"
        >
          <div class="mt-3">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ isEditMode ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới' }}
              </h3>
              <button @click="closeUserModal" class="text-gray-400 hover:text-gray-600">
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

            <form @submit.prevent="handleSubmitUser" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Họ *</label>
                  <input
                    v-model="userForm.firstName"
                    type="text"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Nhập họ"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Tên *</label>
                  <input
                    v-model="userForm.lastName"
                    type="text"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Nhập tên"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Tên đăng nhập *</label>
                <input
                  v-model="userForm.username"
                  type="text"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Nhập tên đăng nhập"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Email *</label>
                <input
                  v-model="userForm.email"
                  type="email"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Nhập email"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Số điện thoại</label>
                  <input
                    v-model="userForm.phoneNumber"
                    type="text"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Giới tính</label>
                  <select
                    v-model="userForm.gender"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Chọn giới tính</option>
                    <option
                      v-for="option in genderOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Ngày sinh</label>
                <input
                  v-model="userForm.birthday"
                  type="date"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Trạng thái *</label>
                  <select
                    v-model="userForm.status"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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

                <div v-if="!isEditMode">
                  <label class="block text-sm font-medium text-gray-700">Mật khẩu *</label>
                  <input
                    v-model="userForm.password"
                    type="password"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Nhập mật khẩu"
                  />
                </div>
              </div>

              <div class="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  @click="closeUserModal"
                  class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  :disabled="submitting"
                  class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {{ submitting ? 'Đang xử lý...' : isEditMode ? 'Cập nhật' : 'Tạo mới' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Role Management Modal -->
      <div
        v-if="showRoleModal"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      >
        <div
          class="relative top-20 mx-auto p-5 border w-11/12 md:w-2/5 shadow-lg rounded-md bg-white"
        >
          <div class="mt-3">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">
                Quản lý vai trò - {{ selectedUser?.firstName }} {{ selectedUser?.lastName }}
              </h3>
              <button @click="closeRoleModal" class="text-gray-400 hover:text-gray-600">
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

            <div class="space-y-4">
              <!-- Current Roles -->
              <div>
                <h4 class="text-sm font-medium text-gray-900 mb-2">Vai trò hiện tại:</h4>
                <div class="flex flex-wrap gap-2">
                  <template
                    v-if="
                      selectedUser?.roles &&
                      Array.isArray(selectedUser.roles) &&
                      selectedUser.roles.length > 0
                    "
                  >
                    <span
                      v-for="(role, index) in selectedUser.roles"
                      :key="`current-${index}-${typeof role === 'string' ? role : role.id || role.name}`"
                      :class="[
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        getRoleClasses(role),
                      ]"
                    >
                      {{ formatRoleName(role) }}
                      <button
                        @click="
                          handleRemoveRole(
                            selectedUser.id,
                            typeof role === 'string' ? role : role.id,
                          )
                        "
                        class="ml-1 text-current hover:text-red-600 focus:outline-none"
                        :title="`Xóa vai trò ${formatRoleName(role)}`"
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </span>
                  </template>
                  <div v-else class="text-sm text-gray-500 italic bg-gray-50 px-3 py-2 rounded-md">
                    Chưa có vai trò nào được gán
                  </div>
                </div>
              </div>

              <!-- Available Roles -->
              <div>
                <h4 class="text-sm font-medium text-gray-900 mb-2">Gán vai trò mới:</h4>

                <!-- ✅ Loading state -->
                <div v-if="loading" class="text-center py-6">
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
                      ></path>
                    </svg>
                    <span class="text-gray-600">Đang tải vai trò...</span>
                  </div>
                </div>

                <!-- ✅ Empty state - No hardcode fallback -->
                <div v-else-if="availableRoles.length === 0" class="text-center py-6">
                  <div class="text-gray-500 mb-3">
                    <svg
                      class="w-12 h-12 mx-auto text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.7-2.6"
                      ></path>
                    </svg>
                  </div>
                  <div class="text-gray-500 mb-3">Không tìm thấy vai trò khả dụng</div>
                  <p class="text-sm text-gray-400 mb-4">
                    Vui lòng liên hệ quản trị viên để thiết lập vai trò hoặc kiểm tra kết nối API.
                  </p>
                  <div class="flex gap-2 justify-center">
                    <button
                      @click="loadRoles"
                      class="px-4 py-2 bg-indigo-500 text-white rounded-md text-sm hover:bg-indigo-600 transition-colors"
                    >
                      🔄 Thử lại
                    </button>
                    <button
                      @click="debugAvailableRoles"
                      class="px-4 py-2 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600 transition-colors"
                    >
                      🐛 Debug
                    </button>
                  </div>
                </div>

                <!-- ✅ Show roles list when available -->
                <div v-else class="space-y-2">
                  <button
                    v-for="role in availableRoles"
                    :key="role.id"
                    @click="handleAssignRole(selectedUser.id, role.id)"
                    :disabled="isRoleAssigned(selectedUser?.roles || [], role.id)"
                    class="w-full text-left px-3 py-3 border border-gray-300 rounded-md text-sm transition-colors duration-200"
                    :class="{
                      'bg-green-50 border-green-200 cursor-not-allowed opacity-75': isRoleAssigned(
                        selectedUser?.roles || [],
                        role.id,
                      ),
                      'hover:bg-gray-50 hover:border-indigo-300': !isRoleAssigned(
                        selectedUser?.roles || [],
                        role.id,
                      ),
                    }"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex flex-col">
                        <span class="font-medium text-gray-900">{{ role.name }}</span>
                        <span class="text-sm text-gray-500">{{ role.description }}</span>
                        <span class="text-xs text-gray-400 mt-1">{{ role.id }}</span>
                      </div>
                      <div class="flex items-center">
                        <span
                          v-if="isRoleAssigned(selectedUser?.roles || [], role.id)"
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
                        >
                          ✓ Đã gán
                        </span>
                        <span
                          v-else
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                        >
                          + Gán vai trò
                        </span>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex justify-end pt-6 border-t border-gray-200 mt-6">
              <button
                @click="closeRoleModal"
                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      >
        <div
          class="relative top-20 mx-auto p-5 border w-11/12 md:w-1/3 shadow-lg rounded-md bg-white"
        >
          <div class="mt-3">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Xác nhận xóa</h3>

            <div class="flex items-center space-x-3 mb-6">
              <div class="flex-shrink-0">
                <svg
                  class="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-900">
                  Bạn có chắc chắn muốn xóa người dùng
                  <strong>{{ userToDelete?.firstName }} {{ userToDelete?.lastName }}</strong
                  >?
                </p>
                <p class="text-sm text-gray-500 mt-1">Hành động này không thể hoàn tác.</p>
              </div>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                @click="showDeleteModal = false"
                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                @click="confirmDeleteUser"
                :disabled="submitting"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
              >
                {{ submitting ? 'Đang xóa...' : 'Xóa' }}
              </button>
            </div>
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
                  class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                <p class="text-sm font-medium text-gray-900">Thông báo</p>
                <p class="mt-1 text-sm text-gray-500">{{ noticeMessage }}</p>
              </div>
              <div class="ml-4 flex-shrink-0 flex">
                <button
                  @click="showNoticeToast = false"
                  class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
import { ref, computed, onMounted, onUnmounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCookies } from '@vueuse/integrations/useCookies'
import SidebarPart from '@/common/component/SidebarPart.vue'
import {
  getAllUsers,
  getAllRoles,
  createUser,
  updateUser,
  deleteUser,
  assignRole,
  removeRole,
  validateUserRequest,
  formatUserDisplayName,
  formatUserStatus,
  getUserInitials,
} from '../users.api'
import type {
  UserDto,
  CreateUserRequest,
  UpdateUserRequest,
  UserSearchParams,
  PagedData,
  UserStatus,
  Role,
} from '../users.type'

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
// SORTING HELPERS - FRONTEND ONLY
// ================================
const sortUsers = (users: UserDto[], field: string, direction: 'asc' | 'desc'): UserDto[] => {
  if (!field) return users

  return [...users].sort((a, b) => {
    let aValue: any = a[field as keyof UserDto]
    let bValue: any = b[field as keyof UserDto]

    // ✅ Handle special cases
    switch (field) {
      case 'firstName':
        aValue = `${a.firstName || ''} ${a.lastName || ''}`.trim().toLowerCase()
        bValue = `${b.firstName || ''} ${b.lastName || ''}`.trim().toLowerCase()
        break
      case 'email':
        aValue = (a.email || '').toLowerCase()
        bValue = (b.email || '').toLowerCase()
        break
      case 'status':
        aValue = a.status || ''
        bValue = b.status || ''
        break
      case 'createdAt':
        aValue = new Date(a.createdAt || 0).getTime()
        bValue = new Date(b.createdAt || 0).getTime()
        break
      case 'username':
        aValue = (a.username || '').toLowerCase()
        bValue = (b.username || '').toLowerCase()
        break
      default:
        aValue = aValue || ''
        bValue = bValue || ''
    }

    // ✅ Compare values
    if (aValue < bValue) {
      return direction === 'asc' ? -1 : 1
    }
    if (aValue > bValue) {
      return direction === 'asc' ? 1 : -1
    }
    return 0
  })
}

// ================================
// COMPOSABLES & UTILS
// ================================
const router = useRouter()
const cookie = useCookies(['jwt_token'])

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

const showNotice = (message: string) => {
  noticeMessage.value = message
  showNoticeToast.value = true
  setTimeout(() => {
    showNoticeToast.value = false
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

// Data - ✅ Thêm originalData để lưu data gốc từ BE
const originalPagedData = ref<PagedData<UserDto> | null>(null)
const pagedData = ref<PagedData<UserDto> | null>(null)

// Modals
const showUserModal = ref(false)
const showRoleModal = ref(false)
const showDeleteModal = ref(false)
const isEditMode = ref(false)
const selectedUser = ref<UserDto | null>(null)
const userToDelete = ref<UserDto | null>(null)

// UI State
const showBulkMenu = ref(false)
const activeUserMenu = ref<string | null>(null)

// Pagination
const currentPage = ref(1)
const pageSize = ref(10)

// Search & Filters
const searchFilters = reactive<UserSearchParams>({
  page: 0,
  size: 10,
  email: '',
  status: undefined,
})

// ✅ SORTING STATE - FRONTEND ONLY
const sortConfig = reactive<{
  field: string | null
  direction: 'asc' | 'desc'
}>({
  field: null,
  direction: 'asc',
})

// User Form
const userForm = reactive<CreateUserRequest>({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  phoneNumber: '',
  gender: undefined,
  birthday: '',
  status: 'ACTIVE',
  password: '',
  roles: [],
})

// ================================
// OPTIONS & CONSTANTS
// ================================
const statusOptions = [
  { label: 'Tất cả trạng thái', value: undefined },
  { label: 'Hoạt động', value: 'ACTIVE' },
  { label: 'Tạm khóa', value: 'INACTIVE' },
  { label: 'Đã cấm', value: 'BANNED' },
]

const genderOptions = [
  { label: 'Nam', value: 'MALE' },
  { label: 'Nữ', value: 'FEMALE' },
  { label: 'Khác', value: 'OTHER' },
]

// ✅ State để lưu roles thật từ BE
const availableRoles = ref<Role[]>([])

// ✅ Load roles từ BE để có roleId thật
const loadRoles = async (): Promise<void> => {
  try {
    const roles = await getAllRoles()
    availableRoles.value = roles // ✅ Gán chính xác vào ref

    console.log('✅ Real roles from BEEE:', roles)
    console.log('📊 Roles count:', roles.length)

    roles.forEach((role, index) => {
      console.log(`Role ${index + 1}:`, {
        id: role.id,
        name: role.name,
        description: role.description,
      })
    })
  } catch (error: any) {
    console.error('❌ Error loading roles:', error)
  }
}

// ✅ Debug function để check roles trong modal
const debugAvailableRoles = (): void => {
  console.log('=== DEBUG AVAILABLE ROLES ===')
  console.log('availableRoles.value:', availableRoles.value)
  console.log('availableRoles length:', availableRoles.value.length)
  console.log('availableRoles type:', typeof availableRoles.value)
  console.log('Is array?:', Array.isArray(availableRoles.value))

  if (availableRoles.value.length > 0) {
    console.log('First role:', availableRoles.value[0])
    console.log('First role properties:', Object.keys(availableRoles.value[0]))
    availableRoles.value.forEach((role, index) => {
      console.log(`Role ${index}: `, {
        id: role.id,
        name: role.name,
        description: role.description,
      })
    })
  } else {
    console.log('❌ No roles available')
  }
  console.log('==============================')
}

// ✅ Enhanced openRoleModal với better handling
const openRoleModal = (user: UserDto): void => {
  console.log('🔐 Opening role modal for:', user.id)
  console.log('👤 User current roles:', user.roles)

  selectedUser.value = user
  showRoleModal.value = true
  activeUserMenu.value = null

  // ✅ Debug roles ngay khi mở modal
  debugAvailableRoles()

  // ✅ Try to load roles if empty
  if (!availableRoles.value || availableRoles.value.length === 0) {
    console.log('🔄 No roles available, trying to reload...')
    loadRoles()
  }
}
// ================================
// COMPUTED PROPERTIES
// ================================
const stats = computed(() => {
  if (!originalPagedData.value?.content) {
    return { total: 0, active: 0, inactive: 0, banned: 0 }
  }

  const users = originalPagedData.value.content
  return {
    total: originalPagedData.value.totalElements || 0,
    active: users.filter((u) => u.status === 'ACTIVE').length,
    inactive: users.filter((u) => u.status === 'INACTIVE').length,
    banned: users.filter((u) => u.status === 'BANNED').length,
  }
})

// ✅ COMPUTED - Sorted and filtered data
const sortedAndFilteredData = computed(() => {
  if (!originalPagedData.value) return null

  let filteredUsers = [...originalPagedData.value.content]

  // ✅ Apply frontend search filter
  if (searchFilters.email) {
    const searchTerm = searchFilters.email.toLowerCase()
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.email?.toLowerCase().includes(searchTerm) ||
        user.username?.toLowerCase().includes(searchTerm) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm),
    )
  }

  // ✅ Apply status filter
  if (searchFilters.status) {
    filteredUsers = filteredUsers.filter((user) => user.status === searchFilters.status)
  }

  // ✅ Apply sorting
  if (sortConfig.field) {
    filteredUsers = sortUsers(filteredUsers, sortConfig.field, sortConfig.direction)
  }

  // ✅ Apply pagination
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

  // ✅ Return paginated result
  return {
    content: paginatedUsers,
    totalElements: filteredUsers.length,
    totalPages: Math.ceil(filteredUsers.length / pageSize.value),
    number: currentPage.value - 1,
    size: pageSize.value,
    first: currentPage.value === 1,
    last: currentPage.value >= Math.ceil(filteredUsers.length / pageSize.value),
    empty: filteredUsers.length === 0,
  } as PagedData<UserDto>
})

// ================================
// UTILITY FUNCTIONS
// ================================
const getInitials = (user: UserDto): string => {
  return getUserInitials(user)
}

const getStatusClasses = (status: string): string => {
  const classes: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-800',
    INACTIVE: 'bg-yellow-100 text-yellow-800',
    BANNED: 'bg-red-100 text-red-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status: string): string => {
  return formatUserStatus(status)
}

const getRoleClasses = (role: string): string => {
  const classes: Record<string, string> = {
    ADMIN: 'bg-red-100 text-red-800',
    ROLE_ADMIN: 'bg-red-100 text-red-800',
    MANAGER: 'bg-blue-100 text-blue-800',
    ROLE_MANAGER: 'bg-blue-100 text-blue-800',
    USER: 'bg-green-100 text-green-800',
    ROLE_USER: 'bg-green-100 text-green-800',
  }
  return classes[role] || 'bg-gray-100 text-gray-800'
}

const formatRoleName = (role: string): string => {
  const names: Record<string, string> = {
    ADMIN: 'Admin',
    ROLE_ADMIN: 'Admin',
    USER: 'User',
    ROLE_USER: 'User',
  }
  return names[role] || role
}

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
}

const toggleUserMenu = (userId: string): void => {
  activeUserMenu.value = activeUserMenu.value === userId ? null : userId
  showBulkMenu.value = false
}

// ================================
// API METHODS - ✅ Simplified for Frontend Sort
// ================================
const loadUsers = async (): Promise<void> => {
  try {
    loading.value = true
    console.log('🔄 Loading users from API...')

    // ✅ Chỉ gọi API với basic params, không có sort
    const basicParams: UserSearchParams = {
      page: 0,
      size: 100, // Load nhiều records để sort FE
    }

    const response = await getAllUsers(basicParams)
    console.log('✅ Users loaded successfully:', response)

    // ✅ Lưu data gốc
    originalPagedData.value = response

    // Reset selection
    activeUserMenu.value = null
    showBulkMenu.value = false
  } catch (error: any) {
    console.error('❌ Error loading users:', error)
    showError('Không thể tải danh sách người dùng. Vui lòng thử lại.')
  } finally {
    loading.value = false
  }
}

const refreshData = (): void => {
  console.log('🔄 Refreshing user data...')
  loadUsers()
}

// ================================
// SEARCH & FILTER METHODS - ✅ Frontend Only
// ================================
const debouncedSearch = debounce((): void => {
  console.log('🔍 Performing frontend search with:', searchFilters.email)
  currentPage.value = 1 // Reset to first page
}, 300)

const handleFilterChange = (): void => {
  console.log('🎯 Filter changed:', searchFilters.status)
  currentPage.value = 1 // Reset to first page
}

// ================================
// SORTING METHODS - ✅ Frontend Only
// ================================
const handleSort = (field: string): void => {
  console.log('🔄 Frontend sorting by:', field)

  if (sortConfig.field === field) {
    // Toggle direction if same field
    sortConfig.direction = sortConfig.direction === 'asc' ? 'desc' : 'asc'
  } else {
    // Set new field with ascending direction
    sortConfig.field = field
    sortConfig.direction = 'asc'
  }

  // Reset to first page
  currentPage.value = 1

  console.log('📊 Sort config:', {
    field: sortConfig.field,
    direction: sortConfig.direction,
  })
}

const clearFilters = (): void => {
  console.log('🧹 Clearing all filters and sorting...')

  // Clear search filters
  searchFilters.email = ''
  searchFilters.status = undefined

  // Clear sorting
  sortConfig.field = null
  sortConfig.direction = 'asc'

  currentPage.value = 1
}

const handlePageChange = (page: number): void => {
  console.log('📄 Page changed to:', page)
  currentPage.value = page
}

// USER MODAL METHODS
const openCreateUserModal = (): void => {
  console.log('➕ Opening create user modal')
  isEditMode.value = false
  resetUserForm()
  showUserModal.value = true
}

const openEditUserModal = (user: UserDto): void => {
  console.log('✏️ Opening edit user modal for:', user.id)
  isEditMode.value = true
  selectedUser.value = user

  // ✅ Populate form với data từ user
  Object.assign(userForm, {
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    username: user.username || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    gender: user.gender || undefined,
    birthday: user.birthday || '',
    status: user.status || 'ACTIVE',
    password: '', // Không populate password khi edit
    roles: user.roles || [],
  })

  showUserModal.value = true
  activeUserMenu.value = null
}

const closeUserModal = (): void => {
  console.log('❌ Closing user modal')
  showUserModal.value = false
  resetUserForm()
  selectedUser.value = null
}

const resetUserForm = (): void => {
  Object.assign(userForm, {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    gender: undefined,
    birthday: '',
    status: 'ACTIVE',
    password: '',
    roles: [],
  })
}

const handleSubmitUser = async (): Promise<void> => {
  try {
    submitting.value = true
    console.log('💾 Submitting user form:', { ...userForm, password: '***' })

    // ✅ Basic validation
    if (!userForm.firstName?.trim()) {
      showError('Họ là bắt buộc')
      return
    }
    if (!userForm.lastName?.trim()) {
      showError('Tên là bắt buộc')
      return
    }
    if (!userForm.username?.trim()) {
      showError('Tên đăng nhập là bắt buộc')
      return
    }
    if (!userForm.email?.trim()) {
      showError('Email là bắt buộc')
      return
    }
    if (!isEditMode.value && !userForm.password?.trim()) {
      showError('Mật khẩu là bắt buộc')
      return
    }

    // ✅ Advanced validation
    try {
      const errors = validateUserRequest(userForm)
      if (errors.length > 0) {
        showError(errors[0])
        return
      }
    } catch (validationError) {
      console.warn('⚠️ Validation function error:', validationError)
    }

    if (isEditMode.value && selectedUser.value) {
      // ✅ Update user
      const updateData: UpdateUserRequest = {
        firstName: userForm.firstName,
        lastName: userForm.lastName,
        username: userForm.username,
        email: userForm.email,
        phoneNumber: userForm.phoneNumber,
        gender: userForm.gender,
        birthday: userForm.birthday,
        status: userForm.status,
        roles: userForm.roles,
      }

      // Chỉ thêm password nếu có nhập
      if (userForm.password?.trim()) {
        updateData.password = userForm.password
      }

      console.log('📝 Updating user:', selectedUser.value.id)
      await updateUser(selectedUser.value.id, updateData)
      showSuccess('Cập nhật người dùng thành công')
    } else {
      // ✅ Create user
      console.log('➕ Creating new user')
      await createUser(userForm)
      showSuccess('Tạo người dùng mới thành công')
    }

    closeUserModal()
    await loadUsers() // Reload data từ BE
  } catch (error: any) {
    console.error('❌ Error submitting user:', error)
    const errorMessage = error?.message || 'Có lỗi xảy ra'
    showError(
      isEditMode.value
        ? `Không thể cập nhật người dùng: ${errorMessage}`
        : `Không thể tạo người dùng: ${errorMessage}`,
    )
  } finally {
    submitting.value = false
  }
}

const isRoleAssigned = (userRoles: (Role | string)[], roleId: string): boolean => {
  if (!userRoles || !Array.isArray(userRoles) || userRoles.length === 0) return false

  return userRoles.some((role) => {
    if (typeof role === 'string') {
      return role === roleId
    } else if (role && typeof role === 'object' && 'id' in role) {
      return role.id === roleId
    }
    return false
  })
}

const closeRoleModal = (): void => {
  console.log('❌ Closing role modal')
  showRoleModal.value = false
  selectedUser.value = null
}

const handleAssignRole = async (userId: string, roleId: string): Promise<void> => {
  try {
    console.log('➕ Assigning role with REAL UUID:', { userId, roleId })

    const updatedUser = await assignRole(userId, roleId) // roleId là UUID thật
    showSuccess('Gán vai trò thành công')

    if (selectedUser.value && selectedUser.value.id === userId) {
      selectedUser.value.roles = updatedUser.roles || []
    }

    await loadUsers()
  } catch (error: any) {
    console.error('❌ Error assigning role:', error)
    showError(`Không thể gán vai trò: ${error?.message}`)
  }
}

const handleRemoveRole = async (userId: string, roleId: string): Promise<void> => {
  try {
    console.log('➖ Removing role with REAL UUID:', { userId, roleId })

    const updatedUser = await removeRole(userId, roleId) // roleId là UUID thật
    showSuccess('Gỡ vai trò thành công')

    if (selectedUser.value && selectedUser.value.id === userId) {
      selectedUser.value.roles = updatedUser.roles || []
    }

    await loadUsers()
  } catch (error: any) {
    console.error('❌ Error removing role:', error)
    showError(`Không thể gỡ vai trò: ${error?.message}`)
  }
}

// ================================
// DELETE MODAL METHODS
// ================================
const openDeleteModal = (user: UserDto): void => {
  console.log('🗑️ Opening delete modal for:', user.id)
  userToDelete.value = user
  showDeleteModal.value = true
  activeUserMenu.value = null
}

const confirmDeleteUser = async (): Promise<void> => {
  if (!userToDelete.value) {
    console.warn('⚠️ No user to delete')
    return
  }

  try {
    submitting.value = true
    console.log('🗑️ Deleting user:', userToDelete.value.id)

    await deleteUser(userToDelete.value.id)
    showSuccess('Xóa người dùng thành công')

    showDeleteModal.value = false
    userToDelete.value = null
    await loadUsers() // Reload data từ BE
  } catch (error: any) {
    console.error('❌ Error deleting user:', error)
    const errorMessage = error?.message || 'Có lỗi xảy ra'
    showError(`Không thể xóa người dùng: ${errorMessage}`)
  } finally {
    submitting.value = false
  }
}

// CLICK OUTSIDE HANDLERS
const handleClickOutside = (event: Event): void => {
  const target = event.target as Element
  if (!target?.closest('.relative')) {
    activeUserMenu.value = null
    showBulkMenu.value = false
  }
}

// ================================
// LIFECYCLE HOOKS
// ================================
onMounted(() => {
  console.log('🚀 UserManagerList component mounted')
  loadUsers()
  loadRoles()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  console.log('💀 UserManagerList component unmounted')
  document.removeEventListener('click', handleClickOutside)
})

watch(
  () => searchFilters.email,
  () => {
    debouncedSearch()
  },
)

// ✅ Update pagedData when sortedAndFilteredData changes
watch(
  sortedAndFilteredData,
  (newData) => {
    pagedData.value = newData
  },
  { immediate: true },
)
</script>

<style scoped>
/* Custom styles for enhanced UI */
.table-hover tr:hover {
  background-color: #f9fafb;
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, opacity, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Loading animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Modal backdrop */
.modal-backdrop {
  backdrop-filter: blur(4px);
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

/* Fade animations for toasts */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom button hover effects */
button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}

/* Table row hover effect */
tbody tr:hover {
  background-color: #f8fafc;
  transform: scale(1.001);
}

/* Card hover effect */
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
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

/* Custom focus styles */
input:focus,
select:focus,
textarea:focus {
  outline: none;
  ring: 2px;
  ring-color: #3b82f6;
  border-color: #3b82f6;
}

/* Status badge animations */
.status-badge {
  transition: all 0.2s ease-in-out;
}

.status-badge:hover {
  transform: scale(1.05);
}

/* Role badge animations */
.role-badge {
  transition: all 0.2s ease-in-out;
}

.role-badge:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Menu dropdown animation */
.dropdown-enter-active {
  transition: all 0.2s ease-out;
}

.dropdown-leave-active {
  transition: all 0.15s ease-in;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Custom pagination styling */
.pagination-button {
  transition: all 0.2s ease;
}

.pagination-button:hover:not(:disabled) {
  background-color: #f3f4f6;
  transform: translateY(-1px);
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Success and error state colors */
.success-text {
  color: #10b981;
}

.error-text {
  color: #ef4444;
}

.warning-text {
  color: #f59e0b;
}

/* Avatar gradient backgrounds */
.avatar-gradient-1 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.avatar-gradient-2 {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.avatar-gradient-3 {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.avatar-gradient-4 {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

/* Custom checkbox styling */
input[type='checkbox']:checked {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

/* Modal animation */
.modal-enter-active {
  transition: all 0.3s ease-out;
}

.modal-leave-active {
  transition: all 0.25s ease-in;
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Search input focus effect */
.search-input:focus-within {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Stats card hover effect */
.stats-card {
  transition: all 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
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
</style>

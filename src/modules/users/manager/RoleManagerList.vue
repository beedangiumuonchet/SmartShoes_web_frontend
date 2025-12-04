<template>
  <SidebarPart>
    <div class="min-h-screen bg-gray-50">
      <!-- Header Section -->
      <div class="bg-white shadow-sm border-b border-gray-200 mb-6">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Quản lý vai trò</h1>
              <p class="text-gray-600 mt-1">Quản lý vai trò và phân quyền hệ thống</p>
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
              <!-- Create Role Button -->
              <button
                @click="openCreateRoleModal"
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
                Thêm vai trò
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters & Search Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Search Input -->
            <div class="md:col-span-2">
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
                  v-model="searchQuery"
                  type="text"
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Tìm kiếm theo tên vai trò..."
                  @input="debouncedSearch"
                />
              </div>
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
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
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
                  <p class="text-sm font-medium text-blue-600">Tổng vai trò</p>
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
                  <p class="text-sm font-medium text-green-600">Đang hoạt động</p>
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-yellow-600">Mới tạo</p>
                  <p class="text-2xl font-bold text-yellow-900">{{ stats.recent }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Roles Table -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">
              Danh sách vai trò
              <span class="text-sm font-normal text-gray-500 ml-2">
                ({{ filteredRoles.length }} kết quả)
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
        <div v-else-if="!filteredRoles.length" class="p-12 text-center">
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
          <h3 class="text-lg font-medium text-gray-900 mb-2">Không có vai trò nào</h3>
          <p class="text-gray-600 mb-4">
            Chưa có vai trò nào trong hệ thống hoặc không tìm thấy kết quả phù hợp.
          </p>
          <button
            @click="openCreateRoleModal"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Thêm vai trò đầu tiên
          </button>
        </div>

        <!-- Roles Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <button
                    @click="handleSort('name')"
                    class="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  >
                    <span>Tên vai trò</span>
                    <div class="flex flex-col">
                      <svg
                        :class="[
                          'w-3 h-3 transition-colors',
                          sortConfig.field === 'name' && sortConfig.direction === 'asc'
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
                          sortConfig.field === 'name' && sortConfig.direction === 'desc'
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

                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Mô tả
                </th>

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

                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Trạng thái
                </th>

                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="role in paginatedRoles"
                :key="role.id"
                class="hover:bg-gray-50 transition-colors duration-200"
              >
                <!-- Role Name -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div
                        class="h-10 w-10 rounded-full flex items-center justify-center"
                        :class="getRoleIconClasses(role.name)"
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
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ formatRoleName(role.name) }}
                      </div>
                      <div class="text-sm text-gray-500">ID: {{ role.id }}</div>
                    </div>
                  </div>
                </td>

                <!-- Description -->
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 max-w-xs truncate" :title="role.description">
                    {{ role.description }}
                  </div>
                </td>

                <!-- Created Date -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(role.createdAt) }}
                </td>

                <!-- Status -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getRoleStatusClasses(role),
                    ]"
                  >
                    {{ getRoleStatusLabel(role) }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="relative inline-block text-left">
                    <button
                      @click="toggleRoleMenu(role.id)"
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
                      v-if="activeRoleMenu === role.id"
                      class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                    >
                      <div class="py-1">
                        <button
                          @click="openEditRoleModal(role)"
                          class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Chỉnh sửa
                        </button>
                        <button
                          @click="openDeleteModal(role)"
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
        <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Hiển thị {{ (currentPage - 1) * pageSize + 1 }} -
              {{ Math.min(currentPage * pageSize, filteredRoles.length) }}
              trong tổng số {{ filteredRoles.length }} kết quả
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
                Trang {{ currentPage }} / {{ totalPages }}
              </span>

              <button
                @click="handlePageChange(currentPage + 1)"
                :disabled="currentPage >= totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Create/Edit Role Modal -->
      <div
        v-if="showRoleModal"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      >
        <div
          class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/5 lg:w-1/2 shadow-lg rounded-md bg-white"
        >
          <div class="mt-3">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ isEditMode ? 'Chỉnh sửa vai trò' : 'Thêm vai trò mới' }}
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

            <form @submit.prevent="handleSubmitRole" class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700">Tên vai trò *</label>
                <input
                  v-model="roleForm.name"
                  type="text"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Nhập tên vai trò (VD: MANAGER, STAFF)"
                />
                <p class="mt-1 text-xs text-gray-500">
                  Tên vai trò nên viết HOA và không chứa ký tự đặc biệt
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Mô tả *</label>
                <textarea
                  v-model="roleForm.description"
                  rows="3"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Nhập mô tả chi tiết về vai trò này..."
                ></textarea>
                <p class="mt-1 text-xs text-gray-500">Mô tả không được vượt quá 255 ký tự</p>
              </div>

              <div class="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  @click="closeRoleModal"
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
                  Bạn có chắc chắn muốn xóa vai trò
                  <strong>{{ roleToDelete?.name }}</strong
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
                @click="confirmDeleteRole"
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
                <p class="text-sm font-medium text-gray-900">Lỗi</p>
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
import { ref, computed, onMounted, onUnmounted, reactive } from 'vue'
import SidebarPart from '@/common/component/SidebarPart.vue'
import {
  getAllRoles,
  createRole,
  validateRoleRequest,
  formatRoleName as formatRoleNameUtil,
} from '../users.api'
import type { Role, RoleRequest } from '../users.type'

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
// SORTING HELPERS
// ================================
const sortRoles = (roles: Role[], field: string, direction: 'asc' | 'desc'): Role[] => {
  if (!field) return roles

  return [...roles].sort((a, b) => {
    let aValue: any = a[field as keyof Role]
    let bValue: any = b[field as keyof Role]

    switch (field) {
      case 'name':
        aValue = (a.name || '').toLowerCase()
        bValue = (b.name || '').toLowerCase()
        break
      case 'createdAt':
        aValue = new Date(a.createdAt || 0).getTime()
        bValue = new Date(b.createdAt || 0).getTime()
        break
      default:
        aValue = aValue || ''
        bValue = bValue || ''
    }

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
// STATE MANAGEMENT
// ================================
const loading = ref(false)
const submitting = ref(false)

// Data
const roles = ref<Role[]>([])

// Modals
const showRoleModal = ref(false)
const showDeleteModal = ref(false)
const isEditMode = ref(false)
const selectedRole = ref<Role | null>(null)
const roleToDelete = ref<Role | null>(null)

// UI State
const activeRoleMenu = ref<string | null>(null)

// Search & Filters
const searchQuery = ref('')

// Pagination
const currentPage = ref(1)
const pageSize = ref(10)

// Sorting
const sortConfig = reactive<{
  field: string | null
  direction: 'asc' | 'desc'
}>({
  field: null,
  direction: 'asc',
})

// Role Form
const roleForm = reactive<RoleRequest>({
  name: '',
  description: '',
})

// Toast state
const showSuccessToast = ref(false)
const successMessage = ref('')
const showNoticeToast = ref(false)
const noticeMessage = ref('')

// ================================
// COMPUTED PROPERTIES
// ================================
const stats = computed(() => {
  const total = roles.value.length
  const active = roles.value.filter((r) => !r.deleted).length
  const recent = roles.value.filter((r) => {
    const createdDate = new Date(r.createdAt)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return createdDate >= weekAgo && !r.deleted
  }).length

  return { total, active, recent }
})

const filteredRoles = computed(() => {
  let filtered = [...roles.value]

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (role) =>
        role.name.toLowerCase().includes(query) ||
        role.description.toLowerCase().includes(query) ||
        role.id.toLowerCase().includes(query),
    )
  }

  // Apply sorting
  if (sortConfig.field) {
    filtered = sortRoles(filtered, sortConfig.field, sortConfig.direction)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredRoles.value.length / pageSize.value))

const paginatedRoles = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return filteredRoles.value.slice(startIndex, endIndex)
})

// ================================
// UTILITY FUNCTIONS
// ================================
const formatRoleName = (name: string): string => {
  return formatRoleNameUtil(name)
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
    return dateString
  }
}

const getRoleIconClasses = (name: string): string => {
  const classes: Record<string, string> = {
    ADMIN: 'bg-red-500',
    MANAGER: 'bg-blue-500',
    USER: 'bg-green-500',
    CUSTOMER: 'bg-purple-500',
    STAFF: 'bg-yellow-500',
  }
  return classes[name] || 'bg-gray-500'
}

const getRoleStatusClasses = (role: Role): string => {
  if (role.deleted) {
    return 'bg-red-100 text-red-800'
  }
  return 'bg-green-100 text-green-800'
}

const getRoleStatusLabel = (role: Role): string => {
  return role.deleted ? 'Đã xóa' : 'Hoạt động'
}

const toggleRoleMenu = (roleId: string): void => {
  activeRoleMenu.value = activeRoleMenu.value === roleId ? null : roleId
}

// ================================
// TOAST FUNCTIONS
// ================================
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
// API METHODS
// ================================
const loadRoles = async (): Promise<void> => {
  try {
    loading.value = true
    console.log('🔄 Loading roles from API...')

    const response = await getAllRoles()
    console.log('✅ Roles loaded successfully:', response)

    roles.value = response
    activeRoleMenu.value = null
  } catch (error: any) {
    console.error('❌ Error loading roles:', error)
    showError('Không thể tải danh sách vai trò. Vui lòng thử lại.')
  } finally {
    loading.value = false
  }
}

const refreshData = (): void => {
  console.log('🔄 Refreshing role data...')
  loadRoles()
}

// ================================
// SEARCH & FILTER METHODS
// ================================
const debouncedSearch = debounce((): void => {
  console.log('🔍 Performing search with:', searchQuery.value)
  currentPage.value = 1
}, 300)

const clearFilters = (): void => {
  console.log('🧹 Clearing all filters and sorting...')
  searchQuery.value = ''
  sortConfig.field = null
  sortConfig.direction = 'asc'
  currentPage.value = 1
}

const handleSort = (field: string): void => {
  console.log('🔄 Sorting by:', field)

  if (sortConfig.field === field) {
    sortConfig.direction = sortConfig.direction === 'asc' ? 'desc' : 'asc'
  } else {
    sortConfig.field = field
    sortConfig.direction = 'asc'
  }

  currentPage.value = 1
}

const handlePageChange = (page: number): void => {
  console.log('📄 Page changed to:', page)
  currentPage.value = page
}

// ================================
// ROLE MODAL METHODS
// ================================
const openCreateRoleModal = (): void => {
  console.log('➕ Opening create role modal')
  isEditMode.value = false
  resetRoleForm()
  showRoleModal.value = true
}

const openEditRoleModal = (role: Role): void => {
  console.log('✏️ Opening edit role modal for:', role.id)
  isEditMode.value = true
  selectedRole.value = role

  Object.assign(roleForm, {
    name: role.name || '',
    description: role.description || '',
  })

  showRoleModal.value = true
  activeRoleMenu.value = null
}

const closeRoleModal = (): void => {
  console.log('❌ Closing role modal')
  showRoleModal.value = false
  resetRoleForm()
  selectedRole.value = null
}

const resetRoleForm = (): void => {
  Object.assign(roleForm, {
    name: '',
    description: '',
  })
}

const handleSubmitRole = async (): Promise<void> => {
  try {
    submitting.value = true
    console.log('💾 Submitting role form:', roleForm)

    // Basic validation
    if (!roleForm.name?.trim()) {
      showError('Tên vai trò là bắt buộc')
      return
    }
    if (!roleForm.description?.trim()) {
      showError('Mô tả vai trò là bắt buộc')
      return
    }

    // Advanced validation
    const errors = validateRoleRequest(roleForm)
    if (errors.length > 0) {
      showError(errors[0])
      return
    }

    if (isEditMode.value && selectedRole.value) {
      // TODO: Implement updateRole API when backend supports it
      showError('Chỉnh sửa vai trò chưa được hỗ trợ')
      return
    } else {
      console.log('➕ Creating new role')
      await createRole(roleForm)
      showSuccess('Tạo vai trô mới thành công')
    }

    closeRoleModal()
    await loadRoles()
  } catch (error: any) {
    console.error('❌ Error submitting role:', error)
    const errorMessage = error?.message || 'Có lỗi xảy ra'
    showError(
      isEditMode.value
        ? `Không thể cập nhật vai trò: ${errorMessage}`
        : `Không thể tạo vai trò: ${errorMessage}`,
    )
  } finally {
    submitting.value = false
  }
}

// ================================
// DELETE MODAL METHODS
// ================================
const openDeleteModal = (role: Role): void => {
  console.log('🗑️ Opening delete modal for:', role.id)
  roleToDelete.value = role
  showDeleteModal.value = true
  activeRoleMenu.value = null
}

const confirmDeleteRole = async (): Promise<void> => {
  if (!roleToDelete.value) {
    console.warn('⚠️ No role to delete')
    return
  }

  try {
    submitting.value = true
    console.log('🗑️ Deleting role:', roleToDelete.value.id)

    // TODO: Implement deleteRole API when backend supports it
    showError('Xóa vai trò chưa được hỗ trợ trong backend')

    // await deleteRole(roleToDelete.value.id)
    // showSuccess('Xóa vai trò thành công')
    // showDeleteModal.value = false
    // roleToDelete.value = null
    // await loadRoles()
  } catch (error: any) {
    console.error('❌ Error deleting role:', error)
    const errorMessage = error?.message || 'Có lỗi xảy ra'
    showError(`Không thể xóa vai trò: ${errorMessage}`)
  } finally {
    submitting.value = false
  }
}

// ================================
// CLICK OUTSIDE HANDLERS
// ================================
const handleClickOutside = (event: Event): void => {
  const target = event.target as Element
  if (!target?.closest('.relative')) {
    activeRoleMenu.value = null
  }
}

// ================================
// LIFECYCLE HOOKS
// ================================
onMounted(() => {
  console.log('🚀 RoleManagerList component mounted')
  loadRoles()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  console.log('💀 RoleManagerList component unmounted')
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Custom styles similar to UserManagerList */
.table-hover tr:hover {
  background-color: #f9fafb;
}

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

.modal-backdrop {
  backdrop-filter: blur(4px);
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

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
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

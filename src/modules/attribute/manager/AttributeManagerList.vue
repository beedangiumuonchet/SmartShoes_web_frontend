<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b border-gray-200 mb-6">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Quản lý thuộc tính</h1>
            <p class="text-gray-600 mt-1">Quản lý tất cả thuộc tính sản phẩm trong hệ thống</p>
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

            <!-- Add Attribute Button -->
            <button
              @click="openCreateModal"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Thêm thuộc tính
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Search & Filters Section -->
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
                placeholder="Tìm kiếm theo key, value, mô tả..."
                @input="debouncedSearch"
              />
            </div>
          </div>

          <!-- Clear Search -->
          <div class="flex justify-end">
            <button
              @click="clearSearch"
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
              Xóa tìm kiếm
            </button>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div class="bg-cyan-50 rounded-lg p-4 stats-card">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg
                  class="w-8 h-8 text-cyan-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                  />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-cyan-600">Tổng thuộc tính</p>
                <p class="text-2xl font-bold text-cyan-900">{{ totalAttributes }}</p>
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
                <p class="text-sm font-medium text-green-600">Đang hiển thị</p>
                <p class="text-2xl font-bold text-green-900">{{ filteredAttributes.length }}</p>
              </div>
            </div>
          </div>

          <!-- <div class="bg-orange-50 rounded-lg p-4 stats-card">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg
                  class="w-8 h-8 text-orange-600"
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
                <p class="text-sm font-medium text-orange-600">Mới thêm hôm nay</p>
                <p class="text-2xl font-bold text-orange-900">{{ todayAdded }}</p>
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </div>

    <!-- Attributes Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">
            Danh sách thuộc tính
            <span class="text-sm font-normal text-gray-500 ml-2">
              ({{ filteredAttributes.length }} kết quả)
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
      <div v-else-if="!filteredAttributes.length" class="p-12 text-center">
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
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
          />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Không có thuộc tính nào</h3>
        <p class="text-gray-600 mb-4">
          {{
            searchQuery
              ? 'Không tìm thấy thuộc tính phù hợp với từ khóa tìm kiếm.'
              : 'Chưa có thuộc tính nào trong hệ thống.'
          }}
        </p>
        <button
          v-if="!searchQuery"
          @click="openCreateModal"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Thêm thuộc tính đầu tiên
        </button>
      </div>

      <!-- Attributes Grid/Table -->
      <div v-else class="overflow-x-auto">
        <!-- Table View for desktop -->
        <div class="hidden md:block">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <button
                    @click="handleSort('key')"
                    class="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  >
                    <span>Key</span>
                    <div class="flex flex-col">
                      <svg
                        :class="[
                          'w-3 h-3 transition-colors',
                          sortConfig.field === 'key' && sortConfig.direction === 'asc'
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
                          sortConfig.field === 'key' && sortConfig.direction === 'desc'
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
                  <button
                    @click="handleSort('value')"
                    class="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  >
                    <span>Value</span>
                    <div class="flex flex-col">
                      <svg
                        :class="[
                          'w-3 h-3 transition-colors',
                          sortConfig.field === 'value' && sortConfig.direction === 'asc'
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
                          sortConfig.field === 'value' && sortConfig.direction === 'desc'
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
                  ID
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
                v-for="attribute in paginatedAttributes"
                :key="attribute.id"
                class="hover:bg-gray-50 transition-colors duration-200"
              >
                <!-- Key Column -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div
                        class="h-10 w-10 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center"
                      >
                        <span class="text-sm font-medium text-white">
                          {{ attribute.key.substring(0, 2).toUpperCase() }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ attribute.key }}</div>
                      <div class="text-sm text-gray-500">Thuộc tính key</div>
                    </div>
                  </div>
                </td>

                <!-- Value Column -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {{ attribute.value }}
                    </span>
                  </div>
                </td>

                <!-- Description Column -->
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 max-w-xs">
                    <div v-if="attribute.description" class="truncate">
                      {{ attribute.description }}
                    </div>
                    <div v-else class="text-gray-500 italic">Không có mô tả</div>
                  </div>
                </td>

                <!-- ID Column -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <code class="bg-gray-100 px-2 py-1 rounded text-xs">{{ attribute.id }}</code>
                </td>

                <!-- Actions Column -->
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="relative inline-block text-left">
                    <button
                      @click="toggleActionMenu(attribute.id)"
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
                      v-if="activeActionMenu === attribute.id"
                      class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                    >
                      <div class="py-1">
                        <button
                          @click="openEditModal(attribute)"
                          class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <svg
                            class="w-4 h-4 mr-2 inline"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Chỉnh sửa
                        </button>
                        <button
                          @click="confirmDelete(attribute)"
                          class="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                        >
                          <svg
                            class="w-4 h-4 mr-2 inline"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
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

        <!-- Card View for mobile -->
        <div class="md:hidden p-4 space-y-4">
          <div
            v-for="attribute in paginatedAttributes"
            :key="attribute.id"
            class="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div
                  class="h-10 w-10 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center"
                >
                  <span class="text-sm font-medium text-white">
                    {{ attribute.key.substring(0, 2).toUpperCase() }}
                  </span>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-900">{{ attribute.key }}</h3>
                  <p class="text-xs text-gray-500">ID: {{ attribute.id }}</p>
                </div>
              </div>
              <button
                @click="toggleActionMenu(attribute.id)"
                class="text-gray-400 hover:text-gray-600"
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
            </div>

            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-500">Value:</span>
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {{ attribute.value }}
              </span>
            </div>

            <div v-if="attribute.description" class="text-sm text-gray-600">
              {{ attribute.description }}
            </div>
            <div v-else class="text-sm text-gray-500 italic">Không có mô tả</div>

            <div
              v-if="activeActionMenu === attribute.id"
              class="flex space-x-2 pt-2 border-t border-gray-200"
            >
              <button
                @click="openEditModal(attribute)"
                class="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Sửa
              </button>
              <button
                @click="confirmDelete(attribute)"
                class="flex-1 inline-flex items-center justify-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Xóa
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="filteredAttributes.length > itemsPerPage"
        class="px-6 py-4 border-t border-gray-200"
      >
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} -
            {{ Math.min(currentPage * itemsPerPage, filteredAttributes.length) }}
            trong tổng số {{ filteredAttributes.length }} kết quả
          </div>

          <div class="flex items-center space-x-2">
            <button
              @click="previousPage"
              :disabled="currentPage <= 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>

            <span class="text-sm text-gray-700"> Trang {{ currentPage }} / {{ totalPages }} </span>

            <button
              @click="nextPage"
              :disabled="currentPage >= totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Attribute Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white"
      >
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ isEditMode ? 'Chỉnh sửa thuộc tính' : 'Thêm thuộc tính mới' }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
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

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Key Field -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Key <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.key"
                type="text"
                required
                class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Nhập key thuộc tính (VD: size, color, material...)"
              />
            </div>

            <!-- Value Field -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Value <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.value"
                type="text"
                required
                class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Nhập value thuộc tính (VD: XL, Đỏ, Da thật...)"
              />
            </div>

            <!-- Description Field -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"> Mô tả </label>
              <textarea
                v-model="form.description"
                rows="3"
                class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Nhập mô tả chi tiết về thuộc tính..."
              ></textarea>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                {{ submitting ? 'Đang lưu...' : isEditMode ? 'Cập nhật' : 'Thêm mới' }}
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
          <div class="flex items-center justify-center mb-4">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
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
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          <h3 class="text-lg font-semibold text-gray-900 text-center mb-2">Xác nhận xóa</h3>
          <p class="text-gray-600 text-center mb-6">
            Bạn có chắc chắn muốn xóa thuộc tính
            <strong class="text-gray-900"
              >{{ attributeToDelete?.key }}:{{ attributeToDelete?.value }}</strong
            >? Hành động này không thể hoàn tác.
          </p>

          <div class="flex justify-center space-x-3">
            <button
              @click="closeDeleteModal"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              @click="handleDelete"
              :disabled="deleting"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              {{ deleting ? 'Đang xóa...' : 'Xác nhận xóa' }}
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
        v-if="showErrorToast"
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
              <p class="mt-1 text-sm text-gray-500">{{ errorMessage }}</p>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
              <button
                @click="showErrorToast = false"
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, reactive } from 'vue'
import {
  getAllAttributesApi,
  createAttributeApi,
  updateAttributeApi,
  deleteAttributeApi,
} from '../attribute.api'
import type { Attribute, AttributeForm } from '../attribute.type'

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
// STATE MANAGEMENT
// ================================
const loading = ref(false)
const submitting = ref(false)
const deleting = ref(false)

// Data
const attributes = ref<Attribute[]>([])

// Search & Filter
const searchQuery = ref('')
const sortConfig = reactive({
  field: 'key',
  direction: 'asc' as 'asc' | 'desc',
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Modals
const showModal = ref(false)
const isEditMode = ref(false)
const selectedAttribute = ref<Attribute | null>(null)

const showDeleteModal = ref(false)
const attributeToDelete = ref<Attribute | null>(null)

// UI State
const activeActionMenu = ref<string | null>(null)

// Form data
const form = reactive({
  key: '',
  value: '',
  description: '',
})

// Toast state management
const showSuccessToast = ref(false)
const successMessage = ref('')
const showErrorToast = ref(false)
const errorMessage = ref('')

// ================================
// COMPUTED PROPERTIES
// ================================
const totalAttributes = computed(() => attributes.value.length)

const todayAdded = computed(() => {
  // For demo purposes, return a static number
  // In real app, filter by createdAt date
  return Math.floor(Math.random() * 5)
})

const filteredAttributes = computed(() => {
  let result = [...attributes.value]

  // Search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(
      (attribute) =>
        attribute.key.toLowerCase().includes(query) ||
        attribute.value.toLowerCase().includes(query) ||
        (attribute.description && attribute.description.toLowerCase().includes(query)) ||
        attribute.id.toLowerCase().includes(query),
    )
  }

  // Sorting
  result.sort((a, b) => {
    let aValue = a[sortConfig.field as keyof Attribute] || ''
    let bValue = b[sortConfig.field as keyof Attribute] || ''

    if (typeof aValue === 'string') aValue = aValue.toLowerCase()
    if (typeof bValue === 'string') bValue = bValue.toLowerCase()

    if (sortConfig.direction === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  return result
})

const totalPages = computed(() => Math.ceil(filteredAttributes.value.length / itemsPerPage.value))

const paginatedAttributes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredAttributes.value.slice(start, end)
})

// ================================
// TOAST HELPER FUNCTIONS
// ================================
const showSuccess = (message: string) => {
  successMessage.value = message
  showSuccessToast.value = true
  setTimeout(() => {
    showSuccessToast.value = false
  }, 3000)
}

const showError = (message: string) => {
  errorMessage.value = message
  showErrorToast.value = true
  setTimeout(() => {
    showErrorToast.value = false
  }, 4000)
}

// ================================
// API METHODS
// ================================
const loadAttributes = async (): Promise<void> => {
  try {
    loading.value = true
    console.log('🔄 Loading attributes from API...')

    const response = await getAllAttributesApi()

    // Handle different response structures
    if (response && Array.isArray(response)) {
      attributes.value = response
    } else if (response && response.content && Array.isArray(response.content)) {
      attributes.value = response.content
    } else if (response && response.data && Array.isArray(response.data)) {
      attributes.value = response.data
    } else {
      attributes.value = []
    }

    console.log('✅ Attributes loaded successfully:', attributes.value.length, 'items')
    activeActionMenu.value = null
  } catch (error: any) {
    console.error('❌ Error loading attributes:', error)
    showError('Không thể tải danh sách thuộc tính. Vui lòng thử lại.')
    attributes.value = []
  } finally {
    loading.value = false
  }
}

const refreshData = (): void => {
  console.log('🔄 Refreshing attribute data...')
  loadAttributes()
}

// ================================
// SEARCH & FILTER METHODS
// ================================
const debouncedSearch = debounce((): void => {
  console.log('🔍 Performing search with:', searchQuery.value)
  currentPage.value = 1 // Reset to first page
}, 300)

const clearSearch = (): void => {
  console.log('🧹 Clearing search...')
  searchQuery.value = ''
  currentPage.value = 1
}

const handleSort = (field: string): void => {
  console.log('🔄 Sorting by:', field)

  if (sortConfig.field === field) {
    // Toggle direction if same field
    sortConfig.direction = sortConfig.direction === 'asc' ? 'desc' : 'asc'
  } else {
    // Set new field with ascending direction
    sortConfig.field = field
    sortConfig.direction = 'asc'
  }

  currentPage.value = 1 // Reset to first page

  console.log('📊 Sort config:', {
    field: sortConfig.field,
    direction: sortConfig.direction,
  })
}

// ================================
// PAGINATION METHODS
// ================================
const previousPage = (): void => {
  if (currentPage.value > 1) {
    currentPage.value--
    console.log('📄 Previous page:', currentPage.value)
  }
}

const nextPage = (): void => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    console.log('📄 Next page:', currentPage.value)
  }
}

// ================================
// MODAL METHODS
// ================================
const openCreateModal = (): void => {
  console.log('➕ Opening create modal')
  isEditMode.value = false
  selectedAttribute.value = null
  form.key = ''
  form.value = ''
  form.description = ''
  showModal.value = true
  activeActionMenu.value = null
}

const openEditModal = (attribute: Attribute): void => {
  console.log('✏️ Opening edit modal for attribute:', attribute.id)
  isEditMode.value = true
  selectedAttribute.value = attribute
  form.key = attribute.key
  form.value = attribute.value
  form.description = attribute.description || ''
  showModal.value = true
  activeActionMenu.value = null
}

const closeModal = (): void => {
  console.log('❌ Closing modal')
  showModal.value = false
  isEditMode.value = false
  selectedAttribute.value = null
  form.key = ''
  form.value = ''
  form.description = ''
}

// ================================
// FORM SUBMISSION - ✅ FIXED
// ================================
const handleSubmit = async (): Promise<void> => {
  try {
    submitting.value = true

    // Validate form
    if (!form.key.trim()) {
      showError('Vui lòng nhập key thuộc tính')
      return
    }

    if (!form.value.trim()) {
      showError('Vui lòng nhập value thuộc tính')
      return
    }

    // ✅ SỬA: Tạo object thay vì dùng AttributeForm constructor
    const attributeData = {
      key: form.key.trim(),
      value: form.value.trim(),
      description: form.description?.trim() || undefined,
    }

    if (isEditMode.value && selectedAttribute.value) {
      console.log('✏️ Updating attribute:', selectedAttribute.value.id, attributeData)

      const response = await updateAttributeApi(selectedAttribute.value.id, attributeData)
      console.log('✅ Update response:', response)

      showSuccess('Cập nhật thuộc tính thành công')
    } else {
      console.log('➕ Creating new attribute:', attributeData)

      // Check if attribute already exists
      const existingAttribute = attributes.value.find(
        (attr) => attr.key === attributeData.key && attr.value === attributeData.value,
      )

      if (existingAttribute) {
        showError('Thuộc tính với key và value này đã tồn tại')
        return
      }

      const response = await createAttributeApi(attributeData)
      console.log('✅ Create response:', response)

      showSuccess('Thêm thuộc tính mới thành công')
    }

    closeModal()
    await loadAttributes() // Reload data
  } catch (error: any) {
    console.error('❌ Error submitting form:', error)
    const action = isEditMode.value ? 'cập nhật' : 'thêm'

    // Handle specific error messages
    let errorMsg = `Không thể ${action} thuộc tính`

    if (error?.response?.data?.message) {
      errorMsg += `: ${error.response.data.message}`
    } else if (error?.message) {
      errorMsg += `: ${error.message}`
    } else {
      errorMsg += ': Có lỗi xảy ra'
    }

    showError(errorMsg)
  } finally {
    submitting.value = false
  }
}

// ================================
// DELETE METHODS
// ================================
const confirmDelete = (attribute: Attribute): void => {
  console.log('🗑️ Confirm delete attribute:', attribute.id)
  attributeToDelete.value = attribute
  showDeleteModal.value = true
  activeActionMenu.value = null
}

const closeDeleteModal = (): void => {
  console.log('❌ Closing delete modal')
  showDeleteModal.value = false
  attributeToDelete.value = null
}

const handleDelete = async (): Promise<void> => {
  if (!attributeToDelete.value) return

  try {
    deleting.value = true
    console.log('🗑️ Deleting attribute:', attributeToDelete.value.id)

    const response = await deleteAttributeApi(attributeToDelete.value.id)
    console.log('✅ Delete response:', response)

    showSuccess('Xóa thuộc tính thành công')

    closeDeleteModal()
    await loadAttributes() // Reload data
  } catch (error: any) {
    console.error('❌ Error deleting attribute:', error)

    let errorMsg = 'Không thể xóa thuộc tính'

    showError(errorMsg)
  } finally {
    deleting.value = false
  }
}

// ================================
// UI INTERACTION METHODS
// ================================
const toggleActionMenu = (attributeId: string): void => {
  activeActionMenu.value = activeActionMenu.value === attributeId ? null : attributeId
}

// ================================
// CLICK OUTSIDE HANDLERS
// ================================
const handleClickOutside = (event: Event): void => {
  const target = event.target as Element
  if (!target?.closest('.relative')) {
    activeActionMenu.value = null
  }
}

// ================================
// LIFECYCLE HOOKS
// ================================
onMounted(async () => {
  console.log('🚀 AttributeManagerList component mounted')

  try {
    await loadAttributes()
  } catch (error) {
    console.error('❌ Error during initial data load:', error)
  }

  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  console.log('💀 AttributeManagerList component unmounted')
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

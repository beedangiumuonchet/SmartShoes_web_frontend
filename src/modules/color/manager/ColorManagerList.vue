<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b border-gray-200 mb-6">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Quản lý màu sắc</h1>
            <p class="text-gray-600 mt-1">Quản lý tất cả màu sắc sản phẩm trong hệ thống</p>
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

            <!-- Add Color Button -->
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
              Thêm màu sắc
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
                placeholder="Tìm kiếm theo tên màu sắc..."
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
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                  />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-red-600">Tổng màu sắc</p>
                <p class="text-2xl font-bold text-red-900">{{ totalColors }}</p>
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
                <p class="text-2xl font-bold text-green-900">{{ filteredColors.length }}</p>
              </div>
            </div>
          </div>

          <!-- <div class="bg-purple-50 rounded-lg p-4 stats-card">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-purple-600">Mới thêm hôm nay</p>
                <p class="text-2xl font-bold text-purple-900">{{ todayAdded }}</p>
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </div>

    <!-- Colors Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">
            Danh sách màu sắc
            <span class="text-sm font-normal text-gray-500 ml-2">
              ({{ filteredColors.length }} kết quả)
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
      <div v-else-if="!filteredColors.length" class="p-12 text-center">
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
        <h3 class="text-lg font-medium text-gray-900 mb-2">Không có màu sắc nào</h3>
        <p class="text-gray-600 mb-4">
          {{
            searchQuery
              ? 'Không tìm thấy màu sắc phù hợp với từ khóa tìm kiếm.'
              : 'Chưa có màu sắc nào trong hệ thống.'
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
          Thêm màu sắc đầu tiên
        </button>
      </div>

      <!-- Colors Grid/Table -->
      <div v-else class="overflow-x-auto">
        <!-- Grid View for desktop -->
        <div class="hidden md:block">
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
                    <span>Tên màu sắc</span>
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
                <!-- <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Mẫu màu
                </th> -->
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
                v-for="color in paginatedColors"
                :key="color.id"
                class="hover:bg-gray-50 transition-colors duration-200"
              >
                <!-- Color Name -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div
                        :style="{ backgroundColor: getColorValue(color.name) }"
                        class="h-10 w-10 rounded-lg border-2 border-gray-300 flex items-center justify-center shadow-sm"
                      >
                        <span
                          :class="[
                            'text-xs font-bold',
                            isLightColor(getColorValue(color.name))
                              ? 'text-gray-800'
                              : 'text-white',
                          ]"
                        >
                          {{ color.name.substring(0, 2).toUpperCase() }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ color.name }}</div>
                      <div class="text-sm text-gray-500">Màu sắc</div>
                    </div>
                  </div>
                </td>

                <!-- Color Preview -->
                <!-- <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-3">
                    <div
                      :style="{ backgroundColor: getColorValue(color.name) }"
                      class="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm"
                    ></div>
                    <div class="text-sm text-gray-600">
                      <code class="bg-gray-100 px-2 py-1 rounded text-xs">{{
                        getColorValue(color.name)
                      }}</code>
                    </div>
                  </div>
                </td> -->

                <!-- ID -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <code class="bg-gray-100 px-2 py-1 rounded text-xs">{{ color.id }}</code>
                </td>

                <!-- Actions -->
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="relative inline-block text-left">
                    <button
                      @click="toggleActionMenu(color.id)"
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
                      v-if="activeActionMenu === color.id"
                      class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                    >
                      <div class="py-1">
                        <button
                          @click="openEditModal(color)"
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
                          @click="confirmDelete(color)"
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
            v-for="color in paginatedColors"
            :key="color.id"
            class="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div
                  :style="{ backgroundColor: getColorValue(color.name) }"
                  class="h-10 w-10 rounded-lg border-2 border-gray-300 flex items-center justify-center shadow-sm"
                >
                  <span
                    :class="[
                      'text-xs font-bold',
                      isLightColor(getColorValue(color.name)) ? 'text-gray-800' : 'text-white',
                    ]"
                  >
                    {{ color.name.substring(0, 2).toUpperCase() }}
                  </span>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-900">{{ color.name }}</h3>
                  <p class="text-xs text-gray-500">ID: {{ color.id }}</p>
                </div>
              </div>
              <button @click="toggleActionMenu(color.id)" class="text-gray-400 hover:text-gray-600">
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

            <div class="flex items-center space-x-3">
              <div
                :style="{ backgroundColor: getColorValue(color.name) }"
                class="w-6 h-6 rounded-full border border-gray-300"
              ></div>
              <code class="bg-gray-100 px-2 py-1 rounded text-xs">{{
                getColorValue(color.name)
              }}</code>
            </div>

            <div
              v-if="activeActionMenu === color.id"
              class="flex space-x-2 pt-2 border-t border-gray-200"
            >
              <button
                @click="openEditModal(color)"
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
                @click="confirmDelete(color)"
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
      <div v-if="filteredColors.length > itemsPerPage" class="px-6 py-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} -
            {{ Math.min(currentPage * itemsPerPage, filteredColors.length) }}
            trong tổng số {{ filteredColors.length }} kết quả
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

    <!-- Create/Edit Color Modal -->
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
              {{ isEditMode ? 'Chỉnh sửa màu sắc' : 'Thêm màu sắc mới' }}
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
            <!-- Color Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tên màu sắc <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Ví dụ: Đỏ, Xanh lá, Vàng..."
              />

              <!-- Color Preview -->
              <div v-if="form.name" class="mt-3 flex items-center space-x-3">
                <span class="text-sm text-gray-600">Xem trước:</span>
                <div
                  :style="{ backgroundColor: getColorValue(form.name) }"
                  class="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm"
                ></div>
                <code class="bg-gray-100 px-2 py-1 rounded text-xs">{{
                  getColorValue(form.name)
                }}</code>
              </div>
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
            Bạn có chắc chắn muốn xóa màu sắc
            <strong class="text-gray-900">{{ colorToDelete?.name }}</strong
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
import { getAllColorsApi, createColorApi, updateColorApi, deleteColorApi } from '../color.api'
import type { Color, ColorForm } from '../color.type'

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

// ✅ Color utility functions
const colorMap: { [key: string]: string } = {
  // Vietnamese colors
  đỏ: '#ef4444',
  xanh: '#3b82f6',
  'xanh lá': '#22c55e',
  'xanh dương': '#3b82f6',
  vàng: '#eab308',
  cam: '#f97316',
  tím: '#a855f7',
  hồng: '#ec4899',
  trắng: '#ffffff',
  đen: '#000000',
  xám: '#6b7280',
  nâu: '#a16207',
  be: '#f5f5dc',

  // English colors
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#eab308',
  orange: '#f97316',
  purple: '#a855f7',
  pink: '#ec4899',
  white: '#ffffff',
  black: '#000000',
  gray: '#6b7280',
  grey: '#6b7280',
  brown: '#a16207',
  beige: '#f5f5dc',
  navy: '#1e3a8a',
  maroon: '#7f1d1d',
}

const getColorValue = (colorName: string): string => {
  const lowerName = colorName.toLowerCase().trim()
  return colorMap[lowerName] || '#6b7280' // Default gray
}

const isLightColor = (hexColor: string): boolean => {
  // Convert hex to RGB and calculate luminance
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5
}

// ================================
// STATE MANAGEMENT
// ================================
const loading = ref(false)
const submitting = ref(false)
const deleting = ref(false)

// Data
const colors = ref<Color[]>([])

// Search & Filter
const searchQuery = ref('')
const sortConfig = reactive({
  field: 'name',
  direction: 'asc' as 'asc' | 'desc',
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Modals
const showModal = ref(false)
const isEditMode = ref(false)
const selectedColor = ref<Color | null>(null)

const showDeleteModal = ref(false)
const colorToDelete = ref<Color | null>(null)

// UI State
const activeActionMenu = ref<string | null>(null)

// ✅ FIXED: Form data - BỎ type annotation reactive<ColorForm>
const form = reactive({
  name: '',
})

// Toast state management
const showSuccessToast = ref(false)
const successMessage = ref('')
const showErrorToast = ref(false)
const errorMessage = ref('')

// ================================
// COMPUTED PROPERTIES
// ================================
const totalColors = computed(() => colors.value.length)

const todayAdded = computed(() => {
  // For demo purposes, return a static number
  // In real app, filter by createdAt date
  return Math.floor(Math.random() * 5)
})

const filteredColors = computed(() => {
  let result = [...colors.value]

  // Search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(
      (color) => color.name.toLowerCase().includes(query) || color.id.toLowerCase().includes(query),
    )
  }

  // Sorting
  result.sort((a, b) => {
    let aValue = a[sortConfig.field as keyof Color] || ''
    let bValue = b[sortConfig.field as keyof Color] || ''

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

const totalPages = computed(() => Math.ceil(filteredColors.value.length / itemsPerPage.value))

const paginatedColors = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredColors.value.slice(start, end)
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
const loadColors = async (): Promise<void> => {
  try {
    loading.value = true
    console.log('🔄 Loading colors from API...')

    const response = await getAllColorsApi()
    colors.value = response || []

    console.log('✅ Colors loaded successfully:', response)
    activeActionMenu.value = null
  } catch (error: any) {
    console.error('❌ Error loading colors:', error)
    showError('Không thể tải danh sách màu sắc. Vui lòng thử lại.')
  } finally {
    loading.value = false
  }
}

const refreshData = (): void => {
  console.log('🔄 Refreshing color data...')
  loadColors()
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
  selectedColor.value = null
  form.name = ''
  showModal.value = true
  activeActionMenu.value = null
}

const openEditModal = (color: Color): void => {
  console.log('✏️ Opening edit modal for color:', color.id)
  isEditMode.value = true
  selectedColor.value = color
  form.name = color.name
  showModal.value = true
  activeActionMenu.value = null
}

const closeModal = (): void => {
  console.log('❌ Closing modal')
  showModal.value = false
  isEditMode.value = false
  selectedColor.value = null
  form.name = ''
}

// ================================
// FORM SUBMISSION - ✅ FIXED
// ================================
const handleSubmit = async (): Promise<void> => {
  try {
    submitting.value = true

    // ✅ SỬA: Tạo object thay vì dùng ColorForm constructor
    const colorData = {
      name: form.name.trim(),
    }

    if (isEditMode.value && selectedColor.value) {
      console.log('✏️ Updating color:', selectedColor.value.id, colorData)
      await updateColorApi(selectedColor.value.id, colorData)
      showSuccess('Cập nhật màu sắc thành công')
    } else {
      console.log('➕ Creating new color:', colorData)
      await createColorApi(colorData)
      showSuccess('Thêm màu sắc mới thành công')
    }

    closeModal()
    await loadColors() // Reload data
  } catch (error: any) {
    console.error('❌ Error submitting form:', error)
    const action = isEditMode.value ? 'cập nhật' : 'thêm'
    showError(`Không thể ${action} màu sắc: ${error?.message || 'Có lỗi xảy ra'}`)
  } finally {
    submitting.value = false
  }
}

// ================================
// DELETE METHODS
// ================================
const confirmDelete = (color: Color): void => {
  console.log('🗑️ Confirm delete color:', color.id)
  colorToDelete.value = color
  showDeleteModal.value = true
  activeActionMenu.value = null
}

const closeDeleteModal = (): void => {
  console.log('❌ Closing delete modal')
  showDeleteModal.value = false
  colorToDelete.value = null
}

const handleDelete = async (): Promise<void> => {
  if (!colorToDelete.value) return

  try {
    deleting.value = true
    console.log('🗑️ Deleting color:', colorToDelete.value.id)

    await deleteColorApi(colorToDelete.value.id)
    showSuccess('Xóa màu sắc thành công')

    closeDeleteModal()
    await loadColors() // Reload data
  } catch (error: any) {
    console.error('❌ Error deleting color:', error)
    showError(`Không thể xóa màu sắc. Hãy kiểm tra lại.`)
  } finally {
    deleting.value = false
  }
}

// ================================
// UI INTERACTION METHODS
// ================================
const toggleActionMenu = (colorId: string): void => {
  activeActionMenu.value = activeActionMenu.value === colorId ? null : colorId
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
onMounted(() => {
  console.log('🚀 ColorManagerList component mounted')
  loadColors()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  console.log('💀 ColorManagerList component unmounted')
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

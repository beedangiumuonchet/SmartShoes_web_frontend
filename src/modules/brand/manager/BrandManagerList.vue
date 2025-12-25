// filepath: [BrandManagerList.vue](http://_vscodecontentref_/0)
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b border-gray-200 mb-6">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Quản lý thương hiệu</h1>
            <p class="text-gray-600 mt-1">Quản lý tất cả thương hiệu sản phẩm trong hệ thống</p>
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

            <!-- Add Brand Button -->
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
              Thêm thương hiệu
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
                placeholder="Tìm kiếm theo tên thương hiệu..."
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-blue-600">Tổng thương hiệu</p>
                <p class="text-2xl font-bold text-blue-900">{{ totalBrands }}</p>
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
                <p class="text-2xl font-bold text-green-900">{{ filteredBrands.length }}</p>
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

    <!-- Brands Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">
            Danh sách thương hiệu
            <span class="text-sm font-normal text-gray-500 ml-2">
              ({{ filteredBrands.length }} kết quả)
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
      <div v-else-if="!filteredBrands.length" class="p-12 text-center">
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
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Không có thương hiệu nào</h3>
        <p class="text-gray-600 mb-4">
          {{
            searchQuery
              ? 'Không tìm thấy thương hiệu phù hợp với từ khóa tìm kiếm.'
              : 'Chưa có thương hiệu nào trong hệ thống.'
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
          Thêm thương hiệu đầu tiên
        </button>
      </div>

      <!-- Brands Grid/Table -->
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
                    <span>Tên thương hiệu</span>
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
                v-for="brand in paginatedBrands"
                :key="brand.id"
                class="hover:bg-gray-50 transition-colors duration-200"
              >
                <!-- Brand Name -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img
                        v-if="brand.url"
                        :src="getDirectImageUrl(brand.url)"
                        alt="Brand logo"
                        class="h-10 w-10 object-cover rounded-lg border"
                      />

                      <!-- Fallback nếu chưa có ảnh -->
                      <div
                        v-else
                        class="h-10 w-10 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center"
                      >
                        <span class="text-sm font-medium text-white">
                          {{ brand.name.substring(0, 2).toUpperCase() }}
                        </span>
                      </div>
                    </div>

                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ brand.name }}
                      </div>
                      <div class="text-sm text-gray-500">Thương hiệu</div>
                    </div>
                  </div>
                </td>

                <!-- Description -->
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 max-w-xs">
                    <div v-if="brand.description" class="truncate">
                      {{ brand.description }}
                    </div>
                    <div v-else class="text-gray-500 italic">Không có mô tả</div>
                  </div>
                </td>

                <!-- ID -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <code class="bg-gray-100 px-2 py-1 rounded text-xs">{{ brand.id }}</code>
                </td>

                <!-- Actions -->
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="relative inline-block text-left">
                    <button
                      @click="toggleActionMenu(brand.id)"
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
                      v-if="activeActionMenu === brand.id"
                      class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                    >
                      <div class="py-1">
                        <button
                          @click="openEditModal(brand)"
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
                          @click="confirmDelete(brand)"
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
            v-for="brand in paginatedBrands"
            :key="brand.id"
            class="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div
                  class="h-10 w-10 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center"
                >
                  <span class="text-sm font-medium text-white">
                    {{ brand.name.substring(0, 2).toUpperCase() }}
                  </span>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-900">{{ brand.name }}</h3>
                  <p class="text-xs text-gray-500">ID: {{ brand.id }}</p>
                </div>
              </div>
              <button @click="toggleActionMenu(brand.id)" class="text-gray-400 hover:text-gray-600">
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

            <div v-if="brand.description" class="text-sm text-gray-600">
              {{ brand.description }}
            </div>
            <div v-else class="text-sm text-gray-500 italic">Không có mô tả</div>

            <div
              v-if="activeActionMenu === brand.id"
              class="flex space-x-2 pt-2 border-t border-gray-200"
            >
              <button
                @click="openEditModal(brand)"
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
                @click="confirmDelete(brand)"
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
      <div v-if="filteredBrands.length > itemsPerPage" class="px-6 py-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} -
            {{ Math.min(currentPage * itemsPerPage, filteredBrands.length) }}
            trong tổng số {{ filteredBrands.length }} kết quả
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

    <!-- Create/Edit Brand Modal -->
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
              {{ isEditMode ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu mới' }}
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
            <!-- Brand Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tên thương hiệu <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Nhập tên thương hiệu..."
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"> Mô tả </label>
              <textarea
                v-model="form.description"
                rows="3"
                class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Nhập mô tả thương hiệu..."
              ></textarea>
            </div>

            <!-- Brand Image -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"> Ảnh thương hiệu </label>

              <input
                type="file"
                accept="image/*"
                @change="handleImageChange"
                class="block w-full text-sm text-gray-700"
              />

              <!-- Preview -->
              <div v-if="imagePreview" class="mt-3">
                <img
                  :src="getDirectImageUrl(imagePreview)"
                  alt="Preview"
                  class="h-24 w-24 object-cover rounded border"
                />
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
            Bạn có chắc chắn muốn xóa thương hiệu
            <strong class="text-gray-900">{{ brandToDelete?.name }}</strong
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
import { getAllBrandsApi, createBrandApi, updateBrandApi, deleteBrandApi } from '../brand.api'
import type { Brand, BrandForm } from '../brand.type'
import { uploadImageApi } from '../../upfile/upfile.api' // đường dẫn đúng của bạn

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

const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)

function getDirectImageUrl(driveUrl: string) {
  // Tách ID ảnh từ link Google Drive
  const match = driveUrl?.match(/\/d\/([^/]+)/)
  if (!match) return driveUrl

  const driveId = match[1]
  // Gọi ảnh qua API backend (nó sẽ tự cache local)
  return `http://localhost:8080/api/v1/images/${driveId}`
}
const handleImageChange = (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (!files || files.length === 0) return

  const file = files[0]

  // Validate đơn giản
  if (!file.type.startsWith('image/')) {
    showError('Vui lòng chọn file ảnh')
    return
  }

  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

// ================================
// STATE MANAGEMENT
// ================================
const loading = ref(false)
const submitting = ref(false)
const deleting = ref(false)

// Data
const brands = ref<Brand[]>([])

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
const selectedBrand = ref<Brand | null>(null)

const showDeleteModal = ref(false)
const brandToDelete = ref<Brand | null>(null)

// UI State
const activeActionMenu = ref<string | null>(null)

// ✅ FIXED: Form data - BỎ type annotation reactive<BrandForm>
const form = reactive({
  name: '',
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
const totalBrands = computed(() => brands.value.length)

const todayAdded = computed(() => {
  // For demo purposes, return a static number
  // In real app, filter by createdAt date
  return Math.floor(Math.random() * 5)
})

const filteredBrands = computed(() => {
  let result = [...brands.value]

  // Search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(
      (brand) =>
        brand.name.toLowerCase().includes(query) ||
        (brand.description && brand.description.toLowerCase().includes(query)) ||
        brand.id.toLowerCase().includes(query),
    )
  }

  // Sorting
  result.sort((a, b) => {
    let aValue = a[sortConfig.field as keyof Brand] || ''
    let bValue = b[sortConfig.field as keyof Brand] || ''

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

const totalPages = computed(() => Math.ceil(filteredBrands.value.length / itemsPerPage.value))

const paginatedBrands = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredBrands.value.slice(start, end)
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
const loadBrands = async (): Promise<void> => {
  try {
    loading.value = true
    console.log('🔄 Loading brands from API...')

    const response = await getAllBrandsApi()
    brands.value = response || []

    console.log('✅ Brands loaded successfully:', response)
    activeActionMenu.value = null
  } catch (error: any) {
    console.error('❌ Error loading brands:', error)
    showError('Không thể tải danh sách thương hiệu. Vui lòng thử lại.')
  } finally {
    loading.value = false
  }
}

const refreshData = (): void => {
  console.log('🔄 Refreshing brand data...')
  loadBrands()
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
  selectedBrand.value = null
  form.name = ''
  form.description = ''
  showModal.value = true
  activeActionMenu.value = null
  imageFile.value = null
  imagePreview.value = null
}

const openEditModal = (brand: Brand): void => {
  console.log('✏️ Opening edit modal for brand:', brand.id)
  isEditMode.value = true
  selectedBrand.value = brand
  form.name = brand.name
  form.description = brand.description || ''
  showModal.value = true
  activeActionMenu.value = null
  imageFile.value = null
  imagePreview.value = brand.url || null
}

const closeModal = (): void => {
  console.log('❌ Closing modal')
  showModal.value = false
  isEditMode.value = false
  selectedBrand.value = null
  form.name = ''
  form.description = ''
  imageFile.value = null
  imagePreview.value = null
}

// ================================
// FORM SUBMISSION - ✅ FIXED
// ================================
// const handleSubmit = async (): Promise<void> => {
//   try {
//     submitting.value = true

//     // ✅ SỬA: Tạo object thay vì dùng BrandForm constructor
//     const brandData = {
//       name: form.name.trim(),
//       description: form.description?.trim() || undefined,
//     }

//     if (isEditMode.value && selectedBrand.value) {
//       console.log('✏️ Updating brand:', selectedBrand.value.id, brandData)
//       await updateBrandApi(selectedBrand.value.id, brandData)
//       showSuccess('Cập nhật thương hiệu thành công')
//     } else {
//       console.log('➕ Creating new brand:', brandData)
//       await createBrandApi(brandData)
//       showSuccess('Thêm thương hiệu mới thành công')
//     }

//     closeModal()
//     await loadBrands() // Reload data
//   } catch (error: any) {
//     console.error('❌ Error submitting form:', error)
//     const action = isEditMode.value ? 'cập nhật' : 'thêm'
//     showError(`Không thể ${action} thương hiệu: ${error?.message || 'Có lỗi xảy ra'}`)
//   } finally {
//     submitting.value = false
//   }
// }
const handleSubmit = async (): Promise<void> => {
  try {
    submitting.value = true

    let url: string | undefined = selectedBrand.value?.url

    // 👉 1. Nếu có ảnh mới → upload
    if (imageFile.value) {
      console.log('📤 Uploading brand image...')
      const uploadRes = await uploadImageApi(imageFile.value)

      url = uploadRes.result // hoặc uploadRes.data.url (tùy backend)
    }

    // 👉 2. Data gửi lên backend
    const brandData = {
      name: form.name.trim(),
      description: form.description?.trim() || undefined,
      url, // 👈 BỔ SUNG
    }

    if (isEditMode.value && selectedBrand.value) {
      await updateBrandApi(selectedBrand.value.id, brandData)
      showSuccess('Cập nhật thương hiệu thành công')
    } else {
      await createBrandApi(brandData)
      showSuccess('Thêm thương hiệu mới thành công')
    }

    closeModal()
    await loadBrands()
  } catch (error: any) {
    showError('Trùng tên thương hiệu hoặc có lỗi xảy ra. Vui lòng thử lại.')
  } finally {
    submitting.value = false
  }
}

// ================================
// DELETE METHODS
// ================================
const confirmDelete = (brand: Brand): void => {
  console.log('🗑️ Confirm delete brand:', brand.id)
  brandToDelete.value = brand
  showDeleteModal.value = true
  activeActionMenu.value = null
}

const closeDeleteModal = (): void => {
  console.log('❌ Closing delete modal')
  showDeleteModal.value = false
  brandToDelete.value = null
}

const handleDelete = async (): Promise<void> => {
  if (!brandToDelete.value) return

  try {
    deleting.value = true
    console.log('🗑️ Deleting brand:', brandToDelete.value.id)

    await deleteBrandApi(brandToDelete.value.id)
    showSuccess('Xóa thương hiệu thành công')

    closeDeleteModal()
    await loadBrands() // Reload data
  } catch (error: any) {
    console.error('❌ Error deleting brand:', error)
    showError(`Không thể xóa thương hiệu. Hãy kiểm tra lại.`)
  } finally {
    deleting.value = false
  }
}

// ================================
// UI INTERACTION METHODS
// ================================
const toggleActionMenu = (brandId: string): void => {
  activeActionMenu.value = activeActionMenu.value === brandId ? null : brandId
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
  console.log('🚀 BrandManagerList component mounted')
  loadBrands()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  console.log('💀 BrandManagerList component unmounted')
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

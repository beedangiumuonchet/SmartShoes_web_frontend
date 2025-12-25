<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200 mb-6">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Quản lý khuyến mãi</h1>
            <p class="text-gray-600 mt-1">Tạo, sửa, xóa và gán các variant sản phẩm cho khuyến mãi</p>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="fetchAll"
              :disabled="loading"
              class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <svg :class="['w-4 h-4 mr-2', loading ? 'animate-spin' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Làm mới
            </button>

            <button @click="openCreateModal"
                    class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Thêm Promotion
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="md:col-span-2">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <input v-model="searchQuery" type="text" placeholder="Tìm kiếm theo tên promotion..."
                     class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                     @input="debouncedSearch" />
            </div>
          </div>

          <div>
            <select v-model="filters.status" @change="applyFilters"
                    class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none sm:text-sm">
              <option value="">Tất cả trạng thái</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="UPCOMING">UPCOMING</option>
              <option value="EXPIRED">EXPIRED</option>
            </select>
          </div>

          <div class="flex items-center space-x-2">
            <input v-model="filters.startDate" type="date" @change="applyFilters"
                   class="w-full py-2 px-3 border border-gray-300 rounded-md bg-white sm:text-sm" />
            <input v-model="filters.endDate" type="date" @change="applyFilters"
                   class="w-full py-2 px-3 border border-gray-300 rounded-md bg-white sm:text-sm" />
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div class="bg-blue-50 rounded-lg p-4">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-blue-600">Tổng khuyến mãi</p>
                <p class="text-2xl font-bold text-blue-900">{{ promotions.length }}</p>
              </div>
            </div>
          </div>

          <div class="bg-green-50 rounded-lg p-4">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-green-600">Đang hoạt động</p>
                <p class="text-2xl font-bold text-green-900">{{ activeCount }}</p>
              </div>
            </div>
          </div>

          <div class="bg-purple-50 rounded-lg p-4">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-purple-600">Sắp diễn ra</p>
                <p class="text-2xl font-bold text-purple-900">{{ upcomingCount }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">
            Danh sách Promotion <span class="text-sm font-normal text-gray-500 ml-2">({{ filteredPromotions.length }} kết quả)</span>
          </h2>
        </div>
      </div>

      <div v-if="loading" class="p-12 text-center">
        <div class="inline-flex items-center space-x-2">
          <svg class="w-5 h-5 animate-spin text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          <span class="text-gray-600">Đang tải dữ liệu...</span>
        </div>
      </div>

      <div v-else-if="!filteredPromotions.length" class="p-12 text-center">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Không có promotion</h3>
        <p class="text-gray-600 mb-4">
          {{ searchQuery ? 'Không tìm thấy promotion phù hợp.' : 'Chưa có promotion nào trong hệ thống.' }}
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <div class="hidden md:block">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên khuyến mãi</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% giảm</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày bắt đầu</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày kết thúc</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số variant</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>

            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="promo in paginatedPromotions" :key="promo.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ promo.name }}</div>
                  <div class="text-sm text-gray-500 truncate max-w-xs">{{ promo.description || '—' }}</div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ promo.percent }}%</td>

                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ promo.startDate }}</td>

                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ promo.endDate }}</td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      promo.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : promo.status === 'UPCOMING' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ promo.status }}
                  </span>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ countVariants(promo) }}</td>

                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="relative inline-block text-left">
                    <button @click="toggleActionMenu(promo.id)" class="text-gray-400 hover:text-gray-600 focus:outline-none">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                      </svg>
                    </button>

                    <div v-if="activeActionMenu === promo.id" class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                      <div class="py-1">
                        <button @click="openDetailModal(promo)" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Xem chi tiết
                        </button>
                        <button
                          v-if="canAddProduct(promo)"
                          @click="openSelectProductsModal(promo)"
                          class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                        >
                          Thêm sản phẩm
                        </button>

                        <button v-if="canEditPromotion(promo)" @click="openEditModal(promo)" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Chỉnh sửa
                        </button>
                        <button @click="confirmDeletePromotion(promo)" class="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50">
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

        <!-- Mobile card view -->
        <div class="md:hidden p-4 space-y-4">
          <div v-for="promo in paginatedPromotions" :key="promo.id" class="bg-white border border-gray-200 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900">{{ promo.name }}</h3>
                <p class="text-xs text-gray-500">{{ formatDate(promo.startDate) }} - {{ formatDate(promo.endDate) }}</p>
              </div>
              <div class="text-right">
                <div class="text-sm font-semibold">{{ promo.percent }}%</div>
                <div class="text-xs text-gray-500">{{ countVariants(promo) }} variants</div>
              </div>
            </div>
            <div class="flex justify-end mt-3">
              <button @click="toggleActionMenu(promo.id)" class="text-gray-400 hover:text-gray-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                </svg>
              </button>

              <div v-if="activeActionMenu === promo.id" class="flex space-x-2 pt-2">
                <button @click="openDetailModal(promo)" class="px-3 py-2 border rounded text-sm">Xem</button>
                <button @click="openSelectProductsModal(promo)" class="px-3 py-2 border rounded text-sm text-indigo-600">
                  Thêm SP
                </button>


                <button @click="openEditModal(promo)" class="px-3 py-2 border rounded text-sm">Sửa</button>
                <button @click="confirmDeletePromotion(promo)" class="px-3 py-2 border rounded text-sm text-red-600">Xóa</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="filteredPromotions.length > itemsPerPage" class="px-6 py-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} -
            {{ Math.min(currentPage * itemsPerPage, filteredPromotions.length) }} trong tổng số {{ filteredPromotions.length }}
          </div>

          <div class="flex items-center space-x-2">
            <button @click="previousPage" :disabled="currentPage <= 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Trước
            </button>
            <span class="text-sm text-gray-700"> Trang {{ currentPage }} / {{ totalPages }} </span>
            <button @click="nextPage" :disabled="currentPage >= totalPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create / Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">{{ isEditMode ? 'Chỉnh sửa Promotion' : 'Thêm Promotion mới' }}</h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Tên Promotion <span class="text-red-500">*</span></label>
                <input v-model="form.name" type="text" required
                       class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                       placeholder="Nhập tên promotion..." />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">% Giảm <span class="text-red-500">*</span></label>
                <input v-model.number="form.percent" type="number" required min="0" max="100" :disabled="isReadonlyBaseFields"
                       class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Ngày bắt đầu <span class="text-red-500">*</span></label>
                <input v-model="form.startDate" type="date" required :disabled="isReadonlyBaseFields"
                       class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none sm:text-sm"/>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Ngày kết thúc <span class="text-red-500">*</span></label>
                <input v-model="form.endDate" type="date" required 
                      :min="form.status === 'ACTIVE' ? new Date().toISOString().split('T')[0] : undefined"
                      :disabled="isEditMode && form.status === 'INACTIVE'"
                       class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none sm:text-sm"/>
              </div>
            </div>

            <!-- STATUS FIELD (chỉ hiển thị khi edit) -->
            <div v-if="isEditMode">
              <label class="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>

              <!-- Nếu đang ACTIVE hoặc INACTIVE → cho phép chọn -->
              <select
                v-if="form.status === 'ACTIVE' || form.status === 'INACTIVE'"
                v-model="form.status"
                class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none sm:text-sm"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>

              <!-- Nếu UPCOMING hoặc EXPIRED → chỉ cho xem -->
              <input
                v-else
                type="text"
                :value="form.status"
                disabled
                class="block w-full py-2 px-3 border border-gray-200 bg-gray-100 rounded-md sm:text-sm text-gray-500"
              />
            </div>


            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
              <textarea v-model="form.description" rows="3"
                        class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none sm:text-sm"
                        placeholder="Mô tả ngắn..."></textarea>
            </div>

            <div class="flex justify-between items-center">
              <div class="text-sm text-gray-600">Sau khi lưu, bạn có thể chọn sản phẩm/variant để áp dụng.</div>
              <div class="flex space-x-3">
                <button type="button" @click="closeModal"
                        class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Hủy</button>
                <button type="submit" :disabled="submitting"
                        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  {{ submitting ? (isEditMode ? 'Đang cập nhật...' : 'Đang tạo...') : (isEditMode ? 'Cập nhật' : 'Tạo mới') }}
                </button>
              </div>
            </div>
          </form>

          <!-- If created/edited successfully we allow opening select-products modal -->
          <div v-if="createdPromotion && !isSelectingProducts" class="mt-4 border-t pt-4">
            <button @click="openSelectProductsModal(createdPromotion)"
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
              Chọn sản phẩm & variant để áp dụng ngay
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Select Products Modal -->
    <div v-if="showSelectProductsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-12 mx-auto p-5 border w-11/12 md:w-5/6 lg:w-4/5 shadow-lg rounded-md bg-white">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-semibold">Chọn sản phẩm & variant cho: <span class="font-medium text-indigo-600">{{ selectedPromotionForSelection?.name }}</span></h3>
          <div class="flex items-center space-x-2">
            <input v-model="productSearchQuery" placeholder="Tìm sản phẩm..." class="px-3 py-2 border rounded" />
            <button @click="closeSelectProductsModal" class="px-3 py-2 border rounded">Đóng</button>
            <button @click="applySelectedVariants" :disabled="applyingVariants"
                    class="px-3 py-2 bg-indigo-600 text-white rounded disabled:opacity-50">Áp dụng ({{ selectedVariantIds.size }})</button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-4 max-h-[60vh] overflow-auto pr-2">
            <div v-for="product in filteredProducts" :key="product.id" class="border rounded p-3">
              <div class="flex items-start justify-between">
                <div>
                  <div class="flex items-center space-x-3">
                    <div class="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                      <img v-if="getMainImage(product)" :src="getMainImage(product)" class="h-10 w-10 object-cover rounded" />
                      <span v-else class="text-sm text-gray-500">{{ product.name?.slice(0,2)?.toUpperCase() }}</span>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                      <div class="text-xs text-gray-500">{{ product.category?.name || '' }}</div>
                    </div>
                  </div>
                </div>

                <div class="flex items-center space-x-2">
                  <button @click="toggleSelectAllProduct(product)" class="px-2 py-1 text-sm border rounded">
                    {{ isAllVariantsSelected(product) ? 'Bỏ chọn tất cả' : 'Chọn tất cả' }}
                  </button>
                </div>
              </div>

              <!-- variants list -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                <label v-for="variant in product.variants || []" :key="variant.id" class="flex items-center space-x-2 text-sm">
                  <input type="checkbox" :value="variant.id" :checked="selectedVariantIds.has(variant.id)"
                         @change="toggleVariantSelection(variant, product)" class="rounded" />
                  <div class="flex-1">
                    <div class="flex items-center space-x-1">
                      <span class="text-sm text-gray-900">{{ variant.colorName || variant.color?.name || '—' }} / {{ variant.size || '' }}</span>
                      <!-- Tag status -->
                      <!-- Tag status -->
<span
  v-if="getVariantStatus(variant) === 'UPCOMING'"
  class="text-xs px-1 py-0.5 bg-yellow-100 text-yellow-800 rounded"
>
  Upcoming
</span>

<span
  v-else-if="getVariantStatus(variant) === 'ACTIVE'"
  class="text-xs px-1 py-0.5 bg-green-100 text-green-700 rounded"
>
  Active
</span>

                    </div>
                    <div class="text-xs text-gray-500">Giá: {{ variant.price }} VNĐ</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- right column: preview selected variants -->
          <div class="max-h-[60vh] overflow-auto border rounded p-3">
            <h4 class="font-medium mb-2">Danh sách variant đã chọn ({{ selectedVariantIds.size }})</h4>
            <div v-if="!selectedVariantIds.size" class="text-sm text-gray-500">Chưa có variant nào được chọn</div>
            <ul class="space-y-2">
              <li v-for="id of Array.from(selectedVariantIds)" :key="id" class="flex items-center justify-between border rounded p-2">
                <div class="text-sm text-gray-900">{{ findVariantLabelById(id) }}</div>
                <button @click="deselectVariantById(id)" class="text-xs text-red-600">Xóa</button>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="showDetail" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-12 mx-auto p-5 border w-11/12 md:w-5/6 lg:w-2/3 shadow-lg rounded-md bg-white">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-semibold">Chi tiết Promotion: <span class="text-indigo-600">{{ detailPromotion?.name }}</span></h3>
          <div>
            <button @click="closeDetail" class="px-3 py-2 border rounded">Đóng</button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>Phần trăm:</strong> {{ detailPromotion?.percent }}%</p>
            <p><strong>Ngày:</strong> {{ formatDate(detailPromotion?.startDate) }} - {{ formatDate(detailPromotion?.endDate) }}</p>
            <p class="mt-2"><strong>Mô tả:</strong> {{ detailPromotion?.description || '—' }}</p>
          </div>

          <div>
            <p><strong>Trạng thái:</strong> {{ detailPromotion?.status }}</p>
            <p><strong>Số variant áp dụng:</strong> {{ countVariants(detailPromotion) }}</p>
          </div>
        </div>
        <!-- Lặp theo từng product -->
        <div
          v-for="(variants, productName) in groupedPromotionProducts"
          :key="productName"
          class="border rounded p-3 bg-gray-50"
        >
          <!-- Tên sản phẩm -->
          <div class="font-semibold text-gray-900 mb-2">
            {{ productName }}
          </div>

          <!-- List variant của sản phẩm -->
          <div class="space-y-2">
            <div
              v-for="pp in variants"
              :key="pp.id"
              class="flex items-center justify-between border rounded p-2 bg-white"
            >
              <div>
                <div class="text-xs text-gray-500">
                  {{ pp.productVariant?.colorName || pp.productVariant?.color?.name || '' }}
                  /
                  {{ pp.productVariant?.size || '' }}
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <div class="text-sm">{{ pp.productVariant?.price }} VNĐ</div>
                <button
                v-if="canRemoveVariantFromPromotion"
                  @click="removePromotionProduct(pp)"
                  class="px-2 py-1 text-xs text-red-600 border rounded"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>

    <!-- Delete Promotion Confirm -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-1/3 shadow-lg rounded-md bg-white">
        <div class="text-center">
          <h3 class="text-lg font-semibold">Xác nhận xóa Promotion</h3>
          <p class="text-gray-600 mt-2">Bạn có chắc chắn muốn xóa <strong>{{ promotionToDelete?.name }}</strong>? Hành động này không thể hoàn tác.</p>
          <div class="mt-4 flex justify-center space-x-3">
            <button @click="closeDeleteConfirm" class="px-4 py-2 border rounded">Hủy</button>
            <button @click="deletePromotion" :disabled="deleting" class="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50">Xóa</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toasts -->
    <transition name="fade">
      <div v-if="toast.message" :class="['fixed top-6 right-6 z-50 p-4 rounded shadow-lg', toast.type === 'success' ? 'bg-white ring-1 ring-green-300' : 'bg-white ring-1 ring-red-300']">
        <div class="text-sm">{{ toast.message }}</div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
/**
 * PromotionAdmin.vue
 * - Full CRUD for promotions
 * - Select products -> expand variants -> select variants (select all per product)
 *
 * IMPORTANT: Make sure these API functions exist and adjust import paths if needed:
 * getAllPromotionsApi, createPromotionApi, updatePromotionApi, deletePromotionApi,
 * getAllProductsApi, createPromotionProductApi, getPromotionProductsByPromotionIdApi, deletePromotionProductApi
 */

import { ref, reactive, computed, watch, onMounted } from 'vue'
import type { Promotion, PromotionProductVariant } from '../promotion.type' // adjust path
import type { Product, ProductVariant } from '../../products/product.type' // adjust path

// API imports - adjust the import path to your actual service file
import {
  getAllPromotionsApi,
  getPromotionByIdApi,
  createPromotionApi,
  updatePromotionApi,
  deletePromotionApi,
  getPromotionProductsByPromotionIdApi,
  getAllPromotionProductsApi,
  createPromotionProductApi,
  deletePromotionProductApi
} from '../promotion.api' // <- adjust if your path is different

import { getAllProductsApi } from '../../products/product.api' // <- adjust path

// State
const promotions = ref<Promotion[]>([])
const products = ref<Product[]>([])
const promotionProducts = ref<PromotionProductVariant[]>([])
const loading = ref(false)
const submitting = ref(false)
const deleting = ref(false)
const promotionProductsLoading = ref(false)
const allPromotionProducts = ref<PromotionProductVariant[]>([])
const selectedPromotion = ref<Promotion | null>(null)


const activeActionMenu = ref<string | null>(null)

const canEditPromotion = (promo: Promotion) => {
  return promo.status === 'UPCOMING' || promo.status === 'ACTIVE' || promo.status === 'INACTIVE'
}

const canAddProduct = (promo: Promotion) => {
  return promo.status !== 'EXPIRED'
}
const isReadonlyBaseFields = computed(() => {
  return isEditMode.value && (form.status === 'ACTIVE' || form.status === 'INACTIVE')
})


// Filters and search
const searchQuery = ref('')
const productSearchQuery = ref('')
const debouncedTimer = ref<number | null>(null)
const filters = reactive({
  status: '',
  startDate: '',
  endDate: ''
})

// Pagination
const itemsPerPage = 8
const currentPage = ref(1)
const totalPages = computed(() => Math.ceil(filteredPromotions.value.length / itemsPerPage))

// Modal states
const showModal = ref(false)
const isEditMode = ref(false)
const showSelectProductsModal = ref(false)
const selectedPromotionForSelection = ref<Promotion | null>(null)
const isSelectingProducts = ref(false)
const createdPromotion = ref<Promotion | null>(null)

const showDetail = ref(false)
const detailPromotion = ref<Promotion | null>(null)

const showDeleteConfirm = ref(false)
const promotionToDelete = ref<Promotion | null>(null)

const toast = reactive({ message: '', type: 'success' as 'success' | 'error' })

// form model
const form = reactive({
  id: '',
  name: '',
  description: '',
  percent: 0,
  startDate: '',
  endDate: '',
  status: 'ACTIVE'
})

const stats = ref({
  ACTIVE: 0,
  UPCOMING: 0,
  EXPIRED: 0
})


// selection: store selected variant ids (Set)
const selectedVariantIds = ref(new Set<string>())

// other UI state
const productSearchFilter = ref('')

// helpers
function showToast(message: string, type: 'success' | 'error' = 'success') {
  toast.message = message
  toast.type = type
  setTimeout(() => { toast.message = '' }, 3500)
}

function formatDate(date?: string | null) {
  if (!date) return '—'
  try {
    const d = new Date(date)
    return d.toLocaleDateString()
  } catch (e) {
    return date
  }
}

// fetch data
async function fetchAll() {
  loading.value = true
  try {
    const res = await getAllPromotionsApi()
    // handle both direct array or nested IApiResponse
    promotions.value = Array.isArray(res) ? res : (res?.data ?? res)
  } catch (err) {
    console.error(err)
    showToast('Lỗi khi lấy promotions', 'error')
  } finally {
    loading.value = false
  }
}


async function fetchProducts() {
  try {
    const res = await getAllProductsApi({ page: 0, size: 1000 }) // assume API supports pagination params
    // response may be wrapped in IApiResponse with data.pagination.items
    // try to extract robustly
    let data: any = res
    if (res?.data?.items) data = res.data.items
    else if (res?.data) data = res.data
    products.value = data?.content ?? data ?? []
  } catch (err) {
    console.error(err)
    showToast('Lỗi khi tải sản phẩm', 'error')
  }
}

const activeCount = computed(() =>
  promotions.value.filter(p => p.status === 'ACTIVE').length
)

const upcomingCount = computed(() =>
  promotions.value.filter(p => p.status === 'UPCOMING').length
)

const expiredCount = computed(() =>
  promotions.value.filter(p => p.status === 'EXPIRED').length
)


// small utility to get main image
function getMainImage(product: any) {
  const url =
    product?.variants?.flatMap((v: any) => v.images ?? [])?.find((i: any) => i?.isMain)?.url ||
    product?.variants?.[0]?.images?.[0]?.url ||
    null
  return url
}

// create / update / delete
async function handleSubmit() {
  // validate dates
  if (!form.name || !form.percent || !form.startDate || !form.endDate) {
    showToast('Vui lòng điền đủ thông tin bắt buộc', 'error')
    return
  }
  if (new Date(form.startDate) > new Date(form.endDate)) {
    showToast('Ngày bắt đầu phải trước ngày kết thúc', 'error')
    return
  }

  if (isEditMode.value && form.status === 'ACTIVE') {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (new Date(form.endDate) <= today) {
    showToast('Ngày kết thúc phải lớn hơn ngày hiện tại', 'error')
    submitting.value = false
    return
  }
}


  submitting.value = true
  try {
    if (isEditMode.value) {
      // update
      const payload = { ...form }
      await updatePromotionApi(form.id, payload)
      showToast('Cập nhật promotion thành công', 'success')
    } else {
      const payload = {
        name: form.name,
        description: form.description,
        percent: form.percent,
        startDate: form.startDate,
        endDate: form.endDate,
        status: form.status
      }
      const res = await createPromotionApi(payload as any)
      const created = (res?.data ?? res) as Promotion

      createdPromotion.value = created
      showToast('Tạo promotion thành công', 'success')
      isEditMode.value = false
      isSelectingProducts.value = false
      // showModal.value = false
      
    }

    await fetchAll()
    // showModal.value = false
    // // reset
    // resetForm()
  } catch (err: any) {
    console.error(err)
    showToast('Lỗi khi lưu promotion: ' + (err?.message ?? ''), 'error')
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  form.id = ''
  form.name = ''
  form.description = ''
  form.percent = 0
  form.startDate = ''
  form.endDate = ''
  form.status = 'ACTIVE'
  createdPromotion.value = null
  isEditMode.value = false
}

// open modals
function openCreateModal() {
  resetForm()
  showModal.value = true
  isEditMode.value = false
}

function openEditModal(promo: Promotion) {
  form.id = promo.id
  form.name = promo.name
  form.description = promo.description ?? ''
  form.percent = promo.percent
  form.startDate = promo.startDate
  form.endDate = promo.endDate
  form.status = (promo as any).status ?? 'ACTIVE'
  isEditMode.value = true
  showModal.value = true
}

// select products modal
async function openSelectProductsModal(promotion: Promotion) {
  selectedPromotionForSelection.value = promotion
  currentPromotionId.value = promotion.id  
  await fetchPromotionProductsForPromotion(promotion.id) 
  selectedVariantIds.value = new Set() // reset selection
  // load products if not yet
  if (!products.value.length) {
    await fetchProducts()
  }
  showSelectProductsModal.value = true
}

const closeModal = (): void => {
  console.log('❌ Closing modal')
  showModal.value = false
  isEditMode.value = false
  
  // reset toàn bộ form
  form.id = ''
  form.name = ''
  form.description = ''
  form.percent = 0
  form.startDate = ''
  form.endDate = ''
  form.status = 'ACTIVE'

  createdPromotion.value = null
}


function closeSelectProductsModal() {
  showSelectProductsModal.value = false
  selectedPromotionForSelection.value = null
}

const groupedPromotionProducts = computed(() => {
  const groups = {};

  promotionProducts.value.forEach(pp => {
    const productName =
      pp.productVariant?.product?.name ||
      pp.productVariant?.productName ||
      "Không rõ sản phẩm";

    if (!groups[productName]) {
      groups[productName] = [];
    }

    groups[productName].push(pp);
  });

  return groups;
});


// variant selection helpers
function toggleVariantSelection(variant: ProductVariant, product: Product) {
  if (selectedVariantIds.value.has(variant.id)) {
    selectedVariantIds.value.delete(variant.id)
  } else {
    selectedVariantIds.value.add(variant.id)
  }
  // trigger reactivity
  selectedVariantIds.value = new Set(selectedVariantIds.value)
}

function isAllVariantsSelected(product: Product) {
  const ids = (product.variants || []).map((v: any) => v.id)
  if (!ids.length) return false
  return ids.every(id => selectedVariantIds.value.has(id))
}

function toggleSelectAllProduct(product: Product) {
  const ids = (product.variants || []).map((v: any) => v.id)
  const allSelected = isAllVariantsSelected(product)
  if (allSelected) {
    ids.forEach(id => selectedVariantIds.value.delete(id))
  } else {
    ids.forEach(id => selectedVariantIds.value.add(id))
  }
  selectedVariantIds.value = new Set(selectedVariantIds.value)
}

function findVariantLabelById(id: string) {
  for (const p of products.value) {
    const v = (p.variants || []).find((x: any) => x.id === id)
    if (v) {
      return `${p.name} — ${v.colorName || v.color?.name || ''} / ${v.size || ''}`
    }
  }
  return id
}

function deselectVariantById(id: string) {
  selectedVariantIds.value.delete(id)
  selectedVariantIds.value = new Set(selectedVariantIds.value)
}

// apply selected variants to promotion (call API createPromotionProduct for each)
const applyingVariants = ref(false)
async function applySelectedVariants() {
  if (!selectedPromotionForSelection.value) {
    showToast('Không có promotion được chọn', 'error')
    return
  }
  if (!selectedVariantIds.value.size) {
    showToast('Chưa chọn variant nào', 'error')
    return
  }

  applyingVariants.value = true
  try {
    const promotionId = selectedPromotionForSelection.value.id
    // iterate and call createPromotionProductApi
    const ids = Array.from(selectedVariantIds.value)
    for (const vid of ids) {
      try {
        await createPromotionProductApi({ promotionId, productVariantId: vid } as any)
      } catch (err) {
        // continue but notify
        console.warn('Failed to apply variant', vid, err)
      }
    }
    showToast('Áp dụng variant thành công', 'success')
    selectedVariantIds.value = new Set()
    // refresh promotion products and promotions
    await fetchPromotionProductsForPromotion(promotionId)
    await fetchAll()
    closeSelectProductsModal()
  } catch (err) {
    console.error(err)
    showToast('Lỗi khi áp dụng variant', 'error')
  } finally {
    applyingVariants.value = false
  }
}

const promotionVariantCount = ref<Record<string, number>>({})

async function loadVariantCount(promotionId: string) {
  try {
    const res = await getPromotionProductsByPromotionIdApi(promotionId)
    const list = res?.data ?? res ?? []

    // Lưu số lượng variant vào cache
    promotionVariantCount.value[promotionId] = list.length
  } catch (err) {
    console.error(err)
    showToast('Lỗi khi lấy danh sách variant', 'error')
  }
}

// promotion product operations
async function fetchPromotionProductsForPromotion(promotionId: string) {
  promotionProductsLoading.value = true
  try {
    const res = await getPromotionProductsByPromotionIdApi(promotionId)
    promotionProducts.value = res?.data ?? res ?? []
    promotionVariantCount.value[promotionId] = promotionProducts.value.length
  } catch (err) {
    console.error(err)
    showToast('Lỗi khi lấy danh sách variant áp dụng', 'error')
  } finally {
    promotionProductsLoading.value = false
  }
}

const countVariants = (promo) => {
  const id = promo.id

  // Nếu cache chưa có → load API
  if (promotionVariantCount.value[id] === undefined) {
    loadVariantCount(id)
    return "…"
  }

  // Trả về số đã có
  return promotionVariantCount.value[id]
}




async function openDetailModal(promo: Promotion) {
  selectedPromotion.value = promo
  detailPromotion.value = promo
  showDetail.value = true
  if (promo?.id) await fetchPromotionProductsForPromotion(promo.id)
}
const canRemoveVariantFromPromotion = computed(() => {
  console.log('Checking if can remove variant from promotion:', selectedPromotion.value)
  if (!selectedPromotion.value) return false
  return selectedPromotion.value.status !== 'EXPIRED'
})

function closeDetail() {
  showDetail.value = false
  detailPromotion.value = null
  promotionProducts.value = []
}

// delete promotion-product (remove variant from promotion)
async function removePromotionProduct(pp: PromotionProductVariant) {
  if (!confirm(`Bạn có chắc muốn xóa variant này khỏi promotion?`)) return
  try {
    await deletePromotionProductApi(pp.id)
    showToast('Đã xóa variant khỏi promotion', 'success')
    // refresh list
    if (detailPromotion.value?.id) await fetchPromotionProductsForPromotion(detailPromotion.value.id)
    await fetchAll()
  } catch (err) {
    console.error(err)
    showToast('Lỗi khi xóa variant khỏi promotion', 'error')
  }
}

// delete promotion
function confirmDeletePromotion(promo: Promotion) {
  promotionToDelete.value = promo
  showDeleteConfirm.value = true
}
function closeDeleteConfirm() {
  showDeleteConfirm.value = false
  promotionToDelete.value = null
}
async function deletePromotion() {
  if (!promotionToDelete.value) return
  deleting.value = true
  try {
    await deletePromotionApi(promotionToDelete.value.id)
    showToast('Xóa promotion thành công', 'success')
    await fetchAll()
    closeDeleteConfirm()
  } catch (err) {
    console.error(err)
    showToast('Lỗi khi xóa promotion', 'error')
  } finally {
    deleting.value = false
  }
}

// UI helpers
function toggleActionMenu(id: string) {
  activeActionMenu.value = activeActionMenu.value === id ? null : id
}


// search debounce
function debouncedSearch() {
  if (debouncedTimer.value) clearTimeout(debouncedTimer.value)
  debouncedTimer.value = window.setTimeout(() => {
    applyFilters()
  }, 350)
}

function applyFilters() {
  currentPage.value = 1
}

// computed lists
const filteredPromotions = computed(() => {
  let list = promotions.value.slice()
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(p => p.name?.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q))
  }
  if (filters.status) {
    list = list.filter(p => (p as any).status === filters.status)
  }
  if (filters.startDate) {
    list = list.filter(p => new Date(p.startDate) >= new Date(filters.startDate))
  }
  if (filters.endDate) {
    list = list.filter(p => new Date(p.endDate) <= new Date(filters.endDate))
  }
  return list.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
})

const paginatedPromotions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredPromotions.value.slice(start, start + itemsPerPage)
})

const totalPagesCount = computed(() => Math.max(1, Math.ceil(filteredPromotions.value.length / itemsPerPage)))

// const promotionVariantIds = computed(() =>
//   new Set(promotionProducts.value.map(pp => pp.productVariant?.id))
// )
// const promotionVariantIds = computed(() => {
//   if (!currentPromotionId.value) return new Set()

//   return new Set(
//     allPromotionProducts.value
//       .filter(pp => pp.promotion?.id === currentPromotionId.value)
//       .map(pp => pp.productVariant?.id)
//       .filter(Boolean)
//   )
// })
const promotionVariantIds = computed(() => {
  return new Set(
    promotionProducts.value
      .map(pp => pp.productVariant?.id)
      .filter(Boolean)
  )
})


// const promotionVariantIds = computed(() => {
//   return new Set(
//     allPromotionProducts.value
//       // .filter(pp => pp?.status === 'ACTIVE') // giả sử promotion có field `status`
//       .map(pp => pp.productVariant?.id)
//       .filter(Boolean) // loại bỏ undefined
//   )
// })

const currentPromotionId = ref<string | null>(null) 
// id promotion đang xem / chỉnh sửa

const filteredProducts = computed(() => {
  const q = productSearchQuery.value?.toLowerCase() || ''

  // 1) Lọc theo keyword (như cũ)
  let list = !q
    ? products.value
    : products.value.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
      )

      console.log('Filtered products before removing promotion variants:', promotionVariantIds.value)
  // 2) Loại bỏ các variant đã thuộc promotion
  list = list
    .map(product => {
      const filteredVariants = (product.variants || []).filter(
        v => !promotionVariantIds.value.has(v.id)
      )
      return {
        ...product,
        variants: filteredVariants
      }
    })
    .filter(p => p.variants.length > 0) // hide product if no valid variant left

    console.log('Filtered products after removing promotion variants:', list)
  return list
})

// Tạo map từ variantId => status
const variantStatusMap = computed(() => {
  const map = new Map<string, string>()
  allPromotionProducts.value.forEach(pp => {
    if (pp.productVariant?.id) {
      map.set(pp.productVariant.id, pp.status)
    }
  })
  console.log('Variant Status Map:', map) 
  return map
})

// Hàm toàn cục lấy status từ variant
const getVariantStatus = (variant: { id: string }) => {
  // console.log('Getting status for variant ID:', variant.id, 'Status map:', variantStatusMap.value.get(variant.id))
  return variantStatusMap.value.get(variant.id) || null
}


// pagination controls
function previousPage() {
  if (currentPage.value > 1) currentPage.value--
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// extra: when opening edit modal, pre-load promotion.products (if not present)
watch(() => isEditMode.value && showModal.value, async (v) => {
  if (v && isEditMode.value && form.id) {
    try {
      // get full promotion with products (if your API has getPromotionByIdApi)
      const res = await getPromotionByIdApi(form.id)
      const p = (res?.data ?? res) as Promotion
      // try to set products array into promo in local list
      const idx = promotions.value.findIndex(x => x.id === p.id)
      if (idx >= 0) promotions.value[idx] = p
    } catch (err) {
      // ignore
    }
  }
})

// init
onMounted(async () => {
  
  await fetchAll()
  await fetchProducts()
  try {
    const response = await getAllPromotionProductsApi()
    allPromotionProducts.value = response?.data || response || []
  } catch (error) {
    console.error('Failed to fetch all promotion-products', error)
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

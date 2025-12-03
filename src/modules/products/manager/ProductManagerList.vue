<template>
  <SidebarPart>
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white shadow-sm border-b border-gray-200 mb-6">
        <div class="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
            <p class="text-gray-600 mt-1">Danh sách và thao tác quản lý sản phẩm trong hệ thống</p>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="fetchProducts"
              class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                class="w-4 h-4 mr-2"
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
            <button
              @click="openCreateModal"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Thêm sản phẩm
            </button>
          </div>
        </div>
      </div>

      <!-- Bộ lọc -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div class="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">

          <!-- TỪ KHÓA -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Từ khóa</label>
            <input
              v-model="filters.q"
              type="text"
              placeholder="Nhập tên sản phẩm..."
              class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              @keyup.enter="fetchProducts"
            />
          </div>

          <!-- THƯƠNG HIỆU -->
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Thương hiệu</label>

            <div class="border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500">
              <div
                class="flex items-center justify-between cursor-pointer"
                @click="showBrand = !showBrand"
              >
                <span class="text-sm text-gray-700">
                  {{ selectedBrandLabel || "Chọn thương hiệu" }}
                </span>
                <span class="text-gray-500">{{ showBrand ? "▲" : "▼" }}</span>
              </div>

              <!-- Dropdown list -->
              <div v-show="showBrand" class="mt-2 max-h-40 overflow-y-auto">
                <div v-for="b in brands" :key="b.id" class="flex items-center gap-2 py-1">
                  <input type="checkbox" :value="b.id" v-model="filters.brandIds" class="w-4 h-4" />
                  <label class="text-sm text-gray-700">{{ b.name }}</label>
                </div>
              </div>
            </div>
          </div>


          <!-- DANH MỤC -->
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Thể loại</label>

            <div class="border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500">
              <div
                class="flex items-center justify-between cursor-pointer"
                @click="showCategory = !showCategory"
              >
                <span class="text-sm text-gray-700">
                  {{ selectedCategoryLabel || "Chọn thể loại" }}
                </span>
                <span class="text-gray-500">{{ showCategory ? "▲" : "▼" }}</span>
              </div>

              <!-- Dropdown list -->
              <div v-show="showCategory" class="mt-2 max-h-40 overflow-y-auto space-y-1">
                <div v-for="c in categories" :key="c.id" class="flex items-center gap-2 py-1">
                  <input type="checkbox" :value="c.id" v-model="filters.categoryIds" class="w-4 h-4" />
                  <label class="text-sm text-gray-700">{{ c.name }}</label>
                </div>
              </div>
            </div>
          </div>


          <!-- MÀU SẮC -->
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Màu sắc</label>

            <div class="border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500">
              <div
                class="flex items-center justify-between cursor-pointer"
                @click="showColor = !showColor"
              >
                <span class="text-sm text-gray-700">
                  {{ selectedColorLabel || "Chọn màu sắc" }}
                </span>
                <span class="text-gray-500">{{ showColor ? "▲" : "▼" }}</span>
              </div>

              <div v-show="showColor" class="mt-2 max-h-40 overflow-y-auto grid grid-cols-2 gap-2">
                <div v-for="color in colors" :key="color.id" class="flex items-center gap-2 py-1">
                  <input type="checkbox" :value="color.id" v-model="filters.colorIds" class="w-4 h-4" />
                  <label class="text-sm text-gray-700">{{ color.name }}</label>
                </div>
              </div>
            </div>
          </div>


          <!-- TRẠNG THÁI -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select
              v-model="filters.status"
              class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Tất cả</option>
              <option value="ACTIVE">Đang bán</option>
              <option value="INACTIVE">Ngưng bán</option>
              <!-- <option value="OUT_OF_STOCK">Hết hàng</option> -->
            </select>
          </div>

          <!-- GIÁ -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Giá</label>
            <div class="flex gap-2">
              <input
                type="number"
                v-model.number="filters.minPrice"
                placeholder="Từ"
                class="w-1/2 border rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                v-model.number="filters.maxPrice"
                placeholder="Đến"
                class="w-1/2 border rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <!-- TỒN KHO -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tồn kho</label>
            <select
              v-model="filters.inStock"
              class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Tất cả</option>
              <option :value="true">Còn hàng</option>
              <option :value="false">Hết hàng</option>
            </select>
          </div>

        </div>

        <!-- BUTTONS -->
        <div class="px-6 pb-6 flex justify-end">
          <button
            @click="resetFilters"
            class="px-4 py-2 border rounded-md text-sm font-medium mr-3 hover:bg-gray-50"
          >
            Đặt lại
          </button>

          <button
            @click="fetchProducts"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            Áp dụng
          </button>
        </div>
      </div>



      <!-- Danh sách sản phẩm -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table class="min-w-full">
          <thead class="bg-gray-100">
            <tr>
              <!-- Ảnh -->
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Ảnh</th>

              <!-- Tên -->
              <th
                class="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer"
                @click="toggleSort('name')"
              >
                <div class="flex items-center space-x-1 hover:text-gray-700 transition-colors">
                  <span>Tên</span>
                  <div class="flex flex-col">
                    <svg
                      :class="[
                        'w-3 h-3 transition-colors',
                        sortColumn === 'name' && sortDirection === 'asc'
                          ? 'text-indigo-600'
                          : 'text-gray-400'
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
                        sortColumn === 'name' && sortDirection === 'desc'
                          ? 'text-indigo-600'
                          : 'text-gray-400'
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
                </div>
              </th>

              <!-- Thương hiệu -->
              <th
                class="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer"
                @click="toggleSort('brand')"
              >
                <div class="flex items-center space-x-1 hover:text-gray-700 transition-colors">
                  <span>Thương hiệu</span>
                  <div class="flex flex-col">
                    <svg
                      :class="[
                        'w-3 h-3 transition-colors',
                        sortColumn === 'brand' && sortDirection === 'asc'
                          ? 'text-indigo-600'
                          : 'text-gray-400'
                      ]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg
                      :class="[
                        'w-3 h-3 -mt-1 transition-colors',
                        sortColumn === 'brand' && sortDirection === 'desc'
                          ? 'text-indigo-600'
                          : 'text-gray-400'
                      ]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              </th>

              <!-- Danh mục -->
              <th
                class="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer"
                @click="toggleSort('category')"
              >
                <div class="flex items-center space-x-1 hover:text-gray-700 transition-colors">
                  <span>Danh mục</span>
                  <div class="flex flex-col">
                    <svg
                      :class="[
                        'w-3 h-3 transition-colors',
                        sortColumn === 'category' && sortDirection === 'asc'
                          ? 'text-indigo-600'
                          : 'text-gray-400'
                      ]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg
                      :class="[
                        'w-3 h-3 -mt-1 transition-colors',
                        sortColumn === 'category' && sortDirection === 'desc'
                          ? 'text-indigo-600'
                          : 'text-gray-400'
                      ]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              </th>

              <!-- Giá -->
              <!-- <th
                class="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer"
                @click="toggleSort('price')"
              >
                <div class="flex items-center space-x-1 hover:text-gray-700 transition-colors">
                  <span>Giá</span>
                  <div class="flex flex-col">
                    <svg
                      :class="[
                        'w-3 h-3 transition-colors',
                        sortColumn === 'price' && sortDirection === 'asc'
                          ? 'text-indigo-600'
                          : 'text-gray-400'
                      ]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg
                      :class="[
                        'w-3 h-3 -mt-1 transition-colors',
                        sortColumn === 'price' && sortDirection === 'desc'
                          ? 'text-indigo-600'
                          : 'text-gray-400'
                      ]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              </th> -->

              <!-- Trạng thái -->
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Trạng thái</th>

              <!-- Ngày tạo -->
              <th
                class="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer"
                @click="toggleSort('createdAt')"
              >
                <div class="flex items-center space-x-1 hover:text-gray-700 transition-colors">
                  <span>Ngày tạo</span>
                  <div class="flex flex-col">
                    <svg
                      :class="[
                        'w-3 h-3 transition-colors',
                        sortColumn === 'createdAt' && sortDirection === 'asc'
                          ? 'text-indigo-600'
                          : 'text-gray-400'
                      ]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg
                      :class="[
                        'w-3 h-3 -mt-1 transition-colors',
                        sortColumn === 'createdAt' && sortDirection === 'desc'
                          ? 'text-indigo-600'
                          : 'text-gray-400'
                      ]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              </th>

              <!-- Hành động -->
              <th class="px-4 py-3 text-right text-sm font-medium text-gray-700">Hành động</th>
            </tr>
          </thead>


          <tbody>
            <tr
              v-for="p in sortedProducts"
              :key="p.id"
              class="border-t hover:bg-gray-50 text-sm text-gray-800"
            >
              <td class="px-4 py-3">
                <img :src="getMainImage(p)" class="w-14 h-14 rounded-lg object-cover" />
              </td>
              <td class="px-4 py-3 font-medium">{{ p.name }}</td>
              <td class="px-4 py-3">{{ p.brand?.name || '-' }}</td>
              <td class="px-4 py-3">{{ p.category?.name || '-' }}</td>
              <!-- <td class="px-4 py-3">{{ formatPrice(p.variants?.[0]?.price ?? 0) }}</td> -->
              <td class="px-4 py-3">
                <span
                  :class="{
                    'px-2 py-1 rounded-md text-xs font-semibold': true,
                    'bg-green-100 text-green-700': p.status === 'ACTIVE',
                    'bg-gray-200 text-gray-600': p.status === 'INACTIVE',
                    'bg-yellow-100 text-yellow-700': p.status === 'OUT_OF_STOCK'
                  }"
                >
                  {{ statusLabel(p.status) }}
                </span>
              </td>
              <td class="px-4 py-3">{{ formatDate(p.createdAt) }}</td>
              <td class="px-4 py-3 text-right relative">
                  <div class="relative inline-block text-left">
                    <!-- Nút 3 chấm -->
                    <button
                      @click="toggleActionMenu(p.id)"
                      class="p-2 rounded hover:bg-gray-100"
                    >
                      ⋮
                    </button>

                    <!-- Menu dropdown -->
                    <div
                      v-if="openMenuId === p.id"
                      class="absolute right-0 mt-2 w-28 bg-white border border-gray-200 shadow-lg rounded-md z-50"
                    >
                      <button
                        class="w-full text-left px-4 py-2 hover:bg-gray-100"
                        @click="openEditModal(p)"
                      >
                        Sửa
                      </button>
                      <button
                        class="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                        @click="askDeleteProduct(p.id)"
                      >
                        Xoá
                      </button>
                    </div>
                  </div>
                </td>

            </tr>
          </tbody>

        </table>

        <!-- Pagination -->
        <div class="p-4 flex justify-between items-center border-t text-sm text-gray-600">
          <div>
            Hiển thị:
            <strong>{{ pagination.page * pagination.size + 1 }}</strong> -
            <strong>{{ Math.min((pagination.page + 1) * pagination.size, pagination.totalElements) }}</strong>
            / <strong>{{ pagination.totalElements }}</strong>
          </div>
          <div class="flex items-center gap-2">
            <button
              :disabled="pagination.page <= 0"
              @click="prevPage"
              class="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>Trang {{ pagination.page + 1 }} / {{ pagination.totalPages || 1 }}</span>
            <button
              :disabled="!pagination.hasNext"
              @click="nextPage"
              class="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="products.length === 0" class="text-center py-20 text-gray-500">
        Không tìm thấy sản phẩm nào.
      </div>

      <!-- Modal thêm/sửa -->
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div class="bg-white rounded-xl w-[900px] max-h-[90vh] overflow-y-auto p-6">
        <h2 class="text-xl font-semibold mb-4">
          {{ isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm' }}
        </h2>

        <!-- Thông tin cơ bản -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium">Tên</label>
            <input v-model="form.name" class="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label class="text-sm font-medium">Trạng thái</label>
            <select v-model="form.status" class="w-full border rounded px-3 py-2">
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
            </select>
          </div>

          <div>
            <label class="text-sm font-medium">Thương hiệu</label>
            <select v-model="form.brandId" class="w-full border rounded px-3 py-2">
              <option value="">Chọn brand</option>
              <option v-for="b in brands" :key="b.id" :value="b.id">{{ b.name }}</option>
            </select>
          </div>
  


          <div>
            <label class="text-sm font-medium">Danh mục</label>
            <select v-model="form.categoryId" class="w-full border rounded px-3 py-2">
              <option value="">Chọn category</option>
              <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>

          <div class="col-span-2">
            <label class="text-sm font-medium">Mô tả</label>
            <textarea v-model="form.description" class="w-full border rounded px-3 py-2" rows="3"></textarea>
          </div>

        </div>

        <!-- Thuộc tính -->
        <div class="mt-6">
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-semibold">Thuộc tính (Attributes)</label>
            <button @click="addAttribute" class="text-blue-600 text-sm">+ Thêm</button>
          </div>
          <div v-for="(attr, index) in form.attributes" :key="attr.id || index" class="flex gap-2 mb-2">
            <!-- Key -->
            <div class="flex-1">
              <label class="block text-xs font-medium text-gray-600 mb-1">Tên thuộc tính</label>
              <input
                v-model="attr.attribute.key"
                :list="`attributeKeys-${index}`"
                @change="onKeySelect(attr)"
                @blur="onKeyBlur(attr)"
                placeholder="Chọn hoặc nhập key"
                class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <datalist :id="`attributeKeys-${index}`">
                <option v-for="k in uniqueKeys" :key="k" :value="k">{{ k }}</option>
              </datalist>
            </div>

            <!-- Value -->
            <div class="flex-1">
              <label class="block text-xs font-medium text-gray-600 mb-1">Giá trị</label>
              <input
                v-model="attr.attribute.value"
                :list="`valuesForKey-${index}`"
                @blur="onValueBlur(attr)"
                placeholder="Chọn hoặc nhập value"
                class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <datalist :id="`valuesForKey-${index}`">
                <option
                  v-for="v in getValuesForKey(attr.attribute.key)"
                  :key="v"
                  :value="v"
                >
                  {{ v }}
                </option>
              </datalist>
            </div>

            <!-- Remove button -->
            <button
              @click="removeAttribute(index)"
              class="text-red-500 hover:text-red-700 text-lg mt-5"
            >
              ✕
            </button>
          </div>


        </div>

        <!-- Variants -->
        <div class="mt-8">
          <div class="flex justify-between items-center mb-3">
            <label class="text-sm font-semibold">Biến thể (Variants)</label>
            <div class="flex items-center gap-2">
              <label class="text-xs text-gray-600">Chọn dải size:</label>
              <select v-model="sizeRangeStart" class="border rounded px-2 py-1 text-sm w-20">
                <option v-for="s in sizeOptions" :key="s" :value="s">{{ s }}</option>
              </select>
              <span class="text-sm">-</span>
              <select v-model="sizeRangeEnd" class="border rounded px-2 py-1 text-sm w-20">
                <option v-for="s in sizeOptions" :key="s" :value="s">{{ s }}</option>
              </select>

              <label class="text-xs text-gray-600 ml-3">Chọn màu:</label>
              <div class="relative">
                <select
                  v-model="selectedColorId"
                  class="border rounded px-2 py-1 text-sm w-36"
                  @change="onColorSelectChange"
                >
                  <option value="">Chọn màu</option>
                  <option v-for="color in colors" :key="color.id" :value="color.id">{{ color.name }}</option>
                  <option value="add_new">➕ Thêm màu mới...</option>
                </select>

                <!-- Khi chọn "Thêm màu mới" thì hiển thị input nhỏ -->
                <div v-if="showAddColorInput" class="absolute top-full mt-1 flex gap-2 bg-white border rounded-lg p-2 shadow-md w-60 z-50">
                  <input
                    v-model="newColorName"
                    placeholder="Nhập tên màu..."
                    class="border rounded px-2 py-1 text-sm flex-1"
                  />
                  <button @click="addNewColor" class="bg-indigo-600 text-white text-xs px-2 py-1 rounded">
                    Lưu
                  </button>
                  <button @click="showAddColorInput = false" class="text-gray-500 text-xs px-2 py-1">
                    ✕
                  </button>
                </div>
              </div>


              <button
                @click="generateVariants"
                class="ml-3 bg-indigo-600 text-white text-xs px-3 py-1 rounded hover:bg-indigo-700"
              >
                Sinh biến thể
              </button>
            </div>
          </div>

          <!-- Danh sách các biến thể -->
          <div v-if="form.variants.length" class="space-y-4 mt-3">
            <div
              v-for="(variant, vIdx) in form.variants"
              :key="vIdx"
              class="border rounded-lg p-4 relative"
            >
              <button
                @click="removeVariant(vIdx)"
                class="absolute top-2 right-2 text-red-500 text-sm"
              >
                ✕
              </button>

              <div class="grid grid-cols-3 gap-3">
                <div>
                  <label class="text-xs text-gray-600">Kích cỡ</label>
                  <input v-model="variant.size" class="w-full border rounded px-2 py-1" :disabled="isEdit" />
                </div>

                <div>
                  <label class="text-xs text-gray-600">Giá</label>
                  <input v-model.number="variant.price" type="number" class="w-full border rounded px-2 py-1" />
                </div>

                <div>
                  <label class="text-xs text-gray-600">Tồn kho</label>
                  <input v-model.number="variant.stock" type="number" class="w-full border rounded px-2 py-1" />
                </div>
              </div>

              <!-- Màu -->
              <div class="mt-3">
                <label class="text-xs text-gray-600">Màu</label>
                <select v-model="variant.colorId" class="w-full border rounded px-2 py-1" :disabled="isEdit">
                  <option value="">Chọn màu</option>
                  <option v-for="color in colors" :key="color.id" :value="color.id">{{ color.name }}</option>
                </select>
              </div>

              <!-- Ảnh -->
              <div class="mt-3">
                <div class="flex justify-between items-center mb-2">
                  <label class="text-xs text-gray-600">Ảnh</label>
                  <button @click="addImage(vIdx)" class="text-blue-600 text-xs">+ Thêm ảnh</button>
                </div>

                <!-- <div
                  v-for="(img, iIdx) in variant.images"
                  :key="img.id ||iIdx"
                  class="flex gap-3 items-center mb-2"
                > -->
                <div v-for="(img,iIdx) in variant.images.filter(i => !i._deleted)">

                  <!-- Preview -->
                  <div class="relative w-12 h-12">
                    <!-- Nếu đang upload -->
                    <div
                      v-if="img.loading"
                      class="absolute inset-0 flex items-center justify-center bg-white/70 rounded border"
                    >
                      <svg class="animate-spin h-5 w-5 text-indigo-600" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10"
                                stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                    </div>

                    <!-- Nếu đã có ảnh -->
                    <img
                      v-else-if="img.url"
                      :src="getDirectImageUrl(img.url)"
                      class="w-12 h-12 rounded object-cover border"
                    />

                    <!-- Nếu chưa có ảnh và chưa upload -->
                    <div v-else class="w-12 h-12 border rounded bg-gray-100"></div>
                  </div>


                  <!-- File input -->
                  <input
                    type="file"
                    accept="image/*"
                    @change="onFileSelect($event, vIdx, iIdx)"
                    class="text-xs"
                  />

                  <!-- Ảnh chính -->
                  <label class="flex items-center gap-1 text-xs">
                    <input
                      type="checkbox"
                      v-model="img.isMain"
                      @change="setMainImage(vIdx)"
                    />
                    Ảnh chính
                  </label>

                  <button @click="removeImage(vIdx, iIdx)" class="text-red-500 text-xs">✕</button>
                </div>
              </div>

            </div>
          </div>

          <p v-else class="text-sm text-gray-500 italic mt-2">Chưa có biến thể nào. Vui lòng chọn dải size và màu để sinh.</p>
        </div>


        <!-- Nút hành động -->
        <div class="flex justify-end gap-3 mt-6">
            <button class="px-4 py-2 rounded bg-gray-200" @click="closeModal" :disabled="loading">Huỷ</button>
            <button
              class="px-4 py-2 rounded bg-indigo-600 text-white flex items-center justify-center"
              :disabled="loading"
              @click="save"
            >
              <!-- Spinner + Text khi loading -->
              <svg
                v-if="loading"
                class="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>

              <span>{{ loading ? "Đang lưu..." : "Lưu" }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Confirm delete -->
      <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div class="bg-white rounded-lg p-6 w-[420px]">
          <h3 class="text-lg font-semibold mb-3">Xác nhận xoá</h3>
          <p class="text-gray-700 mb-6">{{ deleteConfirmMessage }}</p>

          <div class="flex justify-end gap-3">
            <button class="px-4 py-2 rounded bg-gray-200"
                    @click="showDeleteConfirm = false">
              Huỷ
            </button>
            <button class="px-4 py-2 rounded bg-red-600 text-white"
                    @click="deleteConfirmAction">
              Xoá
            </button>
          </div>
        </div>
      </div>

    </div>
  </SidebarPart>
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
</template>


<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed  } from 'vue'
import { getAllProductsApi, createProductApi, getProductByIdApi, updateProductApi, deleteVariantApi, deleteProductApi } from '../product.api'
import type { Product, Brand, Category, ProductFilter, Attribute } from '../product.type'
import type { Color } from '@/modules/color/color.type'
import { getAllBrandsApi } from '@/modules/brand/brand.api'
import { getAllCategoriesApi } from '@/modules/category/category.api'
import { AxiosHttpClient } from '@/common/utils/axios'
import { getAllColorsApi, createColorApi } from '@/modules/color/color.api'
import { getAllAttributesApi, createAttributeApi } from '@/modules/attribute/attribute.api'
import { uploadImageApi } from '../../upfile/upfile.api' 
import { id } from '@nuxt/ui/runtime/locale/index.js'

/* --------- state --------- */
const products = ref<Product[]>([])
const brands = ref<Brand[]>([])
const categories = ref<Category[]>([])
const colors = ref<Color[]>([])
const attributes = ref<Attribute[]>([])
const sortColumn = ref<string>('')       // tên cột đang sort
const sortDirection = ref<'asc'|'desc'>('asc') // hướng sort

// Toast state management
const showSuccessToast = ref(false)
const successMessage = ref('')
const showErrorToast = ref(false)
const errorMessage = ref('')
const loading = ref(false)

const filters = ref({
  q: '',
  brandIds: [] as string[],
  categoryIds: [] as string[],
  colorIds: [] as string[],
  sizes: [] as string[],
  minPrice: null as number | null,
  maxPrice: null as number | null,
  inStock: null as boolean | null,
  status: [] as string[],

  sortBy: 'createdAt',
  sortDirection: 'desc',

  page: 0,
  size: 12,
})

const showBrand = ref(false);
const showCategory = ref(false);
const showColor = ref(false);

const pagination = ref({
  page: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,
  hasNext: false,
  hasPrevious: false,
})

const showModal = ref(false)
const isEdit = ref(false)

const sizeRangeStart = ref<number>(36)
const sizeRangeEnd = ref<number>(38)
const sizeOptions = Array.from({ length: 11 }, (_, i) => i + 35) // 36-50 ví dụ
const selectedColorId = ref<string>('')

const form = ref({
  name: "",
  brandId: "",
  categoryId: "",
  description: "",
  status: "ACTIVE",
  attributes: [],
  variants: []
})

const generateVariants = () => {
  if (!sizeRangeStart.value || !sizeRangeEnd.value || !selectedColorId.value) return

  const start = Math.min(sizeRangeStart.value, sizeRangeEnd.value)
  const end = Math.max(sizeRangeStart.value, sizeRangeEnd.value)

  for (let s = start; s <= end; s++) {
    form.value.variants.push({
      size: s.toString(),
      price: 0,
      stock: 0,
      colorId: selectedColorId.value,
      images: [],
    })
  }
}

const setMainImage = (variant) => {
  const mainSet = variant.images.find((i) => i.isMain)
  if (!mainSet && variant.images.length > 0) {
    variant.images[0].isMain = true
  }
}


const uniqueKeys = computed(() => [...new Set(attributes.value.map(a => a.key))])

const onKeySelect = (attr) => {
  // Khi chọn key có sẵn → reset value để user chọn lại
  attr.attribute.value = ''
}

const onKeyBlur = async (attr) => {
  const key = attr.attribute.key?.trim()
  if (!key) return

  const existsKey = attributes.value.some(a => a.key === key)
  // Nếu key hoàn toàn mới (chưa có trong hệ thống)
  if (!existsKey) {
    try {
      const res = await createAttributeApi({ key, value: '', description: '' })
      const newAttr = res.data ?? res
      attributes.value.push(newAttr)
    } catch (err) {
      console.error('❌ Lỗi tạo key mới:', err)
    }
  }
}

const onValueBlur = async (attr) => {
  const key = attr.attribute.key?.trim()
  const value = attr.attribute.value?.trim()
  if (!key || !value) return

  // Kiểm tra xem key-value đã tồn tại chưa
  const exists = attributes.value.find(a => a.key === key && a.value === value)
  if (exists) {
    attr.attribute.id = exists.id
    return
  }

  // Nếu chưa có → tạo mới
  try {
    const res = await createAttributeApi({ key, value, description: '' })
    const newAttr = res.data ?? res
    attributes.value.push(newAttr)
    attr.attribute.id = newAttr.id
  } catch (err) {
    console.error('❌ Tạo thuộc tính mới thất bại:', err)
  }
}


const addAttribute = () => {
  form.value.attributes.push({
    id: null,
    attribute: { id: '', key: '', value: '', description: '' }
  })
}

const getValuesForKey = (key: string) => {
  if (!key) return []
  return [...new Set(attributes.value.filter(a => a.key === key).map(a => a.value))]
}



const removeAttribute = (i) => form.value.attributes.splice(i, 1)


// Code color
const showAddColorInput = ref(false)
const newColorName = ref('')

const onColorSelectChange = (event) => {
  if (event.target.value === 'add_new') {
    showAddColorInput.value = true
    newColorName.value = ''
  }
}

const addNewColor = async () => {
  if (!newColorName.value.trim()) {
    // alert('Vui lòng nhập tên màu')
    showError('Vui lòng nhập tên màu')
    return
  }

  try {
    const res = await createColorApi({ name: newColorName.value.trim() })
    const newColor = res.data ?? res
    colors.value.push(newColor)
    selectedColorId.value = newColor.id
    showAddColorInput.value = false
    newColorName.value = ''
  } catch (err) {
    console.error('❌ Lỗi khi thêm màu mới:', err)
    // alert('Không thể thêm màu mới')
    showError('Không thể thêm màu mới')
  }
}

const onFileSelect = async (event, vIdx, iIdx) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const imgItem = form.value.variants[vIdx].images[iIdx];

  imgItem.file = file;               // file sẽ được gửi về backend
  imgItem.url = URL.createObjectURL(file);  // preview
  imgItem.id = null;                 // để backend hiểu là ảnh mới
};


const addVariant = () =>
  form.value.variants.push({ size: "", price: 0, stock: 0, colorId: "", images: [] })

// const removeVariant = (i) => form.value.variants.splice(i, 1)
const removeVariant = (vIdx) => {
  const variant = form.value.variants[vIdx]

  openDeleteConfirm(
    "Bạn có chắc muốn xoá biến thể này?",
    async () => {
      try {
        if (variant.id) {
          console.log("🗑️ Deleting variant ID:", variant.id)
          await deleteVariantApi(variant.id)
        } else {
          console.log("🗑️ Removing unsaved variant:", variant)
        }

        // Xoá khỏi FE
        form.value.variants.splice(vIdx, 1)
        showSuccess("Đã xoá biến thể thành công!")
      } catch (err) {
        console.error("❌ Failed to delete variant:", err)
        showError("Xoá biến thể thất bại!")
      }

      // Đóng popup
      showDeleteConfirm.value = false
      deleteConfirmAction.value = null
    }
  )
}

// const addImage = (vIdx) => form.value.variants[vIdx].images.push({ url: "", isMain: false })
const addImage = (vIdx) => {
  form.value.variants[vIdx].images.push({
    url: "",
    isMain: false,
    loading: false
  })
}

// const removeImage = (vIdx, iIdx) => form.value.variants[vIdx].images.splice(iIdx, 1)
const removeImage = (vIdx, iIdx) => {
  const img = form.value.variants[vIdx].images[iIdx];

  if (img.id) {
    // ảnh cũ → đánh dấu xoá
    img._deleted = true;
  } else {
    // ảnh mới → có thể xoá hẳn
    form.value.variants[vIdx].images.splice(iIdx, 1);
  }
}

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

const variantsJson = ref<string>('') // quick edit JSON for variants

const showDeleteConfirm = ref(false)
const deleteConfirmMessage = ref("")
const deleteConfirmAction = ref(null)
const openDeleteConfirm = (message, actionCallback) => {
  deleteConfirmMessage.value = message
  deleteConfirmAction.value = actionCallback
  showDeleteConfirm.value = true
}

const deletingId = ref<string | null>(null)

/* Axios client for update/delete */
const axiosClient = new AxiosHttpClient(import.meta.env.VITE_API_URL)

/* --------- helpers --------- */
const normalizeGetProductsResponse = (res: any) => {
  // support shapes: res.data.content, res.content, res?.data?.content
  const content = res?.data?.content ?? res?.content ?? res?.data ?? res
  // If full pagination shape returned
  const pageObj = res?.data ?? res?.pagination ?? res
  return { content, pageObj }
}

function buildQueryParams() {
  const params: any = {}

  if (filters.value.q) params.q = filters.value.q

  if (filters.value.brandIds.length)
    params.brandIds = filters.value.brandIds.join(',')

  if (filters.value.categoryIds.length)
    params.categoryIds = filters.value.categoryIds.join(',')

  if (filters.value.colorIds.length)
    params.colorIds = filters.value.colorIds.join(',')

  if (filters.value.sizes.length)
    params.sizes = filters.value.sizes.join(',')

  if (filters.value.status.length)
    params.status = filters.value.status

  if (filters.value.minPrice) params.minPrice = filters.value.minPrice
  if (filters.value.maxPrice) params.maxPrice = filters.value.maxPrice
  if (filters.value.inStock != null) params.inStock = filters.value.inStock

  params.page = filters.value.page
  params.size = filters.value.size
  params.sortBy = filters.value.sortBy
  params.sortDirection = filters.value.sortDirection

  return params
}

const fetchProducts = async () => {
  try {
    const params = buildQueryParams()

    const res = await getAllProductsApi(params)

    const { content, pageObj } = normalizeGetProductsResponse(res)

    products.value = content
    pagination.value = pageObj
  } catch (err) {
    console.error("Lỗi load sản phẩm:", err)
  }
}


const fetchFilters = async () => {
  try {
    const [bRes, cRes] = await Promise.all([getAllBrandsApi(), getAllCategoriesApi()])
    brands.value = bRes?.data ?? bRes ?? []
    categories.value = cRes?.data ?? cRes ?? []
  } catch (err) {
    console.error('Lỗi tải bộ lọc:', err)
  }
}


const sortedProducts = computed(() => {
  if (!sortColumn.value) return products.value

  return [...products.value].sort((a, b) => {
    let aVal: any
    let bVal: any

    if (sortColumn.value === 'price') {
      // Lấy giá của variant đầu tiên (hoặc 0 nếu không có)
      aVal = a.variants?.[0]?.price ?? 0
      bVal = b.variants?.[0]?.price ?? 0
    } else {
      aVal = a[sortColumn.value]
      bVal = b[sortColumn.value]

      // Nếu là object (brand, category)
      if (typeof aVal === 'object' && aVal?.name) aVal = aVal.name
      if (typeof bVal === 'object' && bVal?.name) bVal = bVal.name
    }

    // Nếu là number
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection.value === 'asc' ? aVal - bVal : bVal - aVal
    }

    // Chuỗi
    aVal = String(aVal).toLowerCase()
    bVal = String(bVal).toLowerCase()
    if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })
})


const toggleSort = (column: string) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}
function getDirectImageUrl(driveUrl: string) {
  // Tách ID ảnh từ link Google Drive
  const match = driveUrl?.match(/\/d\/([^/]+)/)
  if (!match) return driveUrl

  const driveId = match[1]
  // Gọi ảnh qua API backend (nó sẽ tự cache local)
  return `http://localhost:8080/api/v1/images/${driveId}`
}

/* --------- image helper (main image) --------- */
const getMainImage = (product: Product) => {
  const variants = product.variants || []

  if (variants.length === 0) {
    return 'https://via.placeholder.com/200x200?text=No+Image'
  }

  // 1. Tìm variant có ID nhỏ nhất
  const smallestVariant = [...variants].sort((a, b) => a.id.localeCompare(b.id))[0]

  // 2. Tìm ảnh isMain trong variant nhỏ nhất
  let selectedImage =
    smallestVariant.images?.find((img: any) => img.isMain) ||
    smallestVariant.images?.[0] ||
    null

  // 3. Nếu variant nhỏ nhất không có ảnh → lấy ảnh từ variant khác
  if (!selectedImage) {
    const variantWithImage = variants.find((v) => v.images && v.images.length > 0)
    if (variantWithImage) {
      selectedImage =
        variantWithImage.images.find((img: any) => img.isMain) ||
        variantWithImage.images[0]
    }
  }

  // 4. Nếu không có ảnh nào trong toàn bộ sản phẩm → trả placeholder
  if (!selectedImage?.url) {
    return 'https://via.placeholder.com/200x200?text=No+Image'
  }

  const url = selectedImage.url

  // 5. Convert Google Drive link → direct link (giống code cũ)
  const match = url.match(/\/d\/([^/]+)/)
  return match ? `http://localhost:8080/api/v1/images/${match[1]}` : url
}


/* --------- format helpers --------- */
const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

const statusLabel = (status: string) => {
  switch (status) {
    case 'ACTIVE': return 'Đang bán'
    case 'INACTIVE': return 'Ngưng bán'
    case 'OUT_OF_STOCK': return 'Hết hàng'
    default: return status
  }
}

const formatDate = (iso?: string) => {
  if (!iso) return '-'
  try {
    const d = new Date(iso)
    return d.toLocaleString()
  } catch {
    return iso
  }
}

/* --------- modal / CRUD --------- */
const openCreateModal = () => {
  isEdit.value = false
  form.value = {
    name: '',
    description: '',
    status: 'ACTIVE',
    brandId: '',
    categoryId: '',
    attributes: [],
    variants: [],
  }
  variantsJson.value = ''
  showModal.value = true
}

const openEditModal = (product: Product) => {
  console.log('Editing product:', product)
  isEdit.value = true
  form.value = {
    id: product.id,
    name: product.name,
    description: product.description ?? '',
    status: product.status ?? 'ACTIVE',
    brandId: product.brand?.id ?? '',
    categoryId: product.category?.id ?? '',
    attributes: (product.attributes ?? []).map(a => ({
      id: a.id ?? null,
      attribute: {
        id: a.attribute?.id ?? '',
        key: a.attribute?.key ?? '',
        value: a.attribute?.value ?? '',
        description: a.attribute?.description ?? ''
      }
    })),
    variants: (product.variants ?? []).map(v => ({
      id: v.id ?? null,
      size: v.size ?? '',
      price: v.price ?? 0,
      stock: v.stock ?? 0,
      colorId: v.colorId?.toString() || "", 
      images: (v.images ?? []).map(img => ({
        id: img.id ?? null,       // giữ ID để backend nhận diện ảnh cũ
        file: null,               // ảnh cũ chưa thay đổi => file null
        url: img.url ?? '',
        isMain: img.isMain ?? false
      }))

    }))
    .sort((a, b) => {
    if (!a.colorId) return 1
    if (!b.colorId) return -1
    return a.colorId.localeCompare(b.colorId)
  })
  }
  variantsJson.value = JSON.stringify(form.value.variants, null, 2)
  showModal.value = true
}


const closeModal = () => {
  showModal.value = false
}

const save = async () => {
  try {
    if (!form.value.name.trim())
      return showError("Vui lòng nhập tên sản phẩm!");

    if (!form.value.brandId || !form.value.categoryId)
      return showError("Vui lòng chọn thương hiệu và danh mục!");
      console.log("===== DEBUG VARIANTS BEFORE BUILD =====");
      form.value.variants.forEach((v, vIdx) => {
        console.log(`--- Variant ${vIdx} ---`);
        v.images.forEach((img, iIdx) => {
          console.log(
            `Image ${iIdx}: id=${img.id}, file=${!!img.file}, deleted=${img._deleted}, isMain=${img.isMain}`
          );
        });
      });
      console.log("=========================================");

    const formData = new FormData();

    // ===========================
    // Product fields
    // ===========================
    formData.append("name", form.value.name);
    formData.append("brandId", form.value.brandId);
    formData.append("categoryId", form.value.categoryId);
    formData.append("description", form.value.description || "");
    formData.append("status", form.value.status || "ACTIVE");

    // ===========================
    // Attributes
    // ===========================
    form.value.attributes.forEach((a, aIdx) => {
      if (!a.attribute?.key || !a.attribute?.value) return;

      formData.append(`attributes[${aIdx}].attributeId`, a.attribute.id || "");
      formData.append(`attributes[${aIdx}].key`, a.attribute.key);
      formData.append(`attributes[${aIdx}].value`, a.attribute.value);
    });

    // ===========================
    // Variants + Images
    // ===========================
    form.value.variants.forEach((v, vIdx) => {
      // ===== Base fields =====
      formData.append(`variants[${vIdx}].id`, v.id || "");
      formData.append(`variants[${vIdx}].colorId`, v.colorId);
      formData.append(`variants[${vIdx}].size`, v.size);
      formData.append(`variants[${vIdx}].price`, String(v.price));
      formData.append(`variants[${vIdx}].stock`, String(v.stock));

      // đảm bảo có isMain đúng
      setMainImage(v);

      // ======================================
      // SEND REMAINING IMAGES (có thứ tự sạch)
      // ======================================
      let cleanIndex = 0;
      v.images.forEach((img) => {
        if (img._deleted) return; // bỏ qua ảnh đã xoá

        formData.append(
          `variants[${vIdx}].images[${cleanIndex}].isMain`,
          String(img.isMain)
        );

        if (img.id) {
          formData.append(`variants[${vIdx}].images[${cleanIndex}].id`, img.id);
        }

        if (img.file) {
          formData.append(`variants[${vIdx}].images[${cleanIndex}].file`, img.file);
        }

        cleanIndex++;
      });
    });

    // ===== START LOADING =====
    loading.value = true
    if (isEdit.value && form.value.id) {
      await updateProductApi(form.value.id, formData);
      showSuccess("Cập nhật sản phẩm thành công!");
    } else {
      await createProductApi(formData);
      showSuccess("Thêm sản phẩm thành công!");
    }

    await fetchProducts();
    closeModal();
  } catch (err) {
    console.error("❌ Lưu sản phẩm thất bại:", err);
    showError("Lưu sản phẩm thất bại, vui lòng thử lại!");
  } finally {
    // ===== STOP LOADING =====
    loading.value = false
  }
};

const openMenuId = ref(null)

const toggleActionMenu = (id) => {
  openMenuId.value = openMenuId.value === id ? null : id
}

window.addEventListener("click", (e) => {
  // đóng menu khi click ra ngoài
  if (!e.target.closest(".relative.inline-block")) {
    openMenuId.value = null
  }
})

/* delete flow */
const confirmDelete = (id: string) => {
  deletingId.value = id
  showDeleteConfirm.value = true
}

// const deleteProduct = async () => {
//   if (!deletingId.value) return
//   try {
//     await deleteProductApi(deletingId.value)
//     showSuccess('Xoá sản phẩm thành công')
//     showDeleteConfirm.value = false
//     deletingId.value = null
//     await fetchProducts()
//   } catch (err) {
//     console.error('Lỗi xoá:', err)
//     showError('Lỗi khi xoá sản phẩm')
//   }
// }
const askDeleteProduct = (id) => {
  deletingId.value = id
  openDeleteConfirm(
    "Bạn có chắc muốn xoá sản phẩm này không?",
    deleteProductConfirm
  )
}

const deleteProductConfirm = async () => {
  if (!deletingId.value) return

  try {
    await deleteProductApi(deletingId.value)
    showSuccess('Xoá sản phẩm thành công')
    await fetchProducts()
  } catch (err) {
    console.error('Lỗi xoá:', err)
    showError('Lỗi khi xoá sản phẩm')
  }

  // Đóng popup
  showDeleteConfirm.value = false
  deletingId.value = null
}


/* pagination */
const nextPage = async () => {
  if (!pagination.value.hasNext) return
  filters.value.page = (filters.value.page ?? 0) + 1
  await fetchProducts()
}

const prevPage = async () => {
  if ((filters.value.page ?? 0) <= 0) return
  filters.value.page = (filters.value.page ?? 0) - 1
  await fetchProducts()
}

const resetFilters = () => {
  filters.value = {
    q: '',
    brandIds: [],
    categoryIds: [],
    colorIds: [],
    sizes: [],
    status: [],
    minPrice: null,
    maxPrice: null,
    inStock: null,
    sortBy: 'createdAt',
    sortDirection: 'desc',
    page: 0,
    size: 12,
  }

  fetchProducts()
}




/* --------- lifecycle --------- */
onMounted(async () => {
  await fetchFilters()
  await fetchProducts()
  // Load colors từ backend
    const colorRes = await getAllColorsApi()
    colors.value = colorRes.data ?? colorRes

    // Load attributes từ backend
    const attrRes = await getAllAttributesApi()
    attributes.value = attrRes.data ?? attrRes
})

watch(
  () => form.value.variants,
  (newVal) => {
    variantsJson.value = JSON.stringify(newVal, null, 2)
  },
  { deep: true }
)

// watch(() => filters.value.brandId, async (newBrandId) => {
//   if (!newBrandId) {
//     // Nếu chọn "Tất cả"
//     await fetchProducts()
//     return
//   }

//   await fetchProductsByBrand()
// })

// watch(() => filters.value.categoryId, async (newCategoryId) => {
//   if (!newCategoryId) {
//     // Nếu chọn "Tất cả"
//     await fetchProducts()
//     return
//   }

//   await fetchProductsByCategory()
// })

// watch(filters, () => {
//   fetchProducts()
// }, { deep: true })



</script>

<style scoped>
/* small helper */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

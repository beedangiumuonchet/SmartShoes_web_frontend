<template>
  <div class="max-w-7xl mx-auto px-4 py-10">
    <!-- Tiêu đề -->
    <h1 class="text-3xl font-bold text-gray-800 mb-8 text-center">Danh sách sản phẩm</h1>

    <!-- Bộ lọc -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-10">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Tìm kiếm -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Từ khóa</label>
          <input
            v-model="filters.q"
            type="text"
            placeholder="Nhập tên sản phẩm..."
            class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <!-- Thương hiệu -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Thương hiệu</label>
          <select
            v-model="filters.brandId"
            class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Tất cả</option>
            <option v-for="brand in brands" :key="brand.id" :value="brand.id">
              {{ brand.name }}
            </option>
          </select>
        </div>

        <!-- Danh mục -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
          <select
            v-model="filters.categoryId"
            class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Tất cả</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <!-- Sắp xếp -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Sắp xếp</label>
          <select
            v-model="filters.sortBy"
            class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Mặc định</option>
            <option value="createdAt">Mới nhất</option>
            <option value="price">Giá</option>
          </select>
        </div>
      </div>

      <!-- Nút áp dụng -->
      <div class="mt-6 text-right">
        <button
          @click="fetchProducts"
          class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all"
        >
          Áp dụng bộ lọc
        </button>
      </div>
    </div>

    <!-- Danh sách sản phẩm -->
    <div
      v-if="products.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
    >
      <RouterLink
        v-for="product in products"
        :key="product.id"
        :to="`/products/${product.id}`"
        class="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden group"
      >
        <!-- Ảnh -->
        <div class="relative w-full h-64 overflow-hidden">
          <img
            :src="getMainImage(product)"
            alt="Product Image"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <!-- Thông tin -->
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2">
            {{ product.name }}
          </h3>
          <p class="text-sm text-gray-500 mb-2">
            {{ product.brand?.name || 'Không rõ thương hiệu' }} ·
            {{ product.category?.name || 'Không rõ danh mục' }}
          </p>

          <div class="flex items-center justify-between">
            <span class="text-blue-600 font-semibold text-lg">
              {{ formatPrice(product.variants?.[0]?.price || 0) }}
            </span>
            <span
              class="px-2 py-1 rounded-lg text-xs font-medium"
              :class="
                product.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-200 text-gray-500'
              "
            >
              {{ statusLabel(product.status) }}
            </span>
          </div>
        </div>
      </RouterLink>
    </div>

    <!-- Loading / Empty -->
    <div v-else class="text-center py-20 text-gray-500 text-lg">Không tìm thấy sản phẩm nào.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { getAllProductsApi } from '../products/product.api'
import { getAllBrandsApi } from '../brand/brand.api'
import { getAllCategoriesApi } from '../category/category.api'
import type { Product, Brand, Category, ProductFilter } from '../products/product.type'

const products = ref<Product[]>([])
const brands = ref<Brand[]>([])
const categories = ref<Category[]>([])
const filters = ref<ProductFilter>({
  q: '',
  brandId: '',
  categoryId: '',
  sortBy: '',
})

const fetchProducts = async () => {
  try {
    const res = await getAllProductsApi(filters.value)
    products.value = res?.content || [] // ✅ thêm .data
    console.log('✅ Products loaded:', products.value)
  } catch (err) {
    console.error('❌ Lỗi tải danh sách sản phẩm:', err)
  }
}

const fetchFilters = async () => {
  try {
    const [brandRes, catRes] = await Promise.all([getAllBrandsApi(), getAllCategoriesApi()])
    brands.value = brandRes?.data || []
    categories.value = catRes?.data || []
  } catch (err) {
    console.error('❌ Lỗi tải bộ lọc:', err)
  }
}

const getMainImage = (product: Product) => {
  const img =
    product.variants?.flatMap((v) => v.images)?.find((i) => i.isMain)?.url ||
    product.variants?.[0]?.images?.[0]?.url ||
    'https://via.placeholder.com/400x400?text=No+Image'
  return img
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

const statusLabel = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'Đang bán'
    case 'INACTIVE':
      return 'Ngừng bán'
    case 'OUT_OF_STOCK':
      return 'Hết hàng'
    default:
      return 'Không rõ'
  }
}

onMounted(async () => {
  await fetchFilters()
  await fetchProducts()
})
</script>

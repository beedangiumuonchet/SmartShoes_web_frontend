<template>
  <div class="max-w-[1440px] mx-auto px-6 py-10">
    <!-- Tiêu đề -->
    <h1 class="text-3xl font-bold text-gray-800 mb-10 text-center">Danh sách sản phẩm</h1>

    <div class="grid grid-cols-1 md:grid-cols-6 gap-8">
      <!-- Sidebar filter -->
      <div class="md:col-span-1 sticky top-24 h-fit bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Thương hiệu</label>
          <select v-model="filters.brandId" class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="">Tất cả</option>
            <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Thể loại</label>
          <select v-model="filters.categoryId" class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="">Tất cả</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ)</label>
          <div class="flex gap-2">
            <input type="number" v-model.number="filters.minPrice" placeholder="Từ" class="w-1/2 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <input type="number" v-model.number="filters.maxPrice" placeholder="Đến" class="w-1/2 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Màu sắc</label>
          <select v-model="filters.color" class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="">Tất cả</option>
            <option v-for="color in colors" :key="color" :value="color">{{ color }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Sắp xếp theo giá</label>
          <select v-model="filters.sortByPrice" class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="">Mặc định</option>
            <option value="price_asc">Giá tăng dần</option>
            <option value="price_desc">Giá giảm dần</option>
          </select>
        </div>

        <button @click="fetchProducts" class="w-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all">
          Áp dụng bộ lọc
        </button>
      </div>

      <!-- Products grid -->
      <div class="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <RouterLink
          v-for="product in products"
          :key="product.id"
          :to="`/products/${product.slug}`"
          class="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg overflow-hidden transition-transform group hover:scale-105"
        >
          <div class="relative w-full aspect-[4/5] overflow-hidden">
            <img :src="getDirectImageUrl(getMainImage(product))" alt="Product Image" class="w-full h-full object-cover" />
          </div>
          <div class="p-4 space-y-2">
            <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2">{{ product.name }}</h3>
            <p class="text-sm text-gray-500">{{ product.brand?.name || 'Không rõ thương hiệu' }} · {{ product.category?.name || 'Không rõ danh mục' }}</p>
            <div class="flex items-center justify-between">
              <span class="text-blue-600 font-semibold">{{ formatPrice(product.variants?.[0]?.price || 0) }}</span>
              <span class="px-2 py-1 rounded-lg text-xs font-medium" :class="product.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'">{{ statusLabel(product.status) }}</span>
            </div>
          </div>
        </RouterLink>
        <div v-if="!products.length" class="text-center py-20 text-gray-500 text-lg col-span-full">Không tìm thấy sản phẩm nào.</div>
      </div>
    </div>
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

function getDirectImageUrl(driveUrl: string) {
  // Tách ID ảnh từ link Google Drive
  const match = driveUrl?.match(/\/d\/([^/]+)/)
  if (!match) return driveUrl

  const driveId = match[1]
  // Gọi ảnh qua API backend (nó sẽ tự cache local)
  return `http://localhost:8080/api/v1/images/${driveId}`
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

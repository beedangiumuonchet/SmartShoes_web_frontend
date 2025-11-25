<template>
  <div class="max-w-[1440px] mx-auto px-6 py-10">
    <!-- Tiêu đề -->
    <h1 class="text-3xl font-bold text-gray-800 mb-10 text-center">Danh sách sản phẩm</h1>

    <div class="flex flex-col md:flex-row gap-8">
      <!-- Sidebar filter -->
      <div class="md:w-1/5 sticky top-24 h-fit bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">

      <!-- THƯƠNG HIỆU -->
      <div class="border-b pb-3">
        <div
          class="flex items-center justify-between cursor-pointer py-1"
          @click="showBrand = !showBrand"
        >
          <h3 class="font-semibold text-gray-800 text-sm">Thương hiệu</h3>
          <span class="text-xs text-gray-600">{{ showBrand ? "▲" : "▼" }}</span>
        </div>

        <div v-show="showBrand" class="mt-2 space-y-1 pl-1">
          <div
            v-for="b in brands"
            :key="b.id"
            class="flex items-center gap-2"
          >
            <input
              type="checkbox"
              :value="b.id"
              v-model="filters.brandIds"
              class="w-4 h-4"
            />
            <label class="text-sm text-gray-700">{{ b.name }}</label>
          </div>
        </div>
      </div>

      <!-- THỂ LOẠI -->
      <div class="border-b pb-3">
        <div
          class="flex items-center justify-between cursor-pointer py-1"
          @click="showCategory = !showCategory"
        >
          <h3 class="font-semibold text-gray-800 text-sm">Thể loại</h3>
          <span class="text-xs text-gray-600">{{ showCategory ? "▲" : "▼" }}</span>
        </div>

        <div v-show="showCategory" class="mt-2 space-y-1 pl-1">
          <div
            v-for="c in categories"
            :key="c.id"
            class="flex items-center gap-2"
          >
            <input
              type="checkbox"
              :value="c.id"
              v-model="filters.categoryIds"
              class="w-4 h-4"
            />
            <label class="text-sm text-gray-700">{{ c.name }}</label>
          </div>
        </div>
      </div>

      <!-- MÀU SẮC -->
      <div class="border-b pb-3">
        <div
          class="flex items-center justify-between cursor-pointer py-1"
          @click="showColor = !showColor"
        >
          <h3 class="font-semibold text-gray-800 text-sm">Màu sắc</h3>
          <span class="text-xs text-gray-600">{{ showColor ? "▲" : "▼" }}</span>
        </div>

        <div v-show="showColor" class="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 pl-1">
          <div
            v-for="color in colors"
            :key="color.id"
            class="flex items-center gap-2"
          >
            <input
              type="checkbox"
              :value="color.id"
              v-model="filters.colorIds"
              class="w-4 h-4"
            />
            <label class="text-sm text-gray-700">{{ color.name }}</label>
          </div>
        </div>
      </div>

      <!-- GIÁ -->
      <div>
        <h3 class="font-semibold text-gray-800 text-sm mb-1">Giá (VNĐ)</h3>
        <div class="flex gap-2">
          <input
            type="number"
            v-model.number="filters.minPrice"
            placeholder="Từ"
            class="w-1/2 border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            v-model.number="filters.maxPrice"
            placeholder="Đến"
            class="w-1/2 border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <!-- SẮP XẾP GIÁ -->
        <select
          v-model="selectedSort"
          @change="handleSortChange"
          class="w-full border rounded-lg px-3 py-2 text-sm"
        >
          <option value="createdAt-desc">Mặc định (Mới nhất)</option>
          <option value="price-asc">Giá tăng dần</option>
          <option value="price-desc">Giá giảm dần</option>
        </select>



      <!-- APPLY BTN -->
      <button
        @click="fetchProducts"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all"
      >
        Áp dụng bộ lọc
      </button>
          <!-- RESET BTN -->
      <button
        @click="resetFilters"
        class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg transition-all"
      >
        Đặt lại bộ lọc
      </button>
    </div>





      <!-- Products grid -->
      <div class="md:w-4/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <RouterLink
          v-for="product in products"
          :key="product.id"
          :to="`/products/${product.slug}`"
          class="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg overflow-hidden transition-transform group hover:scale-105"
        >
          <div class="relative w-full min-h-[300px] overflow-hidden">
            <img :src="getDirectImageUrl(getMainImage(product))" alt="Product Image" class="w-full h-full object-cover" />
          </div>
          <div class="p-4 space-y-2">
            <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2">{{ product.name }}</h3>
            <p class="text-sm text-gray-500">{{ product.brand?.name || 'Không rõ thương hiệu' }} · {{ product.category?.name || 'Không rõ danh mục' }}</p>
            <div class="flex items-center justify-between">
              <span class="text-blue-600 font-semibold">{{ formatPrice(getProductMinPrice(product)) }}</span>
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
import { ref, onMounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { getAllProductsApi } from '../products/product.api'
import { getAllBrandsApi } from '../brand/brand.api'
import { getAllCategoriesApi } from '../category/category.api'
import { getAllColorsApi } from '../color/color.api'
import type { Product, Brand, Category, ProductFilter, Color } from '../products/product.type'
import { useRoute } from 'vue-router'

const route = useRoute()


const products = ref<Product[]>([])
const brands = ref<Brand[]>([])
const categories = ref<Category[]>([])
const colors = ref<Color[]>([])

const showBrand = ref(false);
const showCategory = ref(false);
const showColor = ref(false);

const filters = ref<ProductFilter>({
  page: 0,
  size: 20,

  q: '',
  status: 'ACTIVE',

  minPrice: null,
  maxPrice: null,

  inStock: null,

  brandIds: [],
  categoryIds: [],
  colorIds: [],
  sizes: [],

  sortBy: 'createdAt',
  sortDirection: 'desc',
})


// const fetchProducts = async () => {
//   try {
//     const res = await getAllProductsApi(filters.value)
//     products.value = res?.content || [] // ✅ thêm .data
//     console.log('✅ Products loaded:', products.value)
//   } catch (err) {
//     console.error('❌ Lỗi tải danh sách sản phẩm:', err)
//   }
// }

const fetchProducts = async () => {
  try {
    const res = await getAllProductsApi(filters.value)
    products.value = res.content ?? []
    console.log('✅ Loaded', products.value)
  } catch (err) {
    console.error('❌ Fetch failed:', err)
  }
}


const fetchFilters = async () => {
  try {
    const [brandRes, catRes, corRes] = await Promise.all([getAllBrandsApi(), getAllCategoriesApi(), getAllColorsApi()])
    brands.value = brandRes || []
    categories.value = catRes || []
    colors.value = corRes.data ?? corRes
  } catch (err) {
    console.error('❌ Lỗi tải bộ lọc:', err)
  }
}

const selectedSort = ref("createdAt-desc")

const resetFilters = () => {
  filters.value.brandIds = [];
  filters.value.categoryIds = [];
  filters.value.colorIds = [];
  filters.value.minPrice = null;
  filters.value.maxPrice = null;

  selectedSort.value = "createdAt-desc"; // reset sort về mặc định

  // Gọi fetchProducts nếu muốn tự động load lại danh sách
  fetchProducts();
};

const handleSortChange = () => {
  const [sortBy, sortDirection] = selectedSort.value.split("-");
  filters.value.sortBy = sortBy;
  filters.value.sortDirection = sortDirection;

  // Nếu sort theo price thì sắp xếp ngay trên frontend
  if (sortBy === "price") {
    products.value.sort((a, b) => {
      const priceA = getProductMinPrice(a);
      const priceB = getProductMinPrice(b);
      return sortDirection === "asc" ? priceA - priceB : priceB - priceA;
    });
  } else {
    // Nếu sort theo createdAt, gọi backend
    fetchProducts();
  }
};



// const getMainImage = (product: Product) => {
//   const img =
//     product.variants?.flatMap((v) => v.images)?.find((i) => i.isMain)?.url ||
//     product.variants?.[0]?.images?.[0]?.url ||
//     'https://via.placeholder.com/400x400?text=No+Image'
//   return img
// }
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

function getDirectImageUrl(driveUrl: string) {
  // Tách ID ảnh từ link Google Drive
  const match = driveUrl?.match(/\/d\/([^/]+)/)
  if (!match) return driveUrl

  const driveId = match[1]
  // Gọi ảnh qua API backend (nó sẽ tự cache local)
  return `http://localhost:8080/api/v1/images/${driveId}`
}

const getProductMinPrice = (product: Product) => {
  const variants = product.variants || [];
  if (!variants.length) return 0;

  // Lấy giá nhỏ nhất
  return Math.min(...variants.map(v => v.price || Infinity));
};


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

// onMounted(async () => {
//   await fetchFilters()

//   if (route.query.brandId) {
//     filters.value.brandIds = Array.isArray(route.query.brandId)
//       ? route.query.brandId
//       : [route.query.brandId]
//   }

//   if (route.query.categoryId) {
//     filters.value.categoryIds = Array.isArray(route.query.categoryId)
//       ? route.query.categoryId
//       : [route.query.categoryId]
//   }

//   await fetchProducts()
// })
onMounted(async () => {
  await fetchFilters()

  // nếu có filter query thì vẫn set bình thường
  if (route.query.brandId) {
    filters.value.brandIds = Array.isArray(route.query.brandId)
      ? route.query.brandId
      : [route.query.brandId]
  }

  if (route.query.categoryId) {
    filters.value.categoryIds = Array.isArray(route.query.categoryId)
      ? route.query.categoryId
      : [route.query.categoryId]
  }

  // ⭐ Nếu đến từ image search → lấy data từ sessionStorage
  if (route.query.fromImageSearch === "1") {
    const raw = sessionStorage.getItem("imageSearchResults")
    if (raw) {
      products.value = JSON.parse(raw)
      console.log("🎯 Load products from image search:", products.value)
      return
    }
  }

  // ⭐ Còn lại → fetch bình thường
  await fetchProducts()
})

// watch(
//   () => route.query.fromImageSearch,
//   (newVal) => {
//     if (newVal === "1") {
//       const raw = sessionStorage.getItem("imageSearchResults")
//       if (raw) {
//         products.value = JSON.parse(raw)
//         console.log("🎯 Load products from image search:", products.value)
//       }
//     } else {
//       fetchProducts()
//     }
//   },
//   { immediate: true }
// )

</script>

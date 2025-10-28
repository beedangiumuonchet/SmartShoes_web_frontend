<template>
  <div v-if="product" class="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
    <!-- Left: Images -->
    <div>
      <div class="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
        <img
          :src="selectedImage"
          alt="Product Image"
          class="w-full h-[500px] object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      <div class="flex gap-3 mt-4 justify-center">
        <img
          v-for="(img, i) in currentVariant?.images || mainImages"
          :key="i"
          :src="img.url"
          :alt="'image-' + i"
          @click="selectedImage = img.url"
          class="w-20 h-20 rounded-xl object-cover cursor-pointer border transition-all duration-300"
          :class="selectedImage === img.url ? 'border-blue-500 scale-105' : 'border-gray-200 hover:scale-105'"
        />
      </div>
    </div>

    <!-- Right: Info -->
    <div>
      <!-- Tên sản phẩm -->
      <h1 class="text-3xl font-bold text-gray-900 mb-3">{{ product.name }}</h1>

      <!-- Thương hiệu + phân loại -->
      <p class="text-gray-500 mb-4">
        {{ product.brand?.name || product.brandName || 'Không rõ thương hiệu' }} ·
        {{ product.category?.name || product.categoryName || 'Không rõ phân loại' }}
      </p>

      <!-- Giá và tồn kho -->
      <div v-if="currentVariant" class="flex items-center space-x-3 mb-6">
        <span class="text-3xl font-bold text-blue-600">{{ formatPrice(currentVariant.price) }}</span>
        <span class="text-gray-500 text-sm">Còn lại: {{ currentVariant.stock }}</span>
      </div>

      <div v-else class="text-gray-500 mb-6 italic">
        Vui lòng chọn đủ size và màu để xem chi tiết sản phẩm.
      </div>

      <!-- Chọn size -->
      <div class="mb-6">
        <h3 class="font-semibold text-gray-800 mb-2">Chọn size</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="size in availableSizes"
            :key="size"
            @click="selectSize(size)"
            class="px-4 py-2 rounded-lg border transition-all duration-200"
            :class="selectedSize === size ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'"
          >
            {{ size }}
          </button>
        </div>
      </div>

      <!-- Chọn màu -->
      <div class="mb-6">
        <h3 class="font-semibold text-gray-800 mb-2">Chọn màu</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="color in availableColors"
            :key="color"
            @click="selectColor(color)"
            class="px-4 py-2 rounded-lg border transition-all duration-200"
            :class="selectedColor === color ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'"
          >
            {{ color }}
          </button>
        </div>
      </div>

      <!-- Nút thêm giỏ hàng -->
      <button
        class="w-full py-3 rounded-xl font-semibold text-white transition-colors"
        :class="canAddToCart ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'"
        :disabled="!canAddToCart"
        @click="addToCart"
      >
        {{ canAddToCart ? 'Thêm vào giỏ hàng' : 'Chọn size và màu để thêm vào giỏ' }}
      </button>

      <!-- Mô tả -->
      <div class="mt-8">
        <h3 class="font-semibold text-gray-800 mb-2">Mô tả sản phẩm</h3>
        <p class="text-gray-700 leading-relaxed">{{ product.description }}</p>
      </div>

      <!-- Thuộc tính -->
      <div v-if="product.attributes?.length" class="mt-8">
        <h3 class="font-semibold text-gray-800 mb-2">Thông tin chi tiết</h3>
        <ul class="space-y-1 text-gray-700">
          <li
            v-for="attr in product.attributes"
            :key="attr.id"
            class="flex justify-between border-b py-1 text-sm"
          >
            <span class="font-medium">{{ attr.attribute.key }}:</span>
            <span>{{ attr.attribute.value }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-20 text-gray-500">
    Đang tải dữ liệu sản phẩm...
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, unref } from 'vue'
import { useRoute } from 'vue-router'
import { getProductByIdApi } from './product.api'

const route = useRoute()
const product = ref<any>(null)
const selectedSize = ref<string | null>(null)
const selectedColor = ref<string | null>(null)
const selectedImage = ref<string>('')

const normalize = (str: string) =>
  str?.normalize('NFD')?.replace(/[\u0300-\u036f]/g, '')?.toLowerCase()?.trim()

const availableSizes = computed(() => [...new Set(product.value?.variants?.map((v) => v.size) || [])])
const availableColors = computed(() => [...new Set(product.value?.variants?.map((v) => v.colorName) || [])])

const currentVariant = computed(() => {
  const size = unref(selectedSize)
  const color = unref(selectedColor)
  if (!size || !color) return null
  return product.value?.variants?.find(
    (v) => normalize(v.size) === normalize(size) && normalize(v.colorName) === normalize(color)
  )
})

const mainImages = computed(() =>
  product.value?.variants?.flatMap((v) => v.images?.filter((i) => i.isMain)) || []
)

const canAddToCart = computed(() => !!currentVariant.value)

const selectSize = (size: string) => {
  selectedSize.value = selectedSize.value === size ? null : size
}
const selectColor = (color: string) => {
  selectedColor.value = selectedColor.value === color ? null : color
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

const addToCart = () => {
  if (!currentVariant.value) return
  alert(`Đã thêm ${product.value.name} (${selectedColor.value}, ${selectedSize.value}) vào giỏ!`)
}

onMounted(async () => {
  try {
    const id = route.params.id as string
    const res = await getProductByIdApi(id)

    console.log('=== API RESPONSE DEBUG ===')
    console.log('Full response:', res)
    console.log('===========================')

    // ✅ Gán product trực tiếp từ response
    product.value = res ?? null
    console.log('✅ Product sau khi gán:', product.value)

    if (!product.value) {
      console.warn('⚠️ Không có dữ liệu sản phẩm, kiểm tra API!')
      return
    }

    // ✅ Hiển thị ảnh mặc định
    if (product.value?.variants?.length) {
      const firstVariant = product.value.variants.find(v => v.images?.length)
      selectedImage.value =
        firstVariant?.images?.find((i: any) => i.isMain)?.url ||
        firstVariant?.images?.[0]?.url ||
        ''
    }

  } catch (err) {
    console.error('❌ Lỗi tải sản phẩm:', err)
  }
})
</script>

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

      <!-- Danh sách ảnh thumbnail -->
      <div class="flex gap-3 mt-4 justify-center flex-wrap">
        <img
          v-for="(img, i) in displayedImages"
          :key="i"
          :src="getDirectImageUrl(img.url)"
          :alt="'image-' + i"
          @click="selectedImage = getDirectImageUrl(img.url)"
          class="w-20 h-20 rounded-xl object-cover cursor-pointer border transition-all duration-300"
          :class="selectedImage === getDirectImageUrl(img.url)
            ? 'border-blue-500 scale-105'
            : 'border-gray-200 hover:scale-105'"
        />
      </div>
    </div>


    <!-- Right: Info -->
    <div>
      <!-- Tên sản phẩm -->
      <h1 class="text-3xl font-bold text-gray-900 mb-3">{{ product.name }}</h1>

      <!-- Thương hiệu + phân loại -->
      <p class="text-gray-500 mb-4">
        <RouterLink
          v-if="product.brand"
          :to="{ path: '/products', query: { brandId: product.brand.id } }"
          class="text-blue-600 hover:underline"
        >
          {{ product.brand.name }}
        </RouterLink>

        <span v-else>{{ product.brand?.name || product.brandName || 'Không rõ thương hiệu' }}</span>

        ·

        <RouterLink
          v-if="product.category"
          :to="{ path: '/products', query: { categoryId: product.category.id } }"
          class="text-blue-600 hover:underline"
        >
          {{ product.category.name }}
        </RouterLink>
        <span v-else>{{ product.category?.name || product.categoryName || 'Không rõ phân loại' }}</span>
      </p>

      <!-- Giá và tồn kho -->
      <!-- <div v-if="currentVariant" class="flex items-center space-x-3 mb-6">
        <span class="text-3xl font-bold text-blue-600">{{
          formatPrice(currentVariant.price)
        }}</span>
        <span class="text-gray-500 text-sm">Còn lại: {{ currentVariant.stock }}</span>
      </div> -->
      <div v-if="currentVariant" class="flex items-center space-x-3 mb-6">
  <span class="text-3xl font-bold text-blue-600">
    {{ formatPrice(currentVariant.priceSale ?? currentVariant.price) }}
  </span>

  <span
    v-if="isOnSale"
    class="text-gray-500 line-through text-lg"
  >
    {{ formatPrice(currentVariant.price) }} 
  </span>

  <span
    v-if="isOnSale"
    class="text-red-500 font-semibold text-sm"
  >
    -{{ salePercent }}%
  </span>

  <span class="text-gray-500 text-sm ml-2">Còn lại: {{ currentVariant.stock }}</span>
</div>
      <div v-else class="text-gray-500 mb-6 italic">
        Vui lòng chọn đủ size và màu để xem chi tiết sản phẩm.
      </div>

      <!-- Chọn size -->
      <div class="mb-6">
        <h3 class="font-semibold text-gray-800 mb-2">Chọn size</h3>
        <div class="flex flex-wrap gap-2">
          <button
              v-for="size in allSizes"
              :key="size"
              @click="selectSize(size)"
              :disabled="!availableSizes.includes(size)"
              class="px-4 py-2 rounded-lg border transition-all duration-200"
              :class="selectedSize === size
                ? 'bg-blue-600 text-white border-blue-600'
                : !availableSizes.includes(size)
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              "
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
            v-for="color in allColors"
            :key="color"
            @click="selectColor(color)"
            :disabled="!availableColors.includes(color)"
            class="px-4 py-2 rounded-lg border transition-all duration-200"
            :class="selectedColor === color
              ? 'bg-blue-600 text-white border-blue-600'
              : !availableColors.includes(color)
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            "
          >
            {{ color }}
          </button>

        </div>
      </div>

      <!-- Chọn số lượng -->
      <div class="mb-6">
        <h3 class="font-semibold text-gray-800 mb-2">Số lượng</h3>
        <div class="flex items-center space-x-3">
          <button
            @click="decreaseQuantity"
            :disabled="quantity <= 1"
            class="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>
          <span class="w-16 text-center font-semibold text-lg">{{ quantity }}</span>
          <button
            @click="increaseQuantity"
            :disabled="!currentVariant || quantity >= currentVariant.stock"
            class="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>
        <p
          v-if="currentVariant && quantity > currentVariant.stock"
          class="text-red-500 text-sm mt-1"
        >
          Số lượng vượt quá tồn kho
        </p>
      </div>

      <!-- Nút thêm giỏ hàng -->
      <button
        class="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2"
        :class="
          canAddToCart
            ? 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
            : 'bg-gray-300 cursor-not-allowed'
        "
        :disabled="!canAddToCart || isAddingToCart"
        @click="addToCart"
      >
        <svg
          v-if="isAddingToCart"
          class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6H19"
          />
        </svg>
        <span>{{
          isAddingToCart
            ? 'Đang thêm...'
            : canAddToCart
              ? 'Thêm vào giỏ hàng'
              : 'Chọn size và màu để thêm vào giỏ'
        }}</span>
      </button>

      <!-- Thông báo thành công -->
      <div
        v-if="showSuccessMessage"
        class="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-700 text-sm flex items-center space-x-2"
      >
        <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span>Đã thêm sản phẩm vào giỏ hàng thành công!</span>
      </div>

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
  v-for="(attr, index) in groupedAttributes"
  :key="index"
  class="flex justify-between border-b py-1 text-sm"
>
  <span class="font-medium">{{ attr.key }}:</span>
  <span>{{ attr.values.join(', ') }}</span>
</li>

        </ul>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-20 text-gray-500">Đang tải dữ liệu sản phẩm...</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, unref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getProductByIdApi, getProductBySlugApi } from './product.api'
import { getOrCreateUserCart, addCartDetail } from '@/modules/carts/carts.api'
import { CartDetailRequest } from '@/modules/carts/carts.type'
import { getCurrentUser } from '@/common/guards/roleGuard.guard'

const route = useRoute()
const product = ref<any>(null)
const selectedSize = ref<string | null>(null)
const selectedColor = ref<string | null>(null)
const selectedImage = ref<string>('')
const quantity = ref<number>(1)
const isAddingToCart = ref<boolean>(false)
const showSuccessMessage = ref<boolean>(false)

const normalize = (str: string) =>
  str
    ?.normalize('NFD')
    ?.replace(/[\u0300-\u036f]/g, '')
    ?.toLowerCase()
    ?.trim()

const allSizes = computed(() => {
  const sizes = [...new Set(product.value?.variants?.map(v => v.size) || [])]
  const allNumeric = sizes.every(s => !isNaN(Number(s)))
  return allNumeric ? sizes.sort((a, b) => Number(a) - Number(b)) : sizes.sort((a, b) => a.localeCompare(b, 'vi', { numeric: true }))
})

const allColors = computed(() => [...new Set(product.value?.variants?.map(v => v.colorName) || [])])

// Kiểm tra size còn khả dụng với color đã chọn
const availableSizes = computed(() => {
  if (!product.value?.variants?.length) return []

  return allSizes.value.filter(size => {
    // Tìm variant cùng size và color (nếu đã chọn color)
    const variants = product.value.variants.filter(v => {
      const matchSize = normalize(v.size) === normalize(size)
      const matchColor = selectedColor.value ? normalize(v.colorName) === normalize(selectedColor.value) : true
      const hasStock = v.stock > 0
      return matchSize && matchColor && hasStock
    })
    return variants.length > 0
  })
})

// Kiểm tra color còn khả dụng với size đã chọn
const availableColors = computed(() => {
  if (!product.value?.variants?.length) return []

  return allColors.value.filter(color => {
    const variants = product.value.variants.filter(v => {
      const matchColor = normalize(v.colorName) === normalize(color)
      const matchSize = selectedSize.value ? normalize(v.size) === normalize(selectedSize.value) : true
      const hasStock = v.stock > 0
      return matchColor && matchSize && hasStock
    })
    return variants.length > 0
  })
})


const displayedImages = computed(() => {
  // Nếu user đã chọn màu → dùng ảnh theo màu
  if (selectedColor.value && imagesByColor.value[selectedColor.value]) {
    return imagesByColor.value[selectedColor.value]
  }

  // Nếu đã chọn variant → fallback
  if (currentVariant.value?.images?.length) {
    return currentVariant.value.images
  }

  // fallback: ảnh main của toàn sản phẩm
  const mainImgs =
    product.value?.variants
      ?.flatMap(v => v.images?.filter(i => i.isMain)) || []

  if (!mainImgs.length && product.value?.variants?.length) {
    return product.value.variants[0].images || []
  }

  return mainImgs
})


const imagesByColor = computed(() => {
  if (!product.value?.variants) return {}

  const map: Record<string, any[]> = {}

  for (const v of product.value.variants) {
    const color = v.colorName
    if (!map[color]) map[color] = []

    // Thêm ảnh vào màu nếu chưa tồn tại
    v.images?.forEach(img => {
      if (!map[color].some(i => i.url === img.url)) {
        map[color].push(img)
      }
    })
  }

  return map
})



const isOnSale = computed(() => {
  return currentVariant.value?.priceSale != null && currentVariant.value.priceSale < currentVariant.value.price
})

const salePercent = computed(() => {
  if (!isOnSale.value) return 0
  const original = currentVariant.value?.price ?? 0
  const sale = currentVariant.value?.priceSale ?? 0
  return Math.round(((original - sale) / original) * 100)
})



const currentVariant = computed(() => {
  const size = unref(selectedSize)
  const color = unref(selectedColor)
  if (!size || !color) return null
  return product.value?.variants?.find(
    (v) => normalize(v.size) === normalize(size) && normalize(v.colorName) === normalize(color),
  )
})

const mainImages = computed(
  () => product.value?.variants?.flatMap((v) => v.images?.filter((i) => i.isMain)) || [],
)

const canAddToCart = computed(() => {
  return (
    !!currentVariant.value &&
    quantity.value > 0 &&
    quantity.value <= currentVariant.value.stock &&
    !isAddingToCart.value
  )
})


const selectSize = (size: string) => {
  if (selectedSize.value === size) {
    selectedSize.value = null
  } else {
    selectedSize.value = size
  }

  // Nếu currentColor không còn hợp lệ với size mới, reset màu
  if (selectedColor.value && !availableColors.value.includes(selectedColor.value)) {
    selectedColor.value = null
  }
}

const selectColor = (color: string) => {
  if (selectedColor.value === color) {
    selectedColor.value = null
  } else {
    selectedColor.value = color
  }

  // Nếu currentSize không còn hợp lệ với color mới, reset size
  if (selectedSize.value && !availableSizes.value.includes(selectedSize.value)) {
    selectedSize.value = null
  }
}

const groupedAttributes = computed(() => {
  if (!product.value?.attributes) return []

  const map = new Map()

  product.value.attributes.forEach(attr => {
    const key = attr.attribute.key
    const value = attr.attribute.value

    if (!map.has(key)) {
      map.set(key, [value])
    } else {
      // tránh push trùng value
      if (!map.get(key).includes(value)) {
        map.get(key).push(value)
      }
    }
  })

  return Array.from(map, ([key, values]) => ({
    key,
    values
  }))
})



const increaseQuantity = () => {
  if (currentVariant.value && quantity.value < currentVariant.value.stock) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)


function getDirectImageUrl(driveUrl: string) {
  // Tách ID ảnh từ link Google Drive
  const match = driveUrl?.match(/\/d\/([^/]+)/)
  if (!match) return driveUrl

  const driveId = match[1]
  // Gọi ảnh qua API backend (nó sẽ tự cache local)
  return `http://localhost:8080/api/v1/images/${driveId}`
}



const addToCart = async () => {
  if (!currentVariant.value || !canAddToCart.value) {
    console.warn('Cannot add to cart: invalid variant or conditions')
    return
  }

  const currentUser = getCurrentUser()
  if (!currentUser?.userId) {
    alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng')
    return
  }

  try {
    isAddingToCart.value = true
    console.log('=== ADDING TO CART ===')
    console.log('Product:', product.value.name)
    console.log('Variant ID:', currentVariant.value.id)
    console.log('Quantity:', quantity.value)
    console.log('Size:', selectedSize.value)
    console.log('Color:', selectedColor.value)

    // 1. Lấy hoặc tạo cart cho user
    const cart = await getOrCreateUserCart(currentUser.userId)
    console.log('✅ Got cart:', cart.id)

    // 2. Thêm sản phẩm vào cart
    const cartDetailRequest = new CartDetailRequest(currentVariant.value.id, quantity.value)

    const cartDetail = await addCartDetail(cart.id, cartDetailRequest)
    console.log('✅ Added to cart:', cartDetail)

    // 3. Hiển thị thông báo thành công
    showSuccessMessage.value = true
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)

    // 4. Emit event để update cart count trong TopBar
    window.dispatchEvent(new CustomEvent('cart-updated'))

    console.log('✅ Successfully added to cart!')
  } catch (error) {
    console.error('❌ Error adding to cart:', error)

    // Hiển thị lỗi chi tiết
    let errorMessage = 'Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng'

    if (error && typeof error === 'object' && 'response' in error) {
      const httpError = error as any
      if (httpError.response?.data?.message) {
        errorMessage = httpError.response.data.message
      } else if (httpError.response?.status === 400) {
        errorMessage = 'Thông tin sản phẩm không hợp lệ'
      } else if (httpError.response?.status === 401) {
        errorMessage = 'Vui lòng đăng nhập lại'
      } else if (httpError.response?.status === 404) {
        errorMessage = 'Không tìm thấy sản phẩm hoặc giỏ hàng'
      }
    }

    alert(errorMessage)
  } finally {
    isAddingToCart.value = false
  }
}

onMounted(async () => {
  try {
    // const id = route.params.id as string
    // const res = await getProductByIdApi(id)
    const slug = route.params.slug as string
    const res = await getProductBySlugApi(slug)


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
      const firstVariant = product.value.variants.find((v) => v.images?.length)
      selectedImage.value = getDirectImageUrl(
      firstVariant?.images?.find((i: any) => i.isMain)?.url ||
      firstVariant?.images?.[0]?.url ||
      ''
    )

      console.log('✅ Ảnh sản phẩm đã chọn:', selectedImage.value)
    }
  } catch (err) {
    console.error('❌ Lỗi tải sản phẩm:', err)
  }
})
// watch(currentVariant, (newVal) => {
//   if (newVal?.images?.length) {
//     selectedImage.value = getDirectImageUrl(
//       newVal.images.find((i) => i.isMain)?.url || newVal.images[0].url
//     )
//   }
// })

watch(selectedColor, (color) => {
  if (!color) return
  const imgs = imagesByColor.value[color]
  if (imgs?.length) {
    const main = imgs.find(i => i.isMain)
    selectedImage.value = getDirectImageUrl(main?.url || imgs[0].url)
  }
})


</script>

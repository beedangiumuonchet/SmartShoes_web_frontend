<template>
  <div class="max-w-5xl mx-auto px-4 py-12 space-y-8">
    <!-- ====== Thông tin cơ bản ====== -->
    <div class="bg-white p-6 rounded-xl shadow-sm space-y-4">
      <h2 class="text-xl font-bold">Thông tin cơ bản</h2>

      <div class="space-y-2">
        <label class="font-medium">Tên sản phẩm</label>
        <input
          v-model="form.name"
          type="text"
          placeholder="Nhập tên sản phẩm"
          class="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="space-y-2">
        <label class="font-medium">Mô tả</label>
        <textarea
          v-model="form.description"
          placeholder="Nhập mô tả sản phẩm"
          class="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      <div class="flex gap-4 flex-wrap">
        <div class="flex-1 space-y-2">
          <label class="font-medium">Thương hiệu</label>
          <select v-model="form.brandId" class="w-full border px-3 py-2 rounded-lg">
            <option value="">Chọn brand</option>
            <option v-for="b in brands" :key="b.id" :value="b.id">{{ b.name }}</option>
          </select>
        </div>
        <div class="flex-1 space-y-2">
          <label class="font-medium">Danh mục</label>
          <select v-model="form.categoryId" class="w-full border px-3 py-2 rounded-lg">
            <option value="">Chọn category</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- ====== Attributes ====== -->
    <div class="bg-white p-6 rounded-xl shadow-sm space-y-4">
      <h2 class="text-xl font-bold">Thuộc tính</h2>

      <div class="flex flex-wrap gap-2">
        <div
          v-for="attr in allAttributes"
          :key="attr.id"
          class="flex items-center gap-2 border px-3 py-1 rounded-lg cursor-pointer"
          :class="{'bg-blue-100 border-blue-400': selectedAttributeIds.includes(attr.id)}"
          @click="toggleAttribute(attr.id)"
        >
          {{ attr.name }}: {{ attr.value }}
        </div>

        <!-- Tạo attribute mới -->
        <div class="flex gap-2 items-center">
          <input
            v-model="newAttributeName"
            placeholder="Tên"
            class="border px-2 py-1 rounded-lg w-24"
          />
          <input
            v-model="newAttributeValue"
            placeholder="Giá trị"
            class="border px-2 py-1 rounded-lg w-24"
          />
          <button @click="addNewAttribute" class="px-3 py-1 bg-green-500 text-white rounded-lg">Thêm</button>
        </div>
      </div>
    </div>

    <!-- ====== Variants ====== -->
    <div class="bg-white p-6 rounded-xl shadow-sm space-y-4">
      <h2 class="text-xl font-bold">Biến thể</h2>

      <!-- Chọn màu -->
      <div class="flex flex-wrap gap-2 items-center">
        <div
          v-for="color in allColors"
          :key="color.id"
          class="px-3 py-1 rounded-lg border cursor-pointer"
          :class="{'bg-blue-100 border-blue-400': selectedColorIds.includes(color.id)}"
          @click="toggleColor(color.id)"
        >
          {{ color.name }}
        </div>

        <!-- Tạo màu mới -->
        <div class="flex gap-2 items-center">
          <input v-model="newColorName" placeholder="Tên màu" class="border px-2 py-1 rounded-lg w-24" />
          <input v-model="newColorCode" placeholder="#HEX" class="border px-2 py-1 rounded-lg w-24" />
          <button @click="addNewColor" class="px-3 py-1 bg-green-500 text-white rounded-lg">Thêm</button>
        </div>
      </div>

      <!-- Variant table -->
      <table class="w-full border-collapse border mt-4 text-sm">
        <thead>
          <tr class="bg-gray-100">
            <th class="border px-2 py-1">Chọn</th>
            <th class="border px-2 py-1">Màu</th>
            <th class="border px-2 py-1">Size</th>
            <th class="border px-2 py-1">Giá</th>
            <th class="border px-2 py-1">Stock</th>
            <th class="border px-2 py-1">Ảnh</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(v, idx) in tempVariants" :key="idx" :class="{'bg-gray-50': !v.selected}">
            <td class="border px-2 py-1 text-center">
              <input type="checkbox" v-model="v.selected" />
            </td>
            <td class="border px-2 py-1">{{ v.color.name }}</td>
            <td class="border px-2 py-1">{{ v.size }}</td>
            <td class="border px-2 py-1">
              <input type="number" v-model.number="v.price" class="w-20 border px-1 py-0.5 rounded-lg" />
            </td>
            <td class="border px-2 py-1">
              <input type="number" v-model.number="v.stock" class="w-20 border px-1 py-0.5 rounded-lg" />
            </td>
            <td class="border px-2 py-1">
              <input
                type="text"
                v-model="v.images[0].url"
                placeholder="URL ảnh chính"
                class="w-full border px-1 py-0.5 rounded-lg"
                />

            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ====== Submit ====== -->
    <div class="flex justify-end">
      <button
        @click="submitForm"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
      >
        Tạo sản phẩm
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { createProductApi } from '../products/product.api'
import { getAllBrandsApi } from '../brand/brand.api'
import { getAllCategoriesApi } from '../category/category.api'
import { getAllAttributes, createAttribute } from '../attribute/attribute.api'
import { getAllColors, createColor } from '../color/color.api'


// ====== Form state ======
const form = reactive({
  name: '',
  description: '',
  brandId: '',
  categoryId: '',
  attributes: [] as string[], // attributeIds
  variants: [] as any[],
})

// ====== Dropdown data ======
const brands = ref<{id: string,name: string}[]>([])
const categories = ref<{id: string,name: string}[]>([])
const allAttributes = ref<{id: string,name: string,value: string}[]>([])
const allColors = ref<{id: string,name: string,code: string}[]>([])

// ====== New attribute/color ======
const newAttributeName = ref('')
const newAttributeValue = ref('')
const newColorName = ref('')
const newColorCode = ref('')

// ====== Selected IDs ======
const selectedAttributeIds = ref<string[]>([])
const selectedColorIds = ref<string[]>([])

// ====== Size mặc định ======
const defaultSizes = Array.from({length: 9}, (_, i) => (35 + i).toString())

// ====== Temp variants ======
interface TempVariant {
  color: {id: string,name: string,code: string}
  size: string
  price: number
  stock: number
  images: {url: string, isMain: boolean}[]
  selected: boolean
}
const tempVariants = ref<TempVariant[]>([])

// ====== Fetch data ======
const fetchData = async () => {
  brands.value = (await getAllBrandsApi()).data ?? []
  categories.value = (await getAllCategoriesApi()).data ?? []
  allAttributes.value = (await getAllAttributes()).data ?? []
  allColors.value = (await getAllColors()).data ?? []
}
fetchData()

// ====== Attribute handlers ======
const toggleAttribute = (id: string) => {
  if (selectedAttributeIds.value.includes(id)) {
    selectedAttributeIds.value = selectedAttributeIds.value.filter(i => i !== id)
  } else {
    selectedAttributeIds.value.push(id)
  }
}

const addNewAttribute = async () => {
  if (!newAttributeName.value || !newAttributeValue.value) return
  const res = await createAttribute({name: newAttributeName.value,value: newAttributeValue.value})
  allAttributes.value.push(res.data)
  selectedAttributeIds.value.push(res.data.id)
  newAttributeName.value = ''
  newAttributeValue.value = ''
}

// ====== Color handlers ======
const toggleColor = (id: string) => {
  if (selectedColorIds.value.includes(id)) {
    selectedColorIds.value = selectedColorIds.value.filter(i => i !== id)
  } else {
    selectedColorIds.value.push(id)
  }
}

// Watch selected colors -> generate variants
watch(selectedColorIds, (newIds) => {
  generateVariants()
})

const addNewColor = async () => {
  if (!newColorName.value || !newColorCode.value) return
  const res = await createColor({name: newColorName.value, code: newColorCode.value})
  allColors.value.push(res.data)
  selectedColorIds.value.push(res.data.id)
  newColorName.value = ''
  newColorCode.value = ''
}

// ====== Generate variant combinations ======
const generateVariants = () => {
  const variants: TempVariant[] = []
  for (const colorId of selectedColorIds.value) {
    const color = allColors.value.find(c => c.id === colorId)
    if (!color) continue
    for (const size of defaultSizes) {
      // Nếu đã tồn tại variant này thì giữ giá trị cũ
      const existing = tempVariants.value.find(v => v.color.id === color.id && v.size === size)
      variants.push(existing ?? {
        color,
        size,
        price: 0,
        stock: 0,
        images: [{url:'', isMain:true}],
        selected: true
      })
    }
  }
  tempVariants.value = variants
}

// ====== Submit ======
const submitForm = async () => {
  // Lọc variant được chọn
  const variants = tempVariants.value.filter(v => v.selected).map(v => ({
    colorId: v.color.id,
    size: v.size,
    price: v.price,
    stock: v.stock,
    images: v.images
  }))

  const payload = {
    name: form.name,
    description: form.description,
    brandId: form.brandId,
    categoryId: form.categoryId,
    attributes: selectedAttributeIds.value.map(id => ({attributeId: id})),
    variants
  }

  try {
    const res = await createProductApi(payload)
    alert('Tạo sản phẩm thành công!')
    // Reset form
    form.name = ''
    form.description = ''
    form.brandId = ''
    form.categoryId = ''
    selectedAttributeIds.value = []
    selectedColorIds.value = []
    tempVariants.value = []
  } catch (err) {
    console.error(err)
    alert('Có lỗi xảy ra khi tạo sản phẩm.')
  }
}
</script>

// ==================== PRODUCT TYPES ====================
export interface Product {
  id: string
  name: string
  description?: string
  slug: string
  status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK'
  createdAt: string

  brand: Brand
  category: Category
  variants: ProductVariant[]
  productAttributes: ProductAttribute[]
}

export interface SimpleProduct {
  id: string
  name: string
  status: string
}

export interface Brand {
  id: string
  name: string
}

export interface Category {
  id: string
  name: string
}

export interface ProductVariant {
  id: string
  size: string
  price: number
  priceSale: number
  stock: number
  color: Color
  colorId: string
  colorName?: string // Tên màu tùy chỉnh (nếu có)
  images: ProductImage[]
}

export interface ProductVariantWithProduct extends ProductVariant {
  product: SimpleProduct
}

export interface Color {
  id: string
  name: string
  // code: string // Mã màu hex, vd: #FFB6C1
}

export interface ProductImage {
  id: string
  url: string
  isMain: boolean
  file?: File
}

export interface ProductAttribute {
  id: string
  attribute: Attribute
}

export interface Attribute {
  id: string
  name: string
  value: string
}

export interface AiSearchRequest {
  query: string
  threshold?: number
  max_candidates?: number
  rerank?: boolean
}

export interface AiSearchResponse {
  mode: string
  results: ResultItem[]
  suggestions?: string[]
}

export interface ResultItem {
  product_id: string
  text: string
  score: number
  stock?: number // BE thêm khi còn hàng
  status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK'
}

// ==================== FILTER & PAGINATION ====================
// export interface ProductFilter {
//   page?: number
//   size?: number
//   q?: string
//   status?: string
//   minPrice?: number
//   maxPrice?: number
//   inStock?: boolean
//   sortBy?: string
//   sortDirection?: 'asc' | 'desc'
//   [key: string]: any
// }

export interface ProductFilter {
  page?: number
  size?: number

  q?: string
  status?: string

  minPrice?: number | null
  maxPrice?: number | null

  inStock?: boolean | null

  brandIds?: string[]
  categoryIds?: string[]
  colorIds?: string[]
  sizes?: string[]

  sortBy?: 'price' | 'name' | 'createdAt'
  sortDirection?: 'asc' | 'desc'
}

export interface TopProductDTO {
  product: Product
  soldQuantity: number
  soldRevenue: number
}

export interface PaginationResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

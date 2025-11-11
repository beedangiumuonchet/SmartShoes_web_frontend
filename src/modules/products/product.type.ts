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
  images: ProductImage[]
}

export interface Color {
  id: string
  name: string
  code: string // Mã màu hex, vd: #FFB6C1
}

export interface ProductImage {
  id: string
  url: string
  isMain: boolean
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

// ==================== FILTER & PAGINATION ====================
export interface ProductFilter {
  page?: number
  size?: number
  q?: string
  status?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
  [key: string]: any
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

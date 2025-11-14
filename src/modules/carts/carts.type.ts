// Interface cho Cart từ API
export interface Cart {
  id: string
  userId: string
  total: number
  details: CartDetail[]
  createdAt: string
  updatedAt?: string
  [key: string]: unknown // Index signature để compatible với Record<string, unknown>
}

// Interface cho CartDetail từ API
export interface CartDetail {
  id: string
  cart: string
  productVariantId: string
  quantity: number
  price: number
  priceSale: number
  subtotal: number
  createdAt: string
  updatedAt?: string

  // Có thể có thông tin product variant được populate
  productVariant?: {
    id: string
    size: string
    color?: {
      id: string
      name: string
      code: string
    }
    colorName?: string
    images?: Array<{
      id: string
      url: string
      isMain: boolean
    }>
    product?: {
      id: string
      name: string
      description?: string
    }
  }
  product?: {
    id: string
    name: string
    description?: string
  }
  [key: string]: unknown // Index signature
}

// Form request để thêm/cập nhật cart detail
export class CartDetailRequest {
  productVariantId: string
  quantity: number

  constructor(productVariantId: string = '', quantity: number = 1) {
    this.productVariantId = productVariantId
    this.quantity = quantity
  }
}

// Response types cho các API calls
export type GetUserCartResponse = Cart
export type CreateCartResponse = Cart
export type AddCartDetailResponse = CartDetail
export type UpdateCartDetailResponse = CartDetail
export type DeleteCartDetailResponse = void
export type ClearCartResponse = void

// Interface cho cart operations
export interface CartOperations {
  getUserCart: (userId: string) => Promise<Cart>
  createCart: (userId: string) => Promise<Cart>
  addCartDetail: (cartId: string, request: CartDetailRequest) => Promise<CartDetail>
  updateCartDetail: (detailId: string, request: CartDetailRequest) => Promise<CartDetail>
  deleteCartDetail: (detailId: string) => Promise<void>
  clearCart: (cartId: string) => Promise<void>
}

// Cart summary for display
export interface CartSummary {
  itemCount: number
  totalAmount: number
  isEmpty: boolean
}

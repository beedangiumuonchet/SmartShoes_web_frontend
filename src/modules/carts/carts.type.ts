// Interface cho Cart từ API
export interface Cart {
  id: string
  userId: string
  total: number
  details: CartDetail[]
  createdAt: string
  updatedAt?: string
}

// Interface cho CartDetail từ API
export interface CartDetail {
  id: string
  cart: string
  productVariantId: string
  quantity: number
  price: number
  subtotal: number
  createdAt: string
  updatedAt?: string
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

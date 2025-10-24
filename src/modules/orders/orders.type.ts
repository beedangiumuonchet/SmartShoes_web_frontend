// Enum cho Order Status
export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CONFIRMED = 'CONFIRMED',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

// Interface cho Order từ API
export interface Order {
  id: string
  status: OrderStatus
  userId: string
  totalAmount: number
  createdAt: string
  updatedAt?: string
  orderDetails: OrderDetail[]
}

// Interface cho OrderDetail từ API
export interface OrderDetail {
  id: string
  order: string
  productVariantId: string
  quantity: number
  price: number
  subtotal: number
  // Có thể thêm thông tin product variant nếu BE populate
  productVariant?: {
    id: string
    name: string
    image?: string
    size?: string
    color?: string
  }
}

// Form request để mua ngay (Buy Now)
export class BuyNowRequest {
  productVariantId: string
  quantity: number
  addressId: string

  constructor(productVariantId: string = '', quantity: number = 1, addressId: string = '') {
    this.productVariantId = productVariantId
    this.quantity = quantity
    this.addressId = addressId
  }
}

// Form request để tạo order từ giỏ hàng
export class FromCartRequest {
  cartId: string
  addressId: string

  constructor(cartId: string = '', addressId: string = '') {
    this.cartId = cartId
    this.addressId = addressId
  }
}

// Form request để cập nhật trạng thái order
export class UpdateStatusRequest {
  status: OrderStatus

  constructor(status: OrderStatus = OrderStatus.PENDING) {
    this.status = status
  }
}

// Response types cho các API calls
export type BuyNowResponse = Order
export type FromCartResponse = Order
export type GetAllOrdersResponse = Order[]
export type GetUserOrdersResponse = Order[]
export type GetOrderResponse = Order
export type UpdateStatusResponse = Order
export type CancelOrderResponse = Order

// Interface cho order operations
export interface OrderOperations {
  buyNow: (request: BuyNowRequest) => Promise<Order>
  fromCart: (request: FromCartRequest) => Promise<Order>
  getAllOrders: () => Promise<Order[]>
  getUserOrders: (userId: string) => Promise<Order[]>
  getOrder: (orderId: string) => Promise<Order>
  updateStatus: (orderId: string, request: UpdateStatusRequest) => Promise<Order>
  cancelOrder: (orderId: string) => Promise<Order>
}

// Order summary for display
export interface OrderSummary {
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  cancelledOrders: number
  totalAmount: number
}

// Order status mapping cho hiển thị
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Chờ xác nhận',
  [OrderStatus.PAID]: 'Đã thanh toán',
  [OrderStatus.CONFIRMED]: 'Đã xác nhận',
  [OrderStatus.SHIPPING]: 'Đang giao hàng',
  [OrderStatus.DELIVERED]: 'Đã giao hàng',
  [OrderStatus.CANCELLED]: 'Đã hủy',
}

// Order status colors cho UI
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'yellow',
  [OrderStatus.PAID]: 'orange',
  [OrderStatus.CONFIRMED]: 'blue',
  [OrderStatus.SHIPPING]: 'purple',
  [OrderStatus.DELIVERED]: 'green',
  [OrderStatus.CANCELLED]: 'red',
}

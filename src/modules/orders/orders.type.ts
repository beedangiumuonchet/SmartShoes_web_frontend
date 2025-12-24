// Enum cho Order Status
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
}

// Interface cho Order từ API
export interface Order {
  id: string
  status: OrderStatus
  userId: string
  totalAmount: number

  // 🆕 ADD: Shipping information fields
  shippingName: string
  shippingPhone: string
  shippingAddress: string

  createdAt: string
  updatedAt?: string
  orderDetails: OrderDetail[]
  [key: string]: unknown
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
  [key: string]: unknown // ADD: Index signature
}

// Form request để mua ngay (Buy Now)
export class BuyNowRequest {
  productVariantId: string
  quantity: number

  // 🆕 ADD: Shipping information fields
  shippingName: string
  shippingPhone: string
  shippingAddress: string

  constructor(
    productVariantId: string = '',
    quantity: number = 1,
    shippingName: string = '',
    shippingPhone: string = '',
    shippingAddress: string = '',
  ) {
    this.productVariantId = productVariantId
    this.quantity = quantity
    this.shippingName = shippingName
    this.shippingPhone = shippingPhone
    this.shippingAddress = shippingAddress
  }
}

// Form request để tạo order từ giỏ hàng
export class FromCartRequest {
  cartId: string
  // 🆕 ADD: Shipping information fields
  shippingName: string
  shippingPhone: string
  shippingAddress: string

  constructor(
    cartId: string = '',
    shippingName: string = '',
    shippingPhone: string = '',
    shippingAddress: string = '',
  ) {
    this.cartId = cartId
    this.shippingName = shippingName
    this.shippingPhone = shippingPhone
    this.shippingAddress = shippingAddress
  }
}

// Form request để cập nhật trạng thái order
export class UpdateStatusRequest {
  status: OrderStatus

  constructor(status: OrderStatus = OrderStatus.PENDING) {
    this.status = status
  }
}

// ✅ THÊM MỚI - Update shipping request
export class UpdateShippingRequest {
  shippingName: string
  shippingPhone: string
  shippingAddress: string

  constructor(shippingName: string = '', shippingPhone: string = '', shippingAddress: string = '') {
    this.shippingName = shippingName
    this.shippingPhone = shippingPhone
    this.shippingAddress = shippingAddress
  }
}

// NEW: Form request để filter và phân trang orders
export class OrderFilterRequest {
  q?: string // tìm theo mã đơn / user name / email
  createdDate_from?: string // format: yyyy-MM-dd
  createdDate_to?: string // format: yyyy-MM-dd
  status?: string // PENDING, PAID, CONFIRMED, SHIPPING, DELIVERED, CANCELLED
  userId?: string // lọc theo người dùng
  page: number
  size: number
  sortBy: string
  sortDirection: string

  constructor(
    q?: string,
    createdDate_from?: string,
    createdDate_to?: string,
    status?: string,
    userId?: string,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    sortDirection: string = 'desc',
  ) {
    this.q = q
    this.createdDate_from = createdDate_from
    this.createdDate_to = createdDate_to
    this.status = status
    this.userId = userId
    this.page = page
    this.size = size
    this.sortBy = sortBy
    this.sortDirection = sortDirection
  }
}

// FIXED: Interface cho Pagination Response với index signature
export interface PaginationResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
  hasNext: boolean
  hasPrevious: boolean
  [key: string]: unknown // ADD: Index signature để compatible với Record<string, unknown>
}

// Response types cho các API calls
export type BuyNowResponse = Order
export type FromCartResponse = Order
export type GetAllOrdersResponse = PaginationResponse<Order>
export type GetUserOrdersResponse = Order[]
export type GetOrderResponse = Order
export type UpdateStatusResponse = Order
export type CancelOrderResponse = Order

// Interface cho order operations
export interface OrderOperations {
  buyNow: (request: BuyNowRequest) => Promise<Order>
  fromCart: (request: FromCartRequest) => Promise<Order>
  getAllOrders: (filter?: OrderFilterRequest) => Promise<PaginationResponse<Order>>
  getUserOrders: (userId?: string) => Promise<Order[]>
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
  [OrderStatus.CONFIRMED]: 'Đã xác nhận',
  [OrderStatus.SHIPPING]: 'Đang giao hàng',
  [OrderStatus.DELIVERED]: 'Đã giao hàng',
  [OrderStatus.CANCELLED]: 'Đã hủy',
  [OrderStatus.RETURNED]: 'Đã trả hàng',
}

// Order status colors cho UI
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'yellow',
  [OrderStatus.CONFIRMED]: 'blue',
  [OrderStatus.SHIPPING]: 'purple',
  [OrderStatus.DELIVERED]: 'green',
  [OrderStatus.CANCELLED]: 'red',
  [OrderStatus.RETURNED]: 'brown',
}

// Helper để tạo OrderFilterRequest với các giá trị mặc định
export const createOrderFilter = (overrides?: Partial<OrderFilterRequest>): OrderFilterRequest => {
  return new OrderFilterRequest(
    overrides?.q,
    overrides?.createdDate_from,
    overrides?.createdDate_to,
    overrides?.status,
    overrides?.userId,
    overrides?.page ?? 0,
    overrides?.size ?? 10,
    overrides?.sortBy ?? 'createdAt',
    overrides?.sortDirection ?? 'desc',
  )
}

// Helper để convert Date thành string format yyyy-MM-dd
export const formatDateForFilter = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

// Helper để tạo query params từ OrderFilterRequest
export const buildOrderFilterParams = (
  filter: OrderFilterRequest,
): Record<string, string | number> => {
  const params: Record<string, string | number> = {
    page: filter.page,
    size: filter.size,
    sortBy: filter.sortBy,
    sortDirection: filter.sortDirection,
  }

  if (filter.q) params.q = filter.q
  if (filter.createdDate_from) params.createdDate_from = filter.createdDate_from
  if (filter.createdDate_to) params.createdDate_to = filter.createdDate_to
  if (filter.status) params.status = filter.status
  if (filter.userId) params.userId = filter.userId

  return params
}

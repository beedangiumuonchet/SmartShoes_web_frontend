// Enum cho Payment Method
export enum PaymentMethod {
  CASH = 'CASH',
  MOMO = 'MOMO',
}

// Enum cho Payment Status
export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

// Interface cho Payment từ API
export interface Payment {
  id: string
  amount: number
  paymentMethod: PaymentMethod
  transactionId?: string
  status: PaymentStatus
  order: string
  createdAt: string
  updatedAt?: string
  [key: string]: unknown // ADD: Index signature để compatible với Record<string, unknown>
}

// Form request để tạo payment
export class CreatePaymentRequest {
  orderId: string
  paymentMethod: PaymentMethod
  amount: number
  transactionId: string | undefined

  constructor(
    orderId: string = '',
    paymentMethod: PaymentMethod = PaymentMethod.CASH,
    amount: number = 0,
    transactionId?: string,
  ) {
    this.orderId = orderId
    this.paymentMethod = paymentMethod
    this.amount = amount
    this.transactionId = transactionId
  }
}

// NEW: Form request để filter và phân trang payments
export class PaymentFilterRequest {
  q?: string // tìm theo keyword (mã giao dịch, tên user, v.v.)
  status?: string // trạng thái thanh toán (PENDING, SUCCESS, FAILED)
  method?: string // phương thức thanh toán (CASH, MOMO)
  createdDate_from?: string // format: yyyy-MM-dd
  createdDate_to?: string // format: yyyy-MM-dd
  userId?: string // lọc theo người dùng
  page: number
  size: number
  sortBy: string
  sortDirection: string

  constructor(
    q?: string,
    status?: string,
    method?: string,
    createdDate_from?: string,
    createdDate_to?: string,
    userId?: string,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    sortDirection: string = 'desc',
  ) {
    this.q = q
    this.status = status
    this.method = method
    this.createdDate_from = createdDate_from
    this.createdDate_to = createdDate_to
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

// Response cho Momo payment
export interface MomoPaymentResponse {
  resultCode: number
  message: string
  payUrl: string
  deeplink: string
  qrCodeUrl: string
  orderId: string
  requestId: string
  [key: string]: unknown // ADD: Index signature
}

// Request để handle Momo IPN
export class HandleMomoIpnRequest {
  partnerCode: string
  accessKey: string
  requestId: string
  orderId: string
  transactionId: string
  orderInfo: string
  amount: string
  responseTime: string
  resultCode: string
  signature: string

  constructor(
    partnerCode: string = '',
    accessKey: string = '',
    requestId: string = '',
    orderId: string = '',
    transactionId: string = '',
    orderInfo: string = '',
    amount: string = '',
    responseTime: string = '',
    resultCode: string = '',
    signature: string = '',
  ) {
    this.partnerCode = partnerCode
    this.accessKey = accessKey
    this.requestId = requestId
    this.orderId = orderId
    this.transactionId = transactionId
    this.orderInfo = orderInfo
    this.amount = amount
    this.responseTime = responseTime
    this.resultCode = resultCode
    this.signature = signature
  }
}

// Response types cho các API calls
export type CreatePaymentResponse = Payment
export type CreateMomoPaymentResponse = MomoPaymentResponse
export type HandleMomoIpnResponse = Payment
export type PaymentReturnResponse = Payment
export type GetAllPaymentsResponse = PaginationResponse<Payment> // UPDATED: Pagination instead of array
export type GetPaymentResponse = Payment

// Interface cho payment operations
export interface PaymentOperations {
  createPayment: (request: CreatePaymentRequest) => Promise<Payment>
  createMomoPayment: (orderId: string, amount: number) => Promise<MomoPaymentResponse>
  handleMomoIpn: (request: HandleMomoIpnRequest) => Promise<Payment>
  paymentReturn: (transactionId: string) => Promise<Payment>
  getAllPayments: (filter?: PaymentFilterRequest) => Promise<PaginationResponse<Payment>> // UPDATED
  getPayment: (paymentId: string) => Promise<Payment>
}

// Payment summary for display
export interface PaymentSummary {
  totalPayments: number
  successfulPayments: number
  pendingPayments: number
  failedPayments: number
  totalAmount: number
}

// Payment status mapping cho hiển thị
export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'Chờ thanh toán',
  [PaymentStatus.SUCCESS]: 'Thành công',
  [PaymentStatus.FAILED]: 'Thất bại',
}

// Payment method mapping cho hiển thị
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: 'Tiền mặt',
  [PaymentMethod.MOMO]: 'Ví MoMo',
}

// Payment status colors cho UI
export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'yellow',
  [PaymentStatus.SUCCESS]: 'green',
  [PaymentStatus.FAILED]: 'red',
}

// Payment method colors cho UI
export const PAYMENT_METHOD_COLORS: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: 'green',
  [PaymentMethod.MOMO]: 'pink',
}

// NEW: Helper để tạo PaymentFilterRequest với các giá trị mặc định
export const createPaymentFilter = (
  overrides?: Partial<PaymentFilterRequest>,
): PaymentFilterRequest => {
  return new PaymentFilterRequest(
    overrides?.q,
    overrides?.status,
    overrides?.method,
    overrides?.createdDate_from,
    overrides?.createdDate_to,
    overrides?.userId,
    overrides?.page ?? 0,
    overrides?.size ?? 10,
    overrides?.sortBy ?? 'createdAt',
    overrides?.sortDirection ?? 'desc',
  )
}

// NEW: Helper để convert Date thành string format yyyy-MM-dd
export const formatDateForPaymentFilter = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

// NEW: Helper để tạo query params từ PaymentFilterRequest
export const buildPaymentFilterParams = (
  filter: PaymentFilterRequest,
): Record<string, string | number> => {
  const params: Record<string, string | number> = {
    page: filter.page,
    size: filter.size,
    sortBy: filter.sortBy,
    sortDirection: filter.sortDirection,
  }

  if (filter.q) params.q = filter.q
  if (filter.status) params.status = filter.status
  if (filter.method) params.method = filter.method
  if (filter.createdDate_from) params.createdDate_from = filter.createdDate_from
  if (filter.createdDate_to) params.createdDate_to = filter.createdDate_to
  if (filter.userId) params.userId = filter.userId

  return params
}

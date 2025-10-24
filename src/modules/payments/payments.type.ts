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
}

// Form request để tạo payment
export class CreatePaymentRequest {
  orderId: string
  paymentMethod: PaymentMethod
  amount: number

  constructor(
    orderId: string = '',
    paymentMethod: PaymentMethod = PaymentMethod.CASH,
    amount: number = 0,
  ) {
    this.orderId = orderId
    this.paymentMethod = paymentMethod
    this.amount = amount
  }
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
export type GetAllPaymentsResponse = Payment[]
export type GetPaymentResponse = Payment

// Interface cho payment operations
export interface PaymentOperations {
  createPayment: (request: CreatePaymentRequest) => Promise<Payment>
  createMomoPayment: (orderId: string, amount: number) => Promise<MomoPaymentResponse>
  handleMomoIpn: (request: HandleMomoIpnRequest) => Promise<Payment>
  paymentReturn: (transactionId: string) => Promise<Payment>
  getAllPayments: () => Promise<Payment[]>
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

import { AxiosHttpClient } from '@/common/utils/axios'
import type { IApiResponse } from '@/common/types'
import { getCurrentUser } from '@/common/guards/roleGuard.guard'
import { useCookies } from '@vueuse/integrations/useCookies'
import {
  type Payment,
  type PaginationResponse,
  CreatePaymentRequest,
  PaymentFilterRequest,
  HandleMomoIpnRequest,
  type MomoPaymentResponse,
  PaymentMethod,
  PaymentStatus,
  type CreatePaymentResponse,
  type CreateMomoPaymentResponse,
  type HandleMomoIpnResponse,
  type PaymentReturnResponse,
  type GetAllPaymentsResponse,
  type GetPaymentResponse,
  buildPaymentFilterParams,
  createPaymentFilter,
} from './payments.type'

const axiosHttpClient = new AxiosHttpClient(import.meta.env.VITE_API_URL)
const cookie = useCookies(['jwt_token'])

// Type guard để kiểm tra object an toàn
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// Helper để kiểm tra có property an toàn
function hasProperty(obj: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

// Type guard để kiểm tra Payment structure
// 🆕 ENHANCED: Type guard cho Payment với flexible field checking
function isValidPayment(obj: Record<string, unknown>): obj is Payment {
  const hasRequiredFields =
    hasProperty(obj, 'id') &&
    hasProperty(obj, 'amount') &&
    hasProperty(obj, 'paymentMethod') &&
    hasProperty(obj, 'status') &&
    hasProperty(obj, 'order') &&
    hasProperty(obj, 'createdAt')

  const hasValidTypes =
    typeof obj.id === 'string' &&
    typeof obj.amount === 'number' &&
    typeof obj.paymentMethod === 'string' &&
    typeof obj.status === 'string' &&
    typeof obj.order === 'string' &&
    typeof obj.createdAt === 'string'

  return hasRequiredFields && hasValidTypes
}

// 🆕 ADD: Helper để normalize Payment object
function normalizePayment(obj: Record<string, unknown>): Payment {
  return {
    id: obj.id as string,
    amount: obj.amount as number,
    paymentMethod: obj.paymentMethod as PaymentMethod,
    transactionId: obj.transactionId as string | undefined,
    status: obj.status as PaymentStatus,
    order: obj.order as string,
    createdAt: obj.createdAt as string,
    updatedAt: obj.updatedAt as string | undefined,
  }
}

// Type guard để kiểm tra PaginationResponse structure
function isValidPaginationResponse(
  obj: Record<string, unknown>,
): obj is PaginationResponse<Payment> {
  return (
    hasProperty(obj, 'content') &&
    hasProperty(obj, 'page') &&
    hasProperty(obj, 'size') &&
    hasProperty(obj, 'totalElements') &&
    hasProperty(obj, 'totalPages') &&
    Array.isArray(obj.content) &&
    typeof obj.page === 'number' &&
    typeof obj.size === 'number' &&
    typeof obj.totalElements === 'number' &&
    typeof obj.totalPages === 'number'
  )
}

// Type guard để kiểm tra MomoPaymentResponse structure
function isValidMomoPaymentResponse(obj: Record<string, unknown>): obj is MomoPaymentResponse {
  return (
    hasProperty(obj, 'resultCode') &&
    hasProperty(obj, 'message') &&
    hasProperty(obj, 'payUrl') &&
    hasProperty(obj, 'orderId') &&
    hasProperty(obj, 'requestId') &&
    typeof obj.resultCode === 'number' &&
    typeof obj.message === 'string' &&
    typeof obj.payUrl === 'string' &&
    typeof obj.orderId === 'string' &&
    typeof obj.requestId === 'string'
  )
}

/**
 * API để tạo payment
 */
export const createPayment = async (request: CreatePaymentRequest): Promise<Payment> => {
  console.log('=== CREATE PAYMENT ===')
  console.log('Request:', request)
  console.log('Request JSON:', JSON.stringify(request, null, 2))
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('======================')

  try {
    const response = await axiosHttpClient.post('/payments', request)
    console.log('✅ Create payment success:', response)

    // 🆕 ENHANCED: Handle various response structures
    if (response && isRecord(response)) {
      let paymentData: Record<string, unknown> | null = null

      // Try different response structures
      if (isValidPayment(response)) {
        paymentData = response
      } else if (
        hasProperty(response, 'data') &&
        response.data &&
        isRecord(response.data) &&
        isValidPayment(response.data)
      ) {
        paymentData = response.data
      } else if (
        hasProperty(response, 'result') &&
        response.result &&
        isRecord(response.result) &&
        isValidPayment(response.result)
      ) {
        paymentData = response.result
      } else if (hasProperty(response, 'success') && response.success) {
        if (
          hasProperty(response, 'data') &&
          response.data &&
          isRecord(response.data) &&
          isValidPayment(response.data)
        ) {
          paymentData = response.data
        } else if (
          hasProperty(response, 'result') &&
          response.result &&
          isRecord(response.result) &&
          isValidPayment(response.result)
        ) {
          paymentData = response.result
        }
      } else if (
        hasProperty(response, 'message') &&
        hasProperty(response, 'data') &&
        response.data &&
        isRecord(response.data) &&
        isValidPayment(response.data)
      ) {
        paymentData = response.data
      }

      if (paymentData) {
        return normalizePayment(paymentData)
      }

      // 🆕 LOG: Debug invalid response structure
      console.error('🚨 Invalid payment response structure:', response)
      console.error('🚨 Response keys:', Object.keys(response))
      console.error('🚨 Response data:', JSON.stringify(response, null, 2))
    }

    throw new Error('Invalid create payment response structure')
  } catch (error) {
    console.error('❌ Create payment error:', error)

    // Enhanced error logging
    if (error && isRecord(error) && hasProperty(error, 'response')) {
      const httpError = error as any
      console.error('🚨 HTTP Error details:', {
        status: httpError.response?.status,
        statusText: httpError.response?.statusText,
        url: httpError.config?.url,
        method: httpError.config?.method,
        requestData: httpError.config?.data,
        responseData: httpError.response?.data,
        headers: httpError.response?.headers,
      })

      // Specific handling for 400 errors
      if (httpError.response?.status === 400) {
        console.error('🚨 400 Bad Request Details:')
        console.error('Request that failed:', request)
        console.error('Backend error response:', httpError.response?.data)

        if (httpError.response?.data?.message) {
          throw new Error(httpError.response.data.message)
        }
      }
    }

    throw error
  }
}

/**
 * API để tạo Momo payment
 */
export const createMomoPayment = async (
  orderId: string,
  amount: number,
): Promise<MomoPaymentResponse> => {
  console.log('=== CREATE MOMO PAYMENT ===')
  console.log('Order ID:', orderId)
  console.log('Amount:', amount)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('===========================')

  try {
    const response = await axiosHttpClient.post('/payments/momo', null, {
      params: {
        orderId,
        amount,
      },
    })
    console.log('✅ Create momo payment success:', response)

    // Handle BE response structure
    if (response && isRecord(response)) {
      // Case 1: Direct momo response
      if (isValidMomoPaymentResponse(response)) {
        return response
      }
      // Case 2: Wrapped in data property
      else if (
        hasProperty(response, 'data') &&
        response.data &&
        isRecord(response.data) &&
        isValidMomoPaymentResponse(response.data)
      ) {
        return response.data
      }
      // Case 3: Wrapped in result property
      else if (
        hasProperty(response, 'result') &&
        response.result &&
        isRecord(response.result) &&
        isValidMomoPaymentResponse(response.result)
      ) {
        return response.result
      }
      // Case 4: Has success flag
      else if (hasProperty(response, 'success') && response.success) {
        if (
          hasProperty(response, 'data') &&
          response.data &&
          isRecord(response.data) &&
          isValidMomoPaymentResponse(response.data)
        ) {
          return response.data
        } else if (
          hasProperty(response, 'result') &&
          response.result &&
          isRecord(response.result) &&
          isValidMomoPaymentResponse(response.result)
        ) {
          return response.result
        }
      }
      // Case 5: ResponseUtils.success() format
      else if (
        hasProperty(response, 'message') &&
        hasProperty(response, 'data') &&
        response.data &&
        isRecord(response.data) &&
        isValidMomoPaymentResponse(response.data)
      ) {
        return response.data
      }
    }

    throw new Error('Invalid create momo payment response structure')
  } catch (error) {
    console.error('❌ Create momo payment error:', error)

    // Log chi tiết lỗi
    if (error && isRecord(error) && hasProperty(error, 'response')) {
      const httpError = error as any
      console.error('HTTP Error details:', {
        status: httpError.response?.status,
        url: httpError.config?.url,
        method: httpError.config?.method,
        data: httpError.response?.data,
      })
    }

    throw error
  }
}

/**
 * API để handle Momo IPN (Internal Process Notification)
 * Không cần auth vì được gọi từ Momo server
 */
export const handleMomoIpn = async (request: HandleMomoIpnRequest): Promise<Payment> => {
  console.log('=== HANDLE MOMO IPN ===')
  console.log('Request:', request)
  console.log('======================')

  try {
    const response = await axiosHttpClient.post('/payments/momo/ipn', request)
    console.log('✅ Handle momo IPN success:', response)

    // Handle BE response structure
    if (response && isRecord(response)) {
      if (isValidPayment(response)) {
        return response
      } else if (
        hasProperty(response, 'data') &&
        response.data &&
        isRecord(response.data) &&
        isValidPayment(response.data)
      ) {
        return response.data
      } else if (
        hasProperty(response, 'result') &&
        response.result &&
        isRecord(response.result) &&
        isValidPayment(response.result)
      ) {
        return response.result
      } else if (hasProperty(response, 'success') && response.success) {
        if (
          hasProperty(response, 'data') &&
          response.data &&
          isRecord(response.data) &&
          isValidPayment(response.data)
        ) {
          return response.data
        } else if (
          hasProperty(response, 'result') &&
          response.result &&
          isRecord(response.result) &&
          isValidPayment(response.result)
        ) {
          return response.result
        }
      } else if (
        hasProperty(response, 'message') &&
        hasProperty(response, 'data') &&
        response.data &&
        isRecord(response.data) &&
        isValidPayment(response.data)
      ) {
        return response.data
      }
    }

    throw new Error('Invalid handle momo IPN response structure')
  } catch (error) {
    console.error('❌ Handle momo IPN error:', error)
    throw error
  }
}

/**
 * API để xử lý payment return từ Momo
 */
export const paymentReturn = async (transactionId: string): Promise<Payment> => {
  console.log('=== PAYMENT RETURN ===')
  console.log('Transaction ID:', transactionId)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('======================')

  try {
    const response = await axiosHttpClient.get('/payments/momo/return', {
      params: {
        transactionId,
      },
    })
    console.log('✅ Payment return success:', response)

    // Handle BE response structure
    if (response && isRecord(response)) {
      if (isValidPayment(response)) {
        return response
      } else if (
        hasProperty(response, 'data') &&
        response.data &&
        isRecord(response.data) &&
        isValidPayment(response.data)
      ) {
        return response.data
      } else if (
        hasProperty(response, 'result') &&
        response.result &&
        isRecord(response.result) &&
        isValidPayment(response.result)
      ) {
        return response.result
      } else if (hasProperty(response, 'success') && response.success) {
        if (
          hasProperty(response, 'data') &&
          response.data &&
          isRecord(response.data) &&
          isValidPayment(response.data)
        ) {
          return response.data
        } else if (
          hasProperty(response, 'result') &&
          response.result &&
          isRecord(response.result) &&
          isValidPayment(response.result)
        ) {
          return response.result
        }
      } else if (
        hasProperty(response, 'message') &&
        hasProperty(response, 'data') &&
        response.data &&
        isRecord(response.data) &&
        isValidPayment(response.data)
      ) {
        return response.data
      }
    }

    throw new Error('Invalid payment return response structure')
  } catch (error) {
    console.error('❌ Payment return error:', error)
    throw error
  }
}

/**
 * UPDATED: API để lấy tất cả payments với phân trang và filter (admin)
 */
export const getAllPayments = async (
  filter?: PaymentFilterRequest,
): Promise<PaginationResponse<Payment>> => {
  console.log('=== GET ALL PAYMENTS ===')
  console.log('Filter:', filter)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('========================')

  // Nếu không có filter, tạo filter mặc định
  const finalFilter = filter || createPaymentFilter()

  // Build query parameters từ filter
  const params = buildPaymentFilterParams(finalFilter)
  console.log('Query params:', params)

  try {
    const response = await axiosHttpClient.get('/payments', { params })
    console.log('✅ Get all payments success:', response)

    // Handle BE response structure cho PaginationResponse
    if (response && isRecord(response)) {
      // Case 1: Direct pagination response
      if (isValidPaginationResponse(response)) {
        return response
      }
      // Case 2: Wrapped in data property
      else if (
        hasProperty(response, 'data') &&
        response.data &&
        isRecord(response.data) &&
        isValidPaginationResponse(response.data)
      ) {
        return response.data
      }
      // Case 3: Wrapped in result property
      else if (
        hasProperty(response, 'result') &&
        response.result &&
        isRecord(response.result) &&
        isValidPaginationResponse(response.result)
      ) {
        return response.result
      }
      // Case 4: Has success flag
      else if (hasProperty(response, 'success') && response.success) {
        if (
          hasProperty(response, 'data') &&
          response.data &&
          isRecord(response.data) &&
          isValidPaginationResponse(response.data)
        ) {
          return response.data
        } else if (
          hasProperty(response, 'result') &&
          response.result &&
          isRecord(response.result) &&
          isValidPaginationResponse(response.result)
        ) {
          return response.result
        }
      }
      // Case 5: ResponseUtils.success() format
      else if (
        hasProperty(response, 'message') &&
        hasProperty(response, 'data') &&
        response.data &&
        isRecord(response.data) &&
        isValidPaginationResponse(response.data)
      ) {
        return response.data
      }
      // Case 6: Fallback - BE trả về array thay vì pagination (backward compatibility)
      else if (hasProperty(response, 'data') && Array.isArray(response.data)) {
        console.warn(
          '⚠️ BE returned wrapped array instead of pagination, creating mock pagination response',
        )
        const payments = response.data as Payment[]
        return {
          content: payments,
          page: finalFilter.page,
          size: finalFilter.size,
          totalElements: payments.length,
          totalPages: Math.ceil(payments.length / finalFilter.size),
          first: finalFilter.page === 0,
          last: finalFilter.page >= Math.ceil(payments.length / finalFilter.size) - 1,
          hasNext: finalFilter.page < Math.ceil(payments.length / finalFilter.size) - 1,
          hasPrevious: finalFilter.page > 0,
        }
      }
    }

    // Case 7: Direct array response (backward compatibility)
    if (Array.isArray(response)) {
      console.warn(
        '⚠️ BE returned direct array instead of pagination, creating mock pagination response',
      )
      return {
        content: response as Payment[],
        page: finalFilter.page,
        size: finalFilter.size,
        totalElements: response.length,
        totalPages: Math.ceil(response.length / finalFilter.size),
        first: finalFilter.page === 0,
        last: finalFilter.page >= Math.ceil(response.length / finalFilter.size) - 1,
        hasNext: finalFilter.page < Math.ceil(response.length / finalFilter.size) - 1,
        hasPrevious: finalFilter.page > 0,
      }
    }

    // Fallback - empty pagination
    console.warn('⚠️ Unknown response structure, returning empty pagination')
    return {
      content: [],
      page: finalFilter.page,
      size: finalFilter.size,
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true,
      hasNext: false,
      hasPrevious: false,
    }
  } catch (error) {
    console.error('❌ Get all payments error:', error)
    throw error
  }
}

/**
 * API để lấy chi tiết một payment
 */
export const getPayment = async (paymentId: string): Promise<Payment> => {
  console.log('=== GET PAYMENT ===')
  console.log('Payment ID:', paymentId)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('==================')

  try {
    const response = await axiosHttpClient.get(`/payments/${paymentId}`)
    console.log('✅ Get payment success:', response)

    // Handle BE response structure
    if (response && isRecord(response)) {
      if (isValidPayment(response)) {
        return response
      } else if (
        hasProperty(response, 'data') &&
        response.data &&
        isRecord(response.data) &&
        isValidPayment(response.data)
      ) {
        return response.data
      } else if (
        hasProperty(response, 'result') &&
        response.result &&
        isRecord(response.result) &&
        isValidPayment(response.result)
      ) {
        return response.result
      } else if (hasProperty(response, 'success') && response.success) {
        if (
          hasProperty(response, 'data') &&
          response.data &&
          isRecord(response.data) &&
          isValidPayment(response.data)
        ) {
          return response.data
        } else if (
          hasProperty(response, 'result') &&
          response.result &&
          isRecord(response.result) &&
          isValidPayment(response.result)
        ) {
          return response.result
        }
      } else if (
        hasProperty(response, 'message') &&
        hasProperty(response, 'data') &&
        response.data &&
        isRecord(response.data) &&
        isValidPayment(response.data)
      ) {
        return response.data
      }
    }

    throw new Error('Invalid get payment response structure')
  } catch (error) {
    console.error('❌ Get payment error:', error)
    throw error
  }
}

/**
 * Helper để lấy payments của user hiện tại (nếu có endpoint này)
 */
export const getMyPayments = async (): Promise<Payment[]> => {
  const currentUser = getCurrentUser()
  if (!currentUser?.userId) {
    throw new Error('Cannot get userId from current user token')
  }

  try {
    const response = await axiosHttpClient.get(`/payments/users/${currentUser.userId}`)

    if (response && isRecord(response)) {
      if (Array.isArray(response)) {
        return response as Payment[]
      } else if (hasProperty(response, 'data') && Array.isArray(response.data)) {
        return response.data as Payment[]
      } else if (hasProperty(response, 'result') && Array.isArray(response.result)) {
        return response.result as Payment[]
      } else if (hasProperty(response, 'success') && response.success) {
        if (hasProperty(response, 'data') && Array.isArray(response.data)) {
          return response.data as Payment[]
        } else if (hasProperty(response, 'result') && Array.isArray(response.result)) {
          return response.result as Payment[]
        }
      } else if (
        hasProperty(response, 'message') &&
        hasProperty(response, 'data') &&
        Array.isArray(response.data)
      ) {
        return response.data as Payment[]
      }
    }

    // Handle direct array response
    if (Array.isArray(response)) {
      return response as Payment[]
    }

    return []
  } catch (error) {
    console.error('❌ Get my payments error:', error)
    throw error
  }
}

/**
 * Helper để format payment amount
 */
export const formatPaymentAmount = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

/**
 * Helper để redirect tới Momo payment
 */
export const redirectToMomoPayment = (payUrl: string): void => {
  if (typeof window !== 'undefined') {
    window.location.href = payUrl
  }
}

/**
 * Helper để mở Momo app (mobile)
 */
export const openMomoApp = (deeplink: string): void => {
  if (typeof window !== 'undefined') {
    window.location.href = deeplink
  }
}

/**
 * NEW: Helper để search payments với pagination
 */
export const searchPayments = async (
  query?: string,
  status?: string,
  method?: string,
  page: number = 0,
  size: number = 10,
): Promise<PaginationResponse<Payment>> => {
  const filter = createPaymentFilter({
    q: query,
    status,
    method,
    page,
    size,
  })
  return await getAllPayments(filter)
}

/**
 * NEW: Helper để lấy payments theo date range
 */
export const getPaymentsByDateRange = async (
  fromDate: Date,
  toDate: Date,
  page: number = 0,
  size: number = 10,
): Promise<PaginationResponse<Payment>> => {
  const filter = createPaymentFilter({
    createdDate_from: fromDate.toISOString().split('T')[0],
    createdDate_to: toDate.toISOString().split('T')[0],
    page,
    size,
  })
  return await getAllPayments(filter)
}

/**
 * NEW: Helper để lấy payments theo status
 */
export const getPaymentsByStatus = async (
  status: string,
  page: number = 0,
  size: number = 10,
): Promise<PaginationResponse<Payment>> => {
  const filter = createPaymentFilter({
    status,
    page,
    size,
  })
  return await getAllPayments(filter)
}

/**
 * NEW: Helper để lấy payments theo method
 */
export const getPaymentsByMethod = async (
  method: string,
  page: number = 0,
  size: number = 10,
): Promise<PaginationResponse<Payment>> => {
  const filter = createPaymentFilter({
    method,
    page,
    size,
  })
  return await getAllPayments(filter)
}

/**
 * NEW: Helper để lấy payments của user cụ thể với pagination
 */
export const getUserPaymentsWithPagination = async (
  userId: string,
  page: number = 0,
  size: number = 10,
): Promise<PaginationResponse<Payment>> => {
  const filter = createPaymentFilter({
    userId,
    page,
    size,
  })
  return await getAllPayments(filter)
}
/**
 * ✅ THÊM MỚI - Type guard để kiểm tra Order Payment structure từ BE
 */
function isValidOrderPayment(obj: Record<string, unknown>): boolean {
  const hasRequiredFields =
    hasProperty(obj, 'id') &&
    hasProperty(obj, 'amount') &&
    hasProperty(obj, 'paymentMethod') &&
    hasProperty(obj, 'status') &&
    hasProperty(obj, 'orderId') &&
    hasProperty(obj, 'createdAt')

  const hasValidTypes =
    typeof obj.id === 'string' &&
    typeof obj.amount === 'number' &&
    typeof obj.paymentMethod === 'string' &&
    typeof obj.status === 'string' &&
    typeof obj.orderId === 'string' &&
    typeof obj.createdAt === 'string'

  return hasRequiredFields && hasValidTypes
}

/**
 * ✅ THÊM MỚI - Helper để normalize Order Payment từ BE thành Payment interface
 */
function normalizeOrderPayment(obj: Record<string, unknown>): Payment | null {
  try {
    if (!isValidOrderPayment(obj)) {
      return null
    }

    return {
      id: obj.id as string,
      amount: obj.amount as number,
      paymentMethod: obj.paymentMethod as PaymentMethod,
      transactionId: obj.transactionId as string | undefined,
      status: obj.status as PaymentStatus,
      order: obj.orderId as string, // Map orderId từ BE thành order cho interface
      createdAt: obj.createdAt as string,
      updatedAt: obj.updatedAt as string | undefined,
    }
  } catch (error) {
    console.error('❌ Error normalizing order payment:', error)
    return null
  }
}

/**
 * ✅ THÊM MỚI - API để lấy tất cả payments của một order cụ thể
 */
export const getPaymentsByOrderId = async (orderId: string): Promise<Payment[]> => {
  console.log('=== GET PAYMENTS BY ORDER ID ===')
  console.log('Order ID:', orderId)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('================================')

  try {
    const response = await axiosHttpClient.get(`/payments/${orderId}/payments`)
    console.log('✅ Get payments by order ID success:', response)

    // Xử lý response theo structure từ BE: { result: [...], success: true, timestamp: "..." }
    if (
      response &&
      isRecord(response) &&
      hasProperty(response, 'result') &&
      Array.isArray(response.result)
    ) {
      const paymentsArray = response.result

      // Normalize từng payment object
      const normalizedPayments: Payment[] = paymentsArray
        .filter(
          (item): item is Record<string, unknown> =>
            typeof item === 'object' && item !== null && !Array.isArray(item),
        )
        .map((paymentData) => normalizeOrderPayment(paymentData))
        .filter((payment): payment is Payment => payment !== null)

      console.log(`✅ Processed ${normalizedPayments.length} payments for order ${orderId}`)
      return normalizedPayments
    }

    // Fallback - trả về empty array
    console.warn('⚠️ No payments found or invalid response structure')
    return []
  } catch (error) {
    console.error('❌ Get payments by order ID error:', error)

    // Handle 404 - không có payment nào
    if (error && isRecord(error) && hasProperty(error, 'response')) {
      const httpError = error as any
      if (httpError.response?.status === 404) {
        console.warn(`⚠️ No payments found for order ${orderId}`)
        return []
      }
    }

    throw error
  }
}

/**
 * ✅ THÊM MỚI - Helper để lấy payment info của order
 */
export const getOrderPaymentInfo = async (orderId: string) => {
  try {
    const payments = await getPaymentsByOrderId(orderId)
    console.log(`✅ Retrieved ${payments.length} payments for order ${orderId}`)
    console.log('💳 Payment Method Info:', payments.map((p) => p.paymentMethod).join(', '))

    if (payments.length === 0) {
      return {
        paymentMethod: null,
        paymentStatus: null,
        latestPayment: null,
        hasMultiplePayments: false,
      }
    }

    // Lấy payment mới nhất
    const latestPayment = payments.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0]

    return {
      paymentMethod: latestPayment.paymentMethod,
      paymentStatus: latestPayment.status,
      latestPayment: latestPayment,
      hasMultiplePayments: payments.length > 1,
    }
  } catch (error) {
    console.error('❌ Error getting order payment info:', error)
    return {
      paymentMethod: null,
      paymentStatus: null,
      latestPayment: null,
      hasMultiplePayments: false,
    }
  }
}

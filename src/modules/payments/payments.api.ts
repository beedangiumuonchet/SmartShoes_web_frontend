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
function isValidPayment(obj: Record<string, unknown>): obj is Payment {
  return (
    hasProperty(obj, 'id') &&
    hasProperty(obj, 'amount') &&
    hasProperty(obj, 'paymentMethod') &&
    hasProperty(obj, 'status') &&
    hasProperty(obj, 'order') &&
    hasProperty(obj, 'createdAt') &&
    typeof obj.id === 'string' &&
    typeof obj.amount === 'number' &&
    typeof obj.paymentMethod === 'string' &&
    typeof obj.status === 'string' &&
    typeof obj.order === 'string' &&
    typeof obj.createdAt === 'string'
  )
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
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('======================')

  try {
    const response = await axiosHttpClient.post('/payments', request)
    console.log('✅ Create payment success:', response)

    // Handle BE response structure
    if (response && isRecord(response)) {
      // Case 1: Direct payment response
      if (isValidPayment(response)) {
        return response
      }
      // Case 2: Wrapped in data property
      else if (
        hasProperty(response, 'data') &&
        response.data &&
        isRecord(response.data) &&
        isValidPayment(response.data)
      ) {
        return response.data
      }
      // Case 3: Wrapped in result property
      else if (
        hasProperty(response, 'result') &&
        response.result &&
        isRecord(response.result) &&
        isValidPayment(response.result)
      ) {
        return response.result
      }
      // Case 4: Has success flag
      else if (hasProperty(response, 'success') && response.success) {
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
      }
      // Case 5: ResponseUtils.success() format
      else if (
        hasProperty(response, 'message') &&
        hasProperty(response, 'data') &&
        response.data &&
        isRecord(response.data) &&
        isValidPayment(response.data)
      ) {
        return response.data
      }
    }

    throw new Error('Invalid create payment response structure')
  } catch (error) {
    console.error('❌ Create payment error:', error)

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

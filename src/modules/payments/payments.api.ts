import { AxiosHttpClient } from '@/common/utils/axios'
import type { IApiResponse } from '@/common/types'
import { getCurrentUser } from '@/common/guards/roleGuard.guard'
import { useCookies } from '@vueuse/integrations/useCookies'
import {
  type Payment,
  CreatePaymentRequest,
  HandleMomoIpnRequest,
  type MomoPaymentResponse,
  type CreatePaymentResponse,
  type CreateMomoPaymentResponse,
  type HandleMomoIpnResponse,
  type PaymentReturnResponse,
  type GetAllPaymentsResponse,
  type GetPaymentResponse,
} from './payments.type'

const axiosHttpClient = new AxiosHttpClient(import.meta.env.VITE_API_URL)
const cookie = useCookies(['jwt_token'])

/**
 * API để tạo payment
 */
export const createPayment = async (request: CreatePaymentRequest) => {
  console.log('=== CREATE PAYMENT ===')
  console.log('Request:', request)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('======================')

  try {
    const response = await axiosHttpClient.post<IApiResponse<Payment>, CreatePaymentRequest>(
      '/payments',
      request,
    )
    console.log('✅ Create payment success:', response)

    // Handle BE response structure
    if (response && typeof response === 'object') {
      // Case 1: Direct payment response
      if ('id' in response && 'amount' in response && 'status' in response) {
        return response as Payment
      }
      // Case 2: Wrapped in data property
      else if ('data' in response && response.data) {
        return response.data as Payment
      }
      // Case 3: Wrapped in result property
      else if ('result' in response && response.result) {
        return response.result as Payment
      }
      // Case 4: Has success flag
      else if ('success' in response && response.success) {
        if ('data' in response) {
          return response.data as Payment
        } else if ('result' in response) {
          return response.result as Payment
        }
      }
      // Case 5: ResponseUtils.success() format
      else if ('message' in response && 'data' in response) {
        return response.data as Payment
      }
    }

    throw new Error('Invalid create payment response structure')
  } catch (error) {
    console.error('❌ Create payment error:', error)

    // Log chi tiết lỗi
    if (error && typeof error === 'object' && 'response' in error) {
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
export const createMomoPayment = async (orderId: string, amount: number) => {
  console.log('=== CREATE MOMO PAYMENT ===')
  console.log('Order ID:', orderId)
  console.log('Amount:', amount)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('===========================')

  try {
    // SỬA: Bỏ generic type phức tạp, chỉ dùng đơn giản
    const response = await axiosHttpClient.post('/payments/momo', null, {
      params: {
        orderId,
        amount,
      },
    })
    console.log('✅ Create momo payment success:', response)

    // Handle BE response structure
    if (response && typeof response === 'object') {
      // Case 1: Direct momo response
      if ('resultCode' in response && 'payUrl' in response) {
        return response as MomoPaymentResponse
      }
      // Case 2: Wrapped in data property
      else if ('data' in response && response.data) {
        return response.data as MomoPaymentResponse
      }
      // Case 3: Wrapped in result property
      else if ('result' in response && response.result) {
        return response.result as MomoPaymentResponse
      }
      // Case 4: Has success flag
      else if ('success' in response && response.success) {
        if ('data' in response) {
          return response.data as MomoPaymentResponse
        } else if ('result' in response) {
          return response.result as MomoPaymentResponse
        }
      }
      // Case 5: ResponseUtils.success() format
      else if ('message' in response && 'data' in response) {
        return response.data as MomoPaymentResponse
      }
    }

    throw new Error('Invalid create momo payment response structure')
  } catch (error) {
    console.error('❌ Create momo payment error:', error)

    // Log chi tiết lỗi
    if (error && typeof error === 'object' && 'response' in error) {
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
export const handleMomoIpn = async (request: HandleMomoIpnRequest) => {
  console.log('=== HANDLE MOMO IPN ===')
  console.log('Request:', request)
  console.log('======================')

  try {
    const response = await axiosHttpClient.post<IApiResponse<Payment>, HandleMomoIpnRequest>(
      '/payments/momo/ipn',
      request,
    )
    console.log('✅ Handle momo IPN success:', response)

    // Handle BE response structure tương tự createPayment
    if (response && typeof response === 'object') {
      if ('id' in response && 'amount' in response && 'status' in response) {
        return response as Payment
      } else if ('data' in response && response.data) {
        return response.data as Payment
      } else if ('result' in response && response.result) {
        return response.result as Payment
      } else if ('success' in response && response.success) {
        if ('data' in response) {
          return response.data as Payment
        } else if ('result' in response) {
          return response.result as Payment
        }
      } else if ('message' in response && 'data' in response) {
        return response.data as Payment
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
export const paymentReturn = async (transactionId: string) => {
  console.log('=== PAYMENT RETURN ===')
  console.log('Transaction ID:', transactionId)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('======================')

  try {
    const response = await axiosHttpClient.get<IApiResponse<Payment>>('/payments/momo/return', {
      params: {
        transactionId,
      },
    })
    console.log('✅ Payment return success:', response)

    // Handle BE response structure tương tự createPayment
    if (response && typeof response === 'object') {
      if ('id' in response && 'amount' in response && 'status' in response) {
        return response as Payment
      } else if ('data' in response && response.data) {
        return response.data as Payment
      } else if ('result' in response && response.result) {
        return response.result as Payment
      } else if ('success' in response && response.success) {
        if ('data' in response) {
          return response.data as Payment
        } else if ('result' in response) {
          return response.result as Payment
        }
      } else if ('message' in response && 'data' in response) {
        return response.data as Payment
      }
    }

    throw new Error('Invalid payment return response structure')
  } catch (error) {
    console.error('❌ Payment return error:', error)
    throw error
  }
}

/**
 * API để lấy tất cả payments (admin)
 */
export const getAllPayments = async () => {
  console.log('=== GET ALL PAYMENTS ===')
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('========================')

  try {
    const response = await axiosHttpClient.get<IApiResponse<Payment[]>>('/payments')
    console.log('✅ Get all payments success:', response)

    // Handle BE response structure
    if (response && typeof response === 'object') {
      // Case 1: Direct array response
      if (Array.isArray(response)) {
        return response as Payment[]
      }
      // Case 2: Wrapped in data property
      else if ('data' in response && Array.isArray(response.data)) {
        return response.data as Payment[]
      }
      // Case 3: Wrapped in result property
      else if ('result' in response && Array.isArray(response.result)) {
        return response.result as Payment[]
      }
      // Case 4: Has success flag
      else if ('success' in response && response.success) {
        if ('data' in response && Array.isArray(response.data)) {
          return response.data as Payment[]
        } else if ('result' in response && Array.isArray(response.result)) {
          return response.result as Payment[]
        }
      }
      // Case 5: ResponseUtils.success() format
      else if ('message' in response && 'data' in response && Array.isArray(response.data)) {
        return response.data as Payment[]
      }
    }

    // Fallback
    return []
  } catch (error) {
    console.error('❌ Get all payments error:', error)
    throw error
  }
}

/**
 * API để lấy chi tiết một payment
 */
export const getPayment = async (paymentId: string) => {
  console.log('=== GET PAYMENT ===')
  console.log('Payment ID:', paymentId)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('==================')

  try {
    const response = await axiosHttpClient.get<IApiResponse<Payment>>(`/payments/${paymentId}`)
    console.log('✅ Get payment success:', response)

    // Handle BE response structure tương tự createPayment
    if (response && typeof response === 'object') {
      if ('id' in response && 'amount' in response && 'status' in response) {
        return response as Payment
      } else if ('data' in response && response.data) {
        return response.data as Payment
      } else if ('result' in response && response.result) {
        return response.result as Payment
      } else if ('success' in response && response.success) {
        if ('data' in response) {
          return response.data as Payment
        } else if ('result' in response) {
          return response.result as Payment
        }
      } else if ('message' in response && 'data' in response) {
        return response.data as Payment
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

  // Giả sử có endpoint /payments/users/{userId}
  try {
    const response = await axiosHttpClient.get<IApiResponse<Payment[]>>(
      `/payments/users/${currentUser.userId}`,
    )

    if (response && typeof response === 'object') {
      if (Array.isArray(response)) {
        return response as Payment[]
      } else if ('data' in response && Array.isArray(response.data)) {
        return response.data as Payment[]
      } else if ('result' in response && Array.isArray(response.result)) {
        return response.result as Payment[]
      } else if ('success' in response && response.success) {
        if ('data' in response && Array.isArray(response.data)) {
          return response.data as Payment[]
        } else if ('result' in response && Array.isArray(response.result)) {
          return response.result as Payment[]
        }
      } else if ('message' in response && 'data' in response && Array.isArray(response.data)) {
        return response.data as Payment[]
      }
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

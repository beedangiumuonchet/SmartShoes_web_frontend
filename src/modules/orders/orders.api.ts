import { AxiosHttpClient } from '@/common/utils/axios'
import type { IApiResponse } from '@/common/types'
import { getCurrentUser } from '@/common/guards/roleGuard.guard'
import { useCookies } from '@vueuse/integrations/useCookies'
import {
  type Order,
  type OrderDetail,
  BuyNowRequest,
  FromCartRequest,
  UpdateStatusRequest,
  type BuyNowResponse,
  type FromCartResponse,
  type GetAllOrdersResponse,
  type GetUserOrdersResponse,
  type GetOrderResponse,
  type UpdateStatusResponse,
  type CancelOrderResponse,
} from './orders.type'

const axiosHttpClient = new AxiosHttpClient(import.meta.env.VITE_API_URL)
const cookie = useCookies(['jwt_token'])

/**
 * API để mua ngay (Buy Now) - tạo order trực tiếp từ product
 */
export const buyNow = async (request: BuyNowRequest) => {
  console.log('=== BUY NOW ===')
  console.log('Request:', request)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('===============')

  try {
    const response = await axiosHttpClient.post('/orders/buy-now', request)
    console.log('✅ Buy now success:', response)

    // Handle BE response structure
    if (response && typeof response === 'object') {
      // Case 1: Direct order response
      if ('id' in response && 'status' in response && 'totalAmount' in response) {
        return response as Order
      }
      // Case 2: Wrapped in data property
      else if ('data' in response && response.data) {
        return response.data as Order
      }
      // Case 3: Wrapped in result property
      else if ('result' in response && response.result) {
        return response.result as Order
      }
      // Case 4: Has success flag
      else if ('success' in response && response.success) {
        if ('data' in response) {
          return response.data as Order
        } else if ('result' in response) {
          return response.result as Order
        }
      }
      // Case 5: ResponseUtils.success() format
      else if ('message' in response && 'data' in response) {
        return response.data as Order
      }
    }

    throw new Error('Invalid buy now response structure')
  } catch (error) {
    console.error('❌ Buy now error:', error)

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
 * API để tạo order từ giỏ hàng
 */
export const fromCart = async (request: FromCartRequest) => {
  console.log('=== FROM CART ===')
  console.log('Request:', request)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('=================')

  try {
    const response = await axiosHttpClient.post('/orders/from-cart', request)
    console.log('✅ From cart success:', response)

    // Handle BE response structure tương tự buyNow
    if (response && typeof response === 'object') {
      if ('id' in response && 'status' in response && 'totalAmount' in response) {
        return response as Order
      } else if ('data' in response && response.data) {
        return response.data as Order
      } else if ('result' in response && response.result) {
        return response.result as Order
      } else if ('success' in response && response.success) {
        if ('data' in response) {
          return response.data as Order
        } else if ('result' in response) {
          return response.result as Order
        }
      } else if ('message' in response && 'data' in response) {
        return response.data as Order
      }
    }

    throw new Error('Invalid from cart response structure')
  } catch (error) {
    console.error('❌ From cart error:', error)

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
 * API để lấy tất cả orders (admin)
 */
export const getAllOrders = async () => {
  console.log('=== GET ALL ORDERS ===')
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('======================')

  try {
    const response = await axiosHttpClient.get('/orders')
    console.log('✅ Get all orders success:', response)

    // Handle BE response structure
    if (response && typeof response === 'object') {
      // Case 1: Direct array response
      if (Array.isArray(response)) {
        return response as Order[]
      }
      // Case 2: Wrapped in data property
      else if ('data' in response && Array.isArray(response.data)) {
        return response.data as Order[]
      }
      // Case 3: Wrapped in result property
      else if ('result' in response && Array.isArray(response.result)) {
        return response.result as Order[]
      }
      // Case 4: Has success flag
      else if ('success' in response && response.success) {
        if ('data' in response && Array.isArray(response.data)) {
          return response.data as Order[]
        } else if ('result' in response && Array.isArray(response.result)) {
          return response.result as Order[]
        }
      }
      // Case 5: ResponseUtils.success() format
      else if ('message' in response && 'data' in response && Array.isArray(response.data)) {
        return response.data as Order[]
      }
    }

    // Fallback
    return []
  } catch (error) {
    console.error('❌ Get all orders error:', error)
    throw error
  }
}

/**
 * API để lấy orders của một user cụ thể
 */
export const getUserOrders = async (userId?: string) => {
  console.log('=== GET USER ORDERS ===')

  // Nếu không truyền userId, lấy từ getCurrentUser
  const currentUser = getCurrentUser()
  const targetUserId = userId || currentUser?.userId

  if (!targetUserId) {
    throw new Error('Cannot get userId from current user token')
  }

  console.log('Target userId:', targetUserId)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('Endpoint:', `/orders/users/${targetUserId}`)
  console.log('=======================')

  try {
    const response = await axiosHttpClient.get(`/orders/users/${targetUserId}`)
    console.log('✅ Get user orders success:', response)

    // Handle BE response structure tương tự getAllOrders
    if (response && typeof response === 'object') {
      if (Array.isArray(response)) {
        return response as Order[]
      } else if ('data' in response && Array.isArray(response.data)) {
        return response.data as Order[]
      } else if ('result' in response && Array.isArray(response.result)) {
        return response.result as Order[]
      } else if ('success' in response && response.success) {
        if ('data' in response && Array.isArray(response.data)) {
          return response.data as Order[]
        } else if ('result' in response && Array.isArray(response.result)) {
          return response.result as Order[]
        }
      } else if ('message' in response && 'data' in response && Array.isArray(response.data)) {
        return response.data as Order[]
      }
    }

    return []
  } catch (error) {
    console.error('❌ Get user orders error:', error)
    throw error
  }
}

/**
 * API để lấy chi tiết một order
 */
export const getOrder = async (orderId: string) => {
  console.log('=== GET ORDER ===')
  console.log('Order ID:', orderId)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('=================')

  try {
    const response = await axiosHttpClient.get(`/orders/${orderId}`)
    console.log('✅ Get order success:', response)

    // Handle BE response structure
    if (response && typeof response === 'object') {
      if ('id' in response && 'status' in response && 'totalAmount' in response) {
        return response as Order
      } else if ('data' in response && response.data) {
        return response.data as Order
      } else if ('result' in response && response.result) {
        return response.result as Order
      } else if ('success' in response && response.success) {
        if ('data' in response) {
          return response.data as Order
        } else if ('result' in response) {
          return response.result as Order
        }
      } else if ('message' in response && 'data' in response) {
        return response.data as Order
      }
    }

    throw new Error('Invalid get order response structure')
  } catch (error) {
    console.error('❌ Get order error:', error)
    throw error
  }
}

/**
 * API để cập nhật trạng thái order
 */
export const updateOrderStatus = async (orderId: string, request: UpdateStatusRequest) => {
  console.log('=== UPDATE ORDER STATUS ===')
  console.log('Order ID:', orderId)
  console.log('Request:', request)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('===========================')

  try {
    const response = await axiosHttpClient.put(`/orders/${orderId}/status`, request)
    console.log('✅ Update order status success:', response)

    // Handle BE response structure tương tự getOrder
    if (response && typeof response === 'object') {
      if ('id' in response && 'status' in response && 'totalAmount' in response) {
        return response as Order
      } else if ('data' in response && response.data) {
        return response.data as Order
      } else if ('result' in response && response.result) {
        return response.result as Order
      } else if ('success' in response && response.success) {
        if ('data' in response) {
          return response.data as Order
        } else if ('result' in response) {
          return response.result as Order
        }
      } else if ('message' in response && 'data' in response) {
        return response.data as Order
      }
    }

    throw new Error('Invalid update status response structure')
  } catch (error) {
    console.error('❌ Update order status error:', error)

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
 * API để hủy order
 */
export const cancelOrder = async (orderId: string) => {
  console.log('=== CANCEL ORDER ===')
  console.log('Order ID:', orderId)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('====================')

  try {
    const response = await axiosHttpClient.put(`/orders/${orderId}/cancel`)
    console.log('✅ Cancel order success:', response)

    // Handle BE response structure tương tự getOrder
    if (response && typeof response === 'object') {
      if ('id' in response && 'status' in response && 'totalAmount' in response) {
        return response as Order
      } else if ('data' in response && response.data) {
        return response.data as Order
      } else if ('result' in response && response.result) {
        return response.result as Order
      } else if ('success' in response && response.success) {
        if ('data' in response) {
          return response.data as Order
        } else if ('result' in response) {
          return response.result as Order
        }
      } else if ('message' in response && 'data' in response) {
        return response.data as Order
      }
    }

    throw new Error('Invalid cancel order response structure')
  } catch (error) {
    console.error('❌ Cancel order error:', error)
    throw error
  }
}

/**
 * Helper để lấy orders của user hiện tại
 */
export const getMyOrders = async (): Promise<Order[]> => {
  const currentUser = getCurrentUser()
  if (!currentUser?.userId) {
    throw new Error('Cannot get userId from current user token')
  }
  return await getUserOrders(currentUser.userId)
}

/**
 * Helper để tính tổng số lượng items trong order
 */
export const getOrderItemCount = (order: Order): number => {
  return order.orderDetails.reduce((total, detail) => total + detail.quantity, 0)
}

/**
 * Helper để format order total
 */
export const formatOrderTotal = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

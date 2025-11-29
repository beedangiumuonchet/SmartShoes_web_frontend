import { AxiosHttpClient } from '@/common/utils/axios'
import type { IApiResponse } from '@/common/types'
import { getCurrentUser } from '@/common/guards/roleGuard.guard'
import { useCookies } from '@vueuse/integrations/useCookies'
import {
  type Order,
  type OrderDetail,
  type PaginationResponse,
  BuyNowRequest,
  FromCartRequest,
  UpdateStatusRequest,
  OrderFilterRequest,
  buildOrderFilterParams,
  createOrderFilter,
  UpdateShippingRequest,
  type OrderStatus,
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

// Type guard để kiểm tra object an toàn
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// Helper để kiểm tra có property an toàn
function hasProperty(obj: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

// ADD: Type guard để kiểm tra Order structure
function isValidOrder(obj: Record<string, unknown>): obj is Order {
  return (
    hasProperty(obj, 'id') &&
    hasProperty(obj, 'status') &&
    hasProperty(obj, 'userId') &&
    (hasProperty(obj, 'totalAmount') || hasProperty(obj, 'total_amount')) && // 🆕 Handle both cases
    hasProperty(obj, 'createdAt') &&
    hasProperty(obj, 'orderDetails') &&
    // 🆕 ADD: Validate shipping fields
    hasProperty(obj, 'shippingName') &&
    hasProperty(obj, 'shippingPhone') &&
    hasProperty(obj, 'shippingAddress') &&
    typeof obj.id === 'string' &&
    typeof obj.status === 'string' &&
    typeof obj.userId === 'string' &&
    (typeof obj.totalAmount === 'number' || typeof obj.total_amount === 'number') && // 🆕 Handle both
    typeof obj.createdAt === 'string' &&
    typeof obj.shippingName === 'string' &&
    typeof obj.shippingPhone === 'string' &&
    typeof obj.shippingAddress === 'string' &&
    Array.isArray(obj.orderDetails)
  )
}

// ADD: Type guard để kiểm tra PaginationResponse structure
function isValidPaginationResponse(obj: Record<string, unknown>): obj is PaginationResponse<Order> {
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

/**
 * API để mua ngay (Buy Now) - tạo order trực tiếp từ product
 */
export const buyNow = async (request: BuyNowRequest): Promise<Order> => {
  console.log('=== BUY NOW ===')
  console.log('Request:', request)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('===============')

  try {
    const response = await axiosHttpClient.post('/orders/buy-now', request)
    console.log('✅ Buy now success:', response)

    // Handle BE response structure - FIXED với proper type checking
    if (response && isRecord(response)) {
      // Case 1: Direct order response
      if (isValidOrder(response)) {
        return response
      }
      // Case 2: Wrapped in data property
      else if (
        hasProperty(response, 'data') &&
        response.data &&
        isRecord(response.data) &&
        isValidOrder(response.data)
      ) {
        return response.data
      }
      // Case 3: Wrapped in result property
      else if (
        hasProperty(response, 'result') &&
        response.result &&
        isRecord(response.result) &&
        isValidOrder(response.result)
      ) {
        return response.result
      }
      // Case 4: Has success flag
      else if (hasProperty(response, 'success') && response.success) {
        if (
          hasProperty(response, 'data') &&
          response.data &&
          isRecord(response.data) &&
          isValidOrder(response.data)
        ) {
          return response.data
        } else if (
          hasProperty(response, 'result') &&
          response.result &&
          isRecord(response.result) &&
          isValidOrder(response.result)
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
        isValidOrder(response.data)
      ) {
        return response.data
      }
    }

    throw new Error('Invalid buy now response structure')
  } catch (error) {
    console.error('❌ Buy now error:', error)

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
 * API để tạo order từ giỏ hàng
 */
export const fromCart = async (request: FromCartRequest): Promise<Order> => {
  console.log('=== FROM CART ===')
  console.log('Request:', request)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('=================')

  try {
    const response = await axiosHttpClient.post('/orders/from-cart', request)
    console.log('✅ From cart success:', response)

    // Handle BE response structure - FIXED với proper type checking
    if (response && isRecord(response)) {
      if (isValidOrder(response)) {
        return response
      } else if (
        hasProperty(response, 'data') &&
        response.data &&
        isRecord(response.data) &&
        isValidOrder(response.data)
      ) {
        return response.data
      } else if (
        hasProperty(response, 'result') &&
        response.result &&
        isRecord(response.result) &&
        isValidOrder(response.result)
      ) {
        return response.result
      } else if (hasProperty(response, 'success') && response.success) {
        if (
          hasProperty(response, 'data') &&
          response.data &&
          isRecord(response.data) &&
          isValidOrder(response.data)
        ) {
          return response.data
        } else if (
          hasProperty(response, 'result') &&
          response.result &&
          isRecord(response.result) &&
          isValidOrder(response.result)
        ) {
          return response.result
        }
      } else if (
        hasProperty(response, 'message') &&
        hasProperty(response, 'data') &&
        response.data &&
        isRecord(response.data) &&
        isValidOrder(response.data)
      ) {
        return response.data
      }
    }

    throw new Error('Invalid from cart response structure')
  } catch (error) {
    console.error('❌ From cart error:', error)

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
 * API để lấy tất cả orders với phân trang và filter (admin)
 */
export const getAllOrders = async (
  filter?: OrderFilterRequest,
): Promise<PaginationResponse<Order>> => {
  console.log('=== GET ALL ORDERS ===')
  console.log('Filter:', filter)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('======================')

  // Nếu không có filter, tạo filter mặc định
  const finalFilter = filter || createOrderFilter()

  // Build query parameters từ filter
  const params = buildOrderFilterParams(finalFilter)
  console.log('Query params:', params)

  try {
    const response = await axiosHttpClient.get('/orders', { params })
    console.log('✅ Get all orders success:', response)

    // Handle BE response structure cho PaginationResponse - FIXED với proper type checking
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
      // Case 6: Fallback - BE trả về array thay vì pagination
      else if (hasProperty(response, 'data') && Array.isArray(response.data)) {
        console.warn(
          '⚠️ BE returned wrapped array instead of pagination, creating mock pagination response',
        )
        const orders = response.data as Order[]
        return {
          content: orders,
          page: finalFilter.page,
          size: finalFilter.size,
          totalElements: orders.length,
          totalPages: Math.ceil(orders.length / finalFilter.size),
          first: finalFilter.page === 0,
          last: finalFilter.page >= Math.ceil(orders.length / finalFilter.size) - 1,
          hasNext: finalFilter.page < Math.ceil(orders.length / finalFilter.size) - 1,
          hasPrevious: finalFilter.page > 0,
        }
      }
    }

    // Case 7: Direct array response
    if (Array.isArray(response)) {
      console.warn(
        '⚠️ BE returned direct array instead of pagination, creating mock pagination response',
      )
      return {
        content: response as Order[],
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
    console.error('❌ Get all orders error:', error)
    throw error
  }
}

/**
 * API để lấy orders của một user cụ thể
 */
export const getUserOrders = async (userId?: string): Promise<Order[]> => {
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

    // Handle BE response structure - FIXED với proper type checking
    if (response && isRecord(response)) {
      if (hasProperty(response, 'data') && Array.isArray(response.data)) {
        return response.data as Order[]
      } else if (hasProperty(response, 'result') && Array.isArray(response.result)) {
        return response.result as Order[]
      } else if (hasProperty(response, 'success') && response.success) {
        if (hasProperty(response, 'data') && Array.isArray(response.data)) {
          return response.data as Order[]
        } else if (hasProperty(response, 'result') && Array.isArray(response.result)) {
          return response.result as Order[]
        }
      } else if (
        hasProperty(response, 'message') &&
        hasProperty(response, 'data') &&
        Array.isArray(response.data)
      ) {
        return response.data as Order[]
      }
    }

    // Handle direct array response
    if (Array.isArray(response)) {
      return response as Order[]
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
export const getOrder = async (orderId: string): Promise<Order> => {
  console.log('=== GET ORDER ===')
  console.log('Order ID:', orderId)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('=================')

  try {
    const response = await axiosHttpClient.get(`/orders/${orderId}`)
    console.log('✅ Get order success:', response)

    // Handle BE response structure - FIXED với proper type checking
    if (response && isRecord(response)) {
      if (isValidOrder(response)) {
        return response
      } else if (
        hasProperty(response, 'data') &&
        response.data &&
        isRecord(response.data) &&
        isValidOrder(response.data)
      ) {
        return response.data
      } else if (
        hasProperty(response, 'result') &&
        response.result &&
        isRecord(response.result) &&
        isValidOrder(response.result)
      ) {
        return response.result
      } else if (hasProperty(response, 'success') && response.success) {
        if (
          hasProperty(response, 'data') &&
          response.data &&
          isRecord(response.data) &&
          isValidOrder(response.data)
        ) {
          return response.data
        } else if (
          hasProperty(response, 'result') &&
          response.result &&
          isRecord(response.result) &&
          isValidOrder(response.result)
        ) {
          return response.result
        }
      } else if (
        hasProperty(response, 'message') &&
        hasProperty(response, 'data') &&
        response.data &&
        isRecord(response.data) &&
        isValidOrder(response.data)
      ) {
        return response.data
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
export const updateOrderStatus = async (
  orderId: string,
  request: UpdateStatusRequest,
): Promise<Order> => {
  console.log('=== UPDATE ORDER STATUS ===')
  console.log('Order ID:', orderId)
  console.log('Request:', request)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('===========================')

  try {
    const response = await axiosHttpClient.put(`/orders/${orderId}/status`, request)
    console.log('✅ Update order status success:', response)

    // Handle BE response structure - FIXED với proper type checking
    if (response && isRecord(response)) {
      if (isValidOrder(response)) {
        return response
      } else if (
        hasProperty(response, 'data') &&
        response.data &&
        isRecord(response.data) &&
        isValidOrder(response.data)
      ) {
        return response.data
      } else if (
        hasProperty(response, 'result') &&
        response.result &&
        isRecord(response.result) &&
        isValidOrder(response.result)
      ) {
        return response.result
      } else if (hasProperty(response, 'success') && response.success) {
        if (
          hasProperty(response, 'data') &&
          response.data &&
          isRecord(response.data) &&
          isValidOrder(response.data)
        ) {
          return response.data
        } else if (
          hasProperty(response, 'result') &&
          response.result &&
          isRecord(response.result) &&
          isValidOrder(response.result)
        ) {
          return response.result
        }
      } else if (
        hasProperty(response, 'message') &&
        hasProperty(response, 'data') &&
        response.data &&
        isRecord(response.data) &&
        isValidOrder(response.data)
      ) {
        return response.data
      }
    }

    throw new Error('Invalid update status response structure')
  } catch (error) {
    console.error('❌ Update order status error:', error)

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
 * API để hủy order
 */
export const cancelOrder = async (orderId: string): Promise<Order> => {
  console.log('=== CANCEL ORDER ===')
  console.log('Order ID:', orderId)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('====================')

  try {
    const response = await axiosHttpClient.put(`/orders/${orderId}/cancel`)
    console.log('✅ Cancel order success:', response)

    // Handle BE response structure - FIXED với proper type checking
    if (response && isRecord(response)) {
      if (isValidOrder(response)) {
        return response
      } else if (
        hasProperty(response, 'data') &&
        response.data &&
        isRecord(response.data) &&
        isValidOrder(response.data)
      ) {
        return response.data
      } else if (
        hasProperty(response, 'result') &&
        response.result &&
        isRecord(response.result) &&
        isValidOrder(response.result)
      ) {
        return response.result
      } else if (hasProperty(response, 'success') && response.success) {
        if (
          hasProperty(response, 'data') &&
          response.data &&
          isRecord(response.data) &&
          isValidOrder(response.data)
        ) {
          return response.data
        } else if (
          hasProperty(response, 'result') &&
          response.result &&
          isRecord(response.result) &&
          isValidOrder(response.result)
        ) {
          return response.result
        }
      } else if (
        hasProperty(response, 'message') &&
        hasProperty(response, 'data') &&
        response.data &&
        isRecord(response.data) &&
        isValidOrder(response.data)
      ) {
        return response.data
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
 * API để cập nhật thông tin giao hàng của order
 */
export const updateOrderShipping = async (
  orderId: string,
  request: UpdateShippingRequest,
): Promise<Order> => {
  console.log('=== UPDATE ORDER SHIPPING ===')
  console.log('Order ID:', orderId)
  console.log('Request:', request)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('=============================')

  try {
    const response = await axiosHttpClient.put(`/orders/${orderId}/shipping`, request)
    console.log('✅ Update order shipping success:', response)

    // Handle BE response structure - tương tự như các API khác
    if (response && isRecord(response)) {
      if (isValidOrder(response)) {
        return response
      } else if (
        hasProperty(response, 'data') &&
        response.data &&
        isRecord(response.data) &&
        isValidOrder(response.data)
      ) {
        return response.data
      } else if (
        hasProperty(response, 'result') &&
        response.result &&
        isRecord(response.result) &&
        isValidOrder(response.result)
      ) {
        return response.result
      } else if (hasProperty(response, 'success') && response.success) {
        if (
          hasProperty(response, 'data') &&
          response.data &&
          isRecord(response.data) &&
          isValidOrder(response.data)
        ) {
          return response.data
        } else if (
          hasProperty(response, 'result') &&
          response.result &&
          isRecord(response.result) &&
          isValidOrder(response.result)
        ) {
          return response.result
        }
      } else if (
        hasProperty(response, 'message') &&
        hasProperty(response, 'data') &&
        response.data &&
        isRecord(response.data) &&
        isValidOrder(response.data)
      ) {
        return response.data
      }
    }

    throw new Error('Invalid update shipping response structure')
  } catch (error) {
    console.error('❌ Update order shipping error:', error)

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

/**
 * Helper để search orders với pagination
 */
export const searchOrders = async (
  query?: string,
  status?: string,
  page: number = 0,
  size: number = 10,
): Promise<PaginationResponse<Order>> => {
  const filter = createOrderFilter({
    q: query,
    status,
    page,
    size,
  })
  return await getAllOrders(filter)
}

/**
 * Helper để lấy orders theo date range
 */
export const getOrdersByDateRange = async (
  fromDate: Date,
  toDate: Date,
  page: number = 0,
  size: number = 10,
): Promise<PaginationResponse<Order>> => {
  const filter = createOrderFilter({
    createdDate_from: fromDate.toISOString().split('T')[0],
    createdDate_to: toDate.toISOString().split('T')[0],
    page,
    size,
  })
  return await getAllOrders(filter)
}

/**
 * Helper để lấy orders của user cụ thể với pagination
 */
export const getUserOrdersWithPagination = async (
  userId: string,
  page: number = 0,
  size: number = 10,
): Promise<PaginationResponse<Order>> => {
  const filter = createOrderFilter({
    userId,
    page,
    size,
  })
  return await getAllOrders(filter)
}

/**
 * Helper để lấy orders theo status
 */
export const getOrdersByStatus = async (
  status: string,
  page: number = 0,
  size: number = 10,
): Promise<PaginationResponse<Order>> => {
  const filter = createOrderFilter({
    status,
    page,
    size,
  })
  return await getAllOrders(filter)
}

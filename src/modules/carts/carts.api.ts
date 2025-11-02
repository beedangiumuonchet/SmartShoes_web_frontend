import { AxiosHttpClient } from '@/common/utils/axios'
import type { IApiResponse } from '@/common/types'
import { getCurrentUser } from '@/common/guards/roleGuard.guard'
import { useCookies } from '@vueuse/integrations/useCookies'
import {
  type Cart,
  type CartDetail,
  CartDetailRequest,
  type GetUserCartResponse,
  type CreateCartResponse,
  type AddCartDetailResponse,
  type UpdateCartDetailResponse,
} from './carts.type'

const axiosHttpClient = new AxiosHttpClient(import.meta.env.VITE_API_URL)
const cookie = useCookies(['jwt_token'])

/**
 * API để lấy giỏ hàng của user
 */
export const getUserCart = async (userId?: string) => {
  console.log('=== GET USER CART ===')

  // Nếu không truyền userId, lấy từ getCurrentUser
  const currentUser = getCurrentUser()
  const targetUserId = userId || currentUser?.userId

  if (!targetUserId) {
    throw new Error('Cannot get userId from current user token')
  }

  console.log('Target userId:', targetUserId)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('Endpoint:', `/carts/${targetUserId}`)
  console.log('=====================')

  try {
    // ✅ Thêm populate params để lấy đầy đủ thông tin product, variant, images, colors
    const response = await axiosHttpClient.get(`/carts/${targetUserId}`, {
      params: {
        populate: [
          'details.productVariant', // Lấy productVariant
          'details.productVariant.product', // Lấy product từ productVariant
          'details.productVariant.color', // Lấy color từ productVariant
          'details.productVariant.images', // Lấy images từ productVariant
        ].join(','),
      },
    })

    console.log('✅ Get user cart success with populate:', response)

    // Handle BE response structure
    if (response && typeof response === 'object') {
      let cartData: any = null

      // Case 1: Direct cart response
      if ('id' in response && 'userId' in response && 'total' in response) {
        cartData = response
      }
      // Case 2: Wrapped in data property
      else if ('data' in response && response.data) {
        cartData = response.data
      }
      // Case 3: Wrapped in result property
      else if ('result' in response && response.result) {
        cartData = response.result
      }
      // Case 4: Has success flag
      else if ('success' in response && response.success) {
        if ('data' in response) {
          cartData = response.data
        } else if ('result' in response) {
          cartData = response.result
        }
      }
      // Case 5: ResponseUtils.success() format
      else if ('message' in response && 'data' in response) {
        cartData = response.data
      }

      // ✅ Log detailed structure để debug
      if (cartData && cartData.id && cartData.userId) {
        console.log('🛒 Raw cart data with populated details:', cartData)

        // Đảm bảo có details array
        if (!cartData.details) {
          cartData.details = []
        }

        // Log chi tiết structure của từng detail để debug
        if (cartData.details.length > 0) {
          console.log('📦 First detail structure:', cartData.details[0])

          if (cartData.details[0].productVariant) {
            console.log('🎯 ProductVariant structure:', cartData.details[0].productVariant)

            if (cartData.details[0].productVariant.product) {
              console.log('📱 Product structure:', cartData.details[0].productVariant.product)
            }

            if (cartData.details[0].productVariant.color) {
              console.log('🎨 Color structure:', cartData.details[0].productVariant.color)
            }

            if (cartData.details[0].productVariant.images) {
              console.log('🖼️ Images structure:', cartData.details[0].productVariant.images)
            }
          }
        }

        return cartData as Cart
      }
    }

    throw new Error('Invalid cart response structure')
  } catch (error) {
    console.error('❌ Get user cart error:', error)

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
 * API để tạo giỏ hàng mới cho user
 */
export const createCart = async (userId?: string) => {
  console.log('=== CREATE CART ===')

  // Nếu không truyền userId, lấy từ getCurrentUser
  const currentUser = getCurrentUser()
  const targetUserId = userId || currentUser?.userId

  if (!targetUserId) {
    throw new Error('Cannot get userId from current user token')
  }

  console.log('Target userId:', targetUserId)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('===================')

  try {
    const response = await axiosHttpClient.post(`/carts/${targetUserId}`)
    console.log('✅ Create cart success:', response)

    // Handle BE response structure tương tự getUserCart
    if (response && typeof response === 'object') {
      if ('id' in response && 'userId' in response && 'total' in response) {
        return response as Cart
      } else if ('data' in response && response.data) {
        return response.data as Cart
      } else if ('result' in response && response.result) {
        return response.result as Cart
      } else if ('success' in response && response.success) {
        if ('data' in response) {
          return response.data as Cart
        } else if ('result' in response) {
          return response.result as Cart
        }
      } else if ('message' in response && 'data' in response) {
        return response.data as Cart
      }
    }

    throw new Error('Invalid create cart response structure')
  } catch (error) {
    console.error('❌ Create cart error:', error)

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
 * API để thêm sản phẩm vào giỏ hàng
 */
export const addCartDetail = async (cartId: string, request: CartDetailRequest) => {
  console.log('=== ADD CART DETAIL ===')
  console.log('Cart ID:', cartId)
  console.log('Request:', request)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('=======================')

  try {
    const response = await axiosHttpClient.post(`/carts/${cartId}/details`, request)
    console.log('✅ Add cart detail success:', response)

    // Handle BE response structure
    if (response && typeof response === 'object') {
      // Case 1: Direct cart detail response
      if ('id' in response && 'productVariantId' in response) {
        return response as CartDetail
      }
      // Case 2: Wrapped in data property
      else if ('data' in response && response.data) {
        return response.data as CartDetail
      }
      // Case 3: Wrapped in result property
      else if ('result' in response && response.result) {
        return response.result as CartDetail
      }
      // Case 4: Has success flag
      else if ('success' in response && response.success) {
        if ('data' in response) {
          return response.data as CartDetail
        } else if ('result' in response) {
          return response.result as CartDetail
        }
      }
      // Case 5: ResponseUtils.success() format
      else if ('message' in response && 'data' in response) {
        return response.data as CartDetail
      }
    }

    throw new Error('Invalid add cart detail response structure')
  } catch (error) {
    console.error('❌ Add cart detail error:', error)

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
 * API để cập nhật số lượng sản phẩm trong giỏ hàng
 */
export const updateCartDetail = async (detailId: string, request: CartDetailRequest) => {
  console.log('=== UPDATE CART DETAIL ===')
  console.log('Detail ID:', detailId)
  console.log('Request:', request)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('==========================')

  try {
    const response = await axiosHttpClient.put(`/carts/details/${detailId}`, request)
    console.log('✅ Update cart detail success:', response)

    // Handle BE response structure tương tự addCartDetail
    if (response && typeof response === 'object') {
      if ('id' in response && 'productVariantId' in response) {
        return response as CartDetail
      } else if ('data' in response && response.data) {
        return response.data as CartDetail
      } else if ('result' in response && response.result) {
        return response.result as CartDetail
      } else if ('success' in response && response.success) {
        if ('data' in response) {
          return response.data as CartDetail
        } else if ('result' in response) {
          return response.result as CartDetail
        }
      } else if ('message' in response && 'data' in response) {
        return response.data as CartDetail
      }
    }

    throw new Error('Invalid update cart detail response structure')
  } catch (error) {
    console.error('❌ Update cart detail error:', error)

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
 * API để xóa một sản phẩm khỏi giỏ hàng
 */
export const deleteCartDetail = async (detailId: string) => {
  console.log('=== DELETE CART DETAIL ===')
  console.log('Detail ID:', detailId)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('===========================')

  try {
    const response = await axiosHttpClient.delete(`/carts/details/${detailId}`)
    console.log('✅ Delete cart detail success:', response)
    return response
  } catch (error) {
    console.error('❌ Delete cart detail error:', error)
    throw error
  }
}

/**
 * API để xóa toàn bộ giỏ hàng
 */
export const clearCart = async (cartId: string) => {
  console.log('=== CLEAR CART ===')
  console.log('Cart ID:', cartId)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('==================')

  try {
    const response = await axiosHttpClient.delete(`/carts/${cartId}`)
    console.log('✅ Clear cart success:', response)
    return response
  } catch (error) {
    console.error('❌ Clear cart error:', error)
    throw error
  }
}

/**
 * Helper để lấy hoặc tạo cart cho user hiện tại
 */
export const getOrCreateUserCart = async (userId?: string): Promise<Cart> => {
  try {
    // Thử lấy cart trước
    return await getUserCart(userId)
  } catch (error) {
    console.log('Cart not found, creating new cart...')
    // Nếu không có cart, tạo mới
    return await createCart(userId)
  }
}

/**
 * Helper để tính tổng số lượng item trong cart
 */
export const getCartItemCount = (cart: Cart): number => {
  return cart.details.reduce((total, detail) => total + detail.quantity, 0)
}

/**
 * Helper để kiểm tra cart có rỗng không
 */
export const isCartEmpty = (cart: Cart): boolean => {
  return !cart.details || cart.details.length === 0
}

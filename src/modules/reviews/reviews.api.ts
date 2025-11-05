import { AxiosHttpClient } from '@/common/utils/axios'
import type { IApiResponse } from '@/common/types'
import { getCurrentUser } from '@/common/guards/roleGuard.guard'
import { useCookies } from '@vueuse/integrations/useCookies'
import {
  type Review,
  type PaginationResponse,
  CreateReviewRequest,
  UpdateReviewRequest,
  ReviewFilterRequest,
  type CreateReviewResponse,
  type UpdateReviewResponse,
  type GetAllReviewsResponse,
  type GetReviewResponse,
  type GetReviewsByProductResponse,
  type GetMyReviewsResponse,
  buildReviewFilterParams,
  createReviewFilter,
} from './reviews.type'

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

// Type guard để kiểm tra Review structure
function isValidReview(obj: Record<string, unknown>): obj is Review {
  return (
    hasProperty(obj, 'id') &&
    hasProperty(obj, 'productId') &&
    hasProperty(obj, 'userId') &&
    hasProperty(obj, 'comment') &&
    hasProperty(obj, 'rating') &&
    hasProperty(obj, 'createdAt') &&
    typeof obj.id === 'string' &&
    typeof obj.productId === 'string' &&
    typeof obj.userId === 'string' &&
    typeof obj.comment === 'string' &&
    typeof obj.rating === 'number' &&
    typeof obj.createdAt === 'string'
  )
}

// Type guard để kiểm tra PaginationResponse structure
function isValidPaginationResponse(
  obj: Record<string, unknown>,
): obj is PaginationResponse<Review> {
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
 * API để tạo review
 */
export const createReview = async (request: CreateReviewRequest): Promise<Review> => {
  console.log('=== CREATE REVIEW ===')
  console.log('Request:', request)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('=====================')

  try {
    const response = await axiosHttpClient.post('/reviews', request)
    console.log('✅ Create review success:', response)

    // Handle BE response structure
    if (response && isRecord(response)) {
      // Case 1: Direct review response
      if (isValidReview(response)) {
        return response
      }
      // Case 2: Wrapped in data property
      else if (
        hasProperty(response, 'data') &&
        response.data &&
        isRecord(response.data) &&
        isValidReview(response.data)
      ) {
        return response.data
      }
      // Case 3: Wrapped in result property
      else if (
        hasProperty(response, 'result') &&
        response.result &&
        isRecord(response.result) &&
        isValidReview(response.result)
      ) {
        return response.result
      }
      // Case 4: Has success flag
      else if (hasProperty(response, 'success') && response.success) {
        if (
          hasProperty(response, 'data') &&
          response.data &&
          isRecord(response.data) &&
          isValidReview(response.data)
        ) {
          return response.data
        } else if (
          hasProperty(response, 'result') &&
          response.result &&
          isRecord(response.result) &&
          isValidReview(response.result)
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
        isValidReview(response.data)
      ) {
        return response.data
      }
    }

    throw new Error('Invalid create review response structure')
  } catch (error) {
    console.error('❌ Create review error:', error)

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
 * API để lấy tất cả reviews với phân trang và filter
 */
export const getAllReviews = async (
  filter?: ReviewFilterRequest,
): Promise<PaginationResponse<Review>> => {
  console.log('=== GET ALL REVIEWS ===')
  console.log('Filter:', filter)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('=======================')

  // Nếu không có filter, tạo filter mặc định
  const finalFilter = filter || createReviewFilter()

  // Build query parameters từ filter
  const params = buildReviewFilterParams(finalFilter)
  console.log('Query params:', params)

  try {
    const response = await axiosHttpClient.get('/reviews', { params })
    console.log('✅ Get all reviews success:', response)

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
      // Case 6: Fallback - BE trả về array thay vì pagination
      else if (hasProperty(response, 'data') && Array.isArray(response.data)) {
        console.warn(
          '⚠️ BE returned wrapped array instead of pagination, creating mock pagination response',
        )
        const reviews = response.data as Review[]
        return {
          content: reviews,
          page: finalFilter.page,
          size: finalFilter.size,
          totalElements: reviews.length,
          totalPages: Math.ceil(reviews.length / finalFilter.size),
          first: finalFilter.page === 0,
          last: finalFilter.page >= Math.ceil(reviews.length / finalFilter.size) - 1,
          hasNext: finalFilter.page < Math.ceil(reviews.length / finalFilter.size) - 1,
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
        content: response as Review[],
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
    console.error('❌ Get all reviews error:', error)
    throw error
  }
}

/**
 * API để lấy chi tiết một review
 */
export const getReview = async (reviewId: string): Promise<Review> => {
  console.log('=== GET REVIEW ===')
  console.log('Review ID:', reviewId)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('==================')

  try {
    const response = await axiosHttpClient.get(`/reviews/${reviewId}`)
    console.log('✅ Get review success:', response)

    // Handle BE response structure
    if (response && isRecord(response)) {
      if (isValidReview(response)) {
        return response
      } else if (
        hasProperty(response, 'data') &&
        response.data &&
        isRecord(response.data) &&
        isValidReview(response.data)
      ) {
        return response.data
      } else if (
        hasProperty(response, 'result') &&
        response.result &&
        isRecord(response.result) &&
        isValidReview(response.result)
      ) {
        return response.result
      } else if (hasProperty(response, 'success') && response.success) {
        if (
          hasProperty(response, 'data') &&
          response.data &&
          isRecord(response.data) &&
          isValidReview(response.data)
        ) {
          return response.data
        } else if (
          hasProperty(response, 'result') &&
          response.result &&
          isRecord(response.result) &&
          isValidReview(response.result)
        ) {
          return response.result
        }
      } else if (
        hasProperty(response, 'message') &&
        hasProperty(response, 'data') &&
        response.data &&
        isRecord(response.data) &&
        isValidReview(response.data)
      ) {
        return response.data
      }
    }

    throw new Error('Invalid get review response structure')
  } catch (error) {
    console.error('❌ Get review error:', error)
    throw error
  }
}

/**
 * API để lấy reviews của một product cụ thể
 */
export const getReviewsByProduct = async (
  productId: string,
  filter?: ReviewFilterRequest,
): Promise<PaginationResponse<Review>> => {
  console.log('=== GET REVIEWS BY PRODUCT ===')
  console.log('Product ID:', productId)
  console.log('Filter:', filter)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('==============================')

  // Nếu không có filter, tạo filter mặc định
  const finalFilter = filter || createReviewFilter()

  // Build query parameters từ filter
  const params = buildReviewFilterParams(finalFilter)
  console.log('Query params:', params)

  try {
    const response = await axiosHttpClient.get(`/reviews/product/${productId}`, { params })
    console.log('✅ Get reviews by product success:', response)

    // Handle BE response structure cho PaginationResponse
    if (response && isRecord(response)) {
      if (isValidPaginationResponse(response)) {
        return response
      } else if (
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
      } else if (hasProperty(response, 'success') && response.success) {
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
      } else if (
        hasProperty(response, 'message') &&
        hasProperty(response, 'data') &&
        response.data &&
        isRecord(response.data) &&
        isValidPaginationResponse(response.data)
      ) {
        return response.data
      } else if (hasProperty(response, 'data') && Array.isArray(response.data)) {
        console.warn(
          '⚠️ BE returned wrapped array instead of pagination, creating mock pagination response',
        )
        const reviews = response.data as Review[]
        return {
          content: reviews,
          page: finalFilter.page,
          size: finalFilter.size,
          totalElements: reviews.length,
          totalPages: Math.ceil(reviews.length / finalFilter.size),
          first: finalFilter.page === 0,
          last: finalFilter.page >= Math.ceil(reviews.length / finalFilter.size) - 1,
          hasNext: finalFilter.page < Math.ceil(reviews.length / finalFilter.size) - 1,
          hasPrevious: finalFilter.page > 0,
        }
      }
    }

    if (Array.isArray(response)) {
      console.warn(
        '⚠️ BE returned direct array instead of pagination, creating mock pagination response',
      )
      return {
        content: response as Review[],
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
    console.error('❌ Get reviews by product error:', error)
    throw error
  }
}

/**
 * API để lấy reviews của user hiện tại
 */
export const getMyReviews = async (
  filter?: ReviewFilterRequest,
): Promise<PaginationResponse<Review>> => {
  console.log('=== GET MY REVIEWS ===')

  const currentUser = getCurrentUser()
  if (!currentUser?.userId) {
    throw new Error('Cannot get userId from current user token')
  }

  console.log('Current userId:', currentUser.userId)
  console.log('Filter:', filter)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('======================')

  // Nếu không có filter, tạo filter mặc định
  const finalFilter = filter || createReviewFilter()

  // Build query parameters từ filter
  const params = buildReviewFilterParams(finalFilter)
  console.log('Query params:', params)

  try {
    const response = await axiosHttpClient.get('/reviews/me', { params })
    console.log('✅ Get my reviews success:', response)

    // Handle BE response structure cho PaginationResponse
    if (response && isRecord(response)) {
      if (isValidPaginationResponse(response)) {
        return response
      } else if (
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
      } else if (hasProperty(response, 'success') && response.success) {
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
      } else if (
        hasProperty(response, 'message') &&
        hasProperty(response, 'data') &&
        response.data &&
        isRecord(response.data) &&
        isValidPaginationResponse(response.data)
      ) {
        return response.data
      } else if (hasProperty(response, 'data') && Array.isArray(response.data)) {
        console.warn(
          '⚠️ BE returned wrapped array instead of pagination, creating mock pagination response',
        )
        const reviews = response.data as Review[]
        return {
          content: reviews,
          page: finalFilter.page,
          size: finalFilter.size,
          totalElements: reviews.length,
          totalPages: Math.ceil(reviews.length / finalFilter.size),
          first: finalFilter.page === 0,
          last: finalFilter.page >= Math.ceil(reviews.length / finalFilter.size) - 1,
          hasNext: finalFilter.page < Math.ceil(reviews.length / finalFilter.size) - 1,
          hasPrevious: finalFilter.page > 0,
        }
      }
    }

    if (Array.isArray(response)) {
      console.warn(
        '⚠️ BE returned direct array instead of pagination, creating mock pagination response',
      )
      return {
        content: response as Review[],
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
    console.error('❌ Get my reviews error:', error)
    throw error
  }
}

/**
 * API để cập nhật review
 */
export const updateReview = async (
  reviewId: string,
  request: UpdateReviewRequest,
): Promise<Review> => {
  console.log('=== UPDATE REVIEW ===')
  console.log('Review ID:', reviewId)
  console.log('Request:', request)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('=====================')

  try {
    const response = await axiosHttpClient.put(`/reviews/${reviewId}`, request)
    console.log('✅ Update review success:', response)

    // Handle BE response structure
    if (response && isRecord(response)) {
      if (isValidReview(response)) {
        return response
      } else if (
        hasProperty(response, 'data') &&
        response.data &&
        isRecord(response.data) &&
        isValidReview(response.data)
      ) {
        return response.data
      } else if (
        hasProperty(response, 'result') &&
        response.result &&
        isRecord(response.result) &&
        isValidReview(response.result)
      ) {
        return response.result
      } else if (hasProperty(response, 'success') && response.success) {
        if (
          hasProperty(response, 'data') &&
          response.data &&
          isRecord(response.data) &&
          isValidReview(response.data)
        ) {
          return response.data
        } else if (
          hasProperty(response, 'result') &&
          response.result &&
          isRecord(response.result) &&
          isValidReview(response.result)
        ) {
          return response.result
        }
      } else if (
        hasProperty(response, 'message') &&
        hasProperty(response, 'data') &&
        response.data &&
        isRecord(response.data) &&
        isValidReview(response.data)
      ) {
        return response.data
      }
    }

    throw new Error('Invalid update review response structure')
  } catch (error) {
    console.error('❌ Update review error:', error)

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
 * API để xóa review
 */
export const deleteReview = async (reviewId: string): Promise<void> => {
  console.log('=== DELETE REVIEW ===')
  console.log('Review ID:', reviewId)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('=====================')

  try {
    await axiosHttpClient.delete(`/reviews/${reviewId}`)
    console.log('✅ Delete review success')
  } catch (error) {
    console.error('❌ Delete review error:', error)

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
 * Helper để search reviews với pagination
 */
export const searchReviews = async (
  query?: string,
  productId?: string,
  minRating?: number,
  maxRating?: number,
  page: number = 0,
  size: number = 10,
): Promise<PaginationResponse<Review>> => {
  const filter = createReviewFilter({
    q: query,
    productId,
    minRating,
    maxRating,
    page,
    size,
  })
  return await getAllReviews(filter)
}

/**
 * Helper để lấy reviews theo date range
 */
export const getReviewsByDateRange = async (
  fromDate: Date,
  toDate: Date,
  page: number = 0,
  size: number = 10,
): Promise<PaginationResponse<Review>> => {
  const filter = createReviewFilter({
    createdDate_from: fromDate.toISOString().split('T')[0],
    createdDate_to: toDate.toISOString().split('T')[0],
    page,
    size,
  })
  return await getAllReviews(filter)
}

/**
 * Helper để lấy reviews theo rating range
 */
export const getReviewsByRating = async (
  minRating: number,
  maxRating: number,
  page: number = 0,
  size: number = 10,
): Promise<PaginationResponse<Review>> => {
  const filter = createReviewFilter({
    minRating,
    maxRating,
    page,
    size,
  })
  return await getAllReviews(filter)
}

/**
 * Helper để format review date
 */
export const formatReviewDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Helper để check if user can edit review
 */
export const canEditReview = (review: Review): boolean => {
  const currentUser = getCurrentUser()
  return currentUser?.userId === review.userId
}

/**
 * Helper để truncate review comment
 */
export const truncateComment = (comment: string, maxLength: number = 100): string => {
  if (comment.length <= maxLength) return comment
  return comment.substring(0, maxLength) + '...'
}

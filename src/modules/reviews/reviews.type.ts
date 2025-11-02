// Interface cho Review từ API
export interface Review {
  id: string
  productId: string
  userId: string
  comment: string
  rating: number
  createdAt: string
  updatedAt?: string
  // Có thể có thông tin product và user được populate
  product?: {
    id: string
    name: string
    image?: string
  }
  user?: {
    id: string
    name: string
    email?: string
  }
  [key: string]: unknown // Index signature để compatible với Record<string, unknown>
}

// Form request để tạo review
export class CreateReviewRequest {
  productId: string
  comment: string
  rating: number

  constructor(productId: string = '', comment: string = '', rating: number = 5) {
    this.productId = productId
    this.comment = comment
    this.rating = rating
  }
}

// Form request để update review
export class UpdateReviewRequest {
  comment: string
  rating: number

  constructor(comment: string = '', rating: number = 5) {
    this.comment = comment
    this.rating = rating
  }
}

// Form request để filter và phân trang reviews
export class ReviewFilterRequest {
  q?: string // search text in comment
  productId?: string // lọc theo sản phẩm
  minRating?: number // rating tối thiểu (1-5)
  maxRating?: number // rating tối đa (1-5)
  createdDate_from?: string // format: yyyy-MM-dd
  createdDate_to?: string // format: yyyy-MM-dd
  page: number
  size: number
  sortBy: string
  sortDirection: string

  constructor(
    q?: string,
    productId?: string,
    minRating?: number,
    maxRating?: number,
    createdDate_from?: string,
    createdDate_to?: string,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    sortDirection: string = 'desc',
  ) {
    this.q = q
    this.productId = productId
    this.minRating = minRating
    this.maxRating = maxRating
    this.createdDate_from = createdDate_from
    this.createdDate_to = createdDate_to
    this.page = page
    this.size = size
    this.sortBy = sortBy
    this.sortDirection = sortDirection
  }
}

// Interface cho Pagination Response với index signature
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
  [key: string]: unknown // Index signature để compatible với Record<string, unknown>
}

// Response types cho các API calls
export type CreateReviewResponse = Review
export type UpdateReviewResponse = Review
export type GetAllReviewsResponse = PaginationResponse<Review>
export type GetReviewResponse = Review
export type GetReviewsByProductResponse = PaginationResponse<Review>
export type GetMyReviewsResponse = PaginationResponse<Review>

// Interface cho review operations
export interface ReviewOperations {
  createReview: (request: CreateReviewRequest) => Promise<Review>
  getAllReviews: (filter?: ReviewFilterRequest) => Promise<PaginationResponse<Review>>
  getReview: (reviewId: string) => Promise<Review>
  getReviewsByProduct: (
    productId: string,
    filter?: ReviewFilterRequest,
  ) => Promise<PaginationResponse<Review>>
  getMyReviews: (filter?: ReviewFilterRequest) => Promise<PaginationResponse<Review>>
  updateReview: (reviewId: string, request: UpdateReviewRequest) => Promise<Review>
  deleteReview: (reviewId: string) => Promise<void>
}

// Review summary for display
export interface ReviewSummary {
  totalReviews: number
  averageRating: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

// Rating levels
export const RATING_LEVELS = {
  1: 'Rất tệ',
  2: 'Tệ',
  3: 'Bình thường',
  4: 'Tốt',
  5: 'Rất tốt',
} as const

// Rating colors cho UI
export const RATING_COLORS = {
  1: 'red',
  2: 'orange',
  3: 'yellow',
  4: 'blue',
  5: 'green',
} as const

// Helper để tạo ReviewFilterRequest với các giá trị mặc định
export const createReviewFilter = (
  overrides?: Partial<ReviewFilterRequest>,
): ReviewFilterRequest => {
  return new ReviewFilterRequest(
    overrides?.q,
    overrides?.productId,
    overrides?.minRating,
    overrides?.maxRating,
    overrides?.createdDate_from,
    overrides?.createdDate_to,
    overrides?.page ?? 0,
    overrides?.size ?? 10,
    overrides?.sortBy ?? 'createdAt',
    overrides?.sortDirection ?? 'desc',
  )
}

// Helper để convert Date thành string format yyyy-MM-dd
export const formatDateForReviewFilter = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

// Helper để tạo query params từ ReviewFilterRequest
export const buildReviewFilterParams = (
  filter: ReviewFilterRequest,
): Record<string, string | number> => {
  const params: Record<string, string | number> = {
    page: filter.page,
    size: filter.size,
    sortBy: filter.sortBy,
    sortDirection: filter.sortDirection,
  }

  if (filter.q) params.q = filter.q
  if (filter.productId) params.productId = filter.productId
  if (filter.minRating !== undefined) params.minRating = filter.minRating
  if (filter.maxRating !== undefined) params.maxRating = filter.maxRating
  if (filter.createdDate_from) params.createdDate_from = filter.createdDate_from
  if (filter.createdDate_to) params.createdDate_to = filter.createdDate_to

  return params
}

// Helper để validate rating
export const isValidRating = (rating: number): boolean => {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5
}

// Helper để get rating text
export const getRatingText = (rating: number): string => {
  return RATING_LEVELS[rating as keyof typeof RATING_LEVELS] || 'Không xác định'
}

// Helper để get rating color
export const getRatingColor = (rating: number): string => {
  return RATING_COLORS[rating as keyof typeof RATING_COLORS] || 'gray'
}

// Helper để format rating display
export const formatRating = (rating: number): string => {
  return `${rating}/5 ⭐`
}

// Helper để calculate average rating
export const calculateAverageRating = (reviews: Review[]): number => {
  if (reviews.length === 0) return 0
  const total = reviews.reduce((sum, review) => sum + review.rating, 0)
  return Math.round((total / reviews.length) * 10) / 10 // Round to 1 decimal place
}

// Helper để get rating distribution
export const getRatingDistribution = (reviews: Review[]): Record<number, number> => {
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      distribution[review.rating as keyof typeof distribution]++
    }
  })
  return distribution
}

// Helper để render stars
export const renderStars = (rating: number): string => {
  const fullStars = '★'.repeat(rating)
  const emptyStars = '☆'.repeat(5 - rating)
  return fullStars + emptyStars
}

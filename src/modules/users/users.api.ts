import { AxiosHttpClient } from '@/common/utils/axios'
import type { IApiResponse } from '@/common/types'
import { useCookies } from '@vueuse/integrations/useCookies'
import { getCurrentUser } from '@/common/guards/roleGuard.guard'
import {
  type UserProfile,
  type CreateUserRequest,
  type UserDto,
  type UserSearchParams,
  type PagedData,
  type UpdateUserRequest,
  type Role,
  type RoleRequest,
  UpdateProfileForm,
  ChangePasswordForm,
  type UploadAvatarResponse,
} from './users.type'

const axiosHttpClient = new AxiosHttpClient(import.meta.env.VITE_API_URL)
const cookie = useCookies(['jwt_token'])

// ✅ Type guard để kiểm tra object an toàn
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// ✅ Helper để kiểm tra có property an toàn
function hasProperty(obj: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

// ✅ Type guard để kiểm tra UserDto structure
function isValidUser(obj: Record<string, unknown>): obj is UserDto {
  return (
    hasProperty(obj, 'id') &&
    hasProperty(obj, 'email') &&
    hasProperty(obj, 'username') &&
    hasProperty(obj, 'firstName') &&
    hasProperty(obj, 'lastName') &&
    hasProperty(obj, 'status') &&
    hasProperty(obj, 'createdAt') &&
    typeof obj.id === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.username === 'string' &&
    typeof obj.firstName === 'string' &&
    typeof obj.lastName === 'string' &&
    typeof obj.status === 'string' &&
    typeof obj.createdAt === 'string'
  )
}

// ✅ Type guard để kiểm tra PagedData structure
function isValidPagedData(obj: Record<string, unknown>): obj is PagedData<UserDto> {
  return (
    hasProperty(obj, 'content') &&
    hasProperty(obj, 'totalElements') &&
    hasProperty(obj, 'totalPages') &&
    hasProperty(obj, 'number') &&
    hasProperty(obj, 'size') &&
    Array.isArray(obj.content) &&
    typeof obj.totalElements === 'number' &&
    typeof obj.totalPages === 'number' &&
    typeof obj.number === 'number' &&
    typeof obj.size === 'number'
  )
}

// ================================
// PROFILE APIs (existing)
// ================================

// API để lấy thông tin profile hiện tại
export const getMyProfile = async () => {
  const token = cookie.get('jwt_token')
  console.log('=== GET MY PROFILE DEBUG ===')
  console.log(
    'Token from cookie (jwt_token):',
    token ? `${token.substring(0, 50)}...` : 'NOT_FOUND',
  )
  console.log('API Base URL:', import.meta.env.VITE_API_URL)
  console.log('Endpoint:', '/v1/auth/me')
  console.log('Full URL:', `${import.meta.env.VITE_API_URL}/v1/auth/me`)
  console.log('============================')

  if (!token) {
    throw new Error('No authentication token found in cookie')
  }

  try {
    const response = await axiosHttpClient.get<IApiResponse<UserProfile>>('/v1/auth/me')
    console.log('✅ Profile API success:', response)
    return response
  } catch (error) {
    console.error('❌ Profile API error:', error)
    throw error
  }
}

// API để cập nhật profile
export const updateMyProfile = async (form: UpdateProfileForm) => {
  console.log('=== UPDATE PROFILE ===')
  console.log('Form data:', form)
  console.log('Token exists:', !!cookie.get('jwt_token'))

  const currentUser = getCurrentUser()
  if (!currentUser || !currentUser.userId) {
    throw new Error('Cannot get userId from current user token')
  }

  const userId = currentUser.userId
  console.log('UserId from getCurrentUser:', userId)
  console.log('Current user info:', {
    id: currentUser.id,
    userId: currentUser.userId,
    username: currentUser.username,
    email: currentUser.email,
  })
  console.log('======================')

  try {
    const response = await axiosHttpClient.put<IApiResponse<UserProfile>, UpdateProfileForm>(
      `/users/${userId}`,
      form,
    )
    console.log('✅ Update profile success:', response)
    return response
  } catch (error) {
    console.error('❌ Update profile error:', error)

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

// ✅ SỬA - API đổi mật khẩu
export const changePassword = async (form: ChangePasswordForm) => {
  console.log('=== CHANGE PASSWORD ===')
  console.log('Form validation:')
  console.log('- Has oldPassword:', !!form.oldPassword)
  console.log('- Has newPassword:', !!form.newPassword)
  console.log('- Has confirmPassword:', !!form.confirmPassword)
  console.log('- Token exists:', !!cookie.get('jwt_token'))

  // ✅ Lấy userId từ token
  const currentUser = getCurrentUser()
  if (!currentUser?.userId) {
    throw new Error('Không thể xác định người dùng hiện tại')
  }

  const userId = currentUser.userId
  console.log('UserId:', userId)
  console.log('Endpoint:', `/users/${userId}/change-password`)

  try {
    // ✅ Payload đúng theo BE ChangePasswordRequest
    const payload = {
      oldPassword: form.oldPassword,
      newPassword: form.newPassword,
      confirmPassword: form.confirmPassword, // ✅ THÊM field này vì BE cần
    }

    console.log('Payload:', {
      ...payload,
      oldPassword: '***',
      newPassword: '***',
      confirmPassword: '***',
    })

    // ✅ Gọi API PUT /users/{id}/change-password
    const response = await axiosHttpClient.put(`/users/${userId}/change-password`, payload)

    console.log('✅ Change password API success:', response)

    // ✅ BE trả về ResponseUtils.success(null) nên chỉ cần không throw error là OK
    return response
  } catch (error: any) {
    console.error('❌ Change password API error:', error)

    // ✅ Enhanced error handling theo BE response
    if (error?.response?.status === 400) {
      // BE validation error hoặc sai mật khẩu
      const errorMessage = error.response?.data?.message || 'Mật khẩu hiện tại không đúng'
      throw new Error(errorMessage)
    } else if (error?.response?.status === 401) {
      throw new Error('Bạn không có quyền thay đổi mật khẩu')
    } else if (error?.response?.data?.message) {
      throw new Error(error.response.data.message)
    } else {
      throw new Error('Đổi mật khẩu thất bại, vui lòng thử lại')
    }
  }
}

// API để upload avatar
export const uploadAvatar = async (file: File): Promise<UploadAvatarResponse> => {
  const currentUser = getCurrentUser()
  if (!currentUser || !currentUser.userId) {
    throw new Error('Cannot get userId from current user token')
  }

  const formData = new FormData()
  formData.append('avatar', file)

  try {
    const response = await axiosHttpClient.post<IApiResponse<UploadAvatarResponse>>(
      `/users/${currentUser.userId}/avatar`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    console.log('✅ Upload avatar success:', response)
    return response.data || (response as any)
  } catch (error) {
    console.error('❌ Upload avatar error:', error)
    throw error
  }
}

// ================================
// USER MANAGEMENT APIs (NEW)
// ================================

/**
 * API để lấy tất cả users với pagination và filtering
 */
export async function getAllUsers(params?: UserSearchParams): Promise<PagedData<UserDto>> {
  console.log('=== GET ALL USERS ===')
  console.log('Search params:', params)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('API Base URL:', import.meta.env.VITE_API_URL)
  console.log('Full endpoint:', `${import.meta.env.VITE_API_URL}/users`)
  console.log('=====================')

  try {
    // ✅ Gọi API với params (nếu có)
    const response = await axiosHttpClient.get('/users', params ? { params } : undefined)

    console.log('✅ === DETAILED RESPONSE DEBUG ===')
    console.log('📦 Full response:', response)
    console.log('📊 Response type:', typeof response)
    console.log('🔧 Response constructor:', response?.constructor?.name)

    // ✅ Handle response structure chính xác theo BE
    if (response && isRecord(response)) {
      console.log('📋 Response properties:', Object.keys(response))

      // ✅ Case 1: Response theo format BE của bạn: { result: { page: {}, data: [] }, success: true }
      if (hasProperty(response, 'result') && response.result && isRecord(response.result)) {
        const result = response.result
        console.log('📋 Result properties:', Object.keys(result))

        if (
          hasProperty(result, 'data') &&
          hasProperty(result, 'page') &&
          Array.isArray(result.data) &&
          isRecord(result.page)
        ) {
          const users = result.data as UserDto[]
          const pageInfo = result.page as any

          console.log('✅ Parsed backend structure (result.data + result.page)')
          console.log('👥 Users count:', users.length)
          console.log('📄 Page info:', pageInfo)

          // ✅ Convert sang format PagedData
          const pagedData: PagedData<UserDto> = {
            content: users,
            totalElements: pageInfo.totalElements || users.length,
            totalPages: pageInfo.totalPages || 1,
            number: pageInfo.page || 0,
            size: pageInfo.size || users.length,
            first: (pageInfo.page || 0) === 0,
            last: (pageInfo.page || 0) + 1 >= (pageInfo.totalPages || 1),
            empty: users.length === 0,
          }

          console.log('✅ Converted PagedData:', pagedData)
          return pagedData
        }
      }

      // ✅ Case 2: Direct result structure { page: {}, data: [] }
      if (
        hasProperty(response, 'data') &&
        hasProperty(response, 'page') &&
        Array.isArray(response.data) &&
        isRecord(response.page)
      ) {
        const users = response.data as UserDto[]
        const pageInfo = response.page as any

        console.log('✅ Parsed direct structure (data + page)')

        return {
          content: users,
          totalElements: pageInfo.totalElements || users.length,
          totalPages: pageInfo.totalPages || 1,
          number: pageInfo.page || 0,
          size: pageInfo.size || users.length,
          first: (pageInfo.page || 0) === 0,
          last: (pageInfo.page || 0) + 1 >= (pageInfo.totalPages || 1),
          empty: users.length === 0,
        }
      }

      // ✅ Case 3: Standard Spring Pagination format
      if (hasProperty(response, 'content') && Array.isArray(response.content)) {
        console.log('✅ Parsed standard pagination structure')
        return response as PagedData<UserDto>
      }

      // ✅ Case 4: Direct array response
      if (hasProperty(response, 'data') && Array.isArray(response.data)) {
        console.log('✅ Parsed array response, creating mock pagination')
        const users = response.data as UserDto[]
        return {
          content: users,
          totalElements: users.length,
          totalPages: 1,
          number: 0,
          size: users.length,
          first: true,
          last: true,
          empty: users.length === 0,
        }
      }
    }

    // ✅ Case 5: Direct array response (backup)
    if (Array.isArray(response)) {
      console.log('✅ Direct array response')
      return {
        content: response as UserDto[],
        totalElements: response.length,
        totalPages: 1,
        number: 0,
        size: response.length,
        first: true,
        last: true,
        empty: response.length === 0,
      }
    }

    // ❌ Không parse được, return empty
    console.warn('⚠️ Unknown response structure, returning empty pagination')
    console.warn('📦 Raw response:', response)
    return emptyPagination()
  } catch (error: any) {
    console.error('❌ === GET ALL USERS ERROR ===')
    console.error('🚨 Error object:', error)
    console.error('📊 Error type:', typeof error)
    console.error('📝 Error message:', error?.message)

    // ✅ Chi tiết lỗi HTTP
    if (error?.response) {
      console.error('🌐 HTTP Error details:')
      console.error('  - Status:', error.response.status)
      console.error('  - Status text:', error.response.statusText)
      console.error('  - Data:', error.response.data)
      console.error('  - Headers:', error.response.headers)
    } else if (error?.request) {
      console.error('📡 Request error details:')
      console.error('  - Request:', error.request)
    }

    // ✅ Config details
    if (error?.config) {
      console.error('🔧 Request config:')
      console.error('  - URL:', error.config.url)
      console.error('  - Method:', error.config.method)
      console.error('  - Base URL:', error.config.baseURL)
      console.error('  - Headers:', error.config.headers)
      console.error('  - Params:', error.config.params)
    }

    console.error('=============================')

    // ✅ Return empty pagination instead of throwing
    return emptyPagination()
  }
}

// ✅ Hàm phụ tạo pagination rỗng
function emptyPagination(): PagedData<UserDto> {
  return {
    content: [],
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 0,
    first: true,
    last: true,
    empty: true,
  }
}

/**
 * API để tạo user mới
 * BE: POST /api/users
 */
export const createUser = async (request: CreateUserRequest): Promise<UserDto> => {
  console.log('=== CREATE USER ===')
  console.log('Request:', { ...request, password: '***' })
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('Full endpoint:', `${import.meta.env.VITE_API_URL}/users`)
  console.log('===================')

  try {
    const response = await axiosHttpClient.post('/users', request)
    console.log('✅ Create user success:', response)

    // ✅ Handle response structure theo BE format: { result: UserDto, success: true }
    if (response && isRecord(response)) {
      // Case 1: { result: UserDto, success: true }
      if (hasProperty(response, 'result') && response.result && isRecord(response.result)) {
        const userData = response.result as UserDto
        console.log('✅ Parsed result structure:', userData)
        return userData
      }

      // Case 2: Direct UserDto response
      if (isValidUser(response)) {
        console.log('✅ Direct UserDto response')
        return response
      }
    }

    console.error('❌ Invalid create user response structure:', response)
    throw new Error('Invalid response format')
  } catch (error: any) {
    console.error('❌ Create user error:', error)

    // ✅ Enhanced error handling
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message)
    } else if (error?.message) {
      throw new Error(error.message)
    } else {
      throw new Error('Không thể tạo người dùng')
    }
  }
}

/**
 * API để lấy user theo ID
 * BE: GET /api/users/{id}
 */
export const getUserById = async (id: string): Promise<UserDto> => {
  console.log('=== GET USER BY ID ===')
  console.log('User ID:', id)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('Full endpoint:', `${import.meta.env.VITE_API_URL}/users/${id}`)
  console.log('======================')

  try {
    const response = await axiosHttpClient.get(`/users/${id}`)
    console.log('✅ Get user by ID success:', response)

    // ✅ Handle response structure theo BE format
    if (response && isRecord(response)) {
      // Case 1: { result: UserDto, success: true }
      if (hasProperty(response, 'result') && response.result && isRecord(response.result)) {
        const userData = response.result as UserDto
        console.log('✅ Parsed result structure:', userData)
        return userData
      }

      // Case 2: Direct UserDto response
      if (isValidUser(response)) {
        console.log('✅ Direct UserDto response')
        return response
      }
    }

    console.error('❌ Invalid get user response structure:', response)
    throw new Error('Invalid response format')
  } catch (error: any) {
    console.error('❌ Get user by ID error:', error)

    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message)
    } else if (error?.message) {
      throw new Error(error.message)
    } else {
      throw new Error('Không thể lấy thông tin người dùng')
    }
  }
}

/**
 * API để cập nhật user
 * BE: PUT /api/users/{id}
 */
export const updateUser = async (id: string, request: UpdateUserRequest): Promise<UserDto> => {
  console.log('=== UPDATE USER ===')
  console.log('User ID:', id)
  console.log('Request:', { ...request, password: request.password ? '***' : undefined })
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('Full endpoint:', `${import.meta.env.VITE_API_URL}/users/${id}`)
  console.log('===================')

  try {
    const response = await axiosHttpClient.put(`/users/${id}`, request)
    console.log('✅ Update user success:', response)

    // ✅ Handle response structure theo BE format
    if (response && isRecord(response)) {
      // Case 1: { result: UserDto, success: true }
      if (hasProperty(response, 'result') && response.result && isRecord(response.result)) {
        const userData = response.result as UserDto
        console.log('✅ Parsed result structure:', userData)
        return userData
      }

      // Case 2: Direct UserDto response
      if (isValidUser(response)) {
        console.log('✅ Direct UserDto response')
        return response
      }
    }

    console.error('❌ Invalid update user response structure:', response)
    throw new Error('Invalid response format')
  } catch (error: any) {
    console.error('❌ Update user error:', error)

    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message)
    } else if (error?.message) {
      throw new Error(error.message)
    } else {
      throw new Error('Không thể cập nhật người dùng')
    }
  }
}

/**
 * API để xóa user
 * BE: DELETE /api/users/{id}
 */
export const deleteUser = async (id: string): Promise<void> => {
  console.log('=== DELETE USER ===')
  console.log('User ID:', id)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('Full endpoint:', `${import.meta.env.VITE_API_URL}/users/${id}`)
  console.log('===================')

  try {
    const response = await axiosHttpClient.delete(`/users/${id}`)
    console.log('✅ Delete user success:', response)

    // ✅ BE trả về: ResponseUtils.success(null, "User deleted successfully")
    // Không cần check response structure cho delete, chỉ cần không throw error là thành công
    return
  } catch (error: any) {
    console.error('❌ Delete user error:', error)

    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message)
    } else if (error?.message) {
      throw new Error(error.message)
    } else {
      throw new Error('Không thể xóa người dùng')
    }
  }
}

/**
 * API để gán role cho user
 * BE: POST /api/users/{userId}/roles/{roleId}
 */
export const assignRole = async (userId: string, roleId: string): Promise<UserDto> => {
  console.log('=== ASSIGN ROLE ===')
  console.log('User ID:', userId)
  console.log('Role ID:', roleId)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('Full endpoint:', `${import.meta.env.VITE_API_URL}/users/${userId}/roles/${roleId}`)
  console.log('===================')

  try {
    const response = await axiosHttpClient.post(`/users/${userId}/roles/${roleId}`)
    console.log('✅ Assign role success:', response)

    // ✅ Handle response structure theo BE format
    if (response && isRecord(response)) {
      // Case 1: { result: UserDto, success: true }
      if (hasProperty(response, 'result') && response.result && isRecord(response.result)) {
        const userData = response.result as UserDto
        console.log('✅ Parsed result structure:', userData)
        console.log('👤 Updated user roles:', userData.roles)
        return userData
      }

      // Case 2: Direct UserDto response
      if (isValidUser(response)) {
        console.log('✅ Direct UserDto response')
        console.log('👤 User roles:', response.roles)
        return response
      }
    }

    console.error('❌ Invalid assign role response structure:', response)
    throw new Error('Invalid response format')
  } catch (error: any) {
    console.error('❌ Assign role error:', error)

    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message)
    } else if (error?.message) {
      throw new Error(error.message)
    } else {
      throw new Error('Không thể gán vai trò')
    }
  }
}

export const getAllRoles = async (): Promise<Role[]> => {
  console.log('=== GET ALL ROLES ===')
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('Full endpoint:', `${import.meta.env.VITE_API_URL}/roles`)
  console.log('=====================')

  try {
    const response = await axiosHttpClient.get('/roles')
    console.log('✅ Get all roles success:', response)

    // ✅ Case 1: { result: { data: Role[] } }
    if (
      response &&
      isRecord(response) &&
      hasProperty(response, 'result') &&
      isRecord(response.result) &&
      Array.isArray(response.result.data)
    ) {
      const roles = response.result.data as Role[]
      console.log('✅ Parsed roles from result.data:', roles)
      return roles
    }

    // ✅ Case 2: { result: Role[] }
    if (
      response &&
      isRecord(response) &&
      hasProperty(response, 'result') &&
      Array.isArray(response.result)
    ) {
      const roles = response.result as Role[]
      console.log('✅ Parsed roles from result:', roles)
      return roles
    }

    // ✅ Case 3: { data: Role[] }
    if (
      response &&
      isRecord(response) &&
      hasProperty(response, 'data') &&
      Array.isArray(response.data)
    ) {
      const roles = response.data as Role[]
      console.log('✅ Parsed roles from data:', roles)
      return roles
    }

    // ✅ Case 4: Direct array
    if (Array.isArray(response)) {
      console.log('✅ Direct array response')
      return response as Role[]
    }

    console.error('❌ Invalid get roles response structure:', response)
    return []
  } catch (error: any) {
    console.error('❌ Get all roles error:', error)
    return []
  }
}
/**
 * ✅ THÊM MỚI - API để tạo role mới
 * BE: POST /api/roles
 */
export const createRole = async (request: RoleRequest): Promise<Role> => {
  console.log('=== CREATE ROLE ===')
  console.log('Request:', request)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('Full endpoint:', `${import.meta.env.VITE_API_URL}/roles`)
  console.log('===================')

  try {
    const response = await axiosHttpClient.post('/roles', request)
    console.log('✅ Create role success:', response)

    // ✅ Handle response structure theo BE format: { result: RoleDto, success: true }
    if (response && isRecord(response)) {
      // Case 1: { result: RoleDto, success: true }
      if (hasProperty(response, 'result') && response.result && isRecord(response.result)) {
        const roleData = response.result as Role
        console.log('✅ Parsed result structure:', roleData)
        return roleData
      }

      // Case 2: Direct RoleDto response
      if (
        hasProperty(response, 'id') &&
        hasProperty(response, 'name') &&
        hasProperty(response, 'description')
      ) {
        console.log('✅ Direct RoleDto response')
        return response as Role
      }
    }

    console.error('❌ Invalid create role response structure:', response)
    throw new Error('Invalid response format')
  } catch (error: any) {
    console.error('❌ Create role error:', error)

    // ✅ Enhanced error handling
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message)
    } else if (error?.message) {
      throw new Error(error.message)
    } else {
      throw new Error('Không thể tạo vai trò mới')
    }
  }
}
/**
 * API để gỡ role khỏi user
 * BE: DELETE /api/users/{userId}/roles/{roleId}
 */
export const removeRole = async (userId: string, roleName: string): Promise<UserDto> => {
  console.log('=== REMOVE ROLE ===')
  console.log('User ID:', userId)
  console.log('Role ID:', roleName)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('Full endpoint:', `${import.meta.env.VITE_API_URL}/users/${userId}/roles/${roleName}`)
  console.log('===================')

  try {
    const response = await axiosHttpClient.delete(`/users/${userId}/roles/${roleName}`)
    console.log('✅ Remove role success:', response)

    // ✅ Handle response structure theo BE format
    if (response && isRecord(response)) {
      // Case 1: { result: UserDto, success: true }
      if (hasProperty(response, 'result') && response.result && isRecord(response.result)) {
        const userData = response.result as UserDto
        console.log('✅ Parsed result structure:', userData)
        console.log('👤 Updated user roles:', userData.roles)
        return userData
      }

      // Case 2: Direct UserDto response
      if (isValidUser(response)) {
        console.log('✅ Direct UserDto response')
        console.log('👤 User roles:', response.roles)
        return response
      }
    }

    console.error('❌ Invalid remove role response structure:', response)
    throw new Error('Invalid response format')
  } catch (error: any) {
    console.error('❌ Remove role error:', error)

    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message)
    } else if (error?.message) {
      throw new Error(error.message)
    } else {
      throw new Error('Không thể gỡ vai trò')
    }
  }
}

// ================================
// HELPER FUNCTIONS
// ================================

/**
 * Enhanced validation function với detailed errors
 */
export const validateUserRequest = (request: CreateUserRequest | UpdateUserRequest): string[] => {
  const errors: string[] = []

  console.log('=== VALIDATE USER REQUEST ===')
  console.log('Request type:', 'password' in request ? 'Create' : 'Update')

  // Email validation
  if (!request.email?.trim()) {
    errors.push('Email là bắt buộc')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email)) {
    errors.push('Email không hợp lệ')
  }

  // Username validation
  if (!request.username?.trim()) {
    errors.push('Tên đăng nhập là bắt buộc')
  } else if (request.username.length < 3) {
    errors.push('Tên đăng nhập phải có ít nhất 3 ký tự')
  }

  // Name validation
  if (!request.firstName?.trim()) {
    errors.push('Họ là bắt buộc')
  }

  if (!request.lastName?.trim()) {
    errors.push('Tên là bắt buộc')
  }

  // Password validation (chỉ cho create hoặc update có password)
  if ('password' in request && request.password) {
    if (request.password.length < 6) {
      errors.push('Mật khẩu phải có ít nhất 6 ký tự')
    }
  }

  // Phone validation
  if (request.phoneNumber && !/^[0-9]{10,11}$/.test(request.phoneNumber)) {
    errors.push('Số điện thoại không hợp lệ (10-11 chữ số)')
  }

  console.log('Validation errors:', errors)
  console.log('==============================')

  return errors
}

/**
 * Helper để format user display name
 */
export const formatUserDisplayName = (user: UserDto): string => {
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim()
  return fullName || user.username || user.email || 'Unknown User'
}

/**
 * Helper để format user status
 */
export const formatUserStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    ACTIVE: 'Hoạt động',
    INACTIVE: 'Tạm khóa',
    BANNED: 'Đã cấm',
  }
  return statusMap[status] || status
}

/**
 * Helper để get user initials
 */
export const getUserInitials = (user: UserDto): string => {
  const first = user.firstName?.charAt(0) || ''
  const last = user.lastName?.charAt(0) || ''

  if (first && last) {
    return `${first}${last}`.toUpperCase()
  }

  return user.username?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'
}
/**
 * ✅ THÊM MỚI - Validation function cho RoleRequest
 */
export const validateRoleRequest = (request: RoleRequest): string[] => {
  const errors: string[] = []

  console.log('=== VALIDATE ROLE REQUEST ===')
  console.log('Request:', request)

  // Name validation
  if (!request.name?.trim()) {
    errors.push('Tên vai trò là bắt buộc')
  } else if (request.name.length < 2) {
    errors.push('Tên vai trò phải có ít nhất 2 ký tự')
  } else if (request.name.length > 50) {
    errors.push('Tên vai trò không được vượt quá 50 ký tự')
  }

  // Description validation
  if (!request.description?.trim()) {
    errors.push('Mô tả vai trò là bắt buộc')
  } else if (request.description.length > 255) {
    errors.push('Mô tả vai trò không được vượt quá 255 ký tự')
  }

  console.log('Validation errors:', errors)
  console.log('==============================')

  return errors
}

/**
 * ✅ THÊM MỚI - Helper để format role name
 */
export const formatRoleName = (name: string): string => {
  const roleNameMap: Record<string, string> = {
    ADMIN: 'Quản trị viên',
    MANAGER: 'Quản lý',
    CLIENT: 'Khách hàng',
    CUSTOMER: 'Khách hàng',
    STAFF: 'Nhân viên',
  }
  return roleNameMap[name] || name
}

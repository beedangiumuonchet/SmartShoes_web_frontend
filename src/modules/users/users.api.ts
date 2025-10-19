import { AxiosHttpClient } from '@/common/utils/axios'
import type { IApiResponse } from '@/common/types'
import { useCookies } from '@vueuse/integrations/useCookies'
import { getCurrentUser } from '@/common/guards/roleGuard.guard'
import {
  type UserProfile,
  UpdateProfileForm,
  ChangePasswordForm,
  type UploadAvatarResponse,
} from './users.type'

const axiosHttpClient = new AxiosHttpClient(import.meta.env.VITE_API_URL)
const cookie = useCookies(['jwt_token'])

// API để lấy thông tin profile hiện tại
export const getMyProfile = async () => {
  // SỬA: Debug token từ cookie với key đúng
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

  // SỬA: Lấy userId từ getCurrentUser()
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
      `/users/${userId}`, // Dùng userId từ getCurrentUser()
      form,
    )
    console.log('✅ Update profile success:', response)
    return response
  } catch (error) {
    console.error('❌ Update profile error:', error)

    // Log thêm chi tiết nếu có lỗi
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

// API để đổi mật khẩu
export const changePassword = async (form: ChangePasswordForm) => {
  console.log('=== CHANGE PASSWORD ===')
  console.log('Form has currentPassword:', !!form.currentPassword)
  console.log('Form has newPassword:', !!form.newPassword)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('=======================')

  try {
    const response = await axiosHttpClient.put<IApiResponse<void>, ChangePasswordForm>(
      '/v1/auth/change-password',
      form,
    )
    console.log('✅ Change password success:', response)
    return response
  } catch (error) {
    console.error('❌ Change password error:', error)
    throw error
  }
}

// SỬA: Thêm API để upload avatar với getCurrentUser()
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

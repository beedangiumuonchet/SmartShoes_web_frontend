import { AxiosHttpClient } from '@/common/utils/axios'
import type { IApiResponse } from '@/common/types'
import { getCurrentUser } from '@/common/guards/roleGuard.guard'
import { useCookies } from '@vueuse/integrations/useCookies'
import {
  type Address,
  AddressForm,
  type CreateAddressResponse,
  type UpdateAddressResponse,
  type GetUserAddressesResponse,
} from './addresses.type'

const axiosHttpClient = new AxiosHttpClient(import.meta.env.VITE_API_URL)
const cookie = useCookies(['jwt_token'])

// API để lấy danh sách địa chỉ của user
export const getUserAddresses = async (userId?: string) => {
  console.log('=== GET USER ADDRESSES ===')

  // Nếu không truyền userId, lấy từ getCurrentUser
  const currentUser = getCurrentUser()
  const targetUserId = userId || currentUser?.userId

  if (!targetUserId) {
    throw new Error('Cannot get userId from current user token')
  }

  console.log('Target userId:', targetUserId)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('Endpoint:', `/addresses/users/${targetUserId}`)
  console.log('==========================')

  try {
    // SỬA: BE trả về mảng addresses, có thể wrap trong ResponseUtils.success()
    const response = await axiosHttpClient.get(`/addresses/users/${targetUserId}`)
    console.log('✅ Get user addresses success:', response)

    // Handle BE response structure tương tự như users.api.ts
    if (response && typeof response === 'object') {
      // Case 1: Direct array response
      if (Array.isArray(response)) {
        return response as Address[]
      }
      // Case 2: Wrapped in data property
      else if ('data' in response && Array.isArray(response.data)) {
        return response.data as Address[]
      }
      // Case 3: Wrapped in result property
      else if ('result' in response && Array.isArray(response.result)) {
        return response.result as Address[]
      }
      // Case 4: Has success flag
      else if ('success' in response && response.success) {
        if ('data' in response && Array.isArray(response.data)) {
          return response.data as Address[]
        } else if ('result' in response && Array.isArray(response.result)) {
          return response.result as Address[]
        }
      }
      // Case 5: ResponseUtils.success() format
      else if ('message' in response && 'data' in response) {
        if (Array.isArray(response.data)) {
          return response.data as Address[]
        }
      }
    }

    // Fallback
    return []
  } catch (error) {
    console.error('❌ Get user addresses error:', error)
    throw error
  }
}

// API để tạo địa chỉ mới
export const createAddress = async (form: AddressForm, userId?: string) => {
  console.log('=== CREATE ADDRESS ===')
  console.log('Form data:', form)

  // Nếu không truyền userId, lấy từ getCurrentUser
  const currentUser = getCurrentUser()
  const targetUserId = userId || currentUser?.userId

  if (!targetUserId) {
    throw new Error('Cannot get userId from current user token')
  }

  console.log('Target userId:', targetUserId)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('======================')

  try {
    // SỬA: Không dùng generic type phức tạp
    const response = await axiosHttpClient.post(`/addresses/users/${targetUserId}`, form)
    console.log('✅ Create address success:', response)

    // Handle BE response structure
    if (response && typeof response === 'object') {
      // Case 1: Direct address response
      if ('id' in response && 'fullName' in response) {
        return response as Address
      }
      // Case 2: Wrapped in data property
      else if ('data' in response && response.data) {
        return response.data as Address
      }
      // Case 3: Wrapped in result property
      else if ('result' in response && response.result) {
        return response.result as Address
      }
      // Case 4: Has success flag
      else if ('success' in response && response.success) {
        if ('data' in response) {
          return response.data as Address
        } else if ('result' in response) {
          return response.result as Address
        }
      }
      // Case 5: ResponseUtils.success() format
      else if ('message' in response && 'data' in response) {
        return response.data as Address
      }
    }

    throw new Error('Invalid response structure')
  } catch (error) {
    console.error('❌ Create address error:', error)

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

// API để cập nhật địa chỉ
export const updateAddress = async (addressId: string, form: AddressForm) => {
  console.log('=== UPDATE ADDRESS ===')
  console.log('Address ID:', addressId)
  console.log('Form data:', form)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('======================')

  try {
    // SỬA: Không dùng generic type phức tạp
    const response = await axiosHttpClient.put(`/addresses/${addressId}`, form)
    console.log('✅ Update address success:', response)

    // Handle BE response structure tương tự createAddress
    if (response && typeof response === 'object') {
      // Case 1: Direct address response
      if ('id' in response && 'fullName' in response) {
        return response as Address
      }
      // Case 2: Wrapped in data property
      else if ('data' in response && response.data) {
        return response.data as Address
      }
      // Case 3: Wrapped in result property
      else if ('result' in response && response.result) {
        return response.result as Address
      }
      // Case 4: Has success flag
      else if ('success' in response && response.success) {
        if ('data' in response) {
          return response.data as Address
        } else if ('result' in response) {
          return response.result as Address
        }
      }
      // Case 5: ResponseUtils.success() format
      else if ('message' in response && 'data' in response) {
        return response.data as Address
      }
    }

    throw new Error('Invalid response structure')
  } catch (error) {
    console.error('❌ Update address error:', error)

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

// API để xóa địa chỉ
export const deleteAddress = async (addressId: string) => {
  console.log('=== DELETE ADDRESS ===')
  console.log('Address ID:', addressId)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('======================')

  try {
    // SỬA: Delete thường trả về void hoặc success message
    const response = await axiosHttpClient.delete(`/addresses/${addressId}`)
    console.log('✅ Delete address success:', response)
    return response
  } catch (error) {
    console.error('❌ Delete address error:', error)
    throw error
  }
}

// API để đặt địa chỉ mặc định
export const setDefaultAddress = async (addressId: string) => {
  console.log('=== SET DEFAULT ADDRESS ===')
  console.log('Address ID:', addressId)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('===========================')

  try {
    // SỬA: Không dùng generic type phức tạp
    const response = await axiosHttpClient.put(`/addresses/${addressId}/default`)
    console.log('✅ Set default address success:', response)

    // Handle BE response structure tương tự updateAddress
    if (response && typeof response === 'object') {
      // Case 1: Direct address response
      if ('id' in response && 'fullName' in response) {
        return response as Address
      }
      // Case 2: Wrapped in data property
      else if ('data' in response && response.data) {
        return response.data as Address
      }
      // Case 3: Wrapped in result property
      else if ('result' in response && response.result) {
        return response.result as Address
      }
      // Case 4: Has success flag
      else if ('success' in response && response.success) {
        if ('data' in response) {
          return response.data as Address
        } else if ('result' in response) {
          return response.result as Address
        }
      }
      // Case 5: ResponseUtils.success() format
      else if ('message' in response && 'data' in response) {
        return response.data as Address
      }
    }

    throw new Error('Invalid response structure')
  } catch (error) {
    console.error('❌ Set default address error:', error)
    throw error
  }
}

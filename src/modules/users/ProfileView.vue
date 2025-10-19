<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentUser } from '@/common/guards/roleGuard.guard'
import { useCookies } from '@vueuse/integrations/useCookies'
import { getMyProfile, updateMyProfile, changePassword } from './users.api'
import { type UserProfile, UpdateProfileForm, ChangePasswordForm } from './users.type'
import {
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '@/modules/addresses/addresses.api'
import { type Address, AddressForm } from '@/modules/addresses/addresses.type'

const router = useRouter()
const cookie = useCookies(['jwt_token'])

// Reactive data
const profile = ref<UserProfile | null>(null)
const loading = ref(true)
const error = ref('')
const activeTab = ref('profile')

// Profile editing
const editingProfile = ref(false)
const savingProfile = ref(false)
const profileForm = ref(new UpdateProfileForm())

// Password changing
const changingPassword = ref(false)
const passwordForm = ref(new ChangePasswordForm('', '', ''))

// THÊM: Address management
const addresses = ref<Address[]>([])
const loadingAddresses = ref(false)
const showAddressForm = ref(false)
const editingAddress = ref<Address | null>(null)
const savingAddress = ref(false)
const addressForm = ref(new AddressForm())

// UI state
const showSuccessToast = ref(false)
const successMessage = ref('')
const showNoticeToast = ref(false)
const noticeMessage = ref('')

// Computed
const currentUser = computed(() => getCurrentUser())

// SỬA: Computed để tạo fullName từ firstName + lastName
const displayName = computed(() => {
  if (!profile.value) return 'Người dùng'

  if (profile.value.firstName && profile.value.lastName) {
    return `${profile.value.firstName} ${profile.value.lastName}`
  }

  if (profile.value.firstName) {
    return profile.value.firstName
  }

  if (profile.value.lastName) {
    return profile.value.lastName
  }

  if (profile.value.username) {
    return profile.value.username
  }

  return 'Người dùng'
})

// SỬA: Fix userRoles computed để handle UserRole[] array
const userRoles = computed(() => {
  if (!profile.value?.roles || profile.value.roles.length === 0) {
    return 'Chưa có vai trò'
  }

  // Handle array of UserRole objects
  return profile.value.roles.map((role) => role.name).join(', ')
})

const tokenExpiry = computed(() => {
  if (!profile.value?.exp) return 'Chưa xác định'
  const expiryDate = new Date(profile.value.exp * 1000) // Convert from Unix timestamp
  return expiryDate.toLocaleString('vi-VN')
})

const tokenIssuedAt = computed(() => {
  if (!profile.value?.iat) return 'Chưa xác định'
  const issuedDate = new Date(profile.value.iat * 1000) // Convert from Unix timestamp
  return issuedDate.toLocaleString('vi-VN')
})

// Tabs configuration
const tabs = ref([
  {
    id: 'profile',
    label: 'Thông tin cá nhân',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
  {
    id: 'security',
    label: 'Bảo mật',
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  },
  {
    id: 'addresses',
    label: 'Địa chỉ',
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
  },
])

// Helper để check token từ cookie
const checkAuthToken = () => {
  const token = cookie.get('jwt_token')
  console.log('=== TOKEN CHECK ===')
  console.log('jwt_token exists:', !!token)
  console.log('jwt_token preview:', token ? `${token.substring(0, 50)}...` : 'NOT_FOUND')
  console.log('===================')
  return token
}

// Main loadProfile function với cookie
const loadProfile = async () => {
  try {
    loading.value = true
    error.value = ''

    // Check token từ cookie trước
    const token = checkAuthToken()
    if (!token) {
      error.value = 'Không tìm thấy token đăng nhập. Vui lòng đăng nhập lại.'
      console.error('❌ No jwt_token found in cookie')
      router.push('/login')
      return
    }

    console.log('✅ Token found, calling getMyProfile API...')
    const response = await getMyProfile()

    console.log('=== PROFILE RESPONSE HANDLING ===')
    console.log('Response type:', typeof response)
    console.log('Response:', response)
    if (response && typeof response === 'object') {
      console.log('Response keys:', Object.keys(response))
    }
    console.log('=================================')

    // SỬA: Handle BE response structure với userId, username, firstName, lastName
    if (response && typeof response === 'object') {
      // Case 1: Direct response from BE với userId, username, etc.
      if ('userId' in response && 'username' in response && 'email' in response) {
        profile.value = response as UserProfile
        console.log('✅ Profile loaded (direct BE response):', profile.value)
      }
      // Case 2: Wrapped in data property
      else if ('data' in response && response.data) {
        if ('userId' in response.data && 'username' in response.data) {
          profile.value = response.data as UserProfile
          console.log('✅ Profile loaded (from data property):', profile.value)
        } else {
          console.error('❌ Data property exists but missing required fields')
          error.value = 'Dữ liệu response không đúng định dạng'
        }
      }
      // Case 3: Wrapped in result property
      else if ('result' in response && response.result) {
        if ('userId' in response.result && 'username' in response.result) {
          profile.value = response.result as UserProfile
          console.log('✅ Profile loaded (from result property):', profile.value)
        } else {
          console.error('❌ Result property exists but missing required fields')
          error.value = 'Dữ liệu response không đúng định dạng'
        }
      }
      // Case 4: Has success flag
      else if ('success' in response && response.success) {
        if ('data' in response && response.data) {
          profile.value = response.data as UserProfile
        } else if ('result' in response && response.result) {
          profile.value = response.result as UserProfile
        } else {
          console.error('❌ Success response but no data/result')
          error.value = 'Response thành công nhưng không có dữ liệu'
        }
        console.log('✅ Profile loaded (from success wrapper):', profile.value)
      } else {
        error.value = 'Cấu trúc response không đúng định dạng'
        console.error('❌ Unknown response structure:', response)
        console.error('Available keys:', Object.keys(response))
        console.error('Expected: userId, username, email, firstName, lastName, roles, iat, exp')
      }
    } else {
      error.value = 'Response không hợp lệ'
      console.error('❌ Invalid response type:', typeof response)
    }
  } catch (err: any) {
    console.error('❌ Load profile error:', err)

    // Handle different error types
    if (err.response) {
      const status = err.response.status
      const errorData = err.response.data
      const message = errorData?.message || err.message

      console.log('HTTP Error details:', {
        status,
        url: err.config?.url,
        method: err.config?.method,
        message,
        data: errorData,
      })

      if (status === 401) {
        error.value = 'Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.'
        cookie.remove('jwt_token')
        router.push('/login')
      } else if (status === 403) {
        error.value = 'Bạn không có quyền truy cập thông tin này.'
      } else if (status === 500) {
        error.value = `Lỗi server: ${message}. Vui lòng thử lại sau.`
      } else {
        error.value = `Lỗi HTTP ${status}: ${message}`
      }
    } else if (err.code === 'NETWORK_ERROR') {
      error.value = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.'
    } else {
      error.value = err.message || 'Đã xảy ra lỗi không xác định'
    }
  } finally {
    loading.value = false
  }
}

// THÊM: Load addresses function
const loadAddresses = async () => {
  if (!profile.value?.userId) return

  try {
    loadingAddresses.value = true
    console.log('Loading addresses for user:', profile.value.userId)

    const response = await getUserAddresses(profile.value.userId)

    if (response && typeof response === 'object') {
      // Handle response patterns similar to profile
      if (Array.isArray(response)) {
        addresses.value = response
      } else if ('data' in response && Array.isArray(response.data)) {
        addresses.value = response.data
      } else if ('result' in response && Array.isArray(response.result)) {
        addresses.value = response.result
      } else if ('success' in response && response.success) {
        if ('data' in response && Array.isArray(response.data)) {
          addresses.value = response.data
        } else if ('result' in response && Array.isArray(response.result)) {
          addresses.value = response.result
        }
      } else {
        console.warn('Unknown address response structure:', response)
        addresses.value = []
      }
    } else {
      addresses.value = []
    }

    console.log('✅ Addresses loaded:', addresses.value)
  } catch (err: any) {
    console.error('❌ Load addresses error:', err)
    addresses.value = []
    showNotice('Không thể tải danh sách địa chỉ: ' + (err.message || 'Lỗi không xác định'))
  } finally {
    loadingAddresses.value = false
  }
}

// SỬA: Update startEditProfile để dùng firstName và lastName
const startEditProfile = () => {
  editingProfile.value = true
  profileForm.value = new UpdateProfileForm(
    profile.value?.email || '',
    profile.value?.username || '',
    profile.value?.firstName || '',
    profile.value?.lastName || '',
    profile.value?.phoneNumber || '',
    profile.value?.gender,
    profile.value?.birthday || '',
  )
}

const cancelEditProfile = () => {
  editingProfile.value = false
  profileForm.value = new UpdateProfileForm()
}

const saveProfile = async () => {
  try {
    savingProfile.value = true

    const response = await updateMyProfile(profileForm.value)

    if (response && typeof response === 'object') {
      // Handle response patterns similar to loadProfile
      if ('userId' in response && 'username' in response) {
        profile.value = response as UserProfile
      } else if ('data' in response && response.data) {
        profile.value = response.data as UserProfile
      } else if ('result' in response && response.result) {
        profile.value = response.result as UserProfile
      } else if ('success' in response && response.success) {
        if ('data' in response) {
          profile.value = response.data as UserProfile
        } else if ('result' in response) {
          profile.value = response.result as UserProfile
        }
      } else {
        throw new Error('Invalid response structure')
      }

      editingProfile.value = false
      showSuccess('Cập nhật thông tin thành công!')
    } else {
      throw new Error('Invalid response')
    }
  } catch (err: any) {
    console.error('Update profile error:', err)

    if (err.response?.status === 401) {
      error.value = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
      cookie.remove('jwt_token')
      router.push('/login')
    } else {
      error.value = err.message || 'Đã xảy ra lỗi khi cập nhật thông tin'
    }
  } finally {
    savingProfile.value = false
  }
}

// THÊM: Address management functions
const startCreateAddress = () => {
  editingAddress.value = null
  addressForm.value = new AddressForm()
  showAddressForm.value = true
}

const startEditAddress = (address: Address) => {
  editingAddress.value = address
  addressForm.value = new AddressForm(
    address.fullName,
    address.phone,
    address.street,
    address.ward,
    address.city,
    address.isDefault,
  )
  showAddressForm.value = true
}

const cancelAddressForm = () => {
  showAddressForm.value = false
  editingAddress.value = null
  addressForm.value = new AddressForm()
}

const saveAddress = async () => {
  try {
    savingAddress.value = true

    // Validate required fields
    if (
      !addressForm.value.fullName ||
      !addressForm.value.phone ||
      !addressForm.value.street ||
      !addressForm.value.ward ||
      !addressForm.value.city
    ) {
      showNotice('Vui lòng điền đầy đủ thông tin địa chỉ!')
      return
    }

    let response
    if (editingAddress.value) {
      // Update existing address
      response = await updateAddress(editingAddress.value.id, addressForm.value)
    } else {
      // Create new address
      response = await createAddress(addressForm.value, profile.value?.userId)
    }

    if (response) {
      showAddressForm.value = false
      editingAddress.value = null
      addressForm.value = new AddressForm()

      // Reload addresses
      await loadAddresses()

      showSuccess(
        editingAddress.value ? 'Cập nhật địa chỉ thành công!' : 'Thêm địa chỉ thành công!',
      )
    }
  } catch (err: any) {
    console.error('Save address error:', err)
    showNotice('Lỗi khi lưu địa chỉ: ' + (err.message || 'Lỗi không xác định'))
  } finally {
    savingAddress.value = false
  }
}

const handleDeleteAddress = async (addressId: string) => {
  if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return

  try {
    await deleteAddress(addressId)
    await loadAddresses()
    showSuccess('Xóa địa chỉ thành công!')
  } catch (err: any) {
    console.error('Delete address error:', err)
    showNotice('Lỗi khi xóa địa chỉ: ' + (err.message || 'Lỗi không xác định'))
  }
}

const handleSetDefaultAddress = async (addressId: string) => {
  try {
    await setDefaultAddress(addressId)
    await loadAddresses()
    showSuccess('Đặt địa chỉ mặc định thành công!')
  } catch (err: any) {
    console.error('Set default address error:', err)
    showNotice('Lỗi khi đặt địa chỉ mặc định: ' + (err.message || 'Lỗi không xác định'))
  }
}

const changeUserPassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    showNotice('Mật khẩu xác nhận không khớp!')
    return
  }

  try {
    changingPassword.value = true

    const response = await changePassword(passwordForm.value)

    if (response) {
      passwordForm.value = new ChangePasswordForm('', '', '')
      showSuccess('Đổi mật khẩu thành công!')
    } else {
      throw new Error('Invalid response')
    }
  } catch (err: any) {
    console.error('Change password error:', err)

    if (err.response?.status === 401) {
      error.value = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
      cookie.remove('jwt_token')
      router.push('/login')
    } else {
      error.value = err.message || 'Đã xảy ra lỗi khi đổi mật khẩu'
    }
  } finally {
    changingPassword.value = false
  }
}

// Retry và helper functions
const retryLoadProfile = () => {
  error.value = ''
  loadProfile()
}

const forceRefresh = () => {
  profile.value = null
  error.value = ''
  loadProfile()
}

const showUploadNotice = () => {
  showNotice('Chức năng upload avatar đang được phát triển!')
}

const showSuccess = (message: string) => {
  successMessage.value = message
  showSuccessToast.value = true
  setTimeout(() => {
    showSuccessToast.value = false
  }, 3000)
}

const showNotice = (message: string) => {
  noticeMessage.value = message
  showNoticeToast.value = true
  setTimeout(() => {
    showNoticeToast.value = false
  }, 3000)
}

const getGenderText = (gender?: string) => {
  switch (gender) {
    case 'MALE':
      return 'Nam'
    case 'FEMALE':
      return 'Nữ'
    case 'OTHER':
      return 'Khác'
    default:
      return 'Chưa cập nhật'
  }
}

const getStatusText = (status?: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'Hoạt động'
    case 'INACTIVE':
      return 'Không hoạt động'
    case 'BANNED':
      return 'Bị cấm'
    default:
      return 'Chưa xác định'
  }
}

const getStatusClass = (status?: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800'
    case 'INACTIVE':
      return 'bg-yellow-100 text-yellow-800'
    case 'BANNED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatDate = (date?: string) => {
  if (!date) return 'Chưa cập nhật'
  return new Date(date).toLocaleDateString('vi-VN')
}

// THÊM: Watch activeTab để load addresses khi chuyển tab
import { watch } from 'vue'
watch(activeTab, (newTab) => {
  if (newTab === 'addresses' && profile.value?.userId) {
    loadAddresses()
  }
})

// Lifecycle
onMounted(() => {
  loadProfile()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <button
                @click="router.back()"
                class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg
                  class="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div>
                <h1 class="text-2xl font-bold text-gray-900">Thông tin cá nhân</h1>
                <p class="text-sm text-gray-500 mt-1">Quản lý thông tin tài khoản của bạn</p>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <button
                @click="forceRefresh"
                :disabled="loading"
                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  :class="{ 'animate-spin': loading }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Làm mới
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="text-center">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
          ></div>
          <p class="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <div class="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
          <div
            class="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full"
          >
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-red-800 mb-2">Có lỗi xảy ra</h3>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <button
            @click="retryLoadProfile"
            class="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Thử lại
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <!-- Profile Card -->
            <div class="p-6 text-center bg-gradient-to-r from-blue-500 to-purple-600">
              <div class="relative inline-block">
                <div
                  class="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
                >
                  <svg class="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <button
                  @click="showUploadNotice"
                  class="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <svg
                    class="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </div>
              <h3 class="text-lg font-semibold text-white">{{ displayName }}</h3>
              <p class="text-blue-100 text-sm">@{{ profile?.username || 'username' }}</p>
              <p class="text-blue-100 text-xs mt-1">{{ profile?.email || 'Chưa có email' }}</p>
              <div class="mt-3">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {{ userRoles }}
                </span>
              </div>
            </div>

            <!-- Navigation Tabs -->
            <div class="border-t border-gray-100">
              <nav class="space-y-1 p-2">
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  @click="activeTab = tab.id"
                  :class="[
                    'w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                  ]"
                >
                  <svg
                    class="w-5 h-5 mr-3"
                    :class="activeTab === tab.id ? 'text-blue-700' : 'text-gray-400'"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      :d="tab.icon"
                    />
                  </svg>
                  {{ tab.label }}
                </button>
              </nav>
            </div>
          </div>
        </div>

        <!-- Content Area -->
        <div class="lg:col-span-3">
          <!-- Profile Information Tab -->
          <div
            v-if="activeTab === 'profile'"
            class="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div class="px-6 py-4 border-b border-gray-100">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900">Thông tin cá nhân</h2>
                <button
                  v-if="!editingProfile"
                  @click="startEditProfile"
                  class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Chỉnh sửa
                </button>
              </div>
            </div>

            <div class="p-6">
              <!-- View Mode -->
              <div v-if="!editingProfile" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Tên tài khoản</label
                    >
                    <div class="p-3 bg-gray-50 rounded-lg border">
                      <p class="text-gray-900">{{ profile?.username || 'Chưa cập nhật' }}</p>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div class="p-3 bg-gray-50 rounded-lg border">
                      <p class="text-gray-900">{{ profile?.email || 'Chưa cập nhật' }}</p>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Họ</label>
                    <div class="p-3 bg-gray-50 rounded-lg border">
                      <p class="text-gray-900">{{ profile?.firstName || 'Chưa cập nhật' }}</p>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Tên</label>
                    <div class="p-3 bg-gray-50 rounded-lg border">
                      <p class="text-gray-900">{{ profile?.lastName || 'Chưa cập nhật' }}</p>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Họ và tên đầy đủ</label
                    >
                    <div class="p-3 bg-gray-50 rounded-lg border">
                      <p class="text-gray-900">{{ displayName }}</p>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Số điện thoại</label
                    >
                    <div class="p-3 bg-gray-50 rounded-lg border">
                      <p class="text-gray-900">{{ profile?.phoneNumber || 'Chưa cập nhật' }}</p>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
                    <div class="p-3 bg-gray-50 rounded-lg border">
                      <p class="text-gray-900">{{ getGenderText(profile?.gender) }}</p>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
                    <div class="p-3 bg-gray-50 rounded-lg border">
                      <p class="text-gray-900">{{ formatDate(profile?.birthday) }}</p>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Vai trò</label>
                    <div class="p-3 bg-gray-50 rounded-lg border">
                      <p class="text-gray-900">{{ userRoles }}</p>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                    <div class="p-3 bg-gray-50 rounded-lg border">
                      <span
                        :class="[
                          'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                          getStatusClass(profile?.status),
                        ]"
                      >
                        {{ getStatusText(profile?.status) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Additional Info -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >ID người dùng</label
                    >
                    <div class="p-3 bg-gray-50 rounded-lg border">
                      <p class="text-gray-900 font-mono text-sm">
                        {{ profile?.userId || 'Chưa có' }}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Tạo lúc</label>
                    <div class="p-3 bg-gray-50 rounded-lg border">
                      <p class="text-gray-900">{{ formatDate(profile?.createdAt) }}</p>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Cập nhật lần cuối</label
                    >
                    <div class="p-3 bg-gray-50 rounded-lg border">
                      <p class="text-gray-900">{{ formatDate(profile?.updatedAt) }}</p>
                    </div>
                  </div>
                  <div v-if="profile?.iat">
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Token được cấp lúc</label
                    >
                    <div class="p-3 bg-gray-50 rounded-lg border">
                      <p class="text-gray-900">{{ tokenIssuedAt }}</p>
                    </div>
                  </div>
                  <div v-if="profile?.exp">
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Token hết hạn lúc</label
                    >
                    <div class="p-3 bg-gray-50 rounded-lg border">
                      <p class="text-gray-900">{{ tokenExpiry }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Edit Mode -->
              <div v-else class="space-y-6">
                <form @submit.prevent="saveProfile">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2"
                        >Họ</label
                      >
                      <input
                        id="firstName"
                        v-model="profileForm.firstName"
                        type="text"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập họ"
                      />
                    </div>
                    <div>
                      <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2"
                        >Tên</label
                      >
                      <input
                        id="lastName"
                        v-model="profileForm.lastName"
                        type="text"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập tên"
                      />
                    </div>
                    <div>
                      <label for="phoneNumber" class="block text-sm font-medium text-gray-700 mb-2"
                        >Số điện thoại</label
                      >
                      <input
                        id="phoneNumber"
                        v-model="profileForm.phoneNumber"
                        type="tel"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                    <div>
                      <label for="gender" class="block text-sm font-medium text-gray-700 mb-2"
                        >Giới tính</label
                      >
                      <select
                        id="gender"
                        v-model="profileForm.gender"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="MALE">Nam</option>
                        <option value="FEMALE">Nữ</option>
                        <option value="OTHER">Khác</option>
                      </select>
                    </div>
                    <div class="md:col-span-2">
                      <label for="birthday" class="block text-sm font-medium text-gray-700 mb-2"
                        >Ngày sinh</label
                      >
                      <input
                        id="birthday"
                        v-model="profileForm.birthday"
                        type="date"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div class="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                    <button
                      type="button"
                      @click="cancelEditProfile"
                      class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      :disabled="savingProfile"
                      class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
                    >
                      <svg
                        v-if="savingProfile"
                        class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {{ savingProfile ? 'Đang lưu...' : 'Lưu thay đổi' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- Security Tab -->
          <div
            v-if="activeTab === 'security'"
            class="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div class="px-6 py-4 border-b border-gray-100">
              <h2 class="text-lg font-semibold text-gray-900">Bảo mật tài khoản</h2>
              <p class="text-sm text-gray-500 mt-1">Quản lý mật khẩu và thông tin bảo mật</p>
            </div>

            <div class="p-6 space-y-8">
              <!-- Password Change Section -->
              <div>
                <h3 class="text-md font-medium text-gray-900 mb-4">Đổi mật khẩu</h3>
                <form @submit.prevent="changeUserPassword" class="space-y-6">
                  <div>
                    <label
                      for="currentPassword"
                      class="block text-sm font-medium text-gray-700 mb-2"
                      >Mật khẩu hiện tại</label
                    >
                    <input
                      id="currentPassword"
                      v-model="passwordForm.currentPassword"
                      type="password"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập mật khẩu hiện tại"
                      required
                    />
                  </div>
                  <div>
                    <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2"
                      >Mật khẩu mới</label
                    >
                    <input
                      id="newPassword"
                      v-model="passwordForm.newPassword"
                      type="password"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập mật khẩu mới"
                      required
                    />
                  </div>
                  <div>
                    <label
                      for="confirmPassword"
                      class="block text-sm font-medium text-gray-700 mb-2"
                      >Xác nhận mật khẩu mới</label
                    >
                    <input
                      id="confirmPassword"
                      v-model="passwordForm.confirmPassword"
                      type="password"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập lại mật khẩu mới"
                      required
                    />
                  </div>

                  <div class="flex justify-end pt-4">
                    <button
                      type="submit"
                      :disabled="changingPassword"
                      class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
                    >
                      <svg
                        v-if="changingPassword"
                        class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {{ changingPassword ? 'Đang đổi...' : 'Đổi mật khẩu' }}
                    </button>
                  </div>
                </form>
              </div>

              <!-- Token Information Section -->
              <div v-if="profile?.iat || profile?.exp" class="pt-6 border-t border-gray-100">
                <h3 class="text-md font-medium text-gray-900 mb-4">Thông tin phiên đăng nhập</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-if="profile?.iat" class="p-4 bg-gray-50 rounded-lg">
                    <p class="text-sm font-medium text-gray-700">Token được cấp</p>
                    <p class="text-sm text-gray-600 mt-1">{{ tokenIssuedAt }}</p>
                  </div>
                  <div v-if="profile?.exp" class="p-4 bg-gray-50 rounded-lg">
                    <p class="text-sm font-medium text-gray-700">Token hết hạn</p>
                    <p class="text-sm text-gray-600 mt-1">{{ tokenExpiry }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Addresses Tab -->
          <div
            v-if="activeTab === 'addresses'"
            class="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div class="px-6 py-4 border-b border-gray-100">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">Địa chỉ giao hàng</h2>
                  <p class="text-sm text-gray-500 mt-1">Quản lý địa chỉ giao hàng của bạn</p>
                </div>
                <button
                  @click="startCreateAddress"
                  class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Thêm địa chỉ
                </button>
              </div>
            </div>

            <div class="p-6">
              <!-- Loading Addresses -->
              <div v-if="loadingAddresses" class="flex justify-center py-8">
                <div class="text-center">
                  <div
                    class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
                  ></div>
                  <p class="mt-2 text-sm text-gray-600">Đang tải địa chỉ...</p>
                </div>
              </div>

              <!-- No Addresses -->
              <div v-else-if="addresses.length === 0" class="text-center py-8">
                <svg
                  class="w-12 h-12 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Chưa có địa chỉ nào</h3>
                <p class="text-gray-500 mb-4">Thêm địa chỉ giao hàng để sử dụng khi đặt hàng</p>
                <button
                  @click="startCreateAddress"
                  class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Thêm địa chỉ đầu tiên
                </button>
              </div>

              <!-- Address List -->
              <div v-else class="space-y-4">
                <div
                  v-for="address in addresses"
                  :key="address.id"
                  class="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                  :class="{ 'border-green-300 bg-green-50': address.isDefault }"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center space-x-2 mb-2">
                        <h3 class="font-medium text-gray-900">{{ address.fullName }}</h3>
                        <span
                          v-if="address.isDefault"
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          Mặc định
                        </span>
                      </div>
                      <p class="text-sm text-gray-600 mb-1">{{ address.phone }}</p>
                      <p class="text-sm text-gray-600">
                        {{ address.street }}, {{ address.ward }}, {{ address.city }}
                      </p>
                    </div>
                    <div class="flex items-center space-x-2">
                      <button
                        v-if="!address.isDefault"
                        @click="handleSetDefaultAddress(address.id)"
                        class="px-3 py-1 text-xs text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                        title="Đặt làm mặc định"
                      >
                        Đặt mặc định
                      </button>
                      <button
                        @click="startEditAddress(address)"
                        class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        @click="handleDeleteAddress(address.id)"
                        class="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Xóa"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Address Form Modal -->
          <div
            v-if="showAddressForm"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            @click.self="cancelAddressForm"
          >
            <div
              class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div class="px-6 py-4 border-b border-gray-100">
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới' }}
                </h3>
              </div>

              <form @submit.prevent="saveAddress" class="p-6 space-y-4">
                <div>
                  <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    v-model="addressForm.fullName"
                    type="text"
                    required
                    class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập họ và tên"
                  />
                </div>

                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    v-model="addressForm.phone"
                    type="tel"
                    required
                    class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div>
                  <label for="street" class="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ cụ thể <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="street"
                    v-model="addressForm.street"
                    type="text"
                    required
                    class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Số nhà, tên đường..."
                  />
                </div>

                <div>
                  <label for="ward" class="block text-sm font-medium text-gray-700 mb-2">
                    Phường/Xã <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="ward"
                    v-model="addressForm.ward"
                    type="text"
                    required
                    class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập phường/xã"
                  />
                </div>

                <div>
                  <label for="city" class="block text-sm font-medium text-gray-700 mb-2">
                    Tỉnh/Thành phố <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="city"
                    v-model="addressForm.city"
                    type="text"
                    required
                    class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập tỉnh/thành phố"
                  />
                </div>

                <div class="flex items-center">
                  <input
                    id="isDefault"
                    v-model="addressForm.isDefault"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label for="isDefault" class="ml-2 text-sm text-gray-700">
                    Đặt làm địa chỉ mặc định
                  </label>
                </div>

                <div class="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    @click="cancelAddressForm"
                    class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    :disabled="savingAddress"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
                  >
                    <svg
                      v-if="savingAddress"
                      class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {{
                      savingAddress ? 'Đang lưu...' : editingAddress ? 'Cập nhật' : 'Thêm địa chỉ'
                    }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <Transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showSuccessToast"
        class="fixed top-4 right-4 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden z-50"
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg
                class="h-6 w-6 text-green-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium text-gray-900">Thành công!</p>
              <p class="mt-1 text-sm text-gray-500">{{ successMessage }}</p>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
              <button
                @click="showSuccessToast = false"
                class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Notice Toast -->
    <Transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showNoticeToast"
        class="fixed top-4 right-4 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden z-50"
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg
                class="h-6 w-6 text-blue-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium text-gray-900">Thông báo</p>
              <p class="mt-1 text-sm text-gray-500">{{ noticeMessage }}</p>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
              <button
                @click="showNoticeToast = false"
                class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

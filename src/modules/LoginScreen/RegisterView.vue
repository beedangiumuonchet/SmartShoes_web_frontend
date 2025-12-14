<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Đăng ký tài khoản</h1>
        <p class="text-gray-600">Tạo tài khoản mới để trải nghiệm SmartShoes</p>
      </div>

      <form @submit.prevent="register" class="space-y-6">
        <!-- Personal Information Section -->
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- First Name -->
            <div class="space-y-2">
              <label for="firstName" class="block text-sm font-medium text-gray-700"> Họ * </label>
              <input
                id="firstName"
                v-model="registerForm.firstName"
                type="text"
                placeholder="Nhập họ"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
              />
            </div>

            <!-- Last Name -->
            <div class="space-y-2">
              <label for="lastName" class="block text-sm font-medium text-gray-700"> Tên * </label>
              <input
                id="lastName"
                v-model="registerForm.lastName"
                type="text"
                placeholder="Nhập tên"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
              />
            </div>
          </div>

          <!-- Email -->
          <div class="space-y-2">
            <label for="email" class="block text-sm font-medium text-gray-700"> Email * </label>
            <input
              id="email"
              v-model="registerForm.email"
              type="email"
              placeholder="Nhập địa chỉ email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
            />
          </div>

          <!-- Username -->
          <div class="space-y-2">
            <label for="username" class="block text-sm font-medium text-gray-700">
              Tên đăng nhập *
            </label>
            <input
              id="username"
              v-model="registerForm.username"
              type="text"
              placeholder="Nhập tên đăng nhập (ít nhất 3 ký tự)"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Password -->
            <div class="space-y-2">
              <label for="password" class="block text-sm font-medium text-gray-700">
                Mật khẩu *
              </label>
              <div class="relative">
                <input
                  id="password"
                  v-model="registerForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Mật khẩu (ít nhất 6 ký tự)"
                  required
                  class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    v-if="showPassword"
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Confirm Password -->
            <div class="space-y-2">
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
                Xác nhận mật khẩu *
              </label>
              <div class="relative">
                <input
                  id="confirmPassword"
                  v-model="registerForm.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Nhập lại mật khẩu"
                  required
                  class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    v-if="showConfirmPassword"
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Password Match Indicator -->
          <div v-if="registerForm.confirmPassword" class="flex items-center space-x-2 text-xs">
            <svg
              v-if="passwordsMatch"
              class="w-4 h-4 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <svg
              v-else
              class="w-4 h-4 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span :class="passwordsMatch ? 'text-green-600' : 'text-red-600'">
              {{ passwordsMatch ? 'Mật khẩu khớp' : 'Mật khẩu không khớp' }}
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Phone Number -->
            <div class="space-y-2">
              <label for="phoneNumber" class="block text-sm font-medium text-gray-700">
                Số điện thoại
              </label>
              <input
                id="phoneNumber"
                v-model="registerForm.phoneNumber"
                type="tel"
                placeholder="Số điện thoại (tùy chọn)"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
              />
            </div>

            <!-- Gender -->
            <div class="space-y-2">
              <label for="gender" class="block text-sm font-medium text-gray-700">
                Giới tính
              </label>
              <select
                id="gender"
                v-model="registerForm.gender"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none bg-white"
              >
                <option value="">Chọn giới tính</option>
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>
          </div>

          <!-- Birthday -->
          <div class="space-y-2">
            <label for="birthday" class="block text-sm font-medium text-gray-700">
              Ngày sinh
            </label>
            <input
              id="birthday"
              v-model="registerForm.birthday"
              type="date"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
            />
          </div>
        </div>

        <!-- Terms & Conditions -->
        <div class="flex items-center">
          <label class="flex items-center cursor-pointer">
            <input
              id="acceptTerms"
              v-model="registerForm.acceptTerms"
              type="checkbox"
              required
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span class="ml-2 text-sm text-gray-700">
              Tôi đồng ý với
              <a href="#" class="text-blue-600 hover:text-blue-700 underline">
                Điều khoản dịch vụ
              </a>
              và
              <a href="#" class="text-blue-600 hover:text-blue-700 underline">
                Chính sách bảo mật
              </a>
            </span>
          </label>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading || !canSubmit"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <div class="flex items-center justify-center space-x-2">
            <svg
              v-if="isLoading"
              class="w-5 h-5 animate-spin"
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
            <span>{{ isLoading ? 'Đang tạo tài khoản...' : 'Đăng ký' }}</span>
          </div>
        </button>

        <!-- Back to Login -->
        <button
          type="button"
          @click="routerLogin"
          class="w-full bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          <div class="flex items-center justify-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Đã có tài khoản? Đăng nhập ngay</span>
          </div>
        </button>

        <!-- Error Message -->
        <div
          v-if="error"
          class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
        >
          {{ error }}
        </div>

        <!-- Success Message -->
        <div
          v-if="successMessage"
          class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm"
        >
          {{ successMessage }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { createUser, validateUserRequest } from '@/modules/users/users.api'
import type { CreateUserRequest } from '@/modules/users/users.type'
import { Info, Warn, ErrorLog, DebugContexts } from '@/common/utils/debug'

const router = useRouter()
const error = ref('')
const successMessage = ref('')
const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Form data
const registerForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  gender: '' as 'MALE' | 'FEMALE' | 'OTHER' | '',
  birthday: '',
  acceptTerms: false,
})

// Computed properties
const passwordsMatch = computed(() => {
  return registerForm.password && registerForm.confirmPassword
    ? registerForm.password === registerForm.confirmPassword
    : true
})

const canSubmit = computed(() => {
  return (
    registerForm.firstName.trim() &&
    registerForm.lastName.trim() &&
    registerForm.email.trim() &&
    registerForm.username.trim() &&
    registerForm.password.trim() &&
    registerForm.confirmPassword.trim() &&
    passwordsMatch.value &&
    registerForm.acceptTerms &&
    !isLoading.value
  )
})

// Methods
const register = async () => {
  console.log(
    Info(
      'User Registration Attempt started',
      {
        email: registerForm.email,
        username: registerForm.username,
        hasPassword: !!registerForm.password,
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
      },
      DebugContexts.AUTH,
    ),
  )

  // Reset messages
  error.value = ''
  successMessage.value = ''

  // Basic validation
  if (!canSubmit.value) {
    console.log(Warn('Registration failed - form validation failed', {}, DebugContexts.AUTH))
    error.value = 'Vui lòng điền đầy đủ thông tin bắt buộc'
    return
  }

  // Password validation
  if (registerForm.password !== registerForm.confirmPassword) {
    console.log(Warn('Registration failed - passwords do not match', {}, DebugContexts.AUTH))
    error.value = 'Mật khẩu và xác nhận mật khẩu không khớp'
    return
  }

  if (registerForm.password.length < 6) {
    console.log(Warn('Registration failed - password too short', {}, DebugContexts.AUTH))
    error.value = 'Mật khẩu phải có ít nhất 6 ký tự'
    return
  }

  isLoading.value = true

  try {
    // Create user request object
    const userRequest: CreateUserRequest = {
      firstName: registerForm.firstName.trim(),
      lastName: registerForm.lastName.trim(),
      email: registerForm.email.trim(),
      username: registerForm.username.trim(),
      password: registerForm.password,
      phoneNumber: registerForm.phoneNumber.trim() || undefined,
      gender: registerForm.gender || undefined,
      birthday: registerForm.birthday || undefined,
      status: 'ACTIVE', // Default status for new users
      roles: ['USER'], // Default role for new users
    }

    console.log('User registration data being sent:', {
      ...userRequest,
      password: '***', // Hide password in logs
    })

    // Additional validation using the API validator
    const validationErrors = validateUserRequest(userRequest)
    if (validationErrors.length > 0) {
      console.log(
        Warn(
          'Registration failed - validation errors',
          { errors: validationErrors },
          DebugContexts.AUTH,
        ),
      )
      error.value = validationErrors[0] // Show first error
      return
    }

    // Call API
    const response = await createUser(userRequest)

    console.log('Registration API Response:', response)

    // Success
    console.log(
      Info(
        'User Registration successful',
        {
          userId: response.id,
          email: response.email,
          username: response.username,
        },
        DebugContexts.AUTH,
      ),
    )

    successMessage.value = 'Đăng ký thành công! Chuyển hướng đến trang đăng nhập...'

    // Clear form
    Object.assign(registerForm, {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      gender: '',
      birthday: '',
      acceptTerms: false,
    })

    // Redirect to login after 2 seconds
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err: any) {
    console.log(ErrorLog('Registration failed with exception', err, DebugContexts.AUTH))

    // Enhanced error handling
    let errorMessage = 'Đăng ký thất bại: '

    if (err?.message) {
      errorMessage += err.message
    } else if (err?.response?.data?.message) {
      errorMessage += err.response.data.message
    } else if (err?.response?.status === 409) {
      errorMessage += 'Email hoặc tên đăng nhập đã tồn tại'
    } else if (err?.response?.status === 400) {
      errorMessage += 'Thông tin không hợp lệ'
    } else {
      errorMessage += 'Có lỗi xảy ra, vui lòng thử lại'
    }

    error.value = errorMessage
  } finally {
    isLoading.value = false
  }
}

const routerLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
/* Exactly match LoginView styles */
input:focus,
select:focus {
  outline: none;
  ring: 2px;
  ring-color: #3b82f6; /* blue-500 - match LoginView */
  border-color: #3b82f6;
}

/* Custom checkbox styling to match LoginView */
input[type='checkbox']:checked {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

/* Button hover effects like LoginView */
button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}

/* Loading animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .grid-cols-1.md\:grid-cols-2 {
    grid-template-columns: 1fr;
  }

  .max-w-2xl {
    max-width: 100%;
  }

  .p-8 {
    padding: 1.5rem;
  }
}

/* Smooth transitions like LoginView */
* {
  transition-property: color, background-color, border-color, opacity, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>

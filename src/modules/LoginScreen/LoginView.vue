<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
      <!-- ✅ THÊM: Header với brand và back button -->
      <div class="flex items-center justify-between mb-6">
        <!-- Brand/Logo -->
        <div class="flex items-center space-x-2">
          <div
            class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span class="text-xl font-bold text-gray-900">SmartShoes</span>
        </div>

        <!-- Back to Home Button -->
        <button
          @click="goToHome"
          class="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group"
          title="Về trang chủ"
        >
          <svg
            class="w-5 h-5 group-hover:transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span class="text-sm font-medium hidden sm:block">Trang chủ</span>
        </button>
      </div>

      <!-- ✅ SỬA: Title section (bỏ mb-8, thêm mb-6) -->
      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h1>
        <p class="text-gray-600">Vui lòng nhập thông tin đăng nhập của bạn</p>
      </div>

      <form @submit.prevent="login" class="space-y-6">
        <div class="space-y-2">
          <label for="email" class="block text-sm font-medium text-gray-700"
            >Email / Tên đăng nhập</label
          >
          <input
            id="email"
            v-model="loginForm.email"
            type="text"
            placeholder="Nhập email hoặc tên đăng nhập"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
          />
        </div>

        <div class="space-y-2">
          <label for="password" class="block text-sm font-medium text-gray-700">Mật khẩu</label>
          <input
            id="password"
            v-model="loginForm.password"
            type="password"
            placeholder="Nhập mật khẩu"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
          />
        </div>

        <div class="flex items-center">
          <label class="flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="loginForm.rememberMe"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span class="ml-2 text-sm text-gray-700">Ghi nhớ đăng nhập</span>
          </label>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span v-if="isLoading">Đang đăng nhập...</span>
          <span v-else>Đăng nhập</span>
        </button>

        <!-- Dev only button -->
        <button
          type="button"
          @click="routerRegister"
          class="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
        >
          🚀 Chưa có tài khoản? Đăng ký ngay !!
        </button>

        <div
          v-if="error"
          class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
        >
          {{ error }}
        </div>

        <!-- ✅ THÊM: Footer links -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <div class="text-center space-y-4">
            <!-- Quick actions -->
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                @click="goToHome"
                class="flex items-center justify-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>Về trang chủ</span>
              </button>

              <button
                @click="goToProducts"
                class="flex items-center justify-center space-x-2 px-4 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors text-sm"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <span>Xem sản phẩm</span>
              </button>
            </div>

            <!-- Help text -->
            <p class="text-xs text-gray-500">Bạn có thể xem sản phẩm mà không cần đăng nhập</p>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { setToken, getCurrentUser } from '@/common/guards/roleGuard.guard'
import { login as loginAPI } from './api'
import { LoginForm } from './model.type'
import { Info, Warn, ErrorLog, DebugContexts } from '@/common/utils/debug'

const router = useRouter()
const error = ref('')
const isLoading = ref(false)

// Form data
const loginForm = ref({
  email: '',
  password: '',
  rememberMe: false,
})

// Check if in development mode
const isDev = computed(() => import.meta.env.VITE_ENV === 'development')

const login = async () => {
  console.log(
    Info(
      'User Login Attempt started',
      {
        email: loginForm.value.email,
        hasPassword: !!loginForm.value.password,
        rememberMe: loginForm.value.rememberMe,
      },
      DebugContexts.AUTH,
    ),
  )

  if (!loginForm.value.email.trim()) {
    console.log(Warn('Login failed - no email provided', {}, DebugContexts.AUTH))
    error.value = 'Vui lòng nhập email hoặc tên đăng nhập'
    return
  }

  if (!loginForm.value.password.trim()) {
    console.log(Warn('Login failed - no password provided', {}, DebugContexts.AUTH))
    error.value = 'Vui lòng nhập mật khẩu'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    // Create LoginForm instance
    const loginFormData = new LoginForm(
      loginForm.value.email,
      loginForm.value.password,
      loginForm.value.rememberMe,
    )
    console.log('Login form data being sent:', loginFormData)

    // Call API
    const response = await loginAPI(loginFormData)

    console.log('Full API Response:', response)
    console.log('Response data:', response.data)
    console.log('Response result:', response.result)
    console.log('Token:', response.result?.token)
    console.log('User:', response.result?.user)

    // Debug: Kiểm tra response
    console.log('API Response:', response)

    // Kiểm tra response structure trước khi setToken
    if (!response.result?.token) {
      throw new Error('Token not found in response')
    }
    // Use rememberMe to determine storage type (session vs local)
    setToken(response.result?.token ?? '')
    // Get user roles from response
    const userRoles = response.result?.roles || response.result?.user?.roles || []

    console.log('User roles for redirect:', userRoles)

    // Redirect based on role
    if (userRoles.includes('ADMIN')) {
      console.log('Redirecting to admin dashboard...')
      await router.push('/manager')
    } else if (userRoles.includes('USER')) {
      console.log('Redirecting to user homepage...')
      await router.push('/')
    } else {
      // Fallback - redirect to homepage
      console.log('No specific role found, redirecting to homepage...')
      await router.push('/')
    }

    console.log('Navigation completed, current route:', router.currentRoute.value.path)
  } catch (err) {
    console.log(ErrorLog('Login failed with exception', err, DebugContexts.AUTH))
    error.value = 'Đăng nhập thất bại: ' + (err as Error).message
  } finally {
    isLoading.value = false
  }
}

const routerRegister = () => {
  router.push('/register')
}
// ✅ THÊM: Navigation methods
const goToHome = () => {
  router.push('/')
}

const goToProducts = () => {
  router.push('/products')
}
</script>

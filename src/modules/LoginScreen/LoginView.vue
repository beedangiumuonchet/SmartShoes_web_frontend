<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
      <div class="text-center mb-8">
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
          v-if="isDev"
          type="button"
          @click="useFakeToken"
          class="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
        >
          🚀 Dev: Sử dụng token giả
        </button>

        <div
          v-if="error"
          class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
        >
          {{ error }}
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

const useFakeToken = () => {
  console.log(Info('Using fake token for development', {}, DebugContexts.AUTH))

  // Sample admin JWT token
  const sampleToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwicm9sZSI6WyJhZG1pbiJdLCJpYXQiOjE1MTYyMzkwMjJ9.CIvtAWDAOgORXRVZR8Ja-yJytoIwLpGRYSm-b7qxO8w'

  try {
    setToken(sampleToken)
    console.log(
      Info(
        'Fake token login successful',
        {
          user: getCurrentUser()?.name,
          roles: getCurrentUser()?.role,
        },
        DebugContexts.AUTH,
      ),
    )
    router.push('/manager')
  } catch (err) {
    console.log(ErrorLog('Fake token login failed', err, DebugContexts.AUTH))
    error.value = 'Không thể sử dụng token giả: ' + (err as Error).message
  }
}
</script>

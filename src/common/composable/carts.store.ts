import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { hasAnyRole, isValidToken, getJWTPayload } from '@/common/utils/jwtDecode'
import { Debug, Info, Warn, ErrorLog, DebugContexts } from '@/common/utils/debug'
import { useCookies } from '@vueuse/integrations/useCookies'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { TokenPayload } from '@/modules/LoginScreen/model.type'
import { getUserCart, getCartItemCount } from '@/modules/carts/carts.api'

// Computed
const currentUser = computed(() => getCurrentUser())
const cookie = useCookies(['token'])
const cartItemsCount = ref(0)

function getToken(): string | null {
  const token = cookie.get('jwt_token')

  console.log(
    Debug(
      'Token retrieval',
      {
        hasToken: !!token,
        tokenLength: token?.length || 0,
      },
      DebugContexts.AUTH,
    ),
  )

  return token
}

export function getCurrentUser(): any | null {
  const token = getToken()
  if (!token) {
    console.log(Debug('No token found for current user', {}, DebugContexts.AUTH))
    return null
  }

  try {
    const decodedToken = getJWTPayload(token) as any // Cast to any để tránh type error
    console.log('Raw decoded token:', decodedToken) // Debug để xem structure

    if (!decodedToken) {
      return null
    }

    // Map directly từ decoded token (không phải tokenPayload.user)
    const user = {
      id: decodedToken.userId || decodedToken.id || decodedToken.sub,
      name: `${decodedToken.firstName || ''} ${decodedToken.lastName || ''}`.trim(),
      username: decodedToken.username,
      email: decodedToken.email,
      firstName: decodedToken.firstName,
      lastName: decodedToken.lastName,
      role: decodedToken.roles || [],
      roles: decodedToken.roles || [],
      userId: decodedToken.userId,
    }

    console.log(
      Debug(
        'Current user retrieved',
        {
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          userRoles: user.roles,
          hasUser: !!user,
        },
        DebugContexts.AUTH,
      ),
    )

    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export const updateCartCount = async () => {
  if (!currentUser.value?.userId) {
    cartItemsCount.value = 0
    return
  }

  try {
    const cart = await getUserCart(currentUser.value.userId)
    cartItemsCount.value = cart ? getCartItemCount(cart) : 0
  } catch (error) {
    cartItemsCount.value = 0
  }
}

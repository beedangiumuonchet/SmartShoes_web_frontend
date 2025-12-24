/**
 * Role Guard for Vue Router
 * Handles route protection based on user roles
 */

import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { hasAnyRole, isValidToken, getJWTPayload } from '@/common/utils/jwtDecode'
import { Debug, Info, Warn, ErrorLog, DebugContexts } from '@/common/utils/debug'
import { useCookies } from '@vueuse/integrations/useCookies'
import type { TokenPayload } from '@/modules/LoginScreen/model.type'

const cookie = useCookies(['token'])

export interface RoleGuardConfig {
  requiredRoles?: string[]
  redirectTo?: string
  allowUnauthenticated?: boolean
}

export interface RouteGuardMeta {
  requiresAuth?: boolean
  requiredRoles?: string[]
  redirectTo?: string
}

/**
 * Gets JWT token from localStorage
 * @returns JWT token or null
 */
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

/**
 * Stores JWT token in storage
 * @param token - JWT token to store
 * @param useSession - Whether to use sessionStorage instead of localStorage
 */
export function setToken(token: string): void {
  console.log(
    Info(
      'Storing JWT token',
      {
        tokenLength: token.length,
        storageType: 'cookies',
      },
      DebugContexts.AUTH,
    ),
  )

  cookie.set('jwt_token', token)

  console.log(
    Info(
      'Token stored successfully',
      {
        storageType: 'cookie',
      },
      DebugContexts.AUTH,
    ),
  )
}

/**
 * Removes JWT token from storage
 */
export function removeToken(): void {
  try {
    console.log('Starting token removal process...')

    // Debug: Check token before removal
    const tokenBefore = getToken()
    console.log('Token before removal:', tokenBefore ? 'EXISTS' : 'NOT_FOUND')

    // Remove from cookies
    try {
      cookie.remove('jwt_token')
      console.log('Removed from cookies')
    } catch (cookieError) {
      console.error('Error removing from cookies:', cookieError)
    }

    // Remove from localStorage
    try {
      localStorage.removeItem('jwt_token')
      console.log('Removed from localStorage')
    } catch (localError) {
      console.error('Error removing from localStorage:', localError)
    }

    // Remove from sessionStorage
    try {
      sessionStorage.removeItem('jwt_token')
      console.log('Removed from sessionStorage')
    } catch (sessionError) {
      console.error('Error removing from sessionStorage:', sessionError)
    }

    // Debug: Check token after removal
    const tokenAfter = getToken()
    console.log('Token after removal:', tokenAfter ? 'STILL_EXISTS' : 'REMOVED')

    console.log('Token removal completed successfully')
  } catch (error) {
    console.error('Error in removeToken():', error)
  }
}

/**
 * Gets current user information from JWT token
 * @returns User information or null if not authenticated
 */
export function getCurrentUser(): any | null {
  const token = getToken()
  if (!token) {
    console.log(Debug('No token found for current user', {}, DebugContexts.AUTH))
    return null
  }

  try {
    const decodedToken = getJWTPayload(token) as any // Cast to any để tránh type error
    // ✅ THÊM - Check user status trong token
    if (decodedToken.user && decodedToken.user.status && decodedToken.user.status !== 'ACTIVE') {
      console.warn('⚠️ Current user has non-active status:', decodedToken.user.status)
      // Clear token nếu user không còn ACTIVE
      removeToken()
      return null
    }

    // ✅ THÊM - Check status từ root level token (nếu BE đặt status ở đó)
    if (decodedToken.status && decodedToken.status !== 'ACTIVE') {
      console.warn('⚠️ Token has non-active status:', decodedToken.status)
      removeToken()
      return null
    }
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
      status: decodedToken.status || decodedToken.user?.status, // ✅ THÊM status
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
          userStatus: user.status,
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

/**
 * Checks if user is authenticated
 * @returns true if authenticated, false otherwise
 */
export function isAuthenticated(): boolean {
  const token = getToken()
  const authenticated = token ? isValidToken(token) : false

  console.log(
    Debug(
      'Authentication check',
      {
        hasToken: !!token,
        isValid: authenticated,
        tokenLength: token?.length || 0,
      },
      DebugContexts.AUTH,
    ),
  )

  return authenticated
}

/**
 * Checks if user has required roles for a route
 * @param requiredRoles - Array of required roles
 * @returns true if user has required roles, false otherwise
 */
export function hasRequiredRoles(requiredRoles: string[]): boolean {
  const token = getToken()
  if (!token) {
    console.log(Warn('No token available for role check', { requiredRoles }, DebugContexts.AUTH))
    return false
  }

  const userRoles = getJWTPayload(token)?.roles || []
  const hasRoles = hasAnyRole(token, requiredRoles)

  console.log(
    Debug(
      'Role check',
      {
        requiredRoles,
        userRoles,
        hasRequiredRoles: hasRoles,
        tokenValid: isValidToken(token),
      },
      DebugContexts.AUTH,
    ),
  )

  return hasRoles
}

/**
 * Creates a role guard function for Vue Router
 * @param config - Guard configuration
 * @returns Navigation guard function
 */
export function createRoleGuard(config: RoleGuardConfig = {}) {
  return (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) => {
    console.log(
      Info(
        'Route Guard Check started',
        {
          from: from.path,
          to: to.path,
          routeName: to.name,
        },
        DebugContexts.ROUTER,
      ),
    )

    const meta = to.meta as RouteGuardMeta
    const requiredRoles = meta.requiredRoles || config.requiredRoles || []
    const redirectTo = meta.redirectTo || config.redirectTo || '/login'
    const allowUnauthenticated = meta.requiresAuth === false || config.allowUnauthenticated

    console.log(
      Debug(
        'Guard configuration',
        {
          requiredRoles,
          redirectTo,
          allowUnauthenticated,
          requiresAuth: meta.requiresAuth,
        },
        DebugContexts.ROUTER,
      ),
    )

    // If no authentication required, allow access
    if (allowUnauthenticated) {
      console.log(Info('Public route - allowing access', {}, DebugContexts.ROUTER))
      return next()
    }

    // Check if user is authenticated
    if (!isAuthenticated()) {
      console.log(
        Warn('User not authenticated - redirecting to login', { redirectTo }, DebugContexts.ROUTER),
      )
      return next(redirectTo)
    }

    // If no roles required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      console.log(Info('No roles required - allowing access', {}, DebugContexts.ROUTER))
      return next()
    }

    // Check if user has required roles
    if (!hasRequiredRoles(requiredRoles)) {
      console.log(
        ErrorLog(
          'User lacks required roles - redirecting to unauthorized',
          {
            requiredRoles,
            currentUser: getCurrentUser(),
          },
          DebugContexts.ROUTER,
        ),
      )
      return next('/unauthorized')
    }

    // Allow access
    console.log(
      Info(
        'Access granted',
        {
          user: getCurrentUser()?.name, // ← SỬA: bỏ .user.firstName, dùng .name
          roles: getCurrentUser()?.roles, // ← SỬA: bỏ .user, dùng .roles trực tiếp
        },
        DebugContexts.ROUTER,
      ),
    )
    next()
  }
}

/**
 * Default role guard instance
 */
export const roleGuard = createRoleGuard()

/**
 * Admin role guard - requires admin role
 */
export const adminGuard = createRoleGuard({
  requiredRoles: ['user'],
  redirectTo: '/login',
})

/**
 * User role guard - requires user role
 */
export const userGuard = createRoleGuard({
  requiredRoles: ['user'],
  redirectTo: '/login',
})

/**
 * Manager role guard - requires manager role
 */
export const managerGuard = createRoleGuard({
  requiredRoles: ['manager'],
  redirectTo: '/login',
})

/**
 * Custom role guard factory
 * @param roles - Required roles
 * @param redirectTo - Redirect path if unauthorized
 * @returns Role guard function
 */
export function createCustomRoleGuard(roles: string[], redirectTo = '/login') {
  return createRoleGuard({
    requiredRoles: roles,
    redirectTo,
  })
}

/**
 * Public route guard - allows unauthenticated access
 */
export const publicGuard = createRoleGuard({
  allowUnauthenticated: true,
})

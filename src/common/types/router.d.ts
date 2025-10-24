import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    layout?: 'default' | 'blank' | 'topbar'
    roles?: string[]
    title?: string
  }
}

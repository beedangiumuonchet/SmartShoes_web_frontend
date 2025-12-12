import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import type { IApiResponse } from '../types'
import { useCookies } from '@vueuse/integrations/useCookies'

const cookie = useCookies(['jwt_token'])

export interface IHttpConfig {
  headers?: Record<string, string>
  params?: Record<string, unknown>
  timeout?: number
  withCredentials?: boolean
}

export class AxiosHttpClient {
  private client: AxiosInstance

  constructor(baseURL: string, config?: AxiosRequestConfig) {
    this.client = axios.create({
      baseURL,
      timeout: 24000,
      headers: {
        'Content-Type': 'application/json',
      },
      ...config,
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // SỬA: Lấy token từ cookie thay vì localStorage
        const token = cookie.get('jwt_token')

        console.log('=== AXIOS REQUEST DEBUG ===')
        console.log('Request URL:', config.url)
        console.log('Base URL:', config.baseURL)
        console.log('Full URL:', `${config.baseURL}${config.url}`)
        console.log('Method:', config.method?.toUpperCase())
        console.log(
          'Token from cookie (jwt_token):',
          token ? `${token.substring(0, 50)}...` : 'NOT_FOUND',
        )

        if (token) {
          config.headers.Authorization = `Bearer ${token}`
          console.log('✅ Authorization header added')
        } else {
          console.log('❌ No token found - request will fail authentication')
        }

        console.log('Final headers:', {
          'Content-Type': config.headers['Content-Type'],
          Authorization: config.headers.Authorization ? 'Bearer [TOKEN_SET]' : 'NOT_SET',
        })
        console.log('===========================')

        return config
      },
      (error) => {
        console.error('❌ Request interceptor error:', error)
        return Promise.reject(error)
      },
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log('=== AXIOS RESPONSE DEBUG ===')
        console.log('Response status:', response.status)
        console.log('Response URL:', response.config.url)
        console.log('Response data type:', typeof response.data)
        console.log('Response data:', response.data)
        console.log('============================')

        return response.data
      },
      (error) => {
        console.error('=== AXIOS RESPONSE ERROR ===')
        console.error('Error status:', error.response?.status)
        console.error('Error URL:', error.config?.url)
        console.error('Error message:', error.message)
        console.error('Error data:', error.response?.data)

        if (error.response?.status === 401) {
          console.error('❌ 401 Unauthorized - Token may be invalid or expired')
          console.error('Clearing jwt_token from cookie')
          cookie.remove('jwt_token')
        }

        console.error('============================')

        const apiError: IApiResponse<null> = {
          message: error.response?.data?.message || error.message,
        }

        // SỬA: Comment toast để tránh lỗi
        // toast.add({
        //   title: apiError.message,
        //   color: 'error',
        // })

        return Promise.reject(apiError)
      },
    )
  }

  async get<TResponse>(url: string, config?: IHttpConfig): Promise<TResponse> {
    return this.client.get(url, this.mapConfig(config))
  }

  async post<TResponse, TRequest>(
    url: string,
    data?: TRequest,
    config?: IHttpConfig,
  ): Promise<TResponse> {
    return this.client.post(url, data, this.mapConfig(config))
  }

  async put<TResponse, TRequest>(
    url: string,
    data?: TRequest,
    config?: IHttpConfig,
  ): Promise<TResponse> {
    return this.client.put(url, data, this.mapConfig(config))
  }

  async delete<TResponse>(url: string, config?: IHttpConfig): Promise<TResponse> {
    return this.client.delete(url, this.mapConfig(config))
  }

  async patch<TResponse, TRequest>(
    url: string,
    data?: TRequest,
    config?: IHttpConfig,
  ): Promise<TResponse> {
    return this.client.patch(url, data, this.mapConfig(config))
  }

  private mapConfig(config?: IHttpConfig): AxiosRequestConfig {
    if (!config) return {}

    return {
      headers: config.headers,
      params: config.params,
      timeout: config.timeout,
      withCredentials: config.withCredentials,
    }
  }
}

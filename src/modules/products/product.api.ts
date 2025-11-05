  import { AxiosHttpClient } from '@/common/utils/axios'
  import type { IApiResponse } from '@/common/types'
  import type { Product, PaginationResponse, ProductFilter, ProductVariantWithProduct } from './product.type'
  import { useCookies } from '@vueuse/integrations/useCookies'
  import { getCurrentUser } from '@/common/guards/roleGuard.guard'

  const axiosHttpClient = new AxiosHttpClient(import.meta.env.VITE_API_URL)
  const cookie = useCookies(['jwt_token'])

  /**
   * 🟢 Lấy danh sách tất cả sản phẩm (có filter & phân trang)
   */
  // export const getAllProductsApi = async (params?: ProductFilter) => {
  //   console.log('=== GET ALL PRODUCTS ===')
  //   console.log('Token exists:', !!cookie.get('jwt_token'))
  //   console.log('Params:', params)
  //   console.log('Full URL:', `${import.meta.env.VITE_API_URL}/products`)
  //   console.log('========================')

  //   try {
  //     const response = await axiosHttpClient.get<IApiResponse<PaginationResponse<Product>>>(
  //       '/products',
  //       { params },
  //     )
  //     console.log('✅ Get all products success:', response)
  //     return response
  //   } catch (error) {
  //     console.error('❌ Get all products error:', error)
  //     throw error
  //   }
  // }
export const getAllProductsApi = async (params?: ProductFilter) => {
  console.log('=== GET ALL PRODUCTS ===')
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('Params (raw):', params)
  console.log('Full URL:', `${import.meta.env.VITE_API_URL}/products`)
  console.log('========================')

  // 🧩 Lọc bỏ các field trống để tránh lỗi "Property must not be null or empty"
  const cleanParams: Record<string, any> = {}
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      cleanParams[key] = value
    }
  })

  console.log('Cleaned params:', cleanParams)

  try {
    const response = await axiosHttpClient.get<
      IApiResponse<PaginationResponse<Product>>
    >('/products', { params: cleanParams })

    console.log('✅ Get all products success:', response)
    return response
  } catch (error) {
    console.error('❌ Get all products error:', error)
    throw error
  }
}
  /**
   * 🟢 Lấy chi tiết sản phẩm theo ID
   */
  export const getProductByIdApi = async (id: string) => {
    console.log('=== GET PRODUCT BY ID ===')
    console.log('Product ID:', id)
    console.log('==========================')

    try {
      const response = await axiosHttpClient.get<IApiResponse<Product>>(`/products/${id}`)
      console.log('✅ Get product by id success:', response)
      return response
    } catch (error) {
      console.error('❌ Get product by id error:', error)
      throw error
    }
  }

  /**
 * 🟢 Lấy variant kèm product theo ID (dùng khi cần truy ngược lại thông tin sản phẩm)
 */
export const getVariantWithProductByIdApi = async (id: string) => {
  console.log('=== GET VARIANT WITH PRODUCT ===')
  console.log('Variant ID:', id)
  console.log('==========================')

  try {
    const response = await axiosHttpClient.get<IApiResponse<ProductVariantWithProduct>>(
      `/product-variants/${id}/with-product`,
    )
    console.log('✅ Get variant with product success:', response)
    return response
  } catch (error) {
    console.error('❌ Get variant with product error:', error)
    throw error
  }
}

  /**
   * 🟢 Lấy sản phẩm theo brand
   */
  export const getProductsByBrandApi = async (brandId: string, params?: ProductFilter) => {
    console.log('=== GET PRODUCTS BY BRAND ===')
    console.log('Brand ID:', brandId)
    console.log('Params:', params)
    console.log('=============================')

    try {
      const response = await axiosHttpClient.get<IApiResponse<PaginationResponse<Product>>>(
        `/products/brand/${brandId}`,
        { params },
      )
      console.log('✅ Get products by brand success:', response)
      return response
    } catch (error) {
      console.error('❌ Get products by brand error:', error)
      throw error
    }
  }

  /**
   * 🟢 Lấy sản phẩm theo category
   */
  export const getProductsByCategoryApi = async (categoryId: string, params?: ProductFilter) => {
    console.log('=== GET PRODUCTS BY CATEGORY ===')
    console.log('Category ID:', categoryId)
    console.log('Params:', params)
    console.log('===============================')

    try {
      const response = await axiosHttpClient.get<IApiResponse<PaginationResponse<Product>>>(
        `/products/category/${categoryId}`,
        { params },
      )
      console.log('✅ Get products by category success:', response)
      return response
    } catch (error) {
      console.error('❌ Get products by category error:', error)
      throw error
    }
  }

  /**
   * 🟢 Tạo mới sản phẩm (nếu cần)
   */
  export const createProductApi = async (formData: Partial<Product>) => {
    console.log('=== CREATE PRODUCT ===')
    console.log('Form Data:', formData)

    const currentUser = getCurrentUser()
    console.log('Current User:', currentUser)

    try {
      const response = await axiosHttpClient.post<IApiResponse<Product>>('/products', formData)
      console.log('✅ Create product success:', response)
      return response
    } catch (error) {
      console.error('❌ Create product error:', error)
      throw error
    }
  }

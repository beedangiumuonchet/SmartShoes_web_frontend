import { AxiosHttpClient } from '@/common/utils/axios'
import type { IApiResponse } from '@/common/types'
import type {
  Product,
  PaginationResponse,
  ProductFilter,
  ProductVariantWithProduct,
  ProductVariant,
  AiSearchRequest,
  AiSearchResponse,
} from './product.type'
import { useCookies } from '@vueuse/integrations/useCookies'
import { getCurrentUser } from '@/common/guards/roleGuard.guard'

const axiosHttpClient = new AxiosHttpClient(import.meta.env.VITE_API_URL)
const cookie = useCookies(['jwt_token'])

/**
 * 🟢 Lấy danh sách tất cả sản phẩm (có filter & phân trang)
 */
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
    const response = await axiosHttpClient.get<IApiResponse<PaginationResponse<Product>>>(
      '/products',
      { params: cleanParams },
    )

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
 * 🟢 Lấy chi tiết sản phẩm theo SLUG
 */
export const getProductBySlugApi = async (slug: string) => {
  console.log('=== GET PRODUCT BY SLUG ===')
  console.log('Product Slug:', slug)
  console.log('===========================')

  try {
    const response = await axiosHttpClient.get<IApiResponse<Product>>(`/products/slug/${slug}`)
    console.log('✅ Get product by slug success:', response)
    return response
  } catch (error) {
    console.error('❌ Get product by slug error:', error)
    throw error
  }
}

/**
 * 🟢 Lấy chi tiết variant theo ID - NEW API
 */
export const getVariantByIdApi = async (id: string) => {
  console.log('=== GET VARIANT BY ID ===')
  console.log('Variant ID:', id)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('Full URL:', `${import.meta.env.VITE_API_URL}/product-variants/${id}`)
  console.log('==========================')

  try {
    const response = await axiosHttpClient.get<IApiResponse<ProductVariant>>(
      `/product-variants/${id}`,
    )
    console.log('✅ Get variant by id success:', response)
    console.log('📦 Variant data structure:', {
      id: response.id,
      colorName: response.colorName || response.color?.name,
      size: response.size,
      price: response.price,
      stock: response.stock,
      imagesCount: response.images?.length || 0,
    })
    return response
  } catch (error) {
    console.error('❌ Get variant by id error:', error)
    throw error
  }
}

/**
 * 🟢 Lấy variant kèm product theo ID (dùng khi cần truy ngược lại thông tin sản phẩm)
 */
export const getVariantWithProductByIdApi = async (id: string) => {
  console.log('=== GET VARIANT WITH PRODUCT ===')
  console.log('Variant ID:', id)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('Full URL:', `${import.meta.env.VITE_API_URL}/product-variants/${id}/with-product`)
  console.log('==========================')

  try {
    const response = await axiosHttpClient.get<IApiResponse<ProductVariantWithProduct>>(
      `/product-variants/${id}/with-product`,
    )
    console.log('✅ Get variant with product success:', response)
    console.log('📦 Variant with product data:', {
      variantId: response.id,
      productId: response.product?.id,
      productName: response.product?.name,
      colorName: response.colorName || response.color?.name,
      size: response.size,
      price: response.price,
      imagesCount: response.images?.length || 0,
    })
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
// export const createProductApi = async (formData: Partial<Product>) => {
//   console.log('=== CREATE PRODUCT ===')
//   console.log('Form Data:', formData)

//   const currentUser = getCurrentUser()
//   console.log('Current User:', currentUser)

//   try {
//     const response = await axiosHttpClient.post<IApiResponse<Product>>('/products', formData)
//     console.log('✅ Create product success:', response)
//     return response
//   } catch (error) {
//     console.error('❌ Create product error:', error)
//     throw error
//   }
// }
export const createProductApi = async (formData: FormData) => {
  console.log("=== CREATE PRODUCT ===");
  console.log("Form Data:", formData);

  const currentUser = getCurrentUser();
  console.log("Current User:", currentUser);

  try {
    const response = await axiosHttpClient.post<IApiResponse<Product>>(
      "/products",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("✅ Create product success:", response);
    return response;
  } catch (error) {
    console.error("❌ Create product error:", error);
    throw error;
  }
};

/**
 * 🟡 Cập nhật sản phẩm theo ID
 */
// export const updateProductApi = async (id: string, formData: Partial<Product>) => {
//   console.log('=== UPDATE PRODUCT ===')
//   console.log('Product ID:', id)
//   console.log('Form Data:', formData)

//   const currentUser = getCurrentUser()
//   console.log('Current User:', currentUser)

//   try {
//     const response = await axiosHttpClient.put<IApiResponse<Product>>(
//       `/products/${id}`,
//       formData
//     )
//     console.log('✅ Update product success:', response)
//     return response
//   } catch (error) {
//     console.error('❌ Update product error:', error)
//     throw error
//   }
// }
export const updateProductApi = async (id: string, formData: FormData) => {
  console.log("=== UPDATE PRODUCT ===");
  console.log("Product ID:", id);
  console.log("Form Data:", formData);

  const currentUser = getCurrentUser();
  console.log("Current User:", currentUser);

  try {
    const response = await axiosHttpClient.put<IApiResponse<Product>>(
      `/products/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("✅ Update product success:", response);
    return response;
  } catch (error) {
    console.error("❌ Update product error:", error);
    throw error;
  }
};

/**
 * 🟢 Tìm sản phẩm dựa trên ảnh (CBIR)
 */
export const searchProductsByImageApi = async (file: File) => {
  console.log('=== SEARCH PRODUCTS BY IMAGE ===')
  console.log('File:', file)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('Full URL:', `${import.meta.env.VITE_API_URL}/products/search-image`)
  console.log('===============================')

  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await axiosHttpClient.post<IApiResponse<Product[]>>(
      '/products/search-image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    console.log('✅ Search products by image success:', response)
    return response
  } catch (error) {
    console.error('❌ Search products by image error:', error)
    throw error
  }
}
/**
 * 🤖 Tìm kiếm sản phẩm bằng AI
 * POST /api/products/ai/search
 */
export const searchProductsWithAiApi = async (searchRequest: AiSearchRequest) => {
  console.log('=== AI SEARCH PRODUCTS ===')
  console.log('Search Request:', searchRequest)
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('Full URL:', `${import.meta.env.VITE_API_URL}/products/ai/search`)
  console.log('===========================')

  // Validate required fields
  if (!searchRequest.query || searchRequest.query.trim() === '') {
    throw new Error('Query is required for AI search')
  }

  // Create clean request object with defaults
  const cleanRequest: AiSearchRequest = {
    query: searchRequest.query.trim(),
    threshold: searchRequest.threshold || 0.3,
    max_candidates: searchRequest.max_candidates || 10,
    rerank: searchRequest.rerank !== undefined ? searchRequest.rerank : true,
  }

  console.log('Clean AI search request:', cleanRequest)

  try {
    const response = await axiosHttpClient.post<AiSearchResponse>(
      '/products/ai/search',
      cleanRequest,
    )

    console.log('✅ AI search success:', response)
    console.log('🎯 Search results summary:', {
      mode: response.mode,
      resultsCount: response.results?.length || 0,
      topScore: response.results?.[0]?.score || 0,
      productIds: response.results?.map((r) => r.product_id) || [],
    })

    return response
  } catch (error: any) {
    console.error('❌ AI search error:', error)

    if (error?.response?.data) {
      console.error('📍 AI search error details:', {
        status: error.response.status,
        data: error.response.data,
        query: cleanRequest.query,
      })
    }

    throw error
  }
}

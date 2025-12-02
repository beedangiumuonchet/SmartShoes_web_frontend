import { AxiosHttpClient } from '@/common/utils/axios'
import type { IApiResponse } from '@/common/types'
import type { Promotion, PromotionForm, PromotionProductRequest, PromotionProductVariant } from './promotion.type'
import { useCookies } from '@vueuse/integrations/useCookies'
import { getCurrentUser } from '@/common/guards/roleGuard.guard'

const axiosHttpClient = new AxiosHttpClient(import.meta.env.VITE_API_URL)
const cookie = useCookies(['jwt_token'])

const BASE_URL = '/promotions'
const PROMOTION_PRODUCT_URL = '/promotion-products'

export const getAllPromotionsApi = async () => {
  console.log('=== GET ALL PROMOTIONS ===')
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('Full URL:', `${import.meta.env.VITE_API_URL}${BASE_URL}`)
  console.log('==========================')

  try {
    const response = await axiosHttpClient.get<IApiResponse<Promotion[]>>(BASE_URL)
    console.log('✅ Get all promotions success:', response)
    return response
  } catch (error) {
    console.error('❌ Get all promotions error:', error)
    throw error
  }
}

export const getPromotionByIdApi = async (id: string) => {
  console.log('=== GET PROMOTION BY ID ===')
  console.log('Promotion ID:', id)
  console.log('===========================')

  try {
    const response = await axiosHttpClient.get<IApiResponse<Promotion>>(`${BASE_URL}/${id}`)
    console.log('✅ Get promotion by id success:', response)
    return response
  } catch (error) {
    console.error('❌ Get promotion by id error:', error)
    throw error
  }
}

export const createPromotionApi = async (form: PromotionForm) => {
  console.log('=== CREATE PROMOTION ===')
  console.log('Form Data:', form)

  const currentUser = getCurrentUser()
  console.log('Current User:', currentUser)

  try {
    const response = await axiosHttpClient.post<IApiResponse<Promotion>, PromotionForm>(BASE_URL, form)
    console.log('✅ Create promotion success:', response)
    return response
  } catch (error) {
    console.error('❌ Create promotion error:', error)
    throw error
  }
}

export const updatePromotionApi = async (id: string, form: PromotionForm) => {
  console.log('=== UPDATE PROMOTION ===')
  console.log('Promotion ID:', id)
  console.log('Form Data:', form)
  console.log('========================')

  try {
    const response = await axiosHttpClient.put<IApiResponse<Promotion>, PromotionForm>(`${BASE_URL}/${id}`, form)
    console.log('✅ Update promotion success:', response)
    return response
  } catch (error) {
    console.error('❌ Update promotion error:', error)
    throw error
  }
}

export const deletePromotionApi = async (id: string) => {
  console.log('=== DELETE PROMOTION ===')
  console.log('Promotion ID:', id)
  console.log('========================')

  try {
    const response = await axiosHttpClient.delete<IApiResponse<void>>(`${BASE_URL}/${id}`)
    console.log('✅ Delete promotion success:', response)
    return response
  } catch (error) {
    console.error('❌ Delete promotion error:', error)
    throw error
  }
}

export const createPromotionProductApi = async (form: PromotionProductRequest) => {
  console.log('=== CREATE PROMOTION PRODUCT ===')
  console.log('Form Data:', form)
  console.log('=================================')

  try {
    const response = await axiosHttpClient.post<
      IApiResponse<PromotionProductVariant>,
      PromotionProductRequest
    >(PROMOTION_PRODUCT_URL, form)

    console.log('✅ Create promotion-product success:', response)
    return response
  } catch (error) {
    console.error('❌ Create promotion-product error:', error)
    throw error
  }
}

export const getPromotionProductByIdApi = async (id: string) => {
  console.log('=== GET PROMOTION PRODUCT BY ID ===')
  console.log('ID:', id)
  console.log('===================================')

  try {
    const response = await axiosHttpClient.get<IApiResponse<PromotionProductVariant>>(
      `${PROMOTION_PRODUCT_URL}/${id}`,
    )
    console.log('✅ Get promotion-product success:', response)
    return response
  } catch (error) {
    console.error('❌ Get promotion-product error:', error)
    throw error
  }
}

export const getAllPromotionProductsApi = async () => {
  console.log('=== GET ALL PROMOTION PRODUCTS ===')

  try {
    const response = await axiosHttpClient.get<IApiResponse<PromotionProductVariant[]>>(
      PROMOTION_PRODUCT_URL,
    )
    console.log('✅ Get all promotion-products success:', response)
    return response
  } catch (error) {
    console.error('❌ Get all promotion-products error:', error)
    throw error
  }
}

export const getPromotionProductsByPromotionIdApi = async (promotionId: string) => {
  console.log('=== GET PROMOTION PRODUCTS BY PROMOTION ID ===')
  console.log('Promotion ID:', promotionId)
  console.log('==============================================')

  try {
    const response = await axiosHttpClient.get<IApiResponse<PromotionProductVariant[]>>(
      `${PROMOTION_PRODUCT_URL}/promotion/${promotionId}`,
    )
    console.log('✅ Get by promotionId success:', response)
    return response
  } catch (error) {
    console.error('❌ Get by promotionId error:', error)
    throw error
  }
}

export const getPromotionProductsByVariantIdApi = async (productVariantId: string) => {
  console.log('=== GET PROMOTION PRODUCTS BY VARIANT ID ===')
  console.log('Variant ID:', productVariantId)
  console.log('============================================')

  try {
    const response = await axiosHttpClient.get<IApiResponse<PromotionProductVariant[]>>(
      `${PROMOTION_PRODUCT_URL}/variant/${productVariantId}`,
    )
    console.log('✅ Get by variantId success:', response)
    return response
  } catch (error) {
    console.error('❌ Get by variantId error:', error)
    throw error
  }
}

export const deletePromotionProductApi = async (id: string) => {
  console.log('=== DELETE PROMOTION PRODUCT ===')
  console.log('ID:', id)
  console.log('================================')

  try {
    const response = await axiosHttpClient.delete<IApiResponse<void>>(
      `${PROMOTION_PRODUCT_URL}/${id}`,
    )
    console.log('✅ Delete promotion-product success:', response)
    return response
  } catch (error) {
    console.error('❌ Delete promotion-product error:', error)
    throw error
  }
}



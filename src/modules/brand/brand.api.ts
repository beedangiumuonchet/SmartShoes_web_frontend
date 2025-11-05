import { AxiosHttpClient } from '@/common/utils/axios'
import type { IApiResponse } from '@/common/types'
import type { Brand, BrandForm } from './brand.type'
import { useCookies } from '@vueuse/integrations/useCookies'
import { getCurrentUser } from '@/common/guards/roleGuard.guard'

const axiosHttpClient = new AxiosHttpClient(import.meta.env.VITE_API_URL)
const cookie = useCookies(['jwt_token'])

/**
 * 🟢 Lấy tất cả thương hiệu
 */
export const getAllBrandsApi = async () => {
  console.log('=== GET ALL BRANDS ===')
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('Full URL:', `${import.meta.env.VITE_API_URL}/brands`)
  console.log('=======================')

  try {
    const response = await axiosHttpClient.get<IApiResponse<Brand[]>>('/brands')
    console.log('✅ Get all brands success:', response)
    return response
  } catch (error) {
    console.error('❌ Get all brands error:', error)
    throw error
  }
}

/**
 * 🟢 Lấy chi tiết thương hiệu theo ID
 */
export const getBrandByIdApi = async (id: string) => {
  console.log('=== GET BRAND BY ID ===')
  console.log('Brand ID:', id)
  console.log('=======================')

  try {
    const response = await axiosHttpClient.get<IApiResponse<Brand>>(`/brands/${id}`)
    console.log('✅ Get brand by id success:', response)
    return response
  } catch (error) {
    console.error('❌ Get brand by id error:', error)
    throw error
  }
}

/**
 * 🟢 Tạo mới thương hiệu
 */
export const createBrandApi = async (form: BrandForm) => {
  console.log('=== CREATE BRAND ===')
  console.log('Form Data:', form)

  const currentUser = getCurrentUser()
  console.log('Current User:', currentUser)

  try {
    const response = await axiosHttpClient.post<IApiResponse<Brand>, BrandForm>('/brands', form)
    console.log('✅ Create brand success:', response)
    return response
  } catch (error) {
    console.error('❌ Create brand error:', error)
    throw error
  }
}

/**
 * 🟢 Cập nhật thương hiệu theo ID
 */
export const updateBrandApi = async (id: string, form: BrandForm) => {
  console.log('=== UPDATE BRAND ===')
  console.log('Brand ID:', id)
  console.log('Form Data:', form)
  console.log('=====================')

  try {
    const response = await axiosHttpClient.put<IApiResponse<Brand>, BrandForm>(`/brands/${id}`, form)
    console.log('✅ Update brand success:', response)
    return response
  } catch (error) {
    console.error('❌ Update brand error:', error)
    throw error
  }
}

/**
 * 🟢 Xoá thương hiệu theo ID
 */
export const deleteBrandApi = async (id: string) => {
  console.log('=== DELETE BRAND ===')
  console.log('Brand ID:', id)
  console.log('====================')

  try {
    const response = await axiosHttpClient.delete<IApiResponse<void>>(`/brands/${id}`)
    console.log('✅ Delete brand success:', response)
    return response
  } catch (error) {
    console.error('❌ Delete brand error:', error)
    throw error
  }
}

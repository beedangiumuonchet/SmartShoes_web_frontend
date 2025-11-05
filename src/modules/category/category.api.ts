// src/modules/category/api/category.api.ts
import { AxiosHttpClient } from '@/common/utils/axios'
import type { IApiResponse } from '@/common/types'
import type { Category, CategoryForm } from './category.type'
import { useCookies } from '@vueuse/integrations/useCookies'
import { getCurrentUser } from '@/common/guards/roleGuard.guard'

const axiosHttpClient = new AxiosHttpClient(import.meta.env.VITE_API_URL)
const cookie = useCookies(['jwt_token'])

/**
 * 🟢 Lấy tất cả danh mục
 */
export const getAllCategoriesApi = async () => {
  console.log('=== GET ALL CATEGORIES ===')
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('Full URL:', `${import.meta.env.VITE_API_URL}/categories`)
  console.log('==========================')

  try {
    const response = await axiosHttpClient.get<IApiResponse<Category[]>>('/categories')
    console.log('✅ Get all categories success:', response)
    return response
  } catch (error) {
    console.error('❌ Get all categories error:', error)
    throw error
  }
}

/**
 * 🟢 Lấy chi tiết danh mục theo ID
 */
export const getCategoryByIdApi = async (id: string) => {
  console.log('=== GET CATEGORY BY ID ===')
  console.log('Category ID:', id)
  console.log('==========================')

  try {
    const response = await axiosHttpClient.get<IApiResponse<Category>>(`/categories/${id}`)
    console.log('✅ Get category by id success:', response)
    return response
  } catch (error) {
    console.error('❌ Get category by id error:', error)
    throw error
  }
}

/**
 * 🟢 Tạo mới danh mục
 */
export const createCategoryApi = async (form: CategoryForm) => {
  console.log('=== CREATE CATEGORY ===')
  console.log('Form Data:', form)

  const currentUser = getCurrentUser()
  console.log('Current User:', currentUser)

  try {
    const response = await axiosHttpClient.post<IApiResponse<Category>, CategoryForm>('/categories', form)
    console.log('✅ Create category success:', response)
    return response
  } catch (error) {
    console.error('❌ Create category error:', error)
    throw error
  }
}

/**
 * 🟢 Cập nhật danh mục theo ID
 */
export const updateCategoryApi = async (id: string, form: CategoryForm) => {
  console.log('=== UPDATE CATEGORY ===')
  console.log('Category ID:', id)
  console.log('Form Data:', form)
  console.log('========================')

  try {
    const response = await axiosHttpClient.put<IApiResponse<Category>, CategoryForm>(`/categories/${id}`, form)
    console.log('✅ Update category success:', response)
    return response
  } catch (error) {
    console.error('❌ Update category error:', error)
    throw error
  }
}

/**
 * 🟢 Xoá danh mục theo ID
 */
export const deleteCategoryApi = async (id: string) => {
  console.log('=== DELETE CATEGORY ===')
  console.log('Category ID:', id)
  console.log('========================')

  try {
    const response = await axiosHttpClient.delete<IApiResponse<void>>(`/categories/${id}`)
    console.log('✅ Delete category success:', response)
    return response
  } catch (error) {
    console.error('❌ Delete category error:', error)
    throw error
  }
}

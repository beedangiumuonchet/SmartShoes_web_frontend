// api/category.api.ts
import { AxiosHttpClient } from '@/common/utils/axios'
import type { IApiResponse } from '@/common/types'
import type { Category, CategoryForm } from './category.type'

const axiosHttpClient = new AxiosHttpClient(import.meta.env.VITE_API_URL)
const BASE_URL = '/api/categories'

export const getAllCategories = async () => {
  return axiosHttpClient.get<IApiResponse<Category[]>>(BASE_URL)
}

export const getCategoryById = async (id: string) => {
  return axiosHttpClient.get<IApiResponse<Category>>(`${BASE_URL}/${id}`)
}

export const createCategory = async (form: CategoryForm) => {
  return axiosHttpClient.post<IApiResponse<Category>, CategoryForm>(BASE_URL, form)
}

export const updateCategory = async (id: string, form: CategoryForm) => {
  return axiosHttpClient.put<IApiResponse<Category>, CategoryForm>(`${BASE_URL}/${id}`, form)
}

export const deleteCategory = async (id: string) => {
  return axiosHttpClient.delete<IApiResponse<void>>(`${BASE_URL}/${id}`)
}

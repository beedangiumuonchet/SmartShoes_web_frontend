// api/brand.api.ts
import { AxiosHttpClient } from '@/common/utils/axios'
import type { IApiResponse } from '@/common/types'
import type { Brand, BrandForm } from './brand.type'

const axiosHttpClient = new AxiosHttpClient(import.meta.env.VITE_API_URL)
const BASE_URL = '/api/brands'

export const getAllBrands = async () => {
  return axiosHttpClient.get<IApiResponse<Brand[]>>(BASE_URL)
}

export const getBrandById = async (id: string) => {
  return axiosHttpClient.get<IApiResponse<Brand>>(`${BASE_URL}/${id}`)
}

export const createBrand = async (form: BrandForm) => {
  return axiosHttpClient.post<IApiResponse<Brand>, BrandForm>(BASE_URL, form)
}

export const updateBrand = async (id: string, form: BrandForm) => {
  return axiosHttpClient.put<IApiResponse<Brand>, BrandForm>(`${BASE_URL}/${id}`, form)
}

export const deleteBrand = async (id: string) => {
  return axiosHttpClient.delete<IApiResponse<void>>(`${BASE_URL}/${id}`)
}

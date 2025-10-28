// api/promotion.api.ts
import { AxiosHttpClient } from '@/common/utils/axios'
import type { IApiResponse } from '@/common/types'
import type { Promotion, PromotionForm } from './promotion.type'

const axiosHttpClient = new AxiosHttpClient(import.meta.env.VITE_API_URL)
const BASE_URL = '/api/promotions'

export const getAllPromotions = async () => {
  return axiosHttpClient.get<IApiResponse<Promotion[]>>(BASE_URL)
}

export const getPromotionById = async (id: string) => {
  return axiosHttpClient.get<IApiResponse<Promotion>>(`${BASE_URL}/${id}`)
}

export const createPromotion = async (form: PromotionForm) => {
  return axiosHttpClient.post<IApiResponse<Promotion>, PromotionForm>(BASE_URL, form)
}

export const updatePromotion = async (id: string, form: PromotionForm) => {
  return axiosHttpClient.put<IApiResponse<Promotion>, PromotionForm>(`${BASE_URL}/${id}`, form)
}

export const deletePromotion = async (id: string) => {
  return axiosHttpClient.delete<IApiResponse<void>>(`${BASE_URL}/${id}`)
}

// api/color.api.ts
import { AxiosHttpClient } from '@/common/utils/axios'
import type { IApiResponse } from '@/common/types'
import type { Color, ColorForm } from './color.type'

const axiosHttpClient = new AxiosHttpClient(import.meta.env.VITE_API_URL)
const BASE_URL = '/api/colors'

export const getAllColors = async () => {
  return axiosHttpClient.get<IApiResponse<Color[]>>(BASE_URL)
}

export const getColorById = async (id: string) => {
  return axiosHttpClient.get<IApiResponse<Color>>(`${BASE_URL}/${id}`)
}

export const createColor = async (form: ColorForm) => {
  return axiosHttpClient.post<IApiResponse<Color>, ColorForm>(BASE_URL, form)
}

export const updateColor = async (id: string, form: ColorForm) => {
  return axiosHttpClient.put<IApiResponse<Color>, ColorForm>(`${BASE_URL}/${id}`, form)
}

export const deleteColor = async (id: string) => {
  return axiosHttpClient.delete<IApiResponse<void>>(`${BASE_URL}/${id}`)
}

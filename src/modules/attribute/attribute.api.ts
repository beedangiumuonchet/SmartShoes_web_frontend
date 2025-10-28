// api/attribute.api.ts
import { AxiosHttpClient } from '@/common/utils/axios'
import type { IApiResponse } from '@/common/types'
import type { Attribute, AttributeForm } from './attribute.type'

const axiosHttpClient = new AxiosHttpClient(import.meta.env.VITE_API_URL)
const BASE_URL = '/api/attributes'

export const getAllAttributes = async () => {
  return axiosHttpClient.get<IApiResponse<Attribute[]>>(BASE_URL)
}

export const getAttributeById = async (id: string) => {
  return axiosHttpClient.get<IApiResponse<Attribute>>(`${BASE_URL}/${id}`)
}

export const createAttribute = async (form: AttributeForm) => {
  return axiosHttpClient.post<IApiResponse<Attribute>, AttributeForm>(BASE_URL, form)
}

export const updateAttribute = async (id: string, form: AttributeForm) => {
  return axiosHttpClient.put<IApiResponse<Attribute>, AttributeForm>(`${BASE_URL}/${id}`, form)
}

export const deleteAttribute = async (id: string) => {
  return axiosHttpClient.delete<IApiResponse<void>>(`${BASE_URL}/${id}`)
}

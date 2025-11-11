import { AxiosHttpClient } from '@/common/utils/axios'
import type { IApiResponse } from '@/common/types'
import type { Color, ColorForm } from './color.type'
import { useCookies } from '@vueuse/integrations/useCookies'
import { getCurrentUser } from '@/common/guards/roleGuard.guard'

const axiosHttpClient = new AxiosHttpClient(import.meta.env.VITE_API_URL)
const cookie = useCookies(['jwt_token'])

const BASE_URL = '/colors'

export const getAllColorsApi = async () => {
  console.log('=== GET ALL COLORS ===')
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('Full URL:', `${import.meta.env.VITE_API_URL}${BASE_URL}`)
  console.log('======================')

  try {
    const response = await axiosHttpClient.get<IApiResponse<Color[]>>(BASE_URL)
    console.log('✅ Get all colors success:', response)
    return response
  } catch (error) {
    console.error('❌ Get all colors error:', error)
    throw error
  }
}

export const getColorByIdApi = async (id: string) => {
  console.log('=== GET COLOR BY ID ===')
  console.log('Color ID:', id)
  console.log('=======================')

  try {
    const response = await axiosHttpClient.get<IApiResponse<Color>>(`${BASE_URL}/${id}`)
    console.log('✅ Get color by id success:', response)
    return response
  } catch (error) {
    console.error('❌ Get color by id error:', error)
    throw error
  }
}

export const createColorApi = async (form: ColorForm) => {
  console.log('=== CREATE COLOR ===')
  console.log('Form Data:', form)

  const currentUser = getCurrentUser()
  console.log('Current User:', currentUser)

  try {
    const response = await axiosHttpClient.post<IApiResponse<Color>, ColorForm>(BASE_URL, form)
    console.log('✅ Create color success:', response)
    return response
  } catch (error) {
    console.error('❌ Create color error:', error)
    throw error
  }
}

export const updateColorApi = async (id: string, form: ColorForm) => {
  console.log('=== UPDATE COLOR ===')
  console.log('Color ID:', id)
  console.log('Form Data:', form)
  console.log('====================')

  try {
    const response = await axiosHttpClient.put<IApiResponse<Color>, ColorForm>(`${BASE_URL}/${id}`, form)
    console.log('✅ Update color success:', response)
    return response
  } catch (error) {
    console.error('❌ Update color error:', error)
    throw error
  }
}

export const deleteColorApi = async (id: string) => {
  console.log('=== DELETE COLOR ===')
  console.log('Color ID:', id)
  console.log('====================')

  try {
    const response = await axiosHttpClient.delete<IApiResponse<void>>(`${BASE_URL}/${id}`)
    console.log('✅ Delete color success:', response)
    return response
  } catch (error) {
    console.error('❌ Delete color error:', error)
    throw error
  }
}

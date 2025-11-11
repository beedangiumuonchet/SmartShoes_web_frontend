import { AxiosHttpClient } from '@/common/utils/axios'
import type { IApiResponse } from '@/common/types'
import type { Attribute, AttributeForm } from './attribute.type'
import { useCookies } from '@vueuse/integrations/useCookies'
import { getCurrentUser } from '@/common/guards/roleGuard.guard'

const axiosHttpClient = new AxiosHttpClient(import.meta.env.VITE_API_URL)
const cookie = useCookies(['jwt_token'])

const BASE_URL = '/attributes'

export const getAllAttributesApi = async () => {
  console.log('=== GET ALL ATTRIBUTES ===')
  console.log('Token exists:', !!cookie.get('jwt_token'))
  console.log('Full URL:', `${import.meta.env.VITE_API_URL}${BASE_URL}`)
  console.log('===========================')

  try {
    const response = await axiosHttpClient.get<IApiResponse<Attribute[]>>(BASE_URL)
    console.log('✅ Get all attributes success:', response)
    return response
  } catch (error) {
    console.error('❌ Get all attributes error:', error)
    throw error
  }
}

export const getAttributeByIdApi = async (id: string) => {
  console.log('=== GET ATTRIBUTE BY ID ===')
  console.log('Attribute ID:', id)
  console.log('===========================')

  try {
    const response = await axiosHttpClient.get<IApiResponse<Attribute>>(`${BASE_URL}/${id}`)
    console.log('✅ Get attribute by id success:', response)
    return response
  } catch (error) {
    console.error('❌ Get attribute by id error:', error)
    throw error
  }
}

export const createAttributeApi = async (form: AttributeForm) => {
  console.log('=== CREATE ATTRIBUTE ===')
  console.log('Form Data:', form)

  const currentUser = getCurrentUser()
  console.log('Current User:', currentUser)

  try {
    const response = await axiosHttpClient.post<IApiResponse<Attribute>, AttributeForm>(BASE_URL, form)
    console.log('✅ Create attribute success:', response)
    return response
  } catch (error) {
    console.error('❌ Create attribute error:', error)
    throw error
  }
}

export const updateAttributeApi = async (id: string, form: AttributeForm) => {
  console.log('=== UPDATE ATTRIBUTE ===')
  console.log('Attribute ID:', id)
  console.log('Form Data:', form)
  console.log('========================')

  try {
    const response = await axiosHttpClient.put<IApiResponse<Attribute>, AttributeForm>(`${BASE_URL}/${id}`, form)
    console.log('✅ Update attribute success:', response)
    return response
  } catch (error) {
    console.error('❌ Update attribute error:', error)
    throw error
  }
}

export const deleteAttributeApi = async (id: string) => {
  console.log('=== DELETE ATTRIBUTE ===')
  console.log('Attribute ID:', id)
  console.log('========================')

  try {
    const response = await axiosHttpClient.delete<IApiResponse<void>>(`${BASE_URL}/${id}`)
    console.log('✅ Delete attribute success:', response)
    return response
  } catch (error) {
    console.error('❌ Delete attribute error:', error)
    throw error
  }
}

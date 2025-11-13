import { AxiosHttpClient } from '@/common/utils/axios'
import type { IApiResponse } from '@/common/types'

const axiosHttpClient = new AxiosHttpClient(import.meta.env.VITE_API_URL)
const BASE_URL = 'v1/drive/upload'

/**
 * Upload file (image) lên server
 * @param file File object từ input
 * @returns IApiResponse<string> chứa URL hoặc ID file
 */
export const uploadImageApi = async (file: File) => {
  console.log('=== UPLOAD IMAGE ===')
  console.log('File name:', file.name)
  console.log('File size:', file.size)
  console.log('File type:', file.type)
  console.log('====================')

  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await axiosHttpClient.post<IApiResponse<string>, FormData>(
      BASE_URL,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    console.log('✅ Upload image success:', response)
    return response
  } catch (error) {
    console.error('❌ Upload image error:', error)
    throw error
  }
}

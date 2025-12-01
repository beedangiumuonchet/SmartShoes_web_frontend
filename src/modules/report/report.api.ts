import { AxiosHttpClient } from '@/common/utils/axios'
import type { TopProductDTO } from '../products/product.type';

const axiosHttpClient = new AxiosHttpClient(import.meta.env.VITE_API_URL);

export const getTopProductsApi = async (
  startDate: string,
  endDate: string,
  limit = 10
): Promise<TopProductDTO[]> => {
  const response = await axiosHttpClient.get<TopProductDTO[]>('/reports/top-products', {
    params: { startDate, endDate, limit },
  });

  return response;
};

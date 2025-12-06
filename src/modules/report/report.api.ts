import { AxiosHttpClient } from '@/common/utils/axios'
import type { TopProductDTO } from '../products/product.type'
import type { TopCustomerDTO } from '../users/users.type'

const axiosHttpClient = new AxiosHttpClient(import.meta.env.VITE_API_URL)

export const getTopProductsApi = async (
  startDate: string,
  endDate: string,
  limit = 10,
): Promise<TopProductDTO[]> => {
  const response = await axiosHttpClient.get<TopProductDTO[]>('/reports/top-products', {
    params: { startDate, endDate, limit },
  })

  return response
}
/**
 * ✅ THÊM MỚI - API để lấy báo cáo top customers
 * BE: GET /reports/top-customers
 */
export const getTopCustomersApi = async (
  startDate: string,
  endDate: string,
  limit = 10,
): Promise<TopCustomerDTO[]> => {
  console.log('=== GET TOP CUSTOMERS REPORT ===')
  console.log('Request params:', { startDate, endDate, limit })
  console.log('Full endpoint:', `${import.meta.env.VITE_API_URL}/reports/top-customers`)
  console.log('====================================')

  try {
    const response = await axiosHttpClient.get<TopCustomerDTO[]>('/reports/top-customers', {
      params: {
        startDate, // LocalDateTime format: 2024-01-01T00:00:00
        endDate, // LocalDateTime format: 2024-12-31T23:59:59
        limit, // int (default 10)
      },
    })

    console.log('✅ Top customers report loaded successfully:', {
      totalCustomers: response.length,
      dateRange: { startDate, endDate },
      limit,
      topCustomer: response[0]
        ? {
            customerName: `${response[0].customer.firstName} ${response[0].customer.lastName}`,
            email: response[0].customer.email,
            totalOrders: response[0].totalOrders,
            totalSpent: response[0].totalSpent,
          }
        : null,
    })

    return response
  } catch (error: any) {
    console.error('❌ Error fetching top customers report:', error)

    // Enhanced error handling
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message)
    } else if (error?.response?.status === 400) {
      throw new Error('Tham số ngày tháng không hợp lệ')
    } else if (error?.response?.status === 401) {
      throw new Error('Không có quyền truy cập báo cáo')
    } else if (error?.message) {
      throw new Error(error.message)
    } else {
      throw new Error('Không thể tải báo cáo top khách hàng')
    }
  }
}

/**
 * ✅ THÊM MỚI - Helper function để format date cho API
 */
export const formatDateTimeForReport = (date: Date): string => {
  // Format để gửi cho BE: 2024-01-01T00:00:00
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}

/**
 * ✅ THÊM MỚI - Helper function để tạo date range cho report
 */
export const createReportDateRange = (
  startDate: Date,
  endDate: Date,
): { startDate: string; endDate: string } => {
  // Set start date to beginning of day
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)

  // Set end date to end of day
  const end = new Date(endDate)
  end.setHours(23, 59, 59, 999)

  return {
    startDate: formatDateTimeForReport(start),
    endDate: formatDateTimeForReport(end),
  }
}

/**
 * ✅ THÊM MỚI - Helper function để format tiền tệ VND
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * ✅ THÊM MỚI - Helper function để format customer name
 */
export const formatCustomerName = (customer: TopCustomerDTO['customer']): string => {
  const firstName = customer.firstName || ''
  const lastName = customer.lastName || ''
  const fullName = `${firstName} ${lastName}`.trim()

  // Fallback to username or email if no name
  return fullName || customer.username || customer.email || 'Khách hàng ẩn danh'
}

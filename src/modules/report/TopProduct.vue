<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b border-gray-200 mb-6">
      <div class="px-6 py-4 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Top Sản Phẩm Bán Chạy</h1>
          <p class="text-gray-600 mt-1">Báo cáo thống kê các sản phẩm bán chạy theo thời gian</p>
        </div>
        <div class="flex items-center space-x-3">
          <div class="flex items-center space-x-2">
            <button
              @click="exportExcel"
              :disabled="loading || !topProducts.length"
              class="inline-flex items-center px-3 py-2 border border-green-300 shadow-sm text-sm leading-4 font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 disabled:opacity-50 transition-colors"
              title="Xuất file Excel"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Excel
            </button>

            <button
              @click="openPrintPage"
              :disabled="loading || !topProducts.length"
              class="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50 transition-colors"
              title="Xuất file PDF"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              PDF
            </button>
          </div>
          <select
            v-model="selectedLimit"
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option :value="5">Top 5</option>
            <option :value="10">Top 10</option>
            <option :value="15">Top 15</option>
            <option :value="20">Top 20</option>
          </select>

          <input
            type="date"
            v-model="startDate"
            class="px-3 py-2 border rounded-md"
          />
          <input
            type="date"
            v-model="endDate"
            class="px-3 py-2 border rounded-md"
          />

          <button
            @click="fetchTopProducts"
            :disabled="loading"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md 
                   text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <svg
              :class="['w-4 h-4 mr-2', loading ? 'animate-spin' : '']"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Lọc
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 px-6">
      <div class="bg-blue-50 rounded-lg p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg
              class="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-blue-600">Tổng số lượng sản phẩm đã bán</p>
            <p class="text-2xl font-bold text-blue-900">{{ totalSoldQuantity  }}</p>
          </div>
        </div>
      </div>

      <div class="bg-green-50 rounded-lg p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg
              class="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-green-600">Tổng doanh thu</p>
            <p class="text-2xl font-bold text-green-900">{{ formatPrice(totalRevenue)  }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Products Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 mx-6 mb-6">
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-900">Danh sách sản phẩm</h2>
        <p class="text-sm text-gray-500">({{ topProducts.length }} kết quả)</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-12 text-center">
        <div class="inline-flex items-center space-x-2">
          <svg
            class="w-5 h-5 animate-spin text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span class="text-gray-600">Đang tải dữ liệu...</span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!topProducts.length" class="p-12 text-center text-gray-600">
        Không có sản phẩm nào để hiển thị.
      </div>

      <!-- Products Grid/Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Xếp hạng</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sản phẩm</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thương hiệu</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thể loại</th>
              <!-- <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phân loại</th> -->
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng bán</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doanh thu</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, index) in paginatedProducts" :key="item.product.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    :class="[
                      'flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold text-white',
                      getRankingColor(index + (currentPage - 1) * itemsPerPage),
                    ]"
                  >
                    {{ index + (currentPage - 1) * itemsPerPage + 1 }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.product.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.product.brand.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.product.category.name }}</td>
              <!-- <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ getClassification(item.product.variants) }}</td> -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.totalQuantity }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ item.totalRevenue ? formatPrice(item.totalRevenue) : formatPrice(getMainVariantPrice(item.product.variants)) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="topProducts.length > itemsPerPage" class="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
        <button
          @click="previousPage"
          :disabled="currentPage <= 1"
          class="px-3 py-1 border rounded disabled:opacity-50"
        >
          Trước
        </button>
        <span>Trang {{ currentPage }} / {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="currentPage >= totalPages"
          class="px-3 py-1 border rounded disabled:opacity-50"
        >
          Sau
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getTopProductsApi } from './report.api';
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "@fontsource/noto-sans";

interface ProductVariant {
  id: string;
  price: number;
  priceSale: number;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  brand: { name: string };
  category: { name: string };
  status: string;
  variants: ProductVariant[];
}

interface TopProductItem {
  product: Product;
  totalQuantity: number;
  totalRevenue: number;
}

const topProducts = ref<TopProductItem[]>([]);
const loading = ref(false);
// const selectedPeriod = ref<'week' | 'month' | 'quarter' | 'year'>('week');

// New: Date filters
const formatDate = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0'); // tháng từ 0-11
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth(); // 0-11

// Ngày đầu tháng
const startDate = ref<string>(formatDate(new Date(year, month, 1)));

// Ngày cuối tháng
const endDate = ref<string>(formatDate(new Date(year, month + 1, 0)));


// Thêm biến
const selectedLimit = ref<number>(10); // mặc định top 10

// Pagination
const currentPage = ref(1);
const itemsPerPage = 10;

const fetchTopProducts = async () => {
  loading.value = true;
  try {
    const startISO = new Date(startDate.value + "T00:00:00").toISOString();
    const endISO = new Date(endDate.value + "T23:59:59").toISOString();

    const response = await getTopProductsApi(startISO, endISO, selectedLimit.value);
    topProducts.value = response;
    currentPage.value = 1;
  } finally {
    loading.value = false;
  }
};

const getClassification = (variants: ProductVariant[]) => {
  if (!variants || !variants.length) return "-";
  const v = variants[0];
  return `${v.colorName || "N/A"} - Size ${v.size || "?"}`;
};


const exportExcel = async () => {
  if (!topProducts.value.length) {
    alert("Không có dữ liệu để xuất!");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("TopProducts");

  // Tiêu đề
  const headers = [
    { header: "TenSanPham", key: "TenSanPham", width: 30 },
    { header: "Brand", key: "Brand", width: 20 },
    { header: "Category", key: "Category", width: 20 },
    { header: "SoLuongBan", key: "SoLuongBan", width: 15 },
    { header: "DoanhThu", key: "DoanhThu", width: 20 },
    { header: "TrangThai", key: "TrangThai", width: 15 },
  ];

  worksheet.columns = headers;

  // Tô màu header + kẻ viền + bold
  worksheet.getRow(1).eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4CAF50" }, // xanh lá
    };
    cell.font = { color: { argb: "FFFFFFFF" }, bold: true };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // Thêm dữ liệu
  topProducts.value.forEach((item) => {
    worksheet.addRow({
      TenSanPham: item.product.name,
      Brand: item.product.brand.name,
      Category: item.product.category.name,
      SoLuongBan: item.totalQuantity,
      DoanhThu: item.totalRevenue,
      TrangThai: item.product.status,
    });
  });

  // Kẻ viền cho tất cả các ô dữ liệu
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  // Freeze row đầu tiên
  worksheet.views = [{ state: "frozen", ySplit: 1 }];

  // Định dạng số cho DoanhThu, SoLuongBan
  worksheet.getColumn("DoanhThu").numFmt = "#,##0";
  worksheet.getColumn("SoLuongBan").numFmt = "0";

  // Xuất file
  const buf = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buf]), `TopSanPham_${startDate.value}_to_${endDate.value}.xlsx`);
};

const openPrintPage = () => {
  const url = `/print-report?start=${startDate.value}&end=${endDate.value}&limit=${selectedLimit.value}`;
  window.open(url, "_blank");
};





// Computed totals
const totalQuantity = computed(() => topProducts.value.reduce((sum, item) => sum + item.totalQuantity, 0));
const outOfStock = computed(() => topProducts.value.filter(p => p.product.variants.every(v => v.stock === 0)).length);

// Pagination logic
const totalPages = computed(() => Math.ceil(topProducts.value.length / itemsPerPage));
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return topProducts.value.slice(start, end);
});

// Tổng số lượng sản phẩm đã bán (cộng tất cả quantity)
const totalSoldQuantity = computed(() => 
  topProducts.value.reduce((sum, item) => sum + item.totalQuantity, 0)
);

// Tổng doanh thu (cộng tất cả revenue)
const totalRevenue = computed(() => 
  topProducts.value.reduce((sum, item) => sum + (item.totalRevenue || 0), 0)
);

// Helper functions
const getRankingColor = (rank: number): string => {
  switch (rank) {
    case 0:
      return 'bg-yellow-500' // Gold
    case 1:
      return 'bg-gray-400' // Silver
    case 2:
      return 'bg-yellow-600' // Bronze
    default:
      return 'bg-blue-500' // Default blue
  }
}
const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

// Helpers
const getMainVariantPrice = (variants: ProductVariant[]) => {
  const mainVariant = variants[0];
  return mainVariant?.priceSale || mainVariant?.price || 0;
};
const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

onMounted(fetchTopProducts);
</script>

<style scoped>
/* Optional custom styles */
</style>

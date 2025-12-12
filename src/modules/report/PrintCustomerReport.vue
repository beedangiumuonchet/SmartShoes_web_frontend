<template>
  <div class="report-container">
    
    <!-- Header -->
    <div class="report-header">
      <h1 class="title">BÁO CÁO TOP KHÁCH HÀNG TIỀM NĂNG</h1>

      <div class="meta-grid">
        <div><strong>Từ:</strong> {{ start }}</div>
        <div><strong>Đến:</strong> {{ end }}</div>
        <div><strong>Tổng khách hàng:</strong> {{ list.length }}</div>
        <div><strong>Tổng đơn hàng:</strong> {{ totalOrders }}</div>
        <div><strong>Tổng chi tiêu:</strong> {{ formatCurrency(totalRevenue) }}</div>
        <div><strong>Trung bình/Khách:</strong> {{ formatCurrency(averageSpent) }}</div>
      </div>
    </div>

    <!-- Table -->
    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Tên khách hàng</th>
          <th>Email / Username</th>
          <th>Số đơn hàng</th>
          <th>Tổng chi tiêu</th>
          <th>Trung bình/Đơn</th>
          <th>Trạng thái</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(customer,i) in list" :key="customer.customer.id">
          <td class="center">{{ i + 1 }}</td>
          <td>{{ formatCustomerName(customer.customer) }}</td>
          <td>{{ customer.customer.email }} / {{ customer.customer.username }}</td>
          <td class="right">{{ customer.totalOrders }}</td>
          <td class="right">{{ formatCurrency(customer.totalSpent) }}</td>
          <td class="right">
            {{ customer.totalOrders > 0 ? formatCurrency(customer.totalSpent / customer.totalOrders) : formatCurrency(0) }}
          </td>
          <td class="center">{{ getStatusLabel(customer.customer.status) }}</td>
        </tr>
      </tbody>

      <!-- Footer Total Row -->
      <tfoot>
        <tr>
          <td colspan="3" class="right strong">TỔNG CỘNG</td>
          <td class="right strong">{{ totalOrders }}</td>
          <td class="right strong">{{ formatCurrency(totalRevenue) }}</td>
          <td class="right strong">{{ formatCurrency(averageSpent) }}</td>
          <td></td>
        </tr>
      </tfoot>
    </table>

    <!-- Footer -->
    <div class="footer">
      <em>Ngày xuất: {{ new Date().toLocaleDateString("vi-VN") }}</em>
      <span>Trang 1/1</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { 
  getTopCustomersApi, 
  formatCurrency, 
  formatCustomerName, 
  createReportDateRange 
} from './report.api';

// Helper: hiển thị trạng thái khách hàng
const getStatusLabel = (status: string) => {
  switch(status) {
    case 'ACTIVE': return 'Hoạt động';
    case 'INACTIVE': return 'Không hoạt động';
    case 'BANNED': return 'Bị khóa';
    default: return 'Không rõ';
  }
};

const route = new URLSearchParams(window.location.search);
const start = route.get("start");
const end = route.get("end");
const limit = Number(route.get("limit") ?? 10);

const list = ref<any[]>([]);

onMounted(async () => {
  if (!start || !end) return alert("Thiếu thông tin ngày tháng");

  const { startDate, endDate } = createReportDateRange(new Date(start), new Date(end));
  list.value = await getTopCustomersApi(startDate, endDate, limit);

  // Đặt lại title tab = tên file PDF
  document.title = `TopCustomers_${start}_to_${end}`;

  // Đợi DOM render xong rồi in
  setTimeout(() => window.print(), 400);
});

// Tổng hợp số liệu
const totalOrders = computed(() =>
  list.value.reduce((sum, c) => sum + c.totalOrders, 0)
);
const totalRevenue = computed(() =>
  list.value.reduce((sum, c) => sum + c.totalSpent, 0)
);
const averageSpent = computed(() =>
  list.value.length > 0 ? totalRevenue.value / list.value.length : 0
);
</script>

<style>
@page {
  size: A4;
  margin: 10mm;
}

body {
  font-family: "Arial", sans-serif;
  background: white;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  font-size: 11px;
}

.report-container {
  width: 100%;
}

/* Header */
.title {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 4px;
  column-gap: 20px;
  font-size: 11px;
  margin-bottom: 12px;
}

/* Table Style */
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  background: #1a73e8;
  color: #fff;
  border: 1px solid #ccc;
  padding: 6px;
  font-weight: bold;
}

.table td {
  border: 1px solid #ccc;
  padding: 5px;
}

.center { text-align: center; }
.right { text-align: right; }

.strong {
  font-weight: bold;
  background: #f0f0f0 !important;
}

.table tbody tr:nth-child(even) {
  background: #fafafa;
}

/* Footer */
.footer {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  font-size: 10px;
}
</style>

<template>
  <div class="report-container">
    
    <!-- Header -->
    <div class="report-header">
      <h1 class="title">BÁO CÁO TOP SẢN PHẨM BÁN CHẠY</h1>

      <div class="meta-grid">
        <div><strong>Từ:</strong> {{ start }}</div>
        <div><strong>Đến:</strong> {{ end }}</div>
        <div><strong>Tổng sản phẩm:</strong> {{ list.length }}</div>
        <div><strong>Tổng SL bán:</strong> {{ totalQuantity }}</div>
        <div><strong>Tổng doanh thu:</strong> {{ formatPrice(totalRevenue) }}</div>
      </div>
    </div>

    <!-- Table -->
    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Tên sản phẩm</th>
          <th>Thương hiệu</th>
          <th>Thể loại</th>
          <!-- <th>Phân loại</th> -->
          <th>SL bán</th>
          <th>Doanh thu</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item,i) in list" :key="i">
          <td class="center">{{ i + 1 }}</td>
          <td>{{ item.product.name }}</td>
          <td>{{ item.product.brand.name }}</td>
          <td>{{ item.product.category.name }}</td>
          <!-- <td>{{ getClassification(item.product.variants) }}</td> -->
          <td class="right">{{ item.totalQuantity }}</td>
          <td class="right">{{ formatPrice(item.totalRevenue || 0) }}</td>
        </tr>
      </tbody>

      <!-- Footer Total Row -->
      <tfoot>
        <tr>
          <td colspan="4" class="right strong">TỔNG CỘNG</td>
          <td class="right strong">{{ totalQuantity }}</td>
          <td class="right strong">{{ formatPrice(totalRevenue) }}</td>
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
import { getTopProductsApi } from "./report.api";

const route = new URLSearchParams(window.location.search);
const start = route.get("start");
const end = route.get("end");
const limit = Number(route.get("limit") ?? 10);

const list = ref<any[]>([]);

// 👉 Xử lý phân loại Variant
const getClassification = (variants: any[]) => {
  if (!variants || variants.length === 0) return "-";
  const v = variants[0];
  return `${v.colorName ?? ""} - Size ${v.size ?? ""}`;
};
onMounted(async () => {
  const startISO = new Date(start! + "T00:00:00").toISOString();
  const endISO = new Date(end! + "T23:59:59").toISOString();
  list.value = await getTopProductsApi(startISO, endISO, limit);

  // 👉 Đặt lại title của tab = tên file PDF
  const filename = `TopSanPham_${start}_to_${end}`;
  document.title = filename;

   // 👉 Đợi DOM render xong rồi mới in
  setTimeout(() => {
    window.print();
  }, 400);
});

const totalQuantity = computed(() => list.value.reduce((s,i)=>s+i.totalQuantity,0));
const totalRevenue = computed(() => list.value.reduce((s,i)=>s+(i.totalRevenue||0),0));
const formatPrice = (v:number) => new Intl.NumberFormat("vi-VN",
  { style:"currency", currency:"VND" }
).format(v);


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

.active { color: #0a8800; font-weight: 600; }
.inactive { color: red; font-weight: 600; }

/* Footer */
.footer {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  font-size: 10px;
}
</style>

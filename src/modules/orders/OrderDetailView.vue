<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="flex mb-6" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2">
          <li>
            <router-link to="/" class="text-gray-500 hover:text-rose-500 transition-colors">
              Trang chủ
            </router-link>
          </li>
          <li>
            <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </li>
          <li>
            <router-link to="/orders" class="text-gray-500 hover:text-rose-500 transition-colors">
              Đơn hàng
            </router-link>
          </li>
          <li>
            <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </li>
          <li>
            <span class="text-gray-900 font-medium">Chi tiết đơn hàng</span>
          </li>
        </ol>
      </nav>

      <!-- Header -->
      <div class="mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1
              class="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent"
            >
              Chi Tiết Đơn Hàng
            </h1>
            <p v-if="order" class="mt-2 text-gray-600">
              Mã đơn hàng: <span class="font-medium text-gray-900">#{{ order.id.slice(-8) }}</span>
            </p>
          </div>
          <button
            @click="goBack"
            class="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            Quay lại
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-20">
        <div class="relative">
          <div class="w-16 h-16 mx-auto mb-4">
            <div class="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
            <div
              class="absolute inset-0 border-4 border-purple-500 rounded-full animate-spin border-t-transparent"
            ></div>
          </div>
          <p class="text-gray-600 text-lg">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <div
          class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center"
        >
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            ></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Không thể tải thông tin đơn hàng</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button
          @click="loadOrderDetail"
          class="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-colors"
        >
          Thử lại
        </button>
      </div>

      <!-- Main Content -->
      <div v-else-if="order" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Order Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Order Status -->
          <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-900">Trạng thái đơn hàng</h2>
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                :class="getStatusColor(order.status)"
              >
                {{ getStatusLabel(order.status) }}
              </span>
            </div>

            <!-- Order Timeline -->
            <div class="relative">
              <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

              <div
                v-for="(step, index) in orderSteps"
                :key="step.status"
                class="relative flex items-center mb-6 last:mb-0"
              >
                <div
                  class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                  :class="
                    step.completed
                      ? 'bg-green-500 text-white'
                      : step.current
                        ? getStatusBgColor(order.status) + ' text-white'
                        : 'bg-gray-200 text-gray-500'
                  "
                >
                  <svg
                    v-if="step.completed"
                    class="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span v-else class="text-sm font-medium">{{ index + 1 }}</span>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900">{{ step.label }}</p>
                  <p v-if="step.current" class="text-sm text-gray-500">
                    {{ formatDate(order.createdAt) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- ✅ Order Items - WITH API DATA -->
          <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg
                class="w-6 h-6 text-rose-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"
                ></path>
              </svg>
              Sản phẩm đã đặt
            </h2>

            <div class="space-y-4">
              <div
                v-for="detail in order.orderDetails"
                :key="detail.id"
                class="flex items-start space-x-4 p-4 bg-gradient-to-r from-gray-50/70 via-purple-50/30 to-pink-50/30 rounded-xl border border-gray-100/50"
              >
                <!-- Product Image -->
                <div class="flex-shrink-0">
                  <img
                    :src="getProductImage(detail)"
                    :alt="getProductName(detail)"
                    class="w-20 h-20 object-cover rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
                    @click="goToProductDetail(detail)"
                  />
                </div>

                <!-- Product Info & Review Section -->
                <div class="flex-1 min-w-0">
                  <h3
                    class="text-lg font-semibold text-gray-900 line-clamp-2 mb-2 cursor-pointer hover:text-rose-600 transition-colors"
                    @click="goToProductDetail(detail)"
                  >
                    {{ getProductName(detail) }}
                  </h3>

                  <div class="flex flex-wrap gap-2 text-sm mb-3">
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-rose-100/70 text-rose-800 border border-rose-200/50"
                    >
                      Size: {{ getVariantSize(detail) }}
                    </span>
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100/70 text-purple-800 border border-purple-200/50"
                    >
                      Màu: {{ getVariantColor(detail) }}
                    </span>
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100/70 text-blue-800 border border-blue-200/50"
                    >
                      SL: {{ detail.quantity }}
                    </span>
                  </div>

                  <div class="text-sm text-gray-600 font-medium mb-3">
                    Đơn giá: {{ formatPrice(detail.price) }}
                  </div>

                  <!-- ✅ Review Section - Chỉ hiển thị nếu đơn hàng đã giao -->
                  <div v-if="canReviewOrder" class="mt-3">
                    <!-- Loading review info -->
                    <div v-if="loadingReviews" class="flex items-center text-sm text-gray-500">
                      <svg
                        class="w-4 h-4 animate-spin mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        ></path>
                      </svg>
                      Đang kiểm tra đánh giá...
                    </div>

                    <!-- Has review -->
                    <div v-else-if="getProductReview(detail)" class="space-y-2">
                      <!-- Existing Review Display -->
                      <div class="bg-amber-50/80 border border-amber-200 rounded-lg p-3">
                        <div class="flex items-center justify-between mb-2">
                          <div class="flex items-center space-x-2">
                            <span class="text-sm font-medium text-amber-800"
                              >Đánh giá của bạn:</span
                            >
                            <div class="flex items-center">
                              <span v-for="n in 5" :key="n" class="text-yellow-400">
                                {{ n <= (getProductReview(detail)?.rating || 0) ? '★' : '☆' }}
                              </span>
                              <span class="ml-1 text-sm text-gray-600"
                                >({{ getProductReview(detail)?.rating }}/5)</span
                              >
                            </div>
                          </div>
                          <span class="text-xs text-amber-600">
                            {{ formatReviewDate(getProductReview(detail)?.createdAt || '') }}
                          </span>
                        </div>

                        <p class="text-sm text-gray-700 mb-2 line-clamp-2">
                          {{ getProductReview(detail)?.comment }}
                        </p>

                        <!-- Edit Review Button -->
                        <button
                          @click="editReview(detail, getProductReview(detail)!)"
                          class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"
                        >
                          <svg
                            class="w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            ></path>
                          </svg>
                          Sửa đánh giá
                        </button>
                      </div>
                    </div>

                    <!-- No review yet -->
                    <div v-else>
                      <button
                        @click="createReview(detail)"
                        class="inline-flex items-center px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors shadow-sm hover:shadow-md"
                      >
                        <svg
                          class="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          ></path>
                        </svg>
                        Viết đánh giá
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Quantity & Total -->
                <div class="text-right">
                  <div class="text-xl font-bold text-rose-600">
                    {{ formatPrice(detail.subtotal) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Shipping Information - With Edit Button -->
          <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-900 flex items-center">
                <svg
                  class="w-6 h-6 text-blue-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Thông tin giao hàng
              </h2>

              <!-- Edit Button - Chỉ hiển thị khi có thể edit -->
              <button
                v-if="canEditShipping"
                @click="openEditShippingDialog"
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Chỉnh sửa
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-sm font-medium text-gray-700 mb-2">Người nhận</h3>
                <p class="text-base text-gray-900 font-medium">{{ order.shippingName }}</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-700 mb-2">Số điện thoại</h3>
                <p class="text-base text-gray-900 font-medium">{{ order.shippingPhone }}</p>
              </div>
              <div class="md:col-span-2">
                <h3 class="text-sm font-medium text-gray-700 mb-2">Địa chỉ giao hàng</h3>
                <p class="text-base text-gray-900 font-medium">{{ order.shippingAddress }}</p>
              </div>
            </div>

            <!-- Status Notice cho PENDING/PAID -->
            <div
              v-if="canEditShipping"
              class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200"
            >
              <div class="flex items-start space-x-2">
                <svg
                  class="w-5 h-5 text-blue-500 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h4 class="text-sm font-medium text-blue-900">Có thể chỉnh sửa địa chỉ</h4>
                  <p class="text-sm text-blue-800 mt-1">
                    Đơn hàng đang ở trạng thái "{{ getStatusLabel(order.status) }}", bạn có thể
                    chỉnh sửa thông tin giao hàng.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <!-- ✅ THÊM MỚI - Payment Information Section -->
          <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg
                class="w-6 h-6 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-3a2 2 0 00-2-2H9a2 2 0 00-2 2v3a2 2 0 002 2z"
                />
              </svg>
              Thông tin thanh toán
            </h2>

            <!-- Loading Payment Info -->
            <div v-if="loadingPayments" class="flex items-center justify-center py-4">
              <svg
                class="animate-spin w-6 h-6 text-indigo-500 mr-2"
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
              <span class="text-gray-600">Đang tải thông tin thanh toán...</span>
            </div>

            <!-- Payment Info -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Payment Method -->
              <div>
                <h3 class="text-sm font-medium text-gray-700 mb-2">Phương thức thanh toán</h3>
                <div class="flex items-center space-x-2">
                  <!-- MoMo Icon -->
                  <div
                    v-if="paymentMethodInfo === PaymentMethod.MOMO"
                    class="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center"
                  >
                    <div class="w-5 h-5 bg-white rounded flex items-center justify-center">
                      <span class="text-pink-500 text-xs font-bold">M</span>
                    </div>
                  </div>
                  <!-- Cash Icon -->
                  <div
                    v-else-if="paymentMethodInfo === PaymentMethod.CASH"
                    class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center"
                  >
                    <svg
                      class="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <!-- Unknown Icon -->
                  <div
                    v-else
                    class="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center"
                  >
                    <svg
                      class="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span class="text-base text-gray-900 font-medium">{{ paymentMethodLabel }}</span>
                </div>
              </div>

              <!-- Payment Status -->
              <div>
                <h3 class="text-sm font-medium text-gray-700 mb-2">Trạng thái thanh toán</h3>
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="paymentStatusColor"
                >
                  {{ paymentStatusLabel }}
                </span>
              </div>
            </div>

            <!-- Payment History -->
            <div
              v-if="orderPayments.length > 1"
              class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200"
            >
              <div class="text-sm text-blue-800">
                <strong>Lịch sử thanh toán:</strong> {{ orderPayments.length }} giao dịch
              </div>
            </div>

            <!-- Retry Payment Section - Chỉ hiển thị khi MOMO PENDING -->
            <div
              v-if="canRetryPayment"
              class="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200"
            >
              <div class="flex items-start space-x-3">
                <svg
                  class="w-6 h-6 text-yellow-500 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <div class="flex-1">
                  <h4 class="text-sm font-semibold text-yellow-900 mb-1">
                    Thanh toán MoMo chưa hoàn tất
                  </h4>
                  <p class="text-sm text-yellow-800 mb-3">
                    Đơn hàng của bạn chưa được thanh toán qua MoMo. Có thể do kết nối mạng hoặc bạn
                    đã đóng trang thanh toán.
                  </p>

                  <!-- Error Message -->
                  <div
                    v-if="paymentError"
                    class="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700"
                  >
                    {{ paymentError }}
                  </div>

                  <!-- Retry Button -->
                  <button
                    @click="retryMomoPayment"
                    :disabled="isCreatingPayment"
                    class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <svg
                      v-if="isCreatingPayment"
                      class="animate-spin w-4 h-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <div
                      v-else
                      class="w-5 h-5 bg-pink-500 rounded mr-2 flex items-center justify-center"
                    >
                      <span class="text-white text-xs font-bold">M</span>
                    </div>
                    {{ isCreatingPayment ? 'Đang tạo thanh toán...' : 'Thanh toán lại qua MoMo' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Payment Success Info -->
            <div
              v-else-if="paymentStatusInfo === PaymentStatus.SUCCESS"
              class="mt-4 p-3 bg-green-50 rounded-lg border border-green-200"
            >
              <div class="flex items-center text-green-700">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="text-sm font-medium">Đơn hàng đã được thanh toán thành công</span>
              </div>
            </div>

            <!-- Payment Failed Info -->
            <div
              v-else-if="paymentStatusInfo === PaymentStatus.FAILED"
              class="mt-4 p-3 bg-red-50 rounded-lg border border-red-200"
            >
              <div class="flex items-center text-red-700">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span class="text-sm font-medium">Thanh toán đã thất bại</span>
              </div>
            </div>

            <!-- No Payment Info Notice -->
            <div
              v-else-if="!paymentMethodInfo && !loadingPayments"
              class="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div class="flex items-center text-gray-600">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span class="text-sm">Chưa có thông tin thanh toán</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Order Summary & Actions -->
        <div class="lg:col-span-1">
          <div
            class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 sticky top-6"
          >
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>

            <!-- Order Info -->
            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Ngày đặt hàng</span>
                <span class="text-gray-900 font-medium">{{ formatDate(order.createdAt) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Số lượng sản phẩm</span>
                <span class="text-gray-900 font-medium">{{ orderSummary.itemCount }} sản phẩm</span>
              </div>
            </div>

            <!-- Order Summary -->
            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span class="font-medium">{{ formatPrice(orderSummary.subtotal) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span class="font-medium">{{ formatPrice(orderSummary.shippingFee) }}</span>
              </div>
              <div class="border-t border-gray-200 pt-3">
                <div class="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Tổng cộng</span>
                  <span class="text-rose-600">{{ formatPrice(order.totalAmount) }}</span>
                </div>
                <div class="text-xs text-gray-500 mt-1 text-right">
                  Đã bao gồm thuế VAT (nếu có)
                </div>
              </div>
            </div>

            <!-- Debug comparison (only show if different) -->
            <div
              v-if="Math.abs(orderSummary.total - order.totalAmount) > 100"
              class="mb-4 p-3 bg-yellow-50/80 border border-yellow-200 rounded-lg"
            >
              <div class="text-xs text-yellow-800">
                <div class="font-medium">So sánh tổng tiền:</div>
                <div>Tính toán: {{ formatPrice(orderSummary.total) }}</div>
                <div>Backend: {{ formatPrice(order.totalAmount) }}</div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-3">
              <!-- Cancel Order -->
              <button
                v-if="canCancelOrder"
                @click="showCancelDialog = true"
                :disabled="isCanceling"
                class="w-full px-4 py-2 border border-red-300 text-red-700 hover:bg-red-50 disabled:bg-gray-100 disabled:text-gray-400 font-medium rounded-xl transition-colors"
              >
                {{ isCanceling ? 'Đang hủy...' : 'Hủy đơn hàng' }}
              </button>

              <!-- Reorder -->
              <button
                @click="reorder"
                class="w-full px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Đặt lại đơn hàng
              </button>

              <!-- Continue Shopping -->
              <button
                @click="continueShopping"
                class="w-full px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-xl transition-colors"
              >
                Tiếp tục mua sắm
              </button>
            </div>

            <!-- Customer Support -->
            <div
              class="mt-6 p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-xl border border-blue-200/50"
            >
              <div class="flex items-start">
                <svg
                  class="w-5 h-5 text-blue-500 mt-0.5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <div class="flex-1">
                  <h3 class="text-sm font-medium text-blue-900">Cần hỗ trợ?</h3>
                  <p class="text-sm text-blue-700 mt-1">
                    Liên hệ với chúng tôi nếu bạn có bất kỳ thắc mắc nào về đơn hàng.
                  </p>
                  <div class="mt-2">
                    <a
                      href="tel:1900-1234"
                      class="text-sm font-medium text-blue-600 hover:text-blue-500"
                      >Hotline: 1900-1234</a
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cancel Confirmation Dialog -->
    <div
      v-if="showCancelDialog"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Xác nhận hủy đơn hàng</h3>
        <p class="text-gray-600 mb-2">
          Đơn hàng: <span class="font-semibold">#{{ order?.id.slice(-8) }}</span>
        </p>
        <p class="text-gray-600 mb-6">
          Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác.
        </p>
        <div class="flex gap-3">
          <button
            @click="cancelOrderHandler"
            :disabled="isCanceling"
            class="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-medium rounded-xl transition-colors"
          >
            {{ isCanceling ? 'Đang hủy...' : 'Xác nhận hủy' }}
          </button>
          <button
            @click="showCancelDialog = false"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-xl transition-colors"
          >
            Không hủy
          </button>
        </div>
      </div>
    </div>
    <!-- Edit Shipping Dialog -->
    <div
      v-if="showEditShippingDialog"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Chỉnh sửa thông tin giao hàng</h3>
          <button
            @click="closeEditShippingDialog"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form @submit.prevent="updateShippingInfo" class="space-y-4">
          <!-- Tên người nhận -->
          <div>
            <label for="shipping-name" class="block text-sm font-medium text-gray-700 mb-2">
              Tên người nhận <span class="text-red-500">*</span>
            </label>
            <input
              id="shipping-name"
              v-model="shippingForm.shippingName"
              type="text"
              required
              maxlength="100"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Nhập tên người nhận"
            />
          </div>

          <!-- Số điện thoại -->
          <div>
            <label for="shipping-phone" class="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại <span class="text-red-500">*</span>
            </label>
            <input
              id="shipping-phone"
              v-model="shippingForm.shippingPhone"
              type="tel"
              required
              maxlength="15"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Nhập số điện thoại"
            />
          </div>

          <!-- Địa chỉ -->
          <div>
            <label for="shipping-address" class="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ giao hàng <span class="text-red-500">*</span>
            </label>
            <textarea
              id="shipping-address"
              v-model="shippingForm.shippingAddress"
              required
              maxlength="500"
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder="Nhập địa chỉ giao hàng chi tiết"
            ></textarea>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4">
            <button
              type="submit"
              :disabled="isUpdatingShipping"
              class="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors"
            >
              <span v-if="isUpdatingShipping" class="flex items-center justify-center">
                <svg class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang cập nhật...
              </span>
              <span v-else>Cập nhật thông tin</span>
            </button>

            <button
              type="button"
              @click="closeEditShippingDialog"
              class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Success Toast -->
    <div
      v-if="showSuccessToast"
      class="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center space-x-3 transform animate-slide-up"
    >
      <div class="w-6 h-6 bg-white rounded-full flex items-center justify-center">
        <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <span class="font-medium">{{ successMessage }}</span>
    </div>

    <!-- Error Toast -->
    <div
      v-if="showErrorToast"
      class="fixed bottom-6 right-6 bg-gradient-to-r from-red-500 to-rose-500 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center space-x-3 transform animate-slide-up"
    >
      <div class="w-6 h-6 bg-white rounded-full flex items-center justify-center">
        <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <span class="font-medium">{{ errorMessage }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getOrder, cancelOrder, updateOrderShipping } from './orders.api'
import { getCurrentUser } from '@/common/guards/roleGuard.guard'
import {
  ORDER_STATUS_LABELS,
  OrderStatus,
  type Order,
  type OrderDetail,
  UpdateShippingRequest,
} from './orders.type'
import {
  getPaymentsByOrderId,
  getOrderPaymentInfo,
  createMomoPayment,
  redirectToMomoPayment,
} from '../payments/payments.api'
import { PaymentMethod, PaymentStatus, type Payment } from '../payments/payments.type'
import { CartDetailRequest } from '../carts/carts.type'
import { getOrCreateUserCart, addCartDetail } from '../carts/carts.api'
// ✅ Import API để lấy variant với product - SAME AS CARTVIEW
import { getVariantWithProductByIdApi } from '@/modules/products/product.api'
import type { ProductVariantWithProduct } from '@/modules/products/product.type'

// ✅ THÊM: Import review APIs và types
import { getReviewsByProduct, formatReviewDate } from '@/modules/reviews/reviews.api'
import { type Review } from '@/modules/reviews/reviews.type'
// ✅ THÊM: Review-related state
const loadingReviews = ref(false)
const productReviews = ref<Map<string, Review[]>>(new Map())
const route = useRoute()
const router = useRouter()

const showEditShippingDialog = ref(false)
const isUpdatingShipping = ref(false)
const shippingForm = ref({
  shippingName: '',
  shippingPhone: '',
  shippingAddress: '',
})

// ================================
// STATE MANAGEMENT
// ================================
const loading = ref(true)
const isCanceling = ref(false)
const showCancelDialog = ref(false)
const showSuccessToast = ref(false)
const showErrorToast = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const error = ref('')
// ✅ THÊM MỚI - Payment states
const orderPayments = ref<Payment[]>([])
const loadingPayments = ref(false)
const isCreatingPayment = ref(false)
const paymentError = ref('')

// Payment info derived từ API
const paymentMethodInfo = ref<PaymentMethod | null>(null)
const paymentStatusInfo = ref<PaymentStatus | null>(null)
// Data
const order = ref<Order | null>(null)

// ✅ Cache để lưu thông tin variant đã fetch - SAME AS CARTVIEW
const variantCache = ref<Map<string, ProductVariantWithProduct>>(new Map())

// ================================
// COMPUTED PROPERTIES
// ================================
const currentUser = computed(() => getCurrentUser())

const canCancelOrder = computed(() => {
  if (!order.value) return false
  return [OrderStatus.PENDING, OrderStatus.PAID, OrderStatus.CONFIRMED].includes(order.value.status)
})

const orderSteps = computed(() => {
  if (!order.value) return []

  const steps = [
    { status: OrderStatus.PENDING, label: 'Chờ xác nhận', completed: false, current: false },
    { status: OrderStatus.PAID, label: 'Đã thanh toán', completed: false, current: false },
    { status: OrderStatus.CONFIRMED, label: 'Đã xác nhận', completed: false, current: false },
    { status: OrderStatus.SHIPPING, label: 'Đang giao hàng', completed: false, current: false },
    { status: OrderStatus.DELIVERED, label: 'Đã giao hàng', completed: false, current: false },
  ]

  const statusOrder = [
    OrderStatus.PENDING,
    OrderStatus.PAID,
    OrderStatus.CONFIRMED,
    OrderStatus.SHIPPING,
    OrderStatus.DELIVERED,
  ]
  const currentIndex = statusOrder.indexOf(order.value.status)

  if (order.value.status === OrderStatus.CANCELLED) {
    return [{ status: OrderStatus.CANCELLED, label: 'Đã hủy', completed: false, current: true }]
  }

  steps.forEach((step, index) => {
    if (index < currentIndex) {
      step.completed = true
    } else if (index === currentIndex) {
      step.current = true
    }
  })

  return steps
})

const orderSummary = computed(() => {
  if (!order.value?.orderDetails) {
    return {
      subtotal: 0,
      shippingFee: 0,
      total: 0,
      itemCount: 0,
    }
  }

  const subtotal = order.value.orderDetails.reduce((sum, detail) => sum + detail.subtotal, 0)
  const shippingFee = 0 // Fixed shipping fee
  const total = subtotal + shippingFee
  const itemCount = order.value.orderDetails.reduce((sum, detail) => sum + detail.quantity, 0)

  return {
    subtotal,
    shippingFee,
    total,
    itemCount,
  }
})
const canEditShipping = computed(() => {
  if (!order.value || !currentUser.value?.userId) return false

  // Kiểm tra order có phải của user hiện tại không
  const isOwner = order.value.userId === currentUser.value.userId

  // Kiểm tra status có phải PENDING hoặc PAID không
  const canEditStatus = [OrderStatus.PENDING, OrderStatus.PAID].includes(order.value.status)

  return isOwner && canEditStatus
})

const openEditShippingDialog = () => {
  if (!order.value || !canEditShipping.value) return

  // Load thông tin hiện tại vào form
  shippingForm.value = {
    shippingName: order.value.shippingName,
    shippingPhone: order.value.shippingPhone,
    shippingAddress: order.value.shippingAddress,
  }

  showEditShippingDialog.value = true
}

const closeEditShippingDialog = () => {
  showEditShippingDialog.value = false
  // Reset form
  shippingForm.value = {
    shippingName: '',
    shippingPhone: '',
    shippingAddress: '',
  }
}

const updateShippingInfo = async () => {
  if (!order.value || !canEditShipping.value) return

  // Validation
  if (!shippingForm.value.shippingName.trim()) {
    showError('Tên người nhận không được để trống')
    return
  }

  if (!shippingForm.value.shippingPhone.trim()) {
    showError('Số điện thoại không được để trống')
    return
  }

  if (!shippingForm.value.shippingAddress.trim()) {
    showError('Địa chỉ giao hàng không được để trống')
    return
  }

  try {
    isUpdatingShipping.value = true

    const request = new UpdateShippingRequest(
      shippingForm.value.shippingName.trim(),
      shippingForm.value.shippingPhone.trim(),
      shippingForm.value.shippingAddress.trim(),
    )

    console.log('🔄 Updating shipping info for order:', order.value.id)

    const updatedOrder = await updateOrderShipping(order.value.id, request)

    // Cập nhật order trong component
    order.value = updatedOrder

    showEditShippingDialog.value = false
    showSuccess('Cập nhật thông tin giao hàng thành công!')
  } catch (error: any) {
    console.error('❌ Update shipping error:', error)

    let errorMsg = 'Có lỗi xảy ra khi cập nhật thông tin giao hàng'
    if (error?.response?.data?.message) {
      errorMsg = error.response.data.message
    } else if (error?.message) {
      errorMsg = error.message
    }

    showError(errorMsg)
  } finally {
    isUpdatingShipping.value = false
  }
}

// ✅ THÊM MỚI - Payment computed properties
const canRetryPayment = computed(() => {
  // Check từ orderPayments thực tế từ API
  const hasPendingMoMo = orderPayments.value.some(
    (payment) =>
      payment.paymentMethod === PaymentMethod.MOMO && payment.status === PaymentStatus.PENDING,
  )

  // Và order status phải là PENDING
  const orderIsPending = order.value?.status === OrderStatus.PENDING

  return hasPendingMoMo && orderIsPending
})

const paymentMethodLabel = computed(() => {
  console.log('💳 Payment Method Info:', paymentMethodInfo.value)
  if (paymentMethodInfo.value === PaymentMethod.MOMO) {
    return 'Ví điện tử MoMo'
  } else if (paymentMethodInfo.value === PaymentMethod.CASH) {
    return 'Tiền mặt khi nhận hàng'
  }
  return 'Chưa xác định'
})

const paymentStatusLabel = computed(() => {
  switch (paymentStatusInfo.value) {
    case PaymentStatus.PENDING:
      return 'Chờ thanh toán'
    case PaymentStatus.SUCCESS:
      return 'Đã thanh toán'
    case PaymentStatus.FAILED:
      return 'Thanh toán thất bại'
    default:
      // Fallback dựa trên order status
      switch (order.value?.status) {
        case OrderStatus.PENDING:
          return 'Chờ thanh toán'
        case OrderStatus.PAID:
        case OrderStatus.CONFIRMED:
        case OrderStatus.SHIPPING:
        case OrderStatus.DELIVERED:
          return 'Đã thanh toán'
        case OrderStatus.CANCELLED:
          return 'Đã hủy'
        default:
          return 'Chưa xác định'
      }
  }
})

const paymentStatusColor = computed(() => {
  switch (paymentStatusInfo.value) {
    case PaymentStatus.PENDING:
      return 'bg-yellow-100 text-yellow-800'
    case PaymentStatus.SUCCESS:
      return 'bg-green-100 text-green-800'
    case PaymentStatus.FAILED:
      return 'bg-red-100 text-red-800'
    default:
      // Fallback colors dựa trên order status
      switch (order.value?.status) {
        case OrderStatus.PENDING:
          return 'bg-yellow-100 text-yellow-800'
        case OrderStatus.PAID:
        case OrderStatus.CONFIRMED:
        case OrderStatus.SHIPPING:
        case OrderStatus.DELIVERED:
          return 'bg-green-100 text-green-800'
        case OrderStatus.CANCELLED:
          return 'bg-red-100 text-red-800'
        default:
          return 'bg-gray-100 text-gray-600'
      }
  }
})
// ✅ THÊM MỚI - Retry MoMo payment function
const retryMomoPayment = async () => {
  if (!order.value || !canRetryPayment.value) return

  try {
    isCreatingPayment.value = true
    paymentError.value = ''

    console.log('🔄 Retrying MoMo payment for order:', order.value.id)

    // Tạo payment MoMo mới
    const momoResponse = await createMomoPayment(order.value.id, order.value.totalAmount)

    console.log('✅ MoMo payment created:', momoResponse)

    // Redirect đến trang thanh toán MoMo
    if (momoResponse.payUrl) {
      showSuccess('Đang chuyển hướng đến trang thanh toán MoMo...')

      setTimeout(() => {
        redirectToMomoPayment(momoResponse.payUrl)
      }, 1000)
    } else {
      throw new Error('Không nhận được link thanh toán từ MoMo')
    }
  } catch (error: any) {
    console.error('❌ Retry MoMo payment error:', error)

    let errorMsg = 'Có lỗi xảy ra khi tạo thanh toán MoMo'
    if (error?.response?.data?.message) {
      errorMsg = error.response.data.message
    } else if (error?.message) {
      errorMsg = error.message
    }

    paymentError.value = errorMsg
    showError(errorMsg)
  } finally {
    isCreatingPayment.value = false
  }
}
// ✅ THÊM MỚI - Load order payment info
const loadOrderPaymentInfo = async (orderId: string) => {
  try {
    loadingPayments.value = true

    // Lấy payment info thực từ API
    const payments = await getPaymentsByOrderId(orderId)
    const paymentInfo = await getOrderPaymentInfo(orderId)

    orderPayments.value = payments

    // Cập nhật payment info từ API (không thêm vào Order type)
    paymentMethodInfo.value = paymentInfo.paymentMethod
    paymentStatusInfo.value = paymentInfo.paymentStatus

    console.log('✅ Order payment info loaded:', {
      orderId,
      paymentMethod: paymentInfo.paymentMethod,
      paymentStatus: paymentInfo.paymentStatus,
      paymentsCount: payments.length,
      canRetryPayment: canRetryPayment.value,
    })
  } catch (error) {
    console.error('❌ Error loading payment info:', error)

    // Fallback logic nếu API lỗi - giữ null để hiển thị "Chưa xác định"
    paymentMethodInfo.value = null
    paymentStatusInfo.value = null
  } finally {
    loadingPayments.value = false
  }
}
// ================================
// ✅ THÊM: REVIEW COMPUTED PROPERTIES
// ================================
const canReviewOrder = computed(() => {
  return order.value?.status === OrderStatus.DELIVERED
})

// ================================
// ✅ THÊM: REVIEW HELPER FUNCTIONS
// ================================
const getProductReview = (detail: OrderDetail): Review | null => {
  if (!currentUser.value?.userId) return null

  const variantInfo = variantCache.value.get(detail.productVariantId)
  const productId = variantInfo?.product?.id

  if (!productId) return null

  const reviews = productReviews.value.get(productId)
  return reviews?.find((review) => review.userId === currentUser.value?.userId) || null
}

const getProductIdFromDetail = (detail: OrderDetail): string | null => {
  const variantInfo = variantCache.value.get(detail.productVariantId)
  return variantInfo?.product?.id || null
}

// ✅ Load reviews cho tất cả products trong order
const loadProductReviews = async () => {
  if (!order.value?.orderDetails || !currentUser.value?.userId) return

  try {
    loadingReviews.value = true
    console.log('🔄 Loading reviews for order products...')

    // Get unique product IDs
    const productIds = new Set<string>()
    order.value.orderDetails.forEach((detail) => {
      const productId = getProductIdFromDetail(detail)
      if (productId) {
        productIds.add(productId)
      }
    })

    console.log('📊 Found product IDs:', Array.from(productIds))

    // Load reviews for each product
    const promises = Array.from(productIds).map(async (productId) => {
      try {
        const reviewsResponse = await getReviewsByProduct(productId, {
          page: 0,
          size: 100, // Get all reviews for this product
          sortBy: 'createdAt',
          sortDirection: 'desc',
        })

        productReviews.value.set(productId, reviewsResponse.content)
        console.log(`✅ Loaded ${reviewsResponse.content.length} reviews for product ${productId}`)
      } catch (error) {
        console.error(`❌ Error loading reviews for product ${productId}:`, error)
      }
    })

    await Promise.all(promises)
  } catch (error) {
    console.error('❌ Error loading product reviews:', error)
  } finally {
    loadingReviews.value = false
  }
}

// ================================
// ✅ THÊM: REVIEW NAVIGATION FUNCTIONS
// ================================
const createReview = (detail: OrderDetail) => {
  const productId = getProductIdFromDetail(detail)
  if (!productId) {
    showError('Không thể xác định sản phẩm để đánh giá')
    return
  }

  console.log('🌟 Creating new review for product:', productId)
  router.push(`/reviews/create/${productId}`)
}

const editReview = (detail: OrderDetail, review: Review) => {
  const productId = getProductIdFromDetail(detail)
  if (!productId) {
    showError('Không thể xác định sản phẩm để chỉnh sửa đánh giá')
    return
  }

  console.log('✏️ Editing review:', review.id, 'for product:', productId)
  router.push(`/reviews/create/${productId}?reviewId=${review.id}`)
}

// ================================
// UTILITY METHODS
// ================================
const formatPrice = (price: number) => {
  if (!price || isNaN(price)) return '0 ₫'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getStatusLabel = (status: OrderStatus) => {
  return ORDER_STATUS_LABELS[status] || status
}

const getStatusColor = (status: OrderStatus) => {
  const colors: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [OrderStatus.PAID]: 'bg-orange-100 text-orange-800',
    [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-800',
    [OrderStatus.SHIPPING]: 'bg-purple-100 text-purple-800',
    [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800',
    [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getStatusBgColor = (status: OrderStatus) => {
  const colors: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'bg-yellow-500',
    [OrderStatus.PAID]: 'bg-orange-500',
    [OrderStatus.CONFIRMED]: 'bg-blue-500',
    [OrderStatus.SHIPPING]: 'bg-purple-500',
    [OrderStatus.DELIVERED]: 'bg-green-500',
    [OrderStatus.CANCELLED]: 'bg-red-500',
  }
  return colors[status] || 'bg-gray-500'
}

// ================================
// ✅ HELPER FUNCTIONS - SAME AS CARTVIEW với API cache
// ================================
const getProductName = (detail: OrderDetail) => {
  console.log('📦 Getting product name for order detail:', detail.id)

  // ✅ Lấy từ cache variant đã fetch
  const variantInfo = variantCache.value.get(detail.productVariantId)
  if (variantInfo?.product?.name) {
    console.log('✅ Found product name from API cache:', variantInfo.product.name)
    return variantInfo.product.name
  }

  // Fallback - từ data có sẵn trong order
  if (detail.productVariant?.product?.name) {
    console.log('✅ Found product name from populated data:', detail.productVariant.product.name)
    return detail.productVariant.product.name
  }

  if (detail.productVariant?.name) {
    console.log('✅ Found variant name:', detail.productVariant.name)
    return detail.productVariant.name
  }

  // Fallback với productVariantId
  const fallbackName = `Sản phẩm #${detail.productVariantId?.slice(-8) || 'Unknown'}`
  console.log('⚠️ Using fallback name:', fallbackName)
  return fallbackName
}

const getProductImage = (detail: OrderDetail) => {
  console.log('🖼️ Getting product image for order detail:', detail.id)

  // ✅ Lấy từ cache variant đã fetch
  const variantInfo = variantCache.value.get(detail.productVariantId)
  if (variantInfo?.images?.length > 0) {
    // Tìm main image trước
    const mainImage = variantInfo.images.find((img) => img.isMain)
    if (mainImage?.url) {
      console.log('✅ Found main image from API cache:', mainImage.url)
      return mainImage.url
    }

    // Nếu không có main, lấy ảnh đầu tiên
    const firstImage = variantInfo.images[0]?.url
    if (firstImage) {
      console.log('✅ Found first image from API cache:', firstImage)
      return firstImage
    }
  }

  // Fallback - từ data có sẵn trong order
  if (detail.productVariant?.images?.length > 0) {
    const mainImage = detail.productVariant.images.find((img: any) => img.isMain)
    if (mainImage?.url) {
      console.log('✅ Found image from populated data (main):', mainImage.url)
      return mainImage.url
    }

    const firstImage = detail.productVariant.images[0]?.url
    if (firstImage) {
      console.log('✅ Found image from populated data (first):', firstImage)
      return firstImage
    }
  }

  if (detail.productVariant?.image) {
    const image =
      typeof detail.productVariant.image === 'string'
        ? detail.productVariant.image
        : detail.productVariant.image.url
    console.log('✅ Found productVariant.image:', image)
    return image
  }

  // Default placeholder
  const placeholder = 'https://via.placeholder.com/150x150/f3f4f6/9ca3af?text=SmartShoes'
  console.log('⚠️ Using placeholder image:', placeholder)
  return placeholder
}

const getVariantSize = (detail: OrderDetail) => {
  console.log('📏 Getting variant size for order detail:', detail.id)

  // ✅ Lấy từ cache variant đã fetch
  const variantInfo = variantCache.value.get(detail.productVariantId)
  if (variantInfo?.size) {
    console.log('✅ Found size from API cache:', variantInfo.size)
    return variantInfo.size
  }

  // Fallback - từ data có sẵn trong order
  if (detail.productVariant?.size) {
    console.log('✅ Found size from populated data:', detail.productVariant.size)
    return detail.productVariant.size
  }

  console.log('⚠️ No size found, returning N/A')
  return 'N/A'
}

const getVariantColor = (detail: OrderDetail) => {
  console.log('🎨 Getting variant color for order detail:', detail.id)

  // ✅ Lấy từ cache variant đã fetch
  const variantInfo = variantCache.value.get(detail.productVariantId)

  // Support cả colorName và color.name
  if (variantInfo?.colorName) {
    console.log('✅ Found colorName from API cache:', variantInfo.colorName)
    return variantInfo.colorName
  }

  if (variantInfo?.color?.name) {
    console.log('✅ Found color.name from API cache:', variantInfo.color.name)
    return variantInfo.color.name
  }

  // Fallback - từ data có sẵn trong order
  if (detail.productVariant?.color?.name) {
    console.log('✅ Found color from populated data:', detail.productVariant.color.name)
    return detail.productVariant.color.name
  }

  if (detail.productVariant?.colorName) {
    console.log('✅ Found colorName from populated data:', detail.productVariant.colorName)
    return detail.productVariant.colorName
  }

  if (detail.productVariant?.color) {
    console.log('✅ Found productVariant.color:', detail.productVariant.color)
    return detail.productVariant.color
  }

  console.log('⚠️ No color found, returning N/A')
  return 'N/A'
}

// ✅ Navigation đến ProductDetail
const goToProductDetail = (detail: OrderDetail) => {
  const variantInfo = variantCache.value.get(detail.productVariantId)
  if (variantInfo?.product?.id) {
    router.push(`/products/${variantInfo.product.id}`)
  } else {
    console.warn('❌ Cannot navigate to product detail: product ID not found')
    showError('Không thể xem chi tiết sản phẩm')
  }
}

// ✅ Load thông tin variant từ API cho tất cả order details
const loadVariantInfoForOrder = async () => {
  if (!order.value?.orderDetails) return

  console.log('🔄 Loading variant info for order details...')

  const promises = order.value.orderDetails.map(async (detail) => {
    if (!variantCache.value.has(detail.productVariantId)) {
      try {
        console.log(`🔍 Fetching variant info for: ${detail.productVariantId}`)
        const variantWithProduct = await getVariantWithProductByIdApi(detail.productVariantId)
        variantCache.value.set(detail.productVariantId, variantWithProduct)
        console.log(`✅ Loaded variant info:`, variantWithProduct)
      } catch (error) {
        console.error(`❌ Error loading variant ${detail.productVariantId}:`, error)
      }
    }
  })

  await Promise.all(promises)
  console.log('✅ All variant info loaded for order')
}

// ================================
// API METHODS
// ================================
const loadOrderDetail = async () => {
  // Lấy orderId từ URL path
  const pathSegments = route.path.split('/')
  const orderId = pathSegments[pathSegments.length - 1]

  console.log('🔍 Debug URL info:')
  console.log('- Full path:', route.path)
  console.log('- Extracted orderId:', orderId)

  if (!orderId) {
    error.value = 'Không tìm thấy mã đơn hàng trong URL'
    loading.value = false
    return
  }

  try {
    loading.value = true
    error.value = ''

    console.log('🚀 Calling getOrder API with orderId:', orderId)
    const orderData = await getOrder(orderId)
    order.value = orderData

    console.log('✅ Order detail loaded successfully:', orderData)
    console.log('📊 Order summary:', orderSummary.value)

    // ✅ Load variant info cho tất cả order details
    if (order.value?.orderDetails) {
      await loadVariantInfoForOrder()
    }
    // ✅ THÊM MỚI - Load payment info từ API
    if (order.value) {
      await loadOrderPaymentInfo(order.value.id)
    }
  } catch (err) {
    console.error('❌ Error loading order detail:', err)
    error.value = 'Không thể tải thông tin đơn hàng. Vui lòng thử lại.'
  } finally {
    loading.value = false
  }
}

const cancelOrderHandler = async () => {
  if (!order.value) return

  try {
    isCanceling.value = true
    const canceledOrder = await cancelOrder(order.value.id)
    order.value = canceledOrder
    showCancelDialog.value = false
    showSuccess('Đơn hàng đã được hủy thành công')
  } catch (err) {
    console.error('❌ Error canceling order:', err)
    showError('Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại.')
  } finally {
    isCanceling.value = false
  }
}

const reorder = async () => {
  if (!order.value || !currentUser.value?.userId) return

  try {
    // Get or create cart
    const cart = await getOrCreateUserCart(currentUser.value.userId)

    // Add all items back to cart
    const promises = order.value.orderDetails.map((detail) =>
      addCartDetail(cart.id, new CartDetailRequest(detail.productVariantId, detail.quantity)),
    )

    await Promise.all(promises)
    showSuccess('Đã thêm tất cả sản phẩm vào giỏ hàng')

    setTimeout(() => {
      router.push('/cart')
    }, 1500)
  } catch (err) {
    console.error('❌ Error reordering:', err)
    showError('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng')
  }
}

const continueShopping = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
}

// ================================
// TOAST METHODS
// ================================
const showSuccess = (message: string) => {
  successMessage.value = message
  showSuccessToast.value = true
  setTimeout(() => {
    showSuccessToast.value = false
  }, 3500)
}

const showError = (message: string) => {
  errorMessage.value = message
  showErrorToast.value = true
  setTimeout(() => {
    showErrorToast.value = false
  }, 3500)
}

// ================================
// LIFECYCLE
// ================================
onMounted(() => {
  loadOrderDetail()
})

// ✅ Watch order changes để load reviews
watch(
  order,
  async (newOrder) => {
    if (newOrder && canReviewOrder.value) {
      // Đợi variant info load xong trước
      if (variantCache.value.size > 0) {
        await loadProductReviews()
      }
    }
  },
  { immediate: false },
)

// ✅ Watch variant cache để load reviews khi đã có product info
watch(
  () => variantCache.value.size,
  async (newSize) => {
    if (newSize > 0 && order.value && canReviewOrder.value) {
      await loadProductReviews()
    }
  },
)
</script>

<style scoped>
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Custom backdrop blur */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Enhanced shadows and gradients */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.shadow-lg {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Smooth transitions */
* {
  transition-property:
    color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow,
    transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Hover effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Cursor pointer cho clickable elements */
.cursor-pointer {
  cursor: pointer;
}

/* Glass morphism effect */
.from-white\/80 {
  --tw-gradient-from: rgba(255, 255, 255, 0.8);
}

.via-purple-50\/30 {
  --tw-gradient-via: rgba(250, 245, 255, 0.3);
}

.to-pink-50\/30 {
  --tw-gradient-to: rgba(253, 242, 248, 0.3);
}
</style>

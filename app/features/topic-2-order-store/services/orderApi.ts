import axiosClient from "@/app/api/axios-client";

// ĐỊNH NGHĨA URL RIÊNG CHO CHỦ ĐỀ 2 (TỒN KHO)
// Việc ghi rõ http://localhost:5254 sẽ giúp Axios bỏ qua BASE_URL 5092 ở file chung
const INVENTORY_API = "http://localhost:5254/api/danh-inventory";

export const orderApi = {
  // 1. Nhập kho
  importStock: (data: {
    productId: string;
    productName: string;
    stockQuantity: number;
  }) => {
    return axiosClient.post(`${INVENTORY_API}/import-stock`, data);
  },

  // 2. Kích hoạt Saga (Order Created)
  simulateOrder: (data: {
    orderId: string;
    productId: string;
    quantity: number;
  }) => {
    return axiosClient.post(`${INVENTORY_API}/test-order-created`, data);
  },

  // 3. Lấy tồn kho
  getCurrentStock: (productId: string) => {
    return axiosClient.get(`${INVENTORY_API}/stock/${productId}`);
  },

  // 4. Lấy lịch sử Event Sourcing
  getRecentEvents: (count: number = 10) => {
    return axiosClient.get(`${INVENTORY_API}/events?count=${count}`);
  },
};

import axiosClient from "@/app/api/axios-client";

// ĐỊNH NGHĨA URL QUA API GATEWAY (CỔNG 5092)
// Giả định axiosClient của bạn đã trỏ sẵn vào http://localhost:5092
// Nếu chưa, bạn có thể hardcode cụm "http://localhost:5092" vào trước các đường dẫn
const INVENTORY_API = "/inventory-service/api/danh-inventory";
const ORDER_API = "/order-service/api/orders";

export const orderApi = {
  // ==========================================
  // NHÓM 1: CÁC API CỦA INVENTORY SERVICE
  // ==========================================

  // 1. Nhập kho (Dành cho Admin/Thủ kho)
  importStock: (data: {
    productId: string;
    productName: string;
    stockQuantity: number;
  }) => {
    return axiosClient.post(`${INVENTORY_API}/import-stock`, data);
  },
  // (MỚI THÊM) Lấy danh sách tất cả sản phẩm trong kho
  getAllStock: () => {
    return axiosClient.get(`${INVENTORY_API}/stock/all`);
  },

  // (MỚI THÊM) Xóa sản phẩm khỏi kho
  deleteStock: (productId: string) => {
    return axiosClient.delete(`${INVENTORY_API}/stock/${productId}`);
  },
  // 2. Lấy tồn kho hiện tại để hiển thị
  getCurrentStock: (productId: string) => {
    return axiosClient.get(`${INVENTORY_API}/stock/${productId}`);
  },

  // 3. Lấy lịch sử Event Sourcing (Bảng Radar)
  getRecentEvents: (count: number = 10) => {
    return axiosClient.get(`${INVENTORY_API}/events?count=${count}`);
  },

  // ==========================================
  // NHÓM 2: CÁC API CỦA ORDER SERVICE (Kích hoạt Saga)
  // ==========================================

  // 4. Phát động tạo đơn hàng (Chỉ gửi ProductId và Quantity, Backend tự sinh OrderId)
  createOrder: (data: { productId: string; quantity: number }) => {
    return axiosClient.post(`${ORDER_API}`, data);
  },

  // 5. HÀM MỚI: Dùng để hỏi thăm trạng thái đơn hàng (Polling) xem Saga đã xong chưa
  getOrderStatus: (orderId: string) => {
    return axiosClient.get(`${ORDER_API}/${orderId}`);
  },

  // 6. HÀM MỚI (BỔ SUNG): Lấy log sự kiện từ OrderService (dùng cho bảng Monitor)
  getRecentOrderEvents: (count: number = 10) => {
    // Lưu ý: Đảm bảo BE OrderService của bạn đã có API GET /api/orders/events
    // Nếu chưa có, bạn có thể gọi thẳng GET /api/orders cũng tạm được,
    // nhưng tốt nhất là BE nên có API trả về bảng OrderEvents.
    // Dưới đây tôi giả định BE đã có API này.
    return axiosClient.get(`${ORDER_API}/events?count=${count}`);
  },
};

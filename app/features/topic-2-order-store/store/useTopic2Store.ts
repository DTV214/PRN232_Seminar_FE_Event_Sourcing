"use client";

import { create } from "zustand";
import { orderApi } from "../services/orderApi";

export type EventPayload = Record<string, unknown>;

export interface SystemEvent {
  id: string;
  aggregateId: string;
  aggregateType: string;
  eventType: string;
  eventData: EventPayload;
  timestamp: string;
}

export interface RawSystemEvent {
  id: string;
  aggregateId: string;
  aggregateType: string;
  eventType: string;
  eventData: string | EventPayload;
  timestamp: string;
}

interface Topic2State {
  activeProductId: string;
  activeProductName: string;

  setActiveProduct: (id: string, name: string) => void;
  createNewProduct: (name: string) => Promise<void>;

  events: SystemEvent[];
  inventoryCount: number;
  orderCount: number;
  isProcessing: boolean;

  fetchStock: () => Promise<void>;
  fetchEvents: () => Promise<void>;
  importStock: (quantity: number) => Promise<void>;

  createOrder: (qty: number) => Promise<void>;
  clearLogs: () => void;
}

export const useTopic2Store = create<Topic2State>((set, get) => ({
  activeProductId: "", // Để rỗng ban đầu (Dynamic)
  activeProductName: "",

  setActiveProduct: (id: string, name: string) => {
    set({ activeProductId: id, activeProductName: name });
    get().fetchStock();
  },

  createNewProduct: async (name: string) => {
    const newId = crypto.randomUUID();
    set({
      isProcessing: true,
      activeProductId: newId,
      activeProductName: name,
      inventoryCount: 0,
    });
    try {
      await orderApi.importStock({
        productId: newId,
        productName: name,
        stockQuantity: 0,
      });
      await get().fetchEvents();
    } catch (error) {
      console.error("Lỗi tạo sản phẩm mới:", error);
    } finally {
      set({ isProcessing: false });
    }
  },

  events: [],
  inventoryCount: 0,
  orderCount: 0,
  isProcessing: false,

  fetchStock: async () => {
    const productId = get().activeProductId;

    // BỔ SUNG CHỐT CHẶN 1: Nếu chưa chọn sản phẩm thì không làm gì cả
    if (!productId) return;

    try {
      const data = (await orderApi.getCurrentStock(productId)) as any;
      const stock = data.stockQuantity ?? data.data?.stockQuantity ?? 0;
      set({ inventoryCount: stock });
    } catch (error) {
      console.warn("Sản phẩm chưa có trong kho, đặt mặc định bằng 0");
      set({ inventoryCount: 0 });
    }
  },

  fetchEvents: async () => {
    try {
      const data = (await orderApi.getRecentEvents(20)) as any;
      const rawEvents: RawSystemEvent[] = data.data || data;

      const parsedEvents: SystemEvent[] = rawEvents.map(
        (ev: RawSystemEvent) => ({
          ...ev,
          eventData:
            typeof ev.eventData === "string"
              ? (JSON.parse(ev.eventData) as EventPayload)
              : (ev.eventData as EventPayload),
        }),
      );
      set({ events: parsedEvents });
    } catch (error) {
      console.error("Lỗi lấy lịch sử:", error);
    }
  },

  importStock: async (quantity) => {
    const { activeProductId, activeProductName } = get();

    // BỔ SUNG CHỐT CHẶN 2
    if (!activeProductId) {
      alert("Vui lòng chọn hoặc tạo sản phẩm trước khi nhập kho!");
      return;
    }

    set({ isProcessing: true });
    try {
      await orderApi.importStock({
        productId: activeProductId,
        productName: activeProductName,
        stockQuantity: quantity,
      });
      await get().fetchStock();
      await get().fetchEvents();
    } finally {
      set({ isProcessing: false });
    }
  },

  // ==============================================================
  // VÒNG LẶP SAGA POLLING (LINH HỒN CỦA GIAO DIỆN BẤT ĐỒNG BỘ)
  // ==============================================================
  createOrder: async (qty) => {
    if (get().isProcessing) return;

    const productId = get().activeProductId;

    // BỔ SUNG CHỐT CHẶN 3
    if (!productId) {
      alert("Vui lòng chọn hoặc tạo một sản phẩm trước khi mua hàng!");
      return;
    }

    set({ isProcessing: true }); // Bật loading xoay xoay trên UI

    try {
      // Bước 1: Gọi API kích nổ RabbitMQ
      const response = (await orderApi.createOrder({
        productId,
        quantity: qty,
      })) as any;

      // Lấy OrderId vừa được sinh ra từ Backend
      const orderId = response.orderId || response.data?.orderId;
      if (!orderId) throw new Error("Không nhận được OrderId từ hệ thống.");

      // Bước 2: Bắt đầu quá trình Polling hỏi thăm kết quả
      let attempts = 0;
      const maxAttempts = 15;

      const intervalId = setInterval(async () => {
        attempts++;
        try {
          const statusRes = (await orderApi.getOrderStatus(orderId)) as any;
          const orderData = statusRes.data || statusRes;

          // Nếu trạng thái đã thay đổi từ Pending sang Confirmed hoặc Cancelled
          if (
            orderData.status === "Confirmed" ||
            orderData.status === "Cancelled"
          ) {
            clearInterval(intervalId); // Tắt vòng lặp

            // Cập nhật lại số liệu trên màn hình
            await get().fetchStock();
            await get().fetchEvents();

            set({
              isProcessing: false,
              orderCount: get().orderCount + 1,
            });

            console.log(
              `Luồng Saga hoàn tất với trạng thái: ${orderData.status}`,
            );
          } else if (attempts >= maxAttempts) {
            // Trường hợp chờ quá lâu không thấy BE báo lại (Timeout)
            clearInterval(intervalId);
            set({ isProcessing: false });
            console.error("Timeout: Quá thời gian chờ phản hồi từ luồng Saga.");
          }
        } catch (pollError) {
          console.error("Lỗi khi kiểm tra trạng thái đơn hàng:", pollError);
          clearInterval(intervalId);
          set({ isProcessing: false });
        }
      }, 2000); // Mỗi 2 giây gọi hỏi thăm BE một lần
    } catch (error) {
      console.error("Lỗi khi phát động đơn hàng:", error);
      set({ isProcessing: false });
    }
  },

  clearLogs: () => set({ events: [], orderCount: 0 }),
}));

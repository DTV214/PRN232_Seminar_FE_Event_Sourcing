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

// (MỚI THÊM) Interface cho Sản phẩm trong kho
export interface InventoryItem {
  productId: string;
  productName: string;
  stockQuantity: number;
  lastUpdated: string;
}

interface Topic2State {
  activeProductId: string;
  activeProductName: string;
  productList: InventoryItem[]; // (MỚI THÊM) Danh sách tất cả sản phẩm

  setActiveProduct: (id: string, name: string) => void;
  createNewProduct: (name: string) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>; // (MỚI THÊM) Hàm xóa

  events: SystemEvent[];
  inventoryCount: number;
  orderCount: number;
  isProcessing: boolean;

  fetchAllProducts: () => Promise<void>; // (MỚI THÊM) Lấy tất cả SP
  fetchStock: () => Promise<void>;
  fetchEvents: () => Promise<void>;
  importStock: (quantity: number) => Promise<void>;

  createOrder: (qty: number) => Promise<void>;
  clearLogs: () => void;
}

export const useTopic2Store = create<Topic2State>((set, get) => ({
  activeProductId: "",
  activeProductName: "",
  productList: [],

  setActiveProduct: (id: string, name: string) => {
    set({ activeProductId: id, activeProductName: name });
    get().fetchStock();
  },

  // ==========================================
  // LẤY TẤT CẢ SẢN PHẨM TỪ BE
  // ==========================================
  fetchAllProducts: async () => {
    try {
      const data = (await orderApi.getAllStock()) as any;
      const list = data.data || data || [];
      set({ productList: list });
    } catch (error) {
      console.error("Lỗi lấy danh sách sản phẩm:", error);
    }
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
      await get().fetchAllProducts(); // Cập nhật lại list sau khi tạo
    } catch (error) {
      console.error("Lỗi tạo sản phẩm mới:", error);
    } finally {
      set({ isProcessing: false });
    }
  },

  // ==========================================
  // XÓA SẢN PHẨM
  // ==========================================
  deleteProduct: async (id: string) => {
    set({ isProcessing: true });
    try {
      await orderApi.deleteStock(id);
      await get().fetchAllProducts(); // Cập nhật lại list

      // Nếu sản phẩm đang chọn bị xóa, ta reset UI về rỗng
      if (get().activeProductId === id) {
        set({ activeProductId: "", activeProductName: "", inventoryCount: 0 });
      }
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
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
      const [inventoryDataRes, orderDataRes] = await Promise.all([
        orderApi.getRecentEvents(20).catch(() => ({ data: [] })),
        orderApi.getRecentOrderEvents(20).catch(() => ({ data: [] })),
      ]);

      const inventoryRawEvents =
        (inventoryDataRes as any).data || inventoryDataRes || [];
      const orderRawEvents = (orderDataRes as any).data || orderDataRes || [];

      const allRawEvents = [...inventoryRawEvents, ...orderRawEvents];

      const parsedEvents: SystemEvent[] = allRawEvents.map(
        (ev: RawSystemEvent) => ({
          ...ev,
          eventData:
            typeof ev.eventData === "string"
              ? (JSON.parse(ev.eventData) as EventPayload)
              : (ev.eventData as EventPayload),
        }),
      );

      parsedEvents.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
      set({ events: parsedEvents.slice(0, 20) });
    } catch (error) {
      console.error("Lỗi lấy lịch sử tổng hợp:", error);
    }
  },

  importStock: async (quantity) => {
    const { activeProductId, activeProductName } = get();
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
      await get().fetchAllProducts(); // Cập nhật lại số lượng trong List
    } finally {
      set({ isProcessing: false });
    }
  },

  createOrder: async (qty) => {
    if (get().isProcessing) return;

    const productId = get().activeProductId;
    if (!productId) {
      alert("Vui lòng chọn hoặc tạo một sản phẩm trước khi mua hàng!");
      return;
    }

    set({ isProcessing: true });

    try {
      const response = (await orderApi.createOrder({
        productId,
        quantity: qty,
      })) as any;

      const orderId = response.orderId || response.data?.orderId;
      if (!orderId) throw new Error("Không nhận được OrderId từ hệ thống.");

      let attempts = 0;
      const maxAttempts = 15;

      const intervalId = setInterval(async () => {
        attempts++;
        try {
          const statusRes = (await orderApi.getOrderStatus(orderId)) as any;
          const orderData = statusRes.data || statusRes;

          if (
            orderData.status === "Confirmed" ||
            orderData.status === "Cancelled"
          ) {
            clearInterval(intervalId);

            await get().fetchStock();
            await get().fetchEvents();
            await get().fetchAllProducts(); // Cập nhật lại số lượng trong List

            set({
              isProcessing: false,
              orderCount: get().orderCount + 1,
            });
          } else if (attempts >= maxAttempts) {
            clearInterval(intervalId);
            set({ isProcessing: false });
          }
        } catch (pollError) {
          clearInterval(intervalId);
          set({ isProcessing: false });
        }
      }, 2000);
    } catch (error) {
      set({ isProcessing: false });
    }
  },

  clearLogs: () => set({ events: [], orderCount: 0 }),
}));

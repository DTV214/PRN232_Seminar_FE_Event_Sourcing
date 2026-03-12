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
  activeProductName: string; // Thêm tên sản phẩm để hiển thị cho đẹp

  setActiveProduct: (id: string, name: string) => void;
  createNewProduct: (name: string) => Promise<void>; // Hàm tạo sản phẩm mới toanh

  events: SystemEvent[];
  inventoryCount: number;
  orderCount: number;
  isProcessing: boolean;

  fetchStock: () => Promise<void>;
  fetchEvents: () => Promise<void>;
  importStock: (quantity: number) => Promise<void>; // Nhận số lượng tùy ý
  simulateOrder: (qty: number) => Promise<void>; // Nhận số lượng tùy ý
  clearLogs: () => void;
}

export const useTopic2Store = create<Topic2State>((set, get) => ({
  activeProductId: "22222222-2222-2222-2222-222222222222",
  activeProductName: "Laptop Gaming",

  setActiveProduct: (id: string, name: string) => {
    set({ activeProductId: id, activeProductName: name });
    get().fetchStock();
  },

  // Logic tạo sản phẩm mới: Tạo UUID FE -> Bắn xuống BE với số lượng 0 để đăng ký
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
        stockQuantity: 0, // Khởi tạo kho rỗng
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
    try {
      const data = (await orderApi.getCurrentStock(productId)) as unknown as {
        stockQuantity: number;
      };
      set({ inventoryCount: data.stockQuantity });
    } catch (error) {
      console.warn("Sản phẩm chưa có trong kho, đặt mặc định bằng 0");
      set({ inventoryCount: 0 });
    }
  },

  fetchEvents: async () => {
    try {
      const data = (await orderApi.getRecentEvents(
        20,
      )) as unknown as RawSystemEvent[];
      const parsedEvents: SystemEvent[] = data.map((ev: RawSystemEvent) => ({
        ...ev,
        eventData:
          typeof ev.eventData === "string"
            ? (JSON.parse(ev.eventData) as EventPayload)
            : (ev.eventData as EventPayload),
      }));
      set({ events: parsedEvents });
    } catch (error) {
      console.error("Lỗi lấy lịch sử:", error);
    }
  },

  importStock: async (quantity) => {
    const { activeProductId, activeProductName } = get();
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

  simulateOrder: async (qty) => {
    if (get().isProcessing) return;
    const productId = get().activeProductId;
    set({ isProcessing: true });
    try {
      await orderApi.simulateOrder({
        orderId: crypto.randomUUID(),
        productId,
        quantity: qty,
      });
      setTimeout(async () => {
        await get().fetchStock();
        await get().fetchEvents();
        set({ isProcessing: false, orderCount: get().orderCount + 1 });
      }, 800);
    } catch (error) {
      set({ isProcessing: false });
    }
  },

  clearLogs: () => set({ events: [], orderCount: 0 }),
}));

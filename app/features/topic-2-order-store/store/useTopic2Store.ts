"use client";

import { create } from "zustand";

export interface SystemEvent {
  id: string;
  type:
    | "OrderCreated"
    | "InventoryReserved"
    | "InventoryFailed"
    | "OrderFinalized"
    | "OrderCancelled";
  service: "OrderService" | "InventoryService";
  payload: any;
  timestamp: string;
}

interface Topic2State {
  events: SystemEvent[];
  inventoryCount: number;
  orderCount: number;
  isProcessing: boolean;

  // Actions
  simulateOrder: (orderData: {
    productId: string;
    qty: number;
  }) => Promise<void>;
  clearLogs: () => void;
}

export const useTopic2Store = create<Topic2State>((set, get) => ({
  events: [],
  inventoryCount: 15, // Code cứng ban đầu có 15 máy
  orderCount: 0,
  isProcessing: false,

  simulateOrder: async (orderData) => {
    if (get().isProcessing) return;
    set({ isProcessing: true });

    const createEvent = (
      type: SystemEvent["type"],
      service: SystemEvent["service"],
      payload: any,
    ): SystemEvent => ({
      id: `EVT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      type,
      service,
      payload,
      timestamp: new Date().toLocaleTimeString(),
    });

    // --- BƯỚC 1: Order Service phát động ---
    const ev1 = createEvent("OrderCreated", "OrderService", {
      ...orderData,
      status: "Pending",
    });
    set((s) => ({ events: [ev1, ...s.events] }));

    await new Promise((r) => setTimeout(r, 1500)); // Giả lập delay mạng

    // --- BƯỚC 2: Inventory Service xử lý ---
    const currentStock = get().inventoryCount;

    if (currentStock >= orderData.qty) {
      const ev2 = createEvent("InventoryReserved", "InventoryService", {
        productId: orderData.productId,
        remainingStock: currentStock - orderData.qty,
      });
      set((s) => ({
        events: [ev2, ...s.events],
        inventoryCount: currentStock - orderData.qty,
      }));

      await new Promise((r) => setTimeout(r, 1000));

      // --- BƯỚC 3: Chốt đơn thành công ---
      const ev3 = createEvent("OrderFinalized", "OrderService", {
        status: "Success",
      });
      set((s) => ({
        events: [ev3, ...s.events],
        orderCount: s.orderCount + 1,
      }));
    } else {
      // LUỒNG THẤT BẠI (Hết hàng)
      const ev2Fail = createEvent("InventoryFailed", "InventoryService", {
        reason: "Out of stock",
      });
      set((s) => ({ events: [ev2Fail, ...s.events] }));

      await new Promise((r) => setTimeout(r, 1000));

      const ev3Cancel = createEvent("OrderCancelled", "OrderService", {
        reason: "Inventory Compensation",
      });
      set((s) => ({ events: [ev3Cancel, ...s.events] }));
    }

    set({ isProcessing: false });
  },

  clearLogs: () => set({ events: [], inventoryCount: 15, orderCount: 0 }),
}));

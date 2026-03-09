"use client";

import { create } from "zustand";

// Định nghĩa kiểu dữ liệu cho Sự kiện (Event Schema)
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
  // 1. Dòng sự kiện (Event Stream)
  events: SystemEvent[];

  // 2. Read Models (Dữ liệu đã tính toán để hiển thị UI)
  inventoryCount: number;
  orderCount: number;

  // 3. Trạng thái Loading
  isProcessing: boolean;

  // CÁC HÀNH ĐỘNG (ACTIONS)
  // Thêm sự kiện mới vào danh sách (Sử dụng khi nhận dữ liệu từ BE)
  addEvent: (event: SystemEvent) => void;

  // Cập nhật trạng thái hiển thị dựa trên Event vừa nhận
  updateReadModel: (event: SystemEvent) => void;

  // Xóa trắng demo
  clearLogs: () => void;
}

export const useTopic2Store = create<Topic2State>((set) => ({
  events: [],
  inventoryCount: 0,
  orderCount: 0,
  isProcessing: false,

  addEvent: (event) => {
    set((state) => ({
      events: [event, ...state.events], // Đưa event mới lên đầu
    }));
  },

  updateReadModel: (event) => {
    set((state) => {
      let newInventory = state.inventoryCount;
      let newOrderCount = state.orderCount;

      // LOGIC TÍNH TOÁN (PROJECTION)
      switch (event.type) {
        case "OrderFinalized":
          newOrderCount += 1;
          break;
        case "InventoryReserved":
          // Ví dụ: BE báo đã trừ kho, ta cập nhật con số hiển thị
          newInventory = event.payload.remainingStock;
          break;
        default:
          break;
      }

      return { inventoryCount: newInventory, orderCount: newOrderCount };
    });
  },

  clearLogs: () => set({ events: [], inventoryCount: 0, orderCount: 0 }),
}));

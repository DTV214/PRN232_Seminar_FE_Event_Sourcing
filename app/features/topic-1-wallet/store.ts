"use client";

import { create } from "zustand";
import {
  WalletInfo,
  Transaction,
  WalletEvent,
  createUser,
  createAccount,
  getWallet,
  getWalletByUsername,
  getWalletByEmail,
  deposit,
  withdraw,
  getTransactions,
  getSuspicious,
  getEvents,
  CreateUserRequest,
  CreateTransactionRequest,
} from "./api";

interface WalletStore {
  // State
  wallet: WalletInfo | null;
  transactions: Transaction[];
  events: WalletEvent[];
  suspiciousList: Transaction[];
  suspiciousCount: number;
  loading: boolean;
  message: string | null;
  messageType: "success" | "error" | "warning" | null;

  // Actions
  doCreateUser: (data: CreateUserRequest) => Promise<void>;
  doCreateAccount: (data: { username: string; email: string }) => Promise<void>;
  doLoadWallet: (accountId: string) => Promise<void>;
  doLoadWalletByUsername: (username: string) => Promise<void>;
  doDeposit: (data: CreateTransactionRequest) => Promise<void>;
  doWithdraw: (data: CreateTransactionRequest) => Promise<void>;
  doLoadTransactions: (walletId: string) => Promise<void>;
  doLoadSuspicious: () => Promise<void>;
  doLoadEvents: (walletId: string) => Promise<void>;
  clearMessage: () => void;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  wallet: null,
  transactions: [],
  events: [],
  suspiciousList: [],
  suspiciousCount: 0,
  loading: false,
  message: null,
  messageType: null,

  clearMessage: () => set({ message: null, messageType: null }),

  doCreateUser: async (data) => {
    set({ loading: true, message: null });
    try {
      const res: any = await createUser(data);
      set({
        loading: false,
        message: `🎉 Tạo user "${data.username}" thành công! Đang tự động tạo ví qua RabbitMQ...`,
        messageType: "success",
      });
      // Tự động load ví sau 1.5 giây (chờ RabbitMQ xử lý)
      setTimeout(() => {
        get().doLoadWalletByUsername(data.username);
      }, 1500);
    } catch (err: any) {
      set({
        loading: false,
        message: `❌ Không thể tạo user. ${err.response?.data?.message || 'Vui lòng kiểm tra lại thông tin.'}`,
        messageType: "error",
      });
    }
  },

  doCreateAccount: async (data) => {
    set({ loading: true, message: null });
    try {
      const res: any = await createAccount(data);
      set({
        loading: false,
        wallet: res,
        message: `🎉 Tạo ví thành công! Số dư ban đầu: 0 VND. AccountId: ${(res as any).accountId?.slice(0, 8)}...`,
        messageType: "success",
      });
    } catch (err: any) {
      set({
        loading: false,
        message: `❌ Không thể tạo ví. ${err.response?.data?.message || 'Vui lòng thử lại.'}`,
        messageType: "error",
      });
    }
  },

  doLoadWallet: async (searchInput) => {
    set({ loading: true, message: null });
    const isGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(searchInput);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(searchInput);
    const isNumber = /^\d+$/.test(searchInput);

    // Số nguyên (User ID) không hợp lệ cho việc tìm ví
    if (isNumber) {
      set({
        loading: false,
        message: `💡 Vui lòng nhập Email (ví dụ: user@gmail.com) hoặc Username để tìm ví. Số ID không được hỗ trợ.`,
        messageType: "warning",
      });
      return;
    }

    try {
      let res;
      if (isEmail) {
        res = await getWalletByEmail(searchInput);
      } else if (isGuid) {
        res = await getWallet(searchInput);
      } else {
        res = await getWalletByUsername(searchInput);
      }
      set({
        loading: false,
        wallet: res,
        message: `🎉 Đã tìm thấy ví của "${(res as any).username}"! Số dư: ${(res as any).balance?.toLocaleString()} VND`,
        messageType: "success",
      });
      if ((res as any).walletId) {
        get().doLoadTransactions((res as any).walletId);
      }
    } catch (err: any) {
      const status = err.response?.status;
      let msg = "";
      if (status === 404) {
        if (isEmail) {
          msg = `🔍 Không tìm thấy ví cho email "${searchInput}". User chưa tồn tại hoặc ví chưa được tạo.`;
        } else if (isGuid) {
          msg = `🔍 Không tìm thấy ví với AccountId này.`;
        } else {
          msg = `🔍 Không tìm thấy ví cho username "${searchInput}".`;
        }
      } else if (status === 400) {
        msg = `⚠️ Định dạng không hợp lệ. Vui lòng nhập Email, Username hoặc AccountId (GUID).`;
      } else {
        msg = `❌ Lỗi kết nối server. Vui lòng thử lại sau.`;
      }
      set({ loading: false, message: msg, messageType: "error" });
    }
  },

  doLoadWalletByUsername: async (username) => {
    set({ loading: true });
    try {
      const res = await getWalletByUsername(username);
      set({
        loading: false,
        wallet: res,
        message: `✅ Ví của "${(res as any).username}" đã sẵn sàng!`,
        messageType: "success",
      });
    } catch {
      set({
        loading: false,
        message: `⏳ Ví chưa sẵn sàng (RabbitMQ đang xử lý). Vui lòng chờ thêm vài giây rồi nhập AccountId thủ công.`,
        messageType: "warning",
      });
    }
  },

  doDeposit: async (data) => {
    set({ loading: true, message: null });
    try {
      const res: any = await deposit(data);
      const warning = res.warning;
      set({
        loading: false,
        message: warning
          ? `⚠️ Nạp tiền thành công! Tuy nhiên hệ thống phát hiện: ${warning}`
          : `💰 Nạp ${data.amount.toLocaleString()} VND thành công! Số dư đã được cập nhật.`,
        messageType: warning ? "warning" : "success",
      });
      // Reload wallet & transactions SONG SONG (nhanh hơn)
      const w = get().wallet;
      if (w) {
        Promise.all([
          getWallet(w.accountId).then(u => set({ wallet: u })).catch(() => {}),
          get().doLoadTransactions(w.walletId),
        ]);
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || '';
      set({
        loading: false,
        message: errMsg.includes('Số dư') 
          ? `💳 ${errMsg}` 
          : `❌ Không thể nạp tiền. ${errMsg || 'Vui lòng thử lại.'}`,
        messageType: "error",
      });
    }
  },

  doWithdraw: async (data) => {
    set({ loading: true, message: null });
    try {
      const res: any = await withdraw(data);
      const warning = res.warning;
      set({
        loading: false,
        message: warning
          ? `⚠️ Rút tiền thành công! Cảnh báo từ hệ thống: ${warning}`
          : `💸 Rút ${data.amount.toLocaleString()} VND thành công! Số dư đã được cập nhật.`,
        messageType: warning ? "warning" : "success",
      });
      // Reload wallet & transactions SONG SONG (nhanh hơn)
      const w = get().wallet;
      if (w) {
        Promise.all([
          getWallet(w.accountId).then(u => set({ wallet: u })).catch(() => {}),
          get().doLoadTransactions(w.walletId),
        ]);
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || '';
      set({
        loading: false,
        message: errMsg.includes('Số dư') 
          ? `💳 ${errMsg}` 
          : `❌ Không thể rút tiền. ${errMsg || 'Vui lòng thử lại.'}`,
        messageType: "error",
      });
    }
  },

  doLoadTransactions: async (walletId) => {
    try {
      const res = await getTransactions(walletId);
      set({ transactions: Array.isArray(res) ? res : [] });
    } catch {
      set({ transactions: [] });
    }
  },

  doLoadSuspicious: async () => {
    try {
      const res: any = await getSuspicious();
      set({
        suspiciousList: res.transactions || [],
        suspiciousCount: res.totalFound || 0,
      });
    } catch {
      set({ suspiciousList: [], suspiciousCount: 0 });
    }
  },

  doLoadEvents: async (walletId) => {
    try {
      const res: any = await getEvents(walletId);
      set({ events: res.events || [] });
    } catch {
      set({ events: [] });
    }
  },
}));

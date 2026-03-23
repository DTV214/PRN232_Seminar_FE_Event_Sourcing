"use client";

import axiosClient from "@/app/api/axios-client";

// === Types ===
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
}

export interface CreateTransactionRequest {
  accountId: string;
  amount: number;
  description: string;
}

export interface WalletInfo {
  walletId: string;
  accountId: string;
  username: string;
  email: string;
  balance: number;
  currency: string;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  transactionType: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  timestamp: string;
  isSuspicious: boolean;
  suspiciousReason: string | null;
}

export interface WalletEvent {
  id: string;
  aggregateId: string;
  eventType: string;
  eventData: Record<string, unknown>;
  timestamp: string;
  hash: string;
  previousHash: string;
}

// === API Functions ===

/** Tạo user mới → UserService publish UserCreatedEvent → PaymentService tự tạo ví */
export const createUser = (data: CreateUserRequest) =>
  axiosClient.post("/user-service/api/users", data);

/** Tạo account + wallet trực tiếp (manual) */
export const createAccount = (data: { username: string; email: string }) =>
  axiosClient.post("/payment-service/api/khanh-wallet/accounts", data);

/** Xem thông tin ví theo accountId */
export const getWallet = (accountId: string): Promise<WalletInfo> =>
  axiosClient.get(`/payment-service/api/khanh-wallet/accounts/${accountId}`);

/** Tìm ví theo username */
export const getWalletByUsername = (username: string): Promise<WalletInfo> =>
  axiosClient.get(`/payment-service/api/khanh-wallet/accounts/by-username/${username}`);

/** Tìm ví theo email */
export const getWalletByEmail = (email: string): Promise<WalletInfo> =>
  axiosClient.get(`/payment-service/api/khanh-wallet/accounts/by-email/${email}`);

/** Nạp tiền */
export const deposit = (data: CreateTransactionRequest) =>
  axiosClient.post("/payment-service/api/khanh-wallet/deposit", data);

/** Rút tiền */
export const withdraw = (data: CreateTransactionRequest) =>
  axiosClient.post("/payment-service/api/khanh-wallet/withdraw", data);

/** Lịch sử giao dịch */
export const getTransactions = (walletId: string): Promise<Transaction[]> =>
  axiosClient.get(`/payment-service/api/khanh-wallet/transactions/${walletId}`);

/** Tra cứu giao dịch bất thường */
export const getSuspicious = () =>
  axiosClient.get("/payment-service/api/khanh-wallet/suspicious");

/** Event Sourcing — lấy toàn bộ event history */
export const getEvents = (walletId: string) =>
  axiosClient.get(`/payment-service/api/khanh-wallet/events/${walletId}`);

/** Kiểm tra integrity của hash chain */
export const verifyEvents = (walletId: string) =>
  axiosClient.get(`/payment-service/api/khanh-wallet/events/${walletId}/verify`);

/** Replay & Self-Healing — Tái dựng balance từ events, tự sửa nếu sai */
export const replayAndHeal = (walletId: string) =>
  axiosClient.post(`/payment-service/api/khanh-wallet/replay/${walletId}`);

import axiosClient from "@/app/api/axios-client";
import { AxiosResponse } from "axios";

export interface Transaction {
    id: string;
    amount: number;
    status: "Pending" | "Completed";
    description: string;
    createdAt: string;
}

export interface CreateTransactionRequest {
    amount: number;
    description: string;
}

export interface CreateTransactionResponse {
    id: string;
}

export interface ApproveTransactionResponse {
    message: string;
}

// Fetch all transactions and return 5 most recent ones
export const fetchTransactions = async (): Promise<Transaction[]> => {
    const response = await axiosClient.get("/transaction-service");
    const data = response.data ?? response;

    const sorted = data.sort(
        (a: Transaction, b: Transaction) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return sorted.slice(0, 5);
};

// Create a new transaction
export const createTransaction = async (
    data: CreateTransactionRequest
): Promise<CreateTransactionResponse> => {
    const response = await axiosClient.post("/transaction-service", data);
    const res = response.data ?? response;
    return res;
};

// Approve a transaction
export const approveTransaction = async (
    id: string
): Promise<ApproveTransactionResponse> => {
    const response = await axiosClient.post(
        `/transaction-service/${id}/approve`
    );
    const res = response.data ?? response;
    return res;
};

export interface Balance {
    id: string;
    userId: string;
    amount: number;
}

export interface Notification {
    id: string;
    message: string;
    messagedAt: string;
}

// Fetch balance
export const fetchBalance = async (): Promise<Balance> => {
    const response = await axiosClient.get("/balance-service");
    const data = response.data ?? response;
    return data;
};

// Fetch all notifications and return 3 most recent ones
export const fetchNotifications = async (): Promise<Notification[]> => {
    const response = await axiosClient.get("/notification-service");
    const data = response.data ?? response;

    const sorted = data.sort(
        (a: Notification, b: Notification) =>
            new Date(b.messagedAt).getTime() - new Date(a.messagedAt).getTime()
    );
    return sorted.slice(0, 3);
};

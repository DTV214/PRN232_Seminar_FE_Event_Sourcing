"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
    Plus,
    CheckCircle2,
    Clock,
    AlertCircle,
    ArrowUp,
    ArrowDown,
} from "lucide-react";
import { approveTransaction, createTransaction, fetchTransactions, Transaction } from "../api";

export const TransactionComponent = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [approving, setApproving] = useState<string | null>(null);
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");

    // Fetch transactions on mount
    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            setLoading(true);
            const data = await fetchTransactions();
            setTransactions(data);
        } catch (error) {
            toast.error("Không thể tải danh sách giao dịch");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTransaction = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || !description) {
            toast.error("Vui lòng điền đủ thông tin");
            return;
        }

        try {
            setCreating(true);
            const response = await createTransaction({
                amount: parseFloat(amount),
                description,
            });

            toast.success(`✅ Giao dịch mới được tạo (ID: ${response.id})`);

            // Reset form
            setAmount("");
            setDescription("");

            // Reload transactions
            await loadTransactions();
        } catch (error) {
            toast.error("Không thể tạo giao dịch");
            console.error(error);
        } finally {
            setCreating(false);
        }
    };

    const handleApproveTransaction = async (id: string) => {
        try {
            setApproving(id);
            const response = await approveTransaction(id);

            toast.success(response.message || "✅ Giao dịch thành công!");

            // Reload transactions
            await loadTransactions();
        } catch (error) {
            toast.error("Không thể xác nhận giao dịch");
            console.error(error);
        } finally {
            setApproving(null);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        date.setHours(date.getHours() + 5);

        return date.toLocaleString("vi-VN");
    };

    const getStatusBadge = (status: string) => {
        if (status === "Completed") {
            return (
                <Badge className="bg-green-100 text-green-800 flex gap-1 items-center">
                    <CheckCircle2 className="w-3 h-3" />
                    Hoàn thành
                </Badge>
            );
        }
        return (
            <Badge className="bg-amber-100 text-amber-800 flex gap-1 items-center">
                <Clock className="w-3 h-3" />
                Chờ xử lý
            </Badge>
        );
    };

    return (
        <div className="space-y-8 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Transaction Form */}
                <div className="lg:col-span-1">
                    <Card className="p-6 bg-white/40 backdrop-blur-xl border-2 border-blue-200/50 shadow-sm">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-blue-600" />
                            Tạo Giao dịch Mới
                        </h2>

                        <Separator className="mb-4" />

                        <form onSubmit={handleCreateTransaction} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Số tiền (VNĐ)
                                </label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Nhập số tiền..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    disabled={creating}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Mô tả
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Nhập mô tả giao dịch..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    rows={3}
                                    required
                                    disabled={creating}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors"
                                disabled={creating}
                            >
                                {creating ? "Đang tạo..." : "Tạo Giao dịch"}
                            </Button>
                        </form>
                    </Card>
                </div>

                {/* Transactions List */}
                <div className="lg:col-span-2">
                    <Card className="p-6 bg-white/40 backdrop-blur-xl border-2 border-primary/20 shadow-sm">
                        <h2 className="text-xl font-bold mb-4">5 Giao dịch Gần nhất</h2>

                        <Separator className="mb-4" />

                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                <AlertCircle className="w-8 h-8 mb-2" />
                                <p>Chưa có giao dịch nào</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {transactions.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50/50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-mono text-muted-foreground truncate">
                                                        {transaction.id}
                                                    </span>
                                                    {getStatusBadge(transaction.status)}
                                                </div>
                                                <p className="text-2xl text-muted-foreground">
                                                    {formatDate(transaction.createdAt)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-green-600">
                                                    +{transaction.amount.toLocaleString("vi-VN")} ₫
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-sm text-foreground mb-3">
                                            {transaction.description}
                                        </p>

                                        {transaction.status === "Pending" && (
                                            <Button
                                                onClick={() => handleApproveTransaction(transaction.id)}
                                                disabled={approving === transaction.id}
                                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-1 rounded transition-colors text-sm"
                                            >
                                                {approving === transaction.id
                                                    ? "Đang xác nhận..."
                                                    : "✓ Hoàn thành"}
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

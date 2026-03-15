"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { fetchBalance, Balance } from "../api";
import { TrendingUp, TrendingDown } from "lucide-react";

export const BalanceComponent = () => {
    const [balance, setBalance] = useState<Balance | null>(null);
    const [previousAmount, setPreviousAmount] = useState<number>(0);
    const [delta, setDelta] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    // Fetch balance on mount and poll for changes every 5 seconds
    useEffect(() => {
        const loadBalance = async () => {
            try {
                setLoading(true);
                const data = await fetchBalance();

                // Calculate delta if balance was already loaded
                if (balance) {
                    const change = data.amount - balance.amount;
                    if (change !== 0) {
                        setDelta(change);
                        setPreviousAmount(balance.amount);
                    }
                }

                setBalance(data);
            } catch (error) {
                console.error("Không thể tải số dư:", error);
            } finally {
                setLoading(false);
            }
        };

        loadBalance();

        // Poll for balance changes every 5 seconds
        const interval = setInterval(loadBalance, 5000);

        return () => clearInterval(interval);
    }, [balance]);

    if (loading && !balance) {
        return (
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50/50 backdrop-blur-xl border-2 border-blue-200/50 shadow-sm">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </Card>
        );
    }

    const isDeltaPositive = delta > 0;

    return (
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50/50 backdrop-blur-xl border-2 border-blue-200/50 shadow-sm">
            <h2 className="text-lg font-semibold text-muted-foreground mb-6">
                💰 Số dư Tài khoản
            </h2>

            {balance && (
                <div className="space-y-6">
                    {/* Main Balance Display */}
                    <div>
                        <p className="text-sm text-muted-foreground mb-2">Số dư hiện tại</p>
                        <div className="text-5xl md:text-6xl font-black text-blue-600 tracking-tighter">
                            {balance.amount.toLocaleString("vi-VN")} ₫
                        </div>
                    </div>

                    {/* Delta Indicator */}
                    {delta !== 0 && (
                        <div className="pt-4 border-t border-blue-200">
                            <div
                                className={`flex items-center gap-3 p-4 rounded-lg ${isDeltaPositive
                                    ? "bg-green-100/50 border border-green-200"
                                    : "bg-red-100/50 border border-red-200"
                                    }`}
                            >
                                {isDeltaPositive ? (
                                    <TrendingUp className="w-6 h-6 text-green-600" />
                                ) : (
                                    <TrendingDown className="w-6 h-6 text-red-600" />
                                )}

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Sự thay đổi
                                    </p>
                                    <p
                                        className={`text-lg font-bold ${isDeltaPositive ? "text-green-600" : "text-red-600"
                                            }`}
                                    >
                                        {isDeltaPositive ? "+" : "-"}
                                        {Math.abs(delta).toLocaleString("vi-VN")} ₫
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        từ {previousAmount.toLocaleString("vi-VN")} ₫
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* User ID */}
                    <div className="pt-4 border-t border-blue-200">
                        <p className="text-xs text-muted-foreground mb-1">User ID</p>
                        <p className="text-sm font-mono text-foreground break-all">
                            {balance.userId}
                        </p>
                    </div>
                </div>
            )}
        </Card>
    );
};

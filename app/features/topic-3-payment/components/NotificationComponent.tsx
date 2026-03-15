"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { fetchNotifications, Notification } from "../api";
import { Bell, AlertCircle } from "lucide-react";

export const NotificationComponent = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                setLoading(true);
                const data = await fetchNotifications();
                setNotifications(data);
            } catch (error) {
                console.error("Không thể tải thông báo:", error);
            } finally {
                setLoading(false);
            }
        };

        loadNotifications();

        // Poll for new notifications every 10 seconds
        const interval = setInterval(loadNotifications, 10000);

        return () => clearInterval(interval);
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        date.setHours(date.getHours() + 5);

        return date.toLocaleString("vi-VN");
    };

    if (loading && notifications.length === 0) {
        return (
            <Card className="p-8 bg-gradient-to-br from-amber-50 to-orange-50/50 backdrop-blur-xl border-2 border-amber-200/50 shadow-sm">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-8 bg-gradient-to-br from-amber-50 to-orange-50/50 backdrop-blur-xl border-2 border-amber-200/50 shadow-sm">
            <h2 className="text-lg font-semibold text-muted-foreground mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Thông báo Gần đây
            </h2>

            {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm">Chưa có thông báo nào</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notification, index) => (
                        <div
                            key={notification.id}
                            className="p-4 rounded-lg bg-white/60 backdrop-blur-sm border border-amber-100 hover:bg-white/80 transition-colors animate-in fade-in-up"
                            style={{
                                animationDelay: `${index * 100}ms`,
                            }}
                        >
                            {/* Notification Number Badge */}
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-200 text-amber-800 text-xs font-bold">
                                        {index + 1}
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    {/* Message */}
                                    <p className="text-sm text-foreground font-medium mb-2">
                                        {notification.message}
                                    </p>

                                    {/* Time */}
                                    <p className="text-2xl text-muted-foreground">
                                        {formatDate(notification.messagedAt)}
                                    </p>

                                    {/* Notification ID */}
                                    <p className="text-xs text-muted-foreground font-mono mt-2 truncate">
                                        ID: {notification.id}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};

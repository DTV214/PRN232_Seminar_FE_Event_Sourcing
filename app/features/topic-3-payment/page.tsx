"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TransactionComponent } from "./components/TransactionComponent";
import { BalanceComponent } from "./components/BalanceComponent";
import { NotificationComponent } from "./components/NotificationComponent";

export default function Topic3Page() {
  return (
    <div className="min-h-screen flex flex-col bg-theme-gradient">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 container mx-auto px-6">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-3 tracking-tighter">
            Hậu Thanh toán
          </h1>
          <p className="text-lg text-muted-foreground">
            Quản lý giao dịch, theo dõi số dư tài khoản và nhận thông báo cập nhật
          </p>
        </div>

        {/* Three Component Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Transaction (Full Height, 1-2 columns depending on screen) */}
          <div className="lg:col-span-2">
            <TransactionComponent />
          </div>

          {/* Right: Balance and Notification (1 column) */}
          <div className="lg:col-span-1 space-y-8">
            <BalanceComponent />
            <NotificationComponent />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

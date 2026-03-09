"use client";

import * as React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Activity, Info, LayoutDashboard } from "lucide-react";
import { OrderForm } from "@/app/features/topic-2-order-store/components/OrderForm";
import { InventoryCard } from "@/app/features/topic-2-order-store/components/InventoryCard";
import { EventMonitor } from "@/app/features/event-monitor/components/EventMonitor";

// Import các thành phần của Chủ đề 2


export default function Topic2Page() {
  return (
    <div className="min-h-screen flex flex-col bg-theme-gradient selection:bg-primary/20">
      <Navbar />

      <main className="flex-1 pt-32 pb-16 container mx-auto px-6">
        {/* Header của Sân khấu Demo */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 animate__animated animate__fadeIn">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest mb-3">
              <Activity className="w-4 h-4" />
              Subject 2: Distributed Transactions & Event Sourcing
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">
              Mô phỏng <span className="text-primary">Saga Pattern</span>
            </h1>
          </div>

          <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-sm">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            <div className="text-left">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">
                Trạng thái
              </p>
              <p className="text-sm font-bold text-foreground">
                Sandbox Active
              </p>
            </div>
          </div>
        </div>

        {/* Bố cục chính của Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cột trái (4/12): Khu vực tương tác và Trạng thái Read-model */}
          <div className="lg:col-span-4 space-y-8 animate__animated animate__fadeInLeft">
            <OrderForm />
            <InventoryCard />

            {/* Khối hướng dẫn nhanh cho Seminar */}
            <div className="p-8 rounded-[2rem] bg-secondary/10 border border-secondary shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Info className="w-12 h-12 text-secondary-foreground" />
              </div>
              <h4 className="font-bold text-secondary-foreground mb-3 flex items-center gap-2">
                Cơ chế hoạt động
              </h4>
              <p className="text-sm text-secondary-foreground/80 leading-relaxed font-medium">
                Khi bạn gửi lệnh đặt hàng, <strong>Order Service</strong> sẽ
                không trừ kho ngay. Nó sẽ đẩy một sự kiện vào{" "}
                <strong>Event Store</strong>. Hệ thống{" "}
                <strong>Inventory</strong> sẽ lắng nghe và phản hồi lại qua một
                sự kiện khác.
              </p>
            </div>
          </div>

          {/* Cột phải (8/12): Event Monitor - Trung tâm dữ liệu bất biến */}
          <div className="lg:col-span-8 h-[80vh] sticky top-32 animate__animated animate__fadeInRight">
            <EventMonitor />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

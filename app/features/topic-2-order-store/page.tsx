"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Activity, Info, LayoutDashboard, Plus, Package } from "lucide-react";
import { OrderForm } from "@/app/features/topic-2-order-store/components/OrderForm";
import { InventoryCard } from "@/app/features/topic-2-order-store/components/InventoryCard";
import { EventMonitor } from "@/app/features/event-monitor/components/EventMonitor";
import { useTopic2Store } from "@/app/features/topic-2-order-store/store/useTopic2Store";

export default function Topic2Page() {
  const {
    activeProductId,
    activeProductName,
    setActiveProduct,
    createNewProduct,
    fetchStock,
    fetchEvents,
    isProcessing,
  } = useTopic2Store();

  const [newProductName, setNewProductName] = useState("");

  useEffect(() => {
    fetchStock();
    fetchEvents();
  }, [activeProductId, fetchStock, fetchEvents]);

  const handleCreateNew = async () => {
    if (!newProductName.trim()) return;
    await createNewProduct(newProductName);
    setNewProductName("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-theme-gradient selection:bg-primary/20">
      <Navbar />

      <main className="flex-1 pt-32 pb-16 container mx-auto px-6">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
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
                Live Database Active
              </p>
            </div>
          </div>
        </div>

        {/* BẢNG ĐIỀU KHIỂN SẢN PHẨM */}
        <div
          className={`flex flex-col md:flex-row gap-4 mb-8 p-4 backdrop-blur-xl rounded-3xl border shadow-sm items-center justify-between transition-all ${!activeProductId ? "bg-primary/10 border-primary/30 animate-pulse" : "bg-white/40 border-white/60"}`}
        >
          <div className="flex flex-wrap gap-2 items-center">
            <span
              className={`text-xs font-black uppercase ml-2 mr-2 flex items-center gap-1 ${!activeProductId ? "text-primary" : "text-muted-foreground"}`}
            >
              <Package className="w-4 h-4" />{" "}
              {!activeProductId ? "👉 CHỌN HOẶC TẠO SẢN PHẨM:" : "Kho hàng:"}
            </span>
            <button
              onClick={() =>
                setActiveProduct(
                  "22222222-2222-2222-2222-222222222222",
                  "Laptop Gaming",
                )
              }
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeProductId === "22222222-2222-2222-2222-222222222222" ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-white hover:bg-slate-50 text-slate-600"}`}
            >
              💻 Laptop
            </button>
            <button
              onClick={() =>
                setActiveProduct(
                  "33333333-3333-3333-3333-333333333333",
                  "iPhone 15 Pro",
                )
              }
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeProductId === "33333333-3333-3333-3333-333333333333" ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-white hover:bg-slate-50 text-slate-600"}`}
            >
              📱 iPhone
            </button>

            {/* SỬA LỖI Ở ĐÂY: Thêm điều kiện activeProductId phải có giá trị */}
            {activeProductId &&
              !activeProductId.startsWith("222") &&
              !activeProductId.startsWith("333") && (
                <button className="px-4 py-2 rounded-xl text-xs font-bold transition-all bg-primary text-white shadow-lg shadow-primary/30">
                  📦 {activeProductName}
                </button>
              )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              placeholder="Nhập tên SP mới..."
              className="px-4 py-2 rounded-xl text-sm bg-white/60 border border-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-48"
              disabled={isProcessing}
            />
            <button
              onClick={handleCreateNew}
              disabled={isProcessing || !newProductName.trim()}
              className="p-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50"
              title="Tạo sản phẩm mới"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bố cục chính */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-8">
            <OrderForm />
            <InventoryCard />

            <div className="p-8 rounded-[2rem] bg-secondary/10 border border-secondary shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Info className="w-12 h-12 text-secondary-foreground" />
              </div>
              <h4 className="font-bold text-secondary-foreground mb-3 flex items-center gap-2">
                Hướng dẫn Demo Saga
              </h4>
              <ul className="text-sm text-secondary-foreground/80 leading-relaxed font-medium space-y-2 list-disc pl-4">
                <li>
                  Hãy thử <strong>Tạo sản phẩm mới</strong>, kho sẽ ở mức 0.
                </li>
                <li>
                  Nhập mua số lượng lớn để xem cảnh báo{" "}
                  <strong>Saga Thất bại</strong> (Compensating Transaction).
                </li>
                <li>
                  Nhập thêm hàng vào kho và Mua lại để xem{" "}
                  <strong>Saga Thành công</strong>.
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-8 h-[80vh] sticky top-32">
            <EventMonitor />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

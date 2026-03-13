"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Activity,
  Info,
  LayoutDashboard,
  Plus,
  Package,
  Trash2,
} from "lucide-react";
import { OrderForm } from "@/app/features/topic-2-order-store/components/OrderForm";
import { InventoryCard } from "@/app/features/topic-2-order-store/components/InventoryCard";
import { EventMonitor } from "@/app/features/event-monitor/components/EventMonitor";
import { useTopic2Store } from "@/app/features/topic-2-order-store/store/useTopic2Store";

export default function Topic2Page() {
  const {
    activeProductId,
    productList,
    setActiveProduct,
    createNewProduct,
    deleteProduct,
    fetchAllProducts,
    fetchStock,
    fetchEvents,
    isProcessing,
  } = useTopic2Store();

  const [newProductName, setNewProductName] = useState("");

  // Gọi fetchAllProducts lần đầu tiên khi mở trang web
  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

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

        {/* BẢNG ĐIỀU KHIỂN SẢN PHẨM (DYNAMIC 100%) */}
        <div
          className={`flex flex-col md:flex-row gap-4 mb-8 p-4 backdrop-blur-xl rounded-3xl border shadow-sm items-center justify-between transition-all ${!activeProductId ? "bg-primary/10 border-primary/30" : "bg-white/40 border-white/60"}`}
        >
          <div className="flex flex-wrap gap-2 items-center w-full md:w-auto overflow-x-auto pb-2 custom-scrollbar">
            <span
              className={`text-xs font-black uppercase ml-2 mr-2 flex items-center gap-1 whitespace-nowrap ${!activeProductId ? "text-primary animate-pulse" : "text-muted-foreground"}`}
            >
              <Package className="w-4 h-4" />{" "}
              {!activeProductId ? "👉 CHỌN SẢN PHẨM:" : "Kho hàng:"}
            </span>

            {/* DUYỆT DANH SÁCH SẢN PHẨM TỪ BE */}
            {productList.map((item) => {
              const isActive = activeProductId === item.productId;
              return (
                <div
                  key={item.productId}
                  className={`flex items-center rounded-xl border transition-all ${isActive ? "border-primary bg-primary/5 shadow-md shadow-primary/20" : "border-transparent bg-white hover:bg-slate-50 shadow-sm"}`}
                >
                  <button
                    onClick={() =>
                      setActiveProduct(item.productId, item.productName)
                    }
                    className={`px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors ${isActive ? "text-primary" : "text-slate-600"}`}
                  >
                    📦 {item.productName}{" "}
                    <span className="text-[10px] font-normal opacity-60 ml-1">
                      ({item.stockQuantity})
                    </span>
                  </button>
                  {/* NÚT XÓA SẢN PHẨM */}
                  <button
                    onClick={() => {
                      if (
                        confirm(`Bạn có chắc muốn xóa ${item.productName}?`)
                      ) {
                        deleteProduct(item.productId);
                      }
                    }}
                    disabled={isProcessing}
                    className="pr-3 pl-2 py-2 text-slate-300 hover:text-red-500 transition-colors disabled:opacity-50"
                    title="Xóa sản phẩm này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}

            {productList.length === 0 && (
              <span className="text-xs italic text-slate-400">
                Kho trống. Hãy tạo mới!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
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
                  Hãy thử <strong>Tạo sản phẩm mới</strong>, kho sẽ ở mức 0. Bạn
                  có thể tạo vô số sản phẩm.
                </li>
                <li>
                  Nhập mua số lượng lớn để xem cảnh báo{" "}
                  <strong>Saga Thất bại</strong>.
                </li>
                <li>
                  Bấm nút <strong>Thùng rác</strong> để xóa sản phẩm thừa.
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

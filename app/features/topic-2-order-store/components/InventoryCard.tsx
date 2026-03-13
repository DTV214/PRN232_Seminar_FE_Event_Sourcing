"use client";

import { useState } from "react";
import { Box, RotateCcw, PlusCircle, Loader2 } from "lucide-react";
import { useTopic2Store } from "../store/useTopic2Store";

export function InventoryCard() {
  const {
    inventoryCount,
    clearLogs,
    importStock,
    isProcessing,
    activeProductName,
  } = useTopic2Store();

  const [restockQty, setRestockQty] = useState(50);

  const handleRestock = async () => {
    if (restockQty > 0) {
      await importStock(restockQty);
    }
  };

  return (
    <div className="p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm relative">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Inventory</h3>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">
              Quản lý kho hàng
            </p>
          </div>
        </div>
        <button
          onClick={clearLogs}
          title="Xóa log màn hình"
          className="p-3 bg-white/60 hover:bg-black/5 rounded-2xl text-muted-foreground transition-colors border border-white shadow-sm"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="p-8 rounded-3xl bg-white/80 border border-white shadow-sm text-center relative overflow-hidden">
          <p className="text-xs font-black text-muted-foreground uppercase mb-2 tracking-widest">
            {/* THÊM CHỮ MẶC ĐỊNH Ở ĐÂY */}
            Tồn kho:{" "}
            <span className="text-primary">
              {activeProductName || "Chưa chọn SP"}
            </span>
          </p>
          <p
            className={`text-6xl font-black transition-colors ${inventoryCount > 0 ? "text-foreground" : "text-red-500"}`}
          >
            {inventoryCount}
          </p>
          {inventoryCount === 0 && activeProductName && (
            <div className="absolute bottom-3 left-0 right-0 text-[10px] font-bold text-red-500 uppercase tracking-widest animate-pulse">
              ⚠ Kho trống - Đơn hàng sẽ bị hủy!
            </div>
          )}
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
        <label className="block text-xs font-black text-emerald-800 uppercase mb-3">
          Nhập thêm hàng hóa
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="1"
            value={restockQty}
            onChange={(e) =>
              setRestockQty(Math.max(1, parseInt(e.target.value) || 1))
            }
            // KHÓA INPUT NẾU CHƯA CHỌN SP
            className="w-full px-4 py-3 rounded-xl text-lg font-black bg-white border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-center text-emerald-900 shadow-inner disabled:opacity-50"
            disabled={isProcessing || !activeProductName}
          />
          <button
            onClick={handleRestock}
            // KHÓA NÚT BẤM NẾU CHƯA CHỌN SP
            disabled={isProcessing || !activeProductName}
            className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-black hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/30 flex items-center gap-2 disabled:opacity-50 shrink-0"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <PlusCircle className="w-5 h-5" />
            )}
            NHẬP KHO
          </button>
        </div>
      </div>
    </div>
  );
}

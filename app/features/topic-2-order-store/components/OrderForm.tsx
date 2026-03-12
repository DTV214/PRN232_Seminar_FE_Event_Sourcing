"use client";

import { useState } from "react";
import { ShoppingBag, Plus, Loader2, AlertTriangle } from "lucide-react";
import { useTopic2Store } from "../store/useTopic2Store";

export function OrderForm() {
  const { simulateOrder, isProcessing, activeProductName, inventoryCount } =
    useTopic2Store();

  // State cục bộ để lưu số lượng muốn mua
  const [quantity, setQuantity] = useState(1);

  const handleOrder = () => {
    if (quantity > 0) {
      simulateOrder(quantity);
    }
  };

  // Logic cực hay cho Demo: Kiểm tra trước xem đơn này có fail không?
  const willFail = quantity > inventoryCount;

  return (
    <div className="p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center shadow-inner text-secondary-foreground">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">Order Service</h3>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">
            Nơi phát động giao dịch
          </p>
        </div>
      </div>

      <div className="mb-6 p-5 rounded-2xl bg-white/60 border border-white">
        <label className="block text-xs font-black text-muted-foreground uppercase mb-3 flex items-center justify-between">
          <span>Sản phẩm mục tiêu:</span>
          <span className="text-primary bg-primary/10 px-2 py-1 rounded-md">
            {activeProductName}
          </span>
        </label>
        <div className="flex items-center gap-4 justify-between">
          <span className="text-sm font-bold text-foreground">
            Số lượng mua:
          </span>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-24 px-4 py-3 rounded-xl text-xl font-black bg-white border border-black/10 focus:outline-none focus:ring-2 focus:ring-primary/50 text-center shadow-inner"
            disabled={isProcessing}
          />
        </div>
      </div>

      {/* Cảnh báo Giáo dục (Chỉ hiện khi cố tình mua lố) */}
      {willFail && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex gap-3 items-start animate__animated animate__headShake">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="text-[11px] text-red-800 font-medium leading-relaxed">
            <strong>Kịch bản Saga Thất bại:</strong> Số lượng mua ({quantity})
            vượt quá tồn kho ({inventoryCount}). Hệ thống{" "}
            <strong>vẫn sẽ ghi nhận đơn hàng</strong>, nhưng sau đó Inventory
            Service sẽ từ chối và kích hoạt{" "}
            <strong>Compensating Transaction</strong> để hủy đơn!
          </div>
        </div>
      )}

      <button
        onClick={handleOrder}
        disabled={isProcessing}
        className={`w-full py-5 rounded-2xl text-white font-black text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 ${willFail ? "bg-red-500 hover:bg-red-600 shadow-red-500/30" : "bg-primary hover:bg-primary/90 shadow-primary/30"}`}
      >
        {isProcessing ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <Plus className="w-6 h-6" />
        )}
        {isProcessing ? "ĐANG XỬ LÝ SAGA..." : `CHỐT ĐƠN ${quantity} MÓN`}
      </button>
    </div>
  );
}

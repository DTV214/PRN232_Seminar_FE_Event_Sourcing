"use client";

import { ShoppingBag, Plus, Loader2 } from "lucide-react";
import { useTopic2Store } from "../store/useTopic2Store";

export function OrderForm() {
  const { simulateOrder, isProcessing } = useTopic2Store();

  const handleOrder = () => {
    simulateOrder({ productId: "TECH-001", qty: 1 });
  };

  return (
    <div className="p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center shadow-inner text-secondary-foreground">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">Order Service</h3>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">
            Thao tác nghiệp vụ
          </p>
        </div>
      </div>

      <button
        onClick={handleOrder}
        disabled={isProcessing}
        className="w-full py-5 rounded-2xl bg-primary text-primary-foreground font-black text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
      >
        {isProcessing ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <Plus className="w-6 h-6" />
        )}
        {isProcessing ? "ĐANG XỬ LÝ SAGA..." : "MUA 01 IPHONE 15"}
      </button>
    </div>
  );
}

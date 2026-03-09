"use client";

import { Box, RotateCcw } from "lucide-react";
import { useTopic2Store } from "../store/useTopic2Store";

export function InventoryCard() {
  const { inventoryCount, clearLogs } = useTopic2Store();

  return (
    <div className="p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm relative">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
            <Box className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Inventory</h3>
        </div>
        <button
          onClick={clearLogs}
          className="p-2 hover:bg-black/5 rounded-full text-muted-foreground transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="p-6 rounded-3xl bg-white/60 border border-black/5 text-center">
          <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">
            Stock Level
          </p>
          <p className="text-5xl font-black text-foreground">
            {inventoryCount}
          </p>
        </div>
      </div>
    </div>
  );
}

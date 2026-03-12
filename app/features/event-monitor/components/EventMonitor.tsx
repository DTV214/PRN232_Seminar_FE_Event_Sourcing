"use client";

import { useTopic2Store } from "@/app/features/topic-2-order-store/store/useTopic2Store";
import { Database, Clock, Activity } from "lucide-react";

export function EventMonitor() {
  // Lấy danh sách sự kiện từ Store của riêng Chủ đề 2
  const events = useTopic2Store((state) => state.events);

  // Hàm phụ trợ để hiển thị màu sắc theo loại sự kiện (Dành cho demo Saga)
  const getEventStyle = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("failed") || lowerType.includes("cancelled")) {
      return "bg-red-100 text-red-600 border-red-200";
    }
    if (
      lowerType.includes("reserved") ||
      lowerType.includes("finalized") ||
      lowerType.includes("success")
    ) {
      return "bg-emerald-100 text-emerald-600 border-emerald-200";
    }
    return "bg-blue-100 text-blue-600 border-blue-200";
  };

  return (
    <div className="flex-1 flex flex-col bg-white/40 backdrop-blur-2xl border border-white/80 rounded-[2.5rem] shadow-xl overflow-hidden h-full">
      {/* Header của Monitor */}
      <div className="p-8 border-b border-black/5 bg-white/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-foreground flex items-center justify-center text-white">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-foreground uppercase tracking-tighter">
              Event Stream
            </h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">
              Sổ cái sự kiện (Immutable Ledger)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full">
          <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-emerald-600 uppercase">
            Live monitoring
          </span>
        </div>
      </div>

      {/* Danh sách sự kiện */}
      <div className="flex-1 p-8 overflow-y-auto space-y-4 custom-scrollbar">
        {events.map((event) => (
          <div
            key={event.id}
            className="animate__animated animate__fadeInLeft p-5 rounded-2xl bg-white border border-white shadow-sm flex flex-col gap-3 group hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {/* Hiển thị Service (AggregateType) */}
                <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-black uppercase border border-slate-200">
                  {event.aggregateType}
                </span>
                {/* Hiển thị Loại sự kiện với màu sắc trực quan */}
                <span
                  className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${getEventStyle(event.eventType)}`}
                >
                  {event.eventType}
                </span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />{" "}
                {new Date(event.timestamp).toLocaleTimeString()}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-50">
                Event Data (Payload)
              </p>
              <pre className="text-[11px] bg-black/5 p-4 rounded-xl text-muted-foreground overflow-x-auto border border-black/5 font-mono leading-relaxed">
                {JSON.stringify(event.eventData, null, 2)}
              </pre>
            </div>

            <div className="text-[9px] font-mono text-muted-foreground/40 italic">
              ID: {event.id}
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-4">
            <Database className="w-16 h-16" />
            <p className="italic font-bold uppercase tracking-widest text-sm">
              Waiting for commands...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

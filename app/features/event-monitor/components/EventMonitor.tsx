"use client";

import { useTopic2Store } from "@/app/features/topic-2-order-store/store/useTopic2Store";
import { Database, Clock, Activity, Server } from "lucide-react";

export function EventMonitor() {
  const events = useTopic2Store((state) => state.events);

  const getEventStyle = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("failed") || lowerType.includes("cancelled")) {
      return "bg-red-100 text-red-600 border-red-200 shadow-sm shadow-red-500/20";
    }
    if (
      lowerType.includes("reserved") ||
      lowerType.includes("confirmed") ||
      lowerType.includes("success")
    ) {
      return "bg-emerald-100 text-emerald-600 border-emerald-200 shadow-sm shadow-emerald-500/20";
    }
    return "bg-blue-100 text-blue-600 border-blue-200 shadow-sm shadow-blue-500/20";
  };

  // Hàm tạo màu riêng cho từng Microservice
  const getServiceBadgeStyle = (serviceName: string) => {
    const name = serviceName.toLowerCase();
    if (name.includes("order"))
      return "bg-purple-100 text-purple-700 border-purple-200";
    if (name.includes("inventory"))
      return "bg-orange-100 text-orange-700 border-orange-200";
    return "bg-slate-100 text-slate-600 border-slate-200";
  };

  return (
    <div className="flex-1 flex flex-col bg-white/40 backdrop-blur-2xl border border-white/80 rounded-[2.5rem] shadow-xl overflow-hidden h-full">
      <div className="p-8 border-b border-black/5 bg-white/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-foreground flex items-center justify-center text-white shadow-inner">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-foreground uppercase tracking-tighter">
              Event Stream
            </h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">
              Sổ cái sự kiện đa dịch vụ (Saga Ledger)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
          <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-emerald-600 uppercase">
            Live monitoring
          </span>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto space-y-4 custom-scrollbar">
        {events.map((event) => (
          <div
            key={event.id}
            className="animate__animated animate__fadeInLeft p-5 rounded-2xl bg-white border border-white shadow-sm flex flex-col gap-3 group hover:shadow-md transition-all hover:-translate-y-1"
          >
            <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-2">
              <div className="flex flex-wrap gap-2 items-center">
                <span
                  className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border flex items-center gap-1 ${getServiceBadgeStyle(event.aggregateType)}`}
                >
                  <Server className="w-3 h-3" /> {event.aggregateType}
                </span>
                <span
                  className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${getEventStyle(event.eventType)}`}
                >
                  {event.eventType}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md">
                <Clock className="w-3 h-3" />{" "}
                {new Date(event.timestamp).toLocaleTimeString()}
              </span>
            </div>

            <div className="flex flex-col gap-1 mt-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-50">
                Payload Data
              </p>
              <pre className="text-[11px] bg-slate-50 p-4 rounded-xl text-slate-600 overflow-x-auto border border-slate-100 font-mono leading-relaxed shadow-inner">
                {JSON.stringify(event.eventData, null, 2)}
              </pre>
            </div>

            <div className="text-[9px] font-mono text-slate-300 italic text-right mt-1">
              EventID: {event.id}
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-30 space-y-4 pt-10">
            <Database className="w-16 h-16 animate-bounce" />
            <p className="italic font-bold uppercase tracking-widest text-sm">
              Đang chờ dữ liệu sự kiện...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

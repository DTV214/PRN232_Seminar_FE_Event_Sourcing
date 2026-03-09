"use client";

import { useTopic2Store } from "@/app/api/config";
import { Database, Clock } from "lucide-react";


export function EventMonitor() {
  const events = useTopic2Store((state) => state.events);

  return (
    <div className="flex-1 flex flex-col bg-white/40 backdrop-blur-2xl border border-white/80 rounded-[2.5rem] shadow-xl overflow-hidden h-full">
      <div className="p-8 border-b border-black/5 bg-white/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-foreground flex items-center justify-center text-white">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-foreground uppercase">
            Event Stream
          </h3>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto space-y-4 custom-scrollbar">
        {events.map((event) => (
          <div
            key={event.id}
            className="animate__animated animate__fadeInLeft p-5 rounded-2xl bg-white border border-white shadow-sm flex flex-col gap-3 group"
          >
            <div className="flex justify-between items-center">
              <span
                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                  event.service === "OrderService"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-emerald-100 text-emerald-600"
                }`}
              >
                {event.service}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> {event.timestamp}
              </span>
            </div>
            <h4 className="font-bold text-foreground font-mono">
              {event.type}
            </h4>
            <pre className="text-[11px] bg-black/5 p-3 rounded-xl text-muted-foreground overflow-x-auto border border-black/5">
              {JSON.stringify(event.payload, null, 2)}
            </pre>
          </div>
        ))}

        {events.length === 0 && (
          <div className="h-full flex items-center justify-center opacity-20 italic font-bold uppercase tracking-widest">
            Waiting for commands...
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Wallet,
  Package,
  CreditCard,
  BarChart3,
  ArrowRight,
  Activity,
} from "lucide-react";
import Link from "next/link";

export default function DemoHubPage() {
  const topics = [
    {
      id: "topic-1",
      title: "Quản lý Ví điện tử",
      description: "Mô phỏng luồng nạp/rút và biến động số dư bất đồng bộ.",
      icon: <Wallet className="w-8 h-8 text-blue-600" />,
      color: "border-blue-200 hover:bg-blue-50/50",
      status: "Active",
      active: true,
    },
    {
      id: "topic-2",
      title: "Tồn kho & Đơn hàng",
      description:
        "Trọng tâm: Event Sourcing & Saga Pattern xử lý giao dịch phân tán.",
      icon: <Package className="w-8 h-8 text-primary" />,
      color: "border-primary/30 hover:bg-primary/5",
      status: "Active",
      active: true,
    },
    {
      id: "topic-3",
      title: "Hậu Thanh toán",
      description:
        "Eventual Consistency - Nhất quán dữ liệu giữa các service",
      icon: <CreditCard className="w-8 h-8 text-rose-600" />,
      color: "border-rose-200 hover:bg-rose-50/50",
      status: "Coming Soon",
      active: true,
    },
    {
      id: "topic-4",
      title: "Phân tích & Thống kê",
      description:
        "Replay sự kiện để xây dựng Read-model cho báo cáo kinh doanh.",
      icon: <BarChart3 className="w-8 h-8 text-amber-600" />,
      color: "border-amber-200 hover:bg-amber-50/50",
      status: "Coming Soon",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-theme-gradient">
      <Navbar />

      <main className="flex-1 pt-40 pb-20 container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16 animate__animated animate__fadeIn">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-white/80 text-xs font-bold text-primary uppercase tracking-widest mb-6 shadow-sm">
            <Activity className="w-4 h-4" /> Lab Environment
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 tracking-tighter">
            Hệ sinh thái <span className="text-primary">Microservices</span>
          </h1>
          <p className="text-muted-foreground text-lg font-medium leading-relaxed">
            Chọn một chủ đề nghiên cứu để bắt đầu quan sát các luồng dữ liệu{" "}
            <br className="hidden md:block" />
            được vận hành theo kiến trúc Event-Driven.
          </p>
        </div>

        {/* 4 Cards Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              href={topic.active ? `/demo/${topic.id}` : "#"}
              className={`group relative p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border-2 transition-all duration-500 shadow-sm flex flex-col items-start text-left ${topic.active
                ? topic.color + " hover:-translate-y-2 hover:shadow-xl"
                : "opacity-60 cursor-not-allowed border-transparent grayscale"
                }`}
            >
              {/* Status Badge */}
              <div
                className={`absolute top-6 right-8 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${topic.active
                  ? "bg-primary/20 text-primary"
                  : "bg-black/5 text-muted-foreground"
                  }`}
              >
                {topic.status}
              </div>

              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-inner mb-8 group-hover:scale-110 transition-transform duration-500">
                {topic.icon}
              </div>

              <h3 className="text-2xl font-black text-foreground mb-3 tracking-tight">
                {topic.title}
              </h3>

              <p className="text-muted-foreground text-sm leading-relaxed mb-8 font-medium">
                {topic.description}
              </p>

              {topic.active && (
                <div className="mt-auto flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest">
                  Tiến vào Sandbox
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              )}
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

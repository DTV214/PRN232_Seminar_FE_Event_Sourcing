"use client";

import * as React from "react";
import Image from "next/image";
import {
  Server,
  Layers,
  Zap,
  Maximize2,
  Network,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function MicroserviceIntro() {
  const architectureImg =
    "https://res.cloudinary.com/dratbz8bh/image/upload/v1769313271/1714504461883_xqmhva.png";

  return (
    <section className="py-24 relative overflow-hidden border-b border-black/5">
      {/* Glow Effect nền (Nhẹ nhàng hơn cho Light Mode) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate__animated animate__fadeIn">
          <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">
            Bối Cảnh Lịch Sử
          </h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-foreground mb-6 tracking-tight">
            Từ Nguyên Khối đến Phân Tán
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Hệ thống phần mềm không ngừng tiến hóa để đáp ứng hàng triệu người
            dùng. Hãy xem cách kiến trúc thay đổi để phá vỡ các giới hạn cũ.
          </p>
        </div>

        {/* Khung Kính Mờ (Glassmorphism Container) */}
        <div className="max-w-5xl mx-auto bg-white/40 border border-white/60 rounded-[2rem] p-6 md:p-10 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <Tabs defaultValue="microservices" className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="bg-white/60 border border-white/50 p-1.5 rounded-xl shadow-sm backdrop-blur-md">
                <TabsTrigger
                  value="monolith"
                  className="px-8 py-3 rounded-lg data-[state=active]:bg-rose-500/10 data-[state=active]:text-rose-600 transition-all text-muted-foreground font-semibold"
                >
                  <Server className="w-4 h-4 mr-2" />
                  Monolithic (Nguyên khối)
                </TabsTrigger>
                <TabsTrigger
                  value="microservices"
                  className="px-8 py-3 rounded-lg data-[state=active]:bg-primary/15 data-[state=active]:text-primary transition-all text-muted-foreground font-semibold"
                >
                  <Network className="w-4 h-4 mr-2" />
                  Microservices (Phân tán)
                </TabsTrigger>
              </TabsList>
            </div>

            {/* TAB: MONOLITHIC */}
            <TabsContent
              value="monolith"
              className="animate__animated animate__fadeIn focus-visible:outline-none"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                  <h4 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                    Cỗ Máy Khổng Lồ
                  </h4>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Tất cả các module (Order, Inventory, Payment) được nhồi nhét
                    vào chung một source code và chạy trên một tiến trình duy
                    nhất. Dễ phát triển lúc đầu, nhưng là ác mộng khi bảo trì.
                  </p>
                  <ul className="space-y-4">
                    {[
                      "Một lỗi nhỏ làm sập toàn bộ hệ thống",
                      "Build và Deploy mất hàng giờ đồng hồ",
                      "Không thể mở rộng (scale) từng phần riêng lẻ",
                      "Công nghệ bị khóa chặt, khó nâng cấp",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                        <span className="text-foreground/80 font-medium">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="order-1 md:order-2 flex justify-center">
                  {/* Visualizer cho Monolith (Tone Sáng) */}
                  <div className="w-full max-w-sm aspect-square bg-rose-500/5 border-2 border-dashed border-rose-500/20 rounded-full flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-rose-500/5 blur-3xl rounded-full"></div>
                    <div className="w-48 h-48 bg-white border border-rose-100 rounded-3xl shadow-[0_10px_40px_-10px_rgba(244,63,94,0.2)] flex flex-col items-center justify-center gap-3 p-6 z-10">
                      <Layers className="w-12 h-12 text-rose-500 mb-1" />
                      <div className="w-full h-2 bg-rose-100 rounded-full"></div>
                      <div className="w-3/4 h-2 bg-rose-100 rounded-full"></div>
                      <div className="w-full h-2 bg-rose-100 rounded-full"></div>
                      <span className="text-xs text-rose-500/70 font-mono mt-2 font-semibold">
                        All-in-one DB
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB: MICROSERVICES */}
            <TabsContent
              value="microservices"
              className="animate__animated animate__fadeIn focus-visible:outline-none"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                  <h4 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                    Chia Để Trị
                  </h4>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Hệ thống được chia nhỏ thành các dịch vụ độc lập. Mỗi dịch
                    vụ có một Database riêng, tự lo nghiệp vụ của mình và giao
                    tiếp với nhau qua API hoặc Message Broker.
                  </p>
                  <ul className="space-y-4 mb-8">
                    {[
                      "Độc lập triển khai, không lo sập dây chuyền",
                      "Tự do chọn ngôn ngữ code (C#, Nodejs, Go)",
                      "Scale linh hoạt đúng chỗ bị nghẽn (VD: chỉ scale Order)",
                      "Teams hoạt động độc lập, tăng tốc độ release",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-foreground/80 font-medium">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Nút bật Dialog xem chi tiết kiến trúc */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="flex items-center gap-2 text-sm font-bold bg-white hover:bg-white/80 text-foreground px-6 py-3 rounded-xl transition-all border border-black/5 shadow-sm hover:shadow-md">
                        <Maximize2 className="w-4 h-4 text-primary" />
                        Xem chi tiết Kiến trúc
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl bg-background border-border text-foreground p-1 shadow-2xl rounded-2xl">
                      <DialogHeader className="px-6 pt-6 pb-2">
                        <DialogTitle className="text-2xl font-bold text-primary">
                          Kiến trúc Hệ thống Đề xuất
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                          Mô hình tổng quan cách các service giao tiếp qua
                          Message Broker và ứng dụng Event Sourcing.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="relative w-full aspect-video bg-black/5 rounded-b-xl overflow-hidden">
                        <Image
                          src={architectureImg}
                          alt="Microservices Architecture Detail"
                          fill
                          className="object-contain p-4 mix-blend-multiply"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="order-1 md:order-2 flex justify-center">
                  {/* Visualizer cho Microservices (Tone Sáng) */}
                  <div className="w-full max-w-sm aspect-square relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full"></div>

                    {/* Core node */}
                    <div className="w-20 h-20 bg-white border border-primary/30 rounded-2xl shadow-[0_10px_30px_-10px_var(--color-primary)] flex items-center justify-center z-10">
                      <Zap className="w-8 h-8 text-primary animate-pulse" />
                    </div>

                    {/* Orbiting nodes */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-12 bg-white/80 backdrop-blur-sm border border-primary/20 shadow-sm rounded-xl flex items-center justify-center">
                      <span className="text-xs font-mono font-bold text-foreground/70 uppercase">
                        Order
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-20 h-12 bg-white/80 backdrop-blur-sm border border-primary/20 shadow-sm rounded-xl flex items-center justify-center">
                      <span className="text-xs font-mono font-bold text-foreground/70 uppercase">
                        Inventory
                      </span>
                    </div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-20 h-12 bg-white/80 backdrop-blur-sm border border-primary/20 shadow-sm rounded-xl flex items-center justify-center">
                      <span className="text-xs font-mono font-bold text-foreground/70 uppercase">
                        Wallet
                      </span>
                    </div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-20 h-12 bg-white/80 backdrop-blur-sm border border-primary/20 shadow-sm rounded-xl flex items-center justify-center">
                      <span className="text-xs font-mono font-bold text-foreground/70 uppercase">
                        Payment
                      </span>
                    </div>

                    {/* Connection lines (SVG) */}
                    <svg
                      className="absolute inset-0 w-full h-full -z-10"
                      viewBox="0 0 100 100"
                    >
                      <line
                        x1="50"
                        y1="50"
                        x2="50"
                        y2="15"
                        stroke="var(--color-primary)"
                        strokeWidth="0.5"
                        strokeDasharray="2 2"
                        className="opacity-40"
                      />
                      <line
                        x1="50"
                        y1="50"
                        x2="50"
                        y2="85"
                        stroke="var(--color-primary)"
                        strokeWidth="0.5"
                        strokeDasharray="2 2"
                        className="opacity-40"
                      />
                      <line
                        x1="50"
                        y1="50"
                        x2="15"
                        y2="50"
                        stroke="var(--color-primary)"
                        strokeWidth="0.5"
                        strokeDasharray="2 2"
                        className="opacity-40"
                      />
                      <line
                        x1="50"
                        y1="50"
                        x2="85"
                        y2="50"
                        stroke="var(--color-primary)"
                        strokeWidth="0.5"
                        strokeDasharray="2 2"
                        className="opacity-40"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}

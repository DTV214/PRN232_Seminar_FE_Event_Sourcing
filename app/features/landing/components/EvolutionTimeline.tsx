"use client";

import * as React from "react";
import { Monitor, Server, Layers, Network, DatabaseZap } from "lucide-react";

export function EvolutionTimeline() {
  const stages = [
    {
      id: 1,
      year: "1980s",
      title: "Kỷ nguyên Mainframe",
      description:
        "Máy chủ trung tâm khổng lồ xử lý mọi thứ. Người dùng thao tác qua các 'dumb terminal' (thiết bị đầu cuối không có khả năng tính toán).",
      icon: <Monitor className="w-6 h-6 text-slate-500" />,
      color: "zinc",
    },
    {
      id: 2,
      year: "1990s",
      title: "Kiến trúc Client-Server",
      description:
        "Tách biệt giữa giao diện (Client) và máy chủ cơ sở dữ liệu (Server). Bắt đầu hình thành mô hình 2-tier và 3-tier.",
      icon: <Server className="w-6 h-6 text-blue-500" />,
      color: "blue",
    },
    {
      id: 3,
      year: "2000s",
      title: "Đế chế Monolithic",
      description:
        "Mọi logic nghiệp vụ (UI, API, Data Access) được đóng gói chung vào một khối duy nhất (N-Tier). Dễ phát triển nhưng cực kỳ cồng kềnh khi dự án phình to.",
      icon: <Layers className="w-6 h-6 text-rose-500" />,
      color: "rose",
    },
    {
      id: 4,
      year: "2010s",
      title: "Cuộc cách mạng Microservices",
      description:
        "Chia nhỏ Monolith thành các dịch vụ độc lập, chạy trên container (Docker/K8s). Scale linh hoạt, nhưng bài toán đồng bộ dữ liệu trở thành ác mộng.",
      icon: <Network className="w-6 h-6 text-primary" />,
      color: "emerald",
    },
    {
      id: 5,
      year: "Hiện tại",
      title: "Event-Driven & Event Sourcing",
      description:
        "Giải pháp tối thượng cho Microservices. Giao tiếp qua sự kiện (Kafka/RabbitMQ) và lưu trữ dữ liệu dưới dạng chuỗi Event bất biến. Hệ thống đạt độ tin cậy tuyệt đối.",
      icon: <DatabaseZap className="w-6 h-6 text-amber-500" />,
      color: "amber",
    },
  ];

  return (
    <section className="py-24 relative bg-transparent border-b border-black/5 overflow-hidden">
      {/* Background Effect: Grid nhạt cho Light Mode */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:32px_32px]"></div>

      <div className="container mx-auto px-6 relative z-10 max-w-4xl">
        <div className="text-center mb-20 animate__animated animate__fadeIn">
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-6 tracking-tight">
            Lịch Sử Tiến Hóa Kiến Trúc
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            Mỗi kiến trúc sinh ra để giải quyết nỗi đau của thế hệ trước.
            <br className="hidden md:block" /> Sự phức tạp của hệ thống phân tán
            đã mở đường cho Event Sourcing.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative border-l-2 border-black/5 ml-4 md:ml-0 md:border-l-0">
          {/* Trục dọc cho Desktop (Ở giữa) - Sử dụng Gradient từ Beige sang Sage Green */}
          <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-secondary/50 via-primary/50 to-primary"></div>

          <div className="space-y-16 md:space-y-0">
            {stages.map((stage, index) => {
              const isEven = index % 2 === 0;
              const delay = `animate__delay-${index}s`;

              return (
                <div
                  key={stage.id}
                  className={`relative flex flex-col md:flex-row items-center md:justify-between animate__animated animate__fadeInUp ${delay}`}
                >
                  {/* Cột Mốc Thời Gian (Timeline Dot) - Style Glassmorphism */}
                  <div className="absolute left-[-29px] md:static md:left-auto flex items-center justify-center w-14 h-14 rounded-2xl bg-white/80 border border-white backdrop-blur-md z-10 md:order-2 shadow-sm transition-all duration-300 group-hover:shadow-md">
                    {stage.icon}
                  </div>

                  {/* Card Bên Trái */}
                  <div
                    className={`md:w-[45%] mb-4 md:mb-0 ml-8 md:ml-0 ${isEven ? "md:order-1 md:text-right" : "md:order-3 md:opacity-0 md:hidden"}`}
                  >
                    {isEven && <TimelineCard stage={stage} align="right" />}
                  </div>

                  {/* Card Bên Phải */}
                  <div
                    className={`md:w-[45%] ml-8 md:ml-0 ${!isEven ? "md:order-3 md:text-left" : "md:order-1 md:hidden"}`}
                  >
                    {!isEven && <TimelineCard stage={stage} align="left" />}
                    <div className="md:hidden">
                      {isEven && <TimelineCard stage={stage} align="left" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

interface TimelineStage {
  id: number;
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

function TimelineCard({
  stage,
  align,
}: {
  stage: TimelineStage;
  align: "left" | "right";
}) {
  const colorMap: Record<string, string> = {
    zinc: "hover:border-slate-300",
    blue: "hover:border-blue-300 shadow-blue-500/5 hover:shadow-blue-500/10",
    rose: "hover:border-rose-300 shadow-rose-500/5 hover:shadow-rose-500/10",
    emerald: "hover:border-primary/50 shadow-primary/5 hover:shadow-primary/10",
    amber:
      "hover:border-amber-300 shadow-amber-500/5 hover:shadow-amber-500/10",
  };

  return (
    <div
      className={`p-6 rounded-[2rem] bg-white/40 border border-white/60 transition-all duration-500 group ${colorMap[stage.color]} backdrop-blur-xl cursor-default shadow-sm hover:-translate-y-1`}
    >
      <span
        className={`inline-block px-4 py-1 rounded-full bg-secondary/20 text-xs font-mono mb-4 text-secondary-foreground font-bold ${align === "right" ? "md:ml-auto" : ""}`}
      >
        {stage.year}
      </span>
      <h3
        className={`text-xl font-bold text-foreground mb-3 ${align === "right" ? "md:justify-end" : ""}`}
      >
        {stage.title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {stage.description}
      </p>
    </div>
  );
}

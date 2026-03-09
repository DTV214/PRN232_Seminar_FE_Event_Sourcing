"use client";

import * as React from "react";
import Image from "next/image";
import { ShieldCheck, Cpu, GitMerge } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function MicroserviceTypes() {
  const cloudinaryImg =
    "https://res.cloudinary.com/dratbz8bh/image/upload/v1769313271/1714504461883_xqmhva.png";

  const types = [
    {
      id: 1,
      title: "API Gateway & BFF",
      subtitle: "Người gác cổng hệ thống",
      description:
        "Đóng vai trò là điểm chạm duy nhất cho các Client (Web/Mobile). Nó làm nhiệm vụ phân luồng request, xác thực người dùng, và gom nhóm dữ liệu trước khi trả về Frontend.",
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      badges: ["REST API", "GraphQL", "Ocelot", "Kong"],
      glowColor: "bg-primary/10",
      accent: "text-primary",
    },
    {
      id: 2,
      title: "Core Business Services",
      subtitle: "Trái tim của nghiệp vụ",
      description:
        "Đây là các dịch vụ xử lý logic cốt lõi như Order, Inventory, Wallet. Mỗi dịch vụ sở hữu Database riêng biệt, đảm bảo tính độc lập và linh hoạt tối đa.",
      icon: <Cpu className="w-6 h-6 text-rose-500" />,
      badges: ["gRPC", "PostgreSQL", ".NET Core", "Spring Boot"],
      glowColor: "bg-rose-500/10",
      accent: "text-rose-500",
    },
    {
      id: 3,
      title: "Data Processing & Workers",
      subtitle: "Cỗ máy chạy ngầm",
      description:
        "Chuyên xử lý các tác vụ nặng hoặc bất đồng bộ. Lắng nghe các sự kiện từ Message Broker để gửi email, thống kê dữ liệu, hoặc đồng bộ hóa Read Model.",
      icon: <GitMerge className="w-6 h-6 text-amber-500" />,
      badges: ["RabbitMQ", "Kafka", "Worker Service", "Redis"],
      glowColor: "bg-amber-500/10",
      accent: "text-amber-600",
    },
  ];

  return (
    <section className="py-24 bg-transparent border-b border-black/5 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20 animate__animated animate__fadeIn">
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-6 tracking-tight">
            Hệ Sinh Thái Microservices
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed font-medium">
            Một hệ thống phân tán hoàn chỉnh không chỉ có các API đơn thuần. Đó
            là sự kết hợp của nhiều loại hình dịch vụ đóng vai trò khác nhau.
          </p>
        </div>

        {/* Z-Pattern List */}
        <div className="space-y-28">
          {types.map((type, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={type.id}
                className={`flex flex-col gap-16 items-center ${
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Image Side */}
                <div className="w-full lg:w-1/2 relative group">
                  {/* Glow Effect nhạt phù hợp Light Mode */}
                  <div
                    className={`absolute inset-0 ${type.glowColor} blur-3xl rounded-full transform group-hover:scale-110 transition-transform duration-700`}
                  ></div>

                  <div className="relative rounded-[2.5rem] overflow-hidden border border-white bg-white/40 shadow-xl aspect-[4/3] backdrop-blur-sm">
                    {/* Lớp phủ tint nhẹ nhàng */}
                    <div
                      className={`absolute inset-0 ${type.glowColor} mix-blend-multiply z-10 transition-opacity group-hover:opacity-40`}
                    ></div>

                    <Image
                      src={cloudinaryImg}
                      alt={type.title}
                      fill
                      className="object-cover object-center transform group-hover:scale-105 transition-transform duration-700 opacity-60 mix-blend-luminosity"
                    />

                    {/* Khung nổi chứa Icon - Phong cách Glassmorphism */}
                    <div className="absolute top-6 left-6 z-20 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white shadow-lg">
                      {type.icon}
                    </div>
                  </div>
                </div>

                {/* Text Side */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                  <div className="animate__animated animate__fadeInUp">
                    <span
                      className={`inline-block ${type.accent} font-bold text-sm tracking-widest uppercase mb-4`}
                    >
                      {type.subtitle}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-extrabold text-foreground mb-6 tracking-tight">
                      {type.title}
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed mb-8 font-medium">
                      {type.description}
                    </p>

                    {/* Badges chuyển sang tone Pastel sáng */}
                    <div className="flex flex-wrap gap-3">
                      {type.badges.map((badge, bIdx) => (
                        <Badge
                          key={bIdx}
                          variant="secondary"
                          className="bg-white/60 hover:bg-white text-foreground border border-black/5 px-4 py-1.5 text-sm font-bold shadow-sm transition-all"
                        >
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

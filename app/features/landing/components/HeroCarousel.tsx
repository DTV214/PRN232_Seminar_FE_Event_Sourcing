"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Server, Activity, DatabaseZap } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function HeroCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  );

  const cloudinaryImg =
    "https://res.cloudinary.com/dratbz8bh/image/upload/v1769313271/1714504461883_xqmhva.png";

  const slides = [
    {
      id: 1,
      tag: "Kỷ nguyên mới",
      title: "Vượt qua giới hạn của Monolithic",
      description:
        "Hệ thống nguyên khối đã bộc lộ những điểm yếu chí mạng. Đã đến lúc chia nhỏ để trị, tối ưu hóa hiệu năng và khả năng mở rộng không giới hạn.",
      icon: <Server className="w-6 h-6 text-primary" />,
      color: "from-emerald-500/20 to-cyan-500/20",
    },
    {
      id: 2,
      tag: "Kiến trúc dữ liệu",
      title: "Sức mạnh của Event Sourcing",
      description:
        "Không còn ghi đè hay xóa bỏ. Mọi thao tác đều được lưu vết như một 'cuốn nhật ký' bất biến, giúp khôi phục trạng thái ở bất kỳ thời điểm nào.",
      icon: <DatabaseZap className="w-6 h-6 text-blue-500" />,
      color: "from-blue-500/20 to-indigo-500/20",
    },
    {
      id: 3,
      tag: "Giao dịch phân tán",
      title: "Đồng bộ hóa với Saga Pattern",
      description:
        "Giải quyết triệt để bài toán nhất quán dữ liệu giữa các Microservices. Quản lý luồng Order và Inventory một cách độc lập, an toàn tuyệt đối.",
      icon: <Activity className="w-6 h-6 text-purple-500" />,
      color: "from-purple-500/20 to-pink-500/20",
    },
  ];

  return (
    <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden border-b border-black/5">
      {/* Background Image từ Cloudinary (Chung cho cả Carousel) */}
      <div className="absolute inset-0 z-0">
        <Image
          src={cloudinaryImg}
          alt="Microservices Architecture Visual"
          fill
          className="object-cover opacity-15 object-center mix-blend-multiply"
          priority
        />
        {/* Gradient Overlay chuyển sang tone sáng để tương thích với Light Mode */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
      </div>

      <div className="container relative z-10 mx-auto px-6 h-full flex items-center">
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {slides.map((slide) => (
              <CarouselItem key={slide.id}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full py-20">
                  {/* Left Content */}
                  <div className="flex flex-col items-start text-left">
                    {/* Nút Tag Glassmorphism sáng */}
                    <div className="animate__animated animate__fadeInDown flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/60 border border-white/50 mb-6 backdrop-blur-md shadow-sm">
                      {slide.icon}
                      <span className="text-sm font-semibold text-foreground/80 tracking-wide uppercase">
                        {slide.tag}
                      </span>
                    </div>

                    <h1 className="animate__animated animate__fadeInUp text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] text-foreground">
                      {slide.title.split(" ").slice(0, -2).join(" ")}{" "}
                      <span
                        className={`text-transparent bg-clip-text bg-gradient-to-r ${slide.color.replace("/20", "/80").replace("/20", "/80")}`}
                      >
                        {slide.title.split(" ").slice(-2).join(" ")}
                      </span>
                    </h1>

                    <p className="animate__animated animate__fadeInUp animate__delay-1s text-lg md:text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed">
                      {slide.description}
                    </p>

                    <div className="animate__animated animate__fadeInUp animate__delay-1s flex items-center gap-4">
                      <Link
                        href="/demo"
                        className="group flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-bold transition-all shadow-[0_10px_30px_-10px_var(--color-primary)] hover:shadow-[0_15px_40px_-10px_var(--color-primary)] hover:-translate-y-1"
                      >
                        Vào System Demo
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>

                  {/* Right Content (Abstract Tech UI - Glow Effect) */}
                  <div className="hidden lg:flex justify-center items-center relative animate__animated animate__zoomIn">
                    {/* Đốm sáng mờ ảo ở Background phù hợp với nền sáng */}
                    <div
                      className={`absolute w-[400px] h-[400px] bg-gradient-to-tr ${slide.color} blur-[100px] rounded-full opacity-60 mix-blend-multiply`}
                    ></div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Nút điều hướng Carousel phong cách trong suốt (Glass) */}
          <div className="hidden md:block">
            <CarouselPrevious className="left-0 -ml-12 border-white/50 bg-white/50 backdrop-blur-sm hover:bg-white text-foreground hover:text-primary transition-colors shadow-sm" />
            <CarouselNext className="right-0 -mr-12 border-white/50 bg-white/50 backdrop-blur-sm hover:bg-white text-foreground hover:text-primary transition-colors shadow-sm" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}

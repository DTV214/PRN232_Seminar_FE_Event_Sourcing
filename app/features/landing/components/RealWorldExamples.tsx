"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Landmark,
  ShoppingCart,
  GitCommit,
  Play,
  Sparkles,
} from "lucide-react";

export function RealWorldExamples() {
  const cloudinaryImg =
    "https://res.cloudinary.com/dratbz8bh/image/upload/v1769313271/1714504461883_xqmhva.png";

  const examples = [
    {
      id: 1,
      title: "Sổ Kế Toán Ngân Hàng",
      description:
        "Ví dụ kinh điển nhất. Ngân hàng không bao giờ chỉ lưu số dư hiện tại của bạn. Họ lưu một chuỗi các sự kiện Nạp/Rút. Nếu có sai sót, họ không xóa giao dịch cũ mà ghi thêm một 'giao dịch bù trừ' (Saga Pattern).",
      icon: <Landmark className="w-8 h-8 text-amber-600" />,
      glow: "group-hover:bg-amber-50 group-hover:border-amber-200",
      shadow: "hover:shadow-[0_15px_30px_-10px_rgba(217,119,6,0.1)]",
    },
    {
      id: 2,
      title: "Giỏ Hàng Thương Mại Điện Tử",
      description:
        "Nếu chỉ dùng CRUD, khi khách xóa sản phẩm khỏi giỏ, hệ thống sẽ mù tịt. Với Event Sourcing, mọi hành động Thêm/Xóa đều được lưu vết, giúp doanh nghiệp thấu hiểu hành vi khách hàng sâu sắc hơn.",
      icon: <ShoppingCart className="w-8 h-8 text-primary" />,
      glow: "group-hover:bg-primary/10 group-hover:border-primary/30",
      shadow: "hover:shadow-[0_15px_30px_-10px_rgba(16,185,129,0.1)]",
    },
    {
      id: 3,
      title: "Git Version Control",
      description:
        "Chính mã nguồn của chúng ta cũng đang dùng Event Sourcing! Mỗi lượt Commit là một Event. Cấu trúc code hiện tại được tính toán bằng cách 'Replay' lại toàn bộ các nhánh commit từ lúc bắt đầu.",
      icon: <GitCommit className="w-8 h-8 text-cyan-600" />,
      glow: "group-hover:bg-cyan-50 group-hover:border-cyan-200",
      shadow: "hover:shadow-[0_15px_30px_-10px_rgba(8,145,178,0.1)]",
    },
  ];

  return (
    <section className="py-32 relative bg-transparent border-t border-black/5 overflow-hidden">
      {/* Background mờ ảo với ảnh mix-blend phù hợp Light Mode */}
      <div className="absolute inset-0 z-0 opacity-[0.03] mix-blend-multiply">
        <Image
          src={cloudinaryImg}
          alt="Abstract Background"
          fill
          className="object-cover"
        />
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 animate__animated animate__fadeIn">
          <div className="inline-flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-sm mb-4">
            <Sparkles className="w-4 h-4" /> Ứng Dụng Thực Tế
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-6 tracking-tight">
            Không Hề Xa Lạ
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed font-medium">
            Bạn có thể chưa từng tự tay code Event Sourcing, nhưng bạn đang sử
            dụng nó mỗi ngày qua các dịch vụ công nghệ hàng đầu thế giới.
          </p>
        </div>

        {/* 3 Thẻ Ví Dụ phong cách Glassmorphism sáng */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {examples.map((item, index) => {
            const delay = `animate__delay-${index}s`;
            return (
              <div
                key={item.id}
                className={`relative p-8 rounded-[2rem] bg-white/40 border border-white/80 backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 cursor-default group overflow-hidden animate__animated animate__fadeInUp ${delay} ${item.shadow} shadow-sm`}
              >
                {/* Ánh sáng chạy chéo khi Hover (Mờ ảo trên nền sáng) */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent z-0"></div>

                {/* Nội dung Card */}
                <div
                  className={`relative z-10 w-16 h-16 rounded-2xl bg-white border border-black/5 flex items-center justify-center mb-8 transition-all duration-500 shadow-sm ${item.glow}`}
                >
                  {item.icon}
                </div>
                <h3 className="relative z-10 text-2xl font-bold text-foreground mb-4">
                  {item.title}
                </h3>
                <p className="relative z-10 text-muted-foreground leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* ================= FINAL CALL TO ACTION (THE GRAND FINALE) ================= */}
        <div className="relative max-w-4xl mx-auto text-center p-12 md:p-20 rounded-[3rem] overflow-hidden border border-white bg-white/60 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] animate__animated animate__zoomIn">
          {/* Decorative Glows */}
          <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full"></div>

          <h2 className="relative z-10 text-4xl md:text-5xl font-extrabold text-foreground mb-6 tracking-tight leading-tight">
            Lý thuyết đã đủ.
            <br />
            <span className="text-primary">Giờ là lúc thực chiến.</span>
          </h2>
          <p className="relative z-10 text-muted-foreground text-lg mb-10 max-w-xl mx-auto font-medium">
            Cùng quan sát cách Order Service và Inventory Service giao tiếp với
            nhau theo thời gian thực mà không cần chia sẻ chung Database.
          </p>

          <Link
            href="/demo"
            className="relative z-10 inline-flex items-center justify-center gap-4 bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_-10px_var(--color-primary)] group"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Play className="w-4 h-4 text-white group-hover:scale-110 transition-transform fill-current" />
            </div>
            Tiến vào Trung tâm Điều khiển
          </Link>
        </div>
      </div>

    </section>
  );
}

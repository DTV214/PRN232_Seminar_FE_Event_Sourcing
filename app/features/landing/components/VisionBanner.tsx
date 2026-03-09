"use client";

import { Sparkles } from "lucide-react";

export function VisionBanner() {
  return (
    <section className="relative py-24 flex flex-col items-center justify-center text-center px-4 overflow-hidden border-y border-black/5 bg-transparent">
      {/* Background Glow - Sử dụng màu sắc từ tone ảnh mẫu: Beige và Sage Green */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-gradient-to-tr from-secondary/30 to-primary/20 blur-[100px] rounded-[100%] pointer-events-none opacity-60"></div>

      <div className="relative z-10 animate__animated animate__zoomIn">
        {/* Tag trang trí phong cách kính mờ sáng */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/60 border border-white/80 text-sm font-bold text-primary mb-8 shadow-sm backdrop-blur-md">
          <Sparkles className="w-4 h-4" />
          Kiến trúc của Tương lai
        </div>

        <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 max-w-4xl mx-auto leading-[1.15] text-foreground">
          Dữ liệu không bao giờ bị xóa. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-secondary-foreground/70">
            Chúng chỉ được sinh thêm.
          </span>
        </h2>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
          Đó là triết lý tối thượng của Event Sourcing. Hãy quên đi những giới
          hạn của cơ sở dữ liệu truyền thống và bước vào kỷ nguyên của{" "}
          <span className="text-foreground font-bold underline decoration-primary/30 decoration-4 underline-offset-4">
            dữ liệu bất biến.
          </span>
        </p>
      </div>
    </section>
  );
}

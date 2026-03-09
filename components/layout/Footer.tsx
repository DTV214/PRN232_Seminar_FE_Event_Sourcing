import Link from "next/link";
import { Activity, Github, Terminal, Layers, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-white/20 pt-20 pb-10 border-t border-black/5 overflow-hidden backdrop-blur-sm">
      {/* Tia sáng trang trí nhẹ nhàng trên đỉnh Footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Cột 1: Brand */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl tracking-tighter mb-6"
            >
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-foreground text-2xl font-extrabold">
                Tech<span className="text-primary">Seminar</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-base leading-relaxed mb-8 font-medium">
              Nghiên cứu chuyên sâu về Kiến trúc Microservices và luồng dữ liệu
              bất biến trong Event Sourcing.
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="w-11 h-11 rounded-xl bg-white border border-black/5 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all shadow-sm"
              >
                <Github className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Cột 2: Chủ đề - Sử dụng Font Mono cho tiêu đề */}
          <div>
            <h4 className="text-foreground font-bold mb-8 flex items-center gap-2 font-mono text-sm tracking-tighter uppercase">
              <Layers className="w-4 h-4 text-primary" />
              Chủ Đề Seminar
            </h4>
            <ul className="space-y-4 text-base font-semibold text-muted-foreground">
              <li className="hover:text-primary cursor-pointer transition-colors">
                Quản lý Giao dịch Ví
              </li>
              <li className="hover:text-primary cursor-pointer transition-colors">
                Đồng bộ Tồn Kho
              </li>
              <li className="hover:text-primary cursor-pointer transition-colors">
                Hệ thống Thanh toán
              </li>
              <li className="hover:text-primary cursor-pointer transition-colors">
                Phân tích Dữ liệu
              </li>
            </ul>
          </div>

          {/* Cột 3: Công nghệ */}
          <div>
            <h4 className="text-foreground font-bold mb-8 flex items-center gap-2 font-mono text-sm tracking-tighter uppercase">
              <Terminal className="w-4 h-4 text-primary" />
              Tech Stack
            </h4>
            <ul className="space-y-4 text-base font-semibold text-muted-foreground">
              <li className="hover:text-primary cursor-default">
                Next.js 15 & Tailwind
              </li>
              <li className="hover:text-primary cursor-default">
                .NET Core 9.0
              </li>
              <li className="hover:text-primary cursor-default">
                Event Store DB
              </li>
              <li className="hover:text-primary cursor-default">
                RabbitMQ / Kafka
              </li>
            </ul>
          </div>

          {/* Cột 4: Links */}
          <div>
            <h4 className="text-foreground font-bold mb-8 font-mono text-sm tracking-tighter uppercase">
              Liên Kết
            </h4>
            <ul className="space-y-4 text-base font-semibold">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  href="/demo"
                  className="text-primary hover:underline decoration-2 underline-offset-4 transition-all"
                >
                  Live Demo System &rarr;
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm font-bold text-muted-foreground/60 font-mono">
            &copy; 2026 Nhóm Nghiên Cứu Microservices.
          </p>
          <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground/60">
            Designed with{" "}
            <Heart className="w-4 h-4 text-rose-400 fill-current" /> for Tech
            Seminar
          </div>
        </div>
      </div>
    </footer>
  );
}

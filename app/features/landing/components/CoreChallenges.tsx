"use client";

import { Database, Server, Activity } from "lucide-react";

export function CoreChallenges() {
  return (
    <section className="py-24 bg-transparent relative border-b border-black/5 z-10">
      {/* Background Grid tinh tế với màu nhạt cho Light Mode */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:40px_40px] -z-10"></div>

      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate__animated animate__fadeIn">
          <h2 className="text-3xl font-extrabold mb-4 text-foreground tracking-tight md:text-4xl">
            Ba Nút Thắt Của Hệ Thống Hiện Đại
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
            Tại sao các công ty công nghệ lớn lại chấp nhận đập đi xây lại hệ
            thống của họ?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Phân mảnh dữ liệu */}
          <div className="p-8 rounded-[2rem] bg-white/40 border border-white/60 backdrop-blur-xl hover:bg-white/60 hover:-translate-y-2 transition-all duration-500 group shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
            <div className="w-14 h-14 rounded-2xl bg-secondary/30 border border-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <Server className="w-6 h-6 text-foreground/70" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">
              Sự phân mảnh dữ liệu
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Chia nhỏ hệ thống giúp linh hoạt, nhưng lại tạo ra cơn ác mộng về
              đồng bộ. Không thể dùng chung một Transaction SQL khi mỗi Service
              nằm ở một server khác nhau.
            </p>
          </div>

          {/* Card 2: CRUD Challenge */}
          <div className="p-8 rounded-[2rem] bg-white/40 border border-white/60 backdrop-blur-xl hover:bg-white/60 hover:-translate-y-2 transition-all duration-500 group shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(244,63,94,0.08)]">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <Database className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">
              Cú lừa của thao tác CRUD
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Ghi đè (Update) và Xóa (Delete) tiêu diệt bối cảnh. Hệ thống chỉ
              lưu lại bức ảnh tĩnh cuối cùng, mất đi toàn bộ lịch sử hành vi vô
              giá của khách hàng.
            </p>
          </div>

          {/* Card 3: Event Sourcing Solution */}
          <div className="p-8 rounded-[2rem] bg-white/40 border border-white/60 backdrop-blur-xl hover:bg-white/60 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.1)]">
            {/* Hiệu ứng vết sáng mờ đặc trưng cho card giải pháp */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-3xl rounded-full group-hover:bg-primary/20 transition-colors"></div>

            <div className="relative z-10 w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <h3 className="relative z-10 text-xl font-bold mb-3 text-foreground">
              Sức mạnh Event Sourcing
            </h3>
            <p className="relative z-10 text-muted-foreground leading-relaxed text-sm">
              Ghi nhận mọi sự kiện vào Event Store. Cho phép chạy Saga Pattern
              để bù trừ giao dịch và Replay để khôi phục dữ liệu ở bất kỳ thời
              điểm nào.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

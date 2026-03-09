import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  HeroCarousel,
  CoreChallenges,
  MicroserviceIntro,
  EvolutionTimeline,
  VisionBanner,
  MicroserviceTypes,
  EventSourcingFocus,
  RealWorldExamples,
} from "./features/landing";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-emerald-500/30 selection:text-white">
      <Navbar />

      <main>
        {/* 1. Mở màn đập vào mắt */}
        <HeroCarousel />

        {/* 2. Đặt ngay 3 vấn đề lớn để thu hút sự chú ý */}
        <CoreChallenges />

        {/* 3. Phân tích bối cảnh Monolith vs Microservices */}
        <MicroserviceIntro />

        {/* 4. Nhìn lại lịch sử tiến hóa */}
        <EvolutionTimeline />

        {/* 5. Dải băng ngang ngắt nhịp, nhấn mạnh triết lý dữ liệu bất biến */}
        <VisionBanner />

        {/* 6. Chi tiết các thành phần trong Microservices */}
        <MicroserviceTypes />

        {/* 7. Giải pháp cốt lõi (Tâm điểm bài thuyết trình) */}
        <EventSourcingFocus />

        {/* 8. Ứng dụng thực tiễn */}
        <RealWorldExamples />

  
      </main>

      <Footer />
    </div>
  );
}

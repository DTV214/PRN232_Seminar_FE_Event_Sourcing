"use client";

import * as React from "react";
import { Zap, History, Repeat, ShieldCheck, Info } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export function EventSourcingFocus() {
  return (
    <section className="py-24 relative overflow-hidden bg-transparent">
      {/* Light Glow Background - Tạo điểm nhấn thanh lịch */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-secondary/10 blur-[120px] rounded-[100%] pointer-events-none opacity-60"></div>
      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        <div className="text-center mb-16 animate__animated animate__fadeIn">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-[1.5rem] border border-primary/20 mb-6 shadow-sm">
            <Zap className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 tracking-tight leading-tight">
            Tại sao lại là{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary-foreground/80">
              Event Sourcing
            </span>
            ?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed font-medium">
            Nó không chỉ là một công nghệ lưu trữ. Nó là xương sống để giải
            quyết những bài toán hóc búa nhất của hệ thống Microservices.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Cột Trái: Các Khái Niệm Chuyên Sâu (Glassmorphism Card) */}
          <div className="lg:col-span-5 space-y-8 animate__animated animate__fadeInLeft">
            <div className="p-8 rounded-[2rem] bg-white/40 border border-white/60 backdrop-blur-xl relative overflow-hidden group shadow-sm hover:shadow-md transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full group-hover:bg-primary/20 transition-colors"></div>

              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <ShieldCheck className="w-7 h-7 text-primary" />
                Vũ khí Tối thượng
              </h3>

              <div className="space-y-6 text-muted-foreground leading-relaxed font-medium">
                <p>
                  Trong kiến trúc phân tán, để đảm bảo tính toàn vẹn dữ liệu mà
                  không dùng Transaction SQL thông thường, chúng ta bắt buộc
                  phải áp dụng{" "}
                  <HoverCard>
                    <HoverCardTrigger className="text-primary font-bold border-b-2 border-dashed border-primary/30 cursor-help hover:text-primary/80 transition-colors">
                      Saga Pattern
                    </HoverCardTrigger>
                    <HoverCardContent className="w-85 bg-white/95 border-white/80 text-foreground shadow-2xl backdrop-blur-md rounded-2xl p-5">
                      <div className="flex justify-between space-x-4">
                        <div className="space-y-2">
                          <h4 className="text-base font-bold text-primary flex items-center gap-2">
                            <Info className="w-4 h-4" /> Saga Pattern
                          </h4>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            Là chuỗi các giao dịch cục bộ. Nếu một bước thất bại
                            (VD: Kho hết hàng), hệ thống sẽ chạy các Giao dịch
                            bù trừ (Compensating) để hoàn tác các bước trước đó
                            (VD: Hủy đơn hàng).
                          </p>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                  .
                </p>

                <p>
                  Và để tối ưu hóa tốc độ truy vấn khi dữ liệu lưu dưới dạng các
                  Sự kiện, hệ thống luôn đi kèm với kiến trúc{" "}
                  <HoverCard>
                    <HoverCardTrigger className="text-secondary-foreground/80 font-bold border-b-2 border-dashed border-secondary-foreground/30 cursor-help hover:text-secondary-foreground transition-colors">
                      CQRS
                    </HoverCardTrigger>
                    <HoverCardContent className="w-85 bg-white/95 border-white/80 text-foreground shadow-2xl backdrop-blur-md rounded-2xl p-5">
                      <div className="flex justify-between space-x-4">
                        <div className="space-y-2">
                          <h4 className="text-base font-bold text-secondary-foreground/80 flex items-center gap-2">
                            <Info className="w-4 h-4" /> CQRS
                          </h4>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            Command Query Responsibility Segregation. Tách biệt
                            hoàn toàn DB dùng để Ghi (lưu Event) và DB dùng để
                            Đọc (đã được tính toán sẵn kết quả).
                          </p>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Cột Phải: 3 Nỗi Đau Được Giải Quyết */}
          <div className="lg:col-span-7 animate__animated animate__fadeInRight">
            <Accordion
              type="single"
              collapsible
              defaultValue="item-1"
              className="w-full space-y-6"
            >
              {/* Vấn đề 1 */}
              <AccordionItem
                value="item-1"
                className="border border-white/60 bg-white/30 rounded-[1.5rem] px-6 data-[state=open]:bg-white/50 data-[state=open]:shadow-sm transition-all duration-300"
              >
                <AccordionTrigger className="hover:no-underline py-6 text-left focus:outline-none">
                  <div className="flex items-center gap-5 text-xl font-bold text-foreground">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                      1
                    </div>
                    Giải quyết Giao dịch phân tán
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-8 text-base font-medium">
                  Trong Microservices, Service Order và Inventory dùng hai
                  Database ở hai server khác nhau, không thể dùng BEGIN
                  TRANSACTION chung được.
                  <br />
                  <br />
                  <strong className="text-primary font-bold">
                    Cách hoạt động:
                  </strong>{" "}
                  Khi có đơn, Order Service lưu sự kiện{" "}
                  <code className="text-rose-600 bg-rose-100 px-2 py-0.5 rounded-lg font-mono text-sm">
                    OrderCreated
                  </code>{" "}
                  và bắn nó đi. Inventory Service nghe thấy và trừ kho. Nếu trừ
                  kho thất bại, nó bắn ngược sự kiện{" "}
                  <code className="text-rose-600 bg-rose-100 px-2 py-0.5 rounded-lg font-mono text-sm">
                    InventoryEmpty
                  </code>{" "}
                  để Order hủy đơn. Event Sourcing là xương sống chạy Saga an
                  toàn.
                </AccordionContent>
              </AccordionItem>

              {/* Vấn đề 2 */}
              <AccordionItem
                value="item-2"
                className="border border-white/60 bg-white/30 rounded-[1.5rem] px-6 data-[state=open]:bg-white/50 data-[state=open]:shadow-sm transition-all duration-300"
              >
                <AccordionTrigger className="hover:no-underline py-6 text-left focus:outline-none">
                  <div className="flex items-center gap-5 text-xl font-bold text-foreground">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                      <Repeat className="w-6 h-6" />
                    </div>
                    Sự nhất quán cuối cùng
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-8 text-base font-medium">
                  Nếu dùng API gọi trực tiếp chéo nhau, hệ thống sẽ chậm và dễ
                  sập dây chuyền (Cascading Failure).
                  <br />
                  <br />
                  <strong className="text-primary font-bold">
                    Giải pháp:
                  </strong>{" "}
                  Các Service khác chỉ cần đăng ký theo dõi dòng sự kiện (Event
                  Stream). Khi có sự kiện mới, chúng tự cập nhật dữ liệu của
                  riêng mình. Các Microservices hoạt động hoàn toàn độc lập,
                  không đợi nhau, chịu tải cực tốt.
                </AccordionContent>
              </AccordionItem>

              {/* Vấn đề 3 */}
              <AccordionItem
                value="item-3"
                className="border border-white/60 bg-white/30 rounded-[1.5rem] px-6 data-[state=open]:bg-white/50 data-[state=open]:shadow-sm transition-all duration-300"
              >
                <AccordionTrigger className="hover:no-underline py-6 text-left focus:outline-none">
                  <div className="flex items-center gap-5 text-xl font-bold text-foreground">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                      <History className="w-6 h-6" />
                    </div>
                    Khả năng Xây lại dữ liệu thần kỳ
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-8 text-base font-medium">
                  Sếp yêu cầu làm thêm Service số 6 để phân tích hành vi khách
                  hàng. Với CRUD, bạn có cái Database trống rỗng và phải viết
                  script đi năn nỉ 5 Service kia lấy data.
                  <br />
                  <br />
                  <strong className="text-primary font-bold">
                    Với Event Sourcing:
                  </strong>{" "}
                  Service mới chỉ cần kết nối vào Event Store và Replay lại toàn
                  bộ lịch sử từ ngày đầu tiên. Trong vài phút, nó có đầy đủ dữ
                  liệu quá khứ như thể đã tồn tại từ lâu.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
      [Image of Event Sourcing and CQRS architecture]
    </section>
  );
}

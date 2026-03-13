"use client";

import * as React from "react";
import { useParams, notFound } from "next/navigation";
import Topic2DemoPage from "@/app/features/topic-2-order-store/page";
import Topic1WalletPage from "@/app/features/topic-1-wallet/page";

// Tương lai: Import các file page/component chính của các nhóm khác tại đây
// import Topic3Page from "@/features/topic-3-payment/page";
// import Topic4Page from "@/features/topic-4-analytics/page";

// Hiện tại: Chỉ import file chính của Chủ đề 2 (Của bạn)


export default function DynamicTopicDemoPage() {
  const params = useParams();
  const topicId = params.topicId as string;

  // Sử dụng Switch-Case để điều phối. Ai code xong phần nào thì mở comment phần đó.
  switch (topicId) {
    case "topic-1":
      return <Topic1WalletPage />;

    case "topic-2":
      // Gọi ĐÚNG file page của bạn ra đây
      return <Topic2DemoPage />;

    case "topic-3":
      // return <Topic3Page />;
      return notFound();

    case "topic-4":
      // return <Topic4Page />;
      return notFound();

    default:
      // Nếu user gõ bậy bạ trên URL (ví dụ: /demo/abc) -> Cho ra trang 404
      return notFound();
  }
}

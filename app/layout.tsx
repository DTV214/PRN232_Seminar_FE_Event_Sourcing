import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "animate.css";

// Sử dụng phông Inter cho văn bản thường (Rất rõ ràng, dễ đọc)
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Sử dụng JetBrains Mono cho các yếu tố kỹ thuật/code
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Event Sourcing Seminar",
  description: "Microservices Architecture Seminar Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Xóa class 'dark' để hệ thống chạy Light Mode
    <html lang="vi" className="scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-theme-gradient text-foreground min-h-screen flex flex-col selection:bg-primary/30 selection:text-primary-foreground`}
      >
        {children}
      </body>
    </html>
  );
}

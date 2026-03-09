"use client";

import * as React from "react";
import Link from "next/link";
import { Activity, Play, Menu } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/40 backdrop-blur-xl border-b border-black/5 shadow-[0_2px_20px_rgba(0,0,0,0.02)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo Section - Gradient mới theo tone Xanh rêu & Beige */}
        <Link
          href="/"
          className="flex items-center gap-3 font-bold text-xl tracking-tighter group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm group-hover:shadow-primary/20 transition-all duration-300">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="text-foreground text-2xl font-extrabold tracking-tight">
            Tech<span className="text-primary">Seminar</span>
          </span>
        </Link>

        

        {/* CTA Button phong cách Light Theme */}
        <div className="flex items-center gap-4">
          <Link
            href="/demo"
            className="hidden sm:flex items-center gap-2 text-sm font-bold px-7 py-3 rounded-full bg-white border border-black/5 text-foreground hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-primary/20 hover:-translate-y-0.5"
          >
            <Play className="w-4 h-4 fill-current" />
            Live Demo
          </Link>

          <button className="md:hidden text-foreground hover:text-primary transition-colors">
            <Menu className="w-7 h-7" />
          </button>
        </div>
      </div>
    </nav>
  );
}

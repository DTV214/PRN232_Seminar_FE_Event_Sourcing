"use client";

import React, { useState } from "react";
import { useWalletStore } from "./store";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Wallet,
  UserPlus,
  ArrowDownCircle,
  ArrowUpCircle,
  AlertTriangle,
  Clock,
  Search,
  RefreshCw,
  ChevronRight,
  Shield,
  Zap,
  TrendingDown,
} from "lucide-react";

// =====================================================================
// SECTION 1: TẠO USER (RabbitMQ Demo)
// =====================================================================
function CreateUserSection() {
  const { doCreateUser, loading } = useWalletStore();
  const [form, setForm] = useState({ username: "", email: "", password: "", fullName: "", phoneNumber: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await doCreateUser(form);
  };

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
          <UserPlus className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Bước 1: Tạo User & Ví</h2>
          <p className="text-sm text-muted-foreground">UserService → RabbitMQ → PaymentService tự tạo Wallet</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input placeholder="Username *" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="px-4 py-3 rounded-xl bg-white/60 border border-white/80 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all text-sm" />
        <input placeholder="Email *" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="px-4 py-3 rounded-xl bg-white/60 border border-white/80 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all text-sm" />
        <input placeholder="Password *" required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="px-4 py-3 rounded-xl bg-white/60 border border-white/80 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all text-sm" />
        <input placeholder="Họ tên" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          className="px-4 py-3 rounded-xl bg-white/60 border border-white/80 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all text-sm" />
        <input placeholder="Số điện thoại" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
          className="px-4 py-3 rounded-xl bg-white/60 border border-white/80 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all text-sm" />
        <button type="submit" disabled={loading}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
          🐰 Tạo User (RabbitMQ)
        </button>
      </form>
    </section>
  );
}

// =====================================================================
// SECTION 2: QUẢN LÝ VÍ (Nạp/Rút tiền)
// =====================================================================
function WalletSection() {
  const { wallet, transactions, loading, message, messageType, clearMessage, doLoadWallet, doDeposit, doWithdraw, doLoadTransactions } = useWalletStore();
  const [accountId, setAccountId] = useState("");
  const [txForm, setTxForm] = useState({ amount: "", description: "" });

  const handleLoad = async () => {
    if (!accountId.trim()) return;
    await doLoadWallet(accountId.trim());
    const w = useWalletStore.getState().wallet;
    if (w) await doLoadTransactions(w.walletId);
  };

  const handleDeposit = async () => {
    if (!wallet || !txForm.amount) return;
    await doDeposit({ accountId: wallet.accountId, amount: Number(txForm.amount), description: txForm.description || "Nạp tiền" });
    setTxForm({ amount: "", description: "" });
  };

  const handleWithdraw = async () => {
    if (!wallet || !txForm.amount) return;
    await doWithdraw({ accountId: wallet.accountId, amount: Number(txForm.amount), description: txForm.description || "Rút tiền" });
    setTxForm({ amount: "", description: "" });
  };

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
          <Wallet className="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Bước 2: Quản lý Ví</h2>
          <p className="text-sm text-muted-foreground">Nạp/Rút tiền + Event Sourcing ghi lại mọi thay đổi</p>
        </div>
      </div>

      {/* Load Wallet */}
      <div className="flex gap-2 mb-6">
        <input placeholder="Nhập Email hoặc Username để tìm ví..." value={accountId} onChange={(e) => setAccountId(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-white/60 border border-white/80 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition-all text-sm font-mono" />
        <button onClick={handleLoad} disabled={loading}
          className="px-5 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all flex items-center gap-2">
          <Search className="w-4 h-4" /> Tìm ví
        </button>
      </div>

      {wallet && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Wallet Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/20">
            <p className="text-sm opacity-80 font-medium">Số dư ví</p>
            <p className="text-3xl font-black mt-1">{wallet.balance.toLocaleString()} <span className="text-lg font-medium">{wallet.currency}</span></p>
            <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-2 text-xs">
              <div><span className="opacity-60">User:</span> <span className="font-bold">{wallet.username}</span></div>
              <div><span className="opacity-60">Email:</span> <span className="font-bold">{wallet.email}</span></div>
              <div className="col-span-2"><span className="opacity-60">WalletId:</span> <span className="font-mono text-[10px]">{wallet.walletId}</span></div>
            </div>
          </div>

          {/* Transaction Form */}
          <div className="p-6 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60">
            <h3 className="font-bold text-sm mb-3">Giao dịch</h3>
            <input type="number" placeholder="Số tiền (VND)" value={txForm.amount} onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/80 focus:border-emerald-400 outline-none text-sm mb-2" />
            <input placeholder="Mô tả (tuỳ chọn)" value={txForm.description} onChange={(e) => setTxForm({ ...txForm, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/80 focus:border-emerald-400 outline-none text-sm mb-3" />
            <div className="flex gap-2">
              <button onClick={handleDeposit} disabled={loading}
                className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors">
                <ArrowDownCircle className="w-4 h-4" /> Nạp tiền
              </button>
              <button onClick={handleWithdraw} disabled={loading}
                className="flex-1 py-3 rounded-xl bg-rose-500 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-rose-600 transition-colors">
                <ArrowUpCircle className="w-4 h-4" /> Rút tiền
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Transaction History */}
      {transactions.length > 0 && (
        <div className="mt-6">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Clock className="w-4 h-4" /> Lịch sử giao dịch gần nhất</h3>
          <div className="space-y-2">
            {transactions.slice(0, 10).map((tx) => (
              <div key={tx.id} className={`flex items-center justify-between p-3 rounded-xl text-sm ${tx.isSuspicious ? "bg-red-50 border border-red-200" : "bg-white/40 border border-white/60"}`}>
                <div className="flex items-center gap-3">
                  {tx.transactionType === "Deposit" ? <ArrowDownCircle className="w-4 h-4 text-emerald-500" /> : <ArrowUpCircle className="w-4 h-4 text-rose-500" />}
                  <div>
                    <span className="font-semibold">{tx.transactionType}</span>
                    {tx.description && <span className="text-muted-foreground ml-2">— {tx.description}</span>}
                    {tx.isSuspicious && <span className="ml-2 px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold">⚠️ BẤT THƯỜNG</span>}
                  </div>
                </div>
                <span className={`font-bold ${tx.transactionType === "Deposit" ? "text-emerald-600" : "text-rose-600"}`}>
                  {tx.transactionType === "Deposit" ? "+" : "-"}{tx.amount.toLocaleString()} VND
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

// =====================================================================
// SECTION 3: GIAO DỊCH BẤT THƯỜNG
// =====================================================================
function SuspiciousSection() {
  const { suspiciousList, suspiciousCount, doLoadSuspicious, loading } = useWalletStore();

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Bước 3: Tra cứu giao dịch bất thường</h2>
            <p className="text-sm text-muted-foreground">3 thuật toán phát hiện: Giao dịch lớn, Tần suất cao, Rút gần hết ví</p>
          </div>
        </div>
        <button onClick={doLoadSuspicious} disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all flex items-center gap-2">
          <Search className="w-4 h-4" /> Tra cứu
        </button>
      </div>

      {/* 3 Algorithm Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-white/40 border border-white/60">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-sm">Rule 1</span>
          </div>
          <p className="text-xs text-muted-foreground">Số tiền &gt; <strong>5x</strong> trung bình 30 ngày</p>
        </div>
        <div className="p-4 rounded-xl bg-white/40 border border-white/60">
          <div className="flex items-center gap-2 mb-2">
            <RefreshCw className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-sm">Rule 2</span>
          </div>
          <p className="text-xs text-muted-foreground">&gt; <strong>10</strong> giao dịch trong 1 giờ</p>
        </div>
        <div className="p-4 rounded-xl bg-white/40 border border-white/60">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-red-500" />
            <span className="font-bold text-sm">Rule 3</span>
          </div>
          <p className="text-xs text-muted-foreground">Rút &gt; <strong>90%</strong> số dư ví</p>
        </div>
      </div>

      {suspiciousCount > 0 && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 mb-4">
          <p className="text-sm font-bold text-red-600">Phát hiện {suspiciousCount} giao dịch bất thường</p>
        </div>
      )}

      {suspiciousList.length > 0 && (
        <div className="space-y-3">
          {suspiciousList.map((tx) => (
            <div key={tx.id} className="p-4 rounded-xl bg-red-50/80 border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-red-700">{tx.transactionType} — {tx.amount.toLocaleString()} VND</span>
                <span className="text-xs text-muted-foreground">{new Date(tx.timestamp).toLocaleString("vi-VN")}</span>
              </div>
              <p className="text-xs text-red-600 flex items-center gap-1">
                <Shield className="w-3 h-3" /> {tx.suspiciousReason}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// =====================================================================
// SECTION 4: EVENT SOURCING TIMELINE
// =====================================================================
function EventTimelineSection() {
  const { wallet, events, doLoadEvents, doReplay, replayResult, loading } = useWalletStore();
  const [verifyResult, setVerifyResult] = React.useState<any>(null);
  const [verifying, setVerifying] = React.useState(false);
  const [replaying, setReplaying] = React.useState(false);

  const handleVerify = async () => {
    if (!wallet) return;
    setVerifying(true);
    try {
      const { verifyEvents } = await import("./api");
      const res = await verifyEvents(wallet.walletId);
      setVerifyResult(res);
    } catch {
      setVerifyResult({ isValid: false, message: "❌ Lỗi kết nối server" });
    }
    setVerifying(false);
  };

  const handleReplay = async () => {
    if (!wallet) return;
    setReplaying(true);
    await doReplay(wallet.walletId);
    setReplaying(false);
  };

  const eventColors: Record<string, string> = {
    WalletCreated: "bg-blue-500",
    Deposited: "bg-emerald-500",
    Withdrawn: "bg-amber-500",
    SuspiciousDetected: "bg-red-500",
  };

  const eventIcons: Record<string, string> = {
    WalletCreated: "🏦",
    Deposited: "💰",
    Withdrawn: "💸",
    SuspiciousDetected: "🚨",
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Bước 4: Event Sourcing Timeline</h2>
            <p className="text-sm text-muted-foreground">Replay toàn bộ lịch sử sự kiện của ví — immutable event store + Hash Chain</p>
          </div>
        </div>
        <div className="flex gap-2">
          {wallet && (
            <>
              <button onClick={() => doLoadEvents(wallet.walletId)} disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all flex items-center gap-2">
                <RefreshCw className="w-4 h-4" /> Load Events
              </button>
              <button onClick={handleVerify} disabled={verifying}
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all flex items-center gap-2">
                <Shield className="w-4 h-4" /> {verifying ? "Đang kiểm tra..." : "🔐 Verify Integrity"}
              </button>
              <button onClick={handleReplay} disabled={replaying}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-sm shadow-lg shadow-cyan-600/25 hover:shadow-cyan-600/40 transition-all flex items-center gap-2">
                <RefreshCw className={`w-4 h-4 ${replaying ? 'animate-spin' : ''}`} /> {replaying ? "Đang replay..." : "🔄 Replay & Heal"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Verify Result */}
      {verifyResult && (
        <div className={`p-4 rounded-xl border mb-6 ${
          verifyResult.isValid 
            ? "bg-emerald-50 border-emerald-200" 
            : "bg-red-50 border-red-200"
        }`}>
          <p className={`font-bold text-sm ${verifyResult.isValid ? "text-emerald-700" : "text-red-700"}`}>
            {verifyResult.message}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Tổng số events: {verifyResult.totalEvents} | Events bị giả mạo: {verifyResult.tamperedCount || 0}
          </p>
          {verifyResult.tamperedEvents?.length > 0 && (
            <div className="mt-3 space-y-2">
              {verifyResult.tamperedEvents.map((t: any, i: number) => (
                <div key={i} className="p-3 rounded-lg bg-red-100 text-xs">
                  <p className="font-bold text-red-700">🚨 {t.eventType} — {t.issue}</p>
                  <p className="text-red-600 font-mono mt-1">Stored: {t.storedHash?.slice(0, 16)}...</p>
                  <p className="text-red-600 font-mono">Expected: {t.expectedHash?.slice(0, 16)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Replay Result */}
      {replayResult && (
        <div className={`p-4 rounded-xl border mb-6 ${
          replayResult.isMatch
            ? "bg-emerald-50 border-emerald-200"
            : "bg-orange-50 border-orange-200"
        }`}>
          <p className={`font-bold text-sm ${replayResult.isMatch ? "text-emerald-700" : "text-orange-700"}`}>
            {replayResult.message}
          </p>
          <div className="flex gap-6 mt-2 text-xs">
            <span>💾 Balance trong DB: <b>{Number(replayResult.balanceFromWallet)?.toLocaleString()} VND</b></span>
            <span>📒 Balance từ Events: <b>{Number(replayResult.balanceFromEvents)?.toLocaleString()} VND</b></span>
            <span>🔧 Đã tự sửa: <b>{replayResult.wasHealed ? "✅ Có" : "Không cần"}</b></span>
          </div>
          {replayResult.replaySteps?.length > 0 && (
            <div className="mt-3 space-y-1">
              <p className="text-xs font-bold text-muted-foreground">Replay từng bước:</p>
              {replayResult.replaySteps.map((step: any, i: number) => (
                <div key={i} className="flex justify-between text-xs px-3 py-1.5 rounded-lg bg-white/60">
                  <span>{step.eventType} {step.amount != null ? `(${Number(step.amount).toLocaleString()} VND)` : ''}</span>
                  <span className="font-mono font-bold">→ {Number(step.runningBalance).toLocaleString()} VND</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!wallet && (
        <p className="text-sm text-muted-foreground italic">Vui lòng tải ví ở Bước 2 trước để xem Event Timeline.</p>
      )}

      {events.length > 0 && (
        <div className="relative pl-8">
          {/* Vertical line */}
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-emerald-500 to-purple-500 rounded-full" />

          {events.map((ev, i) => (
            <div key={ev.id} className="relative mb-6 last:mb-0">
              {/* Dot */}
              <div className={`absolute -left-5 w-6 h-6 rounded-full flex items-center justify-center text-xs ${eventColors[ev.eventType] || "bg-gray-400"} text-white shadow-lg`}>
                {eventIcons[ev.eventType] || "📝"}
              </div>

              {/* Content */}
              <div className="p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-white/60 hover:bg-white/70 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white ${eventColors[ev.eventType] || "bg-gray-400"}`}>
                    {ev.eventType}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    #{i + 1} • {new Date(ev.timestamp).toLocaleString("vi-VN")}
                  </span>
                </div>
                <pre className="text-xs text-muted-foreground bg-black/5 rounded-lg p-2 overflow-x-auto mt-1">
                  {JSON.stringify(ev.eventData, null, 2)}
                </pre>
                {/* Hash display */}
                <div className="mt-2 flex gap-4 text-[10px] font-mono text-muted-foreground/60">
                  <span>🔗 Hash: {(ev as any).hash?.slice(0, 16)}...</span>
                  <span>⬅️ Prev: {(ev as any).previousHash?.slice(0, 16)}...</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// =====================================================================
// TOAST POPUP — Thông báo dạng popup góc phải dưới
// =====================================================================
function ToastMessage() {
  const { message, messageType, clearMessage } = useWalletStore();

  React.useEffect(() => {
    if (message) {
      const timer = setTimeout(clearMessage, 6000);
      return () => clearTimeout(timer);
    }
  }, [message, clearMessage]);

  if (!message) return null;

  const bgColor = messageType === "success"
    ? "bg-emerald-600" : messageType === "warning"
    ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className={`${bgColor} text-white p-4 rounded-2xl shadow-2xl text-sm font-medium flex items-start gap-3`}>
        <span className="flex-1">{message}</span>
        <button onClick={clearMessage} className="text-white/80 hover:text-white font-bold text-lg leading-none mt-[-2px]">
          ✕
        </button>
      </div>
    </div>
  );
}

// =====================================================================
// MAIN PAGE
// =====================================================================
export default function Topic1WalletPage() {
  return (
    <div className="min-h-screen flex flex-col bg-theme-gradient">
      <Navbar />
      <main className="flex-1 pt-32 pb-20 container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12 animate__animated animate__fadeIn">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-white/80 text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">
            <Wallet className="w-4 h-4" /> Topic 1 — Nguyễn Gia Khánh
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-3">
            Giao Dịch <span className="text-blue-500">Ví Điện Tử</span>
          </h1>
          <p className="text-muted-foreground font-medium max-w-2xl mx-auto">
            Event Sourcing + Phát hiện giao dịch bất thường + RabbitMQ Inter-service Communication
          </p>
        </div>

        {/* Architecture Diagram */}
        <div className="p-6 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60 mb-12">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><ChevronRight className="w-4 h-4" /> Kiến trúc hệ thống</h3>
          <pre className="text-xs text-muted-foreground font-mono leading-relaxed overflow-x-auto">
{`UserService                              PaymentService
    │                                         │
    │  POST /api/users (tạo user)             │
    │ ──── UserCreatedEvent ────────────────► │
    │       (qua RabbitMQ)                    │ Tự động tạo Account + Wallet
    │                                         │ + ghi WalletEvent
    │                                         │
    │                                    Nạp/Rút tiền → ghi WalletEvent
    │                                    Phát hiện bất thường ↓
    │ ◄──── SuspiciousActivityDetected ────── │
    │        (qua RabbitMQ)                   │`}
          </pre>
        </div>

        <CreateUserSection />
        <WalletSection />
        <SuspiciousSection />
        <EventTimelineSection />
      </main>
      <Footer />
      <ToastMessage />
    </div>
  );
}

"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Activity, Loader2, RefreshCw } from "lucide-react";
import {
  AuthTokenPayload,
  LoginPayload,
  RequestOtpPayload,
  UpdateProfilePayload,
  UserBehavior,
  UserProfile,
  VerifyOtpPayload,
  getErrorMessage,
  getProfile,
  getUserBehavior,
  loginWithBehavior,
  requestRegisterOtp,
  updateProfile,
  verifyRegisterOtp,
} from "./api";

type UiStatus = "success" | "error" | "info";

interface StatusMessage {
  type: UiStatus;
  text: string;
}

interface LogItem {
  id: string;
  text: string;
  createdAt: string;
}

interface ProfileFormState {
  fullName: string;
  dob: string;
  gender: string;
  address: string;
}

const toDateTimeLocal = (iso?: string | null): string => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
};

const formatDateTime = (iso?: string | null): string => {
  if (!iso) return "--";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString("vi-VN");
};

const displayPreferredHour = (hour?: number | null): string => {
  if (hour === null || hour === undefined) return "--";
  return `${String(hour).padStart(2, "0")}:00`;
};

const statusClass: Record<UiStatus, string> = {
  success: "bg-emerald-50 border-emerald-200 text-emerald-700",
  error: "bg-red-50 border-red-200 text-red-700",
  info: "bg-sky-50 border-sky-200 text-sky-700",
};

export default function Topic4AnalyticsPage() {
  const [registerForm, setRegisterForm] = React.useState<RequestOtpPayload>({
    email: "",
    password: "",
  });
  const [verifyForm, setVerifyForm] = React.useState<VerifyOtpPayload>({
    email: "",
    otp: "",
  });
  const [loginForm, setLoginForm] = React.useState({
    email: "",
    password: "",
    loggedInAt: toDateTimeLocal(new Date().toISOString()),
    sessionDurationMinutes: "1",
  });
  const [targetAccountId, setTargetAccountId] = React.useState("");
  const [currentAccountId, setCurrentAccountId] = React.useState("");

  const [authToken, setAuthToken] = React.useState<AuthTokenPayload | null>(null);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [behavior, setBehavior] = React.useState<UserBehavior | null>(null);
  const [status, setStatus] = React.useState<StatusMessage | null>(null);
  const [logs, setLogs] = React.useState<LogItem[]>([]);

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [profileForm, setProfileForm] = React.useState<ProfileFormState>({
    fullName: "",
    dob: "",
    gender: "",
    address: "",
  });

  const [loading, setLoading] = React.useState({
    requestOtp: false,
    verifyOtp: false,
    login: false,
    profile: false,
    behavior: false,
    profileUpdate: false,
    refresh: false,
  });

  const effectiveAccountId = targetAccountId.trim() || currentAccountId.trim();

  const addLog = React.useCallback((text: string) => {
    setLogs((prev) => [
      { id: crypto.randomUUID(), text, createdAt: new Date().toISOString() },
      ...prev,
    ].slice(0, 20));
  }, []);

  const loadProfile = React.useCallback(
    async (id?: string) => {
      const accountId = (id ?? effectiveAccountId).trim();
      if (!accountId) {
        setStatus({ type: "info", text: "Nhập mã người dùng để tải hồ sơ." });
        return;
      }
      setLoading((prev) => ({ ...prev, profile: true }));
      try {
        const res = await getProfile(accountId);
        if (!res.data) throw new Error("Dịch vụ hồ sơ trả về dữ liệu rỗng.");
        setProfile(res.data);
        setCurrentAccountId(res.data.accountId);
        setTargetAccountId(res.data.accountId);
        setStatus({ type: "success", text: res.msg });
        addLog(`Đã tải hồ sơ của ${res.data.email}`);
      } catch (error) {
        setStatus({ type: "error", text: getErrorMessage(error) });
      } finally {
        setLoading((prev) => ({ ...prev, profile: false }));
      }
    },
    [addLog, effectiveAccountId],
  );

  const loadBehavior = React.useCallback(
    async (id?: string) => {
      const userId = (id ?? effectiveAccountId).trim();
      if (!userId) {
        setStatus({ type: "info", text: "Nhập mã người dùng để tải thống kê hành vi." });
        return;
      }
      setLoading((prev) => ({ ...prev, behavior: true }));
      try {
        const res = await getUserBehavior(userId);
        if (!res.data) throw new Error("Dịch vụ hành vi trả về dữ liệu rỗng.");
        setBehavior(res.data);
        setCurrentAccountId(res.data.userId);
        setTargetAccountId(res.data.userId);
        setStatus({ type: "success", text: res.msg });
        addLog(`Đã tải thống kê hành vi của ${res.data.email}`);
      } catch (error) {
        setStatus({ type: "error", text: getErrorMessage(error) });
      } finally {
        setLoading((prev) => ({ ...prev, behavior: false }));
      }
    },
    [addLog, effectiveAccountId],
  );

  const refreshAll = React.useCallback(async () => {
    const id = effectiveAccountId.trim();
    if (!id) {
      setStatus({ type: "info", text: "Cần mã người dùng để làm mới dữ liệu." });
      return;
    }
    setLoading((prev) => ({ ...prev, refresh: true }));
    await Promise.all([loadProfile(id), loadBehavior(id)]);
    setLoading((prev) => ({ ...prev, refresh: false }));
  }, [effectiveAccountId, loadBehavior, loadProfile]);

  const submitRequestOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading((prev) => ({ ...prev, requestOtp: true }));
    try {
      const payload: RequestOtpPayload = {
        email: registerForm.email.trim(),
        password: registerForm.password,
      };
      const res = await requestRegisterOtp(payload);
      setVerifyForm((prev) => ({ ...prev, email: payload.email }));
      setLoginForm((prev) => ({ ...prev, email: payload.email, password: payload.password }));
      setStatus({ type: "success", text: res.msg });
      addLog(`Đã gửi OTP cho ${payload.email}`);
    } catch (error) {
      setStatus({ type: "error", text: getErrorMessage(error, "Không thể gửi OTP.") });
    } finally {
      setLoading((prev) => ({ ...prev, requestOtp: false }));
    }
  };

  const submitVerifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading((prev) => ({ ...prev, verifyOtp: true }));
    try {
      const payload: VerifyOtpPayload = {
        email: verifyForm.email.trim(),
        otp: verifyForm.otp.trim(),
      };
      const res = await verifyRegisterOtp(payload);
      const token = res.data?.token;
      if (!token?.accountId) throw new Error("Xác minh OTP thành công nhưng chưa nhận được mã người dùng.");
      setAuthToken(token);
      setCurrentAccountId(token.accountId);
      setTargetAccountId(token.accountId);
      setStatus({ type: "success", text: res.msg });
      addLog(`Đã xác minh OTP cho ${token.email}`);
      await Promise.all([loadProfile(token.accountId), loadBehavior(token.accountId)]);
    } catch (error) {
      setStatus({ type: "error", text: getErrorMessage(error, "Không thể xác minh OTP.") });
    } finally {
      setLoading((prev) => ({ ...prev, verifyOtp: false }));
    }
  };

  const submitLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading((prev) => ({ ...prev, login: true }));
    try {
      const date = loginForm.loggedInAt ? new Date(loginForm.loggedInAt) : new Date();
      if (Number.isNaN(date.getTime())) throw new Error("Thời gian đăng nhập không hợp lệ.");
      const payload: LoginPayload = {
        email: loginForm.email.trim(),
        password: loginForm.password,
        loggedInAt: date.toISOString(),
        sessionDurationMinutes: Math.max(0, Number(loginForm.sessionDurationMinutes) || 0),
      };
      const res = await loginWithBehavior(payload);
      const token = res.data?.token;
      if (!token?.accountId) throw new Error("Đăng nhập thành công nhưng chưa nhận được mã người dùng.");
      setAuthToken(token);
      setCurrentAccountId(token.accountId);
      setTargetAccountId(token.accountId);
      setStatus({ type: "success", text: res.msg });
      addLog(
        `Đăng nhập thử lúc ${date.toLocaleString("vi-VN")} (${payload.sessionDurationMinutes} phút)`,
      );
      await Promise.all([loadProfile(token.accountId), loadBehavior(token.accountId)]);
    } catch (error) {
      setStatus({ type: "error", text: getErrorMessage(error, "Không thể đăng nhập thử.") });
    } finally {
      setLoading((prev) => ({ ...prev, login: false }));
    }
  };

  React.useEffect(() => {
    if (!dialogOpen) return;
    setProfileForm({
      fullName: profile?.fullName ?? "",
      dob: toDateTimeLocal(profile?.dob),
      gender: profile?.gender ?? "",
      address: profile?.address ?? "",
    });
  }, [dialogOpen, profile]);

  const submitUpdateProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    const accountId = effectiveAccountId.trim();
    if (!accountId) {
      setStatus({ type: "info", text: "Không có mã người dùng để cập nhật hồ sơ." });
      return;
    }
    setLoading((prev) => ({ ...prev, profileUpdate: true }));
    try {
      const payload: UpdateProfilePayload = {
        fullName: profileForm.fullName.trim() || null,
        dob: profileForm.dob ? new Date(profileForm.dob).toISOString() : null,
        gender: profileForm.gender.trim() || null,
        address: profileForm.address.trim() || null,
      };
      const res = await updateProfile(accountId, payload);
      if (!res.data) throw new Error("Cập nhật hồ sơ thành công nhưng dữ liệu trả về rỗng.");
      setProfile(res.data);
      setStatus({ type: "success", text: res.msg });
      setDialogOpen(false);
      addLog(`Đã cập nhật hồ sơ của ${res.data.email}`);
      await loadBehavior(accountId);
    } catch (error) {
      setStatus({ type: "error", text: getErrorMessage(error, "Không thể cập nhật hồ sơ.") });
    } finally {
      setLoading((prev) => ({ ...prev, profileUpdate: false }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-theme-gradient">
      <Navbar />
      <main className="flex-1 pt-32 pb-20 container mx-auto px-6">
        <h1 className="text-4xl font-black mb-2">Topic 4 - Phân tích & Thống kê</h1>
        <p className="text-muted-foreground mb-6">
          Toàn bộ quy trình trong một trang: gửi OTP, xác minh OTP, đăng nhập thử theo thời gian, quản lý hồ sơ, theo dõi hành vi và cập nhật bằng popup.
        </p>

        {status && (
          <div className={`mb-6 p-3 rounded-xl border text-sm font-semibold ${statusClass[status.type]}`}>
            {status.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <form onSubmit={submitRequestOtp} className="p-4 rounded-2xl bg-white/50 border border-white/70 space-y-2">
            <p className="font-bold">1) Gửi OTP đăng ký</p>
            <input type="email" value={registerForm.email} onChange={(e) => setRegisterForm((p) => ({ ...p, email: e.target.value }))} placeholder="Email" className="w-full px-3 py-2 rounded-lg border" required />
            <input type="password" value={registerForm.password} onChange={(e) => setRegisterForm((p) => ({ ...p, password: e.target.value }))} placeholder="Mật khẩu" className="w-full px-3 py-2 rounded-lg border" required />
            <button type="submit" className="w-full py-2 rounded-lg bg-sky-600 text-white font-bold flex items-center justify-center gap-2" disabled={loading.requestOtp}>{loading.requestOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />} Gửi OTP</button>
          </form>

          <form onSubmit={submitVerifyOtp} className="p-4 rounded-2xl bg-white/50 border border-white/70 space-y-2">
            <p className="font-bold">2) Xác minh OTP</p>
            <input type="email" value={verifyForm.email} onChange={(e) => setVerifyForm((p) => ({ ...p, email: e.target.value }))} placeholder="Email" className="w-full px-3 py-2 rounded-lg border" required />
            <input value={verifyForm.otp} onChange={(e) => setVerifyForm((p) => ({ ...p, otp: e.target.value }))} placeholder="OTP" className="w-full px-3 py-2 rounded-lg border" required />
            <button type="submit" className="w-full py-2 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center gap-2" disabled={loading.verifyOtp}>{loading.verifyOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : "Xác minh OTP"}</button>
          </form>

          <form onSubmit={submitLogin} className="p-4 rounded-2xl bg-white/50 border border-white/70 space-y-2">
            <p className="font-bold">3) Đăng nhập thử để ghi nhận hành vi</p>
            <input type="email" value={loginForm.email} onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))} placeholder="Email" className="w-full px-3 py-2 rounded-lg border" required />
            <input type="password" value={loginForm.password} onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))} placeholder="Mật khẩu" className="w-full px-3 py-2 rounded-lg border" required />
            <input type="datetime-local" value={loginForm.loggedInAt} onChange={(e) => setLoginForm((p) => ({ ...p, loggedInAt: e.target.value }))} className="w-full px-3 py-2 rounded-lg border" />
            <input type="number" min={0} value={loginForm.sessionDurationMinutes} onChange={(e) => setLoginForm((p) => ({ ...p, sessionDurationMinutes: e.target.value }))} placeholder="Thời lượng phiên (phút)" className="w-full px-3 py-2 rounded-lg border" />
            <button type="submit" className="w-full py-2 rounded-lg bg-amber-600 text-white font-bold" disabled={loading.login}>{loading.login ? "Đang đăng nhập..." : "Đăng nhập và ghi nhận"}</button>
          </form>
        </div>

        <div className="p-4 rounded-2xl bg-white/50 border border-white/70 mb-6 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div className="md:col-span-2">
            <p className="text-xs font-bold uppercase text-muted-foreground">Mã người dùng</p>
            <input value={targetAccountId} onChange={(e) => setTargetAccountId(e.target.value)} placeholder="Nhập mã người dùng..." className="mt-1 w-full px-3 py-2 rounded-lg border font-mono text-sm" />
          </div>
          <button className="py-2 rounded-lg bg-blue-600 text-white font-bold" onClick={() => loadProfile()} disabled={loading.profile}>Tải hồ sơ</button>
          <button className="py-2 rounded-lg bg-violet-600 text-white font-bold" onClick={() => loadBehavior()} disabled={loading.behavior}>Tải thống kê</button>
          <button className="md:col-span-4 py-2 rounded-lg bg-primary text-white font-bold flex items-center justify-center gap-2" onClick={refreshAll} disabled={loading.refresh}>{loading.refresh ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} Làm mới tất cả</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="p-4 rounded-2xl bg-white/50 border border-white/70">
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold">Hồ sơ người dùng</p>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <button className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-bold" disabled={!effectiveAccountId}>Mở popup cập nhật</button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cập nhật hồ sơ</DialogTitle>
                    <DialogDescription>Chỉnh sửa thông tin người dùng hiện tại.</DialogDescription>
                  </DialogHeader>
                  <form id="topic4-update-form" onSubmit={submitUpdateProfile} className="space-y-2">
                    <input value={profileForm.fullName} onChange={(e) => setProfileForm((p) => ({ ...p, fullName: e.target.value }))} placeholder="Họ và tên" className="w-full px-3 py-2 rounded-lg border" />
                    <input type="datetime-local" value={profileForm.dob} onChange={(e) => setProfileForm((p) => ({ ...p, dob: e.target.value }))} className="w-full px-3 py-2 rounded-lg border" />
                    <input value={profileForm.gender} onChange={(e) => setProfileForm((p) => ({ ...p, gender: e.target.value }))} placeholder="Giới tính" className="w-full px-3 py-2 rounded-lg border" />
                    <textarea rows={3} value={profileForm.address} onChange={(e) => setProfileForm((p) => ({ ...p, address: e.target.value }))} placeholder="Địa chỉ" className="w-full px-3 py-2 rounded-lg border resize-none" />
                  </form>
                  <DialogFooter showCloseButton>
                    <button type="submit" form="topic4-update-form" className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-bold" disabled={loading.profileUpdate}>{loading.profileUpdate ? "Đang lưu..." : "Lưu cập nhật"}</button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            {!profile ? <p className="text-sm text-muted-foreground">Chưa có dữ liệu hồ sơ.</p> : (
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Họ và tên:</strong> {profile.fullName || "--"}</p>
                <p><strong>Ngày sinh:</strong> {formatDateTime(profile.dob)}</p>
                <p><strong>Giới tính:</strong> {profile.gender || "--"}</p>
                <p><strong>Địa chỉ:</strong> {profile.address || "--"}</p>
                <p className="font-mono break-all"><strong>Mã tài khoản:</strong> {profile.accountId}</p>
              </div>
            )}
            <div className="mt-4">
              <p className="font-bold mb-2">Nhật ký thu thập dữ liệu</p>
              <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-2">
                {logs.length === 0 ? <p className="text-sm text-muted-foreground">Chưa có nhật ký.</p> : logs.map((log) => (
                  <div key={log.id} className="p-2 rounded-lg bg-white/70 border border-white text-sm">
                    <p>{log.text}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(log.createdAt)}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="p-4 rounded-2xl bg-white/50 border border-white/70">
            <p className="font-bold mb-3">Phân tích hành vi người dùng</p>
            {!behavior ? <p className="text-sm text-muted-foreground">Chưa có dữ liệu hành vi.</p> : (
              <div className="space-y-2 text-sm">
                <p><strong>Người dùng:</strong> {behavior.email}</p>
                <p><strong>Trạng thái:</strong> {behavior.currentStatus}</p>
                <p><strong>Số lần đăng nhập:</strong> {behavior.loginCount}</p>
                <p><strong>Số lần cập nhật hồ sơ:</strong> {behavior.profileUpdateCount}</p>
                <p><strong>Khung giờ đăng nhập ưu tiên:</strong> {displayPreferredHour(behavior.preferredLoginHour)}</p>
                <p><strong>Ngày hoạt động nhiều nhất:</strong> {behavior.mostActiveWeekday || "--"}</p>
                <p><strong>Thời lượng phiên trung bình (phút):</strong> {behavior.averageSessionDurationMinutes}</p>
                <p><strong>Số ngày trung bình giữa các lần đăng nhập:</strong> {behavior.averageDaysBetweenLogins}</p>
                <p><strong>Số ngày hoạt động ước tính:</strong> {behavior.estimatedActiveDaysSpan}</p>
                <p><strong>Lần đăng nhập đầu tiên:</strong> {formatDateTime(behavior.firstLoginAt)}</p>
                <p><strong>Lần đăng nhập gần nhất:</strong> {formatDateTime(behavior.lastLoginAt)}</p>
                <p><strong>Lần cập nhật hồ sơ gần nhất:</strong> {formatDateTime(behavior.lastProfileUpdatedAt)}</p>
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-black/10 text-sm">
              <p><strong>Tóm tắt phiên xác thực:</strong></p>
              {!authToken ? <p className="text-muted-foreground">Chưa có token.</p> : (
                <div className="mt-2 space-y-1">
                  <p><strong>Email:</strong> {authToken.email}</p>
                  <p><strong>Trạng thái:</strong> {authToken.status}</p>
                  <p><strong>Thời điểm đăng nhập:</strong> {formatDateTime(authToken.loggedInAt)}</p>
                  <p><strong>Thời lượng phiên:</strong> {authToken.sessionDurationMinutes ?? "--"} phút</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

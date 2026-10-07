"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles, Mail, Phone, Lock, ArrowRight, ArrowLeft,
  KeyRound, CheckCircle2, AlertCircle, Loader2,
  Eye, EyeOff, RefreshCw, Shield,
} from "lucide-react";

type Method = "email" | "mobile";
type Step = "choose" | "send" | "otp" | "password" | "done";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [method, setMethod] = useState<Method>("email");
  const [step, setStep] = useState<Step>("choose");
  const [value, setValue] = useState(""); // email or mobile
  const [otp, setOtp] = useState("");
  const [otpInputs, setOtpInputs] = useState(["", "", "", "", "", ""]);
  const [maskedTarget, setMaskedTarget] = useState("");
  const [demoOtp, setDemoOtp] = useState(""); // demo mode only
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // OTP input boxes handler
  const handleOtpInput = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newInputs = [...otpInputs];
    newInputs[index] = val.slice(-1);
    setOtpInputs(newInputs);
    setOtp(newInputs.join(""));
    // Auto focus next
    if (val && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpInputs[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  // Start resend countdown
  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) { clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (method === "mobile" && !/^[6-9]\d{9}$/.test(value)) {
      setError("Valid 10-digit Indian mobile number dalo.");
      return;
    }
    if (method === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Valid email address dalo.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, value }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "OTP bhejne mein error aaya.");
      } else {
        setMaskedTarget(data.maskedTarget || value);
        if (data.demoOtp) setDemoOtp(data.demoOtp); // demo mode
        setStep("otp");
        startResendTimer();
      }
    } catch {
      setError("Network error. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (resendTimer > 0) return;
    setError("");
    setOtpInputs(["", "", "", "", "", ""]);
    setOtp("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, value }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
      } else {
        if (data.demoOtp) setDemoOtp(data.demoOtp);
        startResendTimer();
      }
    } catch {
      setError("Resend failed.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (otp.length < 6) {
      setError("6-digit OTP poora dalo.");
      return;
    }
    setLoading(true);
    // Just verify, move to password step
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    setStep("password");
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Dono passwords match nahi kar rahe!");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password kam se kam 6 characters ka hona chahiye.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: value, otp, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Reset failed.");
        if (data.error?.includes("OTP")) setStep("otp");
      } else {
        setStep("done");
      }
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-[#090a0f] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/15 blur-[120px] -z-10 rounded-full pointer-events-none" />

      {/* Brand */}
      <Link href="/" className="flex items-center space-x-3 mb-8 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-xl text-white tracking-tight">AI Website Builder</span>
      </Link>

      <div className="w-full max-w-md p-8 rounded-2xl glass-panel border border-gray-800 shadow-2xl">

        {/* Progress Bar */}
        {step !== "done" && (
          <div className="flex gap-1.5 mb-6">
            {(["choose", "send", "otp", "password"] as Step[]).map((s, i) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  ["choose", "send", "otp", "password", "done"].indexOf(step) >= i
                    ? "bg-violet-500"
                    : "bg-gray-700"
                }`}
              />
            ))}
          </div>
        )}

        {/* ── STEP 0: Choose method ── */}
        {step === "choose" && (
          <>
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-violet-600/15 border border-violet-500/30 flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-7 h-7 text-violet-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Password Reset</h1>
              <p className="text-sm text-gray-400 mt-1">OTP kahan bhejein?</p>
            </div>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => { setMethod("email"); setStep("send"); setValue(""); setError(""); }}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-violet-500/50 bg-violet-600/10 hover:bg-violet-600/20 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-violet-400" />
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold text-sm">Email se OTP</p>
                  <p className="text-gray-400 text-xs">Registered email pe OTP bheja jayega</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-violet-400 ml-auto transition-colors" />
              </button>

              <button
                onClick={() => { setMethod("mobile"); setStep("send"); setValue(""); setError(""); }}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-700 hover:border-blue-500/50 bg-gray-800/40 hover:bg-blue-600/10 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold text-sm">Mobile se OTP</p>
                  <p className="text-gray-400 text-xs">Registered mobile number pe OTP bheja jayega</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 ml-auto transition-colors" />
              </button>
            </div>
          </>
        )}

        {/* ── STEP 1: Enter email/mobile ── */}
        {step === "send" && (
          <>
            <div className="text-center mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                method === "email"
                  ? "bg-violet-600/15 border border-violet-500/30"
                  : "bg-blue-600/15 border border-blue-500/30"
              }`}>
                {method === "email"
                  ? <Mail className="w-7 h-7 text-violet-400" />
                  : <Phone className="w-7 h-7 text-blue-400" />
                }
              </div>
              <h1 className="text-2xl font-bold text-white">
                {method === "email" ? "Email Dalo" : "Mobile Dalo"}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {method === "email"
                  ? "Aapka registered email address"
                  : "Aapka registered mobile number"}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  {method === "email" ? "Email Address" : "Mobile Number (10 digit)"}
                </label>
                <div className="relative flex items-center">
                  {method === "email"
                    ? <Mail className="w-4 h-4 text-gray-500 absolute left-3 pointer-events-none" />
                    : <Phone className="w-4 h-4 text-gray-500 absolute left-3 pointer-events-none" />
                  }
                  {method === "mobile" && (
                    <span className="absolute left-10 text-gray-400 text-sm border-r border-gray-700 pr-2 mr-1">+91</span>
                  )}
                  <input
                    type={method === "email" ? "email" : "tel"}
                    required
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={method === "email" ? "you@example.com" : "9876543210"}
                    maxLength={method === "mobile" ? 10 : undefined}
                    className={`w-full bg-gray-900/60 border border-gray-700/80 rounded-xl py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors ${
                      method === "mobile" ? "pl-20 pr-4" : "pl-10 pr-4"
                    } ${method === "email" ? "focus:border-violet-500" : "focus:border-blue-500"}`}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setStep("choose"); setError(""); }}
                  className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-3 rounded-xl text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-60 ${
                    method === "email"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-600/30"
                      : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-blue-600/30"
                  }`}
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Bhej raha hai...</>
                  ) : (
                    <><span>OTP Bhejo</span><ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </form>
          </>
        )}

        {/* ── STEP 2: Enter OTP ── */}
        {step === "otp" && (
          <>
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-green-600/15 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">OTP Enter Karo</h1>
              <p className="text-sm text-gray-400 mt-1">
                6-digit OTP bheja gaya hai{" "}
                <span className="text-violet-300 font-medium">{maskedTarget}</span> pe
              </p>
            </div>

            {/* Demo OTP banner */}
            {demoOtp && (
              <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
                <span className="text-base">📱</span>
                <div>
                  <p className="font-semibold">Demo Mode — SMS nahi gaya</p>
                  <p>Aapka OTP hai: <strong className="text-white text-sm font-mono">{demoOtp}</strong></p>
                  <p className="text-amber-400/70 mt-0.5">Real SMS ke liye Twilio configure karo</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              {/* 6-box OTP input */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-3 text-center">
                  OTP Boxes mein dalo
                </label>
                <div className="flex gap-2 justify-center">
                  {otpInputs.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpInput(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-11 h-12 text-center text-lg font-bold text-white bg-gray-900 border-2 border-gray-700 rounded-xl focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  ))}
                </div>
                <p className="text-center text-xs text-gray-500 mt-2">⏰ 10 minutes mein expire hoga</p>
              </div>

              {/* Resend */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendTimer > 0 || loading}
                  className="flex items-center gap-1.5 mx-auto text-xs text-gray-400 hover:text-violet-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : "OTP Dobara Bhejo"}
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setStep("send"); setError(""); setOtpInputs(["","","","","",""]); setOtp(""); }}
                  className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all disabled:opacity-60"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Verify ho raha hai...</>
                  ) : (
                    <><Shield className="w-4 h-4" /> OTP Verify Karo</>
                  )}
                </button>
              </div>
            </form>
          </>
        )}

        {/* ── STEP 3: New Password ── */}
        {step === "password" && (
          <>
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-violet-600/15 border border-violet-500/30 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7 text-violet-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Naya Password Set Karo</h1>
              <p className="text-sm text-gray-400 mt-1">OTP verified ✅ — Ab naya password banao</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">New Password</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Naya password (min. 6 characters)"
                    className="w-full bg-gray-900/60 border border-gray-700/80 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-gray-500 hover:text-gray-300">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {newPassword && newPassword.length < 6 && (
                  <p className="text-amber-400 text-xs mt-1">⚠️ Kam se kam 6 characters chahiye</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Confirm Password</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Password dobara dalo"
                    className="w-full bg-gray-900/60 border border-gray-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">❌ Passwords match nahi kar rahe</p>
                )}
                {confirmPassword && newPassword === confirmPassword && confirmPassword.length >= 6 && (
                  <p className="text-green-400 text-xs mt-1">✅ Perfect match!</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all disabled:opacity-60 mt-2"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Reset ho raha hai...</>
                ) : (
                  <><Lock className="w-4 h-4" /> Password Reset Karo</>
                )}
              </button>
            </form>
          </>
        )}

        {/* ── STEP 4: Done ── */}
        {step === "done" && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Password Reset Ho Gaya! 🎉</h2>
            <p className="text-gray-400 text-sm mb-6">
              Aapka password successfully change ho gaya.{" "}
              <span className="text-violet-300 font-medium">Ab naye password se login karo.</span>
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 transition-all"
            >
              <ArrowRight className="w-4 h-4" /> Login Karo
            </Link>
          </div>
        )}

        {/* Back to login */}
        {step !== "done" && (
          <div className="mt-6 text-center text-xs text-gray-500">
            Password yaad aa gaya?{" "}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium underline">
              Login karo
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

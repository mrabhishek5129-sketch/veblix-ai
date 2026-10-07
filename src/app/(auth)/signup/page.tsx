"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  Phone,
  User,
  AlertCircle,
  Loader2,
  Zap,
  Eye,
  EyeOff,
} from "lucide-react";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectUrl = searchParams.get("redirect") || "/dashboard";
  const initialPrompt = searchParams.get("prompt") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Call Register API
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, mobile: mobile || undefined, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // 2. Automatically log in after registration
      const signInRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInRes?.error) {
        setError("Account created, but sign-in failed. Please login manually.");
        setLoading(false);
        router.push("/login");
      } else {
        const dest = initialPrompt
          ? `/dashboard?prompt=${encodeURIComponent(initialPrompt)}`
          : redirectUrl;
        router.push(dest);
        router.refresh();
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl glass-panel border border-gray-800 shadow-2xl">
      <div className="text-center mb-6">
        {/* Welcome Bonus Pill */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
          <Zap className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
          <span>🎁 Claim 100 Free Credits</span>
        </div>

        <h1 className="text-2xl font-bold text-white">Create Your Account</h1>
        <p className="text-sm text-gray-400 mt-1">
          Start generating and editing full-stack websites in minutes
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            Full Name
          </label>
          <div className="relative flex items-center">
            <User className="w-4 h-4 text-gray-500 absolute left-3 pointer-events-none" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Mercer"
              className="w-full bg-gray-900/60 border border-gray-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            Email Address
          </label>
          <div className="relative flex items-center">
            <Mail className="w-4 h-4 text-gray-500 absolute left-3 pointer-events-none" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-gray-900/60 border border-gray-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            Mobile Number <span className="text-gray-500">(optional — password reset ke liye)</span>
          </label>
          <div className="relative flex items-center">
            <Phone className="w-4 h-4 text-gray-500 absolute left-3 pointer-events-none" />
            <span className="absolute left-10 text-gray-400 text-sm border-r border-gray-700 pr-2">+91</span>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="9876543210"
              maxLength={10}
              className="w-full bg-gray-900/60 border border-gray-700/80 rounded-xl pl-20 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            Password
          </label>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-gray-500 absolute left-3 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full bg-gray-900/60 border border-gray-700/80 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-gray-400 hover:text-white transition-colors p-1"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm flex items-center justify-center space-x-2 shadow-lg shadow-purple-600/30 transition-all disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Sign Up Free</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-gray-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-purple-400 hover:text-purple-300 font-medium underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-[#090a0f] relative overflow-hidden py-12">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-purple-600/15 blur-[140px] -z-10 rounded-full pointer-events-none" />

      {/* Brand Header */}
      <Link href="/" className="flex items-center space-x-3 mb-8 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-xl text-white tracking-tight">
          AI Website Builder
        </span>
      </Link>

      <Suspense
        fallback={
          <div className="w-full max-w-md p-8 rounded-2xl glass-panel border border-gray-800 text-center text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-purple-500" />
            <p className="mt-2 text-xs">Loading...</p>
          </div>
        }
      >
        <SignupForm />
      </Suspense>
    </div>
  );
}

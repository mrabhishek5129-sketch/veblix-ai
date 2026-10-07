"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New password aur confirm password match nahi kar rahe!");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password kam se kam 6 characters ka hona chahiye.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password aur current password same nahi ho sakte.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Kuch galat ho gaya. Dobara try karo.");
      } else {
        setSuccess("✅ Password successfully change ho gaya!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-6">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">⚙️ Settings</h1>
          <p className="text-gray-400 mt-1">Apna account manage karo</p>
        </div>

        {/* Profile Info Card */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-6 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>👤</span> Profile Info
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Name</span>
              <span className="text-white font-medium">{session?.user?.name || "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Email</span>
              <span className="text-white font-medium">{session?.user?.email || "—"}</span>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
            <span>🔒</span> Password Change Karo
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Apna current password dalo, phir naya password set karo.
          </p>

          <form onSubmit={handleChangePassword} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Current Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="Purana password dalo"
                  className="w-full bg-gray-900 border border-gray-600 text-white rounded-xl px-4 pr-11 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 text-gray-400 hover:text-white transition-colors p-1"
                  title={showCurrent ? "Hide password" : "Show password"}
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                New Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Naya password dalo (min. 6 characters)"
                  className="w-full bg-gray-900 border border-gray-600 text-white rounded-xl px-4 pr-11 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 text-gray-400 hover:text-white transition-colors p-1"
                  title={showNew ? "Hide password" : "Show password"}
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {newPassword && newPassword.length < 6 && (
                <p className="text-amber-400 text-xs mt-1">⚠️ Kam se kam 6 characters chahiye</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Naya password dobara dalo"
                  className="w-full bg-gray-900 border border-gray-600 text-white rounded-xl px-4 pr-11 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 text-gray-400 hover:text-white transition-colors p-1"
                  title={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-red-400 text-xs mt-1">❌ Passwords match nahi kar rahe</p>
              )}
              {confirmPassword && newPassword === confirmPassword && confirmPassword.length >= 6 && (
                <p className="text-green-400 text-xs mt-1">✅ Passwords match kar rahe hain</p>
              )}
            </div>

            {/* Error / Success */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm flex items-start gap-2">
                <span>❌</span>
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 text-green-400 text-sm flex items-start gap-2">
                <span>✅</span>
                <span>{success}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Password change ho raha hai...
                </span>
              ) : (
                "🔐 Password Change Karo"
              )}
            </button>
          </form>
        </div>

        {/* Quick Links */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mt-6 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
            <span>🔗</span> Quick Links
          </h2>
          <p className="text-gray-500 text-sm mb-4">Other account options</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/billing"
              className="text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded-lg transition-colors"
            >
              💳 Billing & Credits
            </Link>
            <Link
              href="/dashboard"
              className="text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded-lg transition-colors"
            >
              🏠 Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

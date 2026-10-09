"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Sparkles, LayoutDashboard, LogOut, ArrowRight, Zap, Compass, Settings } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-gray-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">

          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-blue-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm md:text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-purple-300">
                Veblix AI
              </span>
              <span className="hidden md:block text-[10px] text-purple-400 font-medium tracking-wider uppercase -mt-1">
                Prompt to App
              </span>
            </div>
          </Link>

          {/* Center Navigation — desktop only */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
            <Link href="/explore" className="hover:text-white transition-colors flex items-center space-x-1.5">
              <Compass className="w-4 h-4 text-purple-400" />
              <span>Explore</span>
            </Link>
            <a href="/#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="/#features" className="hover:text-white transition-colors">Features</a>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {session ? (
              <div className="flex items-center space-x-2 md:space-x-3">
                {/* Install App button */}
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("trigger-pwa-install"))}
                  className="flex items-center space-x-1 px-2 md:px-2.5 py-1 bg-gradient-to-r from-violet-600/30 to-indigo-600/30 hover:from-violet-600/40 hover:to-indigo-600/40 border border-violet-500/40 rounded-full text-violet-200 text-[11px] md:text-xs font-semibold transition-all hover:scale-105"
                  title="Mobile / PC me App Install Karein"
                >
                  <span>📲</span>
                  <span>Install App</span>
                </button>

                {/* Credits pill */}
                <Link
                  href="/dashboard/billing"
                  className="flex items-center space-x-1 md:space-x-1.5 px-2 md:px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300 text-[11px] md:text-xs font-semibold hover:bg-purple-500/20 transition-colors"
                  title="Credits & Billing"
                >
                  <Zap className="w-3 h-3 md:w-3.5 md:h-3.5 text-purple-400 fill-purple-400" />
                  <span>{(session.user as any)?.credits ?? 0}</span>
                </Link>

                {/* Dashboard — hidden on mobile (bottom nav handles it) */}
                <Link
                  href="/dashboard"
                  className="hidden md:flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                {/* Settings — desktop only */}
                <Link
                  href="/dashboard/settings"
                  className="hidden md:flex p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
                  title="Settings"
                >
                  <Settings className="w-4 h-4" />
                </Link>

                {/* Sign Out */}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-1.5 md:p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-gray-800 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 md:space-x-3">
                <Link
                  href="/login"
                  className="px-3 md:px-4 py-1.5 md:py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg shadow-md transition-all"
                >
                  <span>Start Free</span>
                  <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

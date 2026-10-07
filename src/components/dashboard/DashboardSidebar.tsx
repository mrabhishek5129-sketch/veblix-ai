"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Clock,
  BookImage,
  Image,
  FolderOpen,
  ExternalLink,
  Zap,
  Settings,
  LogOut,
  ChevronRight,
  Plus,
  History,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Recent",
    href: "/dashboard/recent",
    icon: Clock,
    badge: "New",
  },
  {
    label: "History",
    href: "/dashboard/history",
    icon: History,
  },
  {
    label: "Library",
    href: "/dashboard/library",
    icon: BookImage,
  },
  {
    label: "Images",
    href: "/dashboard/images",
    icon: Image,
  },
  {
    label: "Project Files",
    href: "/dashboard/files",
    icon: FolderOpen,
  },
];

const bottomItems = [
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const handleNewWindow = () => {
    window.open("/dashboard", "_blank");
  };

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col bg-gray-950 border-r border-gray-800/80 min-h-screen">
      {/* New Project Button */}
      <div className="p-4 border-b border-gray-800/60">
        <Link
          href="/dashboard"
          onClick={(e) => {
            // Trigger modal open via URL param
          }}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-semibold transition-all shadow-lg shadow-purple-700/20 hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          New Website
        </Link>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 px-3 pt-2 pb-1">
          Main
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                active
                  ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/70"
              }`}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 ${active ? "text-violet-400" : "text-gray-500 group-hover:text-gray-300"}`}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-bold bg-violet-600 text-white px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              {active && <ChevronRight className="w-3.5 h-3.5 text-violet-400" />}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="pt-4 pb-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 px-3 pb-1">
            Tools
          </p>
        </div>

        {/* Install App */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("trigger-pwa-install"))}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-violet-300 hover:text-white bg-violet-600/10 hover:bg-violet-600/20 border border-violet-500/20 transition-all w-full group"
        >
          <span className="text-base">📲</span>
          <span className="flex-1 text-left font-semibold">Install App</span>
          <span className="text-[10px] bg-violet-600 text-white px-1.5 py-0.5 rounded-full font-bold">App</span>
        </button>

        {/* New Window */}
        <button
          onClick={handleNewWindow}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800/70 transition-all w-full group"
        >
          <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-gray-300 flex-shrink-0" />
          <span className="flex-1 text-left">New Window</span>
          <span className="text-[10px] text-gray-600">↗</span>
        </button>

        {/* Billing */}
        <Link
          href="/dashboard/billing"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
            isActive("/dashboard/billing")
              ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
              : "text-gray-400 hover:text-white hover:bg-gray-800/70"
          }`}
        >
          <Zap className="w-4 h-4 text-gray-500 group-hover:text-gray-300 flex-shrink-0" />
          <span className="flex-1">Credits & Billing</span>
        </Link>
      </nav>

      {/* Upgrade Banner */}
      <div className="p-3">
        <div className="rounded-xl bg-gradient-to-br from-violet-900/40 to-purple-900/30 border border-violet-700/40 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-bold text-white">Upgrade Plan</span>
          </div>
          <p className="text-xs text-gray-400 mb-3">
            Unlimited websites, priority AI, custom domains
          </p>
          <Link
            href="/dashboard/billing"
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold transition-all"
          >
            Upgrade Now ✨
          </Link>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="p-3 border-t border-gray-800/60 space-y-0.5">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                active
                  ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/70"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0 text-gray-500 group-hover:text-gray-300" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full group"
        >
          <LogOut className="w-4 h-4 flex-shrink-0 text-gray-500 group-hover:text-red-400" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  Plus,
  Clock,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Recent", href: "/dashboard/recent", icon: Clock },
  { label: "New", href: "/dashboard", icon: Plus, isAction: true },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-xl border-t border-gray-800/80" />

      <div className="relative flex items-center justify-around px-2 py-2 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);

          if (item.isAction) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center -mt-5"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-700/40 border-4 border-gray-950">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-[10px] text-gray-500 mt-1 font-medium">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all"
            >
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
                  active
                    ? "bg-violet-600/20 text-violet-400"
                    : "text-gray-500"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  active ? "text-violet-400" : "text-gray-600"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

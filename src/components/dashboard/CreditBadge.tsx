"use client";

import { useSession } from "next-auth/react";
import { Zap } from "lucide-react";

export default function CreditBadge() {
  const { data: session } = useSession();
  const credits = (session?.user as any)?.credits ?? 100;

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs font-semibold shadow-inner">
        <Zap className="w-4 h-4 text-purple-400 fill-purple-400 animate-pulse" />
        <span>{credits} Credits Available</span>
      </div>
    </div>
  );
}

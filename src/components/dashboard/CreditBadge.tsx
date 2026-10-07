"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Zap, PlusCircle, Loader2, Check } from "lucide-react";

export default function CreditBadge() {
  const { data: session, update: updateSession } = useSession();
  const [loading, setLoading] = useState(false);
  const [refilled, setRefilled] = useState(false);
  const credits = (session?.user as any)?.credits ?? 5000;

  const handleQuickRefill = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: "demo-refill",
          amountCredits: 1000,
          priceInr: "₹0",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (updateSession) updateSession({ credits: data.credits });
        setRefilled(true);
        setTimeout(() => setRefilled(false), 2500);
      }
    } catch (err) {
      console.error("Refill error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs font-semibold shadow-inner">
        <Zap className="w-4 h-4 text-purple-400 fill-purple-400 animate-pulse" />
        <span>{credits} Credits Available</span>
      </div>

      <button
        onClick={handleQuickRefill}
        disabled={loading}
        className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-purple-600 text-gray-300 hover:text-white text-xs font-medium border border-gray-700 transition-colors disabled:opacity-50"
        title="Claim +1,000 Free Credits Instantly"
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : refilled ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 text-[11px] font-bold">+1000!</span>
          </>
        ) : (
          <>
            <PlusCircle className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[11px] font-semibold">+1,000 Free</span>
          </>
        )}
      </button>
    </div>
  );
}

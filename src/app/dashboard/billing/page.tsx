"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  CreditCard,
  History,
  ShieldCheck,
  Loader2,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  createdAt: string;
}

export default function BillingPage() {
  const { data: session, update: updateSession } = useSession();
  const [credits, setCredits] = useState<number>((session?.user as any)?.credits ?? 100);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [purchasingPlan, setPurchasingPlan] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  const creditPackages = [
    {
      id: "starter",
      name: "Starter Pack",
      price: "₹199",
      credits: 500,
      generations: "~25 Full Websites",
      edits: "100 AI Chat Edits",
      popular: false,
    },
    {
      id: "pro",
      name: "Pro Builder",
      price: "₹499",
      credits: 1500,
      generations: "~75 Full Websites",
      edits: "300 AI Chat Edits",
      popular: true,
    },
    {
      id: "studio",
      name: "Power Studio",
      price: "₹999",
      credits: 5000,
      generations: "~250 Full Websites",
      edits: "1,000 AI Chat Edits",
      popular: false,
    },
  ];

  const handlePurchase = async (pkg: typeof creditPackages[0]) => {
    setPurchasingPlan(pkg.id);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: pkg.id,
          amountCredits: pkg.credits,
          priceInr: pkg.price,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCredits(data.credits);
        if (updateSession) updateSession({ credits: data.credits });
        setSuccessMsg(`🎉 Successfully added +${pkg.credits} credits to your account!`);
        setTimeout(() => setSuccessMsg(""), 4000);
      }
    } catch (err) {
      console.error("Purchase error:", err);
    } finally {
      setPurchasingPlan(null);
    }
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Credits & Subscription Wallet
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Transparent pay-as-you-go metered AI credits for generation and edits
          </p>
        </div>

        <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-purple-950/50 border border-purple-500/40 shadow-inner">
          <Zap className="w-5 h-5 text-purple-400 fill-purple-400 animate-pulse" />
          <div className="text-left">
            <p className="text-[10px] text-purple-300 font-medium uppercase tracking-wider">Current Balance</p>
            <p className="text-base font-extrabold text-white">{credits} Credits</p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Credit Usage Breakdown Card */}
      <div className="p-6 rounded-2xl glass-panel border border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 text-xl font-bold">
            ⚡
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Full Website Generation</h4>
            <p className="text-xs text-purple-300 font-semibold mt-0.5">20 Credits / generation</p>
            <p className="text-[11px] text-gray-400 mt-1">Synthesizes layout, components & scripts</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-xl font-bold">
            💬
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Conversational AI Edit</h4>
            <p className="text-xs text-indigo-300 font-semibold mt-0.5">5 Credits / edit prompt</p>
            <p className="text-[11px] text-gray-400 mt-1">Changes styling, adds sections & fixes</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xl font-bold">
            🚀
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Export & Deploy</h4>
            <p className="text-xs text-emerald-400 font-semibold mt-0.5">FREE / Unlimited</p>
            <p className="text-[11px] text-gray-400 mt-1">ZIP download & Edge deployment included</p>
          </div>
        </div>
      </div>

      {/* Credit Packs */}
      <div>
        <div className="flex items-center space-x-2 mb-6">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h2 className="text-lg font-bold text-white">Top-Up Credit Packs</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {creditPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`p-6 rounded-3xl glass-panel flex flex-col justify-between relative transition-all ${
                pkg.popular
                  ? "border-2 border-purple-500 shadow-2xl glow-purple scale-105 bg-[#0f121d]"
                  : "border border-gray-800 bg-[#090c14] hover:border-gray-700"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white">
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-extrabold text-white">{pkg.price}</span>
                  <span className="ml-1 text-xs text-gray-400">one-time</span>
                </div>

                <div className="mt-3 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold">
                  <Zap className="w-3.5 h-3.5 fill-purple-400" />
                  <span>+{pkg.credits} Credits</span>
                </div>

                <ul className="mt-6 space-y-2.5 text-xs text-gray-300">
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" />
                    <span>{pkg.generations}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" />
                    <span>{pkg.edits}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" />
                    <span>Instant activation, zero expiry</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handlePurchase(pkg)}
                disabled={purchasingPlan === pkg.id}
                className={`mt-8 w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md ${
                  pkg.popular
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/30"
                    : "bg-gray-800 hover:bg-gray-700 text-white"
                } disabled:opacity-60`}
              >
                {purchasingPlan === pkg.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Top-Up {pkg.credits} Credits</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

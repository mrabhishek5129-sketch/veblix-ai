"use client";

import Link from "next/link";
import { BookImage, Zap, Dumbbell, Utensils, Briefcase, Layers, Coffee, HeartPulse } from "lucide-react";

const templates = [
  {
    title: "IronPulse Fitness Club",
    desc: "Dark-themed gym with memberships, class timetables & trainer profiles",
    icon: <Dumbbell className="w-6 h-6" />,
    color: "from-orange-600 to-red-600",
    category: "Fitness",
    prompt: "Create a modern high-energy Gym website with dark theme, membership tier pricing, class schedule grid, trainer showcase, and booking modal.",
  },
  {
    title: "Bella Vista Bistro",
    desc: "Luxury restaurant with food menu, chef specials & reservation form",
    icon: <Utensils className="w-6 h-6" />,
    color: "from-amber-500 to-orange-500",
    category: "Restaurant",
    prompt: "Create a luxury Restaurant website with interactive food & drink menu tabs, chef specials carousel, and table reservation form.",
  },
  {
    title: "Data Analyst Portfolio",
    desc: "Tech portfolio with project case studies, skills matrix & contact",
    icon: <Briefcase className="w-6 h-6" />,
    color: "from-blue-600 to-cyan-600",
    category: "Portfolio",
    prompt: "Create a sleek portfolio website for a Senior Data Analyst with interactive project cards, skills radar, resume download button, and contact form.",
  },
  {
    title: "CloudScale SaaS Landing",
    desc: "High-converting SaaS landing with animated hero & pricing calculator",
    icon: <Layers className="w-6 h-6" />,
    color: "from-emerald-500 to-teal-600",
    category: "SaaS",
    prompt: "Create a high-converting SaaS landing page with animated hero, interactive product features, pricing calculator, and accordion FAQ.",
  },
  {
    title: "Brew & Roast Coffee",
    desc: "Cozy coffee shop with menu, story & online ordering",
    icon: <Coffee className="w-6 h-6" />,
    color: "from-yellow-700 to-amber-800",
    category: "Café",
    prompt: "Create a warm, cozy coffee shop website with seasonal menu, origin story section, barista profiles, and click-to-order feature.",
  },
  {
    title: "MediCare Clinic",
    desc: "Professional clinic site with services, doctors & appointment booking",
    icon: <HeartPulse className="w-6 h-6" />,
    color: "from-pink-500 to-rose-600",
    category: "Healthcare",
    prompt: "Create a professional medical clinic website with services list, doctor profiles, patient testimonials, and an appointment booking form.",
  },
];

export default function LibraryPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookImage className="w-6 h-6 text-violet-400" /> Template Library
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Ready-made templates — ek click mein apna website banao
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {["All", "Fitness", "Restaurant", "Portfolio", "SaaS", "Café", "Healthcare"].map((cat) => (
          <button
            key={cat}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              cat === "All"
                ? "bg-violet-600 text-white border-violet-500"
                : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {templates.map((t, i) => (
          <div
            key={i}
            className="rounded-2xl bg-gray-800/50 border border-gray-700/60 hover:border-violet-500/50 overflow-hidden group transition-all hover:shadow-xl hover:shadow-violet-900/20"
          >
            {/* Card Top */}
            <div className={`h-28 bg-gradient-to-br ${t.color} flex items-center justify-center relative overflow-hidden`}>
              <div className="text-white/30 scale-[3] transform opacity-60">{t.icon}</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                  {t.icon}
                </div>
              </div>
              <span className="absolute top-3 right-3 text-[10px] font-bold bg-black/30 text-white border border-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                {t.category}
              </span>
            </div>

            {/* Card Body */}
            <div className="p-4">
              <h3 className="font-semibold text-white text-sm mb-1">{t.title}</h3>
              <p className="text-gray-400 text-xs mb-4 line-clamp-2">{t.desc}</p>
              <Link
                href={`/dashboard?prompt=${encodeURIComponent(t.prompt)}`}
                className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-violet-600/20 hover:bg-violet-600 border border-violet-500/40 hover:border-violet-500 text-violet-300 hover:text-white text-xs font-semibold transition-all"
              >
                <Zap className="w-3.5 h-3.5" />
                Use This Template
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

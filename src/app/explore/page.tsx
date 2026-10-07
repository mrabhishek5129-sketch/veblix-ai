"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Sparkles,
  ArrowRight,
  Dumbbell,
  Utensils,
  Briefcase,
  Layers,
  Coffee,
  HeartPulse,
  Wand2,
  Loader2,
  Eye,
} from "lucide-react";

export default function ExplorePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [cloningId, setCloningId] = useState<string | null>(null);

  const templates = [
    {
      id: "gym",
      title: "IronPulse Fitness Club",
      category: "Fitness & Gym",
      desc: "High-intensity fitness platform with membership tiers, coach schedules & booking.",
      icon: <Dumbbell className="w-5 h-5 text-amber-400" />,
      color: "from-amber-500/20 to-orange-500/10 border-amber-500/30",
      prompt: "Create a modern high-energy Gym website with dark theme, membership tier pricing, class schedule grid, trainer showcase, and booking modal.",
    },
    {
      id: "restaurant",
      title: "Bella Vista Gourmet Bistro",
      category: "Food & Restaurant",
      desc: "Fine dining restaurant with interactive menu categories, chef signatures & table reservation.",
      icon: <Utensils className="w-5 h-5 text-rose-400" />,
      color: "from-rose-500/20 to-red-500/10 border-rose-500/30",
      prompt: "Create a luxury Restaurant website with interactive food & drink menu tabs, chef specials carousel, and table reservation form.",
    },
    {
      id: "portfolio",
      title: "Alex Mercer Data Portfolio",
      category: "Portfolio & Resume",
      desc: "Senior Data Scientist portfolio showcasing machine learning case studies and skill matrix.",
      icon: <Briefcase className="w-5 h-5 text-cyan-400" />,
      color: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30",
      prompt: "Create a sleek portfolio website for a Senior Data Analyst with interactive project cards, skills radar, resume download button, and contact form.",
    },
    {
      id: "saas",
      title: "CloudScale SaaS Platform",
      category: "Software & SaaS",
      desc: "Next-gen developer tools landing page with feature cards, interactive pricing & FAQ.",
      icon: <Layers className="w-5 h-5 text-indigo-400" />,
      color: "from-indigo-500/20 to-purple-500/10 border-indigo-500/30",
      prompt: "Create a high-converting SaaS landing page with animated hero, interactive product features, pricing calculator, and accordion FAQ.",
    },
    {
      id: "coffee",
      title: "RoastCraft Coffee Artisans",
      category: "E-Commerce / Cafe",
      desc: "Artisan specialty coffee roastery with subscription boxes, roast profiles & store locator.",
      icon: <Coffee className="w-5 h-5 text-amber-300" />,
      color: "from-amber-600/20 to-yellow-500/10 border-amber-600/30",
      prompt: "Create an artisanal coffee shop website with dark aesthetic, signature roast products, bean subscription box picker, and cafe visit booking.",
    },
    {
      id: "clinic",
      title: "Horizon Wellness & Medical Clinic",
      category: "Healthcare & Clinic",
      desc: "Modern medical clinic with specialist doctor directory, treatment services & online appointment.",
      icon: <HeartPulse className="w-5 h-5 text-emerald-400" />,
      color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
      prompt: "Create a modern healthcare and doctor clinic website with department services, doctor cards, emergency contact banner, and appointment booking form.",
    },
  ];

  const handleClone = async (tpl: typeof templates[0]) => {
    if (!session) {
      router.push(`/signup?redirect=explore`);
      return;
    }

    setCloningId(tpl.id);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: tpl.title,
          description: tpl.prompt,
        }),
      });

      const data = await res.json();
      if (res.ok && data.project) {
        router.push(`/builder/${data.project.id}?initialPrompt=${encodeURIComponent(tpl.prompt)}`);
      }
    } catch (err) {
      console.error("Clone error:", err);
    } finally {
      setCloningId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090a0f] text-gray-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Template Showcase</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Explore Trending Websites
          </h1>
          <p className="mt-4 text-base text-gray-400">
            Pick any pre-architected full-stack template and customize it in seconds using conversational AI chat prompts.
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className={`p-6 rounded-3xl glass-panel border bg-gradient-to-b ${tpl.color} hover:scale-[1.02] transition-all flex flex-col justify-between group shadow-xl`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-900/80 border border-white/10 flex items-center justify-center">
                    {tpl.icon}
                  </div>
                  <span className="text-[11px] font-bold text-gray-300 px-2.5 py-0.5 rounded-full bg-black/40 border border-white/10">
                    {tpl.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                  {tpl.title}
                </h3>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  {tpl.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-purple-300 font-semibold">
                  ⚡ 20 Credits
                </span>

                <button
                  onClick={() => handleClone(tpl)}
                  disabled={cloningId === tpl.id}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition-all disabled:opacity-60"
                >
                  {cloningId === tpl.id ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Cloning...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>Clone & Edit with AI</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

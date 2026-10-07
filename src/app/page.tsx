"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Sparkles,
  ArrowRight,
  Code2,
  Layers,
  History,
  Download,
  Zap,
  CheckCircle2,
  Play,
  Cpu,
  ShieldCheck,
  Bot,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState("");

  const samplePrompts = [
    "🏋️ Gym Management with Membership & Class Booking",
    "🍕 Italian Restaurant with Menu & Table Reservation",
    "📊 Data Analyst SaaS Portfolio with Interactive Charts",
    "🛒 Minimalist E-Commerce Store with Stripe Cart",
  ];

  const handleStartBuilding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    if (session) {
      router.push(`/dashboard?prompt=${encodeURIComponent(prompt)}`);
    } else {
      router.push(`/signup?redirect=dashboard&prompt=${encodeURIComponent(prompt)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090a0f] text-gray-100 selection:bg-purple-600 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 overflow-hidden">
        {/* Background glow meshes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/20 to-blue-600/10 blur-[130px] -z-10 rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-purple-500/10 blur-[100px] -z-10 rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-blue-500/10 blur-[100px] -z-10 rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-8 shadow-inner animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Next-Gen AI Full-Stack App Builder</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Describe your idea.{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400">
              AI builds the website.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Turn plain English into full-stack web applications with interactive UI,
            database schema, live sandboxed preview, and conversational AI chat editing.
          </p>

          {/* Interactive Prompt Input Box */}
          <div className="mt-10 max-w-3xl mx-auto">
            <form
              onSubmit={handleStartBuilding}
              className="relative p-2 rounded-2xl glass-panel border border-gray-700/80 shadow-2xl glow-purple transition-all focus-within:border-purple-500/80"
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 flex items-center px-4 py-2">
                  <Bot className="w-6 h-6 text-purple-400 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. Create a modern gym website with membership plans and booking..."
                    className="w-full bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none text-base"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium shadow-lg shadow-purple-600/30 hover:scale-[1.02] transition-all flex-shrink-0"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Website</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Prompt Chips */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-gray-500 font-medium mr-1">Try:</span>
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(p)}
                  className="px-3 py-1.5 rounded-lg bg-gray-900/60 hover:bg-gray-800 border border-gray-800 text-gray-400 hover:text-purple-300 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Social Proof / Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-gray-800/60">
            <div className="p-4 rounded-xl glass-card text-center">
              <p className="text-2xl font-bold text-white">100 Free</p>
              <p className="text-xs text-gray-400 mt-1">Credits on signup</p>
            </div>
            <div className="p-4 rounded-xl glass-card text-center">
              <p className="text-2xl font-bold text-purple-400">100%</p>
              <p className="text-xs text-gray-400 mt-1">Sandboxed Live Preview</p>
            </div>
            <div className="p-4 rounded-xl glass-card text-center">
              <p className="text-2xl font-bold text-indigo-400">Natural Chat</p>
              <p className="text-xs text-gray-400 mt-1">Refine with AI prompts</p>
            </div>
            <div className="p-4 rounded-xl glass-card text-center">
              <p className="text-2xl font-bold text-blue-400">1-Click</p>
              <p className="text-xs text-gray-400 mt-1">ZIP Code Export</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-[#07080c] border-t border-gray-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-purple-400 uppercase tracking-widest">
              The Workflow
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Describe → Generate → Refine → Ship
            </p>
            <p className="mt-4 text-gray-400 text-sm">
              From zero to a deployed, interactive web application in four intuitive steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl glass-panel border border-gray-800 hover:border-purple-500/40 transition-all flex flex-col relative group">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-lg mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">1. Describe</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Type your website idea in natural language—specify pages, branding, forms, or features.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl glass-panel border border-gray-800 hover:border-indigo-500/40 transition-all flex flex-col relative group">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-lg mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">2. AI Generates</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Our LLM engine generates modern React code, Tailwind styling, components, and schema.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl glass-panel border border-gray-800 hover:border-blue-500/40 transition-all flex flex-col relative group">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-lg mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">3. Chat Refine</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Ask AI to adjust colors, add new tabs, update content, or create forms through interactive chat.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl glass-panel border border-gray-800 hover:border-emerald-500/40 transition-all flex flex-col relative group">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">4. Ship & Export</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Download the complete source code as a ZIP file or deploy directly to production.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-purple-400 uppercase tracking-widest">
              Core Capabilities
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Engineered for speed, control, and developer quality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl glass-panel border border-gray-800/80 hover:border-purple-500/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Live Interactive Sandbox</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                View your generated application live in real-time. Toggle between Desktop, Tablet, and Mobile views instantly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl glass-panel border border-gray-800/80 hover:border-indigo-500/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Conversational AI Editor</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                No need to touch complicated code. Just say “make the navbar dark purple” or “add a contact form” and watch it update.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl glass-panel border border-gray-800/80 hover:border-blue-500/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6">
                <History className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Version History & Rollback</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Every prompt and modification creates a snapshot. Made a mistake? Roll back to any previous version with a single click.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-2xl glass-panel border border-gray-800/80 hover:border-pink-500/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-6">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">1-Click ZIP Export</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Export standard React and Tailwind code packaged with package.json. Run `npm install` locally on your machine immediately.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-2xl glass-panel border border-gray-800/80 hover:border-amber-500/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Usage-Based Credit System</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Transparent credit metering for generations and edits. Start with 100 free credits and top up whenever you need more.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-2xl glass-panel border border-gray-800/80 hover:border-emerald-500/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Clean & Type-Safe Code</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Production-ready code structure with modular components, responsive layouts, and zero bloat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Credits Section */}
      <section id="pricing" className="py-24 bg-[#07080c] border-t border-gray-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-purple-400 uppercase tracking-widest">
              Simple Pricing
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Pay as you build with flexible credits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="p-8 rounded-2xl glass-panel border border-gray-800 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Free Starter</h3>
                <p className="text-xs text-gray-400 mt-1">Perfect for trying out the AI builder</p>
                <div className="mt-6 flex items-baseline text-white">
                  <span className="text-4xl font-extrabold tracking-tight">₹0</span>
                  <span className="ml-1 text-gray-400 text-sm">/ forever</span>
                </div>
                <div className="mt-2 text-xs text-purple-400 font-semibold">100 Credits Included</div>

                <ul className="mt-6 space-y-3 text-xs text-gray-300">
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-purple-400 mr-2" /> Up to 5 full websites</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-purple-400 mr-2" /> Live sandboxed preview</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-purple-400 mr-2" /> Conversational AI chat edits</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-purple-400 mr-2" /> ZIP Code export</li>
                </ul>
              </div>

              <Link
                href="/signup"
                className="mt-8 w-full py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-center text-sm font-medium transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Tier (Featured) */}
            <div className="p-8 rounded-2xl glass-panel border-2 border-purple-500 relative flex flex-col justify-between shadow-2xl glow-purple scale-105">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-[11px] font-bold uppercase tracking-wider text-white">
                Most Popular
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Pro Builder</h3>
                <p className="text-xs text-gray-400 mt-1">For freelancers and active builders</p>
                <div className="mt-6 flex items-baseline text-white">
                  <span className="text-4xl font-extrabold tracking-tight">₹499</span>
                  <span className="ml-1 text-gray-400 text-sm">/ one-time</span>
                </div>
                <div className="mt-2 text-xs text-purple-400 font-semibold">1,500 Credits</div>

                <ul className="mt-6 space-y-3 text-xs text-gray-300">
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-purple-400 mr-2" /> ~75 Full Website generations</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-purple-400 mr-2" /> Unlimited conversational edits</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-purple-400 mr-2" /> Priority AI response speed</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-purple-400 mr-2" /> Full version history & rollback</li>
                </ul>
              </div>

              <Link
                href="/signup"
                className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-center text-sm font-semibold transition-all shadow-lg shadow-purple-600/30"
              >
                Upgrade to Pro
              </Link>
            </div>

            {/* Business Tier */}
            <div className="p-8 rounded-2xl glass-panel border border-gray-800 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Power Studio</h3>
                <p className="text-xs text-gray-400 mt-1">For power users and teams</p>
                <div className="mt-6 flex items-baseline text-white">
                  <span className="text-4xl font-extrabold tracking-tight">₹999</span>
                  <span className="ml-1 text-gray-400 text-sm">/ one-time</span>
                </div>
                <div className="mt-2 text-xs text-purple-400 font-semibold">5,000 Credits</div>

                <ul className="mt-6 space-y-3 text-xs text-gray-300">
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-purple-400 mr-2" /> ~250 Website generations</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-purple-400 mr-2" /> Fast parallel generation</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-purple-400 mr-2" /> Premium templates & components</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-purple-400 mr-2" /> Direct Vercel / Netlify ship</li>
                </ul>
              </div>

              <Link
                href="/signup"
                className="mt-8 w-full py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-center text-sm font-medium transition-colors"
              >
                Get Power Studio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Section */}
      <section className="py-20 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Ready to build your next web app with AI?
          </h2>
          <p className="mt-4 text-gray-400 text-base max-w-xl mx-auto">
            Get 100 free credits instantly. No credit card required.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/signup"
              className="flex items-center space-x-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-lg shadow-xl shadow-purple-600/30 transition-all hover:scale-105"
            >
              <Sparkles className="w-5 h-5" />
              <span>Start Building Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

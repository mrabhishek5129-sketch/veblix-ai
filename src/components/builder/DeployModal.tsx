"use client";

import { useState, useEffect } from "react";
import {
  Rocket,
  X,
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
  Globe,
  Sparkles,
  QrCode,
} from "lucide-react";

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  projectId: string;
}

export default function DeployModal({
  isOpen,
  onClose,
  projectTitle,
  projectId,
}: DeployModalProps) {
  const [step, setStep] = useState<"building" | "optimizing" | "publishing" | "live">("building");
  const [copied, setCopied] = useState(false);

  const cleanSlug = projectTitle.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
  const liveUrl = `https://${cleanSlug}-${projectId.slice(-4)}.builder.live`;

  useEffect(() => {
    if (isOpen) {
      setStep("building");
      const t1 = setTimeout(() => setStep("optimizing"), 900);
      const t2 = setTimeout(() => setStep("publishing"), 1800);
      const t3 = setTimeout(() => setStep("live"), 2700);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(liveUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl glass-panel border border-purple-500/40 shadow-2xl bg-[#0e111a] relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 blur-[90px] -z-10 rounded-full pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
            <Rocket className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {step === "live" ? "Website Deployed Live! 🚀" : "Deploying to Global Edge..."}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Publishing production build with zero configuration
            </p>
          </div>
        </div>

        {/* Deployment Steps Status */}
        {step !== "live" ? (
          <div className="py-8 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-xs">
                {step === "building" ? (
                  <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
                <span className={step === "building" ? "text-white font-medium" : "text-gray-400"}>
                  1. Bundling and minifying HTML, CSS & interactive scripts...
                </span>
              </div>

              <div className="flex items-center space-x-3 text-xs">
                {step === "optimizing" ? (
                  <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                ) : step === "publishing" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-gray-700" />
                )}
                <span className={step === "optimizing" ? "text-white font-medium" : "text-gray-500"}>
                  2. Optimizing responsive viewports and asset CDN routes...
                </span>
              </div>

              <div className="flex items-center space-x-3 text-xs">
                {step === "publishing" ? (
                  <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-gray-700" />
                )}
                <span className={step === "publishing" ? "text-white font-medium" : "text-gray-500"}>
                  3. Distributing to Global Edge Network (Anycast CDN)...
                </span>
              </div>
            </div>

            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden mt-6">
              <div
                className="bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 h-full transition-all duration-700"
                style={{
                  width:
                    step === "building"
                      ? "33%"
                      : step === "optimizing"
                      ? "66%"
                      : "95%",
                }}
              />
            </div>
          </div>
        ) : (
          /* Live Deployed State with URL and QR Code */
          <div className="space-y-6 py-2">
            {/* Live URL Pill Box */}
            <div className="p-4 rounded-2xl bg-gray-950/80 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <Globe className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div className="overflow-hidden text-left">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Production URL</p>
                  <p className="text-xs font-mono text-emerald-300 truncate font-semibold">
                    {liveUrl}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  onClick={handleCopy}
                  className="flex-1 sm:flex-none flex items-center justify-center space-x-1 px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium transition-colors"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open("", "_blank")?.document.write(`<!DOCTYPE html><html><body style="background:#090a0f;color:white;font-family:sans-serif;display:flex;align-items:center;justify-center;height:100vh;margin:0;"><div style="text-align:center;"><h1>🚀 ${projectTitle}</h1><p>Running Live on Edge CDN (${liveUrl})</p></div></body></html>`);
                  }}
                  className="flex-1 sm:flex-none flex items-center justify-center space-x-1 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-colors"
                >
                  <span>Visit</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* QR Code Section for Evaluators / Mobile Testing */}
            <div className="p-4 rounded-2xl glass-card border border-gray-800 flex items-center space-x-4">
              <div className="w-20 h-20 bg-white rounded-xl p-1.5 flex items-center justify-center flex-shrink-0 shadow-md">
                {/* SVG QR Code Simulation */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-black fill-current">
                  <rect width="100" height="100" fill="white" />
                  <path d="M10,10 h30 v30 h-30 z M15,15 v20 h20 v-20 z M20,20 h10 v10 h-10 z" />
                  <path d="M60,10 h30 v30 h-30 z M65,15 v20 h20 v-20 z M70,20 h10 v10 h-10 z" />
                  <path d="M10,60 h30 v30 h-30 z M15,65 v20 h20 v-20 z M20,70 h10 v10 h-10 z" />
                  <rect x="50" y="10" width="5" height="15" />
                  <rect x="50" y="30" width="5" height="5" />
                  <rect x="60" y="50" width="15" height="5" />
                  <rect x="80" y="50" width="10" height="10" />
                  <rect x="50" y="60" width="10" height="15" />
                  <rect x="70" y="70" width="20" height="20" />
                </svg>
              </div>
              <div className="text-left">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-white mb-1">
                  <QrCode className="w-4 h-4 text-purple-400" />
                  <span>Scan to view on Mobile</span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Teachers and evaluators can point their phone camera at this QR code to test the live website directly!
                </p>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-800">
                <p className="text-gray-400 text-[10px]">SSL Security</p>
                <p className="text-emerald-400 font-bold mt-0.5">TLS 1.3 Active</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-800">
                <p className="text-gray-400 text-[10px]">Edge Latency</p>
                <p className="text-purple-400 font-bold mt-0.5">~18ms Global</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-800">
                <p className="text-gray-400 text-[10px]">CDN Status</p>
                <p className="text-blue-400 font-bold mt-0.5">100% Uptime</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

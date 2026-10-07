"use client";

import { useEffect, useState } from "react";
import { Download, X, Smartphone, Check } from "lucide-react";

export default function PWARegister() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed / running in standalone mode
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone
    ) {
      setIsStandalone(true);
      return;
    }

    // Register Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("✅ SW registered:", reg.scope))
        .catch((err) => console.log("SW error:", err));
    }

    // PWA Install prompt listener (Android Chrome / Edge / Desktop)
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      // Auto show banner after 2 seconds if not installed
      setTimeout(() => setShowBanner(true), 2000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // If beforeinstallprompt hasn't fired after 3 seconds (e.g. iOS or HTTP), still show banner so user knows how to install!
    const timer = setTimeout(() => {
      setShowBanner(true);
    }, 3000);

    // Custom trigger event from Navbar or Sidebar buttons
    const triggerHandler = () => {
      handleInstallClick();
    };
    window.addEventListener("trigger-pwa-install", triggerHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("trigger-pwa-install", triggerHandler);
      clearTimeout(timer);
    };
  }, [installPrompt]);

  const handleInstallClick = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const result = await installPrompt.userChoice;
      if (result.outcome === "accepted") {
        setShowBanner(false);
        setInstallPrompt(null);
      }
    } else {
      // If native browser prompt is unavailable (e.g. iOS Safari or plain IP), show visual guide
      setShowGuide(true);
    }
  };

  if (isStandalone) return null; // Already running as installed app!

  return (
    <>
      {/* Floating Bottom Banner */}
      {showBanner && (
        <div className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-6 md:w-96 animate-slide-up">
          <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-purple-950 border border-purple-500/50 rounded-2xl p-4 shadow-2xl shadow-purple-900/40 backdrop-blur-md">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0 text-xl shadow-md shadow-violet-600/30">
                📲
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-white font-bold text-sm">App Install Karein!</p>
                  <button
                    onClick={() => setShowBanner(false)}
                    className="text-gray-400 hover:text-white p-1"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-300 text-xs mt-1">
                  Mobile ki Home Screen par app ki tarah save karein
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-3.5">
              <button
                onClick={() => setShowBanner(false)}
                className="flex-1 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs font-medium hover:bg-gray-700 transition-colors"
              >
                Baad me
              </button>
              <button
                onClick={handleInstallClick}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install Karein</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Step-by-Step Guide Modal (if native prompt didn't pop automatically) */}
      {showGuide && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-purple-500/50 rounded-2xl max-w-sm w-full p-5 shadow-2xl text-white">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-base">Mobile me Install Karne ka Tarika</h3>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-gray-300">
              {/* Android Guide */}
              <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-3.5">
                <p className="font-bold text-purple-300 text-sm mb-2 flex items-center gap-1.5">
                  🤖 Android (Google Chrome):
                </p>
                <ol className="list-decimal list-inside space-y-1.5 leading-relaxed text-gray-300">
                  <li>Chrome me upar right corner me <strong className="text-white">3 dots (⋮)</strong> dabayein</li>
                  <li>Menu me se <strong className="text-white">&quot;Install app&quot;</strong> ya <strong className="text-white">&quot;Add to Home screen&quot;</strong> select karein</li>
                  <li><strong className="text-green-400">Install</strong> dabayein — app phone me aa jayegi!</li>
                </ol>
              </div>

              {/* iPhone Guide */}
              <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-3.5">
                <p className="font-bold text-blue-300 text-sm mb-2 flex items-center gap-1.5">
                  🍏 iPhone (Safari Browser):
                </p>
                <ol className="list-decimal list-inside space-y-1.5 leading-relaxed text-gray-300">
                  <li>Safari me neeche <strong className="text-white">Share button (📤)</strong> dabayein</li>
                  <li>Scroll karke <strong className="text-white">&quot;Add to Home Screen&quot; (➕)</strong> chunein</li>
                  <li>Upar right me <strong className="text-green-400">Add</strong> dabayein</li>
                </ol>
              </div>
            </div>

            <button
              onClick={() => {
                setShowGuide(false);
                setShowBanner(false);
              }}
              className="mt-5 w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" /> Samajh gaya
            </button>
          </div>
        </div>
      )}
    </>
  );
}

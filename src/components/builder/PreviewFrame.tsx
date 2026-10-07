"use client";

import { useState, useRef } from "react";
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCw,
  ExternalLink,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface PreviewFrameProps {
  htmlCode: string;
  loading?: boolean;
}

export default function PreviewFrame({ htmlCode, loading = false }: PreviewFrameProps) {
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getViewportWidth = () => {
    switch (viewport) {
      case "mobile":
        return "max-w-[375px] h-[667px] shadow-2xl rounded-3xl border-[8px] border-gray-800";
      case "tablet":
        return "max-w-[768px] h-[900px] shadow-2xl rounded-2xl border-[6px] border-gray-800";
      case "desktop":
      default:
        return "w-full h-full rounded-xl border border-gray-800/80";
    }
  };

  const handleOpenInNewTab = () => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.open();
      newWindow.document.write(htmlCode);
      newWindow.document.close();
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error("Error attempting fullscreen:", err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col bg-[#07080c] h-full overflow-hidden relative"
    >
      {/* Top Preview Controls Toolbar */}
      <div className="h-12 border-b border-gray-800 px-4 flex items-center justify-between bg-[#0a0c13] flex-shrink-0">
        {/* Left: Device Mode Switcher */}
        <div className="flex items-center bg-gray-900/90 p-1 rounded-xl border border-gray-800 space-x-1">
          <button
            onClick={() => setViewport("desktop")}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              viewport === "desktop"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
            title="Desktop View"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setViewport("tablet")}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              viewport === "tablet"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            onClick={() => setViewport("mobile")}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              viewport === "mobile"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
            title="Mobile View (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Center: Live URL Pill */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-black/50 border border-gray-800 rounded-lg text-[11px] text-gray-400">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>https://live-sandbox-preview.app</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
            title="Reload Preview"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenInNewTab}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
            title="Open in New Tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Main Preview Frame Container */}
      <div className="flex-1 bg-[#050608] p-4 flex items-center justify-center overflow-auto relative">
        {loading && (
          <div className="absolute inset-0 z-20 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center animate-spin mb-4 shadow-xl shadow-purple-600/30">
              <span className="text-xl">⚡</span>
            </div>
            <h3 className="text-lg font-bold text-white">AI is Generating Website...</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              Synthesizing components, layout, styles, and interactive scripts.
            </p>
          </div>
        )}

        {htmlCode ? (
          <iframe
            key={refreshKey}
            srcDoc={htmlCode}
            title="Live Sandboxed Preview"
            sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
            className={`transition-all duration-300 bg-white ${getViewportWidth()}`}
          />
        ) : (
          <div className="text-center text-gray-500 max-w-sm">
            <div className="w-12 h-12 rounded-2xl bg-gray-800/80 flex items-center justify-center mx-auto mb-3 text-xl">
              🖥️
            </div>
            <p className="text-sm font-semibold text-gray-400">No preview available yet</p>
            <p className="text-xs text-gray-600 mt-1">
              Enter a prompt in the chat panel on the left to generate your website.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

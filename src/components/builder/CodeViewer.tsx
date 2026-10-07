"use client";

import { useState } from "react";
import { Copy, Check, Code, Download, FileText } from "lucide-react";

interface CodeViewerProps {
  code: string;
  filename?: string;
  isSplitView?: boolean;
}

export default function CodeViewer({
  code,
  filename = "index.html",
  isSplitView = false,
}: CodeViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const lines = code ? code.split("\n") : [];

  return (
    <div className={`flex flex-col bg-[#0b0e14] h-full overflow-hidden border-r border-gray-800/80 ${isSplitView ? "w-full" : "flex-1"}`}>
      {/* Code Header Bar */}
      <div className="h-12 border-b border-gray-800 px-4 flex items-center justify-between bg-[#111622] flex-shrink-0">
        <div className="flex items-center space-x-2 text-xs text-gray-300 font-mono">
          <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-purple-950/60 border border-purple-500/30 text-purple-300">
            <FileText className="w-3.5 h-3.5" />
            <span className="font-semibold">{filename}</span>
          </div>
          <span className="text-gray-500 text-[11px]">
            {lines.length} lines • {(code.length / 1024).toFixed(1)} KB
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium border border-gray-700 transition-colors"
            title="Copy all code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-colors"
            title="Download file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
      </div>

      {/* Code Editor Body with Line Numbers */}
      <div className="flex-1 overflow-auto font-mono text-xs text-gray-300 bg-[#080b11] flex selection:bg-purple-600 selection:text-white">
        {/* Line Numbers Column */}
        <div className="py-4 pl-3 pr-3 text-right text-gray-600 select-none bg-[#0a0d14] border-r border-gray-800/60 flex-shrink-0 font-mono text-[11px] leading-relaxed min-w-[42px]">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Code Content */}
        <pre className="p-4 overflow-x-auto whitespace-pre leading-relaxed text-gray-200 flex-1 font-mono text-[11px]">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

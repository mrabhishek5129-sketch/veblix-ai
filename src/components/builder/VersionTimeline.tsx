"use client";

import { formatDate } from "@/lib/utils";
import { History, X, RotateCcw, CheckCircle2, Clock } from "lucide-react";

interface Version {
  id: string;
  versionNumber: number;
  prompt: string;
  createdAt: string | Date;
}

interface VersionTimelineProps {
  isOpen: boolean;
  onClose: () => void;
  versions: Version[];
  currentVersionNumber: number;
  onRollback: (versionId: string) => Promise<void>;
  loading: boolean;
}

export default function VersionTimeline({
  isOpen,
  onClose,
  versions,
  currentVersionNumber,
  onRollback,
  loading,
}: VersionTimelineProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md h-full bg-[#0c0e17] border-l border-gray-800 shadow-2xl flex flex-col p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Version History</h3>
              <p className="text-xs text-gray-400">Restore or inspect past snapshots</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timeline List */}
        <div className="flex-1 overflow-y-auto py-6 space-y-4">
          {versions.map((ver) => {
            const isCurrent = ver.versionNumber === currentVersionNumber;
            return (
              <div
                key={ver.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? "bg-purple-950/30 border-purple-500/50 shadow-md"
                    : "bg-gray-900/50 border-gray-800 hover:border-gray-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        isCurrent
                          ? "bg-purple-600 text-white"
                          : "bg-gray-800 text-gray-300 border border-gray-700"
                      }`}
                    >
                      v{ver.versionNumber}
                    </span>
                    {isCurrent && (
                      <span className="flex items-center text-[11px] text-purple-300 font-medium">
                        <CheckCircle2 className="w-3 h-3 mr-1 text-purple-400" />
                        Active
                      </span>
                    )}
                  </div>

                  <div className="flex items-center text-[11px] text-gray-500 space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(ver.createdAt)}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                  {ver.prompt || "Initial website generation"}
                </p>

                {!isCurrent && (
                  <div className="mt-3 pt-3 border-t border-gray-800/80 flex justify-end">
                    <button
                      onClick={() => onRollback(ver.id)}
                      disabled={loading}
                      className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-gray-800 hover:bg-purple-600 text-gray-300 hover:text-white text-xs font-medium transition-colors disabled:opacity-50"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Rollback to this</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { History, RotateCcw, Clock, Trash2 } from "lucide-react";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
  versions?: { id: string; versionNumber: number; createdAt: string }[];
}

export default function HistoryPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = () => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => setProjects(d.projects || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Kya aap "${title}" aur iski saari history delete karna chahte hain?`)) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Delete failed. Please try again.");
      }
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const handleClearAllHistory = async () => {
    if (!confirm("Kya aap saare projects ki poori history delete karna chahte hain?")) return;
    try {
      const res = await fetch("/api/history", { method: "DELETE" });
      if (res.ok) {
        setProjects([]);
      } else {
        alert("Failed to clear history.");
      }
    } catch (err) {
      console.error("Clear all error", err);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <History className="w-6 h-6 text-violet-400" /> History
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Har project ki version history — rollback ya delete kar sakte ho
          </p>
        </div>

        {projects.length > 0 && (
          <button
            onClick={handleClearAllHistory}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 rounded-xl text-xs font-semibold transition-all"
            title="Clear all history"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All History</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-gray-800/40 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Koi history nahi mili abhi.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((p) => (
            <div
              key={p.id}
              className="rounded-xl bg-gray-800/40 border border-gray-700/50 overflow-hidden"
            >
              {/* Project Header */}
              <div className="flex items-center justify-between px-5 py-3 bg-gray-800/60 border-b border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                    <span className="text-violet-300 font-bold text-xs">
                      {p.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-white font-semibold text-sm">{p.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/builder/${p.id}`}
                    className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    Open Builder →
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id, p.title)}
                    className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete Project & History"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Versions Timeline */}
              <div className="p-4 space-y-2">
                {(!p.versions || p.versions.length === 0) ? (
                  <p className="text-gray-500 text-xs px-2">No versions yet.</p>
                ) : (
                  [...(p.versions || [])].reverse().map((v, idx) => (
                    <div
                      key={v.id}
                      className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-700/30 transition-colors group"
                    >
                      <div className="w-6 h-6 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] text-gray-300 font-bold">
                          v{v.versionNumber}
                        </span>
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-300 text-xs font-medium">
                          Version {v.versionNumber}
                          {idx === 0 && (
                            <span className="ml-2 text-[10px] bg-green-600/20 text-green-400 border border-green-500/30 px-1.5 py-0.5 rounded-full">
                              Latest
                            </span>
                          )}
                        </span>
                        <p className="text-gray-500 text-[11px] flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {formatDate(v.createdAt || p.createdAt)}
                        </p>
                      </div>
                      <Link
                        href={`/builder/${p.id}`}
                        className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[11px] text-gray-400 hover:text-white transition-all"
                      >
                        <RotateCcw className="w-3 h-3" /> Rollback
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

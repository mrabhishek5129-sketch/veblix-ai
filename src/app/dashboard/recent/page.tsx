"use client";

import { useEffect, useState } from "react";
import { Clock, ExternalLink, Pencil } from "lucide-react";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  description?: string | null;
  updatedAt: string;
  versions?: { id: string; versionNumber: number }[];
}

export default function RecentPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => {
        const sorted = (d.projects || []).sort(
          (a: Project, b: Project) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        setProjects(sorted.slice(0, 10));
      })
      .finally(() => setLoading(false));
  }, []);

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Clock className="w-6 h-6 text-violet-400" /> Recent Projects
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Aapke recently edited websites
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-gray-800/40 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Koi recent project nahi mila.</p>
          <Link
            href="/dashboard"
            className="mt-4 inline-block px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm rounded-lg transition-colors"
          >
            New Website Banao
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/40 border border-gray-700/50 hover:border-violet-500/40 hover:bg-gray-800/60 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                <span className="text-violet-300 font-bold text-sm">
                  {p.title.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">
                  {p.title}
                </p>
                <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" />
                  {timeAgo(p.updatedAt)} •{" "}
                  {p.versions?.length || 0} version(s)
                </p>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link
                  href={`/builder/${p.id}`}
                  className="flex items-center gap-1 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs rounded-lg transition-colors"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </Link>
                <Link
                  href={`/builder/${p.id}`}
                  target="_blank"
                  className="p-1.5 text-gray-400 hover:text-white transition-colors"
                  title="Open in new window"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

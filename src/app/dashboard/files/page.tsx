"use client";

import { useEffect, useState } from "react";
import { FolderOpen, Download, Code2, Clock, Pencil } from "lucide-react";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  versions?: { id: string; versionNumber: number }[];
}

export default function FilesPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => setProjects(d.projects || []))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const handleDownload = async (projectId: string, title: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      const data = await res.json();
      const version = data.versions?.[data.versions.length - 1];
      if (!version) return alert("No files found.");

      const filesJson = JSON.parse(version.filesJson || "{}");
      const html = filesJson["index.html"] || "";

      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/\s+/g, "_")}_index.html`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Download failed. Try again.");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FolderOpen className="w-6 h-6 text-violet-400" /> Project Files
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Saare projects ke files — download ya edit karo
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-800/40 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Koi project file nahi mili.</p>
          <Link
            href="/dashboard"
            className="mt-4 inline-block px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm rounded-lg transition-colors"
          >
            Pehla Website Banao
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Header Row */}
          <div className="grid grid-cols-12 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span className="col-span-5">Project Name</span>
            <span className="col-span-2 text-center">Versions</span>
            <span className="col-span-3">Last Modified</span>
            <span className="col-span-2 text-right">Actions</span>
          </div>

          {projects.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-12 items-center px-4 py-3.5 rounded-xl bg-gray-800/40 border border-gray-700/50 hover:border-violet-500/40 transition-all group"
            >
              {/* Name */}
              <div className="col-span-5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-violet-600/15 border border-violet-500/25 flex items-center justify-center flex-shrink-0">
                  <Code2 className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium truncate">{p.title}</p>
                  <p className="text-gray-500 text-[11px]">index.html</p>
                </div>
              </div>

              {/* Versions */}
              <div className="col-span-2 text-center">
                <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                  v{p.versions?.length || 0}
                </span>
              </div>

              {/* Date */}
              <div className="col-span-3 flex items-center gap-1.5 text-gray-400 text-xs">
                <Clock className="w-3.5 h-3.5" />
                {formatDate(p.updatedAt)}
              </div>

              {/* Actions */}
              <div className="col-span-2 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link
                  href={`/builder/${p.id}`}
                  className="p-1.5 bg-violet-600/20 hover:bg-violet-600 border border-violet-500/30 text-violet-400 hover:text-white rounded-lg transition-all"
                  title="Edit"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => handleDownload(p.id, p.title)}
                  className="p-1.5 bg-gray-700 hover:bg-gray-600 border border-gray-600 text-gray-400 hover:text-white rounded-lg transition-all"
                  title="Download HTML"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Total Stats */}
      {!loading && projects.length > 0 && (
        <div className="flex gap-4 pt-4 border-t border-gray-800">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{projects.length}</p>
            <p className="text-xs text-gray-500">Total Projects</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {projects.reduce((sum, p) => sum + (p.versions?.length || 0), 0)}
            </p>
            <p className="text-xs text-gray-500">Total Versions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-violet-400">HTML</p>
            <p className="text-xs text-gray-500">File Format</p>
          </div>
        </div>
      )}
    </div>
  );
}

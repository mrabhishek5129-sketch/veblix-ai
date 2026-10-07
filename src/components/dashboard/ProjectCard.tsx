"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Layout, Clock, ArrowUpRight, History, Trash2 } from "lucide-react";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description?: string | null;
    createdAt: string | Date;
    updatedAt: string | Date;
    versions?: { id: string; versionNumber: number }[];
  };
  onDelete?: (id: string) => void;
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const versionCount = project.versions?.length || 1;

  return (
    <div className="group rounded-2xl glass-panel border border-gray-800 hover:border-purple-500/40 p-6 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-purple-900/10 relative">
      <div>
        {/* Header with icon & badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
            <Layout className="w-5 h-5" />
          </div>
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-gray-800 border border-gray-700 text-gray-300 text-[11px] font-medium">
            <History className="w-3 h-3 mr-1 text-purple-400" />
            <span>v{versionCount}</span>
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="font-bold text-lg text-white group-hover:text-purple-300 transition-colors line-clamp-1">
          {project.title}
        </h3>
        <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed min-h-[32px]">
          {project.description || "Generated with AI Builder natural prompt"}
        </p>
      </div>

      {/* Footer Meta & Actions */}
      <div className="mt-6 pt-4 border-t border-gray-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center text-gray-500 space-x-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatDate(project.updatedAt)}</span>
        </div>

        <div className="flex items-center space-x-2">
          {onDelete && (
            <button
              onClick={() => onDelete(project.id)}
              className="p-1.5 text-gray-500 hover:text-red-400 rounded-lg hover:bg-gray-800 transition-colors"
              title="Delete project"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <Link
            href={`/builder/${project.id}`}
            className="flex items-center space-x-1 px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white rounded-lg font-medium transition-all"
          >
            <span>Open Builder</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

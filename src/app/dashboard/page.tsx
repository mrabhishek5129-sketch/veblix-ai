"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import ProjectCard from "@/components/dashboard/ProjectCard";
import CreateProjectModal from "@/components/dashboard/CreateProjectModal";
import CreditBadge from "@/components/dashboard/CreditBadge";
import {
  Plus,
  Sparkles,
  LayoutGrid,
  Dumbbell,
  Utensils,
  Briefcase,
  Layers,
  Loader2,
  FolderOpen,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  versions?: { id: string; versionNumber: number }[];
}

function DashboardContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const initialPromptFromUrl = searchParams.get("prompt") || "";

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(!!initialPromptFromUrl);
  const [modalPrompt, setModalPrompt] = useState(initialPromptFromUrl);
  const [modalTitle, setModalTitle] = useState("");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (res.ok) {
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error("Failed to load projects", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Error deleting project", err);
    }
  };

  const starterTemplates = [
    {
      title: "IronPulse Fitness Club",
      desc: "Dark-themed fitness site with memberships, class timetables & trainer profiles",
      icon: <Dumbbell className="w-5 h-5 text-purple-400" />,
      prompt: "Create a modern high-energy Gym website with dark theme, membership tier pricing, class schedule grid, trainer showcase, and booking modal.",
    },
    {
      title: "Bella Vista Gourmet Bistro",
      desc: "Elegant restaurant site with food menu categories and table reservations",
      icon: <Utensils className="w-5 h-5 text-amber-400" />,
      prompt: "Create a luxury Restaurant website with interactive food & drink menu tabs, chef specials carousel, and table reservation form.",
    },
    {
      title: "Data Analyst Portfolio",
      desc: "Tech portfolio with project case studies, skills matrix & contact form",
      icon: <Briefcase className="w-5 h-5 text-blue-400" />,
      prompt: "Create a sleek portfolio website for a Senior Data Analyst with interactive project cards, skills radar, resume download button, and contact form.",
    },
    {
      title: "CloudScale SaaS Landing",
      desc: "Clean software landing page with live demo preview, feature grid & FAQ",
      icon: <Layers className="w-5 h-5 text-emerald-400" />,
      prompt: "Create a high-converting SaaS landing page with animated hero, interactive product features, pricing calculator, and accordion FAQ.",
    },
  ];

  const handleTemplateClick = (template: (typeof starterTemplates)[0]) => {
    setModalTitle(template.title);
    setModalPrompt(template.prompt);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-10">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {session?.user?.name || "Builder"} 👋
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your AI-generated websites, live previews, and versions
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <CreditBadge />
          <button
            onClick={() => {
              setModalTitle("");
              setModalPrompt("");
              setIsModalOpen(true);
            }}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>New Website</span>
          </button>
        </div>
      </div>

      {/* Starter Templates Section */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
            Quick Start Templates
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {starterTemplates.map((template, idx) => (
            <div
              key={idx}
              onClick={() => handleTemplateClick(template)}
              className="p-5 rounded-2xl glass-panel border border-gray-800 hover:border-purple-500/50 hover:bg-gray-800/40 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-gray-800/80 border border-gray-700/60 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  {template.icon}
                </div>
                <h3 className="font-semibold text-sm text-white group-hover:text-purple-300 transition-colors">
                  {template.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">
                  {template.desc}
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-medium text-purple-400 group-hover:translate-x-1 transition-transform">
                <span>Use Template →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Existing Projects Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <LayoutGrid className="w-4 h-4 text-gray-400" />
            <h2 className="text-lg font-bold text-white">Your Websites</h2>
          </div>
          <span className="text-xs text-gray-400">
            {projects.length} {projects.length === 1 ? "project" : "projects"} total
          </span>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-400 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            <p className="text-sm">Loading your websites...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="py-16 px-4 rounded-2xl glass-panel border border-dashed border-gray-800 text-center flex flex-col items-center justify-center max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <FolderOpen className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">No websites generated yet</h3>
            <p className="text-xs text-gray-400 mt-2 max-w-sm">
              Start by describing what you want to build or pick a starter template above.
            </p>
            <button
              onClick={() => {
                setModalTitle("");
                setModalPrompt("");
                setIsModalOpen(true);
              }}
              className="mt-6 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-colors"
            >
              + Create Your First Website
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={handleDeleteProject}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTitle={modalTitle}
        initialPrompt={modalPrompt}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 flex flex-col items-center justify-center text-gray-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <p className="text-sm">Loading dashboard...</p>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

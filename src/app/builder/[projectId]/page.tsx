"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ChatPanel from "@/components/builder/ChatPanel";
import PreviewFrame from "@/components/builder/PreviewFrame";
import CodeViewer from "@/components/builder/CodeViewer";
import VersionTimeline from "@/components/builder/VersionTimeline";
import ExportModal from "@/components/builder/ExportModal";
import DeployModal from "@/components/builder/DeployModal";
import {
  ArrowLeft,
  Eye,
  Code2,
  Columns2,
  History,
  Download,
  Rocket,
  Zap,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface ProjectVersion {
  id: string;
  versionNumber: number;
  prompt: string;
  filesJson: string;
  createdAt: string;
}

interface ChatMessage {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
}

interface ProjectDetail {
  id: string;
  title: string;
  description?: string | null;
  versions: ProjectVersion[];
  messages: ChatMessage[];
}

function BuilderContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { data: session, update: updateSession } = useSession();

  const projectId = params?.projectId as string;
  const initialPromptFromUrl = searchParams.get("initialPrompt") || "";

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [currentCode, setCurrentCode] = useState<string>("");
  const [currentVersion, setCurrentVersion] = useState<number>(1);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [viewMode, setViewMode] = useState<"preview" | "split" | "code">("split");
  const [loading, setLoading] = useState<boolean>(true);
  const [aiGenerating, setAiGenerating] = useState<boolean>(false);
  const [credits, setCredits] = useState<number>(
    (session?.user as any)?.credits ?? 100
  );
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDeployOpen, setIsDeployOpen] = useState(false);
  const [error, setError] = useState("");

  const extractCode = (filesJson: string): string => {
    try {
      const parsed = JSON.parse(filesJson);
      return parsed["index.html"] || parsed["App.js"] || filesJson;
    } catch {
      return filesJson;
    }
  };

  const triggerInitialGeneration = useCallback(
    async (proj: ProjectDetail, promptText: string) => {
      setAiGenerating(true);
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId: proj.id,
            prompt: promptText || proj.title,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setCurrentCode(data.code);
          setCurrentVersion(data.version.versionNumber);
          setCredits(data.remainingCredits);
          if (updateSession) updateSession({ credits: data.remainingCredits });

          setMessages([
            {
              role: "assistant",
              content: `🎉 Generated initial website for **${proj.title}**!\n\nCheck out the live code in the middle and live running website on the right. You can ask me to change colors, add sections, or tweak components anytime in chat.`,
            },
          ]);

          setProject((prev) =>
            prev
              ? {
                  ...prev,
                  versions: [data.version, ...prev.versions],
                }
              : prev
          );
        } else {
          setError(data.error || "Failed to generate initial website");
        }
      } catch (err) {
        console.error("Initial generation failed:", err);
        setError("Generation request failed. Please check network connection.");
      } finally {
        setAiGenerating(false);
      }
    },
    [updateSession]
  );

  const loadProject = useCallback(async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/projects/${projectId}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to load project");
        setLoading(false);
        return;
      }

      const proj = data.project as ProjectDetail;
      setProject(proj);
      setMessages(proj.messages || []);

      if (proj.versions && proj.versions.length > 0) {
        const latest = proj.versions[0];
        setCurrentCode(extractCode(latest.filesJson));
        setCurrentVersion(latest.versionNumber);
      } else {
        const promptToUse = initialPromptFromUrl || proj.description || proj.title;
        triggerInitialGeneration(proj, promptToUse);
      }
    } catch (err) {
      console.error("Error loading project:", err);
      setError("Failed to load project details.");
    } finally {
      setLoading(false);
    }
  }, [projectId, initialPromptFromUrl, triggerInitialGeneration]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  const handleSendMessage = async (msgContent: string) => {
    if (!project || aiGenerating) return;
    setAiGenerating(true);

    setMessages((prev) => [...prev, { role: "user", content: msgContent }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          message: msgContent,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setCurrentCode(data.code);
        setCurrentVersion(data.version.versionNumber);
        setCredits(data.remainingCredits);
        if (updateSession) updateSession({ credits: data.remainingCredits });

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);

        setProject((prev) =>
          prev
            ? {
                ...prev,
                versions: [data.version, ...prev.versions],
              }
            : prev
        );
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `⚠️ Error: ${data.error || "Could not apply changes. Please try again."}`,
          },
        ]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Network error. Please try again." },
      ]);
    } finally {
      setAiGenerating(false);
    }
  };

  const handleRollback = async (versionId: string) => {
    if (!project || aiGenerating) return;
    setAiGenerating(true);
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "rollback",
          versionId,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentCode(extractCode(data.version.filesJson));
        setCurrentVersion(data.version.versionNumber);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.message },
        ]);
        setProject((prev) =>
          prev
            ? {
                ...prev,
                versions: [data.version, ...prev.versions],
              }
            : prev
        );
        setIsTimelineOpen(false);
      }
    } catch (err) {
      console.error("Rollback failed:", err);
    } finally {
      setAiGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07080c] flex flex-col items-center justify-center text-white space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
        <h2 className="text-base font-medium">Opening AI Builder Studio...</h2>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#07080c] text-gray-100 overflow-hidden">
      {/* Top Navbar */}
      <header className="h-14 border-b border-gray-800/90 bg-[#0a0c13] px-4 flex items-center justify-between flex-shrink-0 z-30">
        {/* Left: Back & Project Title */}
        <div className="flex items-center space-x-3">
          <Link
            href="/dashboard"
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm text-white tracking-tight">
              {project?.title || "AI Website"}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-[10px] font-bold">
              v{currentVersion}
            </span>
          </div>
        </div>

        {/* Center: 3-Way Layout Switcher (Preview vs Split vs Code) */}
        <div className="flex items-center bg-gray-900/90 p-1 rounded-xl border border-gray-800 space-x-1">
          <button
            onClick={() => setViewMode("preview")}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "preview"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
            title="Full Preview Mode"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </button>
          <button
            onClick={() => setViewMode("split")}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "split"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/20"
                : "text-purple-400 hover:text-white"
            }`}
            title="Dual Split View (Live Code + Preview side by side)"
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>⚡ Dual Split</span>
          </button>
          <button
            onClick={() => setViewMode("code")}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "code"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
            title="Full Code Inspector"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Code</span>
          </button>
        </div>

        {/* Right: Actions, Deploy, Export & Credits */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => setIsTimelineOpen(true)}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 hover:text-white text-xs font-medium transition-colors"
            title="Version History & Rollback"
          >
            <History className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">History</span>
          </button>

          <button
            onClick={() => setIsExportOpen(true)}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 hover:text-white text-xs font-medium transition-colors"
            title="Download ZIP Archive"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={() => setIsDeployOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-600/30 transition-all hover:scale-105"
            title="Deploy Live Website & Generate QR Code"
          >
            <Rocket className="w-3.5 h-3.5 animate-pulse" />
            <span>Deploy</span>
          </button>

          <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1 bg-purple-950/40 border border-purple-500/30 rounded-full text-purple-300 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
            <span>{credits}</span>
          </div>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-500/10 border-b border-red-500/30 text-red-300 text-xs px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError("")}
            className="text-gray-400 hover:text-white text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Split-Screen Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left: Conversational AI Chat Panel */}
        <ChatPanel
          messages={messages}
          onSendMessage={handleSendMessage}
          loading={aiGenerating}
          credits={credits}
        />

        {/* Right Area: Depending on ViewMode */}
        {viewMode === "preview" && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <PreviewFrame htmlCode={currentCode} loading={aiGenerating && !currentCode} />
          </div>
        )}

        {viewMode === "code" && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <CodeViewer code={currentCode} filename="index.html" />
          </div>
        )}

        {viewMode === "split" && (
          <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
            {/* Center: Live Code Editor */}
            <div className="w-full lg:w-1/2 h-1/2 lg:h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-gray-800">
              <CodeViewer code={currentCode} filename="index.html" isSplitView={true} />
            </div>

            {/* Right: Live Sandboxed Running Website */}
            <div className="w-full lg:w-1/2 h-1/2 lg:h-full overflow-hidden">
              <PreviewFrame htmlCode={currentCode} loading={aiGenerating && !currentCode} />
            </div>
          </div>
        )}
      </div>

      {/* Version Timeline Drawer */}
      <VersionTimeline
        isOpen={isTimelineOpen}
        onClose={() => setIsTimelineOpen(false)}
        versions={project?.versions || []}
        currentVersionNumber={currentVersion}
        onRollback={handleRollback}
        loading={aiGenerating}
      />

      {/* Export ZIP Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        projectTitle={project?.title || "MyWebsite"}
        code={currentCode}
      />

      {/* Deploy Live Modal */}
      <DeployModal
        isOpen={isDeployOpen}
        onClose={() => setIsDeployOpen(false)}
        projectTitle={project?.title || "MyWebsite"}
        projectId={projectId}
      />
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#07080c] flex flex-col items-center justify-center text-white space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
          <h2 className="text-base font-medium">Loading Builder Studio...</h2>
        </div>
      }
    >
      <BuilderContent />
    </Suspense>
  );
}

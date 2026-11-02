
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, X, Loader2, ArrowRight, Wand2 } from "lucide-react";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  initialTitle?: string;
}

function extractProjectTitle(prompt: string): string {
  const text = prompt.trim();
  if (!text) return "";

  // 1. Quoted names: "Brew Cafe" or 'Royal Gym'
  const quoteMatch = text.match(/["']([^"']{2,40})["']/);
  if (quoteMatch?.[1]) return quoteMatch[1].trim();

  // 2. Named / called pattern
  const namedMatch = text.match(/(?:named|called|title|name\s+is|branding)\s+["']?([A-Za-z0-9\s&'-]{2,35})/i);
  if (namedMatch?.[1]) {
    const cleaned = namedMatch[1].split(/[.,!?\n]|with|and|having|including/i)[0].trim();
    if (cleaned.length >= 2) return cleaned;
  }

  // 3. Hindi 'ke liye' pattern (e.g. 'Coffee shop ke liye website')
  const hindiMatch = text.match(/^(.+?)\s+ke\s+liye\b/i);
  if (hindiMatch?.[1]) {
    const cleaned = hindiMatch[1].trim();
    if (cleaned.length >= 2 && cleaned.length <= 40) return cleaned;
  }

  // 4. "for <business name>" pattern (e.g. "website for Italian Restaurant")
  const forMatch = text.match(/(?:website|web\s*app|site|landing\s*page|portfolio)\s+(?:for|of)\s+([A-Za-z0-9\s&'-]{2,40})/i);
  if (forMatch?.[1]) {
    const cleaned = forMatch[1].split(/[.,!?\n]|with|and|having|including/i)[0].trim();
    if (cleaned.length >= 2) return cleaned;
  }

  // 5. "create/build/make a <business name> website"
  const createMatch = text.match(/(?:create|build|make|design|generate)\s+(?:a|an)?\s*(?:modern|responsive|beautiful|creative|clean|full\s*stack)?\s*([A-Za-z0-9\s&'-]{2,40})\s+(?:website|web\s*app|site|landing\s*page|app)/i);
  if (createMatch?.[1]) {
    const cleaned = createMatch[1].trim();
    if (cleaned.length >= 2) return cleaned;
  }

  // 6. Intelligent word extraction
  const stopWords = new Set(["create", "build", "make", "design", "generate", "a", "an", "the", "for", "with", "and", "in", "of", "to", "modern", "responsive", "website", "site", "page", "app", "beautiful", "clean", "simple"]);
  const words = text
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
    .split(/\s+/)
    .filter((w) => !stopWords.has(w.toLowerCase()));

  if (words.length > 0) {
    const titleWords = words.slice(0, 3).map((w) => w.charAt(0).toUpperCase() + w.slice(1));
    return titleWords.join(" ");
  }

  return "My Project";
}

export default function CreateProjectModal({
  isOpen,
  onClose,
  initialPrompt = "",
  initialTitle = "",
}: CreateProjectModalProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialPrompt);
  const [isCustomTitle, setIsCustomTitle] = useState(!!initialTitle);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const detected = initialTitle.trim() || extractProjectTitle(initialPrompt);
    setTitle(detected);
    setIsCustomTitle(!!initialTitle.trim());
    setDescription(initialPrompt);
    setError("");
  }, [initialPrompt, initialTitle, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const finalTitle =
      title.trim() ||
      extractProjectTitle(description) ||
      "New Website";

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: finalTitle,
          description: description.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create project");
        return;
      }

      if (!data.project?.id) {
        setError("Project created, but its ID was not returned.");
        return;
      }

      const promptParam = description.trim()
        ? `?initialPrompt=${encodeURIComponent(description.trim())}`
        : "";

      router.push(`/builder/${data.project.id}${promptParam}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl glass-panel border border-gray-800 bg-[#0e111a] p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-600/20 text-purple-400">
            <Wand2 className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">
              Create New Website
            </h2>
            <p className="mt-0.5 text-xs text-gray-400">
              Name your project and describe what you want to build.
            </p>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="project-title"
              className="mb-1.5 block text-xs font-medium text-gray-300"
            >
              Website Name / Project Title *
            </label>

            <input
              id="project-title"
              type="text"
              required
              maxLength={100}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setIsCustomTitle(true);
              }}
              placeholder="e.g. Royal Fitness Gym"
              className="w-full rounded-xl border border-gray-700/80 bg-gray-900/60 px-4 py-2.5 text-sm text-white placeholder-gray-500 transition-colors focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="project-description"
              className="mb-1.5 block text-xs font-medium text-gray-300"
            >
              Initial Website Prompt / Requirements (Optional)
            </label>

            <textarea
              id="project-description"
              rows={4}
              maxLength={10000}
              value={description}
              onChange={(e) => {
                const newDesc = e.target.value;
                setDescription(newDesc);
                if (!isCustomTitle) {
                  const auto = extractProjectTitle(newDesc);
                  if (auto) setTitle(auto);
                }
              }}
              placeholder="Example: Build a modern website for Royal Fitness Gym with membership plans, trainers, and a booking form."
              className="w-full resize-none rounded-xl border border-gray-700/80 bg-gray-900/60 px-4 py-2.5 text-sm text-white placeholder-gray-500 transition-colors focus:border-purple-500 focus:outline-none"
            />

            <p className="mt-1 text-xs text-gray-500">
              Tip: Include your business or project name in the prompt.
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3 border-t border-gray-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-600/30 transition-all hover:from-purple-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Open Builder</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

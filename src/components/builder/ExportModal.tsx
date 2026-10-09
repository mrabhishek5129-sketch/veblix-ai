"use client";

import { useState } from "react";
import JSZip from "jszip";
import { Download, X, FileArchive, CheckCircle2, Loader2, Play } from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  code: string;
}

export default function ExportModal({
  isOpen,
  onClose,
  projectTitle,
  code,
}: ExportModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    setDownloading(true);
    try {
      const zip = new JSZip();

      // 1. Add index.html
      zip.file("index.html", code);

      // 2. Add README.md
      const readmeContent = `# ${projectTitle}

This website was built using **Veblix AI**.

## 🚀 How to Run Locally

### Option 1: Open directly in Browser
Simply double-click \`index.html\` to open the website in your favorite web browser (Chrome, Edge, Firefox).

### Option 2: Run with Live Server / VS Code
1. Open this folder in VS Code.
2. Right-click on \`index.html\` and select **"Open with Live Server"**.

### Option 3: Deploy to Vercel / Netlify
1. Upload this folder to a GitHub repository.
2. Link the repository on [Vercel](https://vercel.com) or [Netlify](https://netlify.com) for 1-click free deployment!

---
© 2026 ${projectTitle}. Powered by Veblix AI.
`;
      zip.file("README.md", readmeContent);

      // 3. Add a simple package.json for npm serve
      const packageJson = {
        name: projectTitle.toLowerCase().replace(/\s+/g, "-"),
        version: "1.0.0",
        description: `Exported website for ${projectTitle}`,
        scripts: {
          start: "npx serve .",
        },
        dependencies: {},
      };
      zip.file("package.json", JSON.stringify(packageJson, null, 2));

      // 4. Generate ZIP blob & download
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${projectTitle.toLowerCase().replace(/\s+/g, "_")}_website.zip`;
      link.click();
      URL.revokeObjectURL(url);

      setDone(true);
      setTimeout(() => {
        setDone(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Failed to generate ZIP", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md p-6 rounded-2xl glass-panel border border-gray-800 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <FileArchive className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Export Website Code</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Download clean production-ready files
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gray-950/80 border border-gray-800 space-y-2 mb-6">
          <div className="text-xs font-semibold text-gray-300">📦 Included in ZIP:</div>
          <ul className="text-xs text-gray-400 space-y-1 pl-2">
            <li>📄 <code className="text-purple-300">index.html</code> (Full responsive UI + Tailwind)</li>
            <li>📄 <code className="text-purple-300">package.json</code> (Local dev runner)</li>
            <li>📄 <code className="text-purple-300">README.md</code> (Setup & deployment guide)</li>
          </ul>
        </div>

        <div className="flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-medium text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDownloadZip}
            disabled={downloading}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all disabled:opacity-60"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Packaging ZIP...</span>
              </>
            ) : done ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download .ZIP Archive</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

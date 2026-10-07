import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800/80 bg-[#07080c] py-12 mt-auto text-sm text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white tracking-tight">
              AI Website Builder
            </span>
          </div>

          <p className="text-gray-500 text-xs text-center">
            Describe → Generate → Refine → Ship. Production-ready full stack web app generation.
          </p>

          <div className="flex items-center space-x-6 text-xs">
            <Link href="#privacy" className="hover:text-gray-200 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#terms" className="hover:text-gray-200 transition-colors">
              Terms of Service
            </Link>
            <span className="text-purple-400">v1.0 (B.Tech Edition)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

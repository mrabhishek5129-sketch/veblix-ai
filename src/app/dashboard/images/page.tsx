"use client";

import { Image as ImageIcon, Search, Download, ExternalLink } from "lucide-react";

const stockImages = [
  {
    url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
    title: "Gym & Fitness",
    category: "Fitness",
  },
  {
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
    title: "Restaurant Interior",
    category: "Food",
  },
  {
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80",
    title: "Developer Workspace",
    category: "Tech",
  },
  {
    url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80",
    title: "Business Meeting",
    category: "Business",
  },
  {
    url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
    title: "Coffee Shop",
    category: "Food",
  },
  {
    url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80",
    title: "Medical & Healthcare",
    category: "Health",
  },
  {
    url: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&q=80",
    title: "Team Collaboration",
    category: "Business",
  },
  {
    url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=80",
    title: "Modern Office",
    category: "Business",
  },
  {
    url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80",
    title: "Food Photography",
    category: "Food",
  },
];

const categories = ["All", "Fitness", "Food", "Tech", "Business", "Health"];

export default function ImagesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-violet-400" /> Image Library
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Free stock images — apne website mein use karo (Unsplash powered)
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search images..."
          className="w-full bg-gray-800/60 border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              cat === "All"
                ? "bg-violet-600 text-white border-violet-500"
                : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
        {stockImages.map((img, i) => (
          <div
            key={i}
            className="relative rounded-xl overflow-hidden group border border-gray-700/50 hover:border-violet-500/50 transition-all"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={img.title}
              className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <a
                href={img.url.replace("w=400", "w=1920")}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg border border-white/20 text-white transition-colors"
                title="Open full size"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href={img.url.replace("w=400", "w=1920")}
                download={`${img.title.toLowerCase().replace(/ /g, "_")}.jpg`}
                className="p-2 bg-violet-600/80 hover:bg-violet-600 backdrop-blur-sm rounded-lg border border-violet-500/40 text-white transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform">
              <p className="text-white text-xs font-medium">{img.title}</p>
              <span className="text-[10px] text-gray-300">{img.category}</span>
            </div>
          </div>
        ))}
      </div>

      {/* More Images Link */}
      <div className="text-center pt-4">
        <a
          href="https://unsplash.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-sm rounded-xl transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          More images on Unsplash
        </a>
      </div>
    </div>
  );
}

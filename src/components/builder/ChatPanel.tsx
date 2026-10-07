"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2, Zap } from "lucide-react";

interface Message {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (message: string) => Promise<void>;
  loading: boolean;
  credits: number;
}

export default function ChatPanel({
  messages,
  onSendMessage,
  loading,
  credits,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestionChips = [
    "🎨 Change theme to Emerald Green",
    "⭐ Add Customer Testimonials section",
    "❓ Add FAQ Accordion section",
    "📅 Add Booking / Contact Modal",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput("");
    await onSendMessage(msg);
  };

  const handleChipClick = async (chipText: string) => {
    if (loading) return;
    await onSendMessage(chipText);
  };

  return (
    <div className="w-full md:w-96 lg:w-[420px] bg-[#0a0c13] border-r border-gray-800/80 flex flex-col h-full flex-shrink-0">
      {/* Chat Header */}
      <div className="h-14 border-b border-gray-800/80 px-4 flex items-center justify-between bg-[#0e111a] flex-shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">AI Assistant</h2>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online & Ready
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-purple-950/50 border border-purple-500/30 rounded-full text-purple-300 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
          <span>{credits}</span>
        </div>
      </div>

      {/* Messages List Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-3 text-purple-400">
              <Bot className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-white">How can I refine your website?</p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
              Ask me to change colors, add pages, add forms, modify content or tweak layouts.
            </p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-2.5 ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs flex-shrink-0 mt-0.5 ${
                msg.role === "user"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 border border-gray-700 text-purple-400"
              }`}
            >
              {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                msg.role === "user"
                  ? "bg-purple-600 text-white shadow-md rounded-tr-none"
                  : "bg-gray-900/90 text-gray-200 border border-gray-800 shadow-sm rounded-tl-none"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-gray-800 border border-gray-700 text-purple-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl rounded-tl-none px-4 py-3 flex items-center space-x-2 text-xs text-gray-300">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
              <span>Applying changes to code...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="p-2 border-t border-gray-800/60 bg-[#0c0e17] overflow-x-auto flex gap-1.5 no-scrollbar flex-shrink-0">
        {suggestionChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleChipClick(chip)}
            disabled={loading}
            className="px-2.5 py-1 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white text-[11px] whitespace-nowrap border border-gray-700 transition-colors disabled:opacity-50"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Chat Input Box */}
      <div className="p-3 border-t border-gray-800 bg-[#0e111a] flex-shrink-0">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="e.g. Change navbar color to blue..."
            className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-4 pr-12 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-2 p-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40 transition-all"
            title="Send Message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        <div className="flex items-center justify-between mt-2 text-[10px] text-gray-500 px-1">
          <span>Press Enter to send</span>
          <span className="text-purple-400">⚡ 5 credits per edit</span>
        </div>
      </div>
    </div>
  );
}

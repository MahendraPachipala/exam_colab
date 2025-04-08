"use client";

import { useState } from "react";

export default function GroupHeader({ groupCode, onLeave }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(groupCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <header className="bg-black/70 backdrop-blur-md border-b border-gray-800 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-white/90 tracking-tight">
            GROUP:
          </h1>
          <span
            onClick={handleCopy}
            title="Click to copy"
            className="cursor-pointer font-mono bg-black/50 text-white/90 px-3 py-1 text-sm rounded-lg border border-gray-700 hover:bg-black/70 transition"
          >
            {copied ? "Copied!" : groupCode}
          </span>
        </div>
        <button
          onClick={onLeave}
          className="text-sm text-white/80 hover:text-white font-medium border-b border-transparent hover:border-white/50 transition-all duration-200 px-1 py-0.5"
          aria-label="Leave group"
        >
          LEAVE GROUP
        </button>
      </div>
    </header>
  );
}

"use client";
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

export default function CommentForm({ value, onChange, onSubmit, isSubmitting }) {
  const handleEnterKey = (e) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };
  
  return (
    <div className="flex space-x-2 bg-black/40 backdrop-blur-sm border border-gray-700 rounded-lg focus-within:ring-2 focus-within:ring-white/20 focus-within:border-gray-600 transition-all duration-300 w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 text-white/90 px-4 py-3 border-none focus:outline-none placeholder-white/40 bg-transparent w-full"
        placeholder="ADD COMMENT..."
        disabled={isSubmitting}
        onKeyDown={handleEnterKey}
        aria-label="Add a comment"
      />
      <button
        onClick={onSubmit}
        disabled={!value.trim() || isSubmitting}
        className="bg-white/10 text-white/80 p-3 hover:bg-white/20 hover:text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-r-lg"
        aria-label="Submit comment"
      >
        <PaperAirplaneIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
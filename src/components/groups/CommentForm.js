import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

export default function CommentForm({ value, onChange, onSubmit, isSubmitting }) {
  return (
    <div className="flex space-x-2 border-2 border-black rounded-none focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-2 transition-all duration-150">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 text-black px-4 py-3 border-none focus:outline-none placeholder-black/30 text-sm sm:text-base bg-white"
        placeholder="ADD COMMENT..."
        disabled={isSubmitting}
        aria-label="Add a comment"
      />
      <button
        onClick={onSubmit}
        disabled={!value.trim() || isSubmitting}
        className="bg-black text-white p-3 border-l-2 border-black hover:bg-white hover:text-black transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        aria-label="Submit comment"
      >
        <PaperAirplaneIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
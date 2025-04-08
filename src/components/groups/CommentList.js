import { useEffect, useRef, useState } from "react";

export default function CommentList({ comments = [] }) {
  const scrollContainerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const prevCommentsLength = useRef(comments.length);

  // Track scroll position
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
    
    setIsAtBottom(atBottom);
    
    // If user scrolls to bottom, reset unread count
    if (atBottom) {
      setUnreadCount(0);
    }
  };

  // Scroll to bottom only if user is at bottom
  useEffect(() => {
    if (isAtBottom && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [comments, isAtBottom]);

  // Track new comments when not at bottom
  useEffect(() => {
    if (comments.length > prevCommentsLength.current && !isAtBottom) {
      setUnreadCount(prev => prev + (comments.length - prevCommentsLength.current));
    }
    prevCommentsLength.current = comments.length;
  }, [comments.length, isAtBottom]);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
      setUnreadCount(0);
    }
  };

  return (
    <div className="comment-section relative">
    <h4 className="text-sm font-medium text-white/70 mb-3">
      COMMENTS ({comments.length})
    </h4>
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
    >
      {comments.length > 0 ? (
        comments.map((comment, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 hover:bg-black/30 rounded-lg transition-colors duration-200"
          >
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-black/50 border border-gray-700 flex items-center justify-center">
              <span className="text-xs font-medium text-white/80 uppercase">
                {comment.createdBy?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/90 font-medium">{comment.text}</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-white/60">
                  {comment.createdBy || 'Anonymous'}
                </p>
                <span className="text-white/30">•</span>
                <p className="text-xs text-white/60">
                  {new Date(comment.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: 'numeric',
                    month: 'short'
                  })}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="p-3 text-center">
          <p className="text-sm text-white/50 italic">No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>

    {unreadCount > 0 && (
      <button
        onClick={scrollToBottom}
        className="absolute right-4 bottom-16 bg-black/70 text-white/90 rounded-full p-2 border border-gray-700 hover:bg-black/80 transition-all duration-200 flex items-center shadow-lg"
        title="Scroll to bottom"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
        <span className="ml-1 text-xs">{unreadCount} new</span>
      </button>
    )}
  </div>
  );
}
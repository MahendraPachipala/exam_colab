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
      <h4 className="text-sm font-medium text-gray-700 mb-3 sm:mb-2">
        COMMENTS ({comments.length})
      </h4>
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded transition-colors duration-150"
            >
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300">
                <span className="text-xs font-medium text-gray-600 uppercase">
                  {comment.createdBy?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 font-medium">{comment.text}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-500">
                    {comment.createdBy || 'Anonymous'}
                  </p>
                  <span className="text-gray-300">•</span>
                  <p className="text-xs text-gray-500">
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
            <p className="text-sm text-gray-500 italic">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>

      {unreadCount > 0 && (
        <button
          onClick={scrollToBottom}
          className="absolute right-4 bottom-16 bg-black text-white rounded-full p-2 shadow-md hover:bg-gray-900 transition-colors duration-150 flex items-center"
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
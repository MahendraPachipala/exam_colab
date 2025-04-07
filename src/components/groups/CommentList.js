export default function CommentList({ comments = [] }) {
  return (
    <div className="comment-section">
      <h4 className="text-sm font-medium text-gray-700 mb-3 sm:mb-2">
        COMMENTS ({comments.length})
      </h4>
      <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {comments.length > 0 ? (
          comments.map((comment,index) => (
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
    </div>
  );
}
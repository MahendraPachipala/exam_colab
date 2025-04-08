import { useState } from 'react';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

export default function QuestionItem({ question, onAddComment }) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const handleAddComment = async () => {
    if (!newComment.trim() || isSubmitting) return;
   
    try {
      const cmt = newComment.trim();
      setNewComment('');
      await onAddComment(question._id, newComment);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-black/50 backdrop-blur-md rounded-xl border border-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_25px_rgba(0,0,0,0.4)] transition-all duration-300">
      <div className="p-5 border-b border-gray-800">
        <h3 className="text-lg font-bold text-white/90 tracking-tight">
          QUESTION {question.questionNumber}
        </h3>
      </div>
      
      <div className="p-5">
        {imageError ? (
          <div className="w-full h-48 bg-black/30 flex items-center justify-center rounded-lg border border-dashed border-gray-700">
            <span className="text-white/50">Image not available</span>
          </div>
        ) : (
          <img 
            src={question.image} 
            alt={`Question ${question.questionNumber}`} 
            className="w-full h-auto max-h-96 object-contain rounded-lg bg-black/30 border border-gray-800"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        )}
      </div>
      
      <div className="p-5 border-t border-gray-800 space-y-5">
        <CommentList comments={question.comments} />
        <CommentForm 
          value={newComment}
          onChange={setNewComment}
          onSubmit={handleAddComment}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
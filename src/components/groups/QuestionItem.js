import { useState } from 'react';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

export default function QuestionItem({ question, onAddComment }) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddComment = async () => {
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await onAddComment(question._id, newComment);
      if (result.success) {
        setNewComment('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-sm border border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] hover:shadow-[0_6px_0_0_rgba(0,0,0,1)] transition-shadow duration-200">
      <div className="p-4 sm:p-6 border-b border-black">
        <h3 className="text-lg sm:text-xl font-bold text-black tracking-tight">
          QUESTION {question.questionNumber}
        </h3>
      </div>
      
      <div className="p-4 sm:p-6">
        {imageError ? (
          <div className="w-full h-48 sm:h-64 bg-gray-100 flex items-center justify-center rounded-sm border-2 border-dashed border-gray-300">
            <span className="text-gray-500">Image not available</span>
          </div>
        ) : (
          <img 
            src={question.image} 
            alt={`Question ${question.questionNumber}`} 
            className="w-full h-auto max-h-96 object-contain rounded-sm bg-gray-50 border border-black"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        )}
      </div>
      
      <div className="p-4 sm:p-6 border-t border-black space-y-6">
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
import QuestionItem from './QuestionItem';
import socket from "@/lib/socket";


export default function QuestionList({ questions, onAddComment }) {
  

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">No questions yet. Be the first to add one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {questions.map((question) => (
        <QuestionItem 
          key={question._id} 
          question={question} 
          onAddComment={onAddComment} 
        />
      ))}
    </div>
  );
}
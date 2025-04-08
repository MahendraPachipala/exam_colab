import QuestionItem from './QuestionItem';


export default function QuestionList({ questions, onAddComment }) {
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
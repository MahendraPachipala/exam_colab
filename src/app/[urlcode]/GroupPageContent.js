'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import GroupHeader from '@/components/groups/GroupHeader';
import QuestionForm from '@/components/groups/QuestionForm';
import QuestionList from '@/components/groups/QuestionList';
import LoadingSpinner from '@/components/groups/LoadingSpinner';
import socket from '@/lib/socket';

export default function GroupPageContent({ groupId, groupCode }) {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const handleMessage = async (data) => {
      try {
        const res = await axios.get(`/api/groups/${groupCode}/${data}`);
        setQuestions((prevQuestions)=>[res.data, ...prevQuestions]);
      } catch (err) {
        console.error("Error fetching from API:", err.response?.data || err.message);
      }
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, []);

  const handleAddQuestion = async (newQuestion) => {
    try {
      const { data } = await axios.post(`/api/groups/${groupCode}`, newQuestion);
      socket.emit("message",data._id);
      return { success: true };
    } catch (error) {
      console.error('Error adding question:', error);
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const { data } = await axios.get(`/api/groups/${groupCode}`);
        setQuestions(data.questions || []);
      } catch (error) {
        console.error('Error fetching group data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupData();
  }, [groupCode]);

  useEffect(() => {
    const handlecomment = async (data) => {
      try {
        const {questionId,commentText} = data;
        setQuestions((prevQuestions) => {
          const questionIndex = prevQuestions.findIndex(q => q._id === questionId);
          if (questionIndex !== -1) {
            const updatedQuestion = {
              ...prevQuestions[questionIndex],
              comments: [...prevQuestions[questionIndex].comments, { text: commentText, createdAt: new Date() }]
            };
            return [
              ...prevQuestions.slice(0, questionIndex),
              updatedQuestion,
              ...prevQuestions.slice(questionIndex + 1)
            ];
          }
          return prevQuestions;
        });
      } catch (err) {
        console.error("Error fetching from API:", err.response?.data || err.message);
      }
    };

    socket.on("comment", handlecomment);

    return () => {
      socket.off("comment", handlecomment);
    };
  }, []);
  
  const handleAddComment = async (questionId, commentText) => {
    try {
      socket.emit("comment",{questionId, commentText});
      await axios.post('/api/comments', {
        questionId,
        text: commentText,
      });
      return { success: true };
    } catch (error) {
      console.error('Error adding comment:', error);
      return { success: false, error: error.message };
    }
  };

  if (isLoading) {
    return <LoadingSpinner groupCode={groupCode} />;
  }

  return (
    <div className="min-h-screen bg-black/95 flex flex-col">
      <GroupHeader 
        groupCode={groupCode} 
        onLeave={() => router.push('/')}
      />
      
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* New Question Section */}
        <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-gray-800 shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all duration-300">
          <h2 className="text-xl font-bold text-white/90 tracking-tight border-b border-white/10 pb-3 mb-4">
            NEW QUESTION
          </h2>
          <QuestionForm onSubmit={handleAddQuestion} />
        </div>

        {/* Group Questions Section */}
        <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-gray-800 shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all duration-300">
          <h2 className="text-xl font-bold text-white/90 tracking-tight border-b border-white/10 pb-3 mb-4">
            GROUP QUESTIONS
          </h2>
          <QuestionList 
            questions={questions} 
            onAddComment={handleAddComment} 
          />
          
          {questions.length === 0 && (
            <p className="text-white/50 text-center py-6 text-sm tracking-wider">
              NO QUESTIONS YET. BE THE FIRST TO ASK.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
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
    console.log("API response:", res.data);
    setQuestions((prevQuestions)=>[res.data, ...prevQuestions]);
  } catch (err) {
    console.error("Error fetching from API:", err.response?.data || err.message);
  }
      // setQuestions((prevQuestions) => [data, ...prevQuestions])
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
      // setQuestions((prevQuestions) => [data, ...prevQuestions])
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
    <div className="min-h-screen bg-white flex flex-col">
      <GroupHeader 
        groupCode={groupCode} 
        onLeave={() => router.push('/')}
        className="border-b border-black"
      />
      
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6">
        {/* New Question Section */}
        <div className="bg-white rounded-sm p-6 sm:p-8 space-y-6 sm:space-y-8 border border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] hover:shadow-[0_6px_0_0_rgba(0,0,0,1)] transition-shadow duration-200 mb-6 sm:mb-8">
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-black tracking-tight border-b border-black pb-2">
              NEW QUESTION
            </h2>
            <QuestionForm onSubmit={handleAddQuestion} />
          </div>
        </div>

        {/* Group Questions Section */}
        <div className="bg-white rounded-sm p-6 sm:p-8 space-y-6 sm:space-y-8 border border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] hover:shadow-[0_6px_0_0_rgba(0,0,0,1)] transition-shadow duration-200">
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-black tracking-tight border-b border-black pb-2">
              GROUP QUESTIONS
            </h2>
            <QuestionList 
              questions={questions} 
              onAddComment={handleAddComment} 
            />
            
            {questions.length === 0 && (
              <p className="text-black/60 text-center py-6 sm:py-8 text-sm sm:text-base tracking-wider">
                NO QUESTIONS YET. BE THE FIRST TO ASK.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
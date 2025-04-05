'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [joinCode, setJoinCode] = useState('');
  const router = useRouter();

  const handleCreateGroup = async () => {
    const res = await fetch('/api/groups', { method: 'POST' });
    const { code } = await res.json();
    router.push(`/${code}`);
  };

  const handleJoinGroup = (e) => {
    e.preventDefault();
    if (joinCode.trim()) {
      router.push(`/${joinCode.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-sm p-6 sm:p-8 space-y-6 sm:space-y-8 border border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] hover:shadow-[0_6px_0_0_rgba(0,0,0,1)] transition-shadow duration-200">
        <div className="text-center space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-black tracking-tight">
            EXAM COLLAB
          </h1>
          <div className="h-px w-12 sm:w-16 mx-auto bg-black"></div>
          <p className="text-black/60 text-sm sm:text-base font-light tracking-wider">ACADEMIC COOPERATION PLATFORM</p>
        </div>
        
        <button
          onClick={handleCreateGroup}
          className="w-full bg-white text-black font-medium py-3 px-4 border-2 border-black rounded-none transition-all duration-150 hover:bg-black hover:text-white hover:shadow-[0_4px_0_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black"
        >
          CREATE NEW GROUP
        </button>
        
        <div className="relative flex items-center my-4 sm:my-6">
          <div className="flex-grow border-t border-black/20"></div>
          <span className="mx-2 sm:mx-4 text-xs sm:text-sm text-black/40 font-medium">OR</span>
          <div className="flex-grow border-t border-black/20"></div>
        </div>
        
        <form onSubmit={handleJoinGroup} className="space-y-4 sm:space-y-6">
          <div className="space-y-1 sm:space-y-2">
            <label htmlFor="code" className="block text-xs font-medium text-black/60 mb-1 tracking-widest">
              ENTER INVITATION CODE
            </label>
            <div className="relative">
              <input
                id="code"
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-black rounded-none focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 text-black placeholder-black/30 text-sm sm:text-base"
                placeholder="ABCD-EFGH-IJKL"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white font-medium py-3 px-4 border-2 border-black rounded-none transition-all duration-150 hover:bg-white hover:text-black hover:shadow-[0_4px_0_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
          >
            JOIN GROUP
          </button>
        </form>
      </div>
    </div>
  );
}
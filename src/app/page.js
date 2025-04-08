"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import CryptoJS from "crypto-js";

export default function Home() {
  const [joinCode, setJoinCode] = useState("");
  const router = useRouter();
  const [isinvalid, setIsInvalid] = useState(false);
  const secret = "This is really a secret";

  const handleCreateGroup = async () => {
    const res = await axios.post("/api/groups");
    const { code } = res.data;
    
    const encrypted = CryptoJS.AES.encrypt(code, secret).toString();
    const urlSafeEncrypted = encodeURIComponent(encrypted);
    router.push(`/${urlSafeEncrypted}`);
  };

  const handleJoinGroup = async(e) => {
    e.preventDefault();
    const res = await axios.get(`/api/groups/${joinCode}`);
    
    if (joinCode.trim()) {
    if (res.data.isexist) {
      const encrypted = CryptoJS.AES.encrypt(code, secret).toString();
      const urlSafeEncrypted = encodeURIComponent(encrypted);
      router.push(`/${urlSafeEncrypted}`);
    }
    else{
      setIsInvalid(true);
      setTimeout(() => {
        setIsInvalid(false);
      }, 5000);
    }
  }
  };

  return (
    <div className="min-h-screen bg-black/95 flex flex-col justify-center items-center p-4 sm:p-6 backdrop-blur-sm">
      <div className="w-full max-w-md bg-black/70 backdrop-blur-lg rounded-xl p-8 space-y-8 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.7)] transition-all duration-300">
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-white/90 tracking-tight">
            EXAM COLLAB
          </h1>
          <div className="h-px w-16 mx-auto bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
          <p className="text-white/60 text-sm font-light tracking-wider">
            ACADEMIC COOPERATION PLATFORM
          </p>
        </div>

        <button
          onClick={handleCreateGroup}
          className="w-full bg-white/10 text-white/90 font-medium py-3 px-4 border border-white/20 rounded-lg transition-all duration-200 hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black/70"
        >
          CREATE NEW GROUP
        </button>

        <div className="relative flex items-center my-6">
          <div className="flex-grow border-t border-white/20"></div>
          <span className="mx-4 text-xs text-white/40 font-medium">OR</span>
          <div className="flex-grow border-t border-white/20"></div>
        </div>

        <form onSubmit={handleJoinGroup} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="code"
              className="block text-xs font-medium text-white/70 mb-2 tracking-widest uppercase"
            >
              ENTER INVITATION CODE
            </label>
            <div className="relative">
              <input
                id="code"
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-black/50 text-white/90 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent placeholder-white/40 text-sm"
                placeholder="ABCD-EFGH-IJKL"
                required
              />
            </div>
            {isinvalid && <p className="text-xs text-red-800 mt-2 tracking-wider">
              Invalid code
            </p>
            }
          </div>

          <button
            type="submit"
            className="cursor-pointer w-full text-zinc-400 hover:text-zinc-200 backdrop-blur-lg bg-gradient-to-tr from-transparent via-[rgba(121,121,121,0.16)] to-transparent rounded-md py-2 px-6 shadow shadow-zinc-500 hover:shadow-zinc-400 duration-700"
          >
            JOIN GROUP
          </button>
        </form>
      </div>

      
    </div>
  );
}

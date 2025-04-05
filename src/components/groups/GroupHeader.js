export default function GroupHeader({ groupCode, onLeave }) {
  return (
    <header className="bg-white border-b border-black sticky top-0 z-10 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-lg sm:text-xl font-bold text-black tracking-tight">
            GROUP: 
          </h1>
          <span className="font-mono bg-black text-white px-2 py-1 text-sm sm:text-base rounded-sm">
            {groupCode}
          </span>
        </div>
        <button 
          onClick={onLeave}
          className="text-sm text-black font-medium border-b-2 border-transparent hover:border-black transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 px-1 py-0.5"
          aria-label="Leave group"
        >
          LEAVE GROUP
        </button>
      </div>
    </header>
  );
}
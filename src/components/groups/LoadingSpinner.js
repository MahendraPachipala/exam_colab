export default function LoadingSpinner({ groupCode }) {
  return (
    <div className="min-h-screen bg-black/95 flex flex-col items-center justify-center p-6 backdrop-blur-md">
      <div className="relative flex flex-col items-center justify-center space-y-6">
        {/* Double animated spinner with glass effect */}
        <div className="relative h-20 w-20">
          <div className="animate-spin rounded-full h-full w-full border-t-2 border-b-2 border-white/90 border-r-transparent border-l-transparent absolute backdrop-blur-sm"></div>
          <div className="animate-spin-reverse rounded-full h-3/4 w-3/4 border-t-2 border-b-2 border-white/50 border-r-transparent border-l-transparent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 backdrop-blur-xs"></div>
        </div>

        {/* Group code display with glass panel */}
        <div className="text-center space-y-4 bg-black/50 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <h3 className="text-xl font-mono font-bold text-white/90 tracking-wider">
            {groupCode}
          </h3>
          <div className="flex items-center justify-center space-x-2">
            <span className="h-1.5 w-1.5 bg-white/80 rounded-full animate-pulse"></span>
            <span className="h-1.5 w-1.5 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
            <span className="h-1.5 w-1.5 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
          </div>
          <p className="text-sm text-white/60 mt-4 tracking-wider uppercase">
            Loading Group Data...
          </p>
        </div>
      </div>

      {/* Subtle floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white/10 rounded-full"
            
          />
        ))}
      </div>
    </div>
  );
}
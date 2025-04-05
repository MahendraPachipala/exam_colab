export default function LoadingSpinner({ groupCode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="relative flex flex-col items-center justify-center space-y-6">
        {/* Animated spinner with shadow */}
        <div className="relative h-16 w-16">
          <div className="animate-spin rounded-full h-full w-full border-t-2 border-b-2 border-black absolute"></div>
          <div className="animate-spin-reverse rounded-full h-3/4 w-3/4 border-t-2 border-b-2 border-black/30 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* Group code display */}
        <div className="text-center space-y-2">
          <h3 className="text-lg font-mono font-bold text-black tracking-wider">
            {groupCode}
          </h3>
          <div className="flex items-center justify-center space-x-2">
            <span className="h-1 w-1 bg-black rounded-full animate-pulse"></span>
            <span className="h-1 w-1 bg-black rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
            <span className="h-1 w-1 bg-black rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
          </div>
          <p className="text-sm text-black/60 mt-4 tracking-wider">
            LOADING GROUP...
          </p>
        </div>
      </div>
    </div>
  );
}
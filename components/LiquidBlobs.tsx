
import React from 'react';

const LiquidBlobs: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <svg className="hidden">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" 
              result="goo" 
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      
      <div 
        className="relative w-full h-full" 
        style={{ filter: 'url(#goo)' }}
      >
        <div className="blob absolute top-[10%] left-[20%] w-64 h-64 bg-amber-400/30 rounded-full animate-liquid-1"></div>
        <div className="blob absolute top-[40%] left-[50%] w-80 h-80 bg-rose-500/30 rounded-full animate-liquid-2"></div>
        <div className="blob absolute bottom-[20%] left-[30%] w-72 h-72 bg-sky-400/30 rounded-full animate-liquid-3"></div>
        <div className="blob absolute top-[20%] right-[20%] w-96 h-96 bg-purple-500/30 rounded-full animate-liquid-4"></div>
        <div className="blob absolute bottom-[10%] right-[30%] w-60 h-60 bg-emerald-400/30 rounded-full animate-liquid-5"></div>
      </div>

      <style>{`
        .blob {
          mix-blend-mode: multiply;
        }
        .dark .blob {
          mix-blend-mode: plus-lighter;
          opacity: 0.15;
        }
        @keyframes liquid-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(100px, 80px) scale(1.2); }
          66% { transform: translate(-50px, 150px) scale(0.8); }
        }
        @keyframes liquid-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-120px, -60px) scale(0.9); }
          66% { transform: translate(80px, -120px) scale(1.1); }
        }
        @keyframes liquid-3 {
          0%, 100% { transform: translate(0, 0) scale(1.1); }
          50% { transform: translate(150px, -100px) scale(0.9); }
        }
        @keyframes liquid-4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40% { transform: translate(-100px, 100px) scale(1.2); }
          70% { transform: translate(50px, -50px) scale(0.85); }
        }
        @keyframes liquid-5 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-150px, 50px) scale(1.3); }
        }
        .animate-liquid-1 { animation: liquid-1 18s infinite ease-in-out; }
        .animate-liquid-2 { animation: liquid-2 22s infinite ease-in-out; }
        .animate-liquid-3 { animation: liquid-3 26s infinite ease-in-out; }
        .animate-liquid-4 { animation: liquid-4 20s infinite ease-in-out; }
        .animate-liquid-5 { animation: liquid-5 24s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default LiquidBlobs;

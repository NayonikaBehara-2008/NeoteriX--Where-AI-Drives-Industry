
import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Heart, RefreshCw, Smartphone, CreditCard, ChevronRight, Archive, Play, Sparkles, Loader2, Key } from 'lucide-react';
import { IncomingReward, NGO, CurrencyConfig, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { generateImpactVideo } from '../services/geminiService';

interface CaptureRewardProps {
  incoming: IncomingReward | null;
  onConfirm: (reward: IncomingReward) => void;
  onSimulate: () => void;
  selectedNGO: NGO;
  onSelectNGO: () => void;
  currency: CurrencyConfig;
  lang: Language;
  hasVeoKey: boolean;
  onOpenKeyPicker: () => void;
}

const CaptureReward: React.FC<CaptureRewardProps> = ({ 
  incoming, onConfirm, onSimulate, selectedNGO, onSelectNGO, currency, lang, hasVeoKey, onOpenKeyPicker 
}) => {
  const t = TRANSLATIONS[lang];
  const [isConfirming, setIsConfirming] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  const handleConfirm = async (reward: IncomingReward) => {
    setIsConfirming(true);
    
    // Start video generation in parallel if possible
    if (hasVeoKey) {
      setGeneratingVideo(true);
      setVideoProgress(10);
      try {
        const interval = setInterval(() => {
          setVideoProgress(prev => Math.min(prev + Math.random() * 5, 95));
        }, 3000);
        
        const url = await generateImpactVideo(selectedNGO);
        setVideoUrl(url);
        clearInterval(interval);
        setVideoProgress(100);
      } catch (err: any) {
        console.error("Video gen failed", err);
        // Handle race conditions or invalid keys by prompting user to select a key again.
        if (err?.message?.includes("Requested entity was not found")) {
           onOpenKeyPicker();
        }
      } finally {
        setGeneratingVideo(false);
      }
    }

    // Traditional confirmation logic
    setTimeout(() => {
      onConfirm(reward);
      setIsConfirming(false);
    }, 1200);
  };

  if (videoUrl) {
    return (
      <div className="max-w-2xl mx-auto animate-in zoom-in-95 duration-700">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Your Impact Visualized
          </div>
          <h1 className="text-4xl font-black tracking-tight dark:text-white text-zinc-900">Joy Moment Generated</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">A personalized memory of the goodness you shared today.</p>
        </div>

        <div className="relative group rounded-[3rem] overflow-hidden shadow-2xl shadow-zinc-900/10 border border-white/50 dark:border-zinc-800 bg-black aspect-video">
           <video 
              src={videoUrl} 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/60 mb-1">Impact Video</p>
                <p className="text-lg font-bold text-white tracking-tight">{selectedNGO.name}</p>
              </div>
              <button 
                onClick={() => setVideoUrl(null)}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all"
              >
                Close Moment
              </button>
            </div>
        </div>
        
        <div className="mt-8 flex justify-center">
           <button 
            className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-transform"
            onClick={() => window.open(videoUrl, '_blank')}
          >
            <Archive className="w-4 h-4" /> Download Moment
          </button>
        </div>
      </div>
    );
  }

  if (!incoming) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-sm mx-auto animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-xl shadow-zinc-200/50 dark:shadow-none flex items-center justify-center mb-8 border border-zinc-100 dark:border-zinc-800 animate-bounce-slow">
          <Archive className="w-9 h-9 text-amber-600/30 dark:text-zinc-600" />
        </div>
        <h2 className="text-2xl font-black mb-3 dark:text-white text-zinc-900 tracking-tight">JoyJar Bridge</h2>
        <p className="text-zinc-400 dark:text-zinc-500 text-sm leading-relaxed mb-10 font-medium">
          Sync with your payment apps to capture savings. Every confirmed gift generates a cinematic AI video of your impact.
        </p>
        <button 
          onClick={onSimulate}
          className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 w-full py-5 rounded-[1.75rem] font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-3 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 shadow-xl shadow-zinc-200 dark:shadow-none"
        >
          <RefreshCw className="w-5 h-5" /> Simulate Reward
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto animate-in slide-in-from-bottom-2 duration-400">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-400/10 text-amber-700 dark:text-amber-400 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-amber-100 dark:border-amber-400/20 shadow-sm">
          <ShieldCheck className="w-4 h-4" /> Secure Sync Verified
        </div>
        <h1 className="text-4xl font-black tracking-tighter dark:text-white text-zinc-900">Savings Captured</h1>
        <p className="text-zinc-400 dark:text-zinc-500 text-sm mt-1 font-medium">Found in your {incoming.source} session</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 p-10 shadow-[0_30px_60px_rgba(0,0,0,0.08)] dark:shadow-none relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-3xl"></div>
        
        <div className="flex items-center justify-between mb-12 relative z-10">
          <div>
            <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Savings</p>
            <p className="text-5xl font-black text-amber-600 dark:text-amber-400 tracking-tighter">{currency.symbol}{incoming.amount.toFixed(2)}</p>
          </div>
          <ArrowRight className="text-zinc-200 dark:text-zinc-700 w-7 h-7" />
          <div className="text-right">
            <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">To NGO</p>
            <p className="text-base font-black truncate max-w-[140px] dark:text-white text-zinc-900 tracking-tight">{selectedNGO.name}</p>
            <button onClick={onSelectNGO} className="text-[10px] font-black text-amber-600 dark:text-amber-400 hover:opacity-70 transition-opacity underline decoration-dotted underline-offset-4 tracking-widest uppercase mt-1">Change</button>
          </div>
        </div>

        <button 
          onClick={() => handleConfirm(incoming)}
          disabled={isConfirming}
          className={`relative z-10 w-full py-6 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-4 transition-all ${
            isConfirming 
              ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500'
              : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-2xl shadow-zinc-900/10 hover:opacity-90 hover:-translate-y-1 active:translate-y-0'
          }`}
        >
          {isConfirming ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <><Archive className="w-5 h-5" /> Confirm & Gift</>
          )}
        </button>

        {generatingVideo && (
           <div className="mt-8 animate-in fade-in duration-500">
             <div className="flex items-center justify-between mb-3">
               <div className="flex items-center gap-2">
                 <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Generating Impact Video...</span>
               </div>
               <span className="text-[10px] font-black text-amber-500">{Math.round(videoProgress)}%</span>
             </div>
             <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(245,158,11,0.5)]" 
                  style={{ width: `${videoProgress}%` }}
                />
             </div>
             <p className="text-[9px] text-zinc-400 dark:text-zinc-500 mt-4 text-center font-bold tracking-widest uppercase">Veo is crafting a cinematic 3D moment for you</p>
           </div>
        )}
        
        {!hasVeoKey && !isConfirming && (
          <button 
            onClick={onOpenKeyPicker}
            className="w-full mt-6 py-3 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:border-amber-500 hover:text-amber-500 transition-all"
          >
            <Key className="w-3.5 h-3.5" /> Enable Impact Videos
          </button>
        )}
        
        {!generatingVideo && (
          <p className="relative z-10 text-center text-[10px] text-zinc-400 dark:text-zinc-500 font-bold mt-8 leading-relaxed px-4 tracking-wide">
            Gifts are directed to verified projects. You gain <strong>{Math.floor(incoming.amount * 10)} JoyCredits</strong>.
          </p>
        )}
      </div>
      
      <div className="mt-10 p-7 bg-white dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 flex items-center justify-between group cursor-pointer transition-all hover:shadow-xl hover:shadow-zinc-900/5 dark:hover:bg-zinc-800">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-amber-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
            <Archive className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-base font-black dark:text-zinc-200 text-zinc-900 tracking-tight">Auto-Gift Ready</p>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-[0.2em] mt-0.5">Synced with Pay Apps</p>
          </div>
        </div>
        <ChevronRight className="w-6 h-6 text-zinc-300 dark:text-zinc-600 group-hover:translate-x-2 transition-transform" />
      </div>
    </div>
  );
};

export default CaptureReward;

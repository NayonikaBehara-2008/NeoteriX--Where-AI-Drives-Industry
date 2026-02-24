
import React, { useState } from 'react';
import { ArrowRight, Sparkles, UserPlus, Archive, CheckCircle2 } from 'lucide-react';
import { Region, Language } from '../types';
import { LANGUAGES, REGION_CONFIGS } from '../constants';
import LiquidBlobs from './LiquidBlobs';

interface LoginProps {
  onLogin: (region: Region, language: Language, isNewUser?: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedRegion, setSelectedRegion] = useState<Region>('US');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRegion, selectedLanguage);
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col lg:flex-row overflow-hidden font-sans selection:bg-amber-100 selection:text-amber-900 relative">
      
      {/* Dynamic Visual Side */}
      <div className="hidden lg:flex lg:w-3/5 bg-zinc-950 relative items-center justify-center p-24 overflow-hidden">
        {/* Organic Liquid Blobs Background */}
        <LiquidBlobs className="opacity-60" />

        <div className="relative z-10 max-w-xl w-full">
          <div className="mb-20">
             <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-5 rounded-[2.5rem] w-fit mb-10 shadow-[0_20px_60px_-15px_rgba(245,158,11,0.5)] animate-float">
               <Archive className="text-zinc-950 w-12 h-12" />
             </div>
             <div className="space-y-4">
                <h1 className="text-8xl font-black text-white leading-[0.9] tracking-tighter italic">
                  The <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-sky-300">Heart</span> <br/> 
                  in your jar.
                </h1>
                <p className="text-2xl text-zinc-400 leading-relaxed font-medium max-w-lg">
                  Transform your shopping rewards into meaningful change. Small coins, massive smiles.
                </p>
             </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 mb-20">
            <FeatureItem text="Synced with PhonePe, GPay, PayPal" />
            <FeatureItem text="Transparent 1:1 donation verification" />
            <FeatureItem text="Earn JoyCredits for every reward gifted" />
          </div>

          <div className="flex items-center gap-12">
            <div className="group cursor-default">
              <p className="text-5xl font-black text-white tracking-tighter mb-1 group-hover:scale-105 transition-transform duration-500">$2.4M</p>
              <p className="text-[10px] text-amber-400 font-black uppercase tracking-[0.4em]">Joy Created</p>
            </div>
            <div className="w-px h-12 bg-white/10"></div>
            <div className="group cursor-default">
              <p className="text-5xl font-black text-white tracking-tighter mb-1 group-hover:scale-105 transition-transform duration-500">128</p>
              <p className="text-[10px] text-rose-400 font-black uppercase tracking-[0.4em]">Partner NGOs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Elegant Glass Form Side */}
      <div className="flex-1 flex flex-col justify-center p-8 lg:p-24 relative bg-[#fdfbf7] z-20 overflow-y-auto no-scrollbar">
        <div className="max-w-md w-full mx-auto">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-4 mb-16 group">
            <div className="bg-amber-500 p-2.5 rounded-2xl group-hover:rotate-12 transition-transform">
              <Archive className="text-zinc-950 w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tighter">JoyJar</h1>
          </div>

          <div className="mb-14">
            <h2 className="text-5xl font-black text-zinc-900 mb-4 tracking-tighter">Fill the jar.</h2>
            <p className="text-zinc-500 text-xl font-medium leading-relaxed">Join 85,000+ others redirecting rewards to causes that matter.</p>
          </div>

          <form className="space-y-7" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] ml-3">Email Access</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@joyjar.com"
                className="w-full bg-white border border-zinc-200 rounded-[1.75rem] py-5 px-8 outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-bold text-zinc-900 shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] ml-3">Secure Pin</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-zinc-200 rounded-[1.75rem] py-5 px-8 outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-bold text-zinc-900 shadow-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
               <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] ml-3">Region</label>
                <div className="relative">
                  <select 
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value as Region)}
                    className="w-full bg-white border border-zinc-200 rounded-[1.5rem] py-4.5 px-6 text-xs font-black outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 cursor-pointer text-zinc-800 appearance-none shadow-sm"
                  >
                    {Object.keys(REGION_CONFIGS).map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] ml-3">Language</label>
                <div className="relative">
                  <select 
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                    className="w-full bg-white border border-zinc-200 rounded-[1.5rem] py-4.5 px-6 text-xs font-black outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 cursor-pointer text-zinc-800 appearance-none shadow-sm"
                  >
                    {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-5 pt-6">
              <button 
                type="submit"
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] transition-all active:scale-[0.97] flex items-center justify-center gap-4 group"
              >
                Sign In <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex items-center gap-6 py-4">
                <div className="h-px flex-1 bg-zinc-200"></div>
                <span className="text-[11px] font-black text-zinc-300 uppercase tracking-[0.3em]">Joymakers</span>
                <div className="h-px flex-1 bg-zinc-200"></div>
              </div>

              <button 
                type="button"
                onClick={() => onLogin(selectedRegion, selectedLanguage)}
                className="w-full bg-white border-2 border-zinc-100 text-zinc-900 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-4 transition-all hover:bg-zinc-50 hover:border-amber-200 active:scale-[0.97] shadow-sm group"
              >
                <Sparkles className="w-5 h-5 text-amber-500 group-hover:scale-125 transition-transform" /> Quick Demo Session
              </button>
            </div>
          </form>

          <div className="mt-16 text-center">
            <button 
              onClick={() => onLogin(selectedRegion, selectedLanguage, true)}
              className="text-zinc-400 hover:text-zinc-900 font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 mx-auto transition-all group active:scale-95"
            >
              <UserPlus className="w-6 h-6 group-hover:rotate-12 transition-transform" /> Become a Heart
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float { animation: float 6s infinite ease-in-out; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

const FeatureItem: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center gap-5 group">
    <div className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center group-hover:bg-amber-500/20 transition-all duration-500 shadow-xl border border-white/5">
      <CheckCircle2 className="w-4 h-4 text-amber-400" />
    </div>
    <span className="text-zinc-400 font-bold text-lg tracking-wide group-hover:text-zinc-300 transition-colors">{text}</span>
  </div>
);

export default Login;

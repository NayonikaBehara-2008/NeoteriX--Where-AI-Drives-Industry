
import React, { useState, useEffect } from 'react';
import { Rocket, Sparkles, TrendingUp, Cpu, Heart, ArrowRight, Zap, Users, Shield, Globe, Terminal } from 'lucide-react';
import { UserProfile } from '../types';
import { translations } from '../translations';

const QUOTES = [
  { text: "Industry 4.0 is not about machines, it's about information symmetry.", author: "NeoteriX Intelligence" },
  { text: "Quality is not an act, it is a habit. Build with intention.", author: "Aristotle (Dev Edition)" },
  { text: "Your most unhappy customers are your greatest source of learning.", author: "Bill Gates" },
  { text: "Great things are done by a series of small things brought together.", author: "Vincent Van Gogh" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Simplicity is the soul of efficiency. Make it intuitive.", author: "Austin Freeman" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" }
];

interface HomeViewProps {
  user: UserProfile;
  onStart: () => void;
  onCommunity: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ user, onStart, onCommunity }) => {
  const [quote, setQuote] = useState(QUOTES[0]);
  const t = (translations[user.language] || translations['English']).home;

  useEffect(() => {
    const day = new Date().getDate();
    setQuote(QUOTES[day % QUOTES.length]);
  }, []);

  return (
    <div className="relative space-y-32 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      {/* Hero Section */}
      <section className="relative z-10 overflow-hidden bg-white/40 dark:bg-slate-900/40 rounded-[5rem] p-12 lg:p-24 shadow-2xl flex flex-col lg:flex-row items-center gap-20 group border border-white/50 dark:border-slate-800 backdrop-blur-3xl">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-fuchsia-600/5 blur-[120px] rounded-full"></div>
        
        <div className="relative z-10 flex-1 space-y-12">
          <div className="inline-flex items-center gap-3 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 px-6 py-3 rounded-full text-[10px] font-black tracking-widest border border-slate-100 dark:border-slate-700 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            NEOTERIX AI • WHERE AI DRIVES INDUSTRY
          </div>
          <h2 className="text-7xl lg:text-[9rem] font-black text-slate-950 dark:text-white tracking-tighter leading-[0.8] font-outfit uppercase">
            {t.hero.split(' ').slice(0, 2).join(' ')} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-teal-500">
              {t.hero.split(' ').slice(2).join(' ')}
            </span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-2xl lg:text-3xl font-medium leading-relaxed max-w-2xl">
            {t.sub}
          </p>
          <div className="flex flex-wrap gap-8 pt-6">
            <button 
              onClick={onStart} 
              className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-12 py-6 rounded-3xl font-black text-xl flex items-center gap-4 transition-all hover:-translate-y-2 active:scale-95 shadow-2xl group"
            >
              {t.start} <Rocket className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
            <button 
              onClick={onCommunity}
              className="px-10 py-6 rounded-3xl font-black text-xl text-slate-950 dark:text-white border-2 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all active:scale-95"
            >
              {t.explore}
            </button>
          </div>
          
          <div className="flex items-center gap-6 pt-10 text-slate-400 dark:text-slate-500 text-xs font-bold border-t border-slate-200/50 dark:border-slate-800/50">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?u=dev${i}`} alt="auditor" className="opacity-80" />
                </div>
              ))}
            </div>
            <span className="tracking-widest uppercase text-[10px]">{t.trusted}</span>
          </div>
        </div>

        <div className="relative z-10 lg:w-[400px] w-full animate-float">
          <div className="glass-card rounded-[4rem] p-12 space-y-10 border-2 border-white dark:border-slate-800 shadow-3xl">
            <div className="bg-indigo-600 w-16 h-16 rounded-3xl flex items-center justify-center shadow-xl">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-6">
              <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{t.motivation}</div>
              <p className="text-3xl font-black text-slate-900 dark:text-white italic font-outfit leading-tight">"{quote.text}"</p>
              <div className="text-sm font-black text-slate-400 uppercase tracking-widest">— {quote.author}</div>
            </div>
            <div className="pt-6 flex items-center justify-between text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">
               <span>INDUSTRIAL PULSE</span>
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
                 ACTIVE
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          { title: "Industrial AI", desc: "Native liquid-audio & vision processing for heavy-duty product audits.", icon: Cpu, color: "indigo" },
          { title: "Human Bridge", desc: "Raw technical data translated into empathetic actionable industry insights.", icon: Users, color: "fuchsia" },
          { title: "Secure Labs", desc: "Encrypted industrial local processing. Your blueprints remain private.", icon: Shield, color: "teal" }
        ].map(card => (
          <div key={card.title} className="glass-card rounded-[3.5rem] p-12 space-y-8 hover:shadow-2xl transition-all hover:-translate-y-2 group border border-slate-100 dark:border-slate-800">
            <div className={`bg-${card.color}-500/10 p-6 rounded-2xl w-fit group-hover:scale-110 transition-transform`}>
              <card.icon className={`w-10 h-10 text-${card.color}-500`} />
            </div>
            <div className="space-y-4">
              <h4 className="text-3xl font-black text-slate-950 dark:text-white font-outfit">{card.title}</h4>
              <p className="text-slate-500 dark:text-slate-400 text-lg font-bold leading-relaxed">{card.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* CTA Footer Section */}
      <section className="relative z-10 overflow-hidden bg-slate-950 dark:bg-black rounded-[5rem] p-16 lg:p-32 text-center shadow-3xl">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10 space-y-10 max-w-3xl mx-auto">
          <Terminal className="w-12 h-12 text-indigo-500 mx-auto" />
          <h3 className="text-5xl lg:text-7xl font-black text-white font-outfit tracking-tighter">The standard for <br/>industrial production.</h3>
          <p className="text-slate-400 text-xl font-medium max-w-xl mx-auto">Join a global network of manufacturers building the future with AI-driven technical excellence.</p>
          <div className="pt-8">
            <button 
              onClick={onStart}
              className="bg-white text-slate-950 px-12 py-6 rounded-3xl font-black text-xl shadow-xl hover:scale-110 transition-all flex items-center gap-4 mx-auto"
            >
              Launch NeoteriX <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeView;

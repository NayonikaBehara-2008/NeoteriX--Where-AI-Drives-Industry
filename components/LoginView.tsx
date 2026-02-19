
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Key, ChevronRight, Zap, Globe, Mail, User, ArrowRight, Loader2, Sparkles, Terminal, RefreshCw } from 'lucide-react';
import { generateLoginHero } from '../services/geminiService';

interface LoginViewProps {
  onLoginSuccess: (userData?: { name: string; email: string }) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiHeroImage, setAiHeroImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchHeroImage = async () => {
    setIsGeneratingImage(true);
    const img = await generateLoginHero();
    if (img) setAiHeroImage(img);
    setIsGeneratingImage(false);
  };

  useEffect(() => {
    fetchHeroImage();
  }, []);

  const performHandshake = async (name: string, email: string) => {
    setIsInitializing(true);
    setError(null);
    try {
      await window.aistudio.openSelectKey();
      
      onLoginSuccess({
        name: name || 'User',
        email: email || 'demo@neoterix.io'
      });
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setError("Security Error: Please pick a valid paid API key.");
      } else {
        setError("Login failed. Please check your internet and try again.");
      }
      setIsInitializing(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp && !formData.name) {
      setError("Please enter your name to sign up.");
      return;
    }
    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }
    await performHandshake(formData.name, formData.email);
  };

  const handleDemoMode = async () => {
    await performHandshake("NeoteriX Guest", "demo@neoterix.io");
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-[#01040a]">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[140vw] h-[140vh] bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),#4f46e510_0%,transparent_60%)]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/10 via-[#01040a] to-[#01040a]"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-in fade-in zoom-in-95 duration-1000">
        
        {/* Left: AI Hero Image Section */}
        <div className="hidden lg:flex flex-col items-center justify-center space-y-12 relative">
          <div className="relative group w-full aspect-square max-w-lg">
            <div className="absolute inset-0 bg-indigo-500 blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative h-full w-full rounded-[4rem] overflow-hidden border border-white/10 shadow-3xl bg-slate-900 flex items-center justify-center">
              {isGeneratingImage ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Generating Identity...</span>
                </div>
              ) : aiHeroImage ? (
                <img 
                  src={aiHeroImage} 
                  alt="NeoteriX AI Visual" 
                  className="w-full h-full object-cover animate-in fade-in duration-1000"
                />
              ) : (
                <ShieldCheck className="w-32 h-32 text-indigo-900" />
              )}
            </div>
            
            <button 
              onClick={fetchHeroImage}
              disabled={isGeneratingImage}
              className="absolute bottom-8 right-8 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-white hover:bg-white/20 transition-all active:scale-95"
              title="Refresh Identity"
            >
              <RefreshCw className={`w-5 h-5 ${isGeneratingImage ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="text-center space-y-4 max-w-sm">
            <h3 className="text-3xl font-black text-white font-outfit tracking-tighter">Industrial. Smart. Unified.</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Where AI Drives Industry. Secure feedback for the next generation of manufacturing.
            </p>
          </div>
        </div>

        {/* Right: Auth Card */}
        <div className="w-full max-w-xl mx-auto">
          <div className="mb-12 text-center lg:text-left space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] flex items-center justify-center lg:mx-0 mx-auto shadow-2xl shadow-indigo-500/20 group hover:rotate-12 transition-transform duration-700">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-1">
              <h1 className="text-4xl font-black text-white font-outfit tracking-tighter uppercase">
                NEOTERIX <span className="text-indigo-500">Audit</span>
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Industry Gateway</p>
            </div>
          </div>

          <div className="glass-card rounded-[3.5rem] p-10 lg:p-14 border border-white/5 bg-white/[0.03] backdrop-blur-[80px] shadow-[0_100px_200px_-50px_rgba(0,0,0,0.9)]">
            <form onSubmit={handleAuthSubmit} className="space-y-10">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-black text-white font-outfit">
                  {isSignUp ? "Create Identity" : "Industry Access"}
                </h2>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                  {isSignUp ? "Register your industrial presence" : "Please sign in to continue"}
                </p>
              </div>

              <div className="space-y-6">
                {isSignUp && (
                  <div className="space-y-2 group">
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 transition-colors group-focus-within:text-indigo-400">
                      <User className="w-3 h-3" /> Full Name
                    </label>
                    <input 
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 text-white font-medium transition-all placeholder:text-slate-700"
                    />
                  </div>
                )}

                <div className="space-y-2 group">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 transition-colors group-focus-within:text-indigo-400">
                    <Mail className="w-3 h-3" /> Industry Email
                  </label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@industry.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 text-white font-medium transition-all placeholder:text-slate-700"
                  />
                </div>

                <div className="space-y-2 group">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 transition-colors group-focus-within:text-indigo-400">
                    <Lock className="w-3 h-3" /> Password
                  </label>
                  <input 
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Security key"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 text-white font-medium transition-all placeholder:text-slate-700"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <Zap className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="pt-4 space-y-6">
                <button 
                  type="submit"
                  disabled={isInitializing}
                  className="w-full group relative overflow-hidden bg-white text-[#01040a] px-8 py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)] disabled:opacity-50"
                >
                  {isInitializing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Key className="w-5 h-5" />
                  )}
                  {isInitializing ? "Verifying..." : (isSignUp ? "Register Presence" : "Enter Portal")}
                  {!isInitializing && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </button>

                <div className="flex flex-col gap-6 items-center">
                  <button 
                    type="button"
                    onClick={handleDemoMode}
                    disabled={isInitializing}
                    className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border border-white/10 hover:border-indigo-500/50 hover:bg-white/5 transition-all group disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-400 group-hover:animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-400">Explore Prototype</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-[10px] font-black text-slate-600 hover:text-white transition-colors uppercase tracking-[0.2em]"
                  >
                    {isSignUp ? "Already registered? Login" : "New manufacturer? Join NeoteriX"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;

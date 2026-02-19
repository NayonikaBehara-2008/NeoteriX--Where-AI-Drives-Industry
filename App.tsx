
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Rocket, 
  Loader2,
  Terminal,
  FileText,
  Image as ImageIcon,
  Zap,
  Trash2,
  UploadCloud,
  HelpCircle,
  Sparkles,
  Mic,
  Globe,
  X,
  User,
  History,
  Moon,
  Sun,
  Settings,
  Plus,
  Home as HomeIcon,
  Users,
  ChevronLeft,
  MessageSquare,
  Bell,
  Languages,
  LogOut
} from 'lucide-react';
import { AnalysisInput, ProductFeedback, AnalysisFile, UserProfile, Message } from './types';
import { analyzeProduct } from './services/geminiService';
import { translations } from './translations';
import Dashboard from './components/Dashboard';
import VoiceAssistant from './components/VoiceAssistant';
import ProfileView from './components/ProfileView';
import HomeView from './components/HomeView';
import CommunityView from './components/CommunityView';
import MessagesView from './components/MessagesView';
import LoginView from './components/LoginView';

const AVAILABLE_LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 
  'Arabic', 'Portuguese', 'Russian', 'Italian', 'Dutch', 'Turkish', 'Vietnamese', 
  'Thai', 'Hindi', 'Bengali', 'Indonesian'
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('vanguard-auth') === 'true';
  });
  const [activeTab, setActiveTab] = useState<'home' | 'audit' | 'profile' | 'community' | 'messages'>('home');
  const [profileSubTab, setProfileSubTab] = useState<'history' | 'account' | 'settings' | 'support'>('history');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('vanguard-theme') as 'light' | 'dark') || 'light';
  });
  const [showLangMenu, setShowLangMenu] = useState(false);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<ProductFeedback | null>(null);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('vanguard-user');
    return saved ? JSON.parse(saved) : { 
      id: 'current-user-001',
      name: 'NeoteriX Creator', 
      email: '', 
      phone: '', 
      role: 'Developer', 
      language: 'English',
      following: [], 
      followersCount: 12 
    };
  });

  const t = (translations[user.language] || translations['English']);

  const [auditHistory, setAuditHistory] = useState<ProductFeedback[]>(() => {
    const saved = localStorage.getItem('vanguard-history');
    return saved ? JSON.parse(saved) : [];
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('vanguard-messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState<AnalysisInput>({
    name: '',
    category: 'Software/SaaS',
    description: '',
    codeOrSpecs: '',
    files: []
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
    localStorage.setItem('vanguard-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('vanguard-user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('vanguard-history', JSON.stringify(auditHistory));
  }, [auditHistory]);

  useEffect(() => {
    localStorage.setItem('vanguard-messages', JSON.stringify(messages));
  }, [messages]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleLoginSuccess = (userData?: { name: string; email: string }) => {
    if (userData) {
      setUser(prev => ({
        ...prev,
        name: userData.name,
        email: userData.email
      }));
    }
    setIsAuthenticated(true);
    localStorage.setItem('vanguard-auth', 'true');
  };

  const handleLogout = () => {
    localStorage.removeItem('vanguard-auth');
    setIsAuthenticated(false);
    setActiveTab('home');
    setFeedback(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newFile: AnalysisFile = {
          data: reader.result as string,
          mimeType: file.type,
          name: file.name
        };
        setInput(prev => ({
          ...prev,
          files: [...prev.files, newFile]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const runAnalysis = async () => {
    if (!input.name || !input.description) {
      alert("Kindly provide your Product Name and a brief description.");
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeProduct({ ...input, language: user.language });
      const enrichedResult: ProductFeedback = { 
        ...result, 
        id: crypto.randomUUID(), 
        timestamp: Date.now(),
        creatorName: user.name,
        creatorId: user.id,
        isPublic: false,
        humanReviews: []
      };
      setFeedback(enrichedResult);
      setAuditHistory(prev => [enrichedResult, ...prev]);
    } catch (err) {
      console.error(err);
      alert("We encountered a minor glitch. Please check your connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const togglePublic = (id: string) => {
    setAuditHistory(prev => prev.map(item => item.id === id ? { ...item, isPublic: !item.isPublic } : item));
    if (feedback && feedback.id === id) {
      setFeedback({ ...feedback, isPublic: !feedback.isPublic });
    }
  };

  const removeFile = (index: number) => {
    setInput(prev => ({ ...prev, files: prev.files.filter((_, i) => i !== index) }));
  };

  const reset = () => {
    setFeedback(null);
    setInput({
      name: '',
      category: 'Software/SaaS',
      description: '',
      codeOrSpecs: '',
      files: []
    });
    setActiveTab('audit');
  };

  const goBack = () => {
    if (feedback) {
      setFeedback(null);
    } else {
      setActiveTab('home');
    }
  };

  const toggleFollow = (creatorId: string) => {
    setUser(prev => {
      const isFollowing = prev.following.includes(creatorId);
      const newFollowing = isFollowing 
        ? prev.following.filter(id => id !== creatorId)
        : [...prev.following, creatorId];
      return { ...prev, following: newFollowing };
    });
  };

  const sendMessage = (receiverId: string, content: string) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      senderId: user.id,
      receiverId,
      content,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const navigateToProfile = (sub: 'history' | 'account' | 'settings' | 'support') => {
    setProfileSubTab(sub);
    setActiveTab('profile');
    setFeedback(null);
  };

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  const unreadCount = messages.filter(m => m.receiverId === user.id).length;

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-600 selection:text-white font-sans relative z-20 transition-colors">
      <header className="border-b border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl sticky top-0 z-[60] transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {(activeTab !== 'home' || feedback) && (
              <button 
                onClick={goBack}
                className="p-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-90 shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-4 cursor-pointer group" onClick={() => {setActiveTab('home'); setFeedback(null);}}>
              <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-2.5 rounded-2xl shadow-xl shadow-indigo-200/50 dark:shadow-indigo-900/20 group-hover:rotate-12 transition-transform">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-black tracking-tighter text-slate-950 dark:text-white font-outfit hidden sm:block">
                NeoteriX <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500 font-medium">AUDIT</span>
              </h1>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/50 dark:bg-slate-800/50 p-1.5 rounded-2xl backdrop-blur-md">
            {[
              { id: 'home', icon: HomeIcon, label: t.nav.home },
              { id: 'audit', icon: Plus, label: t.nav.audit },
              { id: 'community', icon: Users, label: t.nav.community },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setFeedback(null); }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-xl' 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/30 dark:hover:bg-slate-800/30'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 mr-2 border-r border-slate-200 dark:border-slate-800 pr-4">
              <div className="relative">
                <button 
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className={`p-3 rounded-2xl transition-all active:scale-95 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2`}
                >
                  <Languages className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase hidden md:block">{user.language.slice(0, 3)}</span>
                </button>
                {showLangMenu && (
                  <div className="absolute top-16 right-0 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-3xl w-48 animate-in fade-in zoom-in-95 duration-200 z-[60] max-h-80 overflow-y-auto custom-scrollbar">
                    {AVAILABLE_LANGUAGES.map(lang => (
                      <button 
                        key={lang}
                        onClick={() => { setUser({...user, language: lang}); setShowLangMenu(false); }}
                        className={`w-full text-left p-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 dark:hover:bg-indigo-950/20 ${user.language === lang ? 'text-indigo-600' : 'text-slate-500'}`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button 
                onClick={() => setActiveTab('messages')}
                className={`relative p-3 rounded-2xl transition-all active:scale-95 ${activeTab === 'messages' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                <MessageSquare className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border-2 border-white dark:border-slate-900">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button 
                onClick={() => navigateToProfile('settings')}
                className={`p-3 rounded-2xl transition-all active:scale-95 ${(activeTab === 'profile' && profileSubTab === 'settings') ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                title="System Configuration"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            <button 
              onClick={() => setIsVoiceOpen(true)}
              className="hidden md:flex items-center gap-3 bg-slate-950 dark:bg-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white dark:text-slate-950 shadow-lg hover:-translate-y-1 transition-all active:scale-95"
            >
              <Mic className="w-4 h-4" />
              AI Voice
            </button>
            
            <button 
              onClick={toggleTheme}
              className="p-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white hover:shadow-xl transition-all active:scale-95"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-3 bg-rose-500/10 dark:bg-rose-500/20 border-2 border-rose-500/30 dark:border-rose-500/40 rounded-2xl text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white transition-all active:scale-95 group shadow-sm"
              title="Logout Session"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-12 relative">
        {activeTab === 'home' ? (
          <HomeView user={user} onStart={() => setActiveTab('audit')} onCommunity={() => setActiveTab('community')} />
        ) : activeTab === 'profile' ? (
          <ProfileView 
            user={user} 
            setUser={setUser} 
            messages={messages} 
            auditHistory={auditHistory} 
            onSelectHistory={(f) => { setFeedback(f); setActiveTab('audit'); }}
            initialSubTab={profileSubTab}
            onLogout={handleLogout}
          />
        ) : activeTab === 'community' ? (
          <CommunityView 
            currentUser={user} 
            auditHistory={auditHistory} 
            onFollow={toggleFollow}
            onSendMessage={sendMessage}
            messages={messages}
            t={t.community}
          />
        ) : activeTab === 'messages' ? (
          <MessagesView 
            currentUser={user} 
            messages={messages} 
            onSendMessage={sendMessage}
            t={t.messages}
          />
        ) : (
          <>
            {!feedback && !isAnalyzing ? (
              <div className="max-w-4xl mx-auto space-y-20 animate-in fade-in duration-700">
                <div className="text-center space-y-8">
                  <div className="inline-flex items-center gap-3 bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 px-6 py-3 rounded-full text-[10px] font-black border border-slate-100 dark:border-slate-800 shadow-2xl shadow-indigo-100/50 dark:shadow-none tracking-widest uppercase">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    IDENTITY: {user.name.toUpperCase()}
                  </div>
                  <h2 className="text-6xl md:text-8xl font-black text-slate-950 dark:text-white tracking-tighter leading-[0.85] text-balance font-outfit">
                    {t.audit.title.split(' ')[0]} <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-teal-500 uppercase">{t.audit.title.split(' ').slice(1).join(' ')}</span>
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-xl max-w-xl mx-auto leading-relaxed font-bold">
                    {t.home.sub}
                  </p>
                </div>

                <div className="glass-card rounded-[4rem] p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-2 gap-16 relative overflow-hidden group/container border-2 border-white dark:border-slate-800 shadow-3xl">
                  <div className="space-y-10 relative z-10">
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-950 dark:text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div>
                        1. {t.audit.identity}
                      </label>
                      <input 
                        type="text" 
                        value={input.name}
                        onChange={(e) => setInput({...input, name: e.target.value})}
                        placeholder={t.audit.placeholderName}
                        className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-3xl px-8 py-6 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all outline-none text-slate-950 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 font-bold text-lg"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-950 dark:text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-fuchsia-600 shadow-[0_0_10px_rgba(217,70,239,0.5)]"></div>
                        2. {t.audit.vision}
                      </label>
                      <textarea 
                        rows={5}
                        value={input.description}
                        onChange={(e) => setInput({...input, description: e.target.value})}
                        placeholder={t.audit.placeholderVision}
                        className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-3xl px-8 py-6 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-400 outline-none resize-none text-slate-950 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 font-bold text-lg"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-950 dark:text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
                        <Terminal className="w-5 h-5 text-indigo-600" />
                        3. {t.audit.tech}
                      </label>
                      <textarea 
                        rows={6}
                        value={input.codeOrSpecs}
                        onChange={(e) => setInput({...input, codeOrSpecs: e.target.value})}
                        placeholder={t.audit.placeholderTech}
                        className="w-full bg-slate-950 dark:bg-black border-2 border-slate-100 dark:border-slate-800 rounded-3xl px-8 py-6 font-mono text-sm focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-400 outline-none resize-none text-indigo-400 placeholder:text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-10 flex flex-col relative z-10">
                    <label className="text-[11px] font-black text-slate-950 dark:text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]"></div>
                        4. {t.audit.visual}
                    </label>
                    <div 
                      className="flex-1 border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[4rem] hover:border-indigo-400 dark:hover:border-indigo-700 hover:bg-white dark:hover:bg-slate-900 transition-all flex flex-col items-center justify-center p-16 gap-8 group relative cursor-pointer shadow-inner"
                    >
                      <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-8 rounded-[3rem] shadow-3xl shadow-indigo-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all">
                        <UploadCloud className="w-12 h-12 text-white" />
                      </div>
                      <div className="text-center space-y-2">
                        <p className="font-black text-slate-950 dark:text-white text-2xl font-outfit">{t.audit.drop}</p>
                        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">UI MOCKUPS / PDF SPECS</p>
                      </div>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*,.pdf" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={handleFileUpload} 
                      />
                    </div>

                    {input.files.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-48 overflow-y-auto pr-3 custom-scrollbar">
                        {input.files.map((file, i) => (
                          <div key={i} className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 p-5 rounded-[2rem] flex items-center justify-between group hover:shadow-2xl transition-all border-l-[6px] border-l-indigo-600">
                            <div className="flex items-center gap-4 overflow-hidden">
                              {file.mimeType === 'application/pdf' ? <FileText className="w-6 h-6 text-rose-500" /> : <ImageIcon className="w-6 h-6 text-indigo-500" />}
                              <span className="text-sm font-black truncate text-slate-950 dark:text-slate-100">{file.name}</span>
                            </div>
                            <button onClick={() => removeFile(i)} className="text-slate-300 dark:text-slate-600 hover:text-rose-600 transition-colors p-3">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <button 
                      onClick={runAnalysis}
                      disabled={isAnalyzing}
                      className="mt-auto w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black py-7 rounded-[2.5rem] shadow-3xl hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white flex items-center justify-center gap-4 transition-all transform hover:-translate-y-2 active:scale-95 disabled:opacity-50"
                    >
                      {isAnalyzing ? <Loader2 className="w-7 h-7 animate-spin" /> : <Rocket className="w-7 h-7" />}
                      <span className="text-xl font-outfit uppercase">{t.audit.generate}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : isAnalyzing ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-16 animate-in fade-in zoom-in duration-700">
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500 blur-[160px] opacity-10 animate-pulse"></div>
                  <div className="relative bg-white dark:bg-slate-900 p-20 rounded-[5rem] shadow-3xl border-2 border-slate-50 dark:border-slate-800">
                    <Loader2 className="w-28 h-28 text-indigo-600 dark:text-indigo-400 animate-spin" />
                  </div>
                </div>
                <div className="text-center space-y-6">
                  <h3 className="text-5xl font-black text-slate-950 dark:text-white tracking-tighter font-outfit uppercase">AI is Reflecting...</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-bold text-xl max-w-sm mx-auto leading-relaxed">
                    Bridging tech specs with human empathy. Please hold.
                  </p>
                </div>
              </div>
            ) : (
              <Dashboard feedback={feedback!} onReset={reset} onTogglePublic={() => togglePublic(feedback!.id!)} language={user.language} />
            )}
          </>
        )}
      </main>

      {isVoiceOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl" onClick={() => setIsVoiceOpen(false)}></div>
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-[4rem] p-12 shadow-3xl border border-white dark:border-slate-800">
            <button onClick={() => setIsVoiceOpen(false)} className="absolute top-8 right-8 p-3"><X className="w-6 h-6 text-slate-400" /></button>
            <VoiceAssistant onClose={() => setIsVoiceOpen(false)} language={user.language} />
          </div>
        </div>
      )}

      <footer className="py-20 border-t border-slate-200/50 dark:border-slate-800 text-center space-y-8 no-print">
        <div className="flex justify-center gap-12 text-slate-400 dark:text-slate-600">
          <Settings className="w-6 h-6 cursor-pointer hover:text-indigo-500 transition-colors" onClick={() => navigateToProfile('settings')} />
          <Globe className="w-6 h-6 cursor-pointer hover:text-indigo-500 transition-colors" onClick={() => setShowLangMenu(!showLangMenu)} />
          <HelpCircle className="w-6 h-6 cursor-pointer hover:text-indigo-500 transition-colors" />
        </div>
        <p className="text-slate-950 dark:text-slate-500 text-[11px] font-black uppercase tracking-[0.8em] font-outfit">
          © 2025 NeoteriX • MIND OVER MACHINE
        </p>
      </footer>
    </div>
  );
};

export default App;

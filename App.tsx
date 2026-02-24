
// Fix: Removed the local AIStudio interface and declare global Window block 
// because aistudio is already defined globally in this environment, 
// and re-declaring it with the same name was causing conflict errors.

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  LayoutDashboard, 
  Gift, 
  BrainCircuit, 
  Bell,
  TrendingUp,
  Zap,
  ExternalLink,
  Sun,
  Moon,
  Archive,
  Key
} from 'lucide-react';
import { ViewState, DonationRecord, UserProfile, NGO, IncomingReward, RewardSource, Region, Language } from './types';
import { SAMPLE_NGOS, REGION_CONFIGS, LANGUAGES, TRANSLATIONS } from './constants';
import Dashboard from './components/Dashboard';
import CaptureReward from './components/CaptureReward';
import NGOExplorer from './components/NGOExplorer';
import Rewards from './components/Rewards';
import AIImpact from './components/AIImpact';
import ProfileMenu from './components/ProfileMenu';
import Login from './components/Login';
import LiquidBlobs from './components/LiquidBlobs';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [region, setRegion] = useState<Region>('US');
  const [language, setLanguage] = useState<Language>('en');
  const [hasVeoKey, setHasVeoKey] = useState(false);
  
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'u1',
    name: 'Alex Johnson',
    email: 'alex.j@impact.com',
    avatar: 'https://picsum.photos/seed/user123/200/200',
    totalDonated: 0,
    points: 1500,
    tier: 'Silver',
    region: 'US',
    language: 'en'
  });
  
  const [selectedNGO, setSelectedNGO] = useState<NGO>(SAMPLE_NGOS[0]);
  const [incomingReward, setIncomingReward] = useState<IncomingReward | null>(null);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    // @ts-ignore - window.aistudio is pre-configured and accessible in this context.
    const hasKey = await window.aistudio.hasSelectedApiKey();
    setHasVeoKey(hasKey);
  };

  const handleOpenKeyPicker = async () => {
    // @ts-ignore - window.aistudio is pre-configured and accessible in this context.
    await window.aistudio.openSelectKey();
    // Assume key selection was successful to mitigate race condition between picker and session readiness.
    setHasVeoKey(true);
  };

  const t = TRANSLATIONS[language];
  const rConfig = REGION_CONFIGS[region];

  const handleLogin = (selectedRegion: Region, selectedLanguage: Language, isNewUser: boolean = false) => {
    setRegion(selectedRegion);
    setLanguage(selectedLanguage);
    
    if (isNewUser) {
      setUserProfile({
        id: 'u_new',
        name: 'New Joy Member',
        email: 'impact.hero@joyjar.com',
        avatar: `https://picsum.photos/seed/${Math.random()}/200/200`,
        totalDonated: 0,
        points: 0,
        tier: 'Bronze',
        region: selectedRegion,
        language: selectedLanguage
      });
    } else {
      setUserProfile(prev => ({ 
        ...prev, 
        region: selectedRegion, 
        language: selectedLanguage 
      }));
    }
    
    setIsLoggedIn(true);
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIncomingReward(null);
    setDonations([]); 
    setActiveView('dashboard');
  };

  const handleCaptureTransfer = (reward: IncomingReward) => {
    const newDonation: DonationRecord = {
      id: reward.id,
      date: new Date().toISOString(),
      amount: reward.amount,
      ngoId: selectedNGO.id,
      source: reward.source
    };

    setDonations(prev => [newDonation, ...prev]);
    setUserProfile(prev => ({
      ...prev,
      totalDonated: prev.totalDonated + reward.amount,
      points: prev.points + Math.floor(reward.amount * 10)
    }));
    
    setIncomingReward(null);
    setActiveView('dashboard');
  };

  const simulateRedirect = () => {
    const providers = rConfig.providers;
    setIncomingReward({
      id: Math.random().toString(36).substr(2, 9),
      amount: parseFloat((Math.random() * 50 + 5).toFixed(2)),
      source: providers[Math.floor(Math.random() * providers.length)],
      timestamp: new Date().toISOString()
    });
    setActiveView('capture');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className={`${darkMode ? 'dark' : ''} transition-all duration-700 ease-in-out`}>
      <div className="flex min-h-screen bg-[#fdfbf7] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-hidden font-sans relative">
        
        {/* Organic Liquid Blob Background */}
        <LiquidBlobs className="z-0 opacity-40 dark:opacity-20" />

        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border-r border-zinc-200/50 dark:border-zinc-800 hidden md:flex flex-col z-20 transition-colors duration-700">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-10 group cursor-pointer">
              <div className="bg-amber-500/10 p-2.5 rounded-2xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                <Archive className="text-amber-600 dark:text-amber-400 w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white">JoyJar</h1>
            </div>

            <nav className="space-y-1.5">
              <NavItem icon={<LayoutDashboard />} label={t.dashboard} active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
              <NavItem icon={<ExternalLink />} label="Redirects" active={activeView === 'capture'} onClick={() => setActiveView('capture')} />
              <NavItem icon={<Heart />} label={t.partners} active={activeView === 'ngos'} onClick={() => setActiveView('ngos')} />
              <NavItem icon={<Gift />} label={t.rewards} active={activeView === 'rewards'} onClick={() => setActiveView('rewards')} />
              <NavItem icon={<BrainCircuit />} label={t.ai} active={activeView === 'ai-impact'} onClick={() => setActiveView('ai-impact')} />
            </nav>
          </div>

          <div className="mt-auto p-8 border-t border-zinc-200/50 dark:border-zinc-800">
            {!hasVeoKey && (
              <button 
                onClick={handleOpenKeyPicker}
                className="w-full mb-4 py-3 bg-amber-500 text-zinc-950 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-amber-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Key className="w-3.5 h-3.5" /> Enable Video Gen
              </button>
            )}
            <button 
              onClick={simulateRedirect}
              className="w-full mb-6 py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.25em] hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 shadow-lg shadow-zinc-200/50 dark:shadow-none"
            >
              Sync Jar
            </button>
            <div className="bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md border border-white dark:border-zinc-700 rounded-3xl p-6 shadow-xl shadow-zinc-200/20 dark:shadow-none relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1.5 relative z-10">{t.totalImpact}</p>
              <p className="text-2xl font-black text-zinc-900 dark:text-white relative z-10">{rConfig.symbol}{userProfile.totalDonated.toLocaleString(rConfig.locale, { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-screen overflow-y-auto relative z-10 scrollbar-hide no-scrollbar transition-colors duration-700">
          <header className="sticky top-0 z-30 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800 h-20 flex items-center justify-between px-10 transition-colors duration-700">
            <div className="flex items-center gap-8">
               <div className="flex flex-col">
                 <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-0.5">Active Region</span>
                 <select 
                  value={region} 
                  onChange={(e) => setRegion(e.target.value as Region)}
                  className="bg-transparent text-xs font-black outline-none cursor-pointer text-zinc-900 dark:text-zinc-100 uppercase tracking-widest"
                >
                  {Object.keys(REGION_CONFIGS).map(r => <option key={r} value={r} className="text-zinc-900">{r}</option>)}
                </select>
               </div>
              
              <div className="flex gap-1.5 bg-white/50 dark:bg-zinc-800/50 p-1.5 rounded-2xl border border-zinc-200/50 dark:border-zinc-700 shadow-sm">
                {LANGUAGES.map(l => (
                  <button 
                    key={l.code} 
                    onClick={() => setLanguage(l.code)}
                    className={`text-sm w-9 h-9 flex items-center justify-center rounded-xl transition-all ${language === l.code ? 'bg-zinc-900 dark:bg-zinc-700 text-white shadow-md scale-105' : 'opacity-40 hover:opacity-100 hover:scale-105'}`}
                  >
                    {l.flag}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <ProfileMenu 
                user={{...userProfile, language, region}} 
                onLogout={handleLogout} 
                onSwitchProfile={() => {}} 
              />
            </div>
          </header>

          <div className="p-10 pb-32 max-w-7xl mx-auto w-full">
            {activeView === 'dashboard' && <Dashboard donations={donations} userProfile={{...userProfile, language, region}} onViewChange={setActiveView} />}
            {activeView === 'capture' && (
              <CaptureReward 
                incoming={incomingReward} 
                onConfirm={handleCaptureTransfer}
                onSimulate={simulateRedirect}
                selectedNGO={selectedNGO}
                onSelectNGO={() => setActiveView('ngos')}
                currency={rConfig}
                lang={language}
                hasVeoKey={hasVeoKey}
                onOpenKeyPicker={handleOpenKeyPicker}
              />
            )}
            {activeView === 'ngos' && <NGOExplorer selectedNGO={selectedNGO} onSelect={setSelectedNGO} />}
            {activeView === 'rewards' && <Rewards userProfile={userProfile} />}
            {activeView === 'ai-impact' && <AIImpact totalDonated={userProfile.totalDonated} donations={donations} ngos={SAMPLE_NGOS} lang={language} region={region} darkMode={darkMode} />}
          </div>
        </main>
      </div>
    </div>
  );
};

const NavItem: React.FC<{icon: React.ReactNode, label: string, active: boolean, onClick: () => void}> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-500 ${
      active 
        ? 'bg-zinc-900 dark:bg-zinc-800 text-white dark:text-amber-400 font-black shadow-xl shadow-zinc-900/10 dark:shadow-none translate-x-2' 
        : 'text-zinc-500 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:translate-x-1'
    }`}
  >
    {React.cloneElement(icon as React.ReactElement, { className: 'w-4 h-4' })}
    <span className="text-[11px] uppercase font-black tracking-[0.15em]">{label}</span>
  </button>
);

export default App;

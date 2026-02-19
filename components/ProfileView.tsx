
import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Briefcase, Save, Camera, 
  Users, Heart, Globe, ShieldCheck, History, 
  Search, Calendar, ChevronRight, Zap, Settings,
  Shield, LifeBuoy, Flag, BarChart3, Lock,
  ExternalLink, MessageCircle, Info, Edit3, X,
  ArrowUpRight, Headphones, HeartHandshake, ShieldAlert,
  LogOut, RefreshCw, Smartphone, Hash, Activity, Key, ShieldEllipsis
} from 'lucide-react';
import { UserProfile, Message, ProductFeedback } from '../types';
import { translations } from '../translations';

interface ProfileViewProps {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  messages: Message[];
  auditHistory: ProductFeedback[];
  onSelectHistory: (feedback: ProductFeedback) => void;
  initialSubTab?: 'history' | 'account' | 'settings' | 'support';
  onLogout: () => void;
}

const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 
  'Arabic', 'Portuguese', 'Russian', 'Italian', 'Dutch', 'Turkish', 'Vietnamese', 
  'Thai', 'Hindi', 'Bengali', 'Indonesian'
];

const MOCK_PROFILES = [
  { name: 'NeoteriX Creator', role: 'Developer', language: 'English' },
  { name: 'Lead Architect', role: 'CTO', language: 'German' },
  { name: 'UX Specialist', role: 'Designer', language: 'French' }
];

const MOCK_SECURITY_LOGS = [
  { action: 'Session started', ip: '192.168.1.42', time: '2 hours ago' },
  { action: 'Profile update', ip: '192.168.1.42', time: '5 hours ago' },
  { action: 'Audit initiated', ip: '192.168.1.42', time: '1 day ago' },
];

const ProfileView: React.FC<ProfileViewProps> = ({ user, setUser, messages, auditHistory, onSelectHistory, initialSubTab = 'history', onLogout }) => {
  const [activeSubTab, setActiveSubTab] = useState<'history' | 'account' | 'settings' | 'support'>(initialSubTab);
  
  useEffect(() => {
    setActiveSubTab(initialSubTab);
  }, [initialSubTab]);

  const t = (translations[user.language] || translations['English']).profile;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleLogoutClick = () => {
    onLogout();
  };

  const handleSwitchProfile = (profile: typeof MOCK_PROFILES[0]) => {
    setUser({
      ...user,
      name: profile.name,
      role: profile.role,
      language: profile.language
    });
    alert(`Switched to ${profile.name}'s profile.`);
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-12 pb-24">
      {/* Header - Simple Info */}
      <div className="bg-white dark:bg-slate-900 rounded-[4rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-12 flex flex-col md:flex-row items-center gap-10 relative">
          <div className="relative">
            <div className="w-44 h-44 rounded-[3.5rem] bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-3xl">
              <User className="w-24 h-24" />
            </div>
            <button className="absolute -bottom-2 -right-2 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl text-indigo-600 hover:scale-110 transition-transform">
              <Camera className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-4">
            <h2 className="text-6xl font-black text-slate-950 dark:text-white font-outfit tracking-tighter leading-none">{user.name}</h2>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-sm">{user.role}</p>
          </div>

          <div className="flex flex-col gap-2 min-w-[220px]">
            <button 
              onClick={() => setActiveSubTab('history')}
              className={`px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
                activeSubTab === 'history' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <History className="w-4 h-4" /> {t.history}
            </button>
            <button 
              onClick={() => setActiveSubTab('account')}
              className={`px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
                activeSubTab === 'account' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <User className="w-4 h-4" /> {t.title}
            </button>
            <button 
              onClick={() => setActiveSubTab('settings')}
              className={`px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
                activeSubTab === 'settings' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Settings className="w-4 h-4" /> {t.settings}
            </button>
          </div>
        </div>
      </div>

      <div className="min-h-[400px]">
        {activeSubTab === 'history' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div className="space-y-2">
                <h2 className="text-5xl font-black tracking-tighter text-slate-950 dark:text-white font-outfit uppercase">{t.history}.</h2>
                <p className="text-slate-500 font-bold uppercase">Archive of audited technical visions</p>
              </div>
            </div>

            {auditHistory.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-[4rem] p-24 text-center border border-slate-100 dark:border-slate-800 space-y-8"><Zap className="w-16 h-16 text-slate-200 mx-auto" /><h3 className="text-3xl font-black text-slate-950 dark:text-white font-outfit uppercase">Empty Archive</h3></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {auditHistory.map((item) => (
                  <button key={item.id} onClick={() => onSelectHistory(item)} className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[3rem] flex items-center justify-between text-left hover:border-indigo-500 transition-all shadow-sm">
                    <div className="flex items-center gap-8">
                      <div className="w-20 h-20 rounded-[2rem] bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-indigo-600 font-black text-2xl border border-slate-100 dark:border-slate-800">{item.readinessScore}<span className="text-[10px]">%</span></div>
                      <div className="space-y-2"><h4 className="text-2xl font-black text-slate-950 dark:text-white font-outfit leading-tight">{item.overview.split(' ').slice(0, 3).join(' ')}...</h4><div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest"><span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(item.timestamp!).toLocaleDateString()}</span></div></div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'account' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in duration-500">
            {/* Main Part - Editing Info */}
            <div className="lg:col-span-2 space-y-12">
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[4rem] p-12 space-y-10 shadow-sm">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black font-outfit text-slate-950 dark:text-white flex items-center gap-4 uppercase">
                    <Edit3 className="w-8 h-8 text-indigo-500" /> {t.update}
                  </h3>
                  <p className="text-sm font-bold text-slate-500 uppercase">Synchronize your industrial identity</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{t.name}</label>
                    <input name="name" value={user.name} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 font-bold" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{t.email}</label>
                    <input name="email" value={user.email} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 font-bold" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{t.phone}</label>
                    <input name="phone" value={user.phone} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 font-bold" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{t.role}</label>
                    <input name="role" value={user.role} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 font-bold" />
                  </div>
                </div>

                <div className="pt-6">
                  <button className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-700 shadow-xl transition-all">
                    <Save className="w-5 h-5" /> {t.update}
                  </button>
                </div>
              </div>

              {/* Extra Stuff - Security */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[4rem] p-12 space-y-10 shadow-sm">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black font-outfit text-slate-950 dark:text-white flex items-center gap-4 uppercase">
                    <ShieldEllipsis className="w-8 h-8 text-indigo-500" /> {t.security}
                  </h3>
                  <p className="text-sm font-bold text-slate-500 uppercase">Neural log monitoring</p>
                </div>

                <div className="space-y-4">
                  {MOCK_SECURITY_LOGS.map((log, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-4">
                        <Activity className="w-5 h-5 text-indigo-500" />
                        <div className="text-sm font-black text-slate-900 dark:text-white uppercase">{log.action}</div>
                      </div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest uppercase">{log.time}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Log Out Option */}
              <div className="bg-slate-950 dark:bg-black rounded-[4rem] p-12 text-white shadow-3xl flex flex-col md:flex-row justify-between items-center gap-8 border border-white/5">
                <div className="space-y-2 text-center md:text-left">
                  <h4 className="text-2xl font-black font-outfit uppercase">Termination</h4>
                  <p className="text-sm font-bold text-slate-500 uppercase">Safe session closure</p>
                </div>
                <button 
                  onClick={handleLogoutClick}
                  className="bg-rose-600 text-white px-12 py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-rose-700 transition-all flex items-center gap-3 shadow-xl uppercase"
                >
                  <LogOut className="w-6 h-6" /> {t.logout}
                </button>
              </div>
            </div>

            {/* Sidebar - Change Profile */}
            <div className="space-y-8">
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3.5rem] p-10 space-y-8 shadow-sm">
                <div className="space-y-2">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 uppercase"><RefreshCw className="w-3 h-3" /> Profile Swap</h4>
                  <p className="text-sm font-bold uppercase">Toggle identity states</p>
                </div>
                <div className="space-y-3">
                  {MOCK_PROFILES.map(prof => (
                    <button 
                      key={prof.name}
                      onClick={() => handleSwitchProfile(prof)}
                      className={`w-full p-6 rounded-3xl border flex items-center gap-4 group transition-all ${
                        user.name === prof.name 
                        ? 'bg-indigo-600 border-indigo-600 text-white' 
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 hover:border-indigo-500'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${user.name === prof.name ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white'}`}>
                        {prof.name[0].toUpperCase()}
                      </div>
                      <div className="text-left">
                        <div className={`text-sm font-black uppercase ${user.name === prof.name ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{prof.name}</div>
                        <div className={`text-[9px] font-bold tracking-widest uppercase ${user.name === prof.name ? 'text-indigo-200' : 'text-slate-400'}`}>{prof.role}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in duration-500">
             <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3.5rem] p-12 space-y-10 shadow-sm">
                <div className="space-y-2"><h3 className="text-3xl font-black font-outfit text-slate-950 dark:text-white flex items-center gap-4 uppercase"><Globe className="w-8 h-8 text-indigo-500" />{t.regional}</h3><p className="text-sm font-bold text-slate-500 uppercase">{t.langDesc}</p></div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {LANGUAGES.map(lang => (
                    <button key={lang} onClick={() => setUser({ ...user, language: lang })} className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${user.language === lang ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:border-indigo-200'}`}>{lang}</button>
                  ))}
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;

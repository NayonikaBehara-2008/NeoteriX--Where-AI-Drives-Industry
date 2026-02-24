
import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Shield, 
  LogOut, 
  ChevronDown,
  Lock
} from 'lucide-react';
import { UserProfile } from '../types';
import { TRANSLATIONS } from '../constants';

interface ProfileMenuProps {
  user: UserProfile;
  onLogout: () => void;
  onSwitchProfile: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ user, onLogout, onSwitchProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = TRANSLATIONS[user.language];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800"
      >
        <div className="relative">
          <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800" />
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-teal-500 border-2 border-white dark:border-zinc-950 rounded-full"></div>
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight">{user.name}</p>
          <p className="text-[9px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">{user.tier}</p>
        </div>
        <ChevronDown className={`w-3 h-3 text-zinc-400 dark:text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl dark:shadow-none border border-zinc-100 dark:border-zinc-800 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
              <p className="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5">Account</p>
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">{user.email}</p>
            </div>
            
            <div className="p-1.5">
              <MenuLink icon={<User />} label={t.switchProfile} onClick={onSwitchProfile} />
              <MenuLink icon={<Settings />} label={t.settings} onClick={() => {}} />
              <MenuLink icon={<Lock />} label={t.privacy} onClick={() => {}} />
              <MenuLink icon={<Shield />} label="Security" onClick={() => {}} />
            </div>

            <div className="p-1.5 border-t border-zinc-50 dark:border-zinc-800">
              <button 
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> {t.logout}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const MenuLink: React.FC<{ icon: React.ReactNode, label: string, onClick: () => void }> = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-3 px-3.5 py-2 text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-teal-600 dark:hover:text-teal-400 rounded-xl transition-all"
  >
    {React.cloneElement(icon as React.ReactElement, { className: 'w-3.5 h-3.5' })}
    {label}
  </button>
);

export default ProfileMenu;


import React from 'react';
import { Award, Star, Gift, ShieldCheck, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface RewardsProps {
  userProfile: UserProfile;
}

const Rewards: React.FC<RewardsProps> = ({ userProfile }) => {
  const nextTierPoints = 5000;
  const progress = (userProfile.points / nextTierPoints) * 100;

  const perks = [
    { title: 'Kindness Cashback', desc: 'Get 2% back as KindCredits for every donation.', icon: <Sparkles className="text-amber-400" /> },
    { title: 'Priority Access', desc: 'Exclusive early access to limited charity product drops.', icon: <Star className="text-indigo-400" /> },
    { title: 'Impact Badges', desc: 'Unique digital collectibles to showcase on your profile.', icon: <Award className="text-emerald-400" /> },
    { title: 'Merchant Discounts', desc: 'Extra 5% discount at partner eco-friendly stores.', icon: <ShieldCheck className="text-rose-400" /> },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-zinc-900 dark:bg-zinc-900 rounded-[2rem] p-8 text-white mb-8 overflow-hidden relative shadow-xl shadow-zinc-100 dark:shadow-none border border-zinc-100 dark:border-zinc-800">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-teal-500 rounded-full blur-[100px] opacity-10"></div>
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-zinc-800 rounded-full blur-[100px] opacity-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-2 border-white/20 p-1">
              <img src={userProfile.avatar} alt="Profile" className="w-full h-full rounded-full object-cover ring-2 ring-zinc-700" />
            </div>
            <div className="absolute -bottom-1 right-0 bg-teal-600 dark:bg-teal-500 p-1.5 rounded-lg shadow-lg border border-zinc-900">
              <Award className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold mb-1">Impact Status</h1>
            <p className="text-zinc-400 dark:text-zinc-500 text-sm mb-6">{userProfile.tier} Member</p>
            
            <div className="max-w-xs mx-auto md:mx-0">
              <div className="flex justify-between text-[10px] font-bold mb-2 uppercase tracking-widest opacity-60">
                <span>{userProfile.points.toLocaleString()} Points</span>
                <span>{nextTierPoints.toLocaleString()} Goal</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-teal-500 dark:bg-teal-400 rounded-full shadow-[0_0_10px_rgba(20,184,166,0.5)]"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
            <p className="text-2xl font-bold mb-1">{userProfile.points.toLocaleString()}</p>
            <p className="text-[9px] font-bold uppercase tracking-widest opacity-40">KindCredits</p>
            <button className="mt-4 bg-white dark:bg-zinc-100 text-zinc-900 px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-teal-50 dark:hover:bg-teal-400 transition-colors">
              Redeem
            </button>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-bold mb-6 dark:text-white">Unlocked Benefits</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {perks.map((perk, idx) => (
          <div key={idx} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:shadow-md dark:hover:border-zinc-700 transition-all">
            <div className="bg-zinc-50 dark:bg-zinc-800 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
              {perk.icon}
            </div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">{perk.title}</h3>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-relaxed">{perk.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-teal-50 dark:bg-teal-900/10 rounded-3xl p-8 border border-teal-100 dark:border-teal-900/30 flex flex-col md:flex-row items-center gap-8 shadow-lg dark:shadow-none">
        <div className="bg-teal-600 dark:bg-teal-500 p-4 rounded-2xl shadow-lg shadow-teal-100 dark:shadow-none">
          <Gift className="text-white w-8 h-8" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl font-bold text-teal-900 dark:text-teal-400 mb-1">Refer a Friend</h2>
          <p className="text-teal-700 dark:text-teal-500 text-sm">Double the impact. When they gift their first redirect, you both get 500 KindCredits.</p>
        </div>
        <button className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest shadow-md transition-all whitespace-nowrap">
          Invite Link
        </button>
      </div>
    </div>
  );
};

export default Rewards;

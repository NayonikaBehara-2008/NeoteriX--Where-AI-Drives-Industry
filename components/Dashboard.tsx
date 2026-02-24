
import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  BarChart3, 
  Heart, 
  Zap,
  ArrowUpRight,
  TrendingUp,
  Smile
} from 'lucide-react';
import { DonationRecord, UserProfile, ViewState } from '../types';
import { SAMPLE_NGOS, REGION_CONFIGS, TRANSLATIONS } from '../constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  donations: DonationRecord[];
  userProfile: UserProfile;
  onViewChange: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ donations, userProfile, onViewChange }) => {
  const rConfig = REGION_CONFIGS[userProfile.region];
  const t = TRANSLATIONS[userProfile.language];

  // Animation states
  const [pulseGifted, setPulseGifted] = useState(false);
  const [pulsePoints, setPulsePoints] = useState(false);
  
  // Refs to track previous values
  const prevDonated = useRef(userProfile.totalDonated);
  const prevPoints = useRef(userProfile.points);

  useEffect(() => {
    if (userProfile.totalDonated !== prevDonated.current) {
      setPulseGifted(true);
      const timer = setTimeout(() => setPulseGifted(false), 700);
      prevDonated.current = userProfile.totalDonated;
      return () => clearTimeout(timer);
    }
  }, [userProfile.totalDonated]);

  useEffect(() => {
    if (userProfile.points !== prevPoints.current) {
      setPulsePoints(true);
      const timer = setTimeout(() => setPulsePoints(false), 700);
      prevPoints.current = userProfile.points;
      return () => clearTimeout(timer);
    }
  }, [userProfile.points]);

  const chartData = donations.slice(0, 10).reverse().map(d => ({
    date: new Date(d.date).toLocaleDateString(rConfig.locale, { month: 'short', day: 'numeric' }),
    amount: d.amount
  }));

  const stats = [
    { 
      id: 'gifted',
      label: "Total Gifted", 
      value: `${rConfig.symbol}${userProfile.totalDonated.toLocaleString(rConfig.locale, { minimumFractionDigits: 2 })}`, 
      icon: <Heart className="text-rose-500" />,
      color: "from-rose-500/10 to-transparent",
      animate: pulseGifted
    },
    { 
      id: 'points',
      label: "Joy Credits", 
      value: userProfile.points.toLocaleString(), 
      icon: <Smile className="text-amber-500" />,
      color: "from-amber-500/10 to-transparent",
      animate: pulsePoints
    },
    { 
      id: 'hearts',
      label: 'Verified Hearts', 
      value: new Set(donations.map(d => d.ngoId)).size.toString(), 
      icon: <Users className="text-sky-500" />,
      color: "from-sky-500/10 to-transparent",
      animate: false
    },
  ];

  return (
    <div className="animate-in fade-in duration-700 slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-amber-200/50">
            <TrendingUp className="w-3.5 h-3.5" /> High Impact Week
          </div>
          <h1 className="text-5xl font-black tracking-tight text-zinc-900 dark:text-white mb-2">
            Your Joy Dashboard
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium">Tracking every smile created from your spare rewards.</p>
        </div>
        <button 
          onClick={() => onViewChange('capture')}
          className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-8 py-4 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 shadow-xl shadow-zinc-200/50 dark:shadow-none"
        >
          Jar New Reward <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {stats.map((stat) => (
          <div 
            key={stat.id} 
            className={`relative bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-8 rounded-[2.5rem] border border-white dark:border-zinc-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden group hover:border-amber-200 transition-all duration-300 ${stat.animate ? 'animate-stat-update' : ''}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
            <div className="flex items-center justify-between mb-6 relative z-10">
              <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">{stat.label}</span>
              <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800 rounded-2xl shadow-inner group-hover:scale-110 transition-transform">{stat.icon}</div>
            </div>
            <h3 className="text-3xl font-black tracking-tight dark:text-white relative z-10">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-10 rounded-[3rem] border border-white dark:border-zinc-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500">Impact Growth</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Savings</span>
              </div>
            </div>
          </div>
          <div className="h-72 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorImpact" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.3} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#a1a1aa', fontWeight: 700}} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', backgroundColor: '#18181b', color: '#fff', fontSize: '10px', fontWeight: 'bold', padding: '12px 20px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} 
                    itemStyle={{ color: '#f59e0b' }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorImpact)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-300 dark:text-zinc-800">
                <BarChart3 className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-[11px] font-black uppercase tracking-[0.3em]">Fill the jar to see growth</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-10 rounded-[3rem] border border-white dark:border-zinc-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500 mb-10">Jar Activity</h2>
          <div className="space-y-8">
            {donations.length > 0 ? (
              donations.slice(0, 5).map((donation) => {
                const ngo = SAMPLE_NGOS.find(n => n.id === donation.ngoId);
                return (
                  <div key={donation.id} className="flex items-center gap-5 group cursor-pointer">
                    <div className="w-12 h-12 rounded-[1.25rem] bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-50 dark:group-hover:bg-amber-900/20 transition-all shadow-sm">
                      <Zap className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0 text-zinc-900 dark:text-zinc-100">
                      <p className="text-sm font-black truncate">{rConfig.symbol}{donation.amount.toFixed(2)} to {ngo?.name}</p>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest mt-0.5">{donation.source}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-20 text-center text-zinc-300 dark:text-zinc-800 text-[11px] font-black uppercase tracking-[0.3em] leading-relaxed">
                Awaiting your first <br/> reward sync
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes stat-update {
          0% { transform: scale(1); border-color: transparent; }
          40% { transform: scale(1.04); border-color: #f59e0b; }
          100% { transform: scale(1); border-color: inherit; }
        }
        .animate-stat-update {
          animation: stat-update 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;

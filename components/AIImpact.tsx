
import React, { useState, useEffect } from 'react';
import { BrainCircuit, Sparkles, Loader2, Heart } from 'lucide-react';
import { DonationRecord, NGO, Language, Region } from '../types';
import { generateImpactInsight, getPersonalizedCauseSuggestion } from '../services/geminiService';

interface AIImpactProps {
  totalDonated: number;
  donations: DonationRecord[];
  ngos: NGO[];
  lang: Language;
  region: Region;
  darkMode?: boolean;
}

const AIImpact: React.FC<AIImpactProps> = ({ totalDonated, donations, ngos, lang, region, darkMode }) => {
  const [insight, setInsight] = useState<string>('');
  const [suggestion, setSuggestion] = useState<NGO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadAIContent = async () => {
      setLoading(true);
      try {
        const lastDonation = donations[0];
        const recentNgoId = lastDonation?.ngoId || ngos[0].id;
        const targetNgo = ngos.find(n => n.id === recentNgoId) || ngos[0];
        
        const currentAmount = donations.length > 0 ? totalDonated : 10;
        
        const [insightRes, suggestionRes] = await Promise.all([
          generateImpactInsight(currentAmount, targetNgo, lastDonation?.source, lang, region),
          getPersonalizedCauseSuggestion(['social welfare', 'childcare', 'elderly support'], ngos, lang)
        ]);

        setInsight(insightRes);
        setSuggestion(suggestionRes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadAIContent();
  }, [donations, totalDonated, ngos, lang, region]);

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900 text-teal-600 dark:text-teal-400 border border-zinc-100 dark:border-zinc-800 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
          <BrainCircuit className="w-3.5 h-3.5" /> Gemini AI Advisor
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">Impact Insights</h1>
        <p className="text-zinc-400 dark:text-zinc-500 text-sm">Personalized analysis of your redirected savings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-8 shadow-sm dark:shadow-none flex flex-col relative overflow-hidden group">
          <h2 className="text-sm font-bold mb-6 flex items-center gap-2 uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            <Sparkles className="text-amber-500 dark:text-amber-400 w-4 h-4" /> Impact Narrative
          </h2>

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10">
              <Loader2 className="w-6 h-6 text-teal-600 dark:text-teal-400 animate-spin mb-4" />
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest">Analyzing savings...</p>
            </div>
          ) : (
            <div className="flex-1">
              <div className="bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-700 italic text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed relative">
                <span className="text-3xl absolute -top-2 -left-1 text-teal-200 dark:text-teal-400 opacity-30 font-serif">"</span>
                {insight}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-8 flex flex-col shadow-sm dark:shadow-none relative">
          {darkMode && <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 blur-2xl pointer-events-none"></div>}
          <h2 className="text-sm font-bold mb-6 flex items-center gap-2 uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            <Heart className="text-rose-500 dark:text-rose-400 w-4 h-4" /> Match Recommendation
          </h2>

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10">
              <Loader2 className="w-6 h-6 text-zinc-200 dark:text-zinc-700 animate-spin mb-4" />
            </div>
          ) : suggestion && (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <img src={suggestion.image} className="w-16 h-16 rounded-xl object-cover grayscale opacity-80" alt={suggestion.name} />
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{suggestion.name}</h3>
                  <span className="text-[8px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded uppercase font-bold tracking-widest">{suggestion.type}</span>
                </div>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8 line-clamp-2">{suggestion.description}</p>
              <button className="mt-auto w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-all">
                Support NGO
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIImpact;

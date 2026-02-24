
import React from 'react';
import { Heart, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';
import { NGO } from '../types';
import { SAMPLE_NGOS } from '../constants';

interface NGOExplorerProps {
  selectedNGO: NGO;
  onSelect: (ngo: NGO) => void;
}

const NGOExplorer: React.FC<NGOExplorerProps> = ({ selectedNGO, onSelect }) => {
  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">NGO Directory</h1>
        <p className="text-zinc-400 dark:text-zinc-500 text-sm mt-1">Select the cause that receives your redirected savings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SAMPLE_NGOS.map((ngo) => (
          <div 
            key={ngo.id} 
            className={`group bg-white dark:bg-zinc-900 rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer flex flex-col ${
              selectedNGO.id === ngo.id 
                ? 'border-teal-500/40 dark:border-teal-400/50 shadow-sm ring-1 ring-teal-500/10 dark:ring-teal-400/20' 
                : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'
            }`}
            onClick={() => onSelect(ngo)}
          >
            <div className="h-40 relative">
              <img src={ngo.image} alt={ngo.name} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700" />
              <div className="absolute top-3 left-3 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[8px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-widest shadow-sm">
                {ngo.type}
              </div>
              {selectedNGO.id === ngo.id && (
                <div className="absolute top-3 right-3 bg-teal-600 dark:bg-teal-500 text-white p-1 rounded-lg shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-center gap-1 text-zinc-400 dark:text-zinc-500 text-[8px] font-bold uppercase tracking-widest mb-1.5">
                <MapPin className="w-2.5 h-2.5" /> {ngo.location}
              </div>
              <h3 className="text-sm font-bold mb-2 tracking-tight dark:text-white">{ngo.name}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-[11px] leading-relaxed mb-6 flex-1">{ngo.description}</p>
              
              <button 
                className={`w-full py-2 rounded-xl font-bold text-[9px] uppercase tracking-[0.15em] transition-all ${
                  selectedNGO.id === ngo.id
                    ? 'bg-teal-600 dark:bg-teal-500 text-white shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {selectedNGO.id === ngo.id ? 'Active' : 'Select'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NGOExplorer;

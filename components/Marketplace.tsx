
import React, { useState } from 'react';
import { ShoppingCart, Heart, Tag, Sparkles } from 'lucide-react';
import { Product, NGO, Category } from '../types';
import { SAMPLE_PRODUCTS } from '../constants';

interface MarketplaceProps {
  onDonate: (product: Product) => void;
  selectedNGO: NGO;
  onSelectNGO: () => void;
  darkMode?: boolean;
}

const Marketplace: React.FC<MarketplaceProps> = ({ onDonate, selectedNGO, onSelectNGO, darkMode }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  const filteredProducts = activeCategory === 'All' 
    ? SAMPLE_PRODUCTS 
    : SAMPLE_PRODUCTS.filter(p => p.category === activeCategory);

  const handlePurchase = (product: Product) => {
    setAnimatingId(product.id);
    onDonate(product);
    setTimeout(() => setAnimatingId(null), 1500);
  };

  return (
    <div className="animate-in slide-in-from-bottom-8 duration-700">
      <div className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold text-stone-900 dark:text-white tracking-tight">Kind Marketplace</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-2 font-medium">Curated products that give back. Every discount you receive is transformed into life-changing impact.</p>
        </div>
        
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 flex items-center gap-5 shadow-sm">
          <div className="bg-teal-50 dark:bg-teal-900/20 p-3 rounded-2xl">
            <Heart className="w-7 h-7 text-teal-600 dark:text-teal-400 fill-teal-600 dark:fill-teal-400 opacity-20" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-stone-400 mb-1">Impact Destination</p>
            <p className="font-bold text-stone-900 dark:text-white flex items-center gap-2">
              {selectedNGO.name} 
              <button 
                onClick={onSelectNGO} 
                className="text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 px-3 py-1 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-all font-bold uppercase tracking-widest"
              >
                Switch
              </button>
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-6 mb-10 scrollbar-hide no-scrollbar">
        {['All', ...Object.values(Category)].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap uppercase tracking-widest ${
              activeCategory === cat 
                ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-lg' 
                : 'bg-white dark:bg-stone-900 text-stone-400 dark:text-stone-500 border border-stone-200 dark:border-stone-800 hover:border-teal-300 dark:hover:border-teal-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
        {filteredProducts.map((product) => {
          const savings = product.price - product.discountPrice;
          return (
            <div key={product.id} className="group flex flex-col h-full bg-white dark:bg-stone-900 rounded-[2.5rem] border border-stone-200 dark:border-stone-800 overflow-hidden hover:shadow-2xl hover:shadow-stone-200/50 dark:hover:shadow-none transition-all duration-500">
              <div className="relative aspect-[4/5] overflow-hidden bg-stone-100 dark:bg-stone-800">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute top-6 left-6 bg-teal-600 text-white text-[10px] font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg tracking-widest uppercase">
                  <Tag className="w-3 h-3" /> Save & Gift ${savings.toFixed(2)}
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="mb-4">
                  <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-[0.2em]">{product.category}</span>
                  <h3 className="text-xl font-bold text-stone-900 dark:text-white mt-1">{product.name}</h3>
                </div>
                <p className="text-sm text-stone-500 dark:text-stone-400 line-clamp-2 mb-8 flex-1">{product.description}</p>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-stone-900 dark:text-white tracking-tight">${product.discountPrice.toFixed(2)}</span>
                    <span className="text-xs text-stone-400 line-through opacity-60">${product.price.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={() => handlePurchase(product)}
                    disabled={animatingId === product.id}
                    className={`relative overflow-hidden px-6 py-3.5 rounded-[1.25rem] text-xs font-bold uppercase tracking-widest flex items-center gap-3 transition-all ${
                      animatingId === product.id
                        ? 'bg-teal-600 text-white shadow-teal-200'
                        : 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:opacity-90 active:scale-95'
                    }`}
                  >
                    {animatingId === product.id ? (
                      <Sparkles className="w-4 h-4 animate-pulse" />
                    ) : (
                      <ShoppingCart className="w-4 h-4" />
                    )}
                    {animatingId === product.id ? 'Impact Sent!' : 'Add to Impact'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Marketplace;

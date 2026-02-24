
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Star, 
  MessageCircle, 
  ChevronRight, 
  Globe, 
  TrendingUp, 
  Search, 
  Info, 
  Send, 
  X, 
  Shield, 
  Sparkles, 
  UserCheck, 
  UserPlus, 
  UserMinus, 
  Mail, 
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Target,
  Zap,
  Layout,
  ArrowRight,
  Eye,
  Heart,
  Layers,
  Code2,
  Cpu
} from 'lucide-react';
import { ProductFeedback, UserProfile, HumanReview, Message } from '../types';
import Dashboard from './Dashboard';

interface CommunityViewProps {
  currentUser: UserProfile;
  auditHistory: ProductFeedback[];
  onFollow: (creatorId: string) => void;
  onSendMessage: (receiverId: string, content: string) => void;
  messages: Message[];
  t: any;
}

const MOCK_COMMUNITY: ProductFeedback[] = [
  {
    id: 'c1',
    creatorId: 'user-elena-v',
    creatorName: 'Elena Volkov',
    category: 'Health & Wellness',
    overview: 'Mindful Fitness Tracker 🧘‍♀️',
    detailedDescription: 'NeonPulse is a biometric-driven fitness ecosystem designed to prevent burnout. It utilizes real-time HRV (Heart Rate Variability) analysis to suggest recovery periods. The architecture leverages low-latency WebSocket connections for instant biometric sync.',
    readinessScore: 88,
    timestamp: Date.now() - 86400000,
    isPublic: true,
    views: 1240,
    likes: 423,
    techStack: ['React Native', 'Node.js', 'TensorFlow Lite', 'WebSockets'],
    humanReviews: [
      { id: 'r1', reviewerName: 'Marcus Chen', content: 'The recovery algorithm is surprisingly accurate compared to my Oura ring.', rating: 5, timestamp: Date.now() - 43200000 }
    ],
    metrics: { ux: 95, security: 80, performance: 75, marketFit: 90, innovation: 95 },
    strengths: ['Predictive Recovery Algorithm', 'Calm Glassmorphic UI', 'HIPAA Compliant Data Layer'],
    vulnerabilities: [
      { 
        issue: 'Insecure Local Storage', 
        severity: 'High', 
        description: 'Biometric tokens are currently stored in unencrypted SharedPreferences.', 
        solution: 'Implement EncryptedSharedPreferences (Android) and Keychain (iOS).',
        codeSnippet: 'const storage = new EncryptedStorage();'
      }
    ],
    suggestions: [
      { category: 'Social', action: 'Add "Buddy Check" notifications', benefit: 'Increases retention via social accountability.' }
    ],
    roadmap: ["Q3: WearOS Integration", "Q4: AI Sleep Coaching", "2026: Subscription Portal"],
    targetUsers: [{ persona: "High-Performance Executives", reason: "Suffer from chronic burnout", reachOutStrategy: "LinkedIn direct outreach & B2B Wellness partnerships" }]
  },
  {
    id: 'c2',
    creatorId: 'user-cyberdyne',
    creatorName: 'CyberDyne Labs',
    category: 'AgriTech',
    overview: 'TerraFlow Solar Garden 🪴☀️',
    detailedDescription: 'An autonomous urban farming solution that utilizes ESP32 sensors to monitor soil hydration, NPK levels, and ambient CO2. TerraFlow creates a self-sustaining loop by optimizing water usage based on hyper-local weather forecasting APIs.',
    readinessScore: 72,
    timestamp: Date.now() - 172800000,
    isPublic: true,
    views: 890,
    likes: 156,
    techStack: ['C++', 'Rust', 'MQTT', 'InfluxDB'],
    humanReviews: [],
    metrics: { ux: 60, security: 90, performance: 85, marketFit: 65, innovation: 80 },
    strengths: ['Low Power Mesh Networking', 'Zero-Water Waste Protocol', 'Modular Hardware Design'],
    vulnerabilities: [
      { 
        issue: 'Default MQTT Credentials', 
        severity: 'Critical', 
        description: 'Hardcoded credentials in firmware allow potential device hijacking.', 
        solution: 'Implement dynamic certificate-based authentication.',
        codeSnippet: 'WiFiClientSecure client;'
      }
    ],
    suggestions: [
      { category: 'UX', action: 'Simplify the sensor calibration wizard', benefit: 'Reduces initial setup time for non-technical users.' }
    ],
    roadmap: ["Industrial Pilot Program", "Hydroponic Support", "TerraFlow Cloud v1.0"],
    targetUsers: [{ persona: "Urban Apartment Dwellers", reason: "Lack of green space", reachOutStrategy: "Instagram lifestyle ads & local plant shops" }]
  },
  {
    id: 'c3',
    creatorId: 'user-zion-ai',
    creatorName: 'Zion AI',
    category: 'Security',
    overview: 'GhostCode Contract Scanner 🛡️',
    detailedDescription: 'GhostCode is an AI-powered static analysis tool for Solidity smart contracts. It identifies reentrancy vulnerabilities and gas inefficiencies before mainnet deployment. It uses a proprietary Large Language Model fine-tuned on the Etherscan exploit database.',
    readinessScore: 94,
    timestamp: Date.now() - 259200000,
    isPublic: true,
    views: 2310,
    likes: 892,
    techStack: ['Python', 'Solidity', 'PyTorch', 'AWS Lambda'],
    humanReviews: [
      { id: 'r2', reviewerName: 'Dev_Chain', content: 'Saved us from a $2M reentrancy exploit on our DAO launch.', rating: 5, timestamp: Date.now() - 100000000 }
    ],
    metrics: { ux: 85, security: 98, performance: 90, marketFit: 92, innovation: 96 },
    strengths: ['Zero False-Positives in Audit Mode', 'Lightning Fast Execution', 'Automatic Gas Optimization Suggestions'],
    vulnerabilities: [],
    suggestions: [
      { category: 'Business', action: 'Create a GitHub Action integration', benefit: 'Embedded directly into developer workflows.' }
    ],
    roadmap: ["Rust (Solana) Support", "DeFi Risk Simulation", "Enterprise Dashboard"],
    targetUsers: [{ persona: "Web3 Developers", reason: "High risk of capital loss", reachOutStrategy: "Developer grants & ETHGlobal sponsorship" }]
  }
];

const CommunityView: React.FC<CommunityViewProps> = ({ currentUser, auditHistory, onFollow, onSendMessage, messages, t }) => {
  const [items, setItems] = useState<ProductFeedback[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductFeedback | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeChatName, setActiveChatName] = useState<string>('');
  const [reviewText, setReviewText] = useState('');
  const [chatContent, setChatContent] = useState('');
  const [rating, setRating] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const userPublic = auditHistory.filter(h => h.isPublic);
    const enrichedUserPublic = userPublic.map(item => ({
        ...item,
        views: item.views || Math.floor(Math.random() * 100),
        likes: item.likes || Math.floor(Math.random() * 20),
        techStack: item.techStack || ['Web Standards']
    }));
    setItems([...enrichedUserPublic, ...MOCK_COMMUNITY]);
  }, [auditHistory]);

  const filteredItems = items.filter(item => 
    item.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.creatorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openChat = (creatorId: string, name: string) => {
    setActiveChatId(creatorId);
    setActiveChatName(name);
    setIsChatOpen(true);
  };

  const submitReview = () => {
    if (!reviewText.trim() || !selectedProduct) return;
    const newReview: HumanReview = {
      id: crypto.randomUUID(),
      reviewerName: currentUser.name,
      content: reviewText.trim(),
      rating: rating,
      timestamp: Date.now()
    };
    const updatedItems = items.map(item => {
      if (item.id === selectedProduct.id) {
        return { ...item, humanReviews: [...(item.humanReviews || []), newReview] };
      }
      return item;
    });
    setItems(updatedItems);
    setSelectedProduct({ ...selectedProduct, humanReviews: [...(selectedProduct.humanReviews || []), newReview] });
    setReviewText('');
    setRating(5);
  };

  const handleSendChat = () => {
    if (!chatContent.trim() || !activeChatId) return;
    onSendMessage(activeChatId, chatContent.trim());
    setChatContent('');
  };

  const currentChatMessages = messages.filter(m => 
    (m.senderId === currentUser.id && m.receiverId === activeChatId) ||
    (m.senderId === activeChatId && m.receiverId === currentUser.id)
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-indigo-600 font-black text-xs uppercase tracking-[0.4em]">
            <TrendingUp className="w-5 h-5" />
            Vanguard Ecosystem
          </div>
          <h2 className="text-6xl font-black tracking-tighter text-slate-950 dark:text-white font-outfit uppercase">{t.title}</h2>
          <p className="text-slate-500 font-bold max-w-lg uppercase">{t.sub}</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full pl-14 pr-8 py-4 outline-none focus:border-indigo-500 transition-all font-bold text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {filteredItems.map(item => (
          <div 
            key={item.id}
            className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all group flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white font-black text-2xl shadow-lg">
                  {item.creatorName?.[0] || 'V'}
                </div>
                <div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.creatorName}</div>
                  <h4 className="text-xl font-black text-slate-950 dark:text-white font-outfit tracking-tight leading-tight">{item.overview}</h4>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl text-indigo-600 font-black text-xs shadow-sm">
                {item.readinessScore}%
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg text-[9px] font-black uppercase tracking-wider">
                {item.category}
              </span>
              {item.techStack?.slice(0, 2).map(tech => (
                <span key={tech} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-wider">
                  {tech}
                </span>
              ))}
            </div>
            
            <p className="text-slate-500 dark:text-slate-400 font-bold mb-8 text-sm leading-relaxed line-clamp-3 h-15">
              {item.detailedDescription || item.overview}
            </p>

            <div className="flex items-center gap-6 mb-8 text-slate-400">
               <div className="flex items-center gap-1.5 text-xs font-black">
                 <Eye className="w-4 h-4" /> {item.views} {t.views}
               </div>
               <div className="flex items-center gap-1.5 text-xs font-black">
                 <Heart className="w-4 h-4" /> {item.likes} {t.likes}
               </div>
               <div className="flex items-center gap-1.5 text-xs font-black ml-auto">
                 <MessageCircle className="w-4 h-4" /> {item.humanReviews?.length || 0}
               </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <button 
                onClick={() => onFollow(item.creatorId!)}
                className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  currentUser.following.includes(item.creatorId!) 
                  ? 'bg-rose-50 text-rose-600 shadow-sm' 
                  : 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                }`}
              >
                {currentUser.following.includes(item.creatorId!) ? t.unfollow : t.follow}
              </button>
              <button 
                onClick={() => openChat(item.creatorId!, item.creatorName!)}
                className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-500 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
              >
                <Mail className="w-5 h-5" />
              </button>
            </div>

            <button 
              onClick={() => setSelectedProduct(item)}
              className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 hover:bg-indigo-500 dark:hover:bg-indigo-500 hover:text-white text-[10px] uppercase tracking-widest"
            >
              {t.examine} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setSelectedProduct(null)}></div>
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-6xl h-full max-h-[90vh] rounded-[4rem] shadow-3xl border border-white dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in fade-in duration-300">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl">
                  {selectedProduct.creatorName?.[0] || 'V'}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-950 dark:text-white font-outfit uppercase tracking-tight">{selectedProduct.overview}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Examination • {selectedProduct.creatorName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    const pid = selectedProduct.creatorId;
                    const pname = selectedProduct.creatorName;
                    setSelectedProduct(null);
                    if (pid && pname) openChat(pid, pname);
                  }}
                  className="px-6 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 transition-all"
                >
                  <Mail className="w-4 h-4" /> Message Creator
                </button>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
              <Dashboard 
                feedback={selectedProduct} 
                onReset={() => setSelectedProduct(null)} 
                onTogglePublic={() => {}} 
                language={currentUser.language} 
                resetLabel="Close Examination"
              />
            </div>
          </div>
        </div>
      )}

      {isChatOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsChatOpen(false)}></div>
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-md h-[600px] rounded-[3rem] shadow-3xl border border-white dark:border-slate-800 overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-300">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-indigo-600 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black">
                  {activeChatName[0]}
                </div>
                <div>
                  <div className="text-sm font-black uppercase tracking-tight">{activeChatName}</div>
                  <div className="text-[8px] font-bold opacity-70 uppercase tracking-widest">Active Builder</div>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50 dark:bg-slate-950">
              {currentChatMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                  <MessageSquare className="w-12 h-12" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Start a conversation with {activeChatName}</p>
                </div>
              ) : (
                currentChatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-bold shadow-sm ${
                      msg.senderId === currentUser.id 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={chatContent}
                  onChange={(e) => setChatContent(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-3 outline-none focus:border-indigo-500 font-bold text-sm"
                />
                <button 
                  onClick={handleSendChat}
                  className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg active:scale-90"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityView;

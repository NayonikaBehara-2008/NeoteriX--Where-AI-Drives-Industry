
import React from 'react';
import { 
  ResponsiveContainer, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis 
} from 'recharts';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Code, 
  Lightbulb, 
  ShieldAlert,
  Zap,
  Layout,
  FileJson,
  Printer,
  Users,
  Target,
  ChevronRight,
  Info,
  Sparkles,
  Share2,
  ArrowRight,
  Rocket,
  Download,
  FileText
} from 'lucide-react';
import { ProductFeedback } from '../types';

interface DashboardProps {
  feedback: ProductFeedback;
  onReset: () => void;
  onTogglePublic: () => void;
  language: string;
}

const Dashboard: React.FC<DashboardProps> = ({ feedback, onReset, onTogglePublic }) => {
  const chartData = [
    { subject: 'UX Flow', A: feedback.metrics.ux },
    { subject: 'Security', A: feedback.metrics.security },
    { subject: 'Perf', A: feedback.metrics.performance },
    { subject: 'Market', A: feedback.metrics.marketFit },
    { subject: 'Innovation', A: feedback.metrics.innovation },
  ];

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(feedback, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `neoterix_audit_${feedback.id?.slice(0, 8)}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 pb-20 print:p-0 print:m-0">
      <style>{`
        @media print {
          header, footer, nav, button, .voice-aura, .liquid-metal-container, .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .print-container {
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            border: none !important;
          }
          .glass-card, .bg-white, .dark\\:bg-slate-900 {
            background: white !important;
            border: 1px solid #eee !important;
            box-shadow: none !important;
            color: black !important;
          }
          .text-white, .dark\\:text-white {
            color: black !important;
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 no-print">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-indigo-600 font-black text-xs uppercase tracking-[0.3em]">
            <Zap className="w-4 h-4" />
            NeoteriX Report is Ready
          </div>
          <h2 className="text-6xl font-black tracking-tighter text-slate-950 dark:text-white font-outfit">Audit Review.</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-black text-xs shadow-lg hover:-translate-y-1 transition-all"
            title="Download as PDF"
          >
            <FileText className="w-4 h-4" />
            PDF
          </button>
          <button 
            onClick={handleDownloadJSON}
            className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-black text-xs shadow-lg hover:-translate-y-1 transition-all"
            title="Export Raw Data"
          >
            <FileJson className="w-4 h-4" />
            JSON
          </button>
          <button 
            onClick={onTogglePublic}
            className={`flex items-center gap-3 px-8 py-4 rounded-full font-black text-xs transition-all shadow-lg active:scale-95 ${
              feedback.isPublic 
                ? 'bg-emerald-500 text-white border-emerald-500' 
                : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Share2 className="w-4 h-4" />
            {feedback.isPublic ? 'Shared' : 'Share'}
          </button>
          <button onClick={onReset} className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-8 py-4 rounded-full font-black shadow-xl hover:-translate-y-1 transition-all text-sm font-outfit uppercase">
            New Audit
          </button>
        </div>
      </div>

      {/* Main Score and Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 print-container">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-12 shadow-sm flex flex-col">
          <h3 className="text-3xl font-black text-slate-950 dark:text-white mb-6 flex items-center gap-4 font-outfit uppercase">
            <Sparkles className="w-8 h-8 text-indigo-500" />
            Industrial Summary
          </h3>
          <p className="text-slate-900 dark:text-slate-100 leading-relaxed text-2xl font-bold mb-10">{feedback.overview}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-auto">
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-8 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-900/30">
              <h4 className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                INDUSTRIAL STRENGTHS
              </h4>
              <ul className="space-y-4">
                {feedback.strengths.map((s, i) => (
                  <li key={i} className="text-sm font-bold flex items-start gap-3 text-slate-900 dark:text-slate-200">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-indigo-50/50 dark:bg-indigo-950/20 p-8 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-900/30">
              <h4 className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Rocket className="w-4 h-4" />
                NEOTERIX ROADMAP
              </h4>
              <ul className="space-y-4">
                {feedback.roadmap.map((r, i) => (
                  <li key={i} className="text-sm font-bold flex items-start gap-3 text-slate-900 dark:text-slate-200">
                    <span className="text-indigo-600 dark:text-indigo-400 font-black">{i+1}.</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-12 shadow-sm flex flex-col items-center">
          <h3 className="text-2xl font-black text-slate-950 dark:text-white mb-8 self-start flex items-center gap-4 font-outfit uppercase">
            <Layout className="w-6 h-6 text-fuchsia-500" />
            System Vitals
          </h3>
          <div className="w-full h-64 print:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                <Radar name="Stats" dataKey="A" stroke="#6366f1" strokeWidth={2} fill="#6366f1" fillOpacity={0.1} dot={{ r: 4, fill: '#6366f1' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-5xl font-black text-indigo-600 font-outfit mt-4">{feedback.readinessScore}%</div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aggregate Readiness Score</div>
        </div>
      </div>

      {/* Risks and Improvements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 print-container">
        {/* Risks Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-12 shadow-sm space-y-8">
          <h3 className="text-3xl font-black text-rose-500 flex items-center gap-4 font-outfit uppercase">
            <AlertTriangle className="w-8 h-8" />
            Critical Fixes (Risks)
          </h3>
          <div className="space-y-6">
            {feedback.vulnerabilities.map((v, i) => (
              <div key={i} className="p-6 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-lg text-slate-900 dark:text-white">{v.issue}</h4>
                  <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    v.severity === 'Critical' || v.severity === 'High' ? 'bg-rose-100 dark:bg-rose-950/30 text-rose-600' : 'bg-amber-100 dark:bg-amber-950/30 text-amber-600'
                  }`}>{v.severity}</span>
                </div>
                <p className="text-sm font-bold text-slate-500 leading-relaxed">{v.description}</p>
                <div className="pt-3 border-t border-slate-200/50 dark:border-slate-800">
                  <div className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1">PROPOSED SOLUTION</div>
                  <p className="text-sm font-black text-slate-800 dark:text-slate-200">{v.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggestions Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-12 shadow-sm space-y-8">
          <h3 className="text-3xl font-black text-indigo-600 flex items-center gap-4 font-outfit uppercase">
            <Lightbulb className="w-8 h-8" />
            Optimization Paths
          </h3>
          <div className="space-y-6">
            {feedback.suggestions.map((s, i) => (
              <div key={i} className="p-6 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black">
                    {i+1}
                  </div>
                  <h4 className="font-black text-lg text-slate-900 dark:text-white uppercase text-xs tracking-widest">{s.category}</h4>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-black text-slate-800 dark:text-slate-100">{s.action}</div>
                  <p className="text-xs font-bold text-slate-400">Impact: {s.benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Target Users */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-12 shadow-sm space-y-10 print-container">
        <h3 className="text-3xl font-black text-slate-950 dark:text-white flex items-center gap-4 font-outfit uppercase">
          <Users className="w-8 h-8 text-teal-500" />
          Market Personas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {feedback.targetUsers.map((user, i) => (
            <div key={i} className="p-8 bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-4">
              <h4 className="text-xl font-black font-outfit text-slate-900 dark:text-white">{user.persona}</h4>
              <p className="text-xs font-bold text-slate-500 italic">"{user.reason}"</p>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="text-[9px] font-black text-teal-600 uppercase tracking-widest mb-1">ENGAGEMENT STRATEGY</div>
                <p className="text-sm font-black text-slate-800 dark:text-slate-200">{user.reachOutStrategy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

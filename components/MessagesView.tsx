
import React, { useState } from 'react';
import { MessageSquare, Send, Search, User, ChevronRight, X } from 'lucide-react';
import { Message, UserProfile } from '../types';

interface MessagesViewProps {
  currentUser: UserProfile;
  messages: Message[];
  onSendMessage: (receiverId: string, content: string) => void;
  t: any;
}

const MOCK_CONTACTS = [
  { id: 'user-elena-v', name: 'Elena Volkov', role: 'UX Designer', color: 'bg-indigo-500' },
  { id: 'user-cyberdyne', name: 'CyberDyne Labs', role: 'Hardware Engineering', color: 'bg-violet-600' },
  { id: 'user-zion-ai', name: 'Zion AI', role: 'AI Researcher', color: 'bg-teal-500' },
];

const MessagesView: React.FC<MessagesViewProps> = ({ currentUser, messages, onSendMessage, t }) => {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');

  const activeMessages = selectedContactId 
    ? messages.filter(m => (m.senderId === currentUser.id && m.receiverId === selectedContactId) || (m.senderId === selectedContactId && m.receiverId === currentUser.id))
    : [];

  const handleSend = () => {
    if (!chatInput.trim() || !selectedContactId) return;
    onSendMessage(selectedContactId, chatInput.trim());
    setChatInput('');
  };

  const selectedContact = MOCK_CONTACTS.find(c => c.id === selectedContactId);

  return (
    <div className="max-w-6xl mx-auto h-[700px] flex glass-card rounded-[3.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 animate-in fade-in duration-700">
      {/* Sidebar */}
      <div className="w-full md:w-80 border-r border-slate-100 dark:border-slate-800 flex flex-col bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 space-y-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-outfit uppercase">{t.title}</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              placeholder={t.search}
              className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl pl-12 pr-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {MOCK_CONTACTS.map(contact => (
            <button
              key={contact.id}
              onClick={() => setSelectedContactId(contact.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all ${
                selectedContactId === contact.id 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200/50 dark:shadow-none' 
                : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-200'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${selectedContactId === contact.id ? 'bg-white/20' : contact.color + ' text-white'}`}>
                {contact.name[0].toUpperCase()}
              </div>
              <div className="text-left overflow-hidden">
                <div className="font-black truncate uppercase">{contact.name}</div>
                <div className={`text-[10px] font-bold uppercase tracking-widest opacity-60`}>{contact.role}</div>
              </div>
              {selectedContactId === contact.id && <ChevronRight className="ml-auto w-4 h-4" />}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative bg-white dark:bg-slate-950">
        {selectedContactId ? (
          <>
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl ${selectedContact?.color} flex items-center justify-center text-white font-black text-xl shadow-lg`}>
                  {selectedContact?.name[0].toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white font-outfit uppercase">{selectedContact?.name}</h4>
                  <p className="text-[10px] font-black uppercase text-teal-600 tracking-widest">Active Manufacturer</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-6 custom-scrollbar flex flex-col">
              {activeMessages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <MessageSquare className="w-12 h-12 opacity-20" />
                  <p className="font-bold uppercase tracking-widest text-[10px]">No Neural Echoes</p>
                </div>
              ) : (
                activeMessages.map(m => (
                  <div key={m.id} className={`flex ${m.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-6 py-4 rounded-[2rem] text-sm font-bold shadow-sm ${
                      m.senderId === currentUser.id 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none'
                    }`}>
                      {m.content}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-8 border-t border-slate-100 dark:border-slate-800">
              <div className="flex gap-4">
                <input 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t.placeholder}
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-full px-8 py-5 outline-none focus:border-indigo-500 font-bold text-slate-900 dark:text-white"
                />
                <button 
                  onClick={handleSend}
                  className="bg-indigo-600 text-white p-5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all"
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 space-y-6">
            <div className="bg-slate-50 dark:bg-slate-900 p-10 rounded-[4rem] border border-slate-100 dark:border-slate-800">
              <MessageSquare className="w-20 h-20 opacity-20" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white font-outfit uppercase">{t.title} Inbox</h3>
              <p className="text-sm font-bold opacity-60 max-w-[240px] uppercase">{t.empty}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesView;

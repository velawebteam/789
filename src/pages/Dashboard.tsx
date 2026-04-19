import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Send, 
  User, 
  Loader2, 
  ArrowLeft, 
  Wrench, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface Message {
  id: string;
  user_id: string;
  message: string;
  timestamp: any;
  sender_role: 'user' | 'admin';
  image_url?: string;
}

type ChatType = 'support' | 'maintenance';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<ChatType>('support');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const collectionName = selectedType === 'support' ? 'support_chats' : 'maintenance_chats';
    
    const q = query(
      collection(db, collectionName),
      where('user_id', '==', user.uid),
      orderBy('timestamp', 'asc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(newMessages);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, selectedType]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !message.trim() || isSending) return;

    setIsSending(true);
    const collectionName = selectedType === 'support' ? 'support_chats' : 'maintenance_chats';

    try {
      await addDoc(collection(db, collectionName), {
        user_id: user.uid,
        message: message.trim(),
        timestamp: serverTimestamp(),
        sender_role: 'user',
        image_url: null
      });
      setMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#FFB800]" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-8 bg-[#0a0a0a]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-[calc(100vh-140px)]">
        <div className="bg-[#111315] border border-white/10 rounded-3xl h-full flex overflow-hidden shadow-2xl">
          
          {/* Sidebar: Chat Selection */}
          <div className="w-full md:w-80 lg:w-96 border-r border-white/10 flex flex-col hidden sm:flex">
            <div className="p-6 border-b border-white/10 bg-white/[0.02]">
              <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-1">{t('chat.dashboardTitle') || 'User Lobby'}</h2>
              <p className="text-xs text-gray-500 font-bold tracking-widest uppercase">Center Hub</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <button
                onClick={() => setSelectedType('support')}
                className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all border ${
                  selectedType === 'support' 
                    ? 'bg-[#FFB800]/10 border-[#FFB800]/50 text-white' 
                    : 'bg-white/[0.02] border-white/5 text-gray-400 hover:bg-white/[0.05] hover:border-white/10'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedType === 'support' ? 'bg-[#FFB800] text-black' : 'bg-white/5'
                }`}>
                  <ShieldCheck size={24} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold uppercase tracking-tight">{t('chat.support')}</p>
                  <p className="text-[10px] opacity-60 font-medium">Customer Support Agent</p>
                </div>
                <ChevronRight size={16} className={selectedType === 'support' ? 'opacity-100' : 'opacity-20'} />
              </button>

              <button
                onClick={() => setSelectedType('maintenance')}
                className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all border ${
                  selectedType === 'maintenance' 
                    ? 'bg-[#FFB800]/10 border-[#FFB800]/50 text-white' 
                    : 'bg-white/[0.02] border-white/5 text-gray-400 hover:bg-white/[0.05] hover:border-white/10'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedType === 'maintenance' ? 'bg-[#FFB800] text-black' : 'bg-white/5'
                }`}>
                  <Wrench size={24} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold uppercase tracking-tight">{t('chat.maintenance') || 'Maintenance'}</p>
                  <p className="text-[10px] opacity-60 font-medium">Technical Assistance</p>
                </div>
                <ChevronRight size={16} className={selectedType === 'maintenance' ? 'opacity-100' : 'opacity-20'} />
              </button>
            </div>

            <div className="p-6 border-t border-white/10 bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center overflow-hidden border border-white/10">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" referrerPolicy="no-referrer" />
                  ) : (
                    <User size={20} className="text-gray-500" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{user.displayName || 'User'}</p>
                  <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col bg-[#0a0a0a]/50">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/')}
                  className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="w-10 h-10 rounded-xl bg-[#FFB800] flex items-center justify-center text-black">
                  {selectedType === 'support' ? <ShieldCheck size={20} /> : <Wrench size={20} />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-tight">
                    {selectedType === 'support' ? t('chat.support') : (t('chat.maintenance') || 'Maintenance Team')}
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Active Support</span>
                  </div>
                </div>
              </div>

              {/* Mobile Type Selector Dropdown or Toggle could go here if needed */}
              <div className="sm:hidden flex gap-2">
                 <button 
                    onClick={() => setSelectedType('support')}
                    className={`p-2 rounded-lg border ${selectedType === 'support' ? 'bg-[#FFB800] text-black border-[#FFB800]' : 'bg-white/5 text-gray-400 border-white/10'}`}
                 >
                    <ShieldCheck size={18} />
                 </button>
                 <button 
                    onClick={() => setSelectedType('maintenance')}
                    className={`p-2 rounded-lg border ${selectedType === 'maintenance' ? 'bg-[#FFB800] text-black border-[#FFB800]' : 'bg-white/5 text-gray-400 border-white/10'}`}
                 >
                    <Wrench size={18} />
                 </button>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
            >
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <Loader2 className="animate-spin text-[#FFB800] mb-4" size={32} />
                  <p className="text-sm text-gray-500 font-bold tracking-widest uppercase italic">Initializing Secure Link...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-12">
                  <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                    <MessageSquare size={40} className="text-gray-600 opacity-20" />
                  </div>
                  <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">No messages yet</h3>
                  <p className="text-gray-500 text-sm max-w-xs mx-auto">
                    Start the conversation by sending a message to our {selectedType === 'support' ? 'support' : 'maintenance'} team.
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender_role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] space-y-2`}>
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.sender_role === 'user' 
                          ? 'bg-[#FFB800] text-black rounded-tr-none' 
                          : 'bg-[#1a1c1e] text-white border border-white/10 rounded-tl-none shadow-lg'
                      }`}>
                        <p>{msg.message}</p>
                      </div>
                      <p className={`text-[10px] font-bold tracking-widest uppercase ${msg.sender_role === 'user' ? 'text-right text-[#FFB800]/70' : 'text-left text-gray-600'}`}>
                        {msg.sender_role === 'admin' ? 'Agent' : 'You'} • {msg.timestamp?.toDate ? new Intl.DateTimeFormat('pt-PT', { hour: '2-digit', minute: '2-digit' }).format(msg.timestamp.toDate()) : '...'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-6 border-t border-white/10 bg-white/[0.02]">
              <div className="flex items-end gap-3 max-w-4xl mx-auto">
                <div className="flex-1 bg-[#1a1c1e] border border-white/10 rounded-2xl focus-within:border-[#FFB800] transition-all overflow-hidden shadow-inner">
                  <textarea 
                    rows={1}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('chat.placeholder')}
                    className="w-full bg-transparent p-4 text-sm text-white focus:outline-none resize-none max-h-40"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                  <div className="px-4 py-1 flex items-center justify-end border-t border-white/5 bg-black/20">
                    <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest">Shift + Enter for new line</span>
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={!message.trim() || isSending}
                  className="w-14 h-14 bg-[#FFB800] text-black rounded-2xl flex items-center justify-center hover:bg-white transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shrink-0"
                >
                  {isSending ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

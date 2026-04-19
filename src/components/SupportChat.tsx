import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Loader2, ShieldCheck } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface Message {
  id: string;
  user_id: string;
  message: string;
  timestamp: any;
  sender_role: 'user' | 'admin';
  image_url?: string;
}

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const isDashboardOrAdmin = location.pathname === '/dashboard' || location.pathname === '/admin';

  useEffect(() => {
    if (!user || !isOpen) return;

    const q = query(
      collection(db, 'support_chats'),
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
    }, (error) => {
      console.error("Firestore Error: ", error);
    });

    return () => unsubscribe();
  }, [user, isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user || !message.trim()) return;

    setIsSending(true);
    try {
      await addDoc(collection(db, 'support_chats'), {
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

  if (!user || isDashboardOrAdmin) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 left-0 w-[350px] sm:w-[400px] h-[500px] bg-[#111315] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFB800] flex items-center justify-center text-black">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{t('chat.support')}</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{t('chat.online')}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
            >
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/5">
                    <MessageSquare size={24} className="text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-400">{t('chat.welcome')}</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`flex ${msg.sender_role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] space-y-1`}>
                      <div className={`p-3 rounded-2xl text-sm ${
                        msg.sender_role === 'user' 
                          ? 'bg-[#FFB800] text-black rounded-tr-none' 
                          : 'bg-white/5 text-white border border-white/10 rounded-tl-none'
                      }`}>
                        {msg.image_url && (
                          <img 
                            src={msg.image_url} 
                            alt="Attached" 
                            className="rounded-lg mb-2 max-w-full h-auto cursor-pointer"
                            onClick={() => window.open(msg.image_url, '_blank')}
                          />
                        )}
                        {msg.message && <p className="leading-relaxed">{msg.message}</p>}
                      </div>
                      <p className={`text-[10px] text-gray-500 uppercase font-bold tracking-widest ${msg.sender_role === 'user' ? 'text-right' : 'text-left'}`}>
                        {msg.timestamp?.toDate ? new Intl.DateTimeFormat('pt-PT', { hour: '2-digit', minute: '2-digit' }).format(msg.timestamp.toDate()) : ''}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-white/5">
              <div className="relative flex items-end gap-2">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl overflow-hidden focus-within:border-[#FFB800] transition-colors">
                  <textarea 
                    rows={1}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('chat.placeholder')}
                    className="w-full bg-transparent p-3 text-sm text-white focus:outline-none resize-none max-h-32"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <div className="px-3 py-1 flex items-center justify-end border-t border-white/5 bg-black/20">
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Enter to send</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSending || !message.trim()}
                  className="p-3 bg-[#FFB800] text-black rounded-xl hover:bg-[#FFB800]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-px"
                >
                  {isSending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#FFB800] rounded-full shadow-2xl flex items-center justify-center text-black relative group"
      >
        <div className="absolute inset-0 rounded-full bg-[#FFB800] animate-ping opacity-20 pointer-events-none group-hover:block hidden"></div>
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>
    </div>
  );
}

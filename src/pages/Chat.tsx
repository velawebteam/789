import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, limit } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Send, 
  User, 
  Loader2, 
  ArrowLeft, 
  ShieldCheck,
  Camera,
  X,
  Lock,
  LogIn
} from 'lucide-react';

interface Message {
  id: string;
  user_id: string;
  message: string;
  timestamp: any;
  sender_role: 'user' | 'admin';
  image_url?: string;
}

export default function Chat() {
  const { user, login, loading: authLoading, isAuthorized } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || !isAuthorized) return;

    setLoading(true);
    const collectionName = 'support_chats';
    
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
  }, [user, isAuthorized]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || (!message.trim() && !imageFile) || isSending || !isAuthorized) return;

    setIsSending(true);
    const collectionName = 'support_chats';

    try {
      let imageUrl = null;
      
      if (imageFile) {
        const fileRef = ref(storage, `chats/${collectionName}/${user.uid}_${Date.now()}`);
        const uploadTask = uploadBytesResumable(fileRef, imageFile);

        imageUrl = await new Promise<string>((resolve, reject) => {
          uploadTask.on('state_changed',
            null,
            (error) => reject(error),
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            }
          );
        });
      }

      await addDoc(collection(db, collectionName), {
        user_id: user.uid,
        message: message.trim(),
        timestamp: serverTimestamp(),
        sender_role: 'user',
        image_url: imageUrl
      });
      
      setMessage('');
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#FFB800]" size={48} />
      </div>
    );
  }

  if (!user || !isAuthorized) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
            <Lock className="text-red-500" size={40} />
          </div>
          <h1 className="text-2xl font-black mb-4 uppercase tracking-tighter">{t('common.unauthorized')}</h1>
          <p className="text-gray-400 mb-8 font-medium leading-relaxed">
            {t('common.unauthorizedDesc')}
          </p>
          <div className="flex flex-col gap-3">
            {!user && (
              <button 
                onClick={login}
                className="w-full bg-[#FFB800] text-black font-bold py-4 rounded-xl border border-[#FFB800] transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                <LogIn size={16} />
                <span>{t('navbar.login')}</span>
              </button>
            )}
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl border border-white/10 transition-all uppercase tracking-widest text-xs hidden lg:block"
            >
              {t('common.backToHome')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:pt-24 pt-8 pb-8 bg-[#0a0a0a]">
      <SEO 
        title={`${t('chat.support')} | Real Builder Academy`}
        description="Canal de suporte direto e seguro para membros do Real Builder."
      />
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-[calc(100vh-140px)]">
        <div className="bg-[#111315] border border-white/10 rounded-3xl h-full flex overflow-hidden shadow-2xl">
          
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col bg-[#0a0a0a]/50">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/')}
                  className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white hidden lg:block"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="w-10 h-10 rounded-xl bg-[#FFB800] flex items-center justify-center text-black">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-tight">
                    {t('chat.support')}
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Active Support</span>
                  </div>
                </div>
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
                    Start the conversation by sending a message to our support team.
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
                        {msg.image_url && (
                          <img 
                            src={msg.image_url} 
                            alt="Chat attachment" 
                            className="rounded-xl mb-3 max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity border border-black/10"
                            onClick={() => window.open(msg.image_url, '_blank')}
                          />
                        )}
                        {msg.message && <p>{msg.message}</p>}
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
              <AnimatePresence>
                {imagePreview && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mb-4 relative inline-block group"
                  >
                    <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-2xl border-2 border-[#FFB800] shadow-xl" />
                    <button 
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-end gap-3 max-w-4xl mx-auto">
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-14 h-14 bg-white/5 border border-white/10 text-gray-400 rounded-2xl flex items-center justify-center hover:bg-white/10 hover:text-white transition-all shrink-0"
                >
                  <Camera size={24} />
                </button>

                <div className="flex-1 bg-[#1a1c1e] border border-white/10 rounded-2xl focus-within:border-[#FFB800] transition-all overflow-hidden shadow-inner">
                  <textarea 
                    rows={1}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('chat.placeholder')}
                    className="w-full bg-transparent md:p-4 p-3 text-xs md:text-sm text-white focus:outline-none resize-none max-h-40"
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

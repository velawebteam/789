import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, getDocs, doc, getDoc, deleteDoc, updateDoc, setDoc, where } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, Send, User, Search, ChevronRight, Loader2, ArrowLeft,
  Plus, Camera, X, ShieldCheck, Mail, UserPlus, Trash2, Edit2
} from 'lucide-react';

import { ADMIN_EMAILS } from '../constants/auth';
import SEO from '../components/SEO';

interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  timestamp: any;
  sender_role: 'user' | 'admin';
}

interface ChatSession {
  user_id: string;
  last_message: string;
  last_timestamp: any;
  user_name?: string;
  user_email?: string;
}

interface AccessRule {
  email: string;
  role: 'admin' | 'worker' | 'user';
}

export default function Admin() {
  const { user, loading: authLoading, isAdmin: isAuthAdmin } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'support' | 'access'>('support');
  
  // Support State
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [reply, setReply] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [replyImageFile, setReplyImageFile] = useState<File | null>(null);
  const [replyImagePreview, setReplyImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Access Management State
  const [accessRules, setAccessRules] = useState<AccessRule[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'worker' | 'user'>('worker');
  const [isSavingAccess, setIsSavingAccess] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user || !isAuthAdmin) {
        navigate('/');
      }
    }
  }, [user, authLoading, navigate, isAuthAdmin]);

  useEffect(() => {
    if (!user || !isAuthAdmin || activeTab !== 'support') return;

    setLoading(true);
    setChats([]);
    setSelectedUserId(null);

    const collectionName = 'support_chats';
    const q = query(collection(db, collectionName));
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatMessage[];

      // Sort by timestamp desc to get latest for grouping
      const sortedMessages = [...messagesData].sort((a, b) => {
        const timeA = a.timestamp?.seconds || 0;
        const timeB = b.timestamp?.seconds || 0;
        return timeB - timeA;
      });

      // Group by user_id
      const sessionsMap = new Map<string, ChatSession>();
      
      for (const msg of sortedMessages) {
        if (!sessionsMap.has(msg.user_id)) {
          sessionsMap.set(msg.user_id, {
            user_id: msg.user_id,
            last_message: msg.message,
            last_timestamp: msg.timestamp,
          });
        }
      }

      const sessions = Array.from(sessionsMap.values());
      
      // Fetch user details for each session
      const sessionsWithDetails = await Promise.all(sessions.map(async (session) => {
        try {
          const userDoc = await getDoc(doc(db, 'users', session.user_id));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            return {
              ...session,
              user_name: userData.displayName || 'Anonymous',
              user_email: userData.email || 'No Email'
            };
          }
        } catch (err) {
          console.error("Error fetching user detail:", err);
        }
        return session;
      }));

      setChats(sessionsWithDetails);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, isAuthAdmin, activeTab]);

  useEffect(() => {
    if (!user || !isAuthAdmin || activeTab !== 'access') return;

    const q = query(collection(db, 'access_rules'), orderBy('email', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const rules = snapshot.docs.map(doc => doc.data() as AccessRule);
      setAccessRules(rules);
    });

    return () => unsubscribe();
  }, [user, isAuthAdmin, activeTab]);

  const handleAddAccessRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || isSavingAccess) return;

    setIsSavingAccess(true);
    try {
      const email = newEmail.trim().toLowerCase();
      const ruleRef = doc(db, 'access_rules', email);
      await setDoc(ruleRef, {
        email,
        role: newRole,
        updatedAt: serverTimestamp()
      });
      setNewEmail('');
    } catch (error) {
      console.error("Error saving access rule:", error);
      alert("Error saving access rule");
    } finally {
      setIsSavingAccess(false);
    }
  };

  const handleDeleteAccessRule = async (email: string) => {
    if (!window.confirm(t('admin.deleteConfirm', { type: t('admin.user') }))) return;
    try {
      await deleteDoc(doc(db, 'access_rules', email));
    } catch (error) {
      console.error("Error deleting access rule:", error);
    }
  };

  const handleUpdateRole = async (email: string, role: 'admin' | 'worker' | 'user') => {
    try {
      await updateDoc(doc(db, 'access_rules', email), {
        role,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  useEffect(() => {
    if (!selectedUserId) {
      setMessages([]);
      return;
    }

    const collectionName = 'support_chats';
    const q = query(
      collection(db, collectionName),
      where('user_id', '==', selectedUserId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allMsgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatMessage[];
      
      // Sort by timestamp in frontend to avoid index requirement
      const sorted = [...allMsgs].sort((a, b) => {
        const timeA = a.timestamp?.seconds || 0;
        const timeB = b.timestamp?.seconds || 0;
        return timeA - timeB;
      });
      
      setMessages(sorted);
    });

    return () => unsubscribe();
  }, [selectedUserId]);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
    }
  }, [messages]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || (!reply.trim() && !replyImageFile) || isSending) return;

    setIsSending(true);
    const collectionName = 'support_chats';

    try {
      let imageUrl = null;
      if (replyImageFile) {
        const fileRef = ref(storage, `chats/${collectionName}/admin_${selectedUserId}_${Date.now()}`);
        
        console.log(`Starting Admin reply upload for session: ${selectedUserId}...`);
        const uploadTask = uploadBytesResumable(fileRef, replyImageFile);

        imageUrl = await new Promise<string>((resolve, reject) => {
          uploadTask.on('state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Admin reply upload: ${progress.toFixed(2)}% done`);
            },
            (error) => {
              console.error("Admin reply upload failed:", error);
              reject(error);
            },
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              console.log("Admin reply upload complete.");
              resolve(url);
            }
          );
        });
      }

      await addDoc(collection(db, collectionName), {
        user_id: selectedUserId,
        message: reply.trim(),
        timestamp: serverTimestamp(),
        sender_role: 'admin',
        image_url: imageUrl
      });
      setReply('');
      setReplyImageFile(null);
      setReplyImagePreview(null);
    } catch (error) {
      console.error("Error sending reply:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleReplyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setReplyImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReplyImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredChats = chats.filter(chat => 
    chat.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.user_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading || (!user || !isAuthAdmin)) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#FFB800]" size={48} />
      </div>
    );
  }

  const selectedChat = chats.find(c => c.user_id === selectedUserId);

  return (
    <div className="min-h-screen pt-32 md:pt-24 pb-4 md:pb-8 bg-[#0a0a0a]">
      <SEO 
        title={`${t('admin.title')} | Real Builder Academy`}
        description="Portal de administração para gestão de suporte e acessos."
      />
      <div className="max-w-[1400px] mx-auto px-0 md:px-6 h-[calc(100svh-100px)] md:h-[calc(100vh-140px)] flex flex-col gap-4">
        
        {/* Tab Switcher */}
        <div className="flex bg-[#111315] p-1 rounded-2xl border border-white/10 w-fit self-center">
          <button
            onClick={() => setActiveTab('support')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'support' ? 'bg-[#FFB800] text-black' : 'text-gray-400 hover:text-white'}`}
          >
            <MessageSquare size={16} />
            <span>{t('admin.support')}</span>
          </button>
          <button
            onClick={() => setActiveTab('access')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'access' ? 'bg-[#FFB800] text-black' : 'text-gray-400 hover:text-white'}`}
          >
            <ShieldCheck size={16} />
            <span>{t('admin.manageUsers')}</span>
          </button>
        </div>

        <div className="bg-[#111315] border-y md:border border-white/10 md:rounded-3xl flex-1 flex overflow-hidden shadow-2xl relative">
          
          {activeTab === 'support' ? (
            <>
              {/* Sidebar: Chat List */}
          <div className={`w-full md:w-80 lg:w-96 border-r border-white/10 flex flex-col ${selectedUserId ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-6 border-b border-white/10 bg-white/[0.02]">
              <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4">{t('admin.title')}</h2>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input 
                  type="text"
                  placeholder={t('admin.searchChats')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#FFB800] transition-colors"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-20">
                  <Loader2 className="animate-spin text-[#FFB800]/50" size={24} />
                </div>
              ) : filteredChats.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm italic">
                  {t('admin.noChats')}
                </div>
              ) : (
                filteredChats.map((chat) => (
                  <button
                    key={chat.user_id}
                    onClick={() => setSelectedUserId(chat.user_id)}
                    className={`w-full p-4 flex items-center gap-4 transition-all hover:bg-white/[0.03] text-left border-b border-white/[0.03] ${selectedUserId === chat.user_id ? 'bg-white/[0.05] border-r-2 border-r-[#FFB800]' : ''}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center relative shrink-0">
                      <User size={20} className="text-gray-400" />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#111315] rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-sm font-bold text-white truncate">{chat.user_name}</p>
                        <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">
                          {chat.last_timestamp?.toDate && new Intl.DateTimeFormat('pt-PT', { hour: '2-digit', minute: '2-digit' }).format(chat.last_timestamp.toDate())}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 truncate leading-snug">{chat.last_message}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-600" />
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className={`flex-1 flex flex-col bg-[#0a0a0a]/50 ${selectedUserId ? 'flex' : 'hidden md:flex md:items-center md:justify-center md:text-center p-12'}`}>
            {!selectedUserId ? (
              <div className="max-w-md">
                <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10">
                  <MessageSquare size={40} className="text-[#FFB800] opacity-50" />
                </div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">{t('admin.supportPortal')}</h3>
                <p className="text-gray-500 text-sm">{t('admin.portalDesc')}</p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setSelectedUserId(null)}
                      className="md:hidden p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-[#FFB800] flex items-center justify-center text-black font-bold">
                      {selectedChat?.user_name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{selectedChat?.user_name}</h4>
                      <p className="text-[10px] text-gray-500 font-bold tracking-wider uppercase">{selectedChat?.user_email}</p>
                    </div>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender_role === 'admin' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] space-y-2`}>
                        <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                          msg.sender_role === 'admin' 
                            ? 'bg-[#FFB800] text-black rounded-tr-none' 
                            : 'bg-[#1a1c1e] text-white border border-white/10 rounded-tl-none shadow-lg'
                        }`}>
                          {msg.image_url && (
                            <img 
                              src={msg.image_url} 
                              alt="Attachment" 
                              className="rounded-xl mb-3 max-w-full h-auto cursor-pointer border border-black/10 hover:opacity-90 transition-opacity"
                              onClick={() => window.open(msg.image_url, '_blank')}
                            />
                          )}
                          {msg.message && <p>{msg.message}</p>}
                        </div>
                        <p className={`text-[10px] font-bold tracking-widest uppercase ${msg.sender_role === 'admin' ? 'text-right text-[#FFB800]' : 'text-left text-gray-600'}`}>
                          {msg.sender_role === 'admin' ? t('admin.admin') : t('admin.user')} • {msg.timestamp?.toDate ? new Intl.DateTimeFormat('pt-PT', { hour: '2-digit', minute: '2-digit' }).format(msg.timestamp.toDate()) : '...'}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Reply Input */}
                <form onSubmit={handleSendReply} className="p-6 border-t border-white/10 bg-white/[0.02]">
                  <AnimatePresence>
                    {replyImagePreview && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="mb-4 relative inline-block group"
                      >
                        <img src={replyImagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-2xl border-2 border-[#FFB800]" />
                        <button 
                          type="button"
                          onClick={() => { setReplyImageFile(null); setReplyImagePreview(null); }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-end gap-3">
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleReplyFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-14 h-14 bg-white/5 border border-white/10 text-gray-400 rounded-2xl flex items-center justify-center hover:bg-white/10 hover:text-white transition-all shadow-lg shrink-0"
                    >
                      <Camera size={24} />
                    </button>

                    <div className="flex-1 bg-[#1a1c1e] border border-white/10 rounded-2xl focus-within:border-[#FFB800] transition-all overflow-hidden p-1 shadow-inner">
                      <textarea 
                        rows={2}
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder={t('chat.placeholder')}
                        className="w-full bg-transparent md:p-4 p-3 text-xs md:text-sm text-white focus:outline-none resize-none max-h-40"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendReply(e);
                          }
                        }}
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={!reply.trim() || isSending}
                      className="w-14 h-14 bg-[#FFB800] text-black rounded-2xl flex items-center justify-center hover:bg-white transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {isSending ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto w-full space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">{t('admin.userPermissions')}</h3>
                  <p className="text-gray-500 text-sm mt-1">Manage who can access the workers and admin panels.</p>
                </div>
                
                <form onSubmit={handleAddAccessRule} className="flex gap-2">
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FFB800] transition-colors" size={16} />
                    <input 
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder={t('admin.permissionEmailPlaceholder')}
                      required
                      className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#FFB800] transition-colors min-w-[240px]"
                    />
                  </div>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-[#FFB800] transition-colors text-white"
                  >
                    <option value="worker" className="bg-[#111315]">{t('admin.worker')}</option>
                    <option value="admin" className="bg-[#111315]">{t('admin.admin')}</option>
                  </select>
                  <button
                    type="submit"
                    disabled={isSavingAccess}
                    className="bg-[#FFB800] text-black p-2 rounded-xl hover:bg-white transition-colors disabled:opacity-50"
                  >
                    {isSavingAccess ? <Loader2 size={20} className="animate-spin" /> : <UserPlus size={20} />}
                  </button>
                </form>
              </div>

              <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.03]">
                      <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('admin.email')}</th>
                      <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('admin.role')}</th>
                      <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">{t('admin.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accessRules.map((rule) => (
                      <tr key={rule.email} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-gray-400">
                              {rule.email.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm text-white font-medium">{rule.email}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <select
                            value={rule.role}
                            onChange={(e) => handleUpdateRole(rule.email, e.target.value as any)}
                            className={`text-xs font-bold px-3 py-1 rounded-full border transition-colors bg-transparent ${
                              rule.role === 'admin' 
                                ? 'border-[#FFB800]/50 text-[#FFB800] bg-[#FFB800]/5' 
                                : 'border-blue-500/50 text-blue-400 bg-blue-400/5'
                            }`}
                          >
                            <option value="worker" className="bg-[#111315]">{t('admin.worker')}</option>
                            <option value="admin" className="bg-[#111315]">{t('admin.admin')}</option>
                          </select>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteAccessRule(rule.email)}
                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {accessRules.length === 0 && (
                      <tr>
                        <td colSpan={3} className="p-8 text-center text-gray-500 italic text-sm">
                          No access rules defined yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

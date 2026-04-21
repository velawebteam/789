import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, getDocs, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, Send, User, Search, ChevronRight, Loader2, ArrowLeft,
  Building2, HardHat, Plus, Trash2, Power, PowerOff, Camera, X, CheckCircle2
} from 'lucide-react';

import { ALLOWED_EMAILS, ADMIN_EMAILS } from '../constants/auth';

interface Client {
  id: string;
  name: string;
  active?: boolean;
}

interface Project {
  id: string;
  clientId: string;
  name: string;
  location?: string;
  workers?: string[];
  active?: boolean;
  startedAt?: any;
  finishedAt?: any;
}

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

interface ProjectItemProps {
  key?: React.Key;
  project: Project;
  client: Client | undefined;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
  onAddWorker: (id: string, email: string) => void;
  onRemoveWorker: (id: string, email: string) => void;
}

function ProjectItem({ project, client, onToggleStatus, onDelete, onAddWorker, onRemoveWorker }: ProjectItemProps) {
  const { t } = useLanguage();
  const isProjectActive = project.active !== false;
  const [emailInput, setEmailInput] = useState('');

  return (
    <div className={`p-4 md:p-6 rounded-2xl md:rounded-3xl border transition-all ${isProjectActive ? 'bg-black/20 border-white/5' : 'bg-red-500/5 border-red-500/10 opacity-60'}`}>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="min-w-0">
          <h4 className={`text-sm font-black uppercase tracking-tight truncate ${isProjectActive ? 'text-white' : 'text-gray-500 line-through'}`}>{project.name}</h4>
          <p className="text-[10px] text-[#FFB800] font-bold uppercase tracking-widest truncate">{client?.name || 'Unknown Client'}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => onToggleStatus(project.id, isProjectActive)}
            title={isProjectActive ? t('admin.finishProject') : t('admin.activateProject')}
            className={`p-2 rounded-xl transition-all ${isProjectActive ? 'bg-[#FFB800]/10 text-[#FFB800] hover:bg-[#FFB800]/20' : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'}`}
          >
            {isProjectActive ? <CheckCircle2 size={14} /> : <Power size={14} />}
          </button>
          <button 
            onClick={() => onDelete(project.id)}
            title={t('admin.delete')}
            className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          {project.startedAt && (
            <div className="flex-1 bg-black/40 rounded-xl p-3 border border-white/5">
              <p className="text-[7px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">{t('admin.start')}</p>
              <p className="text-[10px] text-gray-300 font-bold">
                {project.startedAt.toDate ? new Intl.DateTimeFormat('pt-PT').format(project.startedAt.toDate()) : '...'}
              </p>
            </div>
          )}
          {project.finishedAt && !isProjectActive && (
            <div className="flex-1 bg-green-500/5 rounded-xl p-3 border border-green-500/10">
              <p className="text-[7px] font-black text-green-500/50 uppercase tracking-[0.2em] mb-1">{t('admin.end')}</p>
              <p className="text-[10px] text-green-500 font-bold">
                {project.finishedAt.toDate ? new Intl.DateTimeFormat('pt-PT').format(project.finishedAt.toDate()) : '...'}
              </p>
            </div>
          )}
        </div>

        {project.location && (
          <div className="bg-black/40 rounded-xl p-3 border border-white/5">
            <p className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">{t('admin.location')}</p>
            <p className="text-xs text-gray-300 font-medium">{project.location}</p>
          </div>
        )}

        <div className="bg-black/40 rounded-xl p-3 md:p-4 border border-white/5">
          <p className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">{t('admin.assignedWorkers', { count: project.workers?.length || 0 })}</p>
          
          <div className="space-y-2 mb-3">
            {project.workers?.map(email => (
              <div key={email} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2 border border-white/5 group/email">
                <span className="text-[10px] font-bold text-gray-400 truncate mr-2">{email}</span>
                <button 
                  onClick={() => onRemoveWorker(project.id, email)}
                  className="text-red-500 opacity-0 group-hover/email:opacity-100 md:opacity-0 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input 
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder={t('admin.workerEmail')}
              className="flex-1 min-w-0 bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#FFB800]"
            />
            <button 
              onClick={() => {
                onAddWorker(project.id, emailInput);
                setEmailInput('');
              }}
              disabled={!emailInput.trim()}
              className="px-3 shrink-0 bg-[#FFB800] text-black rounded-lg text-[10px] font-black uppercase hover:bg-white transition-all disabled:opacity-50"
            >
              {t('admin.add')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'support' | 'clients'>('support');
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [newClientName, setNewClientName] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectLocation, setNewProjectLocation] = useState('');
  const [projectClientId, setProjectClientId] = useState('');
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [clientMobileTab, setClientMobileTab] = useState<'quick' | 'clients' | 'projects'>('quick');
  
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

  useEffect(() => {
    if (!authLoading) {
      if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
        navigate('/');
      }
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user || !ADMIN_EMAILS.includes(user.email || '')) return;

    if (selectedTab !== 'support') {
      setLoading(false);
      return;
    }

    setLoading(true);
    setChats([]);
    setSelectedUserId(null);

    const collectionName = 'support_chats';
    const q = query(collection(db, collectionName), orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatMessage[];

      // Group by user_id
      const sessionsMap = new Map<string, ChatSession>();
      
      for (const msg of messagesData) {
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
  }, [user, selectedTab]);

  // Real-time clients and projects listener
  useEffect(() => {
    if (!user || !ADMIN_EMAILS.includes(user.email || '')) return;

    const unsubscribeClients = onSnapshot(collection(db, 'clients'), (snapshot) => {
      setClients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client)));
    });

    const unsubscribeProjects = onSnapshot(collection(db, 'projects'), (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
    });

    return () => {
      unsubscribeClients();
      unsubscribeProjects();
    };
  }, [user]);

  useEffect(() => {
    if (!selectedUserId) {
      setMessages([]);
      return;
    }

    const collectionName = selectedTab === 'support' ? 'support_chats' : 'maintenance_chats';
    const q = query(
      collection(db, collectionName),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allMsgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatMessage[];
      
      // Filter for the selected user
      const filtered = allMsgs.filter(m => m.user_id === selectedUserId);
      setMessages(filtered);
    });

    return () => unsubscribe();
  }, [selectedUserId, selectedTab]);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
    }
  }, [messages]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || (!reply.trim() && !replyImageFile) || isSending) return;

    setIsSending(true);
    const collectionName = selectedTab === 'support' ? 'support_chats' : 'maintenance_chats';

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

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || isAddingClient) return;
    setIsAddingClient(true);
    try {
      await addDoc(collection(db, 'clients'), {
        name: newClientName.trim(),
        active: true,
        createdAt: serverTimestamp()
      });
      setNewClientName('');
    } catch (err) {
      console.error("Error creating client:", err);
    } finally {
      setIsAddingClient(false);
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (!window.confirm(t('admin.deleteConfirm', { type: t('admin.clients').toLowerCase() }))) return;
    try {
      await deleteDoc(doc(db, 'clients', id));
    } catch (err) {
      console.error("Error deleting client:", err);
    }
  };

  const handleToggleClientStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'clients', id), {
        active: !currentStatus
      });
    } catch (err) {
      console.error("Error toggling client status:", err);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim() || !projectClientId || isAddingProject) return;
    setIsAddingProject(true);
    try {
      await addDoc(collection(db, 'projects'), {
        name: newProjectName.trim(),
        location: newProjectLocation.trim(),
        clientId: projectClientId,
        workers: [],
        active: true,
        startedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      });
      setNewProjectName('');
      setNewProjectLocation('');
      setProjectClientId('');
    } catch (err) {
      console.error("Error creating project:", err);
    } finally {
      setIsAddingProject(false);
    }
  };

  const handleAddWorker = async (projectId: string, email: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) return;
    
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    const workers = project.workers || [];
    if (workers.includes(trimmedEmail)) return;

    try {
      await updateDoc(doc(db, 'projects', projectId), {
        workers: [...workers, trimmedEmail]
      });
    } catch (err) {
      console.error("Error adding worker:", err);
    }
  };

  const handleRemoveWorker = async (projectId: string, email: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    const workers = (project.workers || []).filter(w => w !== email);

    try {
      await updateDoc(doc(db, 'projects', projectId), {
        workers: workers
      });
    } catch (err) {
      console.error("Error removing worker:", err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm(t('admin.deleteConfirm', { type: t('admin.manageProjects').toLowerCase() }))) return;
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  const handleToggleProjectStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'projects', id), {
        active: !currentStatus,
        finishedAt: !currentStatus ? null : serverTimestamp()
      });
    } catch (err) {
      console.error("Error toggling project status:", err);
    }
  };

  const filteredChats = chats.filter(chat => 
    chat.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.user_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading || (!user || !ADMIN_EMAILS.includes(user.email || ''))) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#FFB800]" size={48} />
      </div>
    );
  }

  const selectedChat = chats.find(c => c.user_id === selectedUserId);

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-4 md:pb-8 bg-[#0a0a0a]">
      <div className="max-w-[1400px] mx-auto px-0 md:px-6 h-[calc(100svh-100px)] md:h-[calc(100vh-140px)]">
        <div className="bg-[#111315] border-y md:border border-white/10 md:rounded-3xl h-full flex overflow-hidden shadow-2xl relative">
          
          {/* Sidebar: Chat List */}
          <div className={`w-full md:w-80 lg:w-96 border-r border-white/10 flex flex-col ${(selectedUserId || (selectedTab === 'clients' && clientMobileTab !== 'quick')) ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-6 border-b border-white/10 bg-white/[0.02]">
              <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4">{t('admin.title')}</h2>
              
              {/* Tab Selector */}
              <div className="flex bg-black/40 p-1 rounded-xl mb-4 border border-white/5 space-x-1">
                <button
                  onClick={() => setSelectedTab('support')}
                  className={`flex-1 py-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${selectedTab === 'support' ? 'bg-[#FFB800] text-black' : 'text-gray-500 hover:text-white'}`}
                >
                  {t('admin.support')}
                </button>
                <button
                  onClick={() => setSelectedTab('clients')}
                  className={`flex-1 py-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${selectedTab === 'clients' ? 'bg-[#FFB800] text-black' : 'text-gray-500 hover:text-white'}`}
                >
                  {t('admin.clients')}
                </button>
              </div>

              {selectedTab !== 'clients' && (
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
              )}
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              {selectedTab === 'clients' ? (
                <div className="p-4 space-y-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FFB800] mb-3">{t('admin.quickList')}</h4>
                    <div className="space-y-2">
                       {clients.map(c => (
                         <div key={c.id} className="flex items-center gap-2 p-2 bg-black/20 rounded-lg border border-white/5">
                           <Building2 size={12} className="text-gray-500" />
                           <span className="text-xs font-bold text-gray-300 truncate">{c.name}</span>
                         </div>
                       ))}
                    </div>
                  </div>

                  {/* Mobile Navigation for Clients/Projects */}
                  <div className="grid grid-cols-2 gap-2 md:hidden">
                    <button
                      onClick={() => setClientMobileTab('clients')}
                      className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-[#FFB800] transition-all group"
                    >
                      <Building2 size={24} className="text-gray-500 group-hover:text-[#FFB800]" />
                      <span className="text-[9px] font-black uppercase text-gray-400 group-hover:text-white">{t('admin.manageClients')}</span>
                    </button>
                    <button
                      onClick={() => setClientMobileTab('projects')}
                      className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-[#FFB800] transition-all group"
                    >
                      <HardHat size={24} className="text-gray-500 group-hover:text-[#FFB800]" />
                      <span className="text-[9px] font-black uppercase text-gray-400 group-hover:text-white">{t('admin.manageProjects')}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setClientMobileTab('clients')}
                    className="hidden md:flex w-full items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-[#FFB800]/50 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-black/40 flex items-center justify-center border border-white/5">
                      <Building2 size={16} className="text-[#FFB800]" />
                    </div>
                    <span className="text-xs font-bold text-gray-300 group-hover:text-white">{t('admin.manageClients')}</span>
                    <ChevronRight size={14} className="ml-auto text-gray-600 group-hover:text-[#FFB800]" />
                  </button>

                  <button
                    onClick={() => setClientMobileTab('projects')}
                    className="hidden md:flex w-full items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-[#FFB800]/50 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-black/40 flex items-center justify-center border border-white/5">
                      <HardHat size={16} className="text-[#FFB800]" />
                    </div>
                    <span className="text-xs font-bold text-gray-300 group-hover:text-white">{t('admin.manageProjects')}</span>
                    <ChevronRight size={14} className="ml-auto text-gray-600 group-hover:text-[#FFB800]" />
                  </button>
                </div>
              ) : loading ? (
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
          <div className={`flex-1 flex flex-col bg-[#0a0a0a]/50 ${(selectedUserId || (selectedTab === 'clients' && clientMobileTab !== 'quick')) ? 'flex' : 'hidden md:flex md:items-center md:justify-center md:text-center p-12'}`}>
            {selectedTab === 'clients' ? (
              <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                {/* Back button for mobile */}
                {clientMobileTab !== 'quick' && (
                  <button
                    onClick={() => setClientMobileTab('quick')}
                    className="md:hidden flex items-center gap-2 text-[#FFB800] font-black uppercase text-[10px] tracking-widest mb-6 bg-white/5 p-3 rounded-xl border border-white/10"
                  >
                    <ArrowLeft size={14} />
                    {t('admin.back')}
                  </button>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                  {/* Create Client */}
                  <div className={`${clientMobileTab === 'projects' ? 'hidden lg:block' : 'block'} bg-[#1a1c1e] border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 shadow-xl h-fit`}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-[#FFB800]/10 rounded-2xl flex items-center justify-center border border-[#FFB800]/20">
                        <Building2 size={24} className="text-[#FFB800]" />
                      </div>
                      <h3 className="text-xl font-black uppercase italic tracking-tighter">{t('admin.manageClients')}</h3>
                    </div>

                    <form onSubmit={handleCreateClient} className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">{t('admin.clientName')}</label>
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            value={newClientName}
                            onChange={(e) => setNewClientName(e.target.value)}
                            placeholder="Ex: Real Builder Portugal"
                            className="flex-1 min-w-0 bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#FFB800]"
                          />
                          <button 
                            type="submit"
                            disabled={!newClientName.trim() || isAddingClient}
                            className="px-4 shrink-0 bg-[#FFB800] text-black rounded-xl font-black uppercase tracking-tighter hover:bg-white transition-all disabled:opacity-50"
                          >
                            {isAddingClient ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                          </button>
                        </div>
                      </div>
                    </form>

                    <div className="mt-8 space-y-3">
                      {clients.map(client => (
                        <div key={client.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${client.active !== false ? 'bg-black/20 border-white/5 hover:border-[#FFB800]/30' : 'bg-red-500/5 border-red-500/10 opacity-60'}`}>
                          <div className="flex items-center gap-3 min-w-0">
                            <span className={`text-sm font-bold truncate ${client.active !== false ? 'text-white' : 'text-gray-500 line-through'}`}>{client.name}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 ml-4">
                            <button 
                              onClick={() => handleToggleClientStatus(client.id, client.active !== false)}
                              title={client.active !== false ? t('admin.deactivate') : t('admin.activate')}
                              className={`p-2 rounded-xl transition-all ${client.active !== false ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}
                            >
                              {client.active !== false ? <Power size={14} /> : <PowerOff size={14} />}
                            </button>
                            <button 
                              onClick={() => handleDeleteClient(client.id)}
                              title={t('admin.delete')}
                              className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Create Project */}
                  <div className={`${clientMobileTab === 'clients' ? 'hidden lg:block' : 'block'} bg-[#1a1c1e] border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 shadow-xl h-fit`}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-[#FFB800]/10 rounded-2xl flex items-center justify-center border border-[#FFB800]/20">
                        <HardHat size={24} className="text-[#FFB800]" />
                      </div>
                      <h3 className="text-xl font-black uppercase italic tracking-tighter">{t('admin.manageProjects')}</h3>
                    </div>

                    <form onSubmit={handleCreateProject} className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">{t('admin.targetClient')}</label>
                        <select 
                          value={projectClientId}
                          onChange={(e) => setProjectClientId(e.target.value)}
                          className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#FFB800] appearance-none"
                        >
                          <option value="">{t('admin.selectClient')}</option>
                          {clients.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">{t('admin.projectName')}</label>
                        <div className="space-y-2">
                          <input 
                            type="text"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            placeholder="Ex: Construction Site A"
                            className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#FFB800]"
                          />
                          <input 
                            type="text"
                            value={newProjectLocation}
                            onChange={(e) => setNewProjectLocation(e.target.value)}
                            placeholder="Ex: Rua Direita, 123, Lisboa"
                            className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#FFB800]"
                          />
                          <button 
                            type="submit"
                            disabled={!newProjectName.trim() || !projectClientId || isAddingProject}
                            className="w-full bg-[#FFB800] text-black py-3 rounded-xl font-black uppercase tracking-tighter hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center"
                          >
                            {isAddingProject ? <Loader2 size={18} className="animate-spin" /> : <><Plus size={18} className="mr-2" /> {t('admin.createProject')}</>}
                          </button>
                        </div>
                      </div>
                    </form>

                    <div className="mt-8 space-y-4">
                      {projects.map((project: Project) => (
                        <ProjectItem
                          key={project.id}
                          project={project}
                          client={clients.find((c: Client) => c.id === project.clientId)}
                          onToggleStatus={handleToggleProjectStatus}
                          onDelete={handleDeleteProject}
                          onAddWorker={handleAddWorker}
                          onRemoveWorker={handleRemoveWorker}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : !selectedUserId ? (
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

        </div>
      </div>
    </div>
  );
}

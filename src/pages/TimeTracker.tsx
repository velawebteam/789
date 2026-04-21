import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp,
  getDoc,
  orderBy,
  limit
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../lib/firebase';
import { handleFirestoreError } from '../lib/firestore-errors';
import { getWeekNumber } from '../lib/date-utils';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle2, 
  Camera, 
  FileText, 
  ChevronRight, 
  Loader2, 
  AlertCircle,
  Building2,
  HardHat,
  Wrench,
  CalendarDays,
  Lock
} from 'lucide-react';

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
}

interface TimeLog {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  clientId: string;
  clientName: string;
  projectId: string;
  projectName: string;
  date: string;
  startTime: any;
  endTime?: any;
  durationMinutes?: number;
  reportText?: string;
  reportImages?: string[];
}

interface WeeklyStatus {
  id: string;
  userId: string;
  weekNumber: number;
  year: number;
  status: 'open' | 'closed';
  startedAt: any;
  closedAt?: any;
}

export default function TimeTracker() {
  const { user, loading: authLoading } = useAuth();
  const { language, t } = useLanguage();
  const allowedEmails = ['vela.web.team@gmail.com', 'realbuilder.backend@gmail.com'];
  const isAuthorized = user && allowedEmails.includes(user.email || '');

  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [checkoutMessage, setCheckoutMessage] = useState<string>('');
  const [activeLog, setActiveLog] = useState<TimeLog | null>(null);
  const [weeklyStatus, setWeeklyStatus] = useState<WeeklyStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMaintenanceComplete, setIsMaintenanceComplete] = useState({ daily: false, weekly: false });

  const isFriday = new Date().getDay() === 5;

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'clients'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const clientsData = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Client))
        .filter(c => c.active !== false);
      setClients(clientsData);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching clients:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, authLoading]);

  useEffect(() => {
    if (authLoading || !user || !selectedClient) {
      setProjects([]);
      if (!selectedClient) setSelectedProject('');
      return;
    }

    const q = query(collection(db, 'projects'), where('clientId', '==', selectedClient));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Project))
        .filter(p => {
          const isActive = p.active !== false;
          // Admins see everything, workers only see assigned projects
          const isAssigned = isAuthorized || (user.email && p.workers?.includes(user.email.toLowerCase()));
          return isActive && isAssigned;
        });
      setProjects(projectsData);
    }, (err) => {
      console.error("Error fetching projects:", err);
    });

    return () => unsubscribe();
  }, [selectedClient]);

  useEffect(() => {
    if (authLoading || !user) return;

    // Check for ANY active session for this user
    const q = query(
      collection(db, 'time_logs'),
      where('userId', '==', user.uid),
      orderBy('startTime', 'desc'),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const log = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as TimeLog;
        if (!log.endTime) {
          setActiveLog(log);
          // Auto-select if nothing selected
          if (!selectedProject) {
            setSelectedClient(log.clientId);
            setSelectedProject(log.projectId);
          }
        } else {
          setActiveLog(null);
        }
      } else {
        setActiveLog(null);
      }
      setLoading(false);
    }, (err) => {
      console.error("Error fetching active log:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, authLoading]);

  useEffect(() => {
    if (user && activeLog && !activeLog.endTime) {
      const logDate = activeLog.date;
      const mq = query(
        collection(db, 'maintenance_logs'),
        where('userId', '==', user.uid),
        where('date', '==', logDate)
      );

      const unsubscribe = onSnapshot(mq, (snapshot) => {
        const stats = { daily: false, weekly: false };
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          if (data.type === 'daily') stats.daily = true;
          if (data.type === 'weekly') stats.weekly = true;
        });
        setIsMaintenanceComplete(stats);
      }, (err) => {
        handleFirestoreError(err, 'list', 'maintenance_logs');
      });

      return () => unsubscribe();
    }
  }, [user, activeLog]);

  useEffect(() => {
    if (!user) return;

    const { week, year } = getWeekNumber(new Date());
    const wq = query(
      collection(db, 'weekly_status'),
      where('userId', '==', user.uid),
      where('weekNumber', '==', week),
      where('year', '==', year)
    );

    const unsubscribe = onSnapshot(wq, (snapshot) => {
      if (!snapshot.empty) {
        setWeeklyStatus({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as WeeklyStatus);
      } else {
        setWeeklyStatus(null);
      }
    }, (err) => {
      handleFirestoreError(err, 'list', 'weekly_status');
    });

    return () => unsubscribe();
  }, [user]);

  const handleStartWeek = async () => {
    if (!user || isProcessing) return;
    setIsProcessing(true);
    setError(null);
    const { week, year } = getWeekNumber(new Date());

    try {
      if (weeklyStatus) {
        const docRef = doc(db, 'weekly_status', weeklyStatus.id);
        await updateDoc(docRef, {
          status: 'open',
          startedAt: serverTimestamp(),
          // Remove closedAt when re-opening
        });
      } else {
        await addDoc(collection(db, 'weekly_status'), {
          userId: user.uid,
          weekNumber: week,
          year: year,
          status: 'open',
          startedAt: serverTimestamp()
        });
      }
    } catch (err) {
      handleFirestoreError(err, 'create', 'weekly_status');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseWeek = async () => {
    if (!user || !weeklyStatus || isProcessing) return;
    
    if (!isMaintenanceComplete.weekly) {
      setError(t('timeTracker.weeklyMaintenanceRequired'));
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const docRef = doc(db, 'weekly_status', weeklyStatus.id);
      await updateDoc(docRef, {
        status: 'closed',
        closedAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, 'update', `weekly_status/${weeklyStatus.id}`);
    } finally {
      setIsProcessing(false);
    }
  };

// Active log is managed by real-time listener above

  const handleCheckIn = async () => {
    if (!user || !selectedClient || !selectedProject || isProcessing) return;
    
    setIsProcessing(true);
    setError(null);
    const today = new Date().toISOString().split('T')[0];
    
    try {
      const client = clients.find(c => c.id === selectedClient);
      const project = projects.find(p => p.id === selectedProject);

      const newLog = {
        userId: user.uid,
        userEmail: user.email || '',
        userName: user.displayName || t('timeTracker.worker'),
        clientId: selectedClient,
        clientName: client?.name || '',
        projectId: selectedProject,
        projectName: project?.name || '',
        date: today,
        startTime: serverTimestamp(),
      };
      
      let docRef;
      try {
        docRef = await addDoc(collection(db, 'time_logs'), newLog);
      } catch (err) {
        handleFirestoreError(err, 'create', 'time_logs');
        return; // handleFirestoreError throws anyway, but for TS
      }
      
      setActiveLog({ id: docRef.id, ...newLog, startTime: new Date() } as TimeLog);
    } catch (err) {
      console.error("Check-in error:", err);
      setError(t('timeTracker.checkInError'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckOut = async () => {
    if (!activeLog || !user || isProcessing) return;
    
    // Safety check for maintenance
    const needsWeekly = isFriday;
    if (!isMaintenanceComplete.daily || (needsWeekly && !isMaintenanceComplete.weekly)) {
      setError(t('timeTracker.dailyMaintenanceRequired'));
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      // 1. Update doc
      const logRef = doc(db, 'time_logs', activeLog.id);
      const now = new Date();
      
      // Calculate duration in minutes
      let durationMinutes = 0;
      const start = activeLog.startTime?.toDate ? activeLog.startTime.toDate() : (activeLog.startTime instanceof Date ? activeLog.startTime : null);
      if (start) {
        durationMinutes = Math.round((now.getTime() - start.getTime()) / (1000 * 60));
      }

      try {
        await updateDoc(logRef, {
          endTime: serverTimestamp(),
          durationMinutes: durationMinutes,
          message: checkoutMessage.trim()
        });
      } catch (err) {
        handleFirestoreError(err, 'update', `time_logs/${activeLog.id}`);
      }
      
      // Update local state
      setActiveLog({
        ...activeLog,
        endTime: now,
        durationMinutes: durationMinutes
      });
      
    } catch (err) {
      console.error("Check-out error:", err);
      setError(t('timeTracker.checkOutError'));
    } finally {
      setIsProcessing(false);
    }
  };

  const canCheckOut = isMaintenanceComplete.daily && (!isFriday || isMaintenanceComplete.weekly);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#FFB800]" size={40} />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen md:pt-40 pt-10 pb-12 bg-[#0a0a0a] text-white flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-[#111315] border border-white/10 rounded-[2.5rem] p-10 text-center shadow-2xl"
        >
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <AlertCircle className="text-red-500" size={40} />
          </div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-4">
            {t('timeTracker.restrictedTitle')}
          </h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            {t('timeTracker.restrictedDesc')}
          </p>
          <button 
            onClick={() => {
              window.dispatchEvent(new CustomEvent('openNotifyMe'));
            }}
            className="w-full bg-[#FFB800] text-black py-4 rounded-2xl font-black uppercase tracking-tighter hover:bg-white transition-all transform active:scale-95 shadow-[0_0_20px_rgba(255,184,0,0.2)]"
          >
            {t('timeTracker.restrictedButton')}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:pt-40 pt-10 pb-12 bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#FFB800]/10 rounded-lg">
                <Clock className="text-[#FFB800]" size={24} />
              </div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter">
                {t('timeTracker.title')}
              </h1>
            </div>
            <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">
              {t('timeTracker.subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {weeklyStatus && weeklyStatus.status === 'open' ? (
              <div className="px-4 py-2 rounded-xl flex items-center gap-3 border bg-green-500/5 border-green-500/20">
                <CalendarDays className="text-green-500" size={18} />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    {t('timeTracker.weekStartedOn')}
                  </p>
                  <p className="text-[11px] font-bold text-white">
                    {t('timeTracker.weekLabel')} {weeklyStatus.weekNumber} - {weeklyStatus.year}
                  </p>
                </div>
                
                <button
                  onClick={handleCloseWeek}
                  disabled={isProcessing}
                  className="ml-4 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 className="animate-spin" size={12} /> : t('timeTracker.closeWeek')}
                </button>
              </div>
            ) : (
              <button
                onClick={handleStartWeek}
                disabled={isProcessing}
                className="px-6 py-3 bg-[#FFB800] text-black rounded-xl font-black uppercase tracking-tight text-xs hover:bg-white transition-all transform active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                {isProcessing ? <Loader2 className="animate-spin" size={16} /> : (
                  <>
                    <CalendarDays size={16} />
                    {weeklyStatus?.status === 'closed' ? t('timeTracker.restartWeek') : t('timeTracker.startWeek')}
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Selection Area */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#111315] border border-white/10 rounded-3xl p-6 transition-all hover:border-[#FFB800]/30 group">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4 group-focus-within:text-[#FFB800]">
              <Building2 size={12} />
              {t('timeTracker.client')}
            </label>
            <select 
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              disabled={!!activeLog?.startTime && !activeLog?.endTime || weeklyStatus?.status !== 'open'}
              className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-4 text-sm font-bold appearance-none focus:outline-none focus:border-[#FFB800] transition-colors disabled:opacity-20"
            >
              <option value="">{t('timeTracker.selectClient')}</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="bg-[#111315] border border-white/10 rounded-3xl p-6 transition-all hover:border-[#FFB800]/30 group">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4 group-focus-within:text-[#FFB800]">
              <HardHat size={12} />
              {t('timeTracker.project')}
            </label>
            <select 
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              disabled={!selectedClient || (!!activeLog?.startTime && !activeLog?.endTime) || weeklyStatus?.status !== 'open'}
              className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-4 text-sm font-bold appearance-none focus:outline-none focus:border-[#FFB800] transition-colors disabled:opacity-20"
            >
              <option value="">{t('timeTracker.selectProject')}</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        <AnimatePresence>
          {selectedProject && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              {projects.find(p => p.id === selectedProject)?.location && (
                <div className="bg-[#1a1c1e] border border-[#FFB800]/20 rounded-2xl p-4 flex items-start gap-3">
                  <div className="mt-0.5">
                    <AlertCircle className="text-[#FFB800]" size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">{t('timeTracker.projectLocation')}</p>
                    <p className="text-sm font-bold text-gray-300">
                      {projects.find(p => p.id === selectedProject)?.location}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-500 text-sm mb-8">
            <AlertCircle size={20} />
            <p className="font-bold">{error}</p>
          </div>
        )}

        {/* Action Area */}
        <AnimatePresence mode="wait">
          {weeklyStatus?.status !== 'open' && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="bg-[#111315] border border-white/10 rounded-3xl p-12 text-center space-y-6"
             >
               <div className="w-20 h-20 bg-[#FFB800]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                 <CalendarDays className="text-[#FFB800]" size={40} />
               </div>
               <div className="space-y-2">
                 <h2 className="text-2xl font-black italic uppercase tracking-tighter">
                   {weeklyStatus?.status === 'closed' ? t('timeTracker.weekClosed') : t('timeTracker.weekNotStartedTitle')}
                 </h2>
                 <p className="text-gray-500 text-sm max-w-sm mx-auto font-mono uppercase tracking-widest">
                   {weeklyStatus?.status === 'closed' ? t('timeTracker.weekNotStartedDesc') : t('timeTracker.weekNotStartedDesc')}
                 </p>
               </div>
               <button
                 onClick={handleStartWeek}
                 disabled={isProcessing}
                 className="bg-[#FFB800] text-black px-12 py-4 rounded-2xl font-black uppercase tracking-tighter hover:bg-white transition-all transform active:scale-95 disabled:opacity-50"
               >
                 {isProcessing ? <Loader2 className="animate-spin" size={24} /> : t('timeTracker.startWeek')}
               </button>
             </motion.div>
          )}

          {weeklyStatus?.status === 'open' && !selectedProject && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 text-gray-600 italic font-mono text-xs uppercase tracking-widest"
            >
              {t('timeTracker.selectToStart')}
            </motion.div>
          )}

          {selectedProject && !activeLog && (
            <motion.div 
              key="checkin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <button 
                onClick={handleCheckIn}
                disabled={isProcessing}
                className="group relative flex items-center gap-4 bg-[#FFB800] text-black px-12 py-6 rounded-3xl font-black text-xl italic uppercase tracking-tighter hover:bg-white transition-all transform active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    {t('timeTracker.checkIn')}
                    <ChevronRight size={24} />
                  </>
                )}
                
                {/* Visual accent */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-black/5 rounded-3xl transition-all m-1"></div>
              </button>
            </motion.div>
          )}

          {activeLog && (
            <motion.div 
              key="active"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="bg-[#111315] border border-white/10 rounded-[2.5rem] p-8">
                <div className="flex flex-wrap items-center justify-between gap-6 mb-8 pb-8 border-b border-white/5">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FFB800]">{t('timeTracker.status')}</p>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                       <h2 className="text-xl font-bold uppercase tracking-tight">{t('timeTracker.working')}</h2>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FFB800]">{t('timeTracker.start')}</p>
                    <p className="font-mono text-2xl font-black">
                      {activeLog.startTime?.toDate 
                        ? activeLog.startTime.toDate().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) 
                        : (activeLog.startTime instanceof Date ? activeLog.startTime.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) : '...')
                      }
                    </p>
                  </div>
                </div>

                {activeLog.endTime ? (
                  <div className="text-center py-12">
                     <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="text-green-500" size={40} />
                     </div>
                     <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2 text-green-500">
                        {t('timeTracker.checkoutComplete')}
                     </h3>
                     <p className="text-gray-500 text-sm font-mono uppercase tracking-widest">
                       {t('timeTracker.finishedAt')} {activeLog.endTime?.toDate ? activeLog.endTime.toDate().toLocaleTimeString(language === 'pt' ? 'pt-PT' : (language === 'hi' ? 'hi-IN' : 'en-GB'), { hour: '2-digit', minute: '2-digit' }) : '...'}
                     </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {!canCheckOut ? (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 text-center space-y-6">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                          <Wrench className="text-red-500" size={32} />
                        </div>
                        <div>
                          <h3 className="text-xl font-black uppercase italic tracking-tighter text-white mb-2">{t('timeTracker.dailyMaintenanceRequired')}</h3>
                          <p className="text-gray-500 text-sm max-w-sm mx-auto">
                            {t('timeTracker.dailyMaintenanceRequired')}
                          </p>
                        </div>
                        <Link 
                          to="/maintenance"
                          className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 rounded-xl font-black uppercase text-xs hover:bg-[#FFB800] transition-all"
                        >
                          {t('chat.maintenance')}
                          <ChevronRight size={16} />
                        </Link>
                      </div>
                    ) : (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-6 flex items-center gap-4">
                        <CheckCircle2 size={24} className="text-green-500" />
                        <p className="text-sm font-bold text-white uppercase tracking-tight">{t('timeTracker.checkoutComplete')}</p>
                      </div>
                    )}

                    <div className="pt-8 border-t border-white/5 space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#FFB800] ml-2">
                          {t('timeTracker.leaveMessage')}
                        </label>
                        <textarea
                          value={checkoutMessage}
                          onChange={(e) => setCheckoutMessage(e.target.value)}
                          placeholder={t('timeTracker.messagePlaceholder')}
                          className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-[#FFB800] transition-colors resize-none h-24"
                        />
                      </div>

                      <button 
                        onClick={handleCheckOut}
                        disabled={!canCheckOut || isProcessing}
                        className="w-full group relative flex items-center justify-center gap-4 bg-white text-black px-12 py-6 rounded-3xl font-black text-xl italic uppercase tracking-tighter hover:bg-[#FFB800] transition-all transform active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <Loader2 className="animate-spin" size={24} />
                        ) : (
                          <>
                            {t('timeTracker.checkOut')}
                            <CheckCircle2 size={24} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

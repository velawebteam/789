import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  getDocs, 
  addDoc, 
  serverTimestamp,
  orderBy,
  limit
} from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { handleFirestoreError } from '../lib/firestore-errors';
import { getWeekNumber } from '../lib/date-utils';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { 
  Wrench, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Clock, 
  Calendar,
  ChevronRight,
  Lock,
  LogIn
} from 'lucide-react';

interface MaintenanceTask {
  id: string;
  label: string;
}

const MAINTENANCE_DAILY_TASKS = [
  { id: 'vec_inside', labelKey: 'maintenance.tasks.vec_inside' },
  { id: 'tools_air', labelKey: 'maintenance.tasks.tools_air' },
  { id: 'batteries', labelKey: 'maintenance.tasks.batteries' },
  { id: 'buckets_towels', labelKey: 'maintenance.tasks.buckets_towels' }
];

const MAINTENANCE_WEEKLY_TASKS = [
  { id: 'wear_materials', labelKey: 'maintenance.tasks.wear_materials' },
  { id: 'boxes_clean', labelKey: 'maintenance.tasks.boxes_clean' },
  { id: 'drill_lubricated', labelKey: 'maintenance.tasks.drill_lubricated' },
  { id: 'sander_lubricated', labelKey: 'maintenance.tasks.sander_lubricated' }
];

export default function Maintenance() {
  const { user, login, loading: authLoading, isAuthorized } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isWeekOpen, setIsWeekOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeProjectName, setActiveProjectName] = useState<string | null>(null);
  const [activeLogDate, setActiveLogDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [dailyImages, setDailyImages] = useState<Record<string, { file: File | null, preview: string | null }>>({});
  const [weeklyImages, setWeeklyImages] = useState<Record<string, { file: File | null, preview: string | null }>>({});
  const [completedToday, setCompletedToday] = useState<{ daily: boolean, weekly: boolean }>({ daily: false, weekly: false });

  const isFriday = new Date().getDay() === 5;

  useEffect(() => {
    if (authLoading || !isAuthorized) return;

    if (!user) {
      setLoading(false);
      return;
    }

    // Check if user is clocked in
    const q = query(
      collection(db, 'time_logs'),
      where('userId', '==', user.uid),
      orderBy('startTime', 'desc'),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const log = snapshot.docs[0].data() as any;
        if (!log.endTime) {
          setIsClockedIn(true);
          setActiveProjectId(log.projectId);
          setActiveProjectName(log.projectName);
          setActiveLogDate(log.date);
        } else {
          setIsClockedIn(false);
          setActiveProjectId(log.projectId);
          setActiveProjectName(log.projectName);
          setActiveLogDate(log.date);
        }
      } else {
        setIsClockedIn(false);
        setActiveProjectId(null);
        setActiveProjectName(null);
        setActiveLogDate(null);
      }
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, 'list', 'time_logs');
      setLoading(false);
    });

    const targetDate = activeLogDate || new Date().toISOString().split('T')[0];
    const mq = query(
      collection(db, 'maintenance_logs'),
      where('userId', '==', user.uid),
      where('date', '==', targetDate)
    );

    const unsubscribeMaintenance = onSnapshot(mq, (snapshot) => {
      const stats = { daily: false, weekly: false };
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.type === 'daily') stats.daily = true;
        if (data.type === 'weekly') stats.weekly = true;
      });
      setCompletedToday(stats);
    });

    const { week, year } = getWeekNumber(new Date());
    const wq = query(
      collection(db, 'weekly_status'),
      where('userId', '==', user.uid),
      where('weekNumber', '==', week),
      where('year', '==', year)
    );

    const unsubscribeWeek = onSnapshot(wq, (snapshot) => {
      if (!snapshot.empty) {
        setIsWeekOpen(snapshot.docs[0].data().status === 'open');
      } else {
        setIsWeekOpen(false);
      }
    });

    return () => {
      unsubscribe();
      unsubscribeMaintenance();
      unsubscribeWeek();
    };
  }, [user, authLoading, isAuthorized, activeLogDate]);

  const handleFileChange = (type: 'daily' | 'weekly', taskId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const stateSet = type === 'daily' ? setDailyImages : setWeeklyImages;
        stateSet(prev => ({
          ...prev,
          [taskId]: { file, preview: reader.result as string }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (type: 'daily' | 'weekly') => {
    if (!user || isSubmitting || !isAuthorized) return;
    
    if (!activeProjectId) {
      alert(t('maintenance.clockInFirst'));
      return;
    }

    const tasks = type === 'daily' ? MAINTENANCE_DAILY_TASKS : MAINTENANCE_WEEKLY_TASKS;
    const images = type === 'daily' ? dailyImages : weeklyImages;
    
    if (tasks.some(t => !images[t.id]?.file)) {
      alert(t('maintenance.uploadRequired'));
      return;
    }

    setIsSubmitting(true);
    const targetDate = activeLogDate || new Date().toISOString().split('T')[0];

    try {
      const imageUrls: Record<string, string> = {};
      const uploadPromises = tasks.map(async (task) => {
        const item = images[task.id];
        if (!item.file) return;

        const fileExtension = item.file.name.split('.').pop();
        const fileName = `${task.id}_${Date.now()}.${fileExtension}`;
        const fileRef = ref(storage, `maintenance/${user.uid}/${targetDate}/${type}/${fileName}`);
        
        const metadata = {
          contentType: item.file.type,
          customMetadata: {
            userId: user.uid,
            userName: user.displayName || 'Worker',
            projectId: activeProjectId || 'none',
            date: targetDate,
            task: task.id
          }
        };

        const uploadTask = uploadBytesResumable(fileRef, item.file, metadata);

        return new Promise<void>((resolve, reject) => {
          uploadTask.on('state_changed', null, (err) => reject(err), async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            imageUrls[task.id] = url;
            resolve();
          });
        });
      });

      await Promise.all(uploadPromises);

      await addDoc(collection(db, 'maintenance_logs'), {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || 'Worker',
        projectId: activeProjectId,
        projectName: activeProjectName,
        date: targetDate,
        type: type,
        images: imageUrls,
        completedAt: serverTimestamp()
      });

      if (type === 'daily') setDailyImages({});
      else setWeeklyImages({});

    } catch (error) {
      console.error(`Error submitting ${type} maintenance:`, error);
      alert(t('maintenance.uploadError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#FFB800]" size={48} />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
            <Lock className="text-red-500" size={40} />
          </div>
          <h2 className="text-2xl font-black mb-4 uppercase tracking-tighter">{t('common.unauthorized')}</h2>
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
            <Link 
              to="/"
              className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl border border-white/10 transition-all uppercase tracking-widest text-xs text-center"
            >
              {t('common.backToHome')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#FFB800]" size={48} />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
            <Lock className="text-red-500" size={40} />
          </div>
          <h2 className="text-2xl font-black mb-4 uppercase tracking-tighter">{t('common.unauthorized')}</h2>
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
            <Link 
              to="/"
              className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl border border-white/10 transition-all uppercase tracking-widest text-xs text-center"
            >
              {t('common.backToHome')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'daily' && !isClockedIn && !completedToday.daily) {
    return (
      <div className="min-h-screen md:pt-40 pt-10 pb-12 bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-[#111315] border border-white/10 rounded-[2.5rem] md:p-10 p-6 text-center shadow-2xl">
          <div className="w-20 h-20 bg-[#FFB800]/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Clock className="text-[#FFB800]" size={40} />
          </div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-4">{t('maintenance.clockInFirst')}</h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            {t('maintenance.clockInFirstDesc')}
          </p>
          <Link 
            to="/clock-in"
            className="block w-full bg-[#FFB800] text-black py-4 rounded-2xl font-black uppercase tracking-tighter hover:bg-white transition-all shadow-[0_0_20px_rgba(255,184,0,0.2)] text-sm md:text-base px-2"
          >
            {t('maintenance.goToClockIn')}
          </Link>
        </div>
      </div>
    );
  }

  if (activeTab === 'weekly' && !isWeekOpen && !completedToday.weekly) {
    return (
      <div className="min-h-screen md:pt-40 pt-10 pb-12 bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-[#111315] border border-white/10 rounded-[2.5rem] md:p-10 p-6 text-center shadow-2xl">
          <div className="w-20 h-20 bg-[#FFB800]/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Calendar className="text-[#FFB800]" size={40} />
          </div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-4">{t('maintenance.weekNotStarted')}</h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            {t('maintenance.weekNotStartedDesc')}
          </p>
          <Link 
            to="/clock-in"
            className="block w-full bg-[#FFB800] text-black py-4 rounded-2xl font-black uppercase tracking-tighter hover:bg-white transition-all shadow-[0_0_20px_rgba(255,184,0,0.2)] text-sm md:text-base px-2"
          >
            {t('maintenance.goToClockIn')}
          </Link>
        </div>
      </div>
    );
  }

  const tasks = activeTab === 'daily' 
    ? MAINTENANCE_DAILY_TASKS.map(task => ({ ...task, label: t(task.labelKey) }))
    : MAINTENANCE_WEEKLY_TASKS.map(task => ({ ...task, label: t(task.labelKey) }));

  const currentImages = activeTab === 'daily' ? dailyImages : weeklyImages;
  const isTabCompleted = activeTab === 'daily' ? completedToday.daily : completedToday.weekly;

  return (
    <div className="min-h-screen md:pt-40 pt-10 pb-20 bg-[#0a0a0a] text-white">
      <SEO 
        title={`${t('maintenance.title')} | Real Builder Academy`}
        description="Registo de manutenção diária e semanal da frota e ferramentas."
      />
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FFB800]/10 rounded-lg">
                <Wrench className="text-[#FFB800]" size={24} />
              </div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter">{t('maintenance.title')}</h1>
            </div>
            <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest">
              {activeProjectName ? t('maintenance.activeProject', { project: activeProjectName }) : t('maintenance.viewingStatus')}
            </p>
          </div>

          <div className="flex bg-[#111315] p-1 rounded-2xl border border-white/10 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('daily')}
              className={`flex-1 md:w-32 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'daily' ? 'bg-[#FFB800] text-black' : 'text-gray-500 hover:text-white'}`}
            >
              {t('maintenance.daily')}
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`flex-1 md:w-32 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'weekly' ? (isFriday ? 'bg-[#FFB800] text-black' : 'bg-white/10 text-white') : 'text-gray-500 hover:text-white'} flex items-center justify-center gap-2`}
            >
              {t('maintenance.weekly')}
              {isFriday && <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />}
            </button>
          </div>
        </div>

        {isTabCompleted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111315] border border-green-500/20 rounded-[2.5rem] p-12 text-center shadow-2xl"
          >
            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20">
              <CheckCircle2 className="text-green-500" size={48} />
            </div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4 text-green-500">
              {t('maintenance.checklistCompleted', { type: activeTab === 'daily' ? t('maintenance.daily') : t('maintenance.weekly') })}
            </h2>
            <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed mb-10">
              {t('maintenance.checklistCompletedDesc')}
            </p>
            <Link
              to="/clock-in"
              className="inline-flex items-center gap-3 bg-white text-black px-10 py-4 rounded-2xl font-black uppercase tracking-tighter hover:bg-[#FFB800] transition-all transform active:scale-95 shadow-xl"
            >
              {t('maintenance.goToClockIn')}
              <ChevronRight size={20} />
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`bg-[#111315] border border-white/10 rounded-3xl p-6 transition-all hover:border-[#FFB800]/30 group relative overflow-hidden ${currentImages[task.id]?.preview ? 'border-[#FFB800]/50' : ''}`}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <p className="text-xs font-bold leading-tight group-hover:text-[#FFB800] transition-colors">{task.label}</p>
                      {currentImages[task.id]?.preview ? (
                        <CheckCircle2 size={16} className="text-[#FFB800]" />
                      ) : (
                        <AlertCircle size={16} className="text-gray-700" />
                      )}
                    </div>

                    <div className="relative flex-1 min-h-[160px] cursor-pointer">
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(activeTab, task.id, e)}
                        className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                      />
                      {currentImages[task.id]?.preview ? (
                        <div className="w-full h-full rounded-2xl overflow-hidden border border-[#FFB800]/20">
                          <img src={currentImages[task.id].preview!} alt="Task Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-black uppercase tracking-widest bg-[#FFB800] text-black px-3 py-1 rounded-full">{t('maintenance.changePhoto')}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-black/40 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 group-hover:bg-[#FFB800]/5 transition-all">
                          <div className="p-3 bg-white/5 rounded-full group-hover:bg-[#FFB800]/20 transition-colors">
                            <Camera className="text-gray-400 group-hover:text-[#FFB800]" size={24} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                            {task.id.includes('drill') || task.id.includes('sander') ? t('maintenance.takePhoto') : t('maintenance.photoRequired')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-white/5 flex flex-col items-center gap-4">
              <button 
                onClick={() => handleSubmit(activeTab)}
                disabled={isSubmitting || tasks.some(t => !currentImages[t.id]?.file)}
                className="w-full md:w-auto min-w-[300px] bg-[#FFB800] text-black py-5 rounded-2xl font-black text-lg uppercase tracking-tighter hover:bg-white transition-all transform active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(255,184,0,0.15)] flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    {t('maintenance.submitReport', { type: activeTab === 'daily' ? t('maintenance.daily') : t('maintenance.weekly') })}
                    <ChevronRight size={24} />
                  </>
                )}
              </button>
              
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                {t('maintenance.allPhotosRequired')}
              </p>
            </div>
          </div>
        )}

        {/* Weekly Friday Warning */}
        {activeTab === 'daily' && isFriday && !completedToday.weekly && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-red-500/10 border border-red-500/20 rounded-3xl p-6 flex items-start gap-4"
          >
            <div className="mt-1">
              <AlertCircle size={20} className="text-red-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-white mb-1 uppercase tracking-tight">{t('maintenance.fridayRequirement')}</p>
              <p className="text-xs text-gray-400">{t('maintenance.fridayRequirementDesc')}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

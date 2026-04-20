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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { handleFirestoreError } from '../lib/firestore-errors';
import { getWeekNumber } from '../lib/date-utils';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wrench, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Clock, 
  Calendar,
  ChevronRight
} from 'lucide-react';

interface MaintenanceTask {
  id: string;
  label: string;
}

const DAILY_TASKS: MaintenanceTask[] = [
  { id: 'vec_inside', label: 'Inside of the vehicle' },
  { id: 'tools_air', label: 'Blow off tools with air' },
  { id: 'batteries', label: 'All batteries on charge' },
  { id: 'buckets_towels', label: 'Buckets and towels cleaned' }
];

const WEEKLY_TASKS: MaintenanceTask[] = [
  { id: 'wear_materials', label: 'Wear materials ordered' },
  { id: 'boxes_clean', label: 'All boxes opened and blown clean' },
  { id: 'drill_lubricated', label: 'Screwdriver/Drill - Wiped Clean; Chuck Lubricated' },
  { id: 'sander_lubricated', label: 'Bellt Sander- Blown clean thoroughly; Bearings lubricated; screws tightened; belt checked' }
];

export default function Maintenance() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isWeekOpen, setIsWeekOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeProjectName, setActiveProjectName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [dailyImages, setDailyImages] = useState<Record<string, { file: File | null, preview: string | null }>>({});
  const [weeklyImages, setWeeklyImages] = useState<Record<string, { file: File | null, preview: string | null }>>({});
  const [completedToday, setCompletedToday] = useState<{ daily: boolean, weekly: boolean }>({ daily: false, weekly: false });

  const isFriday = new Date().getDay() === 5;

  useEffect(() => {
    if (!user) return;

    // Check if user is clocked in today
    const today = new Date().toISOString().split('T')[0];
    const q = query(
      collection(db, 'time_logs'),
      where('userId', '==', user.uid),
      where('date', '==', today),
      orderBy('startTime', 'desc'),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const log = snapshot.docs[0].data();
        if (!log.endTime) {
          setIsClockedIn(true);
          setActiveProjectId(log.projectId);
          setActiveProjectName(log.projectName);
        } else {
          setIsClockedIn(false);
        }
      } else {
        setIsClockedIn(false);
      }
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, 'list', 'time_logs');
    });

    // Check maintenance status for today
    const mq = query(
      collection(db, 'maintenance_logs'),
      where('userId', '==', user.uid),
      where('date', '==', today)
    );

    const unsubscribeMaintenance = onSnapshot(mq, (snapshot) => {
      const stats = { daily: false, weekly: false };
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.type === 'daily') stats.daily = true;
        if (data.type === 'weekly') stats.weekly = true;
      });
      setCompletedToday(stats);
    }, (err) => {
      handleFirestoreError(err, 'list', 'maintenance_logs');
    });

    // Check if week is open
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
    }, (err) => {
      handleFirestoreError(err, 'list', 'weekly_status');
    });

    return () => {
      unsubscribe();
      unsubscribeMaintenance();
      unsubscribeWeek();
    };
  }, [user]);

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
    if (!user || !activeProjectId || isSubmitting) return;

    const tasks = type === 'daily' ? DAILY_TASKS : WEEKLY_TASKS;
    const images = type === 'daily' ? dailyImages : weeklyImages;
    
    // Validate all images
    if (tasks.some(t => !images[t.id]?.file)) {
      alert('Please upload all required images.');
      return;
    }

    setIsSubmitting(true);
    const today = new Date().toISOString().split('T')[0];

    try {
      const imageUrls: Record<string, string> = {};
      
      for (const task of tasks) {
        const item = images[task.id];
        if (item.file) {
          const fileRef = ref(storage, `maintenance/${user.uid}/${today}/${type}/${task.id}_${Date.now()}`);
          const uploadResult = await uploadBytes(fileRef, item.file);
          const url = await getDownloadURL(uploadResult.ref);
          imageUrls[task.id] = url;
        }
      }

      try {
        await addDoc(collection(db, 'maintenance_logs'), {
          userId: user.uid,
          userEmail: user.email,
          userName: user.displayName || 'Worker',
          projectId: activeProjectId,
          projectName: activeProjectName,
          date: today,
          type: type,
          images: imageUrls,
          completedAt: serverTimestamp()
        });
      } catch (err) {
        handleFirestoreError(err, 'create', 'maintenance_logs');
      }

      // Reset form for this tab
      if (type === 'daily') setDailyImages({});
      else setWeeklyImages({});

    } catch (error) {
      console.error(`Error submitting ${type} maintenance:`, error);
      alert('Failed to submit maintenance. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#FFB800]" size={48} />
      </div>
    );
  }

  if (activeTab === 'daily' && !isClockedIn && !completedToday.daily) {
    return (
      <div className="min-h-screen pt-40 pb-12 bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-[#111315] border border-white/10 rounded-[2.5rem] p-10 text-center shadow-2xl">
          <div className="w-20 h-20 bg-[#FFB800]/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Clock className="text-[#FFB800]" size={40} />
          </div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-4">Clock in first</h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            You must be clocked into a project to unlock today's maintenance checklist.
          </p>
          <a 
            href="/clock-in"
            className="block w-full bg-[#FFB800] text-black py-4 rounded-2xl font-black uppercase tracking-tighter hover:bg-white transition-all shadow-[0_0_20px_rgba(255,184,0,0.2)]"
          >
            Go to Clock In
          </a>
        </div>
      </div>
    );
  }

  if (activeTab === 'weekly' && !isWeekOpen && !completedToday.weekly) {
    return (
      <div className="min-h-screen pt-40 pb-12 bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-[#111315] border border-white/10 rounded-[2.5rem] p-10 text-center shadow-2xl">
          <div className="w-20 h-20 bg-[#FFB800]/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Calendar className="text-[#FFB800]" size={40} />
          </div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-4">Week not started</h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            You must start the work week in the Clock-In page to unlock the weekly maintenance checklist.
          </p>
          <a 
            href="/clock-in"
            className="block w-full bg-[#FFB800] text-black py-4 rounded-2xl font-black uppercase tracking-tighter hover:bg-white transition-all shadow-[0_0_20px_rgba(255,184,0,0.2)]"
          >
            Go to Clock In
          </a>
        </div>
      </div>
    );
  }

  const tasks = activeTab === 'daily' ? DAILY_TASKS : WEEKLY_TASKS;
  const currentImages = activeTab === 'daily' ? dailyImages : weeklyImages;
  const isTabCompleted = activeTab === 'daily' ? completedToday.daily : completedToday.weekly;

  return (
    <div className="min-h-screen pt-40 pb-20 bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FFB800]/10 rounded-lg">
                <Wrench className="text-[#FFB800]" size={24} />
              </div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter">Maintenance</h1>
            </div>
            <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest">
              {activeProjectName ? `Active on: ${activeProjectName}` : 'Viewing Status'}
            </p>
          </div>

          <div className="flex bg-[#111315] p-1 rounded-2xl border border-white/10 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('daily')}
              className={`flex-1 md:w-32 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'daily' ? 'bg-[#FFB800] text-black' : 'text-gray-500 hover:text-white'}`}
            >
              Daily
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`flex-1 md:w-32 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'weekly' ? (isFriday ? 'bg-[#FFB800] text-black' : 'bg-white/10 text-white') : 'text-gray-500 hover:text-white'} flex items-center justify-center gap-2`}
            >
              Weekly
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
              {activeTab === 'daily' ? 'Daily' : 'Weekly'} Maintenance Done
            </h2>
            <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
              Today's checklist has been submitted and verified. You're all set for this task!
            </p>
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
                            <span className="text-[10px] font-black uppercase tracking-widest bg-[#FFB800] text-black px-3 py-1 rounded-full">Change Photo</span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-black/40 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 group-hover:bg-[#FFB800]/5 transition-all">
                          <div className="p-3 bg-white/5 rounded-full group-hover:bg-[#FFB800]/20 transition-colors">
                            <Camera className="text-gray-400 group-hover:text-[#FFB800]" size={24} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{task.id.includes('drill') || task.id.includes('sander') ? 'Take photo' : 'Upload photo'}</span>
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
                    Submit {activeTab === 'daily' ? 'Daily' : 'Weekly'} Report
                    <ChevronRight size={24} />
                  </>
                )}
              </button>
              
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                All photos are required for submission
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
              <p className="text-xs font-bold text-white mb-1 uppercase tracking-tight">Friday Requirement</p>
              <p className="text-xs text-gray-400">Weekly maintenance is also required today before you can clock out.</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

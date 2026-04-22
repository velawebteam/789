import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, deleteDoc, updateDoc, where, or, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { 
  Building2, HardHat, Plus, Trash2, Power, PowerOff, X, CheckCircle2,
  Clock, Calendar, ChevronRight, Loader2, ArrowLeft, Search, Filter,
  FileText, Download
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
  ownerEmail?: string;
  active?: boolean;
  startedAt?: any;
  finishedAt?: any;
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
  message?: string;
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
          <p className="text-[10px] text-[#FFB800] font-bold uppercase tracking-widest truncate">{client?.name || t('admin.unknownClient')}</p>
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

export default function WorkersPanel() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'clients' | 'hours'>('clients');
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newClientName, setNewClientName] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectLocation, setNewProjectLocation] = useState('');
  const [projectClientId, setProjectClientId] = useState('');
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [isAddingProject, setIsAddingProject] = useState(false);

  const [filterProjectId, setFilterProjectId] = useState<string>('all');
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');

  const isAuthorized = user && (ALLOWED_EMAILS.includes(user.email || '') || ADMIN_EMAILS.includes(user.email || ''));

  useEffect(() => {
    if (!authLoading) {
      if (!user || !isAuthorized) {
        navigate('/');
      }
    }
  }, [user, authLoading, navigate, isAuthorized]);

  useEffect(() => {
    if (!user || !isAuthorized) return;

    const isAdminUser = user && ADMIN_EMAILS.includes(user.email || '');

    // Clients Query
    const clientsBaseQuery = collection(db, 'clients');
    const clientsQuery = isAdminUser 
      ? query(clientsBaseQuery)
      : query(clientsBaseQuery, where('ownerEmail', '==', user.email));
    
    const unsubscribeClients = onSnapshot(clientsQuery, (snapshot) => {
      const fetchedClients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
      // Sort in frontend to include legacy docs without createdAt
      const sortedClients = [...fetchedClients].sort((a: any, b: any) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      });

      if (isAdminUser) {
        setClients(sortedClients);
      } else {
        setClients(prev => {
          const combined = [...prev, ...sortedClients];
          const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
          return unique;
        });
      }
    });

    // Projects: Visible if owner OR collaborator (or ALL if admin)
    const projectsBaseQuery = collection(db, 'projects');
    const projectsQuery = isAdminUser
      ? query(projectsBaseQuery)
      : query(
          projectsBaseQuery,
          or(
            where('ownerEmail', '==', user.email),
            where('workers', 'array-contains', user.email)
          )
        );

    const unsubscribeProjects = onSnapshot(projectsQuery, async (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      // Sort in frontend
      const sortedProjects = [...projectsData].sort((a: any, b: any) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      });
      setProjects(sortedProjects);

      if (!isAdminUser) {
        // Fetch clients of shared projects that aren't already in the list
        const colleagueClientIds = projectsData
          .filter(p => !p.ownerEmail || p.ownerEmail !== user.email)
          .map(p => p.clientId);
        
        for (const clientId of colleagueClientIds) {
           const cDoc = await getDoc(doc(db, 'clients', clientId));
           if (cDoc.exists()) {
             setClients(prev => {
               if (prev.find(c => c.id === cDoc.id)) return prev;
               return [...prev, { id: cDoc.id, ...cDoc.data() } as Client];
             });
           }
        }
      }
    });

    const baseLogsQuery = collection(db, 'time_logs');
    const logsQuery = isAdminUser 
      ? query(baseLogsQuery, orderBy('startTime', 'desc'))
      : query(baseLogsQuery, where('userId', '==', user.uid), orderBy('startTime', 'desc'));

    const unsubscribeLogs = onSnapshot(logsQuery, (snapshot) => {
      setTimeLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TimeLog)));
      setLoading(false);
    });

    return () => {
      unsubscribeClients();
      unsubscribeProjects();
      unsubscribeLogs();
    };
  }, [user, isAuthorized]);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || isAddingClient || !user) return;
    setIsAddingClient(true);
    try {
      await addDoc(collection(db, 'clients'), {
        name: newClientName.trim(),
        active: true,
        createdBy: user.uid,
        ownerEmail: user.email,
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
    if (!newProjectName.trim() || !projectClientId || isAddingProject || !user) return;
    setIsAddingProject(true);
    try {
      await addDoc(collection(db, 'projects'), {
        name: newProjectName.trim(),
        location: newProjectLocation.trim(),
        clientId: projectClientId,
        workers: [user.email], // Creator is automatically a collaborator
        active: true,
        createdBy: user.uid,
        ownerEmail: user.email,
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

  const filteredLogs = timeLogs.filter(log => {
    const matchProject = filterProjectId === 'all' || log.projectId === filterProjectId;
    const matchStart = !filterStartDate || log.date >= filterStartDate;
    const matchEnd = !filterEndDate || log.date <= filterEndDate;
    // Workers only see their own logs, admins see all
    const isAdminUser = user && ADMIN_EMAILS.includes(user.email || '');
    const matchUser = isAdminUser || log.userEmail === user?.email;
    return matchProject && matchStart && matchEnd && matchUser;
  });

  const totalMinutes = filteredLogs.reduce((acc, log) => acc + (log.durationMinutes || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#FFB800]" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-12 bg-[#0a0a0a]">
       <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
              {t('workers.title')}
            </h1>
          </div>

          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setSelectedTab('clients')}
              className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${selectedTab === 'clients' ? 'bg-[#FFB800] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              {t('workers.clients')}
            </button>
            <button
              onClick={() => setSelectedTab('hours')}
              className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${selectedTab === 'hours' ? 'bg-[#FFB800] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              {t('workers.hours')}
            </button>
          </div>
        </div>

        {selectedTab === 'clients' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Management Section */}
            <div className="space-y-8">
              {/* Clients Section */}
              <div className="bg-[#111315] border border-white/10 rounded-[2.5rem] p-8 shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#FFB800]/10 rounded-2xl flex items-center justify-center border border-[#FFB800]/20">
                    <Building2 size={24} className="text-[#FFB800]" />
                  </div>
                  <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">{t('admin.manageClients')}</h3>
                </div>

                <form onSubmit={handleCreateClient} className="space-y-4 mb-8">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">{t('admin.clientName')}</label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={newClientName}
                        onChange={(e) => setNewClientName(e.target.value)}
                        placeholder={t('admin.clientName')}
                        className="flex-1 min-w-0 bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#FFB800]"
                      />
                      <button 
                        type="submit"
                        disabled={!newClientName.trim() || isAddingClient}
                        className="px-6 shrink-0 bg-[#FFB800] text-black rounded-xl font-black uppercase tracking-tighter hover:bg-white transition-all disabled:opacity-50"
                      >
                        {isAddingClient ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                      </button>
                    </div>
                  </div>
                </form>

                <div className="space-y-3">
                  {clients.map(client => (
                    <div key={client.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${client.active !== false ? 'bg-black/20 border-white/5 hover:border-[#FFB800]/30' : 'bg-red-500/5 border-red-500/10 opacity-60'}`}>
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`text-sm font-bold truncate ${client.active !== false ? 'text-white' : 'text-gray-500 line-through'}`}>{client.name}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-4">
                        <button 
                          onClick={() => handleToggleClientStatus(client.id, client.active !== false)}
                          className={`p-2 rounded-xl transition-all ${client.active !== false ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}
                        >
                          {client.active !== false ? <Power size={14} /> : <PowerOff size={14} />}
                        </button>
                        <button 
                          onClick={() => handleDeleteClient(client.id)}
                          className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Projects Section */}
              <div className="bg-[#111315] border border-white/10 rounded-[2.5rem] p-8 shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#FFB800]/10 rounded-2xl flex items-center justify-center border border-[#FFB800]/20">
                    <HardHat size={24} className="text-[#FFB800]" />
                  </div>
                  <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">{t('admin.manageProjects')}</h3>
                </div>

                <form onSubmit={handleCreateProject} className="space-y-4 mb-8">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">{t('admin.targetClient')}</label>
                    <select 
                      value={projectClientId}
                      onChange={(e) => setProjectClientId(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#FFB800] appearance-none"
                    >
                      <option value="">{t('admin.selectClient')}</option>
                      {clients.map(c => (
                        <option key={c.id} value={c.id} className="bg-[#111315]">{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">{t('admin.projectName')}</label>
                    <div className="space-y-4">
                      <input 
                        type="text"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        placeholder={t('admin.projectName')}
                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#FFB800]"
                      />
                      <input 
                        type="text"
                        value={newProjectLocation}
                        onChange={(e) => setNewProjectLocation(e.target.value)}
                        placeholder={t('admin.location')}
                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#FFB800]"
                      />
                      <button 
                        type="submit"
                        disabled={!newProjectName.trim() || !projectClientId || isAddingProject}
                        className="w-full bg-[#FFB800] text-black py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isAddingProject ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                        {t('admin.createProject')}
                      </button>
                    </div>
                  </div>
                </form>

                <div className="space-y-6">
                  {projects.map(project => (
                    <ProjectItem
                      key={project.id}
                      project={project}
                      client={clients.find(c => c.id === project.clientId)}
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
        ) : (
          <div className="space-y-6">
            {/* Filters Section */}
            <div className="bg-[#111315] border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <div className="col-span-1 md:col-span-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">{t('workers.filterByProject')}</label>
                  <div className="relative">
                    <HardHat size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <select
                      value={filterProjectId}
                      onChange={(e) => setFilterProjectId(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#FFB800] appearance-none"
                    >
                      <option value="all">{t('workers.allProjects')}</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id} className="bg-[#111315]">{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">{t('workers.startDate')}</label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input 
                      type="date"
                      value={filterStartDate}
                      onChange={(e) => setFilterStartDate(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#FFB800]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">{t('workers.endDate')}</label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input 
                      type="date"
                      value={filterEndDate}
                      onChange={(e) => setFilterEndDate(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#FFB800]"
                    />
                  </div>
                </div>

                <div className="bg-[#FFB800]/10 border border-[#FFB800]/20 rounded-xl p-3 text-center">
                   <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">{t('workers.totalHoursCalculation')}</p>
                   <p className="text-lg font-black text-[#FFB800] italic tracking-tighter">{totalHours}h</p>
                </div>
              </div>
            </div>

            {/* Logs Table */}
            <div className="bg-[#111315] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">{t('workers.date')}</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">{t('workers.worker')}</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">{t('workers.project')}</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">{t('workers.start')}</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">{t('workers.end')}</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">{t('workers.duration')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-sm italic">
                          {t('workers.noLogs')}
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Calendar size={12} className="text-[#FFB800]" />
                              <span className="text-xs font-bold text-white">{log.date}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-400 text-xs">
                             {log.userName}
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-xs font-bold text-white group-hover:text-[#FFB800] transition-colors">{log.projectName}</p>
                            <p className="text-[9px] font-black text-gray-600 uppercase tracking-tighter">{log.clientName}</p>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-xs font-mono text-gray-400">
                              {log.startTime?.seconds ? new Intl.DateTimeFormat('pt-PT', { hour: '2-digit', minute: '2-digit' }).format(new Date(log.startTime.seconds * 1000)) : '-'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-xs font-mono text-gray-400">
                              {log.endTime?.seconds ? new Intl.DateTimeFormat('pt-PT', { hour: '2-digit', minute: '2-digit' }).format(new Date(log.endTime.seconds * 1000)) : log.endTime ? t('workers.activeStatus') : '-'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <span className={`px-3 py-1 rounded-full text-[10px] font-black italic tracking-tighter ${log.endTime ? 'bg-[#FFB800]/10 text-[#FFB800] border border-[#FFB800]/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                              {log.durationMinutes ? `${Math.floor(log.durationMinutes / 60)}h ${log.durationMinutes % 60}m` : (log.endTime ? '0m' : t('workers.inProgress'))}
                             </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
       </div>
    </div>
  );
}

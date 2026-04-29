import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Receipt, Loader2, ArrowLeft, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ALLOWED_EMAILS, ADMIN_EMAILS } from '../constants/auth';

export default function Billing() {
  const { user, login, loading: authLoading, isAuthorized } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && (!user || !isAuthorized)) {
      // We'll show the unauthorized state instead of auto-redirecting for better UX if they are just not logged in
    }
  }, [user, authLoading, isAuthorized]);

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
              className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl border border-white/10 transition-all uppercase tracking-widest text-xs"
            >
              {t('common.backToHome')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-12 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">{t('common.backToHome')}</span>
        </button>

        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-[#FFB800]/10 rounded-full flex items-center justify-center mb-8 border border-[#FFB800]/20">
            <Receipt className="text-[#FFB800]" size={48} />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white mb-4">
            {t('billing.title')}
          </h1>
          
          <div className="relative">
            <div className="absolute inset-0 bg-[#FFB800] blur-2xl opacity-20 animate-pulse" />
            <p className="relative text-xl md:text-2xl font-bold text-[#FFB800] uppercase tracking-[0.3em] py-2 px-8 border-y border-[#FFB800]/30">
              {t('billing.comingSoon')}
            </p>
          </div>
          
          <p className="mt-8 text-gray-500 font-mono text-xs uppercase tracking-widest max-w-xs leading-relaxed">
            We are working on a complete billing and invoice management system for your projects.
          </p>
        </div>
      </div>
    </div>
  );
}

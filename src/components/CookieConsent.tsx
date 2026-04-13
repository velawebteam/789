import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCookieConsent } from '../context/CookieContext';
import { Link } from 'react-router-dom';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();
  const { consent, acceptCookies, rejectCookies } = useCookieConsent();

  useEffect(() => {
    if (consent === 'undecided') {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [consent]);

  const handleAccept = () => {
    acceptCookies();
    setIsVisible(false);
  };

  const handleReject = () => {
    rejectCookies();
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 relative overflow-hidden group">
              {/* Background Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FFB800]/10 blur-3xl rounded-full pointer-events-none" />
              
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#FFB800]/10 flex items-center justify-center">
                  <Cookie className="w-6 h-6 text-[#FFB800]" />
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                    {t('cookies.title')}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
                    {t('cookies.description')}{' '}
                    <Link to="/cookies" className="text-[#FFB800] hover:underline font-medium">
                      {t('cookiePolicy.title')}
                    </Link>
                  </p>
                </div>
                
                <div className="flex flex-row gap-3 w-full md:w-auto">
                  <button
                    onClick={handleReject}
                    className="flex-1 md:flex-none px-6 py-2.5 rounded-xl border border-white/10 text-white text-sm font-semibold hover:bg-white/5 transition-colors"
                  >
                    {t('cookies.reject')}
                  </button>
                  <button
                    onClick={handleAccept}
                    className="flex-1 md:flex-none px-8 py-2.5 rounded-xl bg-[#FFB800] text-black text-sm font-bold hover:bg-[#FFB800]/90 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-[#FFB800]/20"
                  >
                    {t('cookies.accept')}
                  </button>
                </div>
              </div>

              <button 
                onClick={() => setIsVisible(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

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
          className="fixed bottom-0 left-0 right-0 z-[200] w-full"
        >
          <div className="bg-[#1a1a1a] border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] p-4 md:px-8 md:py-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6">
              <div className="flex-grow">
                <h3 className="text-white font-bold text-base mb-1">
                  {t('cookies.title')}
                </h3>
                <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                  {t('cookies.description')}{' '}
                  <Link to="/cookies" className="text-[#FFB800] hover:underline font-medium">
                    {t('cookiePolicy.title')}
                  </Link>
                </p>
              </div>
              
              <div className="flex flex-row gap-3 w-full md:w-auto shrink-0">
                <button
                  onClick={handleReject}
                  className="flex-1 md:flex-none px-6 py-2 rounded-lg border border-white/20 text-white text-xs font-semibold hover:bg-white/5 transition-colors whitespace-nowrap"
                >
                  {t('cookies.reject')}
                </button>
                <button
                  onClick={handleAccept}
                  className="flex-1 md:flex-none px-8 py-2 rounded-lg bg-[#FFB800] text-black text-xs font-bold hover:bg-[#FFB800]/90 transition-all whitespace-nowrap"
                >
                  {t('cookies.accept')}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

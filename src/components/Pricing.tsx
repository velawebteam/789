import { Check, X, Globe, X as CloseIcon, CheckCircle2, Construction, BookOpen, ArrowRight, Bell } from 'lucide-react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Pricing() {
  const { t } = useLanguage();
  const [showPromo, setShowPromo] = useState(false);
  const [hasDismissedPromo, setHasDismissedPromo] = useState(false);
  const [hasPromoAppeared, setHasPromoAppeared] = useState(false);
  
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView && !hasDismissedPromo) {
      const timer = setTimeout(() => {
        setShowPromo(true);
        setHasPromoAppeared(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isInView, hasDismissedPromo]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: id === 'contact-form' ? 'center' : 'start'
      });
    }
  };

  const handleSelectPlan = (planId: string) => {
    window.dispatchEvent(new CustomEvent('planSelected', { detail: planId }));
    scrollTo('contact-form');
  };

  return (
    <section id="pricing" ref={sectionRef} className="pt-16 md:pt-32 pb-8 md:pb-0 bg-[#111315] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative pt-8 md:pt-16 px-8 md:px-16 border-t border-x border-white/5">
          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#FFB800]"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#FFB800]"></div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight uppercase">
              {t('pricing.title')}
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t('pricing.subtitle')}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h3 className="text-2xl font-bold text-white">{t('pricing.choosePath')} <span className="text-[#FFB800]">{t('pricing.path')}</span></h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Card 1 */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-[#15181b] rounded-2xl p-8 border border-white/10 relative flex flex-col"
            >
              <div className="absolute -top-3 left-6 bg-[#FFB800] text-black text-xs font-bold px-3 py-1 rounded-md flex items-center gap-1">
                <span className="w-3 h-3 rounded-full border border-black flex items-center justify-center text-[8px]">M</span>
                {t('pricing.bestValue')}
              </div>
              
              <h4 className="text-xl font-bold text-white mb-6">{t('pricing.plan1Title')}</h4>
              
              <div className="flex items-baseline gap-1 sm:gap-2 mb-2 whitespace-nowrap">
                <span className="text-gray-400 text-[10px] sm:text-xs">{t('pricing.from')}</span>
                <span className="text-[#FFB800] text-2xl sm:text-3xl font-bold">249€</span>
                <span className="text-gray-400 sm:mx-1">-</span>
                <span className="text-[#FFB800] text-2xl sm:text-3xl font-bold">689€</span>
                <span className="text-gray-400 text-[10px] sm:text-xs">/ {t('pricing.month')}</span>
              </div>
              <p className="text-gray-500 text-xs mb-8">{t('pricing.priceDepends')}</p>

              <ul className="grid grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-3 lg:gap-y-4 mb-10 flex-grow">
                <li className="flex items-center gap-2 lg:gap-3 text-white text-[10px] lg:text-sm font-semibold">
                  <Check size={14} className="text-[#22c55e] shrink-0 lg:w-4 lg:h-4" /> {t('pricing.fullCourse')}
                </li>
                <li className="flex items-center gap-2 lg:gap-3 text-white text-[10px] lg:text-sm font-semibold">
                  <Check size={14} className="text-[#22c55e] shrink-0 lg:w-4 lg:h-4" /> {t('pricing.certification')}
                </li>
                <li className="flex items-center gap-2 lg:gap-3 text-white text-[10px] lg:text-sm font-semibold">
                  <Check size={14} className="text-[#22c55e] shrink-0 lg:w-4 lg:h-4" /> {t('pricing.vehiclesTools')}
                </li>
                <li className="flex items-center gap-2 lg:gap-3 text-white text-[10px] lg:text-sm font-semibold relative group cursor-help">
                  <Check size={14} className="text-[#22c55e] shrink-0 lg:w-4 lg:h-4" /> <u className="decoration-[#FFB800] underline-offset-2 lg:underline-offset-4">{t('pricing.membership')}</u>
                  <div className="absolute bottom-full left-0 mb-2 w-56 bg-[#1a1d21] border border-white/10 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                    <div className="text-xs font-normal text-gray-300 whitespace-pre-line leading-relaxed">
                      {t('pricing.tooltips.membership')}
                    </div>
                  </div>
                </li>
                <li className="flex items-center gap-2 lg:gap-3 text-white text-[10px] lg:text-sm font-semibold relative group cursor-help">
                  <Check size={14} className="text-[#22c55e] shrink-0 lg:w-4 lg:h-4" /> <u className="decoration-[#FFB800] underline-offset-2 lg:underline-offset-4">{t('pricing.workwear')}</u>
                  <div className="absolute bottom-full left-0 mb-2 w-48 bg-[#1a1d21] border border-white/10 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                    <div className="text-xs font-normal text-gray-300 whitespace-pre-line leading-relaxed">
                      {t('pricing.tooltips.workwear')}
                    </div>
                  </div>
                </li>
                <li className="flex items-center gap-2 lg:gap-3 text-white text-[10px] lg:text-sm font-semibold relative group cursor-help">
                  <Check size={14} className="text-[#22c55e] shrink-0 lg:w-4 lg:h-4" /> <u className="decoration-[#FFB800] underline-offset-2 lg:underline-offset-4">{t('pricing.pmSoftware')}</u>
                  <div className="absolute bottom-full left-0 mb-2 w-48 bg-[#1a1d21] border border-white/10 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                    <div className="text-xs font-normal text-gray-300 whitespace-pre-line leading-relaxed">
                      {t('pricing.tooltips.pmSoftware')}
                    </div>
                  </div>
                </li>
                <li className="flex items-center gap-2 lg:gap-3 text-white text-[10px] lg:text-sm font-semibold">
                  <Check size={14} className="text-[#22c55e] shrink-0 lg:w-4 lg:h-4" /> {t('pricing.workshopAccess')}
                </li>
                <li className="flex items-center gap-2 lg:gap-3 text-white text-[10px] lg:text-sm font-semibold relative group cursor-help">
                  <Check size={14} className="text-[#22c55e] shrink-0 lg:w-4 lg:h-4" /> <u className="decoration-[#FFB800] underline-offset-2 lg:underline-offset-4">{t('pricing.jobPlacement')}</u>
                  <div className="absolute bottom-full left-0 mb-2 w-48 bg-[#1a1d21] border border-white/10 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                    <div className="text-xs font-normal text-gray-300 whitespace-pre-line leading-relaxed">
                      {t('pricing.tooltips.jobPlacement')}
                    </div>
                  </div>
                </li>
                <li className="flex items-center gap-2 lg:gap-3 text-white text-[10px] lg:text-sm font-semibold">
                  <Globe size={14} className="text-[#FFB800] shrink-0 lg:w-4 lg:h-4" /> {t('pricing.marketingSupport')}
                </li>
              </ul>

              <button 
                onClick={() => handleSelectPlan('course_vehicle')}
                className="w-full bg-[#FFB800] text-black py-4 rounded-xl font-bold tracking-widest hover:bg-[#FFB800]/90 transition-colors"
              >
                {t('pricing.selectPlan')}
              </button>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-[#15181b] rounded-2xl p-8 border border-white/10 relative flex flex-col"
            >
              <div className="absolute -top-3 left-6 bg-gray-700 text-white text-xs font-bold px-3 py-1 rounded-md flex items-center gap-1">
                 <span className="w-3 h-3 rounded-full border border-white flex items-center justify-center text-[8px]">I</span>
                {t('pricing.independent')}
              </div>
              
              <h4 className="text-xl font-bold text-white mb-6">{t('pricing.plan2Title')}</h4>
              
              <div className="flex flex-wrap items-baseline gap-1 sm:gap-2 mb-2">
                <span className="text-[#FFB800] text-3xl sm:text-4xl font-bold">899€</span>
                <span className="text-gray-400 text-xs sm:text-sm">{t('pricing.oneTime')}</span>
              </div>
              <p className="text-gray-400 text-xs mb-8">{t('pricing.plan2Desc')}</p>

              <ul className="grid grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-3 lg:gap-y-4 mb-10 flex-grow">
                <li className="flex items-center gap-2 lg:gap-3 text-white text-[10px] lg:text-sm font-semibold">
                  <Check size={14} className="text-[#22c55e] shrink-0 lg:w-4 lg:h-4" /> {t('pricing.fullCourse')}
                </li>
                <li className="flex items-center gap-2 lg:gap-3 text-white text-[10px] lg:text-sm font-semibold">
                  <Check size={14} className="text-[#22c55e] shrink-0 lg:w-4 lg:h-4" /> {t('pricing.certification')}
                </li>
                <li className="flex items-center gap-2 lg:gap-3 text-gray-500 text-[10px] lg:text-sm">
                  <X size={14} className="shrink-0 lg:w-4 lg:h-4" /> {t('pricing.noVehicle')}
                </li>
                <li className="flex items-center gap-2 lg:gap-3 text-gray-500 text-[10px] lg:text-sm">
                  <span className="w-3.5 h-3.5 lg:w-4 lg:h-4 rounded-full border border-gray-500 flex items-center justify-center text-[7px] lg:text-[8px] shrink-0">M</span> {t('pricing.noMembership')}
                </li>
                <li className="flex items-center gap-2 lg:gap-3 text-gray-500 text-[10px] lg:text-sm">
                  <X size={14} className="shrink-0 lg:w-4 lg:h-4" /> {t('pricing.noWorkshop')}
                </li>
              </ul>

              <button 
                onClick={() => handleSelectPlan('course_only')}
                className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-xl font-bold tracking-widest hover:bg-white/10 transition-colors"
              >
                {t('pricing.selectPlan')}
              </button>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="text-center mt-4 md:mt-16 text-gray-500 text-sm"
          >
            {t('pricing.selectToContinue')}
          </motion.div>
        </div>
      </div>

      {/* Promo Popup */}
      <AnimatePresence>
        {showPromo && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="relative w-full max-w-md bg-gradient-to-b from-[#1a1d21] to-[#111315] border-2 border-[#FFB800] rounded-2xl shadow-[0_0_50px_rgba(255,184,0,0.15)] p-6 sm:p-8 text-center overflow-hidden"
            >
              {/* Background glow effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-[#FFB800]/10 blur-3xl rounded-full pointer-events-none"></div>

              <button 
                onClick={() => {
                  setShowPromo(false);
                  setHasDismissedPromo(true);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
              >
                <CloseIcon size={20} />
              </button>
              
              <div className="relative z-10 flex flex-col gap-8 sm:gap-12 py-2 sm:py-4">
                {/* Section 1: Courses under Consideration */}
                <div className="relative group/section text-center">
                  <span className="block text-xl md:text-3xl font-black text-[#FFB800] uppercase tracking-tight mb-3 md:mb-4">
                    {t('pricing.promo.underConsideration').includes(':') 
                      ? t('pricing.promo.underConsideration').split(':')[0]
                      : "In Study"}
                  </span>
                  
                  <h4 className="text-white text-base md:text-xl font-black mb-6 md:mb-10 leading-tight uppercase tracking-tight">
                    {(() => {
                      const text = t('pricing.promo.underConsideration').includes(':') 
                        ? t('pricing.promo.underConsideration').split(':').slice(1).join(':').trim()
                        : t('pricing.promo.underConsideration');
                      
                      // Pattern matching to split into requested lines
                      const ampersandSplit = text.split('&');
                      if (ampersandSplit.length >= 2) {
                        const course1 = ampersandSplit[0].trim();
                        const restOfText = ampersandSplit.slice(1).join('&').trim();
                        
                        const dotSplit = restOfText.split('.');
                        if (dotSplit.length >= 1) {
                          const course2 = dotSplit[0].trim();
                          const actionText = dotSplit.slice(1).join('.').trim();
                          
                          return (
                            <div className="flex flex-col items-center gap-0.5 sm:gap-2">
                              <span>{course1}</span>
                              <span className="text-[#FFB800] text-xl md:text-3xl my-0.5 sm:my-1">&</span>
                              <span className="whitespace-nowrap">{course2}.</span>
                              <span className="mt-2 md:mt-4 text-[9px] md:text-xs font-bold text-gray-400 normal-case tracking-widest block opacity-80 italic">
                                {actionText}
                              </span>
                            </div>
                          );
                        }
                      }
                      
                      return text;
                    })()}
                  </h4>
                  
                  <button 
                    onClick={() => {
                      setShowPromo(false);
                      setHasDismissedPromo(true);
                      window.dispatchEvent(new CustomEvent('openNotifyMe'));
                    }}
                    className="w-full bg-[#FFB800] text-black font-black py-4 md:py-6 rounded-xl text-sm md:text-base tracking-[0.2em] uppercase hover:bg-white transition-all shadow-[0_10px_20px_rgba(255,184,0,0.15)] hover:shadow-[0_15px_30px_rgba(255,184,0,0.25)] hover:scale-[1.02] active:scale-95"
                  >
                    {t('pricing.promo.notifyMe')}
                  </button>
                </div>

                {/* Section 2: Open Courses */}
                <div className="relative group/section text-center pt-6 sm:pt-8 border-t border-white/5">
                  <span className="block text-xl md:text-3xl font-black text-[#FFB800] uppercase tracking-tight mb-3 md:mb-4">
                    {t('pricing.promo.openCourses')}
                  </span>
                  
                  <p className="text-white text-base md:text-xl font-black mb-6 md:mb-10 leading-tight uppercase tracking-tight">
                    {t('pricing.promo.exploreNextCourses')}
                  </p>
                  
                  <button 
                    onClick={() => {
                      setShowPromo(false);
                      setHasDismissedPromo(true);
                      scrollTo('next-courses');
                    }}
                    className="w-full bg-white/5 border border-white/20 text-white font-black py-4 md:py-6 rounded-xl text-sm md:text-base tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all hover:scale-[1.02] active:scale-95"
                  >
                    {t('pricing.promo.explore')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Widget (Appears after promo) */}
      <AnimatePresence>
        {hasPromoAppeared && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50"
          >
            <motion.button
              onClick={() => {
                setShowPromo(true);
              }}
              animate={{ 
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 0 0px rgba(255, 184, 0, 0)",
                  "0 0 20px rgba(255, 184, 0, 0.4)",
                  "0 0 0px rgba(255, 184, 0, 0)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="group relative overflow-hidden flex items-center gap-4 px-6 py-3 bg-[#0a0a0a] border border-white/10 border-l-4 border-l-[#FFB800] rounded-r-xl cursor-pointer"
            >
              <div className="flex flex-col items-start text-left relative z-10">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-0.5">
                  {t('pricing.promo.actionRequired')}
                </span>
                <span className="text-sm font-black tracking-widest uppercase text-[#FFB800]">
                  {t('pricing.promo.claim100')}
                </span>
                {t('pricing.promo.ends') && (
                  <span className="text-[8px] font-medium text-gray-400 uppercase tracking-wider mt-0.5">
                    {t('pricing.promo.ends')}
                  </span>
                )}
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

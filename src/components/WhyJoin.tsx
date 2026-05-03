import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle2, Rocket, Send, ChevronDown } from 'lucide-react';
import CertifiedBadge from './CertifiedBadge';
import { useState } from 'react';

export default function WhyJoin() {
  const { t } = useLanguage();
  const [isWhoExpanded, setIsWhoExpanded] = useState(false);
  const [isAccessExpanded, setIsAccessExpanded] = useState(false);
  const [isWhatExpanded, setIsWhatExpanded] = useState(false);

  const whoPoints = [
    t('whyJoin.who5'),
    t('whyJoin.who1'),
    t('whyJoin.who2'),
    t('whyJoin.who3'),
    t('whyJoin.who4'),
    t('whyJoin.who6'),
  ];

  const accessPoints = [
    t('whyJoin.access1'),
    t('whyJoin.access2'),
    t('whyJoin.access3'),
    t('whyJoin.access4'),
    t('whyJoin.access5'),
  ];

  const whatPoints = [
    t('whyJoin.do1'),
    t('whyJoin.do2'),
    t('whyJoin.do3'),
    t('whyJoin.do4'),
    t('whyJoin.do5'),
    t('whyJoin.do6'),
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-[#0a0a0a] border-t border-white/5 lg:border-none">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Background accidental elements - only on desktop for now to keep mobile clean */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#FFB800]/5 blur-[120px] -z-10 animate-pulse hidden lg:block" />
          <div className="absolute bottom-0 left-0 w-1/2 h-full bg-white/5 blur-[120px] -z-10 hidden lg:block" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {/* Section 1: What do we do? (First on Mobile/Tablet, Middle on Desktop) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="p-8 md:p-10 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-[#FFB800]/50 transition-all duration-500 group h-full flex flex-col justify-center md:order-1 lg:order-2"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase mb-0 leading-tight">
                  {t('whyJoin.doTitle')}
                </h2>
                <button 
                  onClick={() => setIsWhatExpanded(!isWhatExpanded)}
                  className="md:hidden flex items-center justify-center w-10 h-10 bg-[#FFB800] text-black rounded-xl transition-all flex-shrink-0 ml-4"
                >
                  <motion.div
                    animate={{ rotate: isWhatExpanded ? 180 : 0 }}
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </button>
              </div>

              <AnimatePresence>
                <motion.div 
                  initial={false}
                  animate={isWhatExpanded ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                  className="overflow-hidden md:!h-auto md:!opacity-100 md:!block md:!overflow-visible"
                  transition={{ duration: 0.3 }}
                >
                  <ul className="space-y-5">
                    {whatPoints.map((point, idx) => (
                      <motion.li 
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-4"
                      >
                        <div className="mt-1 w-5 h-5 rounded-full bg-[#FFB800]/20 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="text-[#FFB800]" size={12} />
                        </div>
                        <span className="text-gray-300 font-medium leading-relaxed text-sm">{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Section 2: Is this for you? (Last on Tablet, First on Desktop) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 md:p-10 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-[#FFB800]/50 transition-all duration-500 group h-full flex flex-col justify-center md:order-3 md:col-span-2 lg:order-1 lg:col-span-1 md:max-w-lg md:mx-auto lg:max-w-none"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase mb-0 leading-tight">
                  {t('whyJoin.whoTitle')}
                </h2>
                <button 
                  onClick={() => setIsWhoExpanded(!isWhoExpanded)}
                  className="md:hidden flex items-center justify-center w-10 h-10 bg-[#FFB800] text-black rounded-xl transition-all flex-shrink-0 ml-4"
                >
                  <motion.div
                    animate={{ rotate: isWhoExpanded ? 180 : 0 }}
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </button>
              </div>
              
              <AnimatePresence>
                <motion.div 
                  initial={false}
                  animate={isWhoExpanded ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                  className="overflow-hidden md:!h-auto md:!opacity-100 md:!block md:!overflow-visible"
                  transition={{ duration: 0.3 }}
                >
                  <ul className="space-y-5">
                    {whoPoints.map((point, idx) => (
                      <motion.li 
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-4"
                      >
                        <div className="mt-1 w-5 h-5 rounded-full bg-[#FFB800]/20 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="text-[#FFB800]" size={12} />
                        </div>
                        <span className="text-gray-300 font-medium leading-relaxed text-sm">{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Section 3: What you get (Second on Tablet, last on Desktop) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 md:p-10 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-[#FFB800]/50 transition-all duration-500 group h-full flex flex-col justify-center md:order-2 lg:order-3"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase mb-0 leading-tight">
                  {t('whyJoin.accessTitle')}
                </h2>
                <button 
                  onClick={() => setIsAccessExpanded(!isAccessExpanded)}
                  className="md:hidden flex items-center justify-center w-10 h-10 bg-[#FFB800] text-black rounded-xl transition-all flex-shrink-0 ml-4"
                >
                  <motion.div
                    animate={{ rotate: isAccessExpanded ? 180 : 0 }}
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </button>
              </div>

              <AnimatePresence>
                <motion.div 
                  initial={false}
                  animate={isAccessExpanded ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                  className="overflow-hidden md:!h-auto md:!opacity-100 md:!block md:!overflow-visible"
                  transition={{ duration: 0.3 }}
                >
                  <ul className="space-y-5">
                    {accessPoints.map((point, idx) => (
                      <motion.li 
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4"
                      >
                        <div className="w-5 h-5 rounded-full bg-[#FFB800]/20 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="text-[#FFB800]" size={12} />
                        </div>
                        <div className="flex items-center gap-4 md:gap-1 lg:gap-4 w-full">
                          <span className="text-gray-300 font-medium leading-relaxed text-sm">{point}</span>
                          {idx === 2 && (
                            <div className="relative w-8 h-0 flex items-center">
                              <motion.div
                                initial={{ scale: 0, rotate: -20 }}
                                whileInView={{ scale: 1, rotate: 15 }}
                                transition={{ 
                                  type: "spring",
                                  stiffness: 260,
                                  damping: 20,
                                  delay: 0.5 
                                }}
                                viewport={{ once: true }}
                                className="absolute left-0"
                              >
                                <CertifiedBadge className="w-8 h-8 drop-shadow-[0_0_10px_rgba(255,184,0,0.4)]" />
                              </motion.div>
                            </div>
                          )}
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Section 3: Summary text split into two cards */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
          >
            {/* Card 1: Pilot Program */}
            <div className="p-8 md:p-12 rounded-[40px] bg-gradient-to-br from-[#111315] to-[#0a0a0a] border border-white/10 overflow-hidden flex flex-col items-center text-center shadow-2xl relative group h-full">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-[#FFB800] rounded-full" />
              <Rocket className="text-[#FFB800] mb-6 group-hover:animate-bounce" size={40} />
              <p className="text-lg md:text-xl text-white font-bold leading-tight mb-8 tracking-tight flex-grow">
                {t('whyJoin.summary1')}
              </p>
              <button 
                onClick={() => {
                  document.getElementById('pilot-program')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full bg-[#FFB800] text-black font-black py-4 rounded-2xl hover:bg-white transition-all transform hover:scale-[1.02] active:scale-95 tracking-widest uppercase text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,184,0,0.2)]"
              >
                {t('whyJoin.applyCTA')}
              </button>
            </div>

            {/* Card 2: Notify Me */}
            <div className="p-8 md:p-12 rounded-[40px] bg-gradient-to-br from-[#111315] to-[#0a0a0a] border border-white/10 overflow-hidden flex flex-col items-center text-center shadow-2xl relative group h-full">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/20 rounded-full" />
              <Send className="text-[#FFB800] mb-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={40} />
              <p className="text-lg md:text-xl text-white font-bold leading-tight mb-8 tracking-tight flex-grow">
                {t('whyJoin.summary2')}
              </p>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('openNotifyMe'))}
                className="w-full bg-white/5 border border-white/10 text-white hover:border-[#FFB800] hover:text-[#FFB800] font-black py-4 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-95 tracking-widest uppercase text-sm flex items-center justify-center gap-2"
              >
                {t('whyJoin.notifyCTA')}
              </button>
            </div>
          </motion.div>
        </div>
    </section>
  );
}

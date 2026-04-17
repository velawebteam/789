import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle2, Rocket, Send } from 'lucide-react';
import CertifiedBadge from './CertifiedBadge';

export default function WhyJoin() {
  const { t } = useLanguage();

  const whoPoints = [
    t('whyJoin.who5'),
    t('whyJoin.who1'),
    t('whyJoin.who2'),
    t('whyJoin.who3'),
    t('whyJoin.who4'),
  ];

  const accessPoints = [
    t('whyJoin.access1'),
    t('whyJoin.access2'),
    t('whyJoin.access3'),
    t('whyJoin.access4'),
    t('whyJoin.access5'),
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-[#0a0a0a]">
      {/* Background accidental elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#FFB800]/5 blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-1/2 h-full bg-white/5 blur-[120px] -z-10" />

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Section 1: Is this for you? */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-[#FFB800]/50 transition-all duration-500 group h-full flex flex-col"
          >
            <h2 className="text-2xl md:text-3xl font-black text-white mb-8 tracking-tight uppercase">
              {t('whyJoin.whoTitle')}
            </h2>
            <ul className="space-y-6">
              {whoPoints.map((point, idx) => (
                <motion.li 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4"
                >
                  <div className="mt-1 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="text-green-500" size={14} />
                  </div>
                  <span className="text-gray-300 font-medium leading-relaxed">{point}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Section 2: What you get */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-[#FFB800]/50 transition-all duration-500 group h-full flex flex-col"
          >
            <h2 className="text-2xl md:text-3xl font-black text-white mb-8 tracking-tight uppercase">
              {t('whyJoin.accessTitle')}
            </h2>
            <ul className="space-y-6">
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
                    <CheckCircle2 className="text-[#FFB800]" size={14} />
                  </div>
                  <div className="flex items-center gap-4 w-full">
                    <span className="text-gray-300 font-medium leading-relaxed">{point}</span>
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
                          <CertifiedBadge className="w-9 h-9 drop-shadow-[0_0_10px_rgba(255,184,0,0.4)]" />
                        </motion.div>
                      </div>
                    )}
                  </div>
                </motion.li>
              ))}
            </ul>
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

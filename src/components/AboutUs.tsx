import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import BrandName from './BrandName';
import CertifiedBadge from './CertifiedBadge';
import { useLanguage } from '../context/LanguageContext';
import MobileCollapsible from './MobileCollapsible';

const Counter = ({ from, to, duration = 2, suffix = '' }: { from: number, to: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        
        // easeOutQuart easing function
        const easeOut = 1 - Math.pow(1 - progress, 4);
        
        setCount(Math.floor(easeOut * (to - from) + from));
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, from, to, duration]);

  return (
    <span ref={ref} translate="no" className="notranslate">
      {count}{suffix}
    </span>
  );
};

export default function AboutUs() {
  const { t } = useLanguage();
  return (
    <section id="about" className="lg:py-32 py-0 bg-[#0a0a0a] relative border-t border-white/5 lg:border-none">
      <MobileCollapsible title={`${t('about.title')} REAL BUILDER`}>
        <div className="max-w-7xl mx-auto px-6 py-8 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-gray-400 text-base leading-relaxed space-y-4"
            >
              <h2 className="hidden lg:block text-2xl font-black text-white tracking-tight uppercase mb-6">
                {t('about.title')} <BrandName />
              </h2>
              <p className="text-white font-bold">
                {t('about.p1')} <BrandName /> {t('about.p1_suffix')}
              </p>
            <p className="text-[#FFB800] italic font-semibold">
              {t('about.mindset')}
            </p>
            <p>
              <BrandName /> {t('about.p2')}
            </p>
            <p className="text-white font-bold">
              {t('about.earnMore')}
            </p>
            <p>
              {t('about.opportunity')}
            </p>
            <p className="text-white font-bold">
              {t('about.joining')} <BrandName />{t('about.joining_suffix')}
            </p>
            <p className="text-[#FFB800] font-bold">
              {t('about.newGen')}
            </p>
            <p className="italic">
              {t('about.traits')}
            </p>
            <p className="text-white font-bold">
              {t('about.notJustWorker')}
            </p>
            <div className="flex flex-col gap-1">
              <p className="text-[#FFB800] font-black text-xl uppercase">
                {t('about.youAre')} <BrandName />.
              </p>
              <p><BrandName /> {t('about.standard')}</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-4 sm:gap-6"
          >
            <div className="bg-[#111315] border border-white/5 rounded-2xl p-4 sm:p-8 flex flex-col items-center justify-center text-center group hover:border-[#FFB800]/30 transition-colors duration-300">
              <div className="text-3xl sm:text-5xl font-black text-white mb-1 sm:mb-2 group-hover:text-[#FFB800] transition-colors duration-300">
                <Counter from={0} to={20} suffix="+" />
              </div>
              <div className="text-gray-500 text-[10px] sm:text-xs font-bold tracking-widest uppercase">{t('about.stats.courses')}</div>
            </div>
            
            <div className="bg-[#111315] border border-white/5 rounded-2xl p-4 sm:p-8 flex flex-col items-center justify-center text-center group hover:border-[#FFB800]/30 transition-colors duration-300 sm:translate-y-8">
              <div className="text-3xl sm:text-5xl font-black text-white mb-1 sm:mb-2 group-hover:text-[#FFB800] transition-colors duration-300">
                <Counter from={0} to={300} suffix="+" />
              </div>
              <div className="text-gray-500 text-[10px] sm:text-xs font-bold tracking-widest uppercase">{t('about.stats.graduates')}</div>
            </div>
            
            <div className="bg-[#111315] border border-white/5 rounded-2xl p-4 sm:p-8 flex flex-col items-center justify-center text-center group hover:border-[#FFB800]/30 transition-colors duration-300">
              <div className="text-3xl sm:text-5xl font-black text-white mb-1 sm:mb-2 group-hover:text-[#FFB800] transition-colors duration-300">
                <Counter from={0} to={93} suffix="%" />
              </div>
              <div className="text-gray-500 text-[10px] sm:text-xs font-bold tracking-widest uppercase">{t('about.stats.jobRate')}</div>
            </div>

            <div className="bg-[#111315] border border-white/5 rounded-2xl p-4 sm:p-8 flex flex-col items-center justify-center text-center group hover:border-[#FFB800]/30 transition-colors duration-300 sm:translate-y-8">
              <div className="text-3xl sm:text-5xl font-black text-white mb-1 sm:mb-2 group-hover:text-[#FFB800] transition-colors duration-300">
                <Counter from={0} to={15} suffix="+" />
              </div>
              <div className="text-gray-500 text-[10px] sm:text-xs font-bold tracking-widest uppercase">{t('about.stats.partners')}</div>
            </div>

            <div className="bg-[#111315] border border-white/5 rounded-2xl p-4 sm:p-8 flex flex-col items-center justify-center text-center group hover:border-[#FFB800]/30 transition-colors duration-300 relative col-span-2 sm:col-span-1">
              <div className="text-3xl sm:text-5xl font-black text-white mb-1 sm:mb-2 group-hover:text-[#FFB800] transition-colors duration-300 flex items-center gap-1">
                <Counter from={0} to={2} />
                <span className="text-sm sm:text-lg uppercase">{t('about.stats.weekends')}</span>
              </div>
              <div className="text-gray-500 text-[10px] sm:text-xs font-bold tracking-widest uppercase leading-tight">
                {t('about.stats.certification')}<br/>{t('about.stats.higherSalary')}
              </div>
              
              {/* Sticker Badge */}
              <div className="absolute -top-1 -right-1 w-12 h-12 sm:w-16 sm:h-16 rotate-12 pointer-events-none">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    filter: [
                      "drop-shadow(0 0 5px rgba(255, 184, 0, 0.3))",
                      "drop-shadow(0 0 15px rgba(255, 184, 0, 0.6))",
                      "drop-shadow(0 0 5px rgba(255, 184, 0, 0.3))"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <CertifiedBadge className="w-full h-full" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      </MobileCollapsible>
    </section>
  );
}

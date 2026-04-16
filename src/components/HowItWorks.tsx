import { UserPlus, BookOpen, Hammer, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import CertifiedBadge from './CertifiedBadge';
import { useLanguage } from '../context/LanguageContext';

export default function HowItWorks() {
  const { t } = useLanguage();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="how-it-works" className="py-16 md:py-32 bg-[#15181b] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            {t('howItWorks.title1')} <span className="text-[#FFB800]">{t('howItWorks.title2')}</span>
          </h2>
          <p className="text-gray-400 text-lg">
            {t('howItWorks.subtitle')}
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute top-[64px] left-[10%] w-[80%] h-[4px] bg-[#FFB800]/30 hidden md:block origin-left z-0"
          ></motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="flex overflow-x-auto md:overflow-visible snap-x snap-mandatory md:grid md:grid-cols-5 gap-8 relative z-10 pt-8 pb-8 md:pt-0 md:pb-0 hide-scrollbar -mx-6 px-6 md:mx-0 md:px-0"
          >
            {/* Step 1 */}
            <motion.div variants={itemVariants} className="flex-none w-[85vw] sm:w-[60vw] md:w-auto snap-center flex flex-col items-center group cursor-pointer">
              <div className="relative mb-6 transition-transform duration-300 group-hover:scale-110">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#111315] border border-[#FFB800]/30 flex items-center justify-center text-[#FFB800] transition-colors duration-300">
                  <UserPlus className="w-8 h-8 md:w-12 md:h-12" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#FFB800] text-black flex items-center justify-center text-xs md:text-sm font-bold shadow-[0_0_15px_rgba(255,184,0,0.5)]">
                  01
                </div>
              </div>
              <h3 className="text-[#FFB800] font-bold text-xl text-center mb-3 transition-colors duration-300">{t('howItWorks.steps.step1.title')}</h3>
              <div className="grid grid-rows-[1fr] md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-in-out w-full">
                <div className="overflow-hidden">
                  <p className="text-gray-400 text-sm text-center px-2 pb-4">
                    {t('howItWorks.steps.step1.desc')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={itemVariants} className="flex-none w-[85vw] sm:w-[60vw] md:w-auto snap-center flex flex-col items-center group cursor-pointer">
              <div className="relative mb-6 transition-transform duration-300 group-hover:scale-110">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#111315] border border-[#FFB800]/30 flex items-center justify-center text-[#FFB800] transition-colors duration-300">
                  <BookOpen className="w-8 h-8 md:w-12 md:h-12" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#FFB800] text-black flex items-center justify-center text-xs md:text-sm font-bold shadow-[0_0_15px_rgba(255,184,0,0.5)]">
                  02
                </div>
              </div>
              <h3 className="text-[#FFB800] font-bold text-xl text-center mb-3 transition-colors duration-300">{t('howItWorks.steps.step2.title')}</h3>
              <div className="grid grid-rows-[1fr] md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-in-out w-full">
                <div className="overflow-hidden">
                  <p className="text-gray-400 text-sm text-center px-2 pb-4">
                    {t('howItWorks.steps.step2.desc')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={itemVariants} className="flex-none w-[85vw] sm:w-[60vw] md:w-auto snap-center flex flex-col items-center group cursor-pointer">
              <div className="relative mb-6 transition-transform duration-300 group-hover:scale-110">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#111315] border border-[#FFB800]/30 flex items-center justify-center text-[#FFB800] transition-colors duration-300">
                  <Hammer className="w-8 h-8 md:w-12 md:h-12" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#FFB800] text-black flex items-center justify-center text-xs md:text-sm font-bold shadow-[0_0_15px_rgba(255,184,0,0.5)]">
                  03
                </div>
              </div>
              <h3 className="text-[#FFB800] font-bold text-xl text-center mb-3 transition-colors duration-300">{t('howItWorks.steps.step3.title')}</h3>
              <div className="grid grid-rows-[1fr] md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-in-out w-full">
                <div className="overflow-hidden">
                  <p className="text-gray-400 text-sm text-center px-2 pb-4">
                    {t('howItWorks.steps.step3.desc')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Step 4 */}
            <motion.div variants={itemVariants} className="flex-none w-[85vw] sm:w-[60vw] md:w-auto snap-center flex flex-col items-center group cursor-pointer">
              <div className="relative mb-6 transition-transform duration-300 group-hover:scale-110">
                <CertifiedBadge className="w-24 h-24 md:w-32 md:h-32 drop-shadow-[0_0_15px_rgba(255,184,0,0.3)] group-hover:drop-shadow-[0_0_25px_rgba(255,184,0,0.5)] transition-all duration-300" />
              </div>
              <h3 className="text-[#FFB800] font-bold text-xl uppercase tracking-wider text-center mb-3">{t('howItWorks.steps.step4.title')}</h3>
              <div className="grid grid-rows-[1fr] md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-in-out w-full">
                <div className="overflow-hidden">
                  <p className="text-gray-400 text-sm text-center px-2 pb-4">
                    {t('howItWorks.steps.step4.desc')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Step 5 */}
            <motion.div variants={itemVariants} className="flex-none w-[85vw] sm:w-[60vw] md:w-auto snap-center flex flex-col items-center group cursor-pointer">
              <div className="relative mb-6 transition-transform duration-300 group-hover:scale-110">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FFB800] text-black text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap z-20 shadow-[0_0_20px_rgba(255,184,0,0.5)]">
                  {t('howItWorks.steps.step5.membersOnly')}
                </div>
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-[#FFB800] overflow-hidden relative z-10 group-hover:shadow-[0_0_30px_rgba(255,184,0,0.4)] transition-shadow duration-300">
                  <img 
                    src="https://lh3.googleusercontent.com/d/1iefT26tARQu5H7tEhmmHCtvf8b8RAlsN" 
                    alt="Vehicle" 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <h3 className="text-[#FFB800] font-bold text-xl uppercase tracking-wider text-center mb-3">{t('howItWorks.steps.step5.title')}</h3>
              <div className="grid grid-rows-[1fr] md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-in-out w-full">
                <div className="overflow-hidden">
                  <p className="text-gray-400 text-sm text-center px-2 pb-4">
                    {t('howItWorks.steps.step5.desc')}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Mobile Swipe Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
            className="flex items-center justify-center gap-2 text-gray-500 text-sm mt-6 md:hidden"
          >
            <span>{t('howItWorks.swipe')}</span>
            <ArrowRight className="w-4 h-4 animate-pulse" />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 md:mt-24 flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
          >
            <motion.button 
              onClick={() => window.dispatchEvent(new CustomEvent('openNotifyMe'))}
              animate={{ 
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 0 0px rgba(255,184,0,0)",
                  "0 0 20px rgba(255,184,0,0.4)",
                  "0 0 0px rgba(255,184,0,0)"
                ]
              }}
              transition={{ 
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group overflow-hidden bg-[#FFB800] text-black px-8 py-4 rounded-lg text-sm font-black tracking-widest transition-colors hover:bg-white w-full sm:w-auto text-center uppercase"
            >
              <span className="relative z-10">{t('howItWorks.getFreeCourse')}</span>
            </motion.button>

            <motion.a 
              href="#courses"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border border-white/20 text-white px-8 py-4 rounded-lg text-sm font-bold tracking-widest transition-colors hover:border-[#FFB800]/50 w-full sm:w-auto text-center uppercase"
            >
              {t('howItWorks.exploreCourses')}
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

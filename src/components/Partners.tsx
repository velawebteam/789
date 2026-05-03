import { Building2, Wrench, HardHat, Truck, ShieldCheck, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Partners() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const partners = [
    { icon: <Building2 size={24} />, name: t('partners.firms') },
    { icon: <Wrench size={24} />, name: t('partners.tools') },
    { icon: <HardHat size={24} />, name: t('partners.safety') },
    { icon: <Truck size={24} />, name: t('partners.materials') },
    { icon: <ShieldCheck size={24} />, name: t('partners.insurance') },
    { icon: <Zap size={24} />, name: t('partners.energy') }
  ];

  const next = () => setCurrentIndex((prev) => (prev + 1) % partners.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + partners.length) % partners.length);

  return (
    <section id="partners" className="py-20 lg:py-32 bg-[#15181b] relative border-t border-white/5 lg:border-none">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
              {t('partners.title')} <span className="text-[#FFB800]">{t('partners.partners')}</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t('partners.subtitle')}
            </p>
          </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-4">
          {partners.map((partner, index) => (
            <div key={index} className="bg-[#1a1d21] rounded-xl p-6 border border-white/5 flex flex-col items-center justify-center gap-4 hover:border-[#FFB800]/30 transition-colors group cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-[#FFB800] group-hover:bg-[#FFB800]/10 transition-colors">
                {partner.icon}
              </div>
              <span className="text-gray-300 text-sm font-bold text-center">{partner.name}</span>
            </div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden relative">
          <div className="flex items-center justify-center min-h-[160px] overflow-hidden">
             <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 50) prev();
                  else if (info.offset.x < -50) next();
                }}
                className="w-full cursor-grab active:cursor-grabbing"
              >
                <div className="bg-[#1a1d21] rounded-2xl p-8 border border-[#FFB800]/30 flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#FFB800]/10 flex items-center justify-center text-[#FFB800]">
                    {partners[currentIndex].icon}
                  </div>
                  <span className="text-white text-lg font-bold text-center">{partners[currentIndex].name}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {partners.map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-[#FFB800] w-4' : 'bg-white/20'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

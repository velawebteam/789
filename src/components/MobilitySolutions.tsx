import { Key, Zap, Car, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function MobilitySolutions() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSelectVehicle = (vehicleId: string) => {
    window.dispatchEvent(new CustomEvent('planSelected', { detail: 'course_vehicle' }));
    window.dispatchEvent(new CustomEvent('vehicleSelected', { detail: vehicleId }));
    
    const element = document.getElementById('contact-form');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  const vehicles = [
    {
      id: 'mobile_toolbox',
      name: t('mobility.toolbox.name'),
      desc: t('mobility.toolbox.desc'),
      price: '249€',
      image: 'https://lh3.googleusercontent.com/d/1n1hlKM4AOQ9g73HteeUgPm0a6KE-W1X7',
      icon: <Key size={12} />
    },
    {
      id: 'electric_3_wheeler',
      name: t('mobility.wheeler.name'),
      desc: t('mobility.wheeler.desc'),
      price: '389€',
      image: 'https://lh3.googleusercontent.com/d/1xVu-eCm-bBAUQMkCPX77Hk40JcpMqs9N',
      icon: <Zap size={12} />
    },
    {
      id: 'tool_buggy',
      name: t('mobility.buggy.name'),
      desc: t('mobility.buggy.desc'),
      price: '489€',
      image: 'https://lh3.googleusercontent.com/d/1-rzX3X8Lf-3bFpC1auxN_RREX_4ldFwa',
      icon: <Car size={12} />,
      popular: true
    },
    {
      id: 'tool_van',
      name: t('mobility.van.name'),
      desc: t('mobility.van.desc'),
      price: '589€',
      image: 'https://lh3.googleusercontent.com/d/1iefT26tARQu5H7tEhmmHCtvf8b8RAlsN',
      icon: <Truck size={12} />
    }
  ];

  const next = () => setCurrentIndex((prev) => (prev + 1) % vehicles.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + vehicles.length) % vehicles.length);

  return (
    <section id="mobility" className="py-10 md:py-20 lg:pt-24 lg:pb-32 bg-[#111315] relative lg:border-none border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative pb-4 md:pb-16 px-0 md:px-16 lg:border-b lg:border-x border-white/5">
            {/* Corner Accents */}
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#FFB800] hidden lg:block"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#FFB800] hidden lg:block"></div>

            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
                {t('mobility.title')} <span className="text-[#FFB800]">{t('mobility.subtitle')}</span>
              </h2>
              <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
                {t('mobility.description')}
              </p>
            </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
            {vehicles.map((vehicle) => (
              <button 
                key={vehicle.id}
                onClick={() => handleSelectVehicle(vehicle.id)}
                className={`bg-[#1a1d21] rounded-2xl overflow-hidden border ${vehicle.popular ? 'border-[#FFB800]/30 lg:-translate-y-2 shadow-[0_0_30px_rgba(255,184,0,0.1)] hover:border-[#FFB800]' : 'border-white/5 hover:border-[#FFB800]/50'} flex flex-col transition-colors text-left w-full cursor-pointer relative`}
              >
                {vehicle.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-[#FFB800] text-black text-[10px] font-bold text-center py-1 z-10 tracking-widest uppercase">
                    {t('mobility.mostPopular')}
                  </div>
                )}
                <div className={`h-48 relative w-full ${vehicle.popular ? 'mt-6' : ''}`}>
                  <img 
                    src={vehicle.image} 
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 flex flex-col items-center text-center flex-grow">
                  <div className="flex items-center gap-2 text-white font-bold mb-2">
                    <div className="w-5 h-5 rounded-full bg-[#FFB800] flex items-center justify-center text-black">
                      {vehicle.icon}
                    </div>
                    {vehicle.name}
                  </div>
                  <div className="text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-6">
                    {vehicle.desc}
                  </div>
                  <div className="mt-auto flex items-baseline gap-1">
                    <span className="text-[#FFB800] text-3xl font-bold">{vehicle.price}</span>
                    <span className="text-gray-500 text-xs">{t('mobility.month')}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden relative px-4">
            <div className="relative">
              {/* Navigation Arrows */}
              <button 
                onClick={prev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20 bg-[#1a1d21] border border-white/10 text-white p-3 rounded-full hover:bg-[#FFB800] hover:text-black transition-colors shadow-lg"
              >
                <ChevronLeft size={24} />
              </button>
              
              <button 
                onClick={next}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20 bg-[#1a1d21] border border-white/10 text-white p-3 rounded-full hover:bg-[#FFB800] hover:text-black transition-colors shadow-lg"
              >
                <ChevronRight size={24} />
              </button>

              <div className="flex items-center justify-center min-h-[340px]">
                <AnimatePresence mode="wait">
                  <motion.button
                    key={vehicles[currentIndex].id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onClick={() => handleSelectVehicle(vehicles[currentIndex].id)}
                    className={`bg-[#1a1d21] rounded-2xl overflow-hidden border ${vehicles[currentIndex].popular ? 'border-[#FFB800]/30 shadow-[0_0_20px_rgba(255,184,0,0.1)]' : 'border-white/5'} flex flex-col transition-colors text-left w-full cursor-pointer relative`}
                  >
                    {vehicles[currentIndex].popular && (
                      <div className="absolute top-0 left-0 right-0 bg-[#FFB800] text-black text-[10px] font-bold text-center py-1 z-10 tracking-widest uppercase">
                        {t('mobility.mostPopular')}
                      </div>
                    )}
                    <div className={`h-44 relative w-full ${vehicles[currentIndex].popular ? 'mt-6' : ''}`}>
                      <img 
                        src={vehicles[currentIndex].image} 
                        alt={vehicles[currentIndex].name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-4 flex flex-col items-center text-center">
                      <div className="flex items-center gap-2 text-white font-bold mb-1">
                        <div className="w-5 h-5 rounded-full bg-[#FFB800] flex items-center justify-center text-black">
                          {vehicles[currentIndex].icon}
                        </div>
                        {vehicles[currentIndex].name}
                      </div>
                      <div className="text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-4">
                        {vehicles[currentIndex].desc}
                      </div>
                      <div className="mt-auto flex items-baseline gap-1">
                        <span className="text-[#FFB800] text-3xl font-bold">{vehicles[currentIndex].price}</span>
                        <span className="text-gray-500 text-xs">{t('mobility.month')}</span>
                      </div>
                    </div>
                  </motion.button>
                </AnimatePresence>
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {vehicles.map((_, i) => (
                <div 
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-[#FFB800] w-4' : 'bg-white/20'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import BrandName from './BrandName';

export default function Hero() {
  const calculateTimeLeft = () => {
    // Target date: April 24, 2026, 18:00:00 Lisbon Time (UTC+1)
    const targetDate = new Date('2026-04-24T18:00:00+01:00');
    const now = new Date().getTime();
    const difference = targetDate.getTime() - now;

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const pad = (num: number) => num.toString().padStart(2, '0');

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-24 md:pt-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 bg-[#0a0a0a]">
        <img 
          src="https://lh3.googleusercontent.com/d/1RTdRHOsWKZsJaji_g81puDUJib-hJKn-" 
          alt="Construction Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-6 w-full pb-10 md:pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-none mb-3 md:mb-4 tracking-tight flex flex-col items-start notranslate" translate="no">
            <div className="relative inline-flex whitespace-nowrap">
              <span>THE REAL</span>
            </div>
            <span className="text-[#FFB800] mt-1 md:mt-2">BUILDER</span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-6 md:mb-8 max-w-xl leading-relaxed">
            The world needs builders. But not just any builders.<br />
            It needs professionals who are skilled, smart, and respected.<br />
            <br className="hidden sm:block" />
            <BrandName /> is the new standard.
          </p>

          {/* Countdown moved here */}
          <div className="mb-6 md:mb-8 flex flex-col gap-3 md:gap-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-2 h-2 rounded-full bg-[#FFB800] animate-pulse" />
              <span className="text-white font-medium tracking-wide text-xs sm:text-sm uppercase">
                {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 
                  ? <span>Registrations are Open!</span> 
                  : (
                    <span>
                      Registrations open at <a href="https://tektonica.fil.pt/" target="_blank" rel="noopener noreferrer" className="text-[#FFB800] hover:underline">Feira Tektónica</a> in
                    </span>
                  )}
              </span>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
              <div className="flex flex-col items-center">
                <span className="text-[#FFB800] text-2xl sm:text-3xl md:text-4xl font-black notranslate" translate="no">{pad(timeLeft.days)}</span>
                <span className="text-gray-400 text-[8px] sm:text-[10px] tracking-widest">DAYS</span>
              </div>
              <span className="text-white/20 text-xl sm:text-2xl font-light pb-2 sm:pb-3">:</span>
              <div className="flex flex-col items-center">
                <span className="text-[#FFB800] text-2xl sm:text-3xl md:text-4xl font-black notranslate" translate="no">{pad(timeLeft.hours)}</span>
                <span className="text-gray-400 text-[8px] sm:text-[10px] tracking-widest">HOURS</span>
              </div>
              <span className="text-white/20 text-xl sm:text-2xl font-light pb-2 sm:pb-3">:</span>
              <div className="flex flex-col items-center">
                <span className="text-[#FFB800] text-2xl sm:text-3xl md:text-4xl font-black notranslate" translate="no">{pad(timeLeft.minutes)}</span>
                <span className="text-gray-400 text-[8px] sm:text-[10px] tracking-widest">MINS</span>
              </div>
              <span className="text-white/20 text-xl sm:text-2xl font-light pb-2 sm:pb-3">:</span>
              <div className="flex flex-col items-center">
                <span className="text-[#FFB800] text-2xl sm:text-3xl md:text-4xl font-black notranslate" translate="no">{pad(timeLeft.seconds)}</span>
                <span className="text-gray-400 text-[8px] sm:text-[10px] tracking-widest">SECS</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full">
            <motion.button 
              onClick={() => scrollTo('courses')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group overflow-hidden border border-white/20 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg text-xs md:text-sm font-bold tracking-wider transition-all hover:border-[#FFB800]/50 w-full sm:w-auto"
            >
              {/* Animated lighting effect */}
              <motion.div 
                animate={{ 
                  left: ['-100%', '200%'] 
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "linear",
                  repeatDelay: 1
                }}
                className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none"
              />
              <span className="relative z-10 uppercase">Explore Courses</span>
            </motion.button>

            <motion.button 
              onClick={() => window.dispatchEvent(new CustomEvent('openNotifyMe'))}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group overflow-hidden bg-[#FFB800] text-black px-6 py-3 md:px-8 md:py-4 rounded-lg text-xs md:text-sm font-bold tracking-wider transition-all hover:bg-[#FFB800]/90 w-full sm:w-auto"
            >
              <span className="relative z-10 uppercase">Notify Me</span>
            </motion.button>
          </div>
        </motion.div>
      </div>


    </section>
  );
}

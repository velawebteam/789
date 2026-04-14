import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import BrandName from './BrandName';
import { useLanguage } from '../context/LanguageContext';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export default function Hero() {
  const { t } = useLanguage();
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

  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // Load YouTube API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      
      playerRef.current = new window.YT.Player('hero-video', {
        events: {
          onReady: (event: any) => {
            if (event.target && typeof event.target.playVideo === 'function') {
              event.target.playVideo();
            }
          },
          onStateChange: (event: any) => {
            const YT = window.YT;
            if (!YT || !event.target || typeof event.target.playVideo !== 'function') return;

            if (event.data === YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
            // Try to resume if paused
            if (event.data === YT.PlayerState.PAUSED) {
              event.target.playVideo();
            }
          }
        }
      });
    };

    window.onYouTubeIframeAPIReady = initPlayer;

    if (window.YT && window.YT.Player) {
      initPlayer();
    }

    return () => {
      // Don't destroy if we want it to keep playing, 
      // but usually we should clean up.
      // However, for a background video, we might just leave it.
    };
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-[#0a0a0a]">
      {/* Background Layer */}
      <div className="absolute top-24 inset-x-0 bottom-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-[#0a0a0a]">
          {/* Poster Image (Visible while video loads) */}
          <div 
            className={`absolute inset-0 w-full h-full bg-cover bg-top transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-0' : 'opacity-100'}`}
            style={{ backgroundImage: 'url(https://img.youtube.com/vi/Mv_X655938Y/maxresdefault.jpg)' }}
          />
          
          <iframe
            id="hero-video"
            src="https://www.youtube.com/embed/Mv_X655938Y?autoplay=1&mute=1&loop=1&playlist=Mv_X655938Y&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1"
            className={`absolute top-0 left-1/2 w-full h-full min-w-[177.77vh] min-h-[56.25vw] -translate-x-1/2 pointer-events-none transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
            allow="autoplay; encrypted-media"
            title="Hero Background Video"
            onLoad={() => setIsVideoLoaded(true)}
          ></iframe>
        </div>
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 w-full pb-10 md:pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-none mb-3 md:mb-4 tracking-tight flex flex-col items-start notranslate" translate="no">
            <div className="relative inline-flex whitespace-nowrap">
              <span>{t('hero.title1')}</span>
            </div>
            <span className="text-[#FFB800] mt-1 md:mt-2">{t('hero.title2')}</span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-6 md:mb-8 max-w-xl leading-relaxed">
            {t('hero.subtitle1')}<br />
            {t('hero.subtitle2')}<br />
            <br className="hidden sm:block" />
            <BrandName /> {t('hero.description')}
          </p>

          {/* Countdown moved here */}
          <div className="mb-6 md:mb-8 flex flex-col gap-3 md:gap-4">
            <div className="flex items-start gap-2 md:gap-3">
              <div className="w-2 h-2 rounded-full bg-[#FFB800] animate-pulse mt-1 md:mt-1.5 flex-shrink-0" />
              <span className="text-white font-medium tracking-wide text-[10px] sm:text-sm uppercase leading-tight">
                {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 
                  ? <span>{t('hero.registrationsOpen')}</span> 
                  : (
                    <span>
                      {t('hero.registrationsOpenAt')} <a href="https://tektonica.fil.pt/" target="_blank" rel="noopener noreferrer" className="text-[#FFB800] hover:underline">Feira Tektónica</a> {t('hero.in')}
                    </span>
                  )}
              </span>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
              <div className="flex flex-col items-center">
                <span className="text-[#FFB800] text-2xl sm:text-3xl md:text-4xl font-black notranslate" translate="no">{pad(timeLeft.days)}</span>
                <span className="text-gray-400 text-[8px] sm:text-[10px] tracking-widest">{t('hero.days')}</span>
              </div>
              <span className="text-white/20 text-xl sm:text-2xl font-light pb-2 sm:pb-3">:</span>
              <div className="flex flex-col items-center">
                <span className="text-[#FFB800] text-2xl sm:text-3xl md:text-4xl font-black notranslate" translate="no">{pad(timeLeft.hours)}</span>
                <span className="text-gray-400 text-[8px] sm:text-[10px] tracking-widest">{t('hero.hours')}</span>
              </div>
              <span className="text-white/20 text-xl sm:text-2xl font-light pb-2 sm:pb-3">:</span>
              <div className="flex flex-col items-center">
                <span className="text-[#FFB800] text-2xl sm:text-3xl md:text-4xl font-black notranslate" translate="no">{pad(timeLeft.minutes)}</span>
                <span className="text-gray-400 text-[8px] sm:text-[10px] tracking-widest">{t('hero.mins')}</span>
              </div>
              <span className="text-white/20 text-xl sm:text-2xl font-light pb-2 sm:pb-3">:</span>
              <div className="flex flex-col items-center">
                <span className="text-[#FFB800] text-2xl sm:text-3xl md:text-4xl font-black notranslate" translate="no">{pad(timeLeft.seconds)}</span>
                <span className="text-gray-400 text-[8px] sm:text-[10px] tracking-widest">{t('hero.secs')}</span>
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
              <span className="relative z-10 uppercase">{t('hero.exploreCourses')}</span>
            </motion.button>

            <motion.button 
              onClick={() => window.dispatchEvent(new CustomEvent('openNotifyMe'))}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group overflow-hidden bg-[#FFB800] text-black px-6 py-3 md:px-8 md:py-4 rounded-lg text-xs md:text-sm font-bold tracking-wider transition-all hover:bg-[#FFB800]/90 w-full sm:w-auto"
            >
              <span className="relative z-10 uppercase">{t('hero.notifyMe')}</span>
            </motion.button>
          </div>
        </motion.div>
      </div>


    </section>
  );
}

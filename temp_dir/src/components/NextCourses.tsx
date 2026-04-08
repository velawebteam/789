import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import BrandName from './BrandName';

export default function NextCourses() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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

  useEffect(() => {
    if (isCalendarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCalendarOpen]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: id === 'contact-form' ? 'center' : 'start'
      });
    }
  };

  const openNotifyMe = () => {
    window.dispatchEvent(new CustomEvent('openNotifyMe'));
  };

  return (
    <section className="pt-8 pb-20 bg-[#15181b] relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-widest">
            NEXT COURSES
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Course Card 1 */}
          <div className="p-8 relative flex flex-col h-full bg-[#1a1d21] rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/20 text-[#FFB800] text-xs font-medium mb-6 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] animate-pulse"></span>
              {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 
                ? <span>Registrations Are Open</span> 
                : <span>Registration Opens In</span>}
            </div>
            <div className="text-[#FFB800] text-xs font-bold tracking-widest uppercase mb-2">IMPORTANT START</div>
            <h3 className="text-2xl font-bold text-white mb-8">Registration Start</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-gray-500 text-sm">Date</span>
                <span className="text-white text-sm font-medium">April 24, 2026</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-gray-500 text-sm">Time</span>
                <span className="text-white text-sm font-medium">18:00 (Lisbon Time)</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-gray-500 text-sm">Location</span>
                <span className="text-white text-xs sm:text-sm font-medium text-right max-w-[60%] sm:max-w-none">Feira Tektónica - Parque Das Nações - Lisbon</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-2 md:gap-3 w-full justify-between">
                  <div className="flex flex-col items-center">
                    <span className="text-[#FFB800] text-xl font-black" translate="no">{pad(timeLeft.days)}</span>
                    <span className="text-gray-400 text-[8px] tracking-widest">DAYS</span>
                  </div>
                  <span className="text-white/20 text-xl font-light pb-2">:</span>
                  <div className="flex flex-col items-center">
                    <span className="text-[#FFB800] text-xl font-black" translate="no">{pad(timeLeft.hours)}</span>
                    <span className="text-gray-400 text-[8px] tracking-widest">HOURS</span>
                  </div>
                  <span className="text-white/20 text-xl font-light pb-2">:</span>
                  <div className="flex flex-col items-center">
                    <span className="text-[#FFB800] text-xl font-black" translate="no">{pad(timeLeft.minutes)}</span>
                    <span className="text-gray-400 text-[8px] tracking-widest">MINS</span>
                  </div>
                  <span className="text-white/20 text-xl font-light pb-2">:</span>
                  <div className="flex flex-col items-center">
                    <span className="text-[#FFB800] text-xl font-black" translate="no">{pad(timeLeft.seconds)}</span>
                    <span className="text-gray-400 text-[8px] tracking-widest">SECS</span>
                  </div>
                </div>
              </div>
            </div>

            <motion.button 
              onClick={openNotifyMe}
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-full bg-white text-black hover:bg-[#FFB800] py-3.5 rounded-xl font-bold text-sm tracking-wide transition-colors mt-auto"
            >
              NOTIFY ME
            </motion.button>
          </div>

          {/* Calendar Widget */}
          <div className="p-8 relative flex flex-col h-full bg-[#1a1d21] rounded-2xl border border-white/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-white">Course Calendar</h3>
              <button 
                onClick={() => setIsCalendarOpen(true)}
                className="text-[#FFB800] hover:text-white text-xs font-bold tracking-widest uppercase transition-colors"
              >
                EXPAND
              </button>
            </div>

            {/* Compact Upcoming Dates List */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="text-center min-w-[48px]">
                  <div className="text-[#FFB800] text-[10px] font-bold uppercase">Apr</div>
                  <div className="text-white text-xl font-black">23</div>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div>
                  <div className="text-white font-bold text-sm">Opening of the "Feira Tektónica"</div>
                  <div className="text-gray-400 text-xs mt-0.5">Parque Das Nações - Lisbon</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#FFB800]/5 border border-[#FFB800]/10">
                <div className="text-center min-w-[48px]">
                  <div className="text-[#FFB800] text-[10px] font-bold uppercase">Apr</div>
                  <div className="text-white text-xl font-black">24</div>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div>
                  <div className="text-white font-bold text-sm">Registration Start</div>
                  <div className="text-gray-400 text-xs mt-0.5">18:00 Lisbon Time</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="text-center min-w-[48px]">
                  <div className="text-[#FFB800] text-[10px] font-bold uppercase">May</div>
                  <div className="text-white text-xl font-black">22</div>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div>
                  <div className="text-white font-bold text-sm">First 2 Courses</div>
                  <div className="text-gray-400 text-xs mt-0.5 italic">To be defined</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="text-center min-w-[48px]">
                  <div className="text-[#FFB800] text-[10px] font-bold uppercase">Jun</div>
                  <div className="text-white text-xl font-black">26</div>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div>
                  <div className="text-white font-bold text-sm">Next 2 Courses</div>
                  <div className="text-gray-400 text-xs mt-0.5 italic">To be defined</div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsCalendarOpen(true)}
              className="w-full border border-white/10 text-white hover:bg-white/5 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-colors mt-auto"
            >
              VIEW ALL DATES
            </button>
          </div>
        </div>
      </div>
      
      {/* Bottom Yellow border accent */}
      <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-[#FFB800]/30"></div>

      {/* Full Calendar Modal */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111315] border border-white/10 rounded-none w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 md:p-8 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-white tracking-tight">Full Course Calendar</h3>
                  <p className="text-gray-500 text-sm mt-1">Upcoming dates for all{' '}<BrandName />{' '}certifications</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCalendarOpen(false)}
                className="text-gray-500 hover:text-white transition-colors p-2"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-4 md:p-8 overflow-y-auto flex-1">
              <div className="space-y-12">
                {/* April */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 tracking-widest uppercase mb-6 flex items-center gap-4">
                    April 2026
                    <span className="h-[1px] flex-1 bg-white/10"></span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-white/10 p-6 flex gap-6 hover:border-white/30 transition-colors">
                      <div className="text-center min-w-[60px] flex flex-col justify-center border-r border-white/10 pr-6">
                        <div className="text-xs font-bold text-gray-500 uppercase">APR</div>
                        <div className="text-2xl font-black text-white leading-none mt-2">23</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-bold tracking-widest uppercase mb-2">Event</div>
                        <div className="text-white font-semibold mb-2">Opening of the "Feira Tektónica"</div>
                        <div className="text-gray-400 text-xs">Parque Das Nações - Lisbon</div>
                      </div>
                    </div>

                    <div className="border-2 border-[#FFB800] p-6 flex gap-6 bg-[#FFB800]/5 transition-colors">
                      <div className="text-center min-w-[60px] flex flex-col justify-center border-r border-white/10 pr-6">
                        <div className="text-xs font-bold text-[#FFB800] uppercase">APR</div>
                        <div className="text-2xl font-black text-white leading-none mt-2">24</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#FFB800] font-bold tracking-widest uppercase mb-2">Start</div>
                        <div className="text-white font-semibold mb-2">Registration Start</div>
                        <div className="text-gray-400 text-xs">18:00 Lisbon Time</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* May */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 tracking-widest uppercase mb-6 flex items-center gap-4">
                    May 2026
                    <span className="h-[1px] flex-1 bg-white/10"></span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-white/10 p-6 flex gap-6 hover:border-white/30 transition-colors">
                      <div className="text-center min-w-[60px] flex flex-col justify-center border-r border-white/10 pr-6">
                        <div className="text-xs font-bold text-gray-500 uppercase">MAY</div>
                        <div className="text-2xl font-black text-white leading-none mt-2">22</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-bold tracking-widest uppercase mb-2">New Season</div>
                        <div className="text-white font-semibold mb-2">First 2 Courses Start</div>
                        <div className="text-gray-400 text-xs italic">To be defined</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* June */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 tracking-widest uppercase mb-6 flex items-center gap-4">
                    June 2026
                    <span className="h-[1px] flex-1 bg-white/10"></span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-white/10 p-6 flex gap-6 hover:border-white/30 transition-colors">
                      <div className="text-center min-w-[60px] flex flex-col justify-center border-r border-white/10 pr-6">
                        <div className="text-xs font-bold text-gray-500 uppercase">JUN</div>
                        <div className="text-2xl font-black text-white leading-none mt-2">26</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-bold tracking-widest uppercase mb-2">Next Phase</div>
                        <div className="text-white font-semibold mb-2">Next 2 Courses Start</div>
                        <div className="text-gray-400 text-xs italic">To be defined</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

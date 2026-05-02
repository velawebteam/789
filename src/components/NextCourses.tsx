import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import BrandName from './BrandName';
import { useLanguage } from '../context/LanguageContext';
import NextCoursesNotifyModal from './NextCoursesNotifyModal';
import ImageModal from './ImageModal';

export default function NextCourses() {
  const { t, language } = useLanguage();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const calculateTimeLeft = (target: string) => {
    const targetDate = new Date(target);
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

  const timer1Date = '2026-05-29T18:00:00+01:00';
  const timer2Date = '2026-06-26T18:00:00+01:00';

  const [timeLeft1, setTimeLeft1] = useState(calculateTimeLeft(timer1Date));
  const [timeLeft2, setTimeLeft2] = useState(calculateTimeLeft(timer2Date));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft1(calculateTimeLeft(timer1Date));
      setTimeLeft2(calculateTimeLeft(timer2Date));
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

  const openNotifyMe = () => {
    setIsNotifyModalOpen(true);
  };

  const courseImages = [
    { src: "https://drive.google.com/thumbnail?id=1gG3lAZPRBMk0I_2RzcDnH8xODWFl2Rhy&sz=w2000", alt: "Pladur (RB1) Dossier" },
    { src: "https://drive.google.com/thumbnail?id=1GzJamMRDXS75wdnRmofb28Q7FU-5zWi5&sz=w2000", alt: "RB Dossier Part 2" },
    { src: "https://drive.google.com/thumbnail?id=1YJUQdFmVRfXmfa8G78TXv2J2Y9Ln4FUG&sz=w2000", alt: "RB Dossier Part 3" },
    { src: "https://drive.google.com/thumbnail?id=1R4-vqt7SZhV9mS83GkqE-f39IaWrg7HD&sz=w2000", alt: "RB Dossier Part 4" },
    { src: "https://drive.google.com/thumbnail?id=13PS9DaSRgwrME2S0x5PttEJKiesygC9a&sz=w2000", alt: "RB Dossier Part 5" }
  ];

  const [initialImageIndex, setInitialImageIndex] = useState(0);

  const openImageModal = (index: number) => {
    setInitialImageIndex(index);
    setIsImageModalOpen(true);
  };

  return (
    <section id="next-courses" className="pt-8 pb-20 bg-[#15181b] relative text-left">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-widest">
            {t('nextCourses.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Course Card 1 */}
          <div className="p-8 relative flex flex-col h-full bg-[#1a1d21] rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/20 text-[#FFB800] text-xs font-medium mb-6 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] animate-pulse"></span>
              <span>{t('nextCourses.registrationsOpen')}</span> 
            </div>
            <div className="text-[#FFB800] text-xs font-bold tracking-widest uppercase mb-2">{t('nextCourses.importantStart')}</div>
            <h3 className="text-2xl font-bold text-white mb-8 leading-tight">{t('nextCourses.firstCoursesStart')}</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-gray-500 text-sm">{t('nextCourses.date')}</span>
                <span className="text-white text-sm font-medium">{language === 'pt' ? '29 de maio, 2026' : 'May 29, 2026'}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-gray-500 text-sm">{t('nextCourses.spotsAvailable')}</span>
                <span className="text-white text-sm font-medium">{t('nextCourses.slots')}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-gray-500 text-sm">{t('nextCourses.firstInfos')}</span>
                <span className="text-white text-sm font-medium">
                  {language === 'pt' ? (
                    <motion.span
                      animate={{ 
                        opacity: [1, 0.8, 1],
                        textShadow: [
                          "0 0 0px rgba(255,184,0,0)",
                          "0 0 12px rgba(255,184,0,0.6)",
                          "0 0 0px rgba(255,184,0,0)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="inline-block text-[#FFB800]"
                    >
                      2 de maio 15:00
                    </motion.span>
                  ) : language === 'hi' ? (
                    <motion.span
                      animate={{ 
                        opacity: [1, 0.8, 1],
                        textShadow: [
                          "0 0 0px rgba(255,184,0,0)",
                          "0 0 12px rgba(255,184,0,0.6)",
                          "0 0 0px rgba(255,184,0,0)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="inline-block text-[#FFB800]"
                    >
                      2 मई 15:00
                    </motion.span>
                  ) : (
                    <motion.span
                      animate={{ 
                        opacity: [1, 0.8, 1],
                        textShadow: [
                          "0 0 0px rgba(255,184,0,0)",
                          "0 0 12px rgba(255,184,0,0.6)",
                          "0 0 0px rgba(255,184,0,0)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="inline-block text-[#FFB800]"
                    >
                      May 2, 15:00
                    </motion.span>
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-gray-500 text-sm">{t('nextCourses.enrolmentStart')}</span>
                <span className="text-white text-sm font-medium">{language === 'pt' ? '5 de maio 20:00' : 'May 5, 20:00'}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-2 md:gap-3 w-full justify-between">
                  <div className="flex flex-col items-center">
                    <span className="text-[#FFB800] text-xl font-black" translate="no">{pad(timeLeft1.days)}</span>
                    <span className="text-gray-400 text-[8px] tracking-widest">{t('nextCourses.days')}</span>
                  </div>
                  <span className="text-white/20 text-xl font-light pb-2">:</span>
                  <div className="flex flex-col items-center">
                    <span className="text-[#FFB800] text-xl font-black" translate="no">{pad(timeLeft1.hours)}</span>
                    <span className="text-gray-400 text-[8px] tracking-widest">{t('nextCourses.hours')}</span>
                  </div>
                  <span className="text-white/20 text-xl font-light pb-2">:</span>
                  <div className="flex flex-col items-center">
                    <span className="text-[#FFB800] text-xl font-black" translate="no">{pad(timeLeft1.minutes)}</span>
                    <span className="text-gray-400 text-[8px] tracking-widest">{t('nextCourses.mins')}</span>
                  </div>
                  <span className="text-white/20 text-xl font-light pb-2">:</span>
                  <div className="flex flex-col items-center">
                    <span className="text-[#FFB800] text-xl font-black" translate="no">{pad(timeLeft1.seconds)}</span>
                    <span className="text-gray-400 text-[8px] tracking-widest">{t('nextCourses.secs')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <motion.button 
                onClick={() => openImageModal(0)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 border border-white/20 text-white hover:bg-white/5 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-colors"
              >
                {t('nextCourses.learnMore')}
              </motion.button>
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
                className="flex-1 bg-white text-black hover:bg-[#FFB800] py-3.5 rounded-xl font-bold text-sm tracking-wide transition-colors"
              >
                {t('nextCourses.notifyMe')}
              </motion.button>
            </div>
          </div>

          {/* Course Card 2 - Servant Pro */}
          <div className="p-8 relative flex flex-col h-full bg-[#1a1d21] rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/20 text-[#FFB800] text-xs font-medium mb-6 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] animate-pulse"></span>
              <span>{t('nextCourses.registrationsOpen')}</span> 
            </div>
            <div className="text-[#FFB800] text-xs font-bold tracking-widest uppercase mb-2">{t('nextCourses.importantStart')}</div>
            <h3 className="text-2xl font-bold text-white mb-8 leading-tight">{t('nextCourses.nextCoursesStart')}</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-gray-500 text-sm">{t('nextCourses.date')}</span>
                <span className="text-white text-sm font-medium">{language === 'pt' ? '26 de junho, 2026' : 'June 26, 2026'}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-gray-500 text-sm">{t('nextCourses.spotsAvailable')}</span>
                <span className="text-white text-sm font-medium">{t('nextCourses.slots')}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-gray-500 text-sm">{t('nextCourses.firstInfos')}</span>
                <span className="text-white text-sm font-medium">{language === 'pt' ? '16 de maio' : 'May 16'}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-gray-500 text-sm">{t('nextCourses.enrolmentStart')}</span>
                <span className="text-white text-sm font-medium">{language === 'pt' ? '23 de maio' : 'May 23'}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-2 md:gap-3 w-full justify-between">
                  <div className="flex flex-col items-center">
                    <span className="text-[#FFB800] text-xl font-black" translate="no">{pad(timeLeft2.days)}</span>
                    <span className="text-gray-400 text-[8px] tracking-widest">{t('nextCourses.days')}</span>
                  </div>
                  <span className="text-white/20 text-xl font-light pb-2">:</span>
                  <div className="flex flex-col items-center">
                    <span className="text-[#FFB800] text-xl font-black" translate="no">{pad(timeLeft2.hours)}</span>
                    <span className="text-gray-400 text-[8px] tracking-widest">{t('nextCourses.hours')}</span>
                  </div>
                  <span className="text-white/20 text-xl font-light pb-2">:</span>
                  <div className="flex flex-col items-center">
                    <span className="text-[#FFB800] text-xl font-black" translate="no">{pad(timeLeft2.minutes)}</span>
                    <span className="text-gray-400 text-[8px] tracking-widest">{t('nextCourses.mins')}</span>
                  </div>
                  <span className="text-white/20 text-xl font-light pb-2">:</span>
                  <div className="flex flex-col items-center">
                    <span className="text-[#FFB800] text-xl font-black" translate="no">{pad(timeLeft2.seconds)}</span>
                    <span className="text-gray-400 text-[8px] tracking-widest">{t('nextCourses.secs')}</span>
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
              {t('nextCourses.notifyMe')}
            </motion.button>
          </div>

          {/* Calendar Widget */}
          <div className="p-8 relative flex flex-col h-full bg-[#1a1d21] rounded-2xl border border-white/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-white">{t('nextCourses.calendarTitle')}</h3>
              <button 
                onClick={() => setIsCalendarOpen(true)}
                className="text-[#FFB800] hover:text-white text-xs font-bold tracking-widest uppercase transition-colors"
              >
                {t('nextCourses.expand')}
              </button>
            </div>

            {/* Compact Upcoming Dates List */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#FFB800]/5 border border-[#FFB800]/10">
                <div className="text-center min-w-[48px]">
                  <div className="text-[#FFB800] text-[10px] font-bold uppercase">May</div>
                  <div className="text-white text-xl font-black">29</div>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div>
                  <div className="text-white font-bold text-sm">{t('nextCourses.firstCourses')}</div>
                  <div className="text-gray-400 text-[10px] mt-0.5">{t('nextCourses.slots')}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="text-center min-w-[48px]">
                  <div className="text-[#FFB800] text-[10px] font-bold uppercase">Jun</div>
                  <div className="text-white text-xl font-black">26</div>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div>
                  <div className="text-white font-bold text-sm">{t('nextCourses.nextCourses')}</div>
                  <div className="text-gray-400 text-[10px] mt-0.5">{t('nextCourses.slots')}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="text-center min-w-[48px]">
                  <div className="text-[#FFB800] text-[10px] font-bold uppercase">Jun</div>
                  <div className="text-white text-xl font-black">26</div>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div>
                  <div className="text-white font-bold text-sm whitespace-pre-line">{t('nextCourses.toBeDefined')}</div>
                  <div className="text-gray-400 text-[10px] mt-0.5">{t('nextCourses.slots')}</div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsCalendarOpen(true)}
              className="w-full border border-white/10 text-white hover:bg-white/5 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-colors mt-auto"
            >
              {t('nextCourses.viewAllDates')}
            </button>
          </div>
        </div>
      </div>
      
      {/* Bottom Yellow border accent */}
      <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-[#FFB800]/30"></div>

      {/* Specific Modal for Next Courses */}
      <NextCoursesNotifyModal 
        isOpen={isNotifyModalOpen} 
        onClose={() => setIsNotifyModalOpen(false)} 
      />

      <ImageModal 
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        images={courseImages}
        initialIndex={initialImageIndex}
      />

      {/* Full Calendar Modal */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111315] border border-white/10 rounded-none w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 md:p-8 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-white tracking-tight">{t('nextCourses.fullCalendar')}</h3>
                  <p className="text-gray-500 text-sm mt-1">{t('nextCourses.upcomingDates')}{' '}<BrandName />{' '}{t('nextCourses.certifications')}</p>
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
                {/* May */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 tracking-widest uppercase mb-6 flex items-center gap-4">
                    {t('nextCourses.may2026')}
                    <span className="h-[1px] flex-1 bg-white/10"></span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border-2 border-[#FFB800] p-6 flex gap-6 bg-[#FFB800]/5 transition-colors">
                      <div className="text-center min-w-[60px] flex flex-col justify-center border-r border-white/10 pr-6">
                        <div className="text-xs font-bold text-[#FFB800] uppercase">MAY</div>
                        <div className="text-2xl font-black text-white leading-none mt-2">29</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-[#FFB800] font-bold tracking-widest uppercase mb-2">{t('nextCourses.newSeason')}</div>
                        <div className="text-white font-semibold mb-2">{t('nextCourses.firstCoursesStart')}</div>
                        <div className="space-y-1 mt-3">
                          <div className="text-[#FFB800] text-[10px] font-bold uppercase tracking-wider">{t('nextCourses.slots')}</div>
                          <div className="text-gray-400 text-[11px]">
                            {t('nextCourses.firstInfo', { date: '' })}
                            {language === 'pt' ? (
                              <motion.span
                                animate={{ 
                                  opacity: [1, 0.8, 1],
                                  textShadow: [
                                    "0 0 0px rgba(255,184,0,0)",
                                    "0 0 12px rgba(255,184,0,0.6)",
                                    "0 0 0px rgba(255,184,0,0)"
                                  ]
                                }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="inline-block ml-1 text-[#FFB800]"
                              >
                                2 de maio 15:00
                              </motion.span>
                            ) : language === 'hi' ? (
                              <motion.span
                                animate={{ 
                                  opacity: [1, 0.8, 1],
                                  textShadow: [
                                    "0 0 0px rgba(255,184,0,0)",
                                    "0 0 12px rgba(255,184,0,0.6)",
                                    "0 0 0px rgba(255,184,0,0)"
                                  ]
                                }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="inline-block ml-1 text-[#FFB800]"
                              >
                                2 मई 15:00
                              </motion.span>
                            ) : (
                              <motion.span
                                animate={{ 
                                  opacity: [1, 0.8, 1],
                                  textShadow: [
                                    "0 0 0px rgba(255,184,0,0)",
                                    "0 0 12px rgba(255,184,0,0.6)",
                                    "0 0 0px rgba(255,184,0,0)"
                                  ]
                                }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="inline-block ml-1 text-[#FFB800]"
                              >
                                May 2, 15:00
                              </motion.span>
                            )}
                          </div>
                          <div className="text-gray-400 text-[11px] font-medium">{t('nextCourses.enrollmentOpen', { date: language === 'pt' ? '5 de maio 20:00' : language === 'hi' ? '5 मई 20:00' : 'May 5, 20:00' })}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* June */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 tracking-widest uppercase mb-6 flex items-center gap-4">
                    {t('nextCourses.june2026')}
                    <span className="h-[1px] flex-1 bg-white/10"></span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-white/10 p-6 flex gap-6 hover:border-white/30 transition-colors">
                      <div className="text-center min-w-[60px] flex flex-col justify-center border-r border-white/10 pr-6">
                        <div className="text-xs font-bold text-gray-500 uppercase">JUN</div>
                        <div className="text-2xl font-black text-white leading-none mt-2">26</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 font-bold tracking-widest uppercase mb-2">{t('nextCourses.nextPhase')}</div>
                        <div className="text-white font-semibold mb-2">{t('nextCourses.nextCoursesStart')}</div>
                        <div className="space-y-1 mt-3">
                          <div className="text-[#FFB800] text-[10px] font-bold uppercase tracking-wider">{t('nextCourses.slots')}</div>
                          <div className="text-gray-400 text-[11px]">{t('nextCourses.firstInfo', { date: language === 'pt' ? '16 de maio' : language === 'hi' ? '16 मई' : 'May 16' })}</div>
                          <div className="text-gray-400 text-[11px] font-medium">{t('nextCourses.enrollmentOpen', { date: language === 'pt' ? '23 de maio' : language === 'hi' ? '23 मई' : 'May 23' })}</div>
                        </div>
                      </div>
                    </div>

                    <div className="border border-white/10 p-6 flex gap-6 hover:border-white/30 transition-colors">
                      <div className="text-center min-w-[60px] flex flex-col justify-center border-r border-white/10 pr-6">
                        <div className="text-xs font-bold text-gray-500 uppercase">JUN</div>
                        <div className="text-2xl font-black text-white leading-none mt-2">26</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 font-bold tracking-widest uppercase mb-2">{t('nextCourses.nextPhase')}</div>
                        <div className="text-white font-semibold mb-2 whitespace-pre-line">{t('nextCourses.toBeDefined')}</div>
                        <div className="space-y-1 mt-3">
                          <div className="text-[#FFB800] text-[10px] font-bold uppercase tracking-wider">{t('nextCourses.slots')}</div>
                          <div className="text-gray-400 text-[11px]">{t('nextCourses.firstInfo', { date: language === 'pt' ? '16 de maio' : language === 'hi' ? '16 मई' : 'May 16' })}</div>
                          <div className="text-gray-400 text-[11px] font-medium">{t('nextCourses.enrollmentOpen', { date: language === 'pt' ? '23 de maio' : language === 'hi' ? '23 मई' : 'May 23' })}</div>
                        </div>
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

import { X, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';
import { COURSES_LIST } from '../constants/courses';
import { useLanguage } from '../context/LanguageContext';
import { useCookieConsent } from '../context/CookieContext';

const coursesList = COURSES_LIST.map(course => ({
  id: course.id,
  name: course.name
}));

interface NotifyMeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotifyMeModal({ isOpen, onClose }: NotifyMeModalProps) {
  const { t } = useLanguage();
  const { consent, acceptCookies } = useCookieConsent();
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [experience, setExperience] = useState('');
  const [needsAssistance, setNeedsAssistance] = useState(false);

  const handleCourseToggle = (courseId: string) => {
    setSelectedCourses(prev => {
      if (prev.includes(courseId)) {
        return prev.filter(id => id !== courseId);
      }
      if (prev.length < 2) {
        return [...prev, courseId];
      }
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    formData.append('coursesOfInterest', selectedCourses.join(', '));
    
    try {
      await fetch('https://formspree.io/f/mbdppqob', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting the form. Please try again.');
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`relative w-full max-w-lg bg-[#15181b] border border-white/10 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden transition-all duration-300 ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20 bg-[#1a1d21] p-2 rounded-full"
        >
          <X size={20} />
        </button>
        
        <div className="p-6 md:p-8 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {!isSubmitted ? (
                <>
                  <div className="text-center mb-8">
                  <motion.div 
                    animate={{ rotate: [-15, 15, -15] }}
                    transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 bg-[#FFB800]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#FFB800]/20"
                  >
                    <Bell className="text-[#FFB800]" size={32} />
                  </motion.div>
                  <h3 className="text-2xl font-black text-white mb-2 tracking-tight uppercase notranslate" translate="no">
                    {t('notify.title')}
                  </h3>
                  <p className="text-[#FFB800] text-sm font-bold mb-2 uppercase tracking-wider">
                    {t('notify.subtitle')}
                  </p>
                  <p className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black py-1 px-3 rounded-full inline-block mb-3 uppercase tracking-widest animate-pulse">
                    {t('notify.nonBindingOffer')}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {t('notify.desc')}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-1">{t('notify.firstName')}</label>
                      <input 
                        type="text" 
                        name="firstName"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] transition-colors text-sm"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-1">{t('notify.lastName')}</label>
                      <input 
                        type="text" 
                        name="lastName"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] transition-colors text-sm"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-1">{t('notify.phone')}</label>
                      <input 
                        type="tel" 
                        name="phone"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] transition-colors text-sm"
                        placeholder="+351 900 000 000"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-1">{t('notify.city')}</label>
                      <input 
                        type="text" 
                        name="city"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] transition-colors text-sm"
                        placeholder="Lisbon"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-1">{t('notify.email')}</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] transition-colors text-sm"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-1">{t('notify.experience')}</label>
                    <select 
                      name="experience"
                      required
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full bg-[#1a1d21] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] transition-colors text-sm appearance-none"
                    >
                      <option value="" disabled>{t('notify.selectExperience')}</option>
                      <option value="less_than_1">{t('notify.expLess1')}</option>
                      <option value="1_to_2">{t('notify.exp1to2')}</option>
                      <option value="3_to_5">{t('notify.exp3to5')}</option>
                      <option value="5_plus">{t('notify.exp5plus')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-2">
                      {t('notify.coursesInterest')}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {coursesList.map(course => {
                        const isSelected = selectedCourses.includes(course.id);
                        const isDisabled = !isSelected && selectedCourses.length >= 2;
                        
                          return (
                            <motion.button
                              key={course.id}
                              type="button"
                              onClick={() => handleCourseToggle(course.id)}
                              disabled={isDisabled}
                              whileHover={!isDisabled ? { scale: 1.05 } : {}}
                              whileTap={!isDisabled ? { scale: 0.95 } : {}}
                              animate={isSelected ? { 
                                scale: [1, 1.05, 1],
                                boxShadow: [
                                  "0 0 0px rgba(255, 184, 0, 0)",
                                  "0 0 15px rgba(255, 184, 0, 0.4)",
                                  "0 0 0px rgba(255, 184, 0, 0)"
                                ]
                              } : {}}
                              transition={isSelected ? {
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                              } : {}}
                              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                                isSelected 
                                  ? 'bg-[#FFB800] border-[#FFB800] text-black font-bold' 
                                  : isDisabled
                                    ? 'bg-white/5 border-white/5 text-gray-600 cursor-not-allowed'
                                    : 'bg-white/5 border-white/10 text-gray-300 hover:border-[#FFB800]/50'
                              }`}
                            >
                              {t(`courses_list.${course.id}.name`)}
                            </motion.button>
                          );
                      })}
                    </div>
                  </div>

                  {experience === 'less_than_1' && (
                    <div className="pt-4 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => setNeedsAssistance(!needsAssistance)}
                        className="w-full flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#FFB800]/50 transition-colors text-left group"
                      >
                        <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${needsAssistance ? 'bg-[#FFB800] border-[#FFB800]' : 'border-gray-600 group-hover:border-gray-400'}`}>
                          {needsAssistance && <div className="w-2 h-2 rounded-full bg-black" />}
                        </div>
                        <div>
                          <p className="text-white text-sm font-bold uppercase tracking-wider">{t('notify.missingRequirements')}</p>
                          <p className="text-gray-400 text-xs mt-1 leading-relaxed">{t('notify.missingRequirementsDesc')}</p>
                        </div>
                        <input type="hidden" name="needsAssistance" value={needsAssistance ? 'yes' : 'no'} />
                      </button>
                    </div>
                  )}

                  <div className="flex flex-col gap-2 mt-6">
                    <motion.button 
                      type={consent === 'accepted' ? "submit" : "button"}
                      disabled={consent !== 'accepted'}
                      whileHover={consent === 'accepted' ? { scale: 1.02, backgroundColor: "#FFC800" } : {}}
                      whileTap={consent === 'accepted' ? { scale: 0.98 } : {}}
                      animate={consent === 'accepted' ? { 
                        scale: [1, 1.05, 1],
                      } : {}}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className={`w-full font-black py-4 rounded-xl tracking-widest transition-colors ${
                        consent === 'accepted'
                          ? "bg-[#FFB800] text-black hover:bg-[#FFB800]/90"
                          : "bg-white/10 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {t('notify.submit')}
                    </motion.button>
                    {consent !== 'accepted' && (
                      <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-wider">
                        {t('cookies.consentRequired')}{' '}
                        <button 
                          type="button"
                          onClick={acceptCookies}
                          className="underline hover:text-white transition-colors"
                        >
                          {t('cookies.acceptToProceed')}
                        </button>
                      </p>
                    )}
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bell className="text-green-500" size={40} />
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase">
                  {t('notify.successTitle')}
                </h3>
                <p className="text-gray-400 mb-8">
                  {t('notify.successDesc')}
                </p>
                <button 
                  onClick={onClose}
                  className="bg-[#FFB800] text-black font-bold px-8 py-3 rounded-xl hover:bg-[#FFB800]/90 transition-all uppercase tracking-widest text-sm"
                >
                  {t('notify.close') || 'Close'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
  );
}

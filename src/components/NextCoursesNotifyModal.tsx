import { X, Bell, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCookieConsent } from '../context/CookieContext';

interface NextCoursesNotifyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NextCoursesNotifyModal({ isOpen, onClose }: NextCoursesNotifyModalProps) {
  const { t, language } = useLanguage();
  const { consent, acceptCookies } = useCookieConsent();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('drywall');
  const [experience, setExperience] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    formData.append('form_name', 'next courses');
    
    try {
      await fetch('https://formspree.io/f/xgorgzvj', {
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
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-[#15181b] border border-white/10 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
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
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-16 h-16 bg-[#FFB800]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#FFB800]/20"
                      >
                        <Bell className="text-[#FFB800]" size={32} />
                      </motion.div>
                      <h3 className="text-2xl font-black text-white mb-1 tracking-tight uppercase">
                        Next Courses
                      </h3>
                      {t('notify.nonBindingOffer') && (
                        <p className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black py-1 px-3 rounded-full inline-block mb-3 uppercase tracking-widest animate-pulse">
                          {t('notify.nonBindingOffer')}
                        </p>
                      )}
                      <p className="text-gray-400 text-sm">
                        {t('notify.desc')}
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-1">{language === 'pt' ? 'Nome' : 'First Name'}</label>
                          <input 
                            type="text" 
                            name="firstName"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] transition-colors text-sm"
                            placeholder="John"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-1">{language === 'pt' ? 'Sobrenome' : 'Last Name'}</label>
                          <input 
                            type="text" 
                            name="lastName"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] transition-colors text-sm"
                            placeholder="Doe"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-1">{language === 'pt' ? 'Nr de Telefone' : 'Phone Number'}</label>
                          <input 
                            type="tel" 
                            name="phone"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] transition-colors text-sm"
                            placeholder="+351..."
                          />
                        </div>
                        <div>
                          <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-1">{language === 'pt' ? 'Cidade' : 'City'}</label>
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
                        <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-1">{language === 'pt' ? 'Anos de Experiência' : 'Years of Experience'}</label>
                        <div className="relative">
                          <select 
                            name="experience"
                            required
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] transition-colors text-sm appearance-none"
                          >
                            <option value="" disabled className="bg-[#1a1d21]">{t('notify.selectExperience')}</option>
                            <option value="less_than_1" className="bg-[#1a1d21]">{t('notify.expLess1')}</option>
                            <option value="1_to_3" className="bg-[#1a1d21]">{t('notify.exp1to2')}</option>
                            <option value="3_to_5" className="bg-[#1a1d21]">{t('notify.exp3to5')}</option>
                            <option value="5_plus" className="bg-[#1a1d21]">{t('notify.exp5plus')}</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-1">{t('notify.coursesInterest')}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCourse('drywall')}
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-3 rounded-xl border transition-all text-center ${
                      selectedCourse === 'drywall' 
                        ? 'bg-[#FFB800] border-[#FFB800] text-black shadow-[0_0_15px_rgba(255,184,0,0.3)]' 
                        : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/30'
                    }`}
                  >
                    {t('courses_list.drywall.name')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCourse('servant')}
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-3 rounded-xl border transition-all text-center ${
                      selectedCourse === 'servant' 
                        ? 'bg-[#FFB800] border-[#FFB800] text-black shadow-[0_0_15px_rgba(255,184,0,0.3)]' 
                        : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/30'
                    }`}
                  >
                    {t('courses_list.servant.name')}
                  </button>
                  <input type="hidden" name="course" value={selectedCourse} />
                </div>
                      </div>

                      <div className="flex flex-col gap-2 mt-6">
                        <motion.button 
                          type={consent === 'accepted' ? "submit" : "button"}
                          disabled={consent !== 'accepted'}
                          whileHover={consent === 'accepted' ? { scale: 1.02 } : {}}
                          whileTap={consent === 'accepted' ? { scale: 0.98 } : {}}
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
            </motion.div>
          </div>
      )}
    </AnimatePresence>
  );
}

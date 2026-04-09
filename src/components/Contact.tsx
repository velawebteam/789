import { Send, ChevronDown, Upload, Lock, X } from 'lucide-react';
import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import BrandName from './BrandName';
import { useLanguage } from '../context/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [fileName, setFileName] = useState('');
  const [hasExperience, setHasExperience] = useState('');
  const [hasMindset, setHasMindset] = useState(false);
  const [needsAssistance, setNeedsAssistance] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const removeFile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const calculateTimeLeft = () => {
    const targetDate = new Date('2026-04-24T18:00:00+01:00');
    const now = new Date().getTime();
    return targetDate.getTime() - now;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isRegistrationOpen = timeLeft <= 0;

  useEffect(() => {
    const handlePlanSelection = (e: CustomEvent) => {
      setSelectedPlan(e.detail);
    };
    
    const handleVehicleSelection = (e: CustomEvent) => {
      setSelectedVehicle(e.detail);
    };
    
    window.addEventListener('planSelected', handlePlanSelection as EventListener);
    window.addEventListener('vehicleSelected', handleVehicleSelection as EventListener);
    
    return () => {
      window.removeEventListener('planSelected', handlePlanSelection as EventListener);
      window.removeEventListener('vehicleSelected', handleVehicleSelection as EventListener);
    };
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-32 bg-[#0a0a0a] relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight uppercase">
            {t('contact.title')} <span className="text-[#FFB800]">{t('contact.subtitle')}</span>
          </h2>
          <p className="text-[#FFB800] font-bold mb-4 uppercase tracking-wider text-sm">
            {t('contact.registrationsClosed')}
          </p>
          <p className="text-gray-400 text-lg leading-relaxed">
            {t('contact.desc').replace('{brand}', 'Real Builder')}
          </p>
        </div>

        <div id="contact-form" className="bg-[#111315] rounded-3xl p-6 md:p-12 border border-white/10">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully!'); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-2">{t('contact.firstName')}</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] transition-colors"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-2">{t('contact.lastName')}</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] transition-colors"
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-2">{t('contact.email')}</label>
              <input 
                type="email" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] transition-colors"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-2">{t('contact.city')}</label>
              <input 
                type="text" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] transition-colors"
                placeholder="Lisbon"
              />
            </div>

            <div>
              <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-2">{t('contact.selectInterest')}</label>
              <div className="relative">
                <select 
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] transition-colors appearance-none"
                >
                  <option value="" disabled className="bg-[#111315] text-gray-400">{t('contact.chooseInterest')}</option>
                  <option value="course_vehicle" className="bg-[#111315] text-white">{t('contact.interest1')}</option>
                  <option value="course_only" className="bg-[#111315] text-white">{t('contact.interest2')}</option>
                  <option value="doubts" className="bg-[#111315] text-white">{t('contact.interest3')}</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {selectedPlan && (
              <div className={`grid grid-cols-1 ${selectedPlan === 'course_vehicle' ? 'md:grid-cols-2' : ''} gap-6`}>
                {(selectedPlan === 'course_vehicle' || selectedPlan === 'course_only') && (
                  <>
                    <div>
                      <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-2">{t('contact.courseInterest')}</label>
                      <div className="relative">
                        <select 
                          required
                          defaultValue=""
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] transition-colors appearance-none"
                        >
                          <option value="" disabled className="bg-[#111315] text-gray-400">{t('contact.selectCourse')}</option>
                          <option value="tiles" className="bg-[#111315] text-white">{t('courses_list.tiles.name')}</option>
                          <option value="plaster" className="bg-[#111315] text-white">{t('courses_list.plastering.name')}</option>
                          <option value="cleaning" className="bg-[#111315] text-white">{t('courses_list.cleaning.name')}</option>
                          <option value="servente" className="bg-[#111315] text-white">{t('courses_list.assistant.name')}</option>
                          <option value="masonry" className="bg-[#111315] text-white">{t('courses_list.masonry.name')}</option>
                          <option value="drywall" className="bg-[#111315] text-white">{t('courses_list.drywall.name')}</option>
                          <option value="framing" className="bg-[#111315] text-white">{t('courses_list.framing.name')}</option>
                          <option value="steel" className="bg-[#111315] text-white">{t('courses_list.steel.name')}</option>
                          <option value="logistics" className="bg-[#111315] text-white">{t('courses_list.logistics.name')}</option>
                          <option value="servant" className="bg-[#111315] text-white">{t('courses_list.servant.name')}</option>
                          <option value="multiple" className="bg-[#111315] text-white">{t('courses_list.multiple')}</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {selectedPlan === 'course_vehicle' && (
                      <div>
                        <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-2">{t('contact.vehicleInterest')}</label>
                        <div className="relative">
                          <select 
                            required
                            value={selectedVehicle}
                            onChange={(e) => setSelectedVehicle(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] transition-colors appearance-none"
                          >
                            <option value="" disabled className="bg-[#111315] text-gray-400">{t('contact.selectVehicle')}</option>
                            <option value="mobile_toolbox" className="bg-[#111315] text-white">{t('mobility.toolbox.name')}</option>
                            <option value="electric_3_wheeler" className="bg-[#111315] text-white">{t('mobility.wheeler.name')}</option>
                            <option value="tool_buggy" className="bg-[#111315] text-white">{t('mobility.buggy.name')}</option>
                            <option value="tool_van" className="bg-[#111315] text-white">{t('mobility.van.name')}</option>
                          </select>
                          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    )}

                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-6 border-t border-white/5">
                      <div>
                        <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-2">{t('contact.readingSkills')}</label>
                        <div className="relative">
                          <select required defaultValue="" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] transition-colors appearance-none">
                            <option value="" disabled className="bg-[#111315] text-gray-400">{t('contact.selectLevel')}</option>
                            <option value="basic" className="bg-[#111315] text-white">{t('enrollment.basic')}</option>
                            <option value="intermediate" className="bg-[#111315] text-white">{t('enrollment.intermediate')}</option>
                            <option value="fluent" className="bg-[#111315] text-white">{t('enrollment.fluent')}</option>
                          </select>
                          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-2">{t('contact.portugueseLevel')}</label>
                        <div className="relative">
                          <select required defaultValue="" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] transition-colors appearance-none">
                            <option value="" disabled className="bg-[#111315] text-gray-400">{t('contact.selectLevel')}</option>
                            <option value="basic" className="bg-[#111315] text-white">{t('enrollment.basic')}</option>
                            <option value="intermediate" className="bg-[#111315] text-white">{t('enrollment.intermediate')}</option>
                            <option value="fluent" className="bg-[#111315] text-white">{t('enrollment.fluent')}</option>
                          </select>
                          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-2">{t('contact.englishLevel')}</label>
                        <div className="relative">
                          <select required defaultValue="" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] transition-colors appearance-none">
                            <option value="" disabled className="bg-[#111315] text-gray-400">{t('contact.selectLevel')}</option>
                            <option value="basic" className="bg-[#111315] text-white">{t('enrollment.basic')}</option>
                            <option value="intermediate" className="bg-[#111315] text-white">{t('enrollment.intermediate')}</option>
                            <option value="fluent" className="bg-[#111315] text-white">{t('enrollment.fluent')}</option>
                          </select>
                          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-2">{t('contact.digitalSkills')}</label>
                        <div className="relative">
                          <select required defaultValue="" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] transition-colors appearance-none">
                            <option value="" disabled className="bg-[#111315] text-gray-400">{t('contact.selectLevel')}</option>
                            <option value="basic" className="bg-[#111315] text-white">{t('enrollment.basic')}</option>
                            <option value="intermediate" className="bg-[#111315] text-white">{t('enrollment.intermediate')}</option>
                            <option value="fluent" className="bg-[#111315] text-white">{t('enrollment.fluent')}</option>
                          </select>
                          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-2">{t('contact.experienceLabel')}</label>
                        <div className="relative">
                          <select 
                            required 
                            value={hasExperience}
                            onChange={(e) => setHasExperience(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] transition-colors appearance-none"
                          >
                            <option value="" disabled className="bg-[#111315] text-gray-400">{t('contact.select')}</option>
                            <option value="yes" className="bg-[#111315] text-white">{t('pilotProgram.yes')}</option>
                            <option value="no" className="bg-[#111315] text-white">{t('pilotProgram.no')}</option>
                          </select>
                          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-2">{t('contact.uploadDoc')}</label>
                        <div className="relative group/upload">
                          <input 
                            type="file" 
                            ref={fileInputRef}
                            accept=".png,.jpg,.jpeg,.pdf"
                            className="hidden" 
                            id="doc-upload"
                            onChange={handleFileChange}
                          />
                          <div className="relative flex items-center">
                            <label 
                              htmlFor="doc-upload"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-400 flex items-center justify-between cursor-pointer hover:border-[#FFB800] transition-colors"
                            >
                              <span className="text-sm truncate pr-8">
                                {fileName || t('contact.chooseFile')}
                              </span>
                              <Upload size={16} className="shrink-0" />
                            </label>
                            {fileName && (
                              <button
                                type="button"
                                onClick={removeFile}
                                className="absolute right-10 p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                title="Remove file"
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-4 mt-6 pt-6 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => setHasMindset(!hasMindset)}
                        className="w-full flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#FFB800]/50 transition-colors text-left group"
                      >
                        <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${hasMindset ? 'bg-[#FFB800] border-[#FFB800]' : 'border-gray-600 group-hover:border-gray-400'}`}>
                          {hasMindset && <div className="w-2 h-2 rounded-full bg-black" />}
                        </div>
                        <div>
                          <p className="text-white text-sm font-bold uppercase tracking-wider">{t('contact.mindsetLabel')}</p>
                          <p className="text-gray-400 text-xs mt-1 leading-relaxed">{t('contact.mindsetDesc')}</p>
                        </div>
                        <input type="hidden" name="hasMindset" value={hasMindset ? 'yes' : 'no'} />
                      </button>

                      {hasExperience === 'no' && (
                        <button
                          type="button"
                          onClick={() => setNeedsAssistance(!needsAssistance)}
                          className="w-full flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#FFB800]/50 transition-colors text-left group"
                        >
                          <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${needsAssistance ? 'bg-[#FFB800] border-[#FFB800]' : 'border-gray-600 group-hover:border-gray-400'}`}>
                            {needsAssistance && <div className="w-2 h-2 rounded-full bg-black" />}
                          </div>
                          <div>
                            <p className="text-white text-sm font-bold uppercase tracking-wider">{t('contact.missingRequirements')}</p>
                            <p className="text-gray-400 text-xs mt-1 leading-relaxed">{t('contact.missingRequirementsDesc')}</p>
                          </div>
                          <input type="hidden" name="needsAssistance" value={needsAssistance ? 'yes' : 'no'} />
                        </button>
                      )}
                    </div>
                  </>
                )}

                {selectedPlan === 'doubts' && (
                  <div>
                    <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-2">{t('contact.about')}</label>
                    <div className="relative">
                      <select 
                        required
                        defaultValue=""
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] transition-colors appearance-none"
                      >
                        <option value="" disabled className="bg-[#111315] text-gray-400">{t('contact.selectTopic')}</option>
                        <option value="general" className="bg-[#111315] text-white">{t('contact.topicGeneral')}</option>
                        <option value="courses" className="bg-[#111315] text-white">{t('contact.topicCourses')}</option>
                        <option value="vehicles" className="bg-[#111315] text-white">{t('contact.topicVehicles')}</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <button 
                type={isRegistrationOpen ? "submit" : "button"}
                disabled={!isRegistrationOpen}
                className={`w-full py-4 rounded-xl font-bold tracking-widest flex items-center justify-center gap-2 transition-colors ${
                  isRegistrationOpen 
                    ? "bg-[#FFB800] text-black hover:bg-[#FFB800]/90" 
                    : "bg-white/10 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isRegistrationOpen ? (
                  <>
                    <Send size={18} />
                    {t('contact.sendMessage')}
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    {t('contact.registrationOpens')}
                  </>
                )}
              </button>

              {!isRegistrationOpen && (
                <motion.button 
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('openNotifyMe'))}
                  animate={{ 
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-full bg-white text-black hover:bg-[#FFB800] py-4 rounded-xl font-bold tracking-widest flex items-center justify-center gap-2 transition-colors"
                >
                  {t('contact.notifyMe')}
                </motion.button>
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 text-center">
              <p className="text-gray-400 text-xs md:text-sm font-medium leading-relaxed italic">
                "{t('contact.quote')}"
                <br />
                {t('contact.quoteSub')}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

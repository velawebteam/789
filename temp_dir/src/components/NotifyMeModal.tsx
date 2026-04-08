import { X, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';

const coursesList = [
  { id: 'tiles', name: 'Tiles & Tiling' },
  { id: 'plastering', name: 'Plastering / Microcement' },
  { id: 'cleaning', name: 'Professional Cleaning' },
  { id: 'assistant', name: 'Construction Assistant' },
  { id: 'masonry', name: 'Masonry / Plastering' },
  { id: 'drywall', name: 'Drywall (Pladur)' },
  { id: 'framing', name: 'Framing' },
  { id: 'steel', name: 'Steel Work' },
  { id: 'logistics', name: 'Stock Management / Logistics' },
];

interface NotifyMeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotifyMeModal({ isOpen, onClose }: NotifyMeModalProps) {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [experience, setExperience] = useState('');

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
    if (experience === 'less_than_1') return;
    
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
      setTimeout(() => {
        setIsSubmitted(false);
        setSelectedCourses([]);
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting the form. Please try again.');
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300 ${
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
                    Get Notified
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Leave your details below and we'll notify you as soon as new courses open.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-1">First Name</label>
                      <input 
                        type="text" 
                        name="firstName"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] transition-colors text-sm"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-1">Last Name</label>
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
                      <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        name="phone"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] transition-colors text-sm"
                        placeholder="+351 900 000 000"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-1">City</label>
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
                    <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-1">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] transition-colors text-sm"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-1">Years of Experience</label>
                    <select 
                      name="experience"
                      required
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full bg-[#1a1d21] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] transition-colors text-sm appearance-none"
                    >
                      <option value="" disabled>Select your experience</option>
                      <option value="less_than_1">Less than 1 year</option>
                      <option value="1_to_2">1-2 years</option>
                      <option value="3_to_5">3-5 years</option>
                      <option value="5_plus">5+ years</option>
                    </select>
                    {experience === 'less_than_1' && (
                      <p className="text-red-500 text-xs mt-2 font-bold">
                        I'm missing some requirements and need assistance
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-2">
                      Courses of Interest (Max 2)
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
                              {course.name}
                            </motion.button>
                          );
                      })}
                    </div>
                  </div>

                  <motion.button 
                    type="submit"
                    disabled={experience === 'less_than_1'}
                    whileHover={experience === 'less_than_1' ? {} : { scale: 1.02, backgroundColor: "#FFC800" }}
                    whileTap={experience === 'less_than_1' ? {} : { scale: 0.98 }}
                    className={`w-full font-black py-4 rounded-xl tracking-widest transition-colors mt-6 ${
                      experience === 'less_than_1'
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-[#FFB800] text-black hover:bg-[#FFB800]/90'
                    }`}
                  >
                    NOTIFY ME
                  </motion.button>
                </form>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bell className="text-green-500" size={40} />
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase">
                  You're on the list!
                </h3>
                <p className="text-gray-400">
                  We'll notify you as soon as new spots open for your selected courses.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
  );
}

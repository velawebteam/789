import { CheckCircle2, AlertTriangle, Send, ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import BrandName from './BrandName';

const areasOfInterest = [
  { id: 'tiler', name: 'Tiler' },
  { id: 'carpenter', name: 'Carpenter' },
  { id: 'drywall', name: 'Drywall Installer' },
  { id: 'plaster', name: 'Plaster/Microcement Specialist' },
];

export default function PilotProgram() {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [experience, setExperience] = useState('');

  const handleAreaToggle = (areaId: string) => {
    setSelectedAreas(prev => {
      if (prev.includes(areaId)) {
        return prev.filter(id => id !== areaId);
      }
      if (prev.length < 2) {
        return [...prev, areaId];
      }
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    formData.append('areasOfInterest', selectedAreas.join(', '));
    
    try {
      await fetch('https://formspree.io/f/xykblnwg', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setSelectedAreas([]);
        form.reset();
      }, 4000);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting the form. Please try again.');
    }
  };

  return (
    <section id="pilot-program" className="py-16 md:py-32 bg-[#FFB800] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/10 border border-black/20 text-black text-xs font-black tracking-widest uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              Limited Opportunity
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black text-black mb-6 tracking-tight uppercase leading-none notranslate" translate="no">
              Join the <BrandName /> <br />
              <span className="text-white drop-shadow-md">Pilot Program! 3 spots only!</span>
            </h2>
            
            <p className="text-black/80 text-xl font-bold mb-8 max-w-lg">
              Get free training and a job contract!
            </p>

            <ul className="space-y-4 mb-10">
              <li className="flex items-start gap-3 text-black font-semibold text-lg">
                <CheckCircle2 className="text-black shrink-0 mt-0.5" />
                <span>Become the first Certified <BrandName /></span>
              </li>
              <li className="flex items-start gap-3 text-black font-semibold text-lg">
                <CheckCircle2 className="text-black shrink-0 mt-0.5" />
                <span>Be a part of the next generation of construction professionals</span>
              </li>
              <li className="flex items-start gap-3 text-black font-semibold text-lg">
                <CheckCircle2 className="text-black shrink-0 mt-0.5" />
                <span>Earn from 1200€ to 2000€/monthly</span>
              </li>
            </ul>

            <div className="bg-black/10 border-l-4 border-black p-4 rounded-r-xl inline-flex items-start gap-3">
              <AlertTriangle className="text-black shrink-0" />
              <p className="text-black font-bold text-sm">
                Important: The program is intensive (10 hours/day). We are looking for dedicated professionals ready to commit.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-[#15181b] rounded-2xl p-6 md:p-10 shadow-2xl border border-white/10">
            {!isSubmitted ? (
              <>
                <h3 className="text-2xl font-black text-white mb-6 tracking-tight uppercase">
                  Apply Now
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-1">First Name</label>
                      <input type="text" name="firstName" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] transition-colors text-sm" placeholder="John" />
                    </div>
                    <div>
                      <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-1">Last Name</label>
                      <input type="text" name="lastName" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] transition-colors text-sm" placeholder="Doe" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-1">Phone Number</label>
                      <input type="tel" name="phone" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] transition-colors text-sm" placeholder="+351 900 000 000" />
                    </div>
                    <div>
                      <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-1">Email</label>
                      <input type="email" name="email" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] transition-colors text-sm" placeholder="john@example.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-1">City</label>
                      <input type="text" name="city" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] transition-colors text-sm" placeholder="Lisbon" />
                    </div>
                    <div>
                      <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-1">Years of Experience</label>
                      <div className="relative">
                        <select 
                          name="experience" 
                          required 
                          value={experience}
                          onChange={(e) => setExperience(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFB800] transition-colors text-sm appearance-none"
                        >
                          <option value="" disabled className="bg-[#15181b] text-gray-400">Select experience...</option>
                          <option value="Less than 1 year" className="bg-[#15181b] text-white">Less than 1 year</option>
                          <option value="1-3 years" className="bg-[#15181b] text-white">1-3 years</option>
                          <option value="3-5 years" className="bg-[#15181b] text-white">3-5 years</option>
                          <option value="5+ years" className="bg-[#15181b] text-white">5+ years</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                      {experience === 'Less than 1 year' && (
                        <p className="text-red-500 text-xs mt-2 font-bold">
                          I'm missing some requirements and need assistance
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-2">Available to work in Tavira?</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
                          <input type="radio" name="tavira" value="yes" required className="accent-[#FFB800]" /> Yes
                        </label>
                        <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
                          <input type="radio" name="tavira" value="no" required className="accent-[#FFB800]" /> No
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-2">Available to start immediately?</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
                          <input type="radio" name="immediate" value="yes" required className="accent-[#FFB800]" /> Yes
                        </label>
                        <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
                          <input type="radio" name="immediate" value="no" required className="accent-[#FFB800]" /> No
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-2">
                      Areas of Interest (Select up to 2)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {areasOfInterest.map(area => {
                        const isSelected = selectedAreas.includes(area.id);
                        const isDisabled = !isSelected && selectedAreas.length >= 2;
                        
                        return (
                          <button
                            key={area.id}
                            type="button"
                            onClick={() => handleAreaToggle(area.id)}
                            disabled={isDisabled}
                            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                              isSelected 
                                ? 'bg-[#FFB800] border-[#FFB800] text-black font-bold' 
                                : isDisabled
                                  ? 'bg-white/5 border-white/5 text-gray-600 cursor-not-allowed'
                                  : 'bg-white/5 border-white/10 text-gray-300 hover:border-[#FFB800]/50'
                            }`}
                          >
                            {area.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={experience === 'Less than 1 year'}
                    className={`w-full font-black py-4 rounded-xl tracking-widest transition-colors mt-6 flex items-center justify-center gap-2 ${
                      experience === 'Less than 1 year'
                        ? 'bg-white/10 text-gray-500 cursor-not-allowed'
                        : 'bg-[#FFB800] text-black hover:bg-white'
                    }`}
                  >
                    SUBMIT APPLICATION <Send size={18} />
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="text-green-500" size={40} />
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase">
                  Application Received!
                </h3>
                <p className="text-gray-400">
                  Thank you for applying to the <BrandName /> Pilot Program. We will review your application and contact you soon.
                </p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
}

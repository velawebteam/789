import { Check, X, Globe, X as CloseIcon, CheckCircle2 } from 'lucide-react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';

export default function Pricing() {
  const [showPromo, setShowPromo] = useState(false);
  const [hasDismissedPromo, setHasDismissedPromo] = useState(false);
  const [hasPromoAppeared, setHasPromoAppeared] = useState(false);
  
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView && !hasDismissedPromo) {
      const timer = setTimeout(() => {
        setShowPromo(true);
        setHasPromoAppeared(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isInView, hasDismissedPromo]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: id === 'contact-form' ? 'center' : 'start'
      });
    }
  };

  const handleSelectPlan = (planId: string) => {
    window.dispatchEvent(new CustomEvent('planSelected', { detail: planId }));
    scrollTo('contact-form');
  };

  return (
    <section id="pricing" ref={sectionRef} className="pt-16 md:pt-32 pb-0 bg-[#111315] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative pt-8 md:pt-16 px-8 md:px-16 border-t border-x border-white/5">
          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#FFB800]"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#FFB800]"></div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight uppercase">
              THE REAL BUILDER SYSTEM
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Get access to our fully equipped vehicles, affordable rental prices, and exclusive discounts on equipment & materials.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h3 className="text-2xl font-bold text-white">Choose Your <span className="text-[#FFB800]">Path</span></h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Card 1 */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-[#15181b] rounded-2xl p-8 border border-white/10 relative flex flex-col"
            >
              <div className="absolute -top-3 left-6 bg-[#FFB800] text-black text-xs font-bold px-3 py-1 rounded-md flex items-center gap-1">
                <span className="w-3 h-3 rounded-full border border-black flex items-center justify-center text-[8px]">M</span>
                Best Value
              </div>
              
              <h4 className="text-xl font-bold text-white mb-6">Course + Vehicle & Membership</h4>
              
              <div className="flex flex-wrap items-baseline gap-1 sm:gap-2 mb-2">
                <span className="text-gray-400 text-xs sm:text-sm">from</span>
                <span className="text-[#FFB800] text-3xl sm:text-4xl font-bold">€249</span>
                <span className="text-gray-400">-</span>
                <span className="text-[#FFB800] text-3xl sm:text-4xl font-bold">€589</span>
                <span className="text-gray-400 text-xs sm:text-sm">/ month</span>
              </div>
              <p className="text-gray-500 text-xs mb-8">Price depends on mobility solution choice</p>

              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex items-center gap-3 text-white text-xs sm:text-sm font-semibold">
                  <Check size={16} className="text-[#22c55e] shrink-0" /> FULL COURSE
                </li>
                <li className="flex items-center gap-3 text-white text-xs sm:text-sm font-semibold">
                  <Check size={16} className="text-[#22c55e] shrink-0" /> CERTIFICATION
                </li>
                <li className="flex items-center gap-3 text-white text-xs sm:text-sm font-semibold">
                  <Check size={16} className="text-[#22c55e] shrink-0" /> VEHICLE
                </li>
                <li className="flex items-center gap-3 text-white text-xs sm:text-sm font-semibold relative group cursor-help">
                  <Check size={16} className="text-[#22c55e] shrink-0" /> <u className="decoration-[#FFB800] underline-offset-4">RB MEMBERSHIP</u>
                  <div className="absolute bottom-full left-0 mb-2 w-56 bg-[#1a1d21] border border-white/10 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                    <div className="text-xs font-normal text-gray-300 whitespace-pre-line leading-relaxed">
                      RB Section ID{"\n"}Tablet with RB App{"\n"}Online Shop Discount{"\n"}Follow Up training 3x/year{"\n"}Visible and Promoted on Website{"\n"}Guide Maintenance
                    </div>
                  </div>
                </li>
                <li className="flex items-center gap-3 text-white text-xs sm:text-sm font-semibold relative group cursor-help">
                  <Check size={16} className="text-[#22c55e] shrink-0" /> <u className="decoration-[#FFB800] underline-offset-4">WORKWEAR</u>
                  <div className="absolute bottom-full left-0 mb-2 w-48 bg-[#1a1d21] border border-white/10 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                    <div className="text-xs font-normal text-gray-300 whitespace-pre-line leading-relaxed">
                      Pants{"\n"}Helmet{"\n"}Shoes{"\n"}Shirt{"\n"}Vest
                    </div>
                  </div>
                </li>
                <li className="flex items-center gap-3 text-white text-xs sm:text-sm font-semibold relative group cursor-help">
                  <Check size={16} className="text-[#22c55e] shrink-0" /> <u className="decoration-[#FFB800] underline-offset-4">PM SOFTWARE</u>
                  <div className="absolute bottom-full left-0 mb-2 w-48 bg-[#1a1d21] border border-white/10 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                    <div className="text-xs font-normal text-gray-300 whitespace-pre-line leading-relaxed">
                      Quotes{"\n"}Invoice{"\n"}Project Management{"\n"}Payments{"\n"}Time Tracking{"\n"}Tool Check Up
                    </div>
                  </div>
                </li>
                <li className="flex items-center gap-3 text-white text-xs sm:text-sm font-semibold">
                  <Check size={16} className="text-[#22c55e] shrink-0" /> MOBILE WORKSHOP ACCESS
                </li>
                <li className="flex items-center gap-3 text-white text-xs sm:text-sm font-semibold relative group cursor-help">
                  <Check size={16} className="text-[#22c55e] shrink-0" /> <u className="decoration-[#FFB800] underline-offset-4">JOB PLACEMENT SUPPORT</u>
                  <div className="absolute bottom-full left-0 mb-2 w-48 bg-[#1a1d21] border border-white/10 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                    <div className="text-xs font-normal text-gray-300 whitespace-pre-line leading-relaxed">
                      Work in the World{"\n\n"}Internal{"\n"}National{"\n"}International
                    </div>
                  </div>
                </li>
                <li className="flex items-center gap-3 text-white text-xs sm:text-sm font-semibold">
                  <Globe size={16} className="text-[#FFB800] shrink-0" /> GLOBAL MARKETING SUPPORT
                </li>
              </ul>

              <button 
                onClick={() => handleSelectPlan('course_vehicle')}
                className="w-full bg-[#FFB800] text-black py-4 rounded-xl font-bold tracking-widest hover:bg-[#FFB800]/90 transition-colors"
              >
                SELECT PLAN
              </button>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-[#15181b] rounded-2xl p-8 border border-white/10 relative flex flex-col"
            >
              <div className="absolute -top-3 left-6 bg-gray-700 text-white text-xs font-bold px-3 py-1 rounded-md flex items-center gap-1">
                 <span className="w-3 h-3 rounded-full border border-white flex items-center justify-center text-[8px]">I</span>
                Independent
              </div>
              
              <h4 className="text-xl font-bold text-white mb-6">Course Only</h4>
              
              <div className="flex flex-wrap items-baseline gap-1 sm:gap-2 mb-2">
                <span className="text-[#FFB800] text-3xl sm:text-4xl font-bold">€899</span>
                <span className="text-gray-400 text-xs sm:text-sm">one-time</span>
              </div>
              <p className="text-gray-400 text-xs mb-8">Full certification without membership</p>

              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex items-center gap-3 text-white text-xs sm:text-sm font-semibold">
                  <Check size={16} className="text-[#22c55e] shrink-0" /> FULL COURSE
                </li>
                <li className="flex items-center gap-3 text-white text-xs sm:text-sm font-semibold">
                  <Check size={16} className="text-[#22c55e] shrink-0" /> CERTIFICATION
                </li>
                <li className="flex items-center gap-3 text-gray-500 text-xs sm:text-sm">
                  <X size={16} className="shrink-0" /> No vehicle included
                </li>
                <li className="flex items-center gap-3 text-gray-500 text-xs sm:text-sm">
                  <span className="w-4 h-4 rounded-full border border-gray-500 flex items-center justify-center text-[8px] shrink-0">M</span> No membership benefits
                </li>
                <li className="flex items-center gap-3 text-gray-500 text-xs sm:text-sm">
                  <X size={16} className="shrink-0" /> No mobile workshop access
                </li>
              </ul>

              <button 
                onClick={() => handleSelectPlan('course_only')}
                className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-xl font-bold tracking-widest hover:bg-white/10 transition-colors"
              >
                SELECT PLAN
              </button>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="text-center mt-4 md:mt-8 mb-16 md:mb-0 text-gray-500 text-sm"
          >
            Please select a path above to continue
          </motion.div>
        </div>
      </div>

      {/* Promo Popup */}
      <AnimatePresence>
        {showPromo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="relative w-full max-w-md bg-gradient-to-b from-[#1a1d21] to-[#111315] border-2 border-[#FFB800] rounded-2xl shadow-[0_0_50px_rgba(255,184,0,0.15)] p-8 text-center overflow-hidden"
            >
              {/* Background glow effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-[#FFB800]/10 blur-3xl rounded-full pointer-events-none"></div>

              <button 
                onClick={() => {
                  setShowPromo(false);
                  setHasDismissedPromo(true);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
              >
                <CloseIcon size={20} />
              </button>
              
              <div className="relative z-10">
                <div className="inline-block bg-[#FFB800]/10 border border-[#FFB800]/30 text-[#FFB800] text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full mb-6">
                  Special Offer
                </div>
                
                <h4 className="text-white font-black text-3xl md:text-4xl mb-4 tracking-tight uppercase">
                  Get <span className="text-[#FFB800]">100% OFF</span>
                </h4>
                
                <p className="text-gray-300 text-base mb-6 leading-relaxed">
                  Claim this exclusive offer!<br />
                  Get a 100% discount on<br />
                  <strong>any course</strong> of your interest.
                </p>

                <div className="bg-red-500/10 border border-red-500/20 rounded-lg py-3 px-4 mb-8">
                  <span className="text-red-500 text-sm uppercase tracking-widest font-bold flex items-center justify-center gap-2 notranslate" translate="no">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    20 get 50% off - 2 get 100% off
                  </span>
                </div>
                
                <button 
                  onClick={() => {
                    setShowPromo(false);
                    setHasDismissedPromo(true);
                    window.dispatchEvent(new CustomEvent('openNotifyMe'));
                  }}
                  className="w-full bg-[#FFB800] text-black font-black py-4 rounded-xl text-lg tracking-widest hover:bg-white transition-colors shadow-[0_0_20px_rgba(255,184,0,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                >
                  CLAIM YOUR SPOT
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Widget (Appears after promo) */}
      <AnimatePresence>
        {hasPromoAppeared && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50"
          >
            <motion.button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('openNotifyMe'));
              }}
              animate={{ 
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 0 0px rgba(255, 184, 0, 0)",
                  "0 0 20px rgba(255, 184, 0, 0.4)",
                  "0 0 0px rgba(255, 184, 0, 0)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="group relative overflow-hidden flex items-center gap-4 px-6 py-4 bg-[#0a0a0a] border border-white/10 border-l-4 border-l-[#FFB800] rounded-r-xl cursor-pointer"
            >
              <div className="flex flex-col items-start text-left relative z-10">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">
                  Action Required
                </span>
                <span className="text-sm font-black tracking-widest uppercase text-[#FFB800]">
                  Claim 100% Off
                </span>
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

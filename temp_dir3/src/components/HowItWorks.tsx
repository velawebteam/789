import { UserPlus, BookOpen, Hammer, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import CertifiedBadge from './CertifiedBadge';

export default function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="how-it-works" className="py-16 md:py-32 bg-[#15181b] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            How It <span className="text-[#FFB800]">Works</span>
          </h2>
          <p className="text-gray-400 text-lg">
            From Base experience to certified professional. Faster than you can imagine.
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute top-[64px] left-[10%] w-[80%] h-[4px] bg-[#FFB800]/30 hidden md:block origin-left z-0"
          ></motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="flex overflow-x-auto md:overflow-visible snap-x snap-mandatory md:grid md:grid-cols-5 gap-8 relative z-10 pt-8 pb-8 md:pt-0 md:pb-0 hide-scrollbar -mx-6 px-6 md:mx-0 md:px-0"
          >
            {/* Step 1 */}
            <motion.div variants={itemVariants} className="flex-none w-[85vw] sm:w-[60vw] md:w-auto snap-center flex flex-col items-center group cursor-pointer">
              <div className="relative mb-6 transition-transform duration-300 group-hover:scale-110">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#111315] border border-[#FFB800]/30 flex items-center justify-center text-[#FFB800] transition-colors duration-300">
                  <UserPlus className="w-8 h-8 md:w-12 md:h-12" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#FFB800] text-black flex items-center justify-center text-xs md:text-sm font-bold shadow-[0_0_15px_rgba(255,184,0,0.5)]">
                  01
                </div>
              </div>
              <h3 className="text-[#FFB800] font-bold text-xl mb-3 transition-colors duration-300">Register</h3>
              <div className="grid grid-rows-[1fr] md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-in-out w-full">
                <div className="overflow-hidden">
                  <p className="text-gray-400 text-sm text-center px-2 pb-4">
                    Sign up and tell us about your background and goals. We'll match you with the right training path.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={itemVariants} className="flex-none w-[85vw] sm:w-[60vw] md:w-auto snap-center flex flex-col items-center group cursor-pointer">
              <div className="relative mb-6 transition-transform duration-300 group-hover:scale-110">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#111315] border border-[#FFB800]/30 flex items-center justify-center text-[#FFB800] transition-colors duration-300">
                  <BookOpen className="w-8 h-8 md:w-12 md:h-12" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#FFB800] text-black flex items-center justify-center text-xs md:text-sm font-bold shadow-[0_0_15px_rgba(255,184,0,0.5)]">
                  02
                </div>
              </div>
              <h3 className="text-[#FFB800] font-bold text-xl mb-3 transition-colors duration-300">Learn Skills</h3>
              <div className="grid grid-rows-[1fr] md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-in-out w-full">
                <div className="overflow-hidden">
                  <p className="text-gray-400 text-sm text-center px-2 pb-4">
                    Participate in high-intensity, on-site learning in Portuguese or English. From safety fundamentals to specialized techniques.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={itemVariants} className="flex-none w-[85vw] sm:w-[60vw] md:w-auto snap-center flex flex-col items-center group cursor-pointer">
              <div className="relative mb-6 transition-transform duration-300 group-hover:scale-110">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#111315] border border-[#FFB800]/30 flex items-center justify-center text-[#FFB800] transition-colors duration-300">
                  <Hammer className="w-8 h-8 md:w-12 md:h-12" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#FFB800] text-black flex items-center justify-center text-xs md:text-sm font-bold shadow-[0_0_15px_rgba(255,184,0,0.5)]">
                  03
                </div>
              </div>
              <h3 className="text-[#FFB800] font-bold text-xl mb-3 transition-colors duration-300">Train On-Site</h3>
              <div className="grid grid-rows-[1fr] md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-in-out w-full">
                <div className="overflow-hidden">
                  <p className="text-gray-400 text-sm text-center px-2 pb-4">
                    Weekend hands-on training (Fri-Sun) with real tools and experienced professionals.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Step 4 */}
            <motion.div variants={itemVariants} className="flex-none w-[85vw] sm:w-[60vw] md:w-auto snap-center flex flex-col items-center group cursor-pointer">
              <div className="relative mb-6 transition-transform duration-300 group-hover:scale-110">
                <CertifiedBadge className="w-24 h-24 md:w-32 md:h-32 drop-shadow-[0_0_15px_rgba(255,184,0,0.3)] group-hover:drop-shadow-[0_0_25px_rgba(255,184,0,0.5)] transition-all duration-300" />
              </div>
              <h3 className="text-[#FFB800] font-bold text-xl uppercase tracking-wider mb-3">CERTIFIED</h3>
              <div className="grid grid-rows-[1fr] md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-in-out w-full">
                <div className="overflow-hidden">
                  <p className="text-gray-400 text-sm text-center px-2 pb-4">
                    Earn your RB1 Certificate after 1-4 weekends of training. Your first milestone to a professional career!
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Step 5 */}
            <motion.div variants={itemVariants} className="flex-none w-[85vw] sm:w-[60vw] md:w-auto snap-center flex flex-col items-center group cursor-pointer">
              <div className="relative mb-6 transition-transform duration-300 group-hover:scale-110">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FFB800] text-black text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap z-20 shadow-[0_0_20px_rgba(255,184,0,0.5)]">
                  MEMBERS ONLY
                </div>
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-[#FFB800] overflow-hidden relative z-10 group-hover:shadow-[0_0_30px_rgba(255,184,0,0.4)] transition-shadow duration-300">
                  <img 
                    src="https://lh3.googleusercontent.com/d/1iefT26tARQu5H7tEhmmHCtvf8b8RAlsN" 
                    alt="Vehicle" 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <h3 className="text-[#FFB800] font-bold text-xl uppercase tracking-wider text-center mb-3">GET YOUR VEHICLE</h3>
              <div className="grid grid-rows-[1fr] md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-in-out w-full">
                <div className="overflow-hidden">
                  <p className="text-gray-400 text-sm text-center px-2 pb-4">
                    Get your fully equipped vehicle to start working as a professional builder.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Mobile Swipe Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
            className="flex items-center justify-center gap-2 text-gray-500 text-sm mt-6 md:hidden"
          >
            <span>Swipe to explore</span>
            <ArrowRight className="w-4 h-4 animate-pulse" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

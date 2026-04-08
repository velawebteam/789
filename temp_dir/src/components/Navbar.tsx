import { Info, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import BrandName from './BrandName';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: id === 'contact-form' ? 'center' : 'start'
        });
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-2 cursor-pointer">
          <img 
            src="https://lh3.googleusercontent.com/d/1JcDlCqhCcECmb6aCnMHr_G_Qj-FeGBHn" 
            alt="Real Builder Logo" 
            className="h-20 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </Link>

        <div className="hidden lg:flex items-center gap-6 text-xs font-semibold tracking-wider text-gray-300 uppercase">
          <button onClick={() => scrollTo('about')} className="hover:text-white transition-colors">ABOUT</button>
          <button onClick={() => scrollTo('how-it-works')} className="hover:text-white transition-colors">HOW IT WORKS</button>
          <button onClick={() => scrollTo('pricing')} className="hover:text-white transition-colors">PRICING</button>
          <button onClick={() => scrollTo('courses')} className="hover:text-white transition-colors">COURSES</button>
          <button onClick={() => scrollTo('professionals')} className="hover:text-white transition-colors">PROFESSIONALS</button>
          <button onClick={() => scrollTo('partners')} className="hover:text-white transition-colors">PARTNERS</button>
          <button onClick={() => scrollTo('contact-form')} className="hover:text-white transition-colors">CONTACT</button>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('openNotifyMe'))}
            className="hidden md:block text-white px-2 py-2 rounded-md text-xs font-bold tracking-wider hover:text-[#FFB800] transition-colors uppercase"
          >
            NOTIFY ME
          </button>
          
          <motion.button 
            onClick={() => scrollTo('contact-form')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:block relative group overflow-hidden bg-[#FFB800] text-black px-4 md:px-6 py-2 rounded-md text-xs font-bold tracking-wider transition-all hover:bg-[#FFB800]/90"
          >
            {/* Animated lighting effect */}
            <motion.div 
              animate={{ 
                left: ['-100%', '200%'] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "linear",
                repeatDelay: 0.5
              }}
              className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 pointer-events-none"
            />
            <span className="relative z-10">GET STARTED</span>
          </motion.button>

          <button 
            className="lg:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0a0a0a] border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-4 text-sm font-semibold tracking-wider text-gray-300 uppercase">
              <button onClick={() => { scrollTo('about'); setIsMobileMenuOpen(false); }} className="text-left hover:text-white py-2">ABOUT</button>
              <button onClick={() => { scrollTo('how-it-works'); setIsMobileMenuOpen(false); }} className="text-left hover:text-white py-2">HOW IT WORKS</button>
              <button onClick={() => { scrollTo('pricing'); setIsMobileMenuOpen(false); }} className="text-left hover:text-white py-2">PRICING</button>
              <button onClick={() => { scrollTo('courses'); setIsMobileMenuOpen(false); }} className="text-left hover:text-white py-2">COURSES</button>
              <button onClick={() => { scrollTo('professionals'); setIsMobileMenuOpen(false); }} className="text-left hover:text-white py-2">PROFESSIONALS</button>
              <button onClick={() => { scrollTo('partners'); setIsMobileMenuOpen(false); }} className="text-left hover:text-white py-2">PARTNERS</button>
              <button onClick={() => { scrollTo('contact-form'); setIsMobileMenuOpen(false); }} className="text-left hover:text-white py-2">CONTACT</button>
              <div className="h-px bg-white/10 my-2"></div>
              <button 
                onClick={() => { window.dispatchEvent(new CustomEvent('openNotifyMe')); setIsMobileMenuOpen(false); }}
                className="text-left text-[#FFB800] py-2"
              >
                NOTIFY ME
              </button>
              <button 
                onClick={() => { scrollTo('contact-form'); setIsMobileMenuOpen(false); }}
                className="bg-[#FFB800] text-black text-center py-3 rounded-md mt-2"
              >
                GET STARTED
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

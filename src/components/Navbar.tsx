import { Info, Menu, X, Globe, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import BrandName from './BrandName';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, login, logout, loading } = useAuth();
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

  const languages = [
    { code: 'en', label: 'EN', flag: '🇺🇸' },
    { code: 'pt', label: 'PT', flag: '🇵🇹' },
    { code: 'hi', label: 'HI', flag: '🇮🇳' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a] border-b border-white/10">
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
          <button onClick={() => scrollTo('about')} className="hover:text-white transition-colors">{t('navbar.about')}</button>
          <button onClick={() => scrollTo('how-it-works')} className="hover:text-white transition-colors">{t('navbar.howItWorks')}</button>
          <button onClick={() => scrollTo('pricing')} className="hover:text-white transition-colors">{t('navbar.pricing')}</button>
          <button onClick={() => scrollTo('courses')} className="hover:text-white transition-colors">{t('navbar.courses')}</button>
          <button onClick={() => scrollTo('professionals')} className="hover:text-white transition-colors">{t('navbar.professionals')}</button>
          <button onClick={() => scrollTo('partners')} className="hover:text-white transition-colors">{t('navbar.partners')}</button>
          <button onClick={() => scrollTo('contact-form')} className="hover:text-white transition-colors">{t('navbar.register')}</button>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          {/* Language Switcher */}
          <div className="relative">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase"
            >
              <Globe size={16} className="text-[#FFB800] hidden sm:block" />
              <span className="text-[#FFB800] sm:text-gray-400">{languages.find(l => l.code === language)?.label}</span>
            </button>
            
            <AnimatePresence>
              {isLangOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-4 bg-[#111315] border border-white/10 rounded-lg overflow-hidden shadow-2xl min-w-[120px]"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any);
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold transition-colors hover:bg-white/5 ${language === lang.code ? 'text-[#FFB800] bg-white/5' : 'text-gray-400'}`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('openNotifyMe'))}
            className="hidden md:block text-white px-2 py-2 rounded-md text-xs font-bold tracking-wider hover:text-[#FFB800] transition-colors uppercase"
          >
            {t('navbar.notifyMe')}
          </button>

          {/* User Auth */}
          <div className="relative hidden md:block">
            {!loading && (
              user ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-[#FFB800]/50" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                        <UserIcon size={16} />
                      </div>
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-4 bg-[#111315] border border-white/10 rounded-lg overflow-hidden shadow-2xl min-w-[160px]"
                      >
                        <div className="px-4 py-3 border-b border-white/5">
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Logged in as</p>
                          <p className="text-xs font-bold text-white truncate">{user.displayName || user.email}</p>
                        </div>
                        <button
                          onClick={() => { logout(); setIsUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-400 transition-colors hover:bg-white/5"
                        >
                          <LogOut size={14} />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button 
                  onClick={login}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase"
                >
                  <LogIn size={16} className="text-[#FFB800]" />
                  <span>Login</span>
                </button>
              )
            )}
          </div>
          
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
            <span className="relative z-10">{t('navbar.getStarted')}</span>
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
            className="lg:hidden bg-[#0a0a0a] border-b border-white/10 overflow-y-auto max-h-[calc(100vh-6rem)]"
          >
            <div className="flex flex-col px-6 py-4 gap-4 text-sm font-semibold tracking-wider text-gray-300 uppercase">
              <button onClick={() => { scrollTo('about'); setIsMobileMenuOpen(false); }} className="text-left hover:text-white py-2">{t('navbar.about')}</button>
              <button onClick={() => { scrollTo('how-it-works'); setIsMobileMenuOpen(false); }} className="text-left hover:text-white py-2">{t('navbar.howItWorks')}</button>
              <button onClick={() => { scrollTo('pricing'); setIsMobileMenuOpen(false); }} className="text-left hover:text-white py-2">{t('navbar.pricing')}</button>
              <button onClick={() => { scrollTo('courses'); setIsMobileMenuOpen(false); }} className="text-left hover:text-white py-2">{t('navbar.courses')}</button>
              <button onClick={() => { scrollTo('professionals'); setIsMobileMenuOpen(false); }} className="text-left hover:text-white py-2">{t('navbar.professionals')}</button>
              <button onClick={() => { scrollTo('partners'); setIsMobileMenuOpen(false); }} className="text-left hover:text-white py-2">{t('navbar.partners')}</button>
              <button onClick={() => { scrollTo('contact-form'); setIsMobileMenuOpen(false); }} className="text-left hover:text-white py-2">{t('navbar.register')}</button>
              
              <div className="h-px bg-white/10 my-2"></div>
              
              {/* Mobile Language Switcher & Notify Me */}
              <div className="flex flex-col gap-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code as any);
                        }}
                        className={`flex-1 flex items-center justify-center px-2 py-2.5 rounded-lg border transition-colors ${language === lang.code ? 'border-[#FFB800] text-[#FFB800] bg-[#FFB800]/5' : 'border-white/10 text-gray-400'}`}
                      >
                        <span className="text-xs font-black tracking-widest">{lang.label}</span>
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => { window.dispatchEvent(new CustomEvent('openNotifyMe')); setIsMobileMenuOpen(false); }}
                    className="bg-white/5 border border-[#FFB800]/50 text-[#FFB800] px-4 py-2 rounded-lg text-[10px] font-bold tracking-wider uppercase h-full flex items-center justify-center"
                  >
                    {t('navbar.notifyMe')}
                  </button>
                </div>
              </div>

              <div className="h-px bg-white/10 my-2"></div>

              {/* Mobile Auth */}
              {!loading && (
                user ? (
                  <div className="flex flex-col gap-4 py-2">
                    <div className="flex items-center gap-3 px-3 py-2">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName || ''} className="w-10 h-10 rounded-full border border-[#FFB800]/50" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                          <UserIcon size={20} />
                        </div>
                      )}
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Logged in as</p>
                        <p className="text-xs font-bold text-white">{user.displayName || user.email}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                      className="flex items-center gap-3 px-3 py-2 text-red-400 font-bold"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => { login(); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-3 px-3 py-2 text-[#FFB800] font-bold"
                  >
                    <LogIn size={18} />
                    <span>Login</span>
                  </button>
                )
              )}

              <div className="h-px bg-white/10 my-2"></div>
              <button 
                onClick={() => { scrollTo('contact-form'); setIsMobileMenuOpen(false); }}
                className="bg-[#FFB800] text-black text-center py-3 rounded-md mt-2"
              >
                {t('navbar.getStarted')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

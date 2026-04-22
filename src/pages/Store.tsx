import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ALLOWED_EMAILS } from '../constants/auth';
import { ShoppingBag, ArrowRight, Lock, LogIn } from 'lucide-react';

const products = [
  {
    id: 'toolbox',
    category: 'mobility',
    image: 'https://lh3.googleusercontent.com/d/1n1hlKM4AOQ9g73HteeUgPm0a6KE-W1X7',
    price: '249',
    link: 'https://real-builder.myshopify.com/products/produto-4?variant=57281301774718'
  },
  {
    id: 'wheeler',
    category: 'mobility',
    image: 'https://lh3.googleusercontent.com/d/1xVu-eCm-bBAUQMkCPX77Hk40JcpMqs9N',
    price: '389',
    link: 'https://real-builder.myshopify.com/products/produto-1?variant=57281300234622'
  },
  {
    id: 'buggy',
    category: 'mobility',
    image: 'https://lh3.googleusercontent.com/d/1-rzX3X8Lf-3bFpC1auxN_RREX_4ldFwa',
    price: '489',
    link: 'https://real-builder.myshopify.com/products/produto-3?variant=57281301217662'
  },
  {
    id: 'van',
    category: 'mobility',
    image: 'https://lh3.googleusercontent.com/d/1iefT26tARQu5H7tEhmmHCtvf8b8RAlsN',
    price: '589',
    link: 'https://real-builder.myshopify.com/products/produto-2?variant=57281300627838'
  }
];

export default function Store() {
  const { t } = useLanguage();
  const { user, login, loading: authLoading, isAuthorized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If not authorized and user is logged in, you can add logic here if needed
  }, [user, authLoading, isAuthorized]);

  const handleRedirect = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#FFB800] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-[#0a0a0a] flex items-center justify-center px-6 text-white selection:bg-[#FFB800] selection:text-black">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
            <Lock className="text-red-500" size={40} />
          </div>
          <h1 className="text-2xl font-black mb-4 uppercase tracking-tighter">{t('common.unauthorized')}</h1>
          <p className="text-gray-400 mb-8 font-medium leading-relaxed">
            {t('common.unauthorizedDesc')}
          </p>
          <div className="flex flex-col gap-3">
            {!user && (
              <button 
                onClick={login}
                className="w-full bg-[#FFB800] text-black font-bold py-4 rounded-xl border border-[#FFB800] transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                <LogIn size={16} />
                <span>{t('navbar.login')}</span>
              </button>
            )}
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl border border-white/10 transition-all uppercase tracking-widest text-xs lg:flex hidden items-center justify-center"
            >
              {t('common.backToHome')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#0a0a0a] text-white selection:bg-[#FFB800] selection:text-black">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-[#FFB800]/5 blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-white/5 blur-[120px] -z-10" />

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <header className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center max-w-3xl mx-auto"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1px] w-12 bg-[#FFB800]" />
              <span className="text-[#FFB800] font-black tracking-[0.3em] text-sm uppercase">REAL BUILDER SHOP</span>
              <div className="h-[1px] w-12 bg-[#FFB800]" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter uppercase italic">
              {t('store.title')}
            </h1>
            <p className="text-xl text-gray-400 font-medium leading-relaxed">
              {t('store.subtitle')}
            </p>
          </motion.div>
        </header>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + (idx * 0.1) }}
              className="group relative"
            >
              <div className="bg-[#111315] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col h-full transition-all duration-500 hover:border-[#FFB800]/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                
                {/* Product Image Container */}
                <div className="relative h-64 overflow-hidden group-hover:scale-[1.02] transition-transform duration-700">
                  <img 
                    src={product.image} 
                    alt={t(`mobility.${product.id}.name`)}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-6 right-6 font-mono text-2xl font-black text-[#FFB800] drop-shadow-lg">
                    €{product.price}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight group-hover:text-[#FFB800] transition-colors leading-tight">
                    {t(`mobility.${product.id}.name`)}
                  </h3>
                  <p className="text-gray-500 font-bold text-[10px] tracking-widest uppercase mb-6">
                    {t(`mobility.${product.id}.desc`)}
                  </p>

                  <div className="mt-auto">
                    <button 
                      onClick={() => handleRedirect(product.link)}
                      className="w-full bg-[#FFB800] text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white transition-all transform active:scale-95 group/btn"
                    >
                      <ShoppingBag size={18} className="group-hover/btn:scale-110 transition-transform" />
                      <span className="tracking-widest uppercase text-sm">{t('store.buyNow')}</span>
                      <ArrowRight size={18} className="opacity-0 -translate-x-4 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Decorative Corner Element */}
              <div className="absolute -top-2 -right-2 w-16 h-16 bg-[#FFB800]/20 rounded-full blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>

        {/* Footer Banner - Hide on mobile/tablet */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 p-12 rounded-[3rem] bg-gradient-to-br from-[#111315] to-[#0a0a0a] border border-[#FFB800]/20 text-center relative overflow-hidden group hidden lg:block"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase italic tracking-tighter">
              {t('store.joinTitle')} <span className="text-[#FFB800]">REAL BUILDER?</span>
            </h2>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('openNotifyMe'))}
              className="bg-white text-black font-black px-12 py-5 rounded-full hover:bg-[#FFB800] transition-all transform hover:scale-105 active:scale-95 tracking-[0.2em] uppercase text-sm shadow-xl"
            >
              {t('store.joinButton')}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

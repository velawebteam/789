import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import BrandName from './BrandName';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-[#0a0a0a] py-12 md:py-16 border-t border-white/10 text-gray-500 text-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
          {/* Brand */}
          <div className="flex flex-col items-start">
            <Link 
              to="/"
              onClick={scrollToTop}
              className="cursor-pointer mb-4"
            >
              <img 
                src="https://lh3.googleusercontent.com/d/1JcDlCqhCcECmb6aCnMHr_G_Qj-FeGBHn" 
                alt="Real Builder Logo" 
                className="h-20 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </Link>
            <p className="text-gray-400 mt-2 max-w-xs">
              {t('footer.desc')}
            </p>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-2">{t('footer.contactUs')}</h4>
            <a 
              href="https://wa.me/351939996924" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 group hover:text-white transition-colors"
            >
              <div className="w-4 h-4 text-[#FFB800] group-hover:text-[#25D366] transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <span className="text-gray-300 group-hover:text-white transition-colors">WhatsApp</span>
            </a>
            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-[#FFB800]" />
              <span className="text-gray-300">Avenida Mateus Teixeira Azevedo 55, Tavira</span>
            </div>
          </div>

          {/* Members Area */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-2">Members Area</h4>
            <Link to="/store" onClick={scrollToTop} className="hover:text-white transition-colors w-fit">{t('navbar.store')}</Link>
            <Link to="/chat" onClick={scrollToTop} className="hover:text-white transition-colors w-fit">{t('navbar.chat')}</Link>
            <Link to="/maintenance" onClick={scrollToTop} className="hover:text-white transition-colors w-fit">{t('maintenance.title')}</Link>
            <Link to="/clock-in" onClick={scrollToTop} className="hover:text-white transition-colors w-fit">{t('navbar.clockIn')}</Link>
            <Link to="/billing" onClick={scrollToTop} className="hover:text-white transition-colors w-fit">{t('navbar.billing')}</Link>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-2">{t('footer.legal')}</h4>
            <Link to="/faq" onClick={scrollToTop} className="hover:text-white transition-colors w-fit">{t('footer.faq')}</Link>
            <Link to="/terms" onClick={scrollToTop} className="hover:text-white transition-colors w-fit">{t('footer.terms')}</Link>
            <Link to="/privacy" onClick={scrollToTop} className="hover:text-white transition-colors w-fit">{t('footer.privacy')}</Link>
            <Link to="/cookies" onClick={scrollToTop} className="hover:text-white transition-colors w-fit">{t('cookiePolicy.title')}</Link>
            <a href="https://livroreclamacoes.pt/inicio/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors w-fit">{t('footer.complaints')}</a>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-start text-xs gap-2 md:gap-4">
          <p>© {new Date().getFullYear()}{' '}<BrandName withAcademy />. {t('footer.allRights')}</p>
          <span className="hidden md:inline text-gray-700">•</span>
          <p>
            {t('footer.developedBy')}{' '}<a href="https://agencia-vela.com" target="_blank" rel="noopener noreferrer" className="text-[#FFB800] hover:underline">Agência Vela</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

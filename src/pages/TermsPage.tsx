import { useEffect } from 'react';
import BrandName from '../components/BrandName';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';

export default function TermsPage() {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <SEO 
        title={`${t('terms.title')} | Real Builder Construction Academy`}
        description="Terms and conditions for using the services of Real Builder Construction Academy."
        canonical="https://realbuilder-academy.com/terms"
      />
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight uppercase">{t('terms.title')}</h1>
        
        <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
          <p className="text-sm text-gray-400">{t('terms.lastUpdated')}: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">{t('terms.introTitle')}</h2>
            <p>
              {t('terms.intro1', { brand: <BrandName withAcademy /> })}
            </p>
            <p>
              {t('terms.intro2')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">{t('terms.servicesTitle')}</h2>
            <p>
              {t('terms.services1', { brand: <BrandName withAcademy /> })}
            </p>
            <p>
              {t('terms.services2')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">{t('terms.enrollmentsTitle')}</h2>
            <p>
              {t('terms.enrollments1')}
            </p>
            <p>
              {t('terms.enrollments2')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">{t('terms.intellectualTitle')}</h2>
            <p>
              {t('terms.intellectual1', { brand: <BrandName withAcademy /> })}
            </p>
            <p>
              {t('terms.intellectual2')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">{t('terms.dataProtectionTitle')}</h2>
            <p>
              {t('terms.dataProtection1')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">{t('terms.limitationTitle')}</h2>
            <p>
              {t('terms.limitation1', { brand: <BrandName withAcademy /> })}
            </p>
            <p>
              {t('terms.limitation2', { brand: <BrandName withAcademy /> })}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">{t('terms.changesTitle')}</h2>
            <p>
              {t('terms.changes1')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">{t('terms.lawTitle')}</h2>
            <p>
              {t('terms.law1')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">{t('terms.contactsTitle')}</h2>
            <p>
              {t('terms.contacts1')}
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>WhatsApp: <a href="https://wa.me/351939996924" target="_blank" rel="noopener noreferrer" className="text-[#FFB800] hover:underline">WhatsApp</a></li>
              <li>{t('terms.addressLabel')}: Avenida Mateus Teixeira Azevedo 55, Tavira, Portugal</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

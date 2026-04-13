import { useEffect } from 'react';
import BrandName from '../components/BrandName';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';

export default function CookiePolicyPage() {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <SEO 
        title={`${t('cookiePolicy.title')} | Real Builder Construction Academy`}
        description="Cookie policy and usage information for Real Builder Construction Academy."
        canonical="https://realbuilder-academy.com/cookies"
      />
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight uppercase">{t('cookiePolicy.title')}</h1>
        
        <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
          <p className="text-sm text-gray-400">{t('privacy.lastUpdated')}: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">{t('cookiePolicy.introTitle')}</h2>
            <p>
              {t('cookiePolicy.intro1')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">{t('cookiePolicy.howWeUseTitle')}</h2>
            <p>
              {t('cookiePolicy.howWeUse1', { brand: <BrandName withAcademy /> })}
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-4">
              <li>
                <strong className="text-white">{t('cookiePolicy.essentialTitle')}:</strong>
                <p className="mt-1">{t('cookiePolicy.essentialDesc')}</p>
              </li>
              <li>
                <strong className="text-white">{t('cookiePolicy.analyticsTitle')}:</strong>
                <p className="mt-1">{t('cookiePolicy.analyticsDesc')}</p>
              </li>
              <li>
                <strong className="text-white">{t('cookiePolicy.functionalTitle')}:</strong>
                <p className="mt-1">{t('cookiePolicy.functionalDesc')}</p>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">{t('cookiePolicy.manageTitle')}</h2>
            <p>
              {t('cookiePolicy.manage1')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">{t('cookiePolicy.consentTitle')}</h2>
            <p>
              {t('cookiePolicy.consent1')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

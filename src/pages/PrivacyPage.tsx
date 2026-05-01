import { useEffect } from 'react';
import BrandName from '../components/BrandName';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';

export default function PrivacyPage() {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-16 min-h-screen">
      <SEO 
        title={`${t('privacy.title')} | Real Builder Construction Academy`}
        description="Privacy policy and data protection information for Real Builder Construction Academy."
        canonical="https://realbuilder-academy.com/privacy"
      />
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight uppercase">{t('privacy.title')}</h1>
        
        <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
          <p className="text-sm text-gray-400">{t('privacy.lastUpdated')}: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">{t('privacy.introTitle')}</h2>
            <p>
              {t('privacy.intro1', { brand: <BrandName withAcademy /> })}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">{t('privacy.controllerTitle')}</h2>
            <p>
              {t('privacy.controller1', { brand: <BrandName withAcademy /> })}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">{t('privacy.dataCollectTitle')}</h2>
            <p>
              {t('privacy.dataCollect1')}
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>{t('privacy.idData')}:</strong> {t('privacy.idDataDesc')}</li>
              <li><strong>{t('privacy.contactData')}:</strong> {t('privacy.contactDataDesc')}</li>
              <li><strong>{t('privacy.profData')}:</strong> {t('privacy.profDataDesc')}</li>
              <li><strong>{t('privacy.navData')}:</strong> {t('privacy.navDataDesc')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">{t('privacy.purposesTitle')}</h2>
            <p>
              {t('privacy.purposes1')}
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>{t('privacy.purpose1')}:</strong> {t('privacy.purpose1Desc')}</li>
              <li><strong>{t('privacy.purpose2')}:</strong> {t('privacy.purpose2Desc')}</li>
              <li><strong>{t('privacy.purpose3')}:</strong> {t('privacy.purpose3Desc')}</li>
              <li><strong>{t('privacy.purpose4')}:</strong> {t('privacy.purpose4Desc')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">{t('privacy.sharingTitle')}</h2>
            <p>
              {t('privacy.sharing1')}
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>{t('privacy.share1')}</li>
              <li>{t('privacy.share2')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">{t('privacy.retentionTitle')}</h2>
            <p>
              {t('privacy.retention1')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">{t('privacy.rightsTitle')}</h2>
            <p>
              {t('privacy.rights1')}
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>{t('privacy.right1')}</li>
              <li>{t('privacy.right2')}</li>
              <li>{t('privacy.right3')}</li>
              <li>{t('privacy.right4')}</li>
              <li>{t('privacy.right5')}</li>
              <li>{t('privacy.right6')}</li>
              <li>{t('privacy.right7')}</li>
            </ul>
            <p className="mt-4">
              {t('privacy.rightsContact')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">{t('privacy.securityTitle')}</h2>
            <p>
              {t('privacy.security1')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">{t('privacy.policyChangesTitle')}</h2>
            <p>
              {t('privacy.policyChanges1')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

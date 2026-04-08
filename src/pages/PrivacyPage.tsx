import { useEffect } from 'react';
import BrandName from '../components/BrandName';

export default function PrivacyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight uppercase">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
          <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString('en-US')}</p>
          
          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Introduction</h2>
            <p>
              <BrandName withAcademy />{' '}respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, share, and protect your personal information when you visit our website or use our services, in compliance with the General Data Protection Regulation (GDPR - Regulation (EU) 2016/679).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Data Controller</h2>
            <p>
              The entity responsible for processing your personal data is{' '}<BrandName withAcademy />, headquartered at Avenida Mateus Teixeira Azevedo 55, Tavira, Portugal.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Data We Collect</h2>
            <p>
              We may collect and process the following categories of personal data:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Identification Data:</strong> First name, last name.</li>
              <li><strong>Contact Data:</strong> Email address, phone number, city, district.</li>
              <li><strong>Professional and Academic Data:</strong> Education level, language skills, digital skills, experience in the construction industry, resume, and certificates (when submitted).</li>
              <li><strong>Navigation Data:</strong> IP address, browser type, pages visited, and time spent on our website (through cookies).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Purposes and Legal Basis</h2>
            <p>
              We use your personal data for the following purposes:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Enrollment Management:</strong> To process your application for our courses and assess your eligibility. (Legal basis: Performance of a contract or pre-contractual steps).</li>
              <li><strong>Communication:</strong> To respond to information requests, send course updates, and notify you of open enrollments. (Legal basis: Consent or legitimate interest).</li>
              <li><strong>Service Improvement:</strong> To analyze website usage and improve user experience. (Legal basis: Legitimate interest).</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations to which we are subject. (Legal basis: Legal obligation).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Data Sharing</h2>
            <p>
              We do not sell, rent, or share your personal data with third parties for commercial purposes. We may only share your data with:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Service providers acting on our behalf (e.g., web hosting services, form management platforms like Formspree).</li>
              <li>Competent authorities, when required by law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Data Retention</h2>
            <p>
              We retain your personal data only for the period strictly necessary to fulfill the purposes for which it was collected, or to comply with legal, tax, or regulatory obligations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Your Rights</h2>
            <p>
              Under the GDPR, you have the right to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Request access to your personal data.</li>
              <li>Request the rectification of inaccurate or incomplete data.</li>
              <li>Request the erasure of your data ("right to be forgotten").</li>
              <li>Request the restriction of processing.</li>
              <li>Object to the processing of your data.</li>
              <li>Request data portability.</li>
              <li>Withdraw consent at any time (without affecting the lawfulness of processing based on consent before its withdrawal).</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us by phone at +351 939 996 924. You also have the right to lodge a complaint with the National Data Protection Commission (CNPD) in Portugal.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized destruction, loss, alteration, disclosure, or access.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">9. Changes to this Policy</h2>
            <p>
              We may update this Privacy Policy periodically. We recommend that you review this page regularly to stay informed about how we protect your data.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

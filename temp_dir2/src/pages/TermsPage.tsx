import { useEffect } from 'react';
import BrandName from '../components/BrandName';

export default function TermsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight uppercase">Terms and Conditions</h1>
        
        <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
          <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString('en-US')}</p>
          
          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Introduction</h2>
            <p>
              Welcome to{' '}<BrandName withAcademy />. These Terms and Conditions govern the access and use of our website and the services provided by{' '}<BrandName withAcademy />, headquartered at Avenida Mateus Teixeira Azevedo 55, Tavira, Portugal.
            </p>
            <p>
              By accessing and using this website, the user agrees to comply with and be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Services</h2>
            <p>
              <BrandName withAcademy />{' '}offers professional training courses in the construction industry, including, but not limited to, drywall installation, tiling, and underfloor heating installation.
            </p>
            <p>
              Enrollment in courses is subject to availability, meeting admission requirements, and payment of the respective tuition fees, where applicable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Enrollments and Payments</h2>
            <p>
              By submitting an enrollment form, the user guarantees that all information provided is true, accurate, and complete.
            </p>
            <p>
              Specific payment conditions, cancellation, and refund policies will be communicated to the user at the time of formalizing the enrollment in the respective course.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Intellectual Property</h2>
            <p>
              All content present on this website, including texts, graphics, logos, icons, images, audio clips, digital downloads, and data compilations, is the property of{' '}<BrandName withAcademy />{' '}or its content suppliers and is protected by Portuguese and international copyright laws.
            </p>
            <p>
              The reproduction, duplication, copying, selling, reselling, or exploitation of any part of the website for commercial purposes without our express written consent is not permitted.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Data Protection</h2>
            <p>
              The collection and processing of personal data are carried out in accordance with our Privacy Policy, in strict compliance with the General Data Protection Regulation (GDPR) and other applicable legislation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Limitation of Liability</h2>
            <p>
              <BrandName withAcademy />{' '}makes every effort to ensure that the information presented on the website is accurate and up-to-date. However, we do not guarantee the absence of errors or omissions.
            </p>
            <p>
              <BrandName withAcademy />{' '}shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this website or the services offered.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Changes to the Terms</h2>
            <p>
              We reserve the right to update or modify these Terms and Conditions at any time, without prior notice. Continued use of the website following any changes constitutes acceptance of the new Terms and Conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Applicable Law and Jurisdiction</h2>
            <p>
              These Terms and Conditions are governed by and construed in accordance with Portuguese law. For the resolution of any dispute arising from the interpretation or execution of these Terms, the jurisdiction of the district of Faro is competent, with express waiver of any other.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">9. Contacts</h2>
            <p>
              For any questions related to these Terms and Conditions, please contact us via:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Phone: +351 939 996 924</li>
              <li>Address: Avenida Mateus Teixeira Azevedo 55, Tavira, Portugal</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

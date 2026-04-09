/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import FAQPage from './pages/FAQPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import EnrollmentModal from './components/EnrollmentModal';
import NotifyMeModal from './components/NotifyMeModal';

import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);
  const [isNotifyMeOpen, setIsNotifyMeOpen] = useState(false);

  useEffect(() => {
    const handleOpenEnrollment = () => setIsEnrollmentOpen(true);
    const handleOpenNotifyMe = () => setIsNotifyMeOpen(true);

    window.addEventListener('openEnrollment', handleOpenEnrollment);
    window.addEventListener('openNotifyMe', handleOpenNotifyMe);

    return () => {
      window.removeEventListener('openEnrollment', handleOpenEnrollment);
      window.removeEventListener('openNotifyMe', handleOpenNotifyMe);
    };
  }, []);

  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#FFB800] selection:text-black">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
          </Routes>
          <Footer />
          <EnrollmentModal isOpen={isEnrollmentOpen} onClose={() => setIsEnrollmentOpen(false)} />
          <NotifyMeModal isOpen={isNotifyMeOpen} onClose={() => setIsNotifyMeOpen(false)} />
        </div>
      </Router>
    </LanguageProvider>
  );
}

import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import FAQPage from './pages/FAQPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import NotifyMeModal from './components/NotifyMeModal';
import EnrollmentModal from './components/EnrollmentModal';
import { LanguageProvider } from './i18n/LanguageContext';

export default function App() {
  const [isNotifyMeOpen, setIsNotifyMeOpen] = useState(false);
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);

  useEffect(() => {
    const handleOpenNotifyMe = () => setIsNotifyMeOpen(true);
    const handleOpenEnrollment = () => setIsEnrollmentOpen(true);

    window.addEventListener('openNotifyMe', handleOpenNotifyMe);
    window.addEventListener('openEnrollment', handleOpenEnrollment);

    return () => {
      window.removeEventListener('openNotifyMe', handleOpenNotifyMe);
      window.removeEventListener('openEnrollment', handleOpenEnrollment);
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
          
          <NotifyMeModal 
            isOpen={isNotifyMeOpen} 
            onClose={() => setIsNotifyMeOpen(false)} 
          />
          <EnrollmentModal 
            isOpen={isEnrollmentOpen} 
            onClose={() => setIsEnrollmentOpen(false)} 
          />
        </div>
      </Router>
    </LanguageProvider>
  );
}


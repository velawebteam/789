/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Store from './pages/Store';
import FAQPage from './pages/FAQPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import Admin from './pages/Admin';
import WorkersPanel from './pages/WorkersPanel';
import Chat from './pages/Chat';
import TimeTracker from './pages/TimeTracker';
import Maintenance from './pages/Maintenance';
import Billing from './pages/Billing';
import EnrollmentModal from './components/EnrollmentModal';
import NotifyMeModal from './components/NotifyMeModal';
import CookieConsent from './components/CookieConsent';
import SupportChat from './components/SupportChat';

import { LanguageProvider } from './context/LanguageContext';
import { CookieProvider } from './context/CookieContext';
import { AuthProvider } from './context/AuthContext';

function AppContent({ isEnrollmentOpen, setIsEnrollmentOpen, isNotifyMeOpen, setIsNotifyMeOpen }: 
  { isEnrollmentOpen: boolean, setIsEnrollmentOpen: (o: boolean) => void, isNotifyMeOpen: boolean, setIsNotifyMeOpen: (o: boolean) => void }) {
  const location = useLocation();
  const restrictedPaths = ['/chat', '/clock-in', '/maintenance', '/workers', '/admin', '/billing', '/store'];
  
  // Normalize path for check: remove trailing slash, convert to lowercase, and remove query params
  const currentPath = location.pathname.toLowerCase().replace(/\/$/, '') || '/';
  const isRestrictedPath = restrictedPaths.some(path => 
    currentPath === path.toLowerCase() || currentPath.startsWith(path.toLowerCase() + '/')
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#FFB800] selection:text-black">
      <div className={isRestrictedPath ? 'hidden lg:block' : ''}>
        <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<Store />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/cookies" element={<CookiePolicyPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/workers" element={<WorkersPanel />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/clock-in" element={<TimeTracker />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/billing" element={<Billing />} />
        {/* Catch-all redirect to home for unmatched routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <div className={isRestrictedPath ? 'hidden lg:block' : ''}>
        <Footer />
      </div>
      <EnrollmentModal isOpen={isEnrollmentOpen} onClose={() => setIsEnrollmentOpen(false)} />
      <NotifyMeModal isOpen={isNotifyMeOpen} onClose={() => setIsNotifyMeOpen(false)} />
      <CookieConsent />
      {location.pathname === '/' && <SupportChat />}
    </div>
  );
}

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
    <CookieProvider>
      <AuthProvider>
        <LanguageProvider>
          <Router>
            <AppContent 
              isEnrollmentOpen={isEnrollmentOpen} 
              setIsEnrollmentOpen={setIsEnrollmentOpen}
              isNotifyMeOpen={isNotifyMeOpen}
              setIsNotifyMeOpen={setIsNotifyMeOpen}
            />
          </Router>
        </LanguageProvider>
      </AuthProvider>
    </CookieProvider>
  );
}

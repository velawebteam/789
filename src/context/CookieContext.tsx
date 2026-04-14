import React, { createContext, useContext, useState, useEffect } from 'react';

type ConsentStatus = 'accepted' | 'rejected' | 'undecided';

interface CookieContextType {
  consent: ConsentStatus;
  acceptCookies: () => void;
  rejectCookies: () => void;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export const useCookieConsent = () => {
  const context = useContext(CookieContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieProvider');
  }
  return context;
};

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export const CookieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [consent, setConsent] = useState<ConsentStatus>('undecided');

  const acceptCookies = () => {
    setConsent('accepted');
    // Push event to GTM dataLayer
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'cookie_consent_accepted',
        consent_status: 'accepted'
      });
    }
  };

  const rejectCookies = () => {
    setConsent('rejected');
  };

  return (
    <CookieContext.Provider value={{ consent, acceptCookies, rejectCookies }}>
      {children}
    </CookieContext.Provider>
  );
};

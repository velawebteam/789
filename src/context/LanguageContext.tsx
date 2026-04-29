import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'pt' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: Record<string, any>) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

import { translations } from '../constants/translations';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Check localStorage first
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && ['en', 'pt', 'hi'].includes(savedLang)) return savedLang;

    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'pt') return 'pt';
    if (browserLang === 'hi') return 'hi';
    
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (path: string, replacements?: Record<string, any>) => {
    const keys = path.split('.');
    let current: any = translations[language];
    
    for (const key of keys) {
      if (current[key] === undefined) {
        // Fallback to English if key not found in current language
        let fallback: any = translations['en'];
        for (const fallbackKey of keys) {
          if (fallback[fallbackKey] === undefined) return path;
          fallback = fallback[fallbackKey];
        }
        current = fallback;
        break;
      }
      current = current[key];
    }

    if (typeof current === 'string') {
      let result = current;
      
      // Handle replacements
      const allReplacements: Record<string, any> = { brand: "Real Builder", ...replacements };
      
      Object.keys(allReplacements).forEach(key => {
        const value = allReplacements[key];
        // If value is a React element (object) or null/undefined, use "Real Builder" for 'brand' key, 
        // otherwise use string representation
        let replacementValue: string;
        if (key === 'brand' && (typeof value !== 'string')) {
          replacementValue = "Real Builder";
        } else {
          replacementValue = String(value);
        }
        
        result = result.replace(new RegExp(`{${key}}`, 'gi'), replacementValue);
      });
      
      return result;
    }

    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

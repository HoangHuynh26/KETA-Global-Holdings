import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '../locales/en';
import { vi } from '../locales/vi';
import { zh } from '../locales/zh';

export const AVAILABLE_LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN', nativeName: 'English' },
  { code: 'vi', label: 'Tiếng Việt', short: 'VI', nativeName: 'Tiếng Việt' },
  { code: 'zh', label: '简体中文', short: '中文', nativeName: '简体中文' }
];

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem('keta_lang');
      if (saved === 'vi' || saved === 'en' || saved === 'zh') {
        return saved;
      }
      return 'en'; // Default to English for international first impression
    } catch {
      return 'en';
    }
  });

  const setLang = (newLang) => {
    if (newLang === 'en' || newLang === 'vi' || newLang === 'zh') {
      setLangState(newLang);
      try {
        localStorage.setItem('keta_lang', newLang);
      } catch (err) {
        console.warn('LocalStorage access warning:', err);
      }
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
  }, [lang]);

  const translations = { en, vi, zh };
  const t = translations[lang] || en;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, languages: AVAILABLE_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

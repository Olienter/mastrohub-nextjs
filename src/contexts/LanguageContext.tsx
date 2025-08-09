'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  SupportedLanguage, 
  DEFAULT_LANGUAGE, 
  detectLanguage, 
  useTranslation,
  LanguageContextType 
} from '@/lib/i18n';

interface LanguageProviderProps {
  children: ReactNode;
  initialLanguage?: SupportedLanguage;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ 
  children, 
  initialLanguage = DEFAULT_LANGUAGE 
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<SupportedLanguage>(initialLanguage);
  const { t } = useTranslation(language);

  // Detect language on mount
  useEffect(() => {
    const detectedLanguage = detectLanguage();
    setLanguageState(detectedLanguage);
  }, []);

  // Save language preference to localStorage and API
  const setLanguage = async (lang: SupportedLanguage) => {
    setLanguageState(lang);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('mastrohub-language', lang);
    }
    
    // Save to API if user is authenticated
    try {
      const response = await fetch('/api/language', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language: lang }),
      });
      
      if (!response.ok) {
        console.warn('Failed to save language preference to API');
      }
    } catch (error) {
      console.warn('Error saving language preference:', error);
    }
  };

  // Load language preference from localStorage and API
  useEffect(() => {
    const loadLanguagePreference = async () => {
      // First try to load from localStorage
      if (typeof window !== 'undefined') {
        const savedLanguage = localStorage.getItem('mastrohub-language') as SupportedLanguage;
        if (savedLanguage && Object.keys(SUPPORTED_LANGUAGES).includes(savedLanguage)) {
          setLanguageState(savedLanguage);
        }
      }
      
      // Then try to load from API
      try {
        const response = await fetch('/api/language?type=preference');
        if (response.ok) {
          const data = await response.json();
          if (data.language && Object.keys(SUPPORTED_LANGUAGES).includes(data.language)) {
            setLanguageState(data.language);
            // Update localStorage with API preference
            if (typeof window !== 'undefined') {
              localStorage.setItem('mastrohub-language', data.language);
            }
          }
        }
      } catch (error) {
        console.warn('Error loading language preference from API:', error);
      }
    };
    
    loadLanguagePreference();
  }, []);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Import SUPPORTED_LANGUAGES for use in the context
import { SUPPORTED_LANGUAGES } from '@/lib/i18n';

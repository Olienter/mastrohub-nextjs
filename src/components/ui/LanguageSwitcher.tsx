'use client';

import React, { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '@/lib/i18n';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'dropdown' | 'buttons';
}

export function LanguageSwitcher({ 
  className = '', 
  variant = 'dropdown' 
}: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = async (newLanguage: SupportedLanguage) => {
    await setLanguage(newLanguage);
    setIsOpen(false);
  };

  if (variant === 'buttons') {
    return (
      <div className={`flex gap-2 ${className}`}>
        {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
          <button
            key={code}
            onClick={() => handleLanguageChange(code as SupportedLanguage)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              language === code
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {lang.flag} {lang.name}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-surface border border-border rounded-md hover:bg-accent transition-colors text-fg"
      >
        <Globe className="w-4 h-4 text-muted" />
        <span className="text-sm font-medium text-fg">
          {SUPPORTED_LANGUAGES[language].flag} {SUPPORTED_LANGUAGES[language].name}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform text-muted ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-md shadow-lg z-50">
          {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
            <button
              key={code}
              onClick={() => handleLanguageChange(code as SupportedLanguage)}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors ${
                language === code
                  ? 'bg-accent text-primary'
                  : 'text-fg'
              }`}
            >
              {lang.flag} {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function CompactLanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = async (newLanguage: SupportedLanguage) => {
    await setLanguage(newLanguage);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 text-sm text-fg"
      >
        <span>{SUPPORTED_LANGUAGES[language].flag}</span>
        <ChevronDown className={`w-3 h-3 transition-transform text-muted ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-surface border border-border rounded-md shadow-lg z-50 min-w-[120px]">
          {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
            <button
              key={code}
              onClick={() => handleLanguageChange(code as SupportedLanguage)}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors ${
                language === code
                  ? 'bg-accent text-primary'
                  : 'text-fg'
              }`}
            >
              {lang.flag} {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

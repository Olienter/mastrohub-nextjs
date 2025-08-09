'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '@/lib/i18n';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { CheckCircle, Globe, Settings, Info } from 'lucide-react';

interface LanguageSettings {
  currentLanguage: SupportedLanguage;
  browserLanguage: string;
  savedLanguage: string | null;
  isAutoDetect: boolean;
}

export default function LanguageSettingsPage() {
  const { language, setLanguage, t } = useLanguage();
  const [settings, setSettings] = useState<LanguageSettings>({
    currentLanguage: language,
    browserLanguage: '',
    savedLanguage: null,
    isAutoDetect: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Detect browser language
    const browserLang = navigator.language.split('-')[0];
    const savedLang = localStorage.getItem('mastrohub-language');
    
    setSettings(prev => ({
      ...prev,
      browserLanguage: browserLang,
      savedLanguage: savedLang,
      isAutoDetect: !savedLang
    }));
  }, []);

  const handleLanguageChange = async (newLanguage: SupportedLanguage) => {
    setLoading(true);
    try {
      await setLanguage(newLanguage);
      setSettings(prev => ({
        ...prev,
        currentLanguage: newLanguage,
        isAutoDetect: false
      }));
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetToBrowserLanguage = async () => {
    const browserLang = navigator.language.split('-')[0];
    const supportedLang = Object.keys(SUPPORTED_LANGUAGES).includes(browserLang) 
      ? browserLang as SupportedLanguage 
      : 'en';
    
    await handleLanguageChange(supportedLang);
    setSettings(prev => ({
      ...prev,
      isAutoDetect: true
    }));
  };

  const resetToDefault = async () => {
    await handleLanguageChange('en');
    setSettings(prev => ({
      ...prev,
      isAutoDetect: false
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              {t('settings.language')}
            </h1>
          </div>
          <p className="text-gray-600">
            {t('settings.languageDescription')}
          </p>
        </div>

        {/* Current Language Display */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {t('settings.currentLanguage')}
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{SUPPORTED_LANGUAGES[language].flag}</span>
                <div>
                  <p className="font-medium text-gray-900">
                    {SUPPORTED_LANGUAGES[language].name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t('settings.languageCode')}: {language}
                  </p>
                </div>
              </div>
            </div>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
        </div>

        {/* Language Options */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t('settings.availableLanguages')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
              <div
                key={code}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  language === code
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleLanguageChange(code as SupportedLanguage)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{lang.name}</p>
                    <p className="text-sm text-gray-500">{code.toUpperCase()}</p>
                  </div>
                  {language === code && (
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t('settings.quickActions')}
          </h2>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={resetToBrowserLanguage}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {t('settings.useBrowserLanguage')}
            </button>
            
            <button
              onClick={resetToDefault}
              disabled={loading}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              {t('settings.resetToDefault')}
            </button>
            
            <button
              onClick={() => setSettings(prev => ({ ...prev, isAutoDetect: true }))}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {t('settings.enableAutoDetect')}
            </button>
          </div>
        </div>

        {/* Language Information */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                {t('settings.languageInfo')}
              </h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p>
                  <strong>{t('settings.currentLanguage')}:</strong> {SUPPORTED_LANGUAGES[language].name} ({language})
                </p>
                <p>
                  <strong>{t('settings.browserLanguage')}:</strong> {settings.browserLanguage}
                </p>
                <p>
                  <strong>{t('settings.savedLanguage')}:</strong> {settings.savedLanguage || t('settings.notSet')}
                </p>
                <p>
                  <strong>{t('settings.autoDetect')}:</strong> {settings.isAutoDetect ? t('common.yes') : t('common.no')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">{t('common.loading')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

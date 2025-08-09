// Supported languages
export const SUPPORTED_LANGUAGES = {
  'sk': { name: 'Slovenčina', flag: '🇸🇰' },
  'en': { name: 'English', flag: '🇺🇸' },
  'cs': { name: 'Čeština', flag: '🇨🇿' },
  'de': { name: 'Deutsch', flag: '🇩🇪' },
  'hu': { name: 'Magyar', flag: '🇭🇺' },
  'pl': { name: 'Polski', flag: '🇵🇱' }
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

// Default language
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

// Language detection
export function detectLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  
  const browserLang = navigator.language.split('-')[0];
  return Object.keys(SUPPORTED_LANGUAGES).includes(browserLang) 
    ? browserLang as SupportedLanguage 
    : DEFAULT_LANGUAGE;
}

// Translation keys interface
export interface TranslationKeys {
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    add: string;
    search: string;
    filter: string;
    sort: string;
    refresh: string;
    back: string;
    next: string;
    previous: string;
    close: string;
    confirm: string;
    yes: string;
    no: string;
    ok: string;
    signIn: string;
    join: string;
  };
  
  // Navigation
  navigation: {
    dashboard: string;
    menuMaker: string;
    marketing: string;
    training: string;
    analytics: string;
    settings: string;
    profile: string;
    logout: string;
  };
  
  // Dashboard
  dashboard: {
    title: string;
    welcome: string;
    quickStats: string;
    recentActivity: string;
    quickActions: string;
    notifications: string;
  };
  
  // Menu Maker
  menuMaker: {
    title: string;
    addItem: string;
    editItem: string;
    deleteItem: string;
    categories: string;
    ingredients: string;
    allergens: string;
    preparation: string;
    pricing: string;
    sustainability: string;
    analytics: string;
    supplyChain: string;
    financial: string;
    aiInterview: string;
    aiAssistant: string;
  };
  
  // AI Assistant
  aiAssistant: {
    title: string;
    welcome: string;
    askQuestion: string;
    quickSuggestions: string;
    thinking: string;
    error: string;
    minimize: string;
    maximize: string;
  };
  
  // Marketing
  marketing: {
    title: string;
    campaigns: string;
    contacts: string;
    analytics: string;
    aiAssistant: string;
  };
  
  // Training
  training: {
    title: string;
    courses: string;
    progress: string;
    assignments: string;
    certificates: string;
  };
  
  // Analytics
  analytics: {
    title: string;
    overview: string;
    menuAnalytics: string;
    revenue: string;
    qrAnalytics: string;
    marketing: string;
  };
  
  // Settings
  settings: {
    title: string;
    general: string;
    notifications: string;
    privacy: string;
    branding: string;
    language: string;
    languageDescription: string;
    currentLanguage: string;
    languageCode: string;
    availableLanguages: string;
    quickActions: string;
    useBrowserLanguage: string;
    resetToDefault: string;
    enableAutoDetect: string;
    languageInfo: string;
    browserLanguage: string;
    savedLanguage: string;
    autoDetect: string;
    notSet: string;
  };
}

// Translation data
export const translations: Record<SupportedLanguage, TranslationKeys> = {
  sk: {
    common: {
      loading: 'Načítavam...',
      error: 'Chyba',
      success: 'Úspech',
      cancel: 'Zrušiť',
      save: 'Uložiť',
      delete: 'Vymazať',
      edit: 'Upraviť',
      add: 'Pridať',
      search: 'Hľadať',
      filter: 'Filtrovať',
      sort: 'Zoradiť',
      refresh: 'Obnoviť',
      back: 'Späť',
      next: 'Ďalej',
      previous: 'Predchádzajúce',
      close: 'Zavrieť',
      confirm: 'Potvrdiť',
      yes: 'Áno',
      no: 'Nie',
      ok: 'OK',
      signIn: 'Prihlásiť sa',
      join: 'Pridať sa'
    },
    navigation: {
      dashboard: 'Dashboard',
      menuMaker: 'Menu Maker',
      marketing: 'Marketing',
      training: 'Školenie',
      analytics: 'Analytika',
      settings: 'Nastavenia',
      profile: 'Profil',
      logout: 'Odhlásiť sa'
    },
    dashboard: {
      title: 'Dashboard',
      welcome: 'Vitajte v MastroHub',
      quickStats: 'Rýchle štatistiky',
      recentActivity: 'Posledná aktivita',
      quickActions: 'Rýchle akcie',
      notifications: 'Notifikácie'
    },
    menuMaker: {
      title: 'Menu Maker',
      addItem: 'Pridať položku',
      editItem: 'Upraviť položku',
      deleteItem: 'Vymazať položku',
      categories: 'Kategórie',
      ingredients: 'Ingrediencie',
      allergens: 'Alergény',
      preparation: 'Príprava',
      pricing: 'Cenotvorba',
      sustainability: 'Udržateľnosť',
      analytics: 'Analytika',
      supplyChain: 'Dodávateľský reťazec',
      financial: 'Financie',
      aiInterview: 'AI Interview',
      aiAssistant: 'AI Asistent'
    },
    aiAssistant: {
      title: 'AI Asistent',
      welcome: 'Ako vám môžem pomôcť?',
      askQuestion: 'Opýtajte sa niečo...',
      quickSuggestions: 'Rýchle návrhy',
      thinking: 'Myslím...',
      error: 'Nastala chyba',
      minimize: 'Minimalizovať',
      maximize: 'Maximalizovať'
    },
    marketing: {
      title: 'Marketing',
      campaigns: 'Kampane',
      contacts: 'Kontakty',
      analytics: 'Analytika',
      aiAssistant: 'AI Asistent'
    },
    training: {
      title: 'Školenie',
      courses: 'Kurzy',
      progress: 'Pokrok',
      assignments: 'Zadania',
      certificates: 'Certifikáty'
    },
    analytics: {
      title: 'Analytika',
      overview: 'Prehľad',
      menuAnalytics: 'Analytika menu',
      revenue: 'Príjmy',
      qrAnalytics: 'QR Analytika',
      marketing: 'Marketing'
    },
    settings: {
      title: 'Nastavenia',
      general: 'Všeobecné',
      notifications: 'Notifikácie',
      privacy: 'Súkromie',
      branding: 'Značka',
      language: 'Jazyk',
      languageDescription: 'Nastavte si jazyk aplikácie podľa vašich preferencií.',
      currentLanguage: 'Aktuálny jazyk',
      languageCode: 'Kód jazyka',
      availableLanguages: 'Dostupné jazyky',
      quickActions: 'Rýchle akcie',
      useBrowserLanguage: 'Použiť jazyk prehliadača',
      resetToDefault: 'Obnoviť predvolené',
      enableAutoDetect: 'Povoliť automatickú detekciu',
      languageInfo: 'Informácie o jazyku',
      browserLanguage: 'Jazyk prehliadača',
      savedLanguage: 'Uložený jazyk',
      autoDetect: 'Automatická detekcia',
      notSet: 'Nie je nastavené'
    }
  },
  en: {
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      refresh: 'Refresh',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      signIn: 'Sign In',
      join: 'Join'
    },
    navigation: {
      dashboard: 'Dashboard',
      menuMaker: 'Menu Maker',
      marketing: 'Marketing',
      training: 'Training',
      analytics: 'Analytics',
      settings: 'Settings',
      profile: 'Profile',
      logout: 'Logout'
    },
    dashboard: {
      title: 'Dashboard',
      welcome: 'Welcome to MastroHub',
      quickStats: 'Quick Stats',
      recentActivity: 'Recent Activity',
      quickActions: 'Quick Actions',
      notifications: 'Notifications'
    },
    menuMaker: {
      title: 'Menu Maker',
      addItem: 'Add Item',
      editItem: 'Edit Item',
      deleteItem: 'Delete Item',
      categories: 'Categories',
      ingredients: 'Ingredients',
      allergens: 'Allergens',
      preparation: 'Preparation',
      pricing: 'Pricing',
      sustainability: 'Sustainability',
      analytics: 'Analytics',
      supplyChain: 'Supply Chain',
      financial: 'Financial',
      aiInterview: 'AI Interview',
      aiAssistant: 'AI Assistant'
    },
    aiAssistant: {
      title: 'AI Assistant',
      welcome: 'How can I help you?',
      askQuestion: 'Ask a question...',
      quickSuggestions: 'Quick suggestions',
      thinking: 'Thinking...',
      error: 'An error occurred',
      minimize: 'Minimize',
      maximize: 'Maximize'
    },
    marketing: {
      title: 'Marketing',
      campaigns: 'Campaigns',
      contacts: 'Contacts',
      analytics: 'Analytics',
      aiAssistant: 'AI Assistant'
    },
    training: {
      title: 'Training',
      courses: 'Courses',
      progress: 'Progress',
      assignments: 'Assignments',
      certificates: 'Certificates'
    },
    analytics: {
      title: 'Analytics',
      overview: 'Overview',
      menuAnalytics: 'Menu Analytics',
      revenue: 'Revenue',
      qrAnalytics: 'QR Analytics',
      marketing: 'Marketing'
    },
    settings: {
      title: 'Settings',
      general: 'General',
      notifications: 'Notifications',
      privacy: 'Privacy',
      branding: 'Branding',
      language: 'Language',
      languageDescription: 'Set the application language according to your preferences.',
      currentLanguage: 'Current Language',
      languageCode: 'Language Code',
      availableLanguages: 'Available Languages',
      quickActions: 'Quick Actions',
      useBrowserLanguage: 'Use Browser Language',
      resetToDefault: 'Reset to Default',
      enableAutoDetect: 'Enable Auto Detect',
      languageInfo: 'Language Information',
      browserLanguage: 'Browser Language',
      savedLanguage: 'Saved Language',
      autoDetect: 'Auto Detect',
      notSet: 'Not Set'
    }
  },
  cs: {
    common: {
      loading: 'Načítání...',
      error: 'Chyba',
      success: 'Úspěch',
      cancel: 'Zrušit',
      save: 'Uložit',
      delete: 'Smazat',
      edit: 'Upravit',
      add: 'Přidat',
      search: 'Hledat',
      filter: 'Filtrovat',
      sort: 'Seřadit',
      refresh: 'Obnovit',
      back: 'Zpět',
      next: 'Další',
      previous: 'Předchozí',
      close: 'Zavřít',
      confirm: 'Potvrdit',
      yes: 'Ano',
      no: 'Ne',
      ok: 'OK',
      signIn: 'Přihlásit se',
      join: 'Přidat se'
    },
    navigation: {
      dashboard: 'Dashboard',
      menuMaker: 'Menu Maker',
      marketing: 'Marketing',
      training: 'Školení',
      analytics: 'Analytika',
      settings: 'Nastavení',
      profile: 'Profil',
      logout: 'Odhlásit se'
    },
    dashboard: {
      title: 'Dashboard',
      welcome: 'Vítejte v MastroHub',
      quickStats: 'Rychlé statistiky',
      recentActivity: 'Poslední aktivita',
      quickActions: 'Rychlé akce',
      notifications: 'Notifikace'
    },
    menuMaker: {
      title: 'Menu Maker',
      addItem: 'Přidat položku',
      editItem: 'Upravit položku',
      deleteItem: 'Smazat položku',
      categories: 'Kategorie',
      ingredients: 'Ingredience',
      allergens: 'Alergeny',
      preparation: 'Příprava',
      pricing: 'Cenotvorba',
      sustainability: 'Udržitelnost',
      analytics: 'Analytika',
      supplyChain: 'Dodavatelský řetězec',
      financial: 'Finance',
      aiInterview: 'AI Interview',
      aiAssistant: 'AI Asistent'
    },
    aiAssistant: {
      title: 'AI Asistent',
      welcome: 'Jak vám mohu pomoci?',
      askQuestion: 'Zeptejte se na něco...',
      quickSuggestions: 'Rychlé návrhy',
      thinking: 'Myslím...',
      error: 'Nastala chyba',
      minimize: 'Minimalizovat',
      maximize: 'Maximalizovat'
    },
    marketing: {
      title: 'Marketing',
      campaigns: 'Kampaně',
      contacts: 'Kontakty',
      analytics: 'Analytika',
      aiAssistant: 'AI Asistent'
    },
    training: {
      title: 'Školení',
      courses: 'Kurzy',
      progress: 'Pokrok',
      assignments: 'Zadání',
      certificates: 'Certifikáty'
    },
    analytics: {
      title: 'Analytika',
      overview: 'Přehled',
      menuAnalytics: 'Analytika menu',
      revenue: 'Příjmy',
      qrAnalytics: 'QR Analytika',
      marketing: 'Marketing'
    },
    settings: {
      title: 'Nastavení',
      general: 'Obecné',
      notifications: 'Notifikace',
      privacy: 'Soukromí',
      branding: 'Značka',
      language: 'Jazyk',
      languageDescription: 'Nastavte si jazyk aplikace podle vašich preferencí.',
      currentLanguage: 'Aktuální jazyk',
      languageCode: 'Kód jazyka',
      availableLanguages: 'Dostupné jazyky',
      quickActions: 'Rychlé akce',
      useBrowserLanguage: 'Použít jazyk prohlížeče',
      resetToDefault: 'Obnovit výchozí',
      enableAutoDetect: 'Povolit automatickou detekci',
      languageInfo: 'Informace o jazyku',
      browserLanguage: 'Jazyk prohlížeče',
      savedLanguage: 'Uložený jazyk',
      autoDetect: 'Automatická detekce',
      notSet: 'Není nastaveno'
    }
  },
  de: {
    common: {
      loading: 'Laden...',
      error: 'Fehler',
      success: 'Erfolg',
      cancel: 'Abbrechen',
      save: 'Speichern',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      add: 'Hinzufügen',
      search: 'Suchen',
      filter: 'Filter',
      sort: 'Sortieren',
      refresh: 'Aktualisieren',
      back: 'Zurück',
      next: 'Weiter',
      previous: 'Zurück',
      close: 'Schließen',
      confirm: 'Bestätigen',
      yes: 'Ja',
      no: 'Nein',
      ok: 'OK',
      signIn: 'Anmelden',
      join: 'Beitreten'
    },
    navigation: {
      dashboard: 'Dashboard',
      menuMaker: 'Menu Maker',
      marketing: 'Marketing',
      training: 'Schulung',
      analytics: 'Analytik',
      settings: 'Einstellungen',
      profile: 'Profil',
      logout: 'Abmelden'
    },
    dashboard: {
      title: 'Dashboard',
      welcome: 'Willkommen bei MastroHub',
      quickStats: 'Schnelle Statistiken',
      recentActivity: 'Letzte Aktivität',
      quickActions: 'Schnelle Aktionen',
      notifications: 'Benachrichtigungen'
    },
    menuMaker: {
      title: 'Menu Maker',
      addItem: 'Element hinzufügen',
      editItem: 'Element bearbeiten',
      deleteItem: 'Element löschen',
      categories: 'Kategorien',
      ingredients: 'Zutaten',
      allergens: 'Allergene',
      preparation: 'Zubereitung',
      pricing: 'Preisgestaltung',
      sustainability: 'Nachhaltigkeit',
      analytics: 'Analytik',
      supplyChain: 'Lieferkette',
      financial: 'Finanzen',
      aiInterview: 'KI-Interview',
      aiAssistant: 'KI-Assistent'
    },
    aiAssistant: {
      title: 'KI-Assistent',
      welcome: 'Wie kann ich Ihnen helfen?',
      askQuestion: 'Stellen Sie eine Frage...',
      quickSuggestions: 'Schnelle Vorschläge',
      thinking: 'Denke...',
      error: 'Ein Fehler ist aufgetreten',
      minimize: 'Minimieren',
      maximize: 'Maximieren'
    },
    marketing: {
      title: 'Marketing',
      campaigns: 'Kampagnen',
      contacts: 'Kontakte',
      analytics: 'Analytik',
      aiAssistant: 'KI-Assistent'
    },
    training: {
      title: 'Schulung',
      courses: 'Kurse',
      progress: 'Fortschritt',
      assignments: 'Aufgaben',
      certificates: 'Zertifikate'
    },
    analytics: {
      title: 'Analytik',
      overview: 'Übersicht',
      menuAnalytics: 'Menü-Analytik',
      revenue: 'Einnahmen',
      qrAnalytics: 'QR-Analytik',
      marketing: 'Marketing'
    },
    settings: {
      title: 'Einstellungen',
      general: 'Allgemein',
      notifications: 'Benachrichtigungen',
      privacy: 'Datenschutz',
      branding: 'Marke',
      language: 'Sprache',
      languageDescription: 'Stellen Sie die Sprache der Anwendung nach Ihren Präferenzen ein.',
      currentLanguage: 'Aktuelle Sprache',
      languageCode: 'Sprachcode',
      availableLanguages: 'Verfügbare Sprachen',
      quickActions: 'Schnelle Aktionen',
      useBrowserLanguage: 'Browser-Sprache verwenden',
      resetToDefault: 'Auf Standard zurücksetzen',
      enableAutoDetect: 'Automatische Erkennung aktivieren',
      languageInfo: 'Sprachinformationen',
      browserLanguage: 'Browser-Sprache',
      savedLanguage: 'Gespeicherte Sprache',
      autoDetect: 'Automatische Erkennung',
      notSet: 'Nicht gesetzt'
    }
  },
  hu: {
    common: {
      loading: 'Betöltés...',
      error: 'Hiba',
      success: 'Siker',
      cancel: 'Mégse',
      save: 'Mentés',
      delete: 'Törlés',
      edit: 'Szerkesztés',
      add: 'Hozzáadás',
      search: 'Keresés',
      filter: 'Szűrés',
      sort: 'Rendezés',
      refresh: 'Frissítés',
      back: 'Vissza',
      next: 'Következő',
      previous: 'Előző',
      close: 'Bezárás',
      confirm: 'Megerősítés',
      yes: 'Igen',
      no: 'Nem',
      ok: 'OK',
      signIn: 'Bejelentkezés',
      join: 'Csatlakozás'
    },
    navigation: {
      dashboard: 'Dashboard',
      menuMaker: 'Menu Maker',
      marketing: 'Marketing',
      training: 'Képzés',
      analytics: 'Analitika',
      settings: 'Beállítások',
      profile: 'Profil',
      logout: 'Kijelentkezés'
    },
    dashboard: {
      title: 'Dashboard',
      welcome: 'Üdvözöljük a MastroHub-ban',
      quickStats: 'Gyors statisztikák',
      recentActivity: 'Legutóbbi tevékenység',
      quickActions: 'Gyors műveletek',
      notifications: 'Értesítések'
    },
    menuMaker: {
      title: 'Menu Maker',
      addItem: 'Elem hozzáadása',
      editItem: 'Elem szerkesztése',
      deleteItem: 'Elem törlése',
      categories: 'Kategóriák',
      ingredients: 'Hozzávalók',
      allergens: 'Allergének',
      preparation: 'Elkészítés',
      pricing: 'Árazás',
      sustainability: 'Fenntarthatóság',
      analytics: 'Analitika',
      supplyChain: 'Ellátási lánc',
      financial: 'Pénzügyek',
      aiInterview: 'AI Interjú',
      aiAssistant: 'AI Asszisztens'
    },
    aiAssistant: {
      title: 'AI Asszisztens',
      welcome: 'Hogyan segíthetek?',
      askQuestion: 'Kérdezzen valamit...',
      quickSuggestions: 'Gyors javaslatok',
      thinking: 'Gondolkodom...',
      error: 'Hiba történt',
      minimize: 'Minimalizálás',
      maximize: 'Maximalizálás'
    },
    marketing: {
      title: 'Marketing',
      campaigns: 'Kampányok',
      contacts: 'Kapcsolatok',
      analytics: 'Analitika',
      aiAssistant: 'AI Asszisztens'
    },
    training: {
      title: 'Képzés',
      courses: 'Kurzusok',
      progress: 'Haladás',
      assignments: 'Feladatok',
      certificates: 'Tanúsítványok'
    },
    analytics: {
      title: 'Analitika',
      overview: 'Áttekintés',
      menuAnalytics: 'Menü analitika',
      revenue: 'Bevételek',
      qrAnalytics: 'QR Analitika',
      marketing: 'Marketing'
    },
    settings: {
      title: 'Beállítások',
      general: 'Általános',
      notifications: 'Értesítések',
      privacy: 'Adatvédelem',
      branding: 'Márka',
      language: 'Nyelv',
      languageDescription: 'Állítsa be az alkalmazás nyelvét az Ön preferenciái szerint.',
      currentLanguage: 'Jelenlegi nyelv',
      languageCode: 'Nyelvi kód',
      availableLanguages: 'Elérhető nyelvek',
      quickActions: 'Gyors műveletek',
      useBrowserLanguage: 'Böngésző nyelv használata',
      resetToDefault: 'Alapértelmezett visszaállítása',
      enableAutoDetect: 'Automatikus felismerés engedélyezése',
      languageInfo: 'Nyelvi információk',
      browserLanguage: 'Böngésző nyelv',
      savedLanguage: 'Mentett nyelv',
      autoDetect: 'Automatikus felismerés',
      notSet: 'Nincs beállítva'
    }
  },
  pl: {
    common: {
      loading: 'Ładowanie...',
      error: 'Błąd',
      success: 'Sukces',
      cancel: 'Anuluj',
      save: 'Zapisz',
      delete: 'Usuń',
      edit: 'Edytuj',
      add: 'Dodaj',
      search: 'Szukaj',
      filter: 'Filtruj',
      sort: 'Sortuj',
      refresh: 'Odśwież',
      back: 'Wstecz',
      next: 'Dalej',
      previous: 'Poprzedni',
      close: 'Zamknij',
      confirm: 'Potwierdź',
      yes: 'Tak',
      no: 'Nie',
      ok: 'OK',
      signIn: 'Zaloguj się',
      join: 'Dołącz'
    },
    navigation: {
      dashboard: 'Dashboard',
      menuMaker: 'Menu Maker',
      marketing: 'Marketing',
      training: 'Szkolenie',
      analytics: 'Analityka',
      settings: 'Ustawienia',
      profile: 'Profil',
      logout: 'Wyloguj'
    },
    dashboard: {
      title: 'Dashboard',
      welcome: 'Witamy w MastroHub',
      quickStats: 'Szybkie statystyki',
      recentActivity: 'Ostatnia aktywność',
      quickActions: 'Szybkie akcje',
      notifications: 'Powiadomienia'
    },
    menuMaker: {
      title: 'Menu Maker',
      addItem: 'Dodaj element',
      editItem: 'Edytuj element',
      deleteItem: 'Usuń element',
      categories: 'Kategorie',
      ingredients: 'Składniki',
      allergens: 'Alergeny',
      preparation: 'Przygotowanie',
      pricing: 'Cennik',
      sustainability: 'Zrównoważony rozwój',
      analytics: 'Analityka',
      supplyChain: 'Łańcuch dostaw',
      financial: 'Finanse',
      aiInterview: 'AI Wywiad',
      aiAssistant: 'AI Asystent'
    },
    aiAssistant: {
      title: 'AI Asystent',
      welcome: 'Jak mogę pomóc?',
      askQuestion: 'Zadaj pytanie...',
      quickSuggestions: 'Szybkie sugestie',
      thinking: 'Myślę...',
      error: 'Wystąpił błąd',
      minimize: 'Minimalizuj',
      maximize: 'Maksymalizuj'
    },
    marketing: {
      title: 'Marketing',
      campaigns: 'Kampanie',
      contacts: 'Kontakty',
      analytics: 'Analityka',
      aiAssistant: 'AI Asystent'
    },
    training: {
      title: 'Szkolenie',
      courses: 'Kursy',
      progress: 'Postęp',
      assignments: 'Zadania',
      certificates: 'Certyfikaty'
    },
    analytics: {
      title: 'Analityka',
      overview: 'Przegląd',
      menuAnalytics: 'Analityka menu',
      revenue: 'Przychody',
      qrAnalytics: 'QR Analityka',
      marketing: 'Marketing'
    },
    settings: {
      title: 'Ustawienia',
      general: 'Ogólne',
      notifications: 'Powiadomienia',
      privacy: 'Prywatność',
      branding: 'Marka',
      language: 'Język',
      languageDescription: 'Ustaw język aplikacji zgodnie z Twoimi preferencjami.',
      currentLanguage: 'Aktualny język',
      languageCode: 'Kod języka',
      availableLanguages: 'Dostępne języki',
      quickActions: 'Szybkie akcje',
      useBrowserLanguage: 'Użyj języka przeglądarki',
      resetToDefault: 'Przywróć domyślne',
      enableAutoDetect: 'Włącz automatyczne wykrywanie',
      languageInfo: 'Informacje o języku',
      browserLanguage: 'Język przeglądarki',
      savedLanguage: 'Zapisany język',
      autoDetect: 'Automatyczne wykrywanie',
      notSet: 'Nie ustawiono'
    }
  }
};

// Translation hook
export function useTranslation(language: SupportedLanguage = DEFAULT_LANGUAGE) {
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  };
  
  return { t, language };
}

// Language context
export interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
  t: (key: string) => string;
}

// Export default language
export default DEFAULT_LANGUAGE;

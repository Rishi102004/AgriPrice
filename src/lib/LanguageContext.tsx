import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

type Translations = Record<string, Record<Language, string>>;

const TRANSLATIONS: Translations = {
  'Find Nearby Mandis': { en: 'Find Nearby Mandis', hi: 'आसपास की मंडियां खोजें' },
  'Market Summary': { en: 'Market Summary', hi: 'बाजार सारांश' },
  'Today\'s Crop Prices': { en: 'Today\'s Crop Prices', hi: 'आज के फसल भाव' },
  'Live updates for': { en: 'Live updates for', hi: 'के लिए लाइव अपडेट' },
  'Compare All Mandis →': { en: 'Compare All Mandis →', hi: 'सभी मंडियों की तुलना करें →' },
  'Find Mandi': { en: 'Find Mandi', hi: 'मंडी खोजें' },
  'Compare nearby mandis': { en: 'Compare nearby mandis', hi: 'पास की मंडियों की तुलना करें' },
  'Price Alerts': { en: 'Price Alerts', hi: 'मूल्य अलर्ट' },
  'active alerts': { en: 'active alerts', hi: 'सक्रिय अलर्ट' },
  'AgriMandiBot': { en: 'AgriMandiBot', hi: 'एग्रीमंडीबॉट' },
  'Chat in Hindi or English': { en: 'Chat in Hindi or English', hi: 'हिंदी या अंग्रेजी में बात करें' },
  'Highest Gainer': { en: 'Highest Gainer', hi: 'सबसे अधिक लाभ' },
  'Biggest Loser': { en: 'Biggest Loser', hi: 'सबसे बड़ा नुकसान' },
  'Best to Sell': { en: 'Best to Sell', hi: 'बेचने के लिए सर्वश्रेष्ठ' },
  'Sentiment': { en: 'Sentiment', hi: 'बाजार का रुख' },
  'Your local market:': { en: 'Your local market:', hi: 'आपका स्थानीय बाजार:' },
  'Locate APMC mandis and compare official government prices for grains.': { 
    en: 'Locate APMC mandis and compare official government prices for grains.', 
    hi: 'APMC मंडियों का पता लगाएं और अनाजों के आधिकारिक सरकारी भावों की तुलना करें।' 
  },
  'Search by district or mandi name...': { en: 'Search by district or mandi name...', hi: 'जिले या मंडी के नाम से खोजें...' },
  'Best Mandis to Sell — Comparison': { en: 'Best Mandis to Sell — Comparison', hi: 'बेचने के लिए सर्वश्रेष्ठ मंडियां — तुलना' },
  'Showing best official government prices per grain across all mandis': {
    en: 'Showing best official government prices per grain across all mandis',
    hi: 'सभी मंडियों में प्रति अनाज सर्वोत्तम आधिकारिक सरकारी भाव दिखा रहा है'
  },
  'All States': { en: 'All States', hi: 'सभी राज्य' }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return TRANSLATIONS[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthContext';

type Language = 'en' | 'hi' | 'kn';

type Translations = Record<string, Record<Language, string>>;

const TRANSLATIONS: Translations = {
  // Navigation & Common
  'Dashboard': { en: 'Dashboard', hi: 'डैशबोर्ड', kn: 'ಡ್ಯಾಶ್ಬೋರ್ಡ್' },
  'Find Mandi': { en: 'Find Mandi', hi: 'मंडी खोजें', kn: 'ಮಂಡಿ ಹುಡುಕಿ' },
  'Alerts': { en: 'Alerts', hi: 'अलर्ट', kn: 'ಎಚ್ಚರಿಕೆಗಳು' },
  'Profile': { en: 'Profile', hi: 'प्रोफ़ाइल', kn: 'ಪ್ರೊಫೈಲ್' },
  'Home': { en: 'Home', hi: 'होम', kn: 'ಮನೆ' },
  'Logout': { en: 'Logout', hi: 'लॉग आउट', kn: 'ಲಾಗ್ ಔಟ್' },
  'Sign In': { en: 'Sign In', hi: 'साइन इन', kn: 'ಸೈನ್ ಇನ್' },
  'Get Started': { en: 'Get Started', hi: 'शुरू करें', kn: 'ಪ್ರಾರಂಭಿಸಿ' },
  
  // AgriBot
  'AgriMandiBot': { en: 'AgriMandiBot', hi: 'एग्रीमंडीबॉट', kn: 'ಅಗ್ರಿಮಂಡಿಬಾಟ್' },
  'Chat in Hindi or English': { en: 'Chat in Hindi or English', hi: 'हिंदी या अंग्रेजी में बात करें', kn: 'ಹಿಂದಿ, ಇಂಗ್ಲಿಷ್ ಅಥವಾ ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ' },
  'Type your message...': { en: 'Type your message...', hi: 'अपना संदेश टाइप करें...', kn: 'ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ...' },
  'Ask about prices, mandis...': { en: 'Ask about prices, mandis...', hi: 'कीमतों, मंडियों के बारे में पूछें...', kn: 'ಬೆಲೆಗಳು, ಮಂಡಿಗಳ ಬಗ್ಗೆ ಕೇಳಿ...' },
  
  // Dashboard / Landing / Mandi Finder
  'Find Nearby Mandis': { en: 'Find Nearby Mandis', hi: 'आसपास की मंडियां खोजें', kn: 'ಹತ್ತಿರದ ಮಂಡಿಗಳನ್ನು ಹುಡುಕಿ' },
  'Market Summary': { en: 'Market Summary', hi: 'बाजार सारांश', kn: 'ಮಾರುಕಟ್ಟೆ ಸಾರಾಂಶ' },
  'Today\'s Crop Prices': { en: 'Today\'s Crop Prices', hi: 'आज के फसल भाव', kn: 'ಇಂದಿನ ಬೆಳೆ ಬೆಲೆಗಳು' },
  'Live updates for': { en: 'Live updates for', hi: 'के लिए लाइव अपडेट', kn: 'ಲೈವ್ ಅಪ್‌ಡೇಟ್‌ಗಳು' },
  'Compare All Mandis →': { en: 'Compare All Mandis →', hi: 'सभी मंडियों की तुलना करें →', kn: 'ಎಲ್ಲಾ ಮಂಡಿಗಳನ್ನು ಹೋಲಿಕೆ ಮಾಡಿ →' },
  'Compare nearby mandis': { en: 'Compare nearby mandis', hi: 'पास की मंडियों की तुलना करें', kn: 'ಹತ್ತಿರದ ಮಂಡಿಗಳನ್ನು ಹೋಲಿಕೆ ಮಾಡಿ' },
  'Highest Gainer': { en: 'Highest Gainer', hi: 'सबसे अधिक लाभ', kn: 'ಹೆಚ್ಚು ಲಾಭ ಗಳಿಸಿದವರು' },
  'Biggest Loser': { en: 'Biggest Loser', hi: 'सबसे बड़ा नुकसान', kn: 'ಅತ್ಯಂತ ನಷ್ಟ ಅನುಭವಿಸಿದವರು' },
  'Best to Sell': { en: 'Best to Sell', hi: 'बेचने के लिए सर्वश्रेष्ठ', kn: 'ಮಾರಾಟ ಮಾಡಲು ಉತ್ತಮ' },
  'Sentiment': { en: 'Sentiment', hi: 'बाजार का रुख', kn: 'ಮಾರುಕಟ್ಟೆ ಭಾವನೆ' },
  'Your local market:': { en: 'Your local market:', hi: 'आपका स्थानीय बाजार:', kn: 'ನಿಮ್ಮ ಸ್ಥಳೀಯ ಮಾರುಕಟ್ಟೆ:' },
  'Locate APMC mandis and compare official government prices for grains.': { 
    en: 'Locate APMC mandis and compare official government prices for grains.', 
    hi: 'APMC मंडियों का पता लगाएं और अनाजों के आधिकारिक सरकारी भावों की तुलना करें।',
    kn: 'APMC ಮಂಡಿಗಳನ್ನು ಪತ್ತೆ ಮಾಡಿ ಮತ್ತು ಧಾನ್ಯಗಳಿಗೆ ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಬೆಲೆಗಳನ್ನು ಹೋಲಿಕೆ ಮಾಡಿ.' 
  },
  'Search by district or mandi name...': { en: 'Search by district or mandi name...', hi: 'जिले या मंडी के नाम से खोजें...', kn: 'ಜಿಲ್ಲೆ ಅಥವಾ ಮಂಡಿ ಹೆಸರಿನಿಂದ ಹುಡುಕಿ...' },
  'Best Mandis to Sell — Comparison': { en: 'Best Mandis to Sell — Comparison', hi: 'बेचने के लिए सर्वश्रेष्ठ मंडियां — तुलना', kn: 'ಮಾರಾಟ ಮಾಡಲು ಉತ್ತಮ ಮಂಡಿಗಳು — ಹೋಲಿಕೆ' },
  'Showing best official government prices per grain across all mandis': {
    en: 'Showing best official government prices per grain across all mandis',
    hi: 'सभी मंडियों में प्रति अनाज सर्वोत्तम आधिकारिक सरकारी भाव दिखा रहा है',
    kn: 'ಎಲ್ಲಾ ಮಂಡಿಗಳಲ್ಲಿ ಧಾನ್ಯದ ಅತ್ಯುತ್ತಮ ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಬೆಲೆಗಳನ್ನು ತೋರಿಸಲಾಗುತ್ತಿದೆ'
  },
  'All States': { en: 'All States', hi: 'सभी राज्य', kn: 'ಎಲ್ಲಾ ರಾಜ್ಯಗಳು' },
  
  // Profile & Alerts
  'Price Alerts': { en: 'Price Alerts', hi: 'मूल्य अलर्ट', kn: 'ಬೆಲೆ ಎಚ್ಚರಿಕೆಗಳು' },
  'active alerts': { en: 'active alerts', hi: 'सक्रिय अलर्ट', kn: 'ಸಕ್ರಿಯ ಎಚ್ಚರಿಕೆಗಳು' },
  'My Profile': { en: 'My Profile', hi: 'मेरी प्रोफ़ाइल', kn: 'ನನ್ನ ಪ್ರೊಫೈಲ್' },
  'Manage your account settings and preferences': { en: 'Manage your account settings and preferences', hi: 'अपनी खाता सेटिंग्स और प्राथमिकताएं प्रबंधित करें', kn: 'ನಿಮ್ಮ ಖಾತೆ ಸೆಟ್ಟಿಂಗ್‌ಗಳು ಮತ್ತು ಆದ್ಯತೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ' },
  'Verified Farmer': { en: 'Verified Farmer', hi: 'सत्यापित किसान', kn: 'ಪರಿಶೀಲಿಸಿದ ರೈತ' },
  'Lang': { en: 'Lang', hi: 'भाषा', kn: 'ಭಾಷೆ' },
  'Personal Information': { en: 'Personal Information', hi: 'व्यक्तिगत जानकारी', kn: 'ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ' },
  'Full Name': { en: 'Full Name', hi: 'पूरा नाम', kn: 'ಪೂರ್ಣ ಹೆಸರು' },
  'Phone Number': { en: 'Phone Number', hi: 'फ़ोन नंबर', kn: 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ' },
  'District': { en: 'District', hi: 'ज़िला', kn: 'ಜಿಲ್ಲೆ' },
  'Home Mandi': { en: 'Home Mandi', hi: 'होम मंडी', kn: 'ಮನೆ ಮಂಡಿ' },
  'Preferred Language': { en: 'Preferred Language', hi: 'पसंदीदा भाषा', kn: 'ಆದ್ಯತೆಯ ಭಾಷೆ' },
  'Save Changes': { en: 'Save Changes', hi: 'परिवर्तन सहेजें', kn: 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ' },
  'Saved!': { en: 'Saved!', hi: 'सहेजा गया!', kn: 'ಉಳಿಸಲಾಗಿದೆ!' },
  'My Price Alerts': { en: 'My Price Alerts', hi: 'मेरे मूल्य अलर्ट', kn: 'ನನ್ನ ಬೆಲೆ ಎಚ್ಚರಿಕೆಗಳು' },
  'No alerts yet. Visit any crop page to set a price alert.': { en: 'No alerts yet. Visit any crop page to set a price alert.', hi: 'अभी तक कोई अलर्ट नहीं। मूल्य अलर्ट सेट करने के लिए किसी भी फसल पृष्ठ पर जाएँ।', kn: 'ಇನ್ನೂ ಯಾವುದೇ ಎಚ್ಚರಿಕೆಗಳಿಲ್ಲ. ಬೆಲೆ ಎಚ್ಚರಿಕೆಯನ್ನು ಹೊಂದಿಸಲು ಯಾವುದೇ ಬೆಳೆ ಪುಟಕ್ಕೆ ಭೇಟಿ ನೀಡಿ.' },
  'Any mandi': { en: 'Any mandi', hi: 'कोई भी मंडी', kn: 'ಯಾವುದೇ ಮಂಡಿ' },
  
  // MandiFinder extras
  'Govt. Agmarknet Data': { en: 'Govt. Agmarknet Data', hi: 'सरकारी एगमार्कनेट डेटा', kn: 'ಸರ್ಕಾರಿ ಅಗ್‌ಮಾರ್ಕ್‌ನೆಟ್ ಡೇಟಾ' },
  'Locating...': { en: 'Locating...', hi: 'खोज रहे हैं...', kn: 'ಪತ್ತೆ ಮಾಡಲಾಗುತ್ತಿದೆ...' },
  'Location Active': { en: 'Location Active', hi: 'स्थान सक्रिय', kn: 'ಸ್ಥಳ ಸಕ್ರಿಯ' },
  'Use Live Location': { en: 'Use Live Location', hi: 'लाइव स्थान उपयोग करें', kn: 'ಲೈವ್ ಸ್ಥಳ ಬಳಸಿ' },
  'Nearest': { en: 'Nearest', hi: 'सबसे नज़दीक', kn: 'ಹತ್ತಿರದ' },
  'more': { en: 'more', hi: 'और', kn: 'ಇನ್ನಷ್ಟು' },
  'No mandis found. Try a different search.': { en: 'No mandis found. Try a different search.', hi: 'कोई मंडी नहीं मिली। कोई अलग खोज आज़माएं।', kn: 'ಯಾವುದೇ ಮಂಡಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ. ಬೇರೆ ಹುಡುಕಾಟ ಪ್ರಯತ್ನಿಸಿ.' },
  'Agmarknet Verified': { en: 'Agmarknet Verified', hi: 'एगमार्कनेट सत्यापित', kn: 'ಅಗ್‌ಮಾರ್ಕ್‌ನೆಟ್ ಪರಿಶೀಲಿಸಲಾಗಿದೆ' },
  'Crop': { en: 'Crop', hi: 'फसल', kn: 'ಬೆಳೆ' },
  'Price': { en: 'Price', hi: 'कीमत', kn: 'ಬೆಲೆ' },
  'Unit': { en: 'Unit', hi: 'इकाई', kn: 'ಘಟಕ' },
  'Action': { en: 'Action', hi: 'कार्रवाई', kn: 'ಕ್ರಿಯೆ' },
  'View Trend': { en: 'View Trend', hi: 'रुझान देखें', kn: 'ಟ್ರೆಂಡ್ ನೋಡಿ' },
  
  // Alerts page
  'Get notified when crop prices cross your thresholds': { en: 'Get notified when crop prices cross your thresholds', hi: 'जब फसल की कीमतें आपकी सीमा पार करें तो सूचना पाएं', kn: 'ಬೆಳೆ ಬೆಲೆಗಳು ನಿಮ್ಮ ಮಿತಿಗಳನ್ನು ದಾಟಿದಾಗ ಸೂಚನೆ ಪಡೆಯಿರಿ' },
  'New Alert': { en: 'New Alert', hi: 'नया अलर्ट', kn: 'ಹೊಸ ಎಚ್ಚರಿಕೆ' },
  'Create New Alert': { en: 'Create New Alert', hi: 'नया अलर्ट बनाएं', kn: 'ಹೊಸ ಎಚ್ಚರಿಕೆ ರಚಿಸಿ' },
  'Mandi': { en: 'Mandi', hi: 'मंडी', kn: 'ಮಂಡಿ' },
  'Alert Type': { en: 'Alert Type', hi: 'अलर्ट प्रकार', kn: 'ಎಚ್ಚರಿಕೆ ಪ್ರಕಾರ' },
  'Above': { en: 'Above', hi: 'ऊपर', kn: 'ಮೇಲೆ' },
  'Below': { en: 'Below', hi: 'नीचे', kn: 'ಕೆಳಗೆ' },
  'Target Price': { en: 'Target Price', hi: 'लक्ष्य कीमत', kn: 'ಗುರಿ ಬೆಲೆ' },
  'Enter threshold price...': { en: 'Enter threshold price...', hi: 'सीमा कीमत दर्ज करें...', kn: 'ಮಿತಿ ಬೆಲೆ ನಮೂದಿಸಿ...' },
  'Create Alert': { en: 'Create Alert', hi: 'अलर्ट बनाएं', kn: 'ಎಚ್ಚರಿಕೆ ರಚಿಸಿ' },
  'Cancel': { en: 'Cancel', hi: 'रद्द करें', kn: 'ರದ್ದುಮಾಡಿ' },
  'No alerts yet': { en: 'No alerts yet', hi: 'अभी तक कोई अलर्ट नहीं', kn: 'ಇನ್ನೂ ಯಾವುದೇ ಎಚ್ಚರಿಕೆಗಳಿಲ್ಲ' },
  'Create your first price alert to get notified when crops hit your target price.': { en: 'Create your first price alert to get notified when crops hit your target price.', hi: 'जब फसलें आपकी लक्ष्य कीमत पर पहुँचें तो सूचना पाने के लिए अपना पहला मूल्य अलर्ट बनाएं।', kn: 'ಬೆಳೆಗಳು ನಿಮ್ಮ ಗುರಿ ಬೆಲೆಗೆ ತಲುಪಿದಾಗ ಸೂಚನೆ ಪಡೆಯಲು ನಿಮ್ಮ ಮೊದಲ ಬೆಲೆ ಎಚ್ಚರಿಕೆಯನ್ನು ರಚಿಸಿ.' },
  'Total Alerts': { en: 'Total Alerts', hi: 'कुल अलर्ट', kn: 'ಒಟ್ಟು ಎಚ್ಚರಿಕೆಗಳು' },
  'Active': { en: 'Active', hi: 'सक्रिय', kn: 'ಸಕ್ರಿಯ' },
  'Paused': { en: 'Paused', hi: 'रुका हुआ', kn: 'ವಿರಾಮ' },
  'TRIGGERED': { en: 'TRIGGERED', hi: 'ट्रिगर हुआ', kn: 'ಟ್ರಿಗರ್ ಆಯಿತು' },
  'Notify when price goes': { en: 'Notify when price goes', hi: 'जब कीमत जाए तो सूचित करें', kn: 'ಬೆಲೆ ಹೋದಾಗ ತಿಳಿಸಿ' },
  'above': { en: 'above', hi: 'ऊपर', kn: 'ಮೇಲೆ' },
  'below': { en: 'below', hi: 'नीचे', kn: 'ಕೆಳಗೆ' },
  'Current price': { en: 'Current price', hi: 'मौजूदा कीमत', kn: 'ಪ್ರಸ್ತುತ ಬೆಲೆ' },
  'Pro Tip:': { en: 'Pro Tip:', hi: 'प्रो टिप:', kn: 'ಪ್ರೊ ಸಲಹೆ:' },
  'You can also set alerts directly from any': { en: 'You can also set alerts directly from any', hi: 'आप किसी भी फसल विवरण पृष्ठ से सीधे अलर्ट भी सेट कर सकते हैं', kn: 'ನೀವು ಯಾವುದೇ ಬೆಳೆ ವಿವರ ಪುಟದಿಂದ ನೇರವಾಗಿ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಹೊಂದಿಸಬಹುದು' },
  'crop detail page': { en: 'crop detail page', hi: 'फसल विवरण पृष्ठ', kn: 'ಬೆಳೆ ವಿವರ ಪುಟ' },
  'Prices are updated daily.': { en: 'Prices are updated daily.', hi: 'कीमतें प्रतिदिन अपडेट होती हैं।', kn: 'ಬೆಲೆಗಳು ಪ್ರತಿದಿನ ನವೀಕರಿಸಲಾಗುತ್ತದೆ.' },

  // Auth page
  'Welcome to AGRIPRICE': { en: 'Welcome to AGRIPRICE', hi: 'AGRIPRICE में आपका स्वागत है', kn: 'AGRIPRICE ಗೆ ಸ್ವಾಗತ' },
  'Verify OTP': { en: 'Verify OTP', hi: 'OTP सत्यापित करें', kn: 'OTP ಪರಿಶೀಲಿಸಿ' },
  'Join 50,000+ farmers across India': { en: 'Join 50,000+ farmers across India', hi: 'भारत भर में 50,000+ किसानों से जुड़ें', kn: 'ಭಾರತದಾದ್ಯಂತ 50,000+ ರೈತರೊಂದಿಗೆ ಸೇರಿ' },
  'We sent a code to': { en: 'We sent a code to', hi: 'हमने कोड भेजा है', kn: 'ನಾವು ಕೋಡ್ ಕಳುಹಿಸಿದ್ದೇವೆ' },
  'Mobile Number': { en: 'Mobile Number', hi: 'मोबाइल नंबर', kn: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' },
  'Sending OTP...': { en: 'Sending OTP...', hi: 'OTP भेज रहे हैं...', kn: 'OTP ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...' },
  'Get OTP →': { en: 'Get OTP →', hi: 'OTP प्राप्त करें →', kn: 'OTP ಪಡೆಯಿರಿ →' },
  'Enter 4-digit code (Demo: Any 4 digits)': { en: 'Enter 4-digit code (Demo: Any 4 digits)', hi: '4-अंकीय कोड दर्ज करें (डेमो: कोई भी 4 अंक)', kn: '4-ಅಂಕಿ ಕೋಡ್ ನಮೂದಿಸಿ (ಡೆಮೋ: ಯಾವುದೇ 4 ಅಂಕಿಗಳು)' },
  'Verifying...': { en: 'Verifying...', hi: 'सत्यापित कर रहे हैं...', kn: 'ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...' },
  'Verify & Sign In': { en: 'Verify & Sign In', hi: 'सत्यापित करें और साइन इन करें', kn: 'ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಸೈನ್ ಇನ್ ಮಾಡಿ' },
  'Change Mobile Number': { en: 'Change Mobile Number', hi: 'मोबाइल नंबर बदलें', kn: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಬದಲಾಯಿಸಿ' },
  'Back to home': { en: 'Back to home', hi: 'होम पर वापस', kn: 'ಮನೆಗೆ ಹಿಂತಿರುಗಿ' },
  
  // CommodityDetails page
  'Back to Dashboard': { en: 'Back to Dashboard', hi: 'डैशबोर्ड पर वापस', kn: 'ಡ್ಯಾಶ್ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ' },
  'Best Price Today': { en: 'Best Price Today', hi: 'आज की सबसे अच्छी कीमत', kn: 'ಇಂದಿನ ಅತ್ಯುತ್ತಮ ಬೆಲೆ' },
  'Price History': { en: 'Price History', hi: 'कीमत इतिहास', kn: 'ಬೆಲೆ ಇತಿಹಾಸ' },
  'Last 7 days': { en: 'Last 7 days', hi: 'पिछले 7 दिन', kn: 'ಕಳೆದ 7 ದಿನಗಳು' },
  'Last 30 days': { en: 'Last 30 days', hi: 'पिछले 30 दिन', kn: 'ಕಳೆದ 30 ದಿನಗಳು' },
  'Last 1 year': { en: 'Last 1 year', hi: 'पिछला 1 साल', kn: 'ಕಳೆದ 1 ವರ್ಷ' },
  'Prices Across Mandis': { en: 'Prices Across Mandis', hi: 'मंडियों में कीमतें', kn: 'ಮಂಡಿಗಳಾದ್ಯಂತ ಬೆಲೆಗಳು' },
  'Best': { en: 'Best', hi: 'सर्वश्रेष्ठ', kn: 'ಅತ್ಯುತ್ತಮ' },
  'Set Price Alert for': { en: 'Set Price Alert for', hi: 'के लिए मूल्य अलर्ट सेट करें', kn: 'ಬೆಲೆ ಎಚ್ಚರಿಕೆ ಹೊಂದಿಸಿ' },
  'Select Mandi': { en: 'Select Mandi', hi: 'मंडी चुनें', kn: 'ಮಂಡಿ ಆಯ್ಕೆ ಮಾಡಿ' },
  'Alert Saved!': { en: 'Alert Saved!', hi: 'अलर्ट सहेजा गया!', kn: 'ಎಚ್ಚರಿಕೆ ಉಳಿಸಲಾಗಿದೆ!' },
  'Set Alert': { en: 'Set Alert', hi: 'अलर्ट सेट करें', kn: 'ಎಚ್ಚರಿಕೆ ಹೊಂದಿಸಿ' },
  'Commodity not found.': { en: 'Commodity not found.', hi: 'फसल नहीं मिली।', kn: 'ಸರಕು ಕಂಡುಬಂದಿಲ್ಲ.' },

  // Landing page
  'India\'s #1 Agricultural Price Intelligence Platform': { en: 'India\'s #1 Agricultural Price Intelligence Platform', hi: 'भारत का #1 कृषि मूल्य बुद्धिमत्ता मंच', kn: 'ಭಾರತದ #1 ಕೃಷಿ ಬೆಲೆ ಬುದ್ಧಿಮತ್ತೆ ವೇದಿಕೆ' },
  'Know Your Price,': { en: 'Know Your Price,', hi: 'अपना भाव जानो,', kn: 'ನಿಮ್ಮ ಬೆಲೆ ತಿಳಿಯಿರಿ,' },
  'Grow Your Profit.': { en: 'Grow Your Profit.', hi: 'मुनाफ़ा बढ़ाओ।', kn: 'ನಿಮ್ಮ ಲಾಭ ಬೆಳೆಸಿ.' },
  'Real-time mandi prices, AI-powered crop insights, and smart alerts — designed for Indian farmers and agricultural traders.': { en: 'Real-time mandi prices, AI-powered crop insights, and smart alerts — designed for Indian farmers and agricultural traders.', hi: 'रियल-टाइम मंडी भाव, AI-संचालित फसल अंतर्दृष्टि, और स्मार्ट अलर्ट — भारतीय किसानों और कृषि व्यापारियों के लिए।', kn: 'ರಿಯಲ್-ಟೈಮ್ ಮಂಡಿ ಬೆಲೆಗಳು, AI-ಚಾಲಿತ ಬೆಳೆ ಒಳನೋಟಗಳು ಮತ್ತು ಸ್ಮಾರ್ಟ್ ಎಚ್ಚರಿಕೆಗಳು — ಭಾರತೀಯ ರೈತರು ಮತ್ತು ಕೃಷಿ ವ್ಯಾಪಾರಿಗಳಿಗಾಗಿ.' },
  'Get Started Free': { en: 'Get Started Free', hi: 'मुफ़्त शुरू करें', kn: 'ಉಚಿತವಾಗಿ ಪ್ರಾರಂಭಿಸಿ' },
  'Check Live Prices': { en: 'Check Live Prices', hi: 'लाइव भाव देखें', kn: 'ಲೈವ್ ಬೆಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ' },
  'Everything You Need to Sell Smarter': { en: 'Everything You Need to Sell Smarter', hi: 'स्मार्ट तरीके से बेचने के लिए सब कुछ', kn: 'ಬುದ್ಧಿವಂತವಾಗಿ ಮಾರಾಟ ಮಾಡಲು ನಿಮಗೆ ಬೇಕಾದ ಎಲ್ಲವೂ' },
  'Powerful tools designed for the modern Indian farmer': { en: 'Powerful tools designed for the modern Indian farmer', hi: 'आधुनिक भारतीय किसान के लिए डिज़ाइन किए गए शक्तिशाली उपकरण', kn: 'ಆಧುನಿಕ ಭಾರತೀಯ ರೈತರಿಗಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಿದ ಶಕ್ತಿಶಾಲಿ ಸಾಧನಗಳು' },
  'Ready to earn more from your crops?': { en: 'Ready to earn more from your crops?', hi: 'अपनी फसलों से ज़्यादा कमाने के लिए तैयार?', kn: 'ನಿಮ್ಮ ಬೆಳೆಗಳಿಂದ ಹೆಚ್ಚು ಗಳಿಸಲು ಸಿದ್ಧರಿದ್ದೀರಾ?' },
  'Join 50,000+ farmers using AGRIPRICE to make smarter selling decisions.': { en: 'Join 50,000+ farmers using AGRIPRICE to make smarter selling decisions.', hi: 'स्मार्ट बिक्री निर्णय लेने के लिए AGRIPRICE का उपयोग करने वाले 50,000+ किसानों से जुड़ें।', kn: 'ಬುದ್ಧಿವಂತ ಮಾರಾಟ ನಿರ್ಧಾರಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಲು AGRIPRICE ಬಳಸುತ್ತಿರುವ 50,000+ ರೈತರೊಂದಿಗೆ ಸೇರಿ.' },
  'Start For Free': { en: 'Start For Free', hi: 'मुफ़्त शुरू करें', kn: 'ಉಚಿತವಾಗಿ ಪ್ರಾರಂಭಿಸಿ' },
  'Real-Time Mandi Prices': { en: 'Real-Time Mandi Prices', hi: 'रियल-टाइम मंडी भाव', kn: 'ರಿಯಲ್-ಟೈಮ್ ಮಂಡಿ ಬೆಲೆಗಳು' },
  'Multilingual AI Chatbot': { en: 'Multilingual AI Chatbot', hi: 'बहुभाषी AI चैटबॉट', kn: 'ಬಹುಭಾಷಾ AI ಚ್ಯಾಟ್‌ಬಾಟ್' },
  'Mandi Finder': { en: 'Mandi Finder', hi: 'मंडी खोजक', kn: 'ಮಂಡಿ ಹುಡುಕಾಟ' },
  'Price Trend Charts': { en: 'Price Trend Charts', hi: 'मूल्य रुझान चार्ट', kn: 'ಬೆಲೆ ಟ್ರೆಂಡ್ ಚಾರ್ಟ್‌ಗಳು' },
  'Smart Price Alerts': { en: 'Smart Price Alerts', hi: 'स्मार्ट मूल्य अलर्ट', kn: 'ಸ್ಮಾರ್ಟ್ ಬೆಲೆ ಎಚ್ಚರಿಕೆಗಳು' },
  'Verified Data': { en: 'Verified Data', hi: 'सत्यापित डेटा', kn: 'ಪರಿಶೀಲಿಸಿದ ಡೇಟಾ' },
  'APMC Mandis': { en: 'APMC Mandis', hi: 'APMC मंडियां', kn: 'APMC ಮಂಡಿಗಳು' },
  'Languages': { en: 'Languages', hi: 'भाषाएं', kn: 'ಭಾಷೆಗಳು' },
  'Farmers': { en: 'Farmers', hi: 'किसान', kn: 'ರೈತರು' },
  'Extra Profit Earned': { en: 'Extra Profit Earned', hi: 'अतिरिक्त लाभ अर्जित', kn: 'ಹೆಚ್ಚುವರಿ ಲಾಭ ಗಳಿಸಿದ' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [language, setLanguage] = useState<Language>(
    (user?.language as Language) || 'en'
  );

  useEffect(() => {
    if (user?.language) {
      setLanguage(user.language as Language);
    }
  }, [user?.language]);

  const t = (key: string): string => {
    return TRANSLATIONS[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}


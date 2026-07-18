// ─── Mock Data for AGRIPRICE (Grains Only) ───────────────────────────────────────────────
// This file powers the app when Supabase credentials are not configured.

export interface Mandi {
  id: string;
  name: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
}

export interface Commodity {
  id: string;
  name: string;
  name_hi: string;
  name_kn: string;
  unit: string;
  category: string;
  emoji: string;
}

export interface Price {
  id: string;
  commodity_id: string;
  mandi_id: string;
  price: number;
  unit: string;
  date?: string;
}

export interface PriceAlert {
  id: string;
  user_id: string;
  commodity_id: string;
  mandi_id: string | null;
  threshold_price: number;
  alert_type: 'above' | 'below';
  is_active: boolean;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  message: string;
  reply: string;
  language: string;
  created_at: string;
  is_user: boolean;
}

// ─── Mandis ──────────────────────────────────────────────────────────────────
export const MANDIS: Mandi[] = [
  {
    id: 'mandi_ka_1',
    name: 'Hubballi APMC',
    district: 'Dharwad',
    state: 'Karnataka',
    lat: 15.3647,
    lng: 75.1240,
  },
  {
    id: 'mandi_ka_2',
    name: 'Yeshwanthpur APMC',
    district: 'Bangalore',
    state: 'Karnataka',
    lat: 13.0285,
    lng: 77.5409,
  },
  {
    id: 'mandi_ka_3',
    name: 'Mysuru APMC',
    district: 'Mysuru',
    state: 'Karnataka',
    lat: 12.2958,
    lng: 76.6394,
  },
  {
    id: 'mandi_ka_4',
    name: 'Raichur APMC',
    district: 'Raichur',
    state: 'Karnataka',
    lat: 16.2008,
    lng: 77.3623,
  },
  {
    id: 'mandi_mh_1',
    name: 'Pune APMC (Reference)',
    district: 'Pune',
    state: 'Maharashtra',
    lat: 18.5089,
    lng: 73.9259,
  },
  {
    id: 'mandi_hr_1',
    name: 'Karnal APMC (Reference)',
    district: 'Karnal',
    state: 'Haryana',
    lat: 29.6857,
    lng: 76.9905,
  },
  {
    id: 'mandi_pb_1',
    name: 'Ludhiana APMC',
    district: 'Ludhiana',
    state: 'Punjab',
    lat: 30.9010,
    lng: 75.8573,
  },
  {
    id: 'mandi_up_1',
    name: 'Lucknow APMC',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    lat: 26.8467,
    lng: 80.9462,
  },
  {
    id: 'mandi_mp_1',
    name: 'Indore APMC',
    district: 'Indore',
    state: 'Madhya Pradesh',
    lat: 22.7196,
    lng: 75.8577,
  },
];

// ─── Commodities (Grains Only) ────────────────────────────────────────────────
export const COMMODITIES: Commodity[] = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Wheat',        name_hi: 'गेहूं',       name_kn: 'ಗೋಧಿ',         unit: 'quintal', category: 'Grains', emoji: '🌾' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Rice (Paddy)', name_hi: 'धान (चावल)',  name_kn: 'ಭತ್ತ (ಅಕ್ಕಿ)',  unit: 'quintal', category: 'Grains', emoji: '🍚' },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Maize (Corn)', name_hi: 'मक्का',       name_kn: 'ಮೆಕ್ಕೆಜೋಳ',     unit: 'quintal', category: 'Grains', emoji: '🌽' },
  { id: '44444444-4444-4444-4444-444444444444', name: 'Bajra',        name_hi: 'बाजरा',       name_kn: 'ಸಜ್ಜೆ',         unit: 'quintal', category: 'Grains', emoji: '🌾' },
  { id: '55555555-5555-5555-5555-555555555555', name: 'Jowar',        name_hi: 'ज्वार',        name_kn: 'ಜೋಳ',          unit: 'quintal', category: 'Grains', emoji: '🌾' },
  { id: '66666666-6666-6666-6666-666666666666', name: 'Barley',       name_hi: 'जौ',          name_kn: 'ಬಾರ್ಲಿ',        unit: 'quintal', category: 'Grains', emoji: '🌾' },
];

// ─── Today's Prices ───────────────────────────────────────────────────────────
export const TODAY_PRICES: Price[] = [
  // Wheat
  { id: 'p001', commodity_id: '11111111-1111-1111-1111-111111111111', mandi_id: 'mandi_ka_1', price: 2350, unit: 'quintal' },
  { id: 'p002', commodity_id: '11111111-1111-1111-1111-111111111111', mandi_id: 'mandi_ka_2', price: 2400, unit: 'quintal' },
  { id: 'p003', commodity_id: '11111111-1111-1111-1111-111111111111', mandi_id: 'mandi_ka_3', price: 2380, unit: 'quintal' },
  { id: 'p004', commodity_id: '11111111-1111-1111-1111-111111111111', mandi_id: 'mandi_ka_4', price: 2320, unit: 'quintal' },
  { id: 'p005', commodity_id: '11111111-1111-1111-1111-111111111111', mandi_id: 'mandi_mh_1', price: 2250, unit: 'quintal' },
  { id: 'p006', commodity_id: '11111111-1111-1111-1111-111111111111', mandi_id: 'mandi_hr_1', price: 2150, unit: 'quintal' },
  { id: 'p006a', commodity_id: '11111111-1111-1111-1111-111111111111', mandi_id: 'mandi_pb_1', price: 2125, unit: 'quintal' },
  { id: 'p006b', commodity_id: '11111111-1111-1111-1111-111111111111', mandi_id: 'mandi_up_1', price: 2180, unit: 'quintal' },
  { id: 'p006c', commodity_id: '11111111-1111-1111-1111-111111111111', mandi_id: 'mandi_mp_1', price: 2275, unit: 'quintal' },
  
  // Rice
  { id: 'p007', commodity_id: '22222222-2222-2222-2222-222222222222', mandi_id: 'mandi_ka_1', price: 2950, unit: 'quintal' },
  { id: 'p008', commodity_id: '22222222-2222-2222-2222-222222222222', mandi_id: 'mandi_ka_2', price: 3100, unit: 'quintal' },
  { id: 'p009', commodity_id: '22222222-2222-2222-2222-222222222222', mandi_id: 'mandi_ka_3', price: 3000, unit: 'quintal' },
  { id: 'p010', commodity_id: '22222222-2222-2222-2222-222222222222', mandi_id: 'mandi_ka_4', price: 3200, unit: 'quintal' }, // Raichur Sona Masuri is premium
  { id: 'p011', commodity_id: '22222222-2222-2222-2222-222222222222', mandi_id: 'mandi_mh_1', price: 2850, unit: 'quintal' },
  { id: 'p012', commodity_id: '22222222-2222-2222-2222-222222222222', mandi_id: 'mandi_hr_1', price: 2750, unit: 'quintal' },
  { id: 'p012a', commodity_id: '22222222-2222-2222-2222-222222222222', mandi_id: 'mandi_pb_1', price: 2800, unit: 'quintal' },
  { id: 'p012b', commodity_id: '22222222-2222-2222-2222-222222222222', mandi_id: 'mandi_up_1', price: 2600, unit: 'quintal' },

  // Maize
  { id: 'p013', commodity_id: '33333333-3333-3333-3333-333333333333', mandi_id: 'mandi_ka_1', price: 2150, unit: 'quintal' },
  { id: 'p014', commodity_id: '33333333-3333-3333-3333-333333333333', mandi_id: 'mandi_ka_2', price: 2100, unit: 'quintal' },
  { id: 'p015', commodity_id: '33333333-3333-3333-3333-333333333333', mandi_id: 'mandi_ka_3', price: 2080, unit: 'quintal' },
  { id: 'p016', commodity_id: '33333333-3333-3333-3333-333333333333', mandi_id: 'mandi_ka_4', price: 2120, unit: 'quintal' },
  { id: 'p017', commodity_id: '33333333-3333-3333-3333-333333333333', mandi_id: 'mandi_mh_1', price: 2200, unit: 'quintal' },
  { id: 'p018', commodity_id: '33333333-3333-3333-3333-333333333333', mandi_id: 'mandi_hr_1', price: 1980, unit: 'quintal' },

  // Bajra
  { id: 'p019', commodity_id: '44444444-4444-4444-4444-444444444444', mandi_id: 'mandi_ka_1', price: 2450, unit: 'quintal' },
  { id: 'p020', commodity_id: '44444444-4444-4444-4444-444444444444', mandi_id: 'mandi_ka_2', price: 2500, unit: 'quintal' },
  { id: 'p021', commodity_id: '44444444-4444-4444-4444-444444444444', mandi_id: 'mandi_mh_1', price: 2350, unit: 'quintal' },
  
  // Jowar
  { id: 'p022', commodity_id: '55555555-5555-5555-5555-555555555555', mandi_id: 'mandi_ka_1', price: 3100, unit: 'quintal' }, // Hubballi Jowar
  { id: 'p023', commodity_id: '55555555-5555-5555-5555-555555555555', mandi_id: 'mandi_ka_2', price: 3200, unit: 'quintal' },
  { id: 'p024', commodity_id: '55555555-5555-5555-5555-555555555555', mandi_id: 'mandi_ka_4', price: 2950, unit: 'quintal' },
  { id: 'p025', commodity_id: '55555555-5555-5555-5555-555555555555', mandi_id: 'mandi_mh_1', price: 2900, unit: 'quintal' },

  // Barley
  { id: 'p026', commodity_id: '66666666-6666-6666-6666-666666666666', mandi_id: 'mandi_ka_2', price: 2200, unit: 'quintal' },
  { id: 'p027', commodity_id: '66666666-6666-6666-6666-666666666666', mandi_id: 'mandi_hr_1', price: 2000, unit: 'quintal' },
];

// ─── Yesterday's Prices (for % change) ───────────────────────────────────────
export const YESTERDAY_PRICES: Record<string, number> = {
  '11111111-1111-1111-1111-111111111111-mandi_ka_1': 2300,
  '11111111-1111-1111-1111-111111111111-mandi_ka_2': 2450,
  '11111111-1111-1111-1111-111111111111-mandi_ka_3': 2350,
  '11111111-1111-1111-1111-111111111111-mandi_ka_4': 2320,
  
  '22222222-2222-2222-2222-222222222222-mandi_ka_1': 2900,
  '22222222-2222-2222-2222-222222222222-mandi_ka_2': 3050,
  '22222222-2222-2222-2222-222222222222-mandi_ka_3': 3050,
  '22222222-2222-2222-2222-222222222222-mandi_ka_4': 3150,
  
  '33333333-3333-3333-3333-333333333333-mandi_ka_1': 2180,
  '44444444-4444-4444-4444-444444444444-mandi_ka_1': 2480,
  '55555555-5555-5555-5555-555555555555-mandi_ka_1': 3050,
  '66666666-6666-6666-6666-666666666666-mandi_ka_2': 2220,
};

// ─── Historical Price Generator ───────────────────────────────────────────────
export function generateHistoricalPrices(
  basePrice: number,
  days: number,
  volatility = 0.04
): { date: string; price: number }[] {
  const result: { date: string; price: number }[] = [];
  let price = basePrice;
  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const change = price * volatility * (Math.random() * 2 - 1);
    price = Math.max(price + change, basePrice * 0.6);
    result.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
    });
  }
  return result;
}

// ─── Helper Functions ─────────────────────────────────────────────────────────
export function getCommodityById(id: string): Commodity | undefined {
  return COMMODITIES.find((c) => c.id === id);
}

export function getMandiById(id: string): Mandi | undefined {
  return MANDIS.find((m) => m.id === id);
}

export function getPricesForCommodity(commodityId: string): Price[] {
  return TODAY_PRICES.filter((p) => p.commodity_id === commodityId);
}

export function getPricesForMandi(mandiId: string): Price[] {
  return TODAY_PRICES.filter((p) => p.mandi_id === mandiId);
}

export function getBestMandiForCommodity(commodityId: string): { mandi: Mandi; price: Price } | null {
  const prices = getPricesForCommodity(commodityId);
  if (!prices.length) return null;
  const best = prices.reduce((a, b) => (a.price > b.price ? a : b));
  const mandi = getMandiById(best.mandi_id);
  if (!mandi) return null;
  return { mandi, price: best };
}

export function getPriceChange(commodityId: string, mandiId: string): number {
  const key = `${commodityId}-${mandiId}`;
  const yesterdayPrice = YESTERDAY_PRICES[key];
  const todayPrice = TODAY_PRICES.find(
    (p) => p.commodity_id === commodityId && p.mandi_id === mandiId
  )?.price;
  if (!yesterdayPrice || !todayPrice) return 0;
  return ((todayPrice - yesterdayPrice) / yesterdayPrice) * 100;
}

export function getAveragePriceForCommodity(commodityId: string): number {
  const prices = getPricesForCommodity(commodityId);
  if (!prices.length) return 0;
  return prices.reduce((sum, p) => sum + p.price, 0) / prices.length;
}

// Distance calculation using Haversine formula (returns distance in km)
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  const distance = R * c; 
  return Math.round(distance);
}

// ─── AgriBot Response Engine ──────────────────────────────────────────────────
interface BotResponse {
  text: string;
  lang: 'en' | 'hi' | 'kn';
}

export function detectLanguage(text: string): 'en' | 'hi' | 'kn' {
  const hindiPattern = /[\u0900-\u097F]/;
  const kannadaPattern = /[\u0C80-\u0CFF]/;
  if (kannadaPattern.test(text)) return 'kn';
  if (hindiPattern.test(text)) return 'hi';
  return 'en';
}

export function generateBotResponse(userMessage: string): BotResponse {
  const lang = detectLanguage(userMessage);
  const lower = userMessage.toLowerCase();

  // Price queries across multiple mandis
  const commodityMatch = COMMODITIES.find(
    (c) =>
      lower.includes(c.name.toLowerCase().split(' ')[0]) || // Match first word (e.g. 'Maize' instead of 'Maize (Corn)')
      lower.includes(c.name_hi) ||
      lower.includes(c.name_kn)
  );
  
  // Specific Mandi queries
  const mandiMatch = MANDIS.find(
      (m) => lower.includes(m.district.toLowerCase()) || lower.includes(m.name.toLowerCase().split(' ')[0])
  );

  if (commodityMatch && mandiMatch) {
      const price = TODAY_PRICES.find(p => p.commodity_id === commodityMatch.id && p.mandi_id === mandiMatch.id);
      if (lang === 'hi') {
          return { text: `📍 **${mandiMatch.name}** में **${commodityMatch.name_hi}** का आज का भाव: ₹${price?.price}/${commodityMatch.unit} है।`, lang: 'hi' };
      }
      return { text: `📍 Today's price for **${commodityMatch.name}** at **${mandiMatch.name}** is ₹${price?.price}/${commodityMatch.unit}.`, lang: 'en' };
  }

  if (commodityMatch) {
    const prices = getPricesForCommodity(commodityMatch.id);
    const priceLines = prices
      .map((p) => {
        const mandi = getMandiById(p.mandi_id);
        return `• ${mandi?.name}: ₹${p.price}/${commodityMatch.unit}`;
      })
      .join('\n');

    const best = getBestMandiForCommodity(commodityMatch.id);

    if (lang === 'hi') {
      return {
        text: `${commodityMatch.emoji} **${commodityMatch.name_hi} के आज के भाव:**\n\n${priceLines}\n\n🏆 सबसे अच्छा मंडी: **${best?.mandi.name}** — ₹${best?.price.price}/${commodityMatch.unit}\n\n💡 सुझाव: अनाज को ठीक से सुखाकर मंडी ले जाएं ताकि अच्छी कीमत मिले।`,
        lang: 'hi',
      };
    } else if (lang === 'kn') {
      return {
        text: `${commodityMatch.emoji} **${commodityMatch.name_kn} ಇಂದಿನ ಬೆಲೆ:**\n\n${priceLines}\n\n🏆 ಉತ್ತಮ ಮಂಡಿ: **${best?.mandi.name}** — ₹${best?.price.price}/${commodityMatch.unit}`,
        lang: 'kn',
      };
    } else {
      return {
        text: `${commodityMatch.emoji} **${commodityMatch.name} — Today's Mandi Prices:**\n\n${priceLines}\n\n🏆 Best mandi to sell: **${best?.mandi.name}** — ₹${best?.price.price}/${commodityMatch.unit}\n\n💡 Tip: Ensure your grains are well-dried to get the maximum price at the mandi.`,
        lang: 'en',
      };
    }
  }

  if (mandiMatch) {
       const prices = getPricesForMandi(mandiMatch.id);
       const priceLines = prices.map(p => {
           const c = getCommodityById(p.commodity_id);
           return `• ${c?.name}: ₹${p.price}/${c?.unit}`;
       }).join('\n');
       
       if (lang === 'hi') {
           return { text: `📍 **${mandiMatch.name} (${mandiMatch.state})**\n\nआज के अनाज के भाव:\n${priceLines}`, lang: 'hi' };
       }
       return { text: `📍 **${mandiMatch.name} (${mandiMatch.state})**\n\nToday's Grain Prices:\n${priceLines}`, lang: 'en' };
  }

  // Mandi finder generic
  if (lower.includes('mandi') || lower.includes('market') || lower.includes('मंडी') || lower.includes('ಮಂಡಿ') || lower.includes('location')) {
    const mandiLines = MANDIS.map(
      (m) => `• ${m.name} (${m.district}, ${m.state})`
    ).join('\n');
    if (lang === 'hi') {
      return { text: `🏪 **नजदीकी APMC मंडियाँ:**\n\n${mandiLines}\n\nकिसी विशेष अनाज (गेहूं, मक्का, धान) की कीमत जानने के लिए मुझे बताएं!`, lang: 'hi' };
    } else if (lang === 'kn') {
      return { text: `🏪 **ಹತ್ತಿರದ APMC ಮಂಡಿಗಳು:**\n\n${mandiLines}`, lang: 'kn' };
    }
    return { text: `🏪 **Nearby APMC Mandis:**\n\n${mandiLines}\n\nTell me which grain you want to sell, and I'll find the best mandi!`, lang: 'en' };
  }

  // General grain tips
  if (lower.includes('grain') || lower.includes('tip') || lower.includes('अनाज')) {
      if (lang === 'hi') {
          return { text: `🌾 **अनाज भंडारण और बिक्री के सुझाव:**\n\n• नमी की मात्रा 12-14% से कम रखें।\n• बोरियों को जमीन से ऊपर लकड़ी के फट्टों पर रखें।\n• मंडी ले जाने से पहले ग्रेडिंग और छंटाई कर लें ताकि अच्छी कीमत मिले।`, lang: 'hi'}
      }
      return { text: `🌾 **Grain Storage & Selling Tips:**\n\n• Maintain moisture content below 12-14% to prevent fungus.\n• Store bags on wooden pallets off the ground.\n• Clean and grade your grains before taking them to the mandi for premium prices.`, lang: 'en'}
  }

  // Alert setting
  if (lower.includes('alert') || lower.includes('notify') || lower.includes('सूचना') || lower.includes('ಎಚ್ಚರಿಕೆ')) {
    if (lang === 'hi') {
      return { text: `🔔 **अलर्ट सेट करें:**\n\nऊपर "Alerts" बटन पर जाएं और अपनी पसंदीदा फसल और कीमत दर्ज करें।\n\nउदाहरण: "गेहूं की कीमत ₹2500/quintal से ऊपर जाए तो बताएं" ✅`, lang: 'hi' };
    }
    return { text: `🔔 **Setting Price Alerts:**\n\nClick the **"Alerts"** button on your dashboard or visit the commodity page.\n\nExample: "Notify me when Wheat price goes above ₹2500/quintal in Pune Mandi" ✅\n\nI'll let you know when prices hit your target!`, lang: 'en' };
  }

  // Greetings
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('नमस्ते') || lower.includes('ನಮಸ್ಕಾರ') || lower.includes('helo')) {
    if (lang === 'hi') {
      return { text: `🙏 नमस्ते! मैं **AgriMandiBot** हूँ।\n\nमैं अनाज (गेहूं, धान, मक्का आदि) से जुड़ी जानकारी देता हूँ:\n• 📊 अनाज की मंडी कीमतें देखें\n• 🏪 नजदीकी मंडी खोजें\n• 🔔 कीमत अलर्ट सेट करें\n\nआप किस अनाज का भाव जानना चाहते हैं?`, lang: 'hi' };
    } else if (lang === 'kn') {
      return { text: `🙏 ನಮಸ್ಕಾರ! ನಾನು **AgriMandiBot**.\n\nನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ:\n• 📊 ಮಂಡಿ ಬೆಲೆಗಳು\n• 🏪 ಹತ್ತಿರದ ಮಂಡಿ\n• 🔔 ಬೆಲೆ ಎಚ್ಚರಿಕೆ`, lang: 'kn' };
    }
    return { text: `🙏 Hello! I'm **AgriMandiBot**, your grain market assistant!\n\nI can help you with:\n• 📊 Live mandi prices for grains (Wheat, Rice, Maize, etc.)\n• 🏪 Find nearest APMC mandi and their rates\n• 🔔 Set price alerts\n\nAsk me about a specific grain or mandi!`, lang: 'en' };
  }

  // Default
  if (lang === 'hi') {
    return { text: `मुझे समझ नहीं आया। कृपया किसी अनाज का नाम (जैसे गेहूं, मक्का) या "मंडी" लिखें। 🌾`, lang: 'hi' };
  } else if (lang === 'kn') {
    return { text: `ದಯವಿಟ್ಟು ಬೆಳೆ ಹೆಸರು (ಉದಾ: ಗೋಧಿ, ಮೆಕ್ಕೆಜೋಳ) ಅಥವಾ "ಮಂಡಿ" ಎಂದು ಟೈಪ್ ಮಾಡಿ. 🌾`, lang: 'kn' };
  }
  return { text: `I'm not sure I understood that. Try asking about a grain price (e.g., "Wheat price in Pune", "Delhi mandi prices"), or type "mandi" to find nearby markets. 🌾\n\nYou can also ask in Hindi (हिंदी) or Kannada (ಕನ್ನಡ)!`, lang: 'en' };
}

// ─── LocalStorage Keys ────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  USER: 'agriprice_user',
  ALERTS: 'agriprice_alerts',
  CHAT_HISTORY: 'agriprice_chat_history',
};

// ─── Mock User ────────────────────────────────────────────────────────────────
export const DEFAULT_MOCK_USER = {
  id: 'mock-user-id-1234',
  name: 'Ravi Kumar',
  email: 'ravi@farmer.in',
  phone: '+91 98765 43210',
  language: 'en',
  home_mandi_id: 'mandi_ka_1',
  district: 'Dharwad',
};

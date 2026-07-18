const express = require('express');
const router = express.Router();

const Commodity = require('../models/Commodity');
const Mandi = require('../models/Mandi');
const Price = require('../models/Price');

const COMMODITIES = [
  { id: 'wheat', name: 'Wheat', name_hi: 'गेहूँ', category: 'Cereals', icon: 'Wheat' },
  { id: 'rice', name: 'Rice', name_hi: 'चावल', category: 'Cereals', icon: 'Leaf' },
  { id: 'cotton', name: 'Cotton', name_hi: 'कपास', category: 'Fibers', icon: 'Cloud' },
  { id: 'soyabean', name: 'Soyabean', name_hi: 'सोयाबीन', category: 'Oilseeds', icon: 'Sprout' }
];

const MANDIS = [
  { id: 'indore', name: 'Indore Mandi', name_hi: 'इंदौर मंडी', state: 'Madhya Pradesh', state_hi: 'मध्य प्रदेश', district: 'Indore', district_hi: 'इंदौर' },
  { id: 'bhopal', name: 'Bhopal Mandi', name_hi: 'भोपाल मंडी', state: 'Madhya Pradesh', state_hi: 'मध्य प्रदेश', district: 'Bhopal', district_hi: 'भोपाल' },
  { id: 'ujjain', name: 'Ujjain Mandi', name_hi: 'उज्जैन मंडी', state: 'Madhya Pradesh', state_hi: 'मध्य प्रदेश', district: 'Ujjain', district_hi: 'उज्जैन' },
  { id: 'pune', name: 'Pune APMC', name_hi: 'पुणे एपीएमसी', state: 'Maharashtra', state_hi: 'महाराष्ट्र', district: 'Pune', district_hi: 'पुणे' }
];

router.post('/', async (req, res) => {
  try {
    // Clear existing
    await Commodity.deleteMany({});
    await Mandi.deleteMany({});
    await Price.deleteMany({});

    // Seed Commodities & Mandis
    await Commodity.insertMany(COMMODITIES);
    await Mandi.insertMany(MANDIS);

    // Generate random prices for each combination
    const prices = [];
    const today = new Date().toISOString().split('T')[0];
    
    // YYYY-MM-DD for yesterday
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const yesterday = d.toISOString().split('T')[0];

    for (const c of COMMODITIES) {
      for (const m of MANDIS) {
        // base price between 2000 and 8000
        const base = Math.floor(Math.random() * 6000) + 2000;
        
        // Yesterday's price
        prices.push({
          id: `p_${yesterday}_${c.id}_${m.id}`,
          commodity_id: c.id,
          mandi_id: m.id,
          price: base,
          date: yesterday
        });

        // Today's price (+- 5%)
        const change = (Math.random() * 0.1) - 0.05;
        const todayPrice = Math.floor(base * (1 + change));
        
        prices.push({
          id: `p_${today}_${c.id}_${m.id}`,
          commodity_id: c.id,
          mandi_id: m.id,
          price: todayPrice,
          date: today
        });
      }
    }

    await Price.insertMany(prices);

    res.json({ message: 'Database seeded successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

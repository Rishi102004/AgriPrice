const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Import Mongoose models to fetch context for the AI
const Commodity = require('../models/Commodity');
const Mandi = require('../models/Mandi');
const Price = require('../models/Price');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  try {
    const { message, history, language = 'en' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // 1. Fetch Live Market Data Context (RAG)
    const commodities = await Commodity.find({});
    const mandis = await Mandi.find({});
    // For simplicity, just grab the latest prices from today (or the most recent ones)
    // To keep it simple, we'll just pull the top 50 latest prices
    const prices = await Price.find({}).sort({ date: -1 }).limit(100);

    // Build a contextual string
    const marketContext = `
      LIVE MARKET DATA:
      Commodities: ${commodities.map(c => c.name).join(', ')}
      Mandis: ${mandis.map(m => m.name).join(', ')}
      Latest Prices (Sample): ${prices.map(p => {
        const c = commodities.find(c => c.id === p.commodity_id);
        const m = mandis.find(m => m.id === p.mandi_id);
        return c && m ? `${c.name} at ${m.name}: ₹${p.price}/${p.unit}` : '';
      }).filter(Boolean).slice(0, 20).join(' | ')}
    `;

    // 2. Fallback to mock response if API key is invalid
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.trim() === '') {
      const samplePrices = prices.map(p => {
        const c = commodities.find(c => c.id === p.commodity_id);
        const m = mandis.find(m => m.id === p.mandi_id);
        return c && m ? `${c.name} at ${m.name}: ₹${p.price}/quintal` : '';
      }).filter(Boolean).slice(0, 3).join(' | ');
      
      return res.json({ 
        text: `🤖 **(Mock AI Mode)** \n\nI received your message: *"${message}"*\n\nSince a valid Google Gemini API key wasn't provided, I am operating in Mock Mode. However, I can still see your live MongoDB data! Here are some recent prices:\n- ${samplePrices}`
      });
    }

    // 3. Setup Gemini Model and System Prompt
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.5-flash',
      systemInstruction: `You are AgriMandiBot, an AI agricultural assistant for Indian farmers. 
Your goal is to provide helpful, accurate, and concise answers about crop prices, farming tips, and market trends.
Always be polite and use simple language.
If the user asks for crop prices, refer to the LIVE MARKET DATA provided below. 
Respond in the language requested by the user, primarily English or Hindi (requested language: ${language}).
Keep your answers brief, under 3-4 short paragraphs.
Format your text nicely, use emojis occasionally.
${marketContext}
`
    });

    // 4. Start Chat Session
    // Format frontend history to Gemini format ({ role: 'user' | 'model', parts: [{ text }] })
    let formattedHistory = (history || []).map(msg => ({
      role: msg.isUser ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Gemini requires the history to start with a user message.
    // If the first message is from the model (e.g. initial greeting), remove it.
    while (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
      formattedHistory.shift();
    }

    const chat = model.startChat({
      history: formattedHistory,
    });

    try {
      // 5. Send Message and Get Response
      const result = await chat.sendMessage(message);
      const responseText = result.response.text();

      res.json({ text: responseText });
    } catch (apiError) {
      console.error('Gemini API Error details:', apiError.message);
      
      // Fallback to Mock Mode on API error
      const samplePrices = prices.map(p => {
        const c = commodities.find(c => c.id === p.commodity_id);
        const m = mandis.find(m => m.id === p.mandi_id);
        return c && m ? `${c.name} at ${m.name}: ₹${p.price}/quintal` : '';
      }).filter(Boolean).slice(0, 3).join(' | ');
      
      return res.json({ 
        text: `🤖 **(Mock AI Mode)** \n\nI received your message: *"${message}"*\n\nThe provided Google Gemini API key is either invalid or unauthorized. Falling back to Mock Mode. I can still see your live MongoDB data! Here are some recent prices:\n- ${samplePrices}`
      });
    }
  } catch (error) {
    console.error('General Error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

module.exports = router;

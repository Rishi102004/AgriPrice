const express = require('express');
const router = express.Router();
const Price = require('../models/Price');

// Get all prices (optionally filter by date)
router.get('/', async (req, res) => {
  try {
    const query = {};
    if (req.query.date) query.date = req.query.date;
    if (req.query.commodity_id) query.commodity_id = req.query.commodity_id;
    if (req.query.mandi_id) query.mandi_id = req.query.mandi_id;

    const prices = await Price.find(query);
    res.json(prices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get historical prices for a commodity in a mandi
router.get('/history/:commodity_id/:mandi_id', async (req, res) => {
  try {
    const prices = await Price.find({
      commodity_id: req.params.commodity_id,
      mandi_id: req.params.mandi_id
    }).sort({ date: 1 });
    res.json(prices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

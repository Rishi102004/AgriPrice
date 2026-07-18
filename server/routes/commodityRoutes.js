const express = require('express');
const router = express.Router();
const Commodity = require('../models/Commodity');

router.get('/', async (req, res) => {
  try {
    const commodities = await Commodity.find({});
    res.json(commodities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const commodity = await Commodity.findOne({ id: req.params.id });
    if (!commodity) return res.status(404).json({ error: 'Not found' });
    res.json(commodity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Mandi = require('../models/Mandi');

router.get('/', async (req, res) => {
  try {
    const mandis = await Mandi.find({});
    res.json(mandis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const mandi = await Mandi.findOne({ id: req.params.id });
    if (!mandi) return res.status(404).json({ error: 'Not found' });
    res.json(mandi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');

router.get('/user/:userId', async (req, res) => {
  try {
    const alerts = await Alert.find({ user_id: req.params.userId });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newAlert = new Alert({ ...req.body, id: `al_${Date.now()}` });
    await newAlert.save();
    res.status(201).json(newAlert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const alert = await Alert.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Alert.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

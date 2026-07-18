const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/login', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number is required' });

  try {
    let user = await User.findOne({ phone });
    
    // Auto-register if not exists (Mock behavior for prototype)
    if (!user) {
      user = new User({
        id: `u_${Date.now()}`,
        phone,
        name: `Farmer ${phone.slice(-4)}`,
        language: 'en',
        home_mandi_id: 'indore',
        state: 'Madhya Pradesh'
      });
      await user.save();
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { id: req.params.id }, 
      req.body, 
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

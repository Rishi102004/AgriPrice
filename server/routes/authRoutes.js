const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.post('/signup', async (req, res) => {
  const { username, password, phone, name } = req.body;
  if (!username || !password || !phone || !name) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or phone already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      id: `u_${Date.now()}`,
      username,
      password: hashedPassword,
      phone,
      name,
      language: 'en',
      home_mandi_id: 'indore',
      state: 'Madhya Pradesh'
    });
    
    await user.save();
    
    // Don't send the password back to the client
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password are required' });

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json(userResponse);
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

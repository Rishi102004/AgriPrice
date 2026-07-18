const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  language: { type: String, required: true, enum: ['en', 'hi', 'kn'] },
  home_mandi_id: { type: String, required: true },
  state: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

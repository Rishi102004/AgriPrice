const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  commodity_id: { type: String, required: true },
  mandi_id: { type: String, required: true },
  target_price: { type: Number, required: true },
  condition: { type: String, required: true, enum: ['above', 'below'] },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);

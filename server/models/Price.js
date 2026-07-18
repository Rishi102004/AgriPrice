const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  commodity_id: { type: String, required: true },
  mandi_id: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: String, required: true } // format YYYY-MM-DD
}, { timestamps: true });

// Compound index for quick lookups
priceSchema.index({ commodity_id: 1, mandi_id: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Price', priceSchema);

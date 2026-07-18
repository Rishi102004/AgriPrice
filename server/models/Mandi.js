const mongoose = require('mongoose');

const mandiSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  name_hi: { type: String, required: true },
  state: { type: String, required: true },
  state_hi: { type: String, required: true },
  district: { type: String, required: true },
  district_hi: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Mandi', mandiSchema);

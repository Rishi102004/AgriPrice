const mongoose = require('mongoose');

const commoditySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  name_hi: { type: String, required: true },
  category: { type: String, required: true },
  icon: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Commodity', commoditySchema);

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes (to be added)
app.use('/api/seed', require('./routes/seedRoutes'));
app.use('/api/commodities', require('./routes/commodityRoutes'));
app.use('/api/mandis', require('./routes/mandiRoutes'));
app.use('/api/prices', require('./routes/priceRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth_routes');
const categoryRoutes = require('./routes/category_routes');
const transactionRoutes = require('./routes/transaction_routes');
const budgetRoutes = require('./routes/budget_routes');

const rateLimit = require('express-rate-limit');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Rate limiting for Auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.'
  }
});

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/subscriptions', require('./routes/subscription_routes'));
app.use('/api/goals', require('./routes/goal_routes'));
app.use('/api/brands', require('./routes/brand_routes'));

// Error Handler (Must be last)
app.use(errorHandler);

// Basic health check
app.get('/', (req, res) => {
  res.send('Finance Tracker API is running...');
});

// Database Connection
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully.');
    app.listen(PORT, () => {
      console.log(`🚀 Server is humming along on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

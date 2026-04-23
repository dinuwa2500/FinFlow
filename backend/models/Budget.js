const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Budget amount is required'],
    min: [0.01, 'Budget amount must be greater than 0']
  },
  period: {
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12
    },
    year: {
      type: Number,
      required: true,
      min: 2000
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Unique index to prevent duplicate budgets for same category/user/period
BudgetSchema.index({ categoryId: 1, userId: 1, 'period.month': 1, 'period.year': 1 }, { unique: true });

module.exports = mongoose.model('Budget', BudgetSchema);

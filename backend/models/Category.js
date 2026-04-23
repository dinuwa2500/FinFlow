const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: {
      values: ['income', 'expense'],
      message: '{VALUE} is not a valid category type'
    },
    required: [true, 'Type (income or expense) is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure a user cannot have two categories with the same name and type
CategorySchema.index({ name: 1, userId: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Category', CategorySchema);

const Category = require('../models/Category');

const DEFAULT_INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investments', 'Other Income'];
const DEFAULT_EXPENSE_CATEGORIES = [
  'Food', 
  'Transport', 
  'Rent', 
  'Entertainment', 
  'Healthcare', 
  'Shopping', 
  'Utilities', 
  'Other Expense'
];

const seedDefaultCategories = async (userId) => {
  try {
    const incomeCategories = DEFAULT_INCOME_CATEGORIES.map(name => ({
      name,
      type: 'income',
      userId
    }));

    const expenseCategories = DEFAULT_EXPENSE_CATEGORIES.map(name => ({
      name,
      type: 'expense',
      userId
    }));

    await Category.insertMany([...incomeCategories, ...expenseCategories]);
    console.log(`✅ Default categories seeded for user ${userId}`);
  } catch (error) {
    console.error('❌ Error seeding default categories:', error.message);
    // We don't necessarily want to crash the whole register process if seeding fails,
    // but in a real app you might want to retry or handle this properly.
  }
};

module.exports = { seedDefaultCategories };

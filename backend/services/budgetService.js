const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

const createBudget = async (userId, dto) => {
  const budget = new Budget({
    ...dto,
    userId
  });
  return await budget.save();
};

const getBudgetsWithProgress = async (userId, month, year) => {
  const queryMonth = parseInt(month);
  const queryYear = parseInt(year);

  // 1. Get all budgets for the user in that period
  const budgets = await Budget.find({
    userId,
    'period.month': queryMonth,
    'period.year': queryYear
  }).populate('categoryId', 'name');

  // 2. Define the date range for transactions
  const startDate = new Date(queryYear, queryMonth - 1, 1);
  const endDate = new Date(queryYear, queryMonth, 0, 23, 59, 59);

  // 3. For each budget, calc spending
  const budgetProgress = await Promise.all(budgets.map(async (budget) => {
    const transactions = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          category: budget.categoryId._id,
          date: { $gte: startDate, $lte: endDate },
          type: 'expense' // Budgets usually track expenses
        }
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$amount' }
        }
      }
    ]);

    const spent = transactions.length > 0 ? transactions[0].totalSpent : 0;
    const remaining = budget.amount - spent;
    const percentUsed = (spent / budget.amount) * 100;

    return {
      id: budget._id,
      category: budget.categoryId.name,
      budget: budget.amount,
      spent,
      remaining: Math.max(0, remaining),
      percentUsed: Math.min(100, percentUsed).toFixed(2),
      isExceeded: spent > budget.amount
    };
  }));

  return budgetProgress;
};

const updateBudget = async (userId, id, dto) => {
  const budget = await Budget.findOneAndUpdate(
    { _id: id, userId },
    { $set: dto },
    { new: true, runValidators: true }
  );
  if (!budget) throw new Error('Budget not found or unauthorized');
  return budget;
};

const deleteBudget = async (userId, id) => {
  const budget = await Budget.findOneAndDelete({ _id: id, userId });
  if (!budget) throw new Error('Budget not found or unauthorized');
  return budget;
};

module.exports = {
  createBudget,
  getBudgetsWithProgress,
  updateBudget,
  deleteBudget
};

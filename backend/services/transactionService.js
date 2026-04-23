const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

const createTransaction = async (userId, dto) => {
  const transaction = new Transaction({
    ...dto,
    userId
  });
  return await transaction.save();
};

const getTransactions = async (userId, filters) => {
  const { startDate, endDate, categoryId, type, page = 1, limit = 10 } = filters;
  
  const query = { userId };

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  if (categoryId) query.category = categoryId;
  if (type) query.type = type;

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Transaction.find(query)
      .populate('category', 'name type')
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Transaction.countDocuments(query)
  ]);

  return {
    data,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit)
  };
};

const updateTransaction = async (userId, id, dto) => {
  const transaction = await Transaction.findOneAndUpdate(
    { _id: id, userId },
    { $set: dto },
    { new: true, runValidators: true }
  );

  if (!transaction) {
    throw new Error('Transaction not found or unauthorized');
  }

  return transaction;
};

const deleteTransaction = async (userId, id) => {
  const transaction = await Transaction.findOneAndDelete({ _id: id, userId });
  if (!transaction) {
    throw new Error('Transaction not found or unauthorized');
  }
  return transaction;
};

const getSummary = async (userId, month, year) => {
  const query = { userId };

  if (month && year) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);
    query.date = { $gte: start, $lte: end };
  }

  const result = await Transaction.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' }
      }
    }
  ]);

  let totalIncome = 0;
  let totalExpenses = 0;

  result.forEach(item => {
    if (item._id === 'income') totalIncome = item.total;
    if (item._id === 'expense') totalExpenses = item.total;
  });

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses
  };
};

module.exports = {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getSummary
};

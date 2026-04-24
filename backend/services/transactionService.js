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
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const query = { userId: userObjectId };
  const prevQuery = { userId: userObjectId };

  if (month && year) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);
    query.date = { $gte: start, $lte: end };

    // Previous month
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const prevStart = new Date(prevYear, prevMonth - 1, 1);
    const prevEnd = new Date(prevYear, prevMonth, 0, 23, 59, 59);
    prevQuery.date = { $gte: prevStart, $lte: prevEnd };
  }

  const [currentResult, prevResult] = await Promise.all([
    Transaction.aggregate([
      { $match: query },
      { $group: { _id: '$type', total: { $sum: '$amount' } } }
    ]),
    Transaction.aggregate([
      { $match: prevQuery },
      { $group: { _id: '$type', total: { $sum: '$amount' } } }
    ])
  ]);

  const mapResult = (res) => {
    let income = 0, expense = 0;
    res.forEach(item => {
      if (item._id === 'income') income = item.total;
      if (item._id === 'expense') expense = item.total;
    });
    return { income, expense };
  };

  const current = mapResult(currentResult);
  const prev = mapResult(prevResult);

  const calculateGrowth = (curr, prevValue) => {
    if (prevValue === 0) return curr > 0 ? 100 : 0;
    return ((curr - prevValue) / prevValue) * 100;
  };

  return {
    totalIncome: current.income,
    totalExpenses: current.expense,
    balance: current.income - current.expense,
    incomeGrowth: calculateGrowth(current.income, prev.income),
    expenseGrowth: calculateGrowth(current.expense, prev.expense)
  };
};

const getHistory = async (userId) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);

  const stats = await Transaction.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          month: { $month: '$date' },
          year: { $year: '$date' },
          type: '$type'
        },
        total: { $sum: '$amount' }
      }
    }
  ]);

  // Format into a usable array for frontend (last 6 months)
  const result = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const monthName = d.toLocaleString('en-US', { month: 'short' });

    const income = stats.find(s => s._id.month === month && s._id.year === year && s._id.type === 'income')?.total || 0;
    const expense = stats.find(s => s._id.month === month && s._id.year === year && s._id.type === 'expense')?.total || 0;

    result.push({
      name: monthName,
      income,
      expense
    });
  }

  return result;
};

const getCategoryStats = async (userId) => {
  const result = await Transaction.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        type: 'expense'
      }
    },
    {
      $group: {
        _id: '$category',
        value: { $sum: '$amount' }
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'categoryInfo'
      }
    },
    { $unwind: '$categoryInfo' },
    {
      $project: {
        name: '$categoryInfo.name',
        value: 1,
        color: '$categoryInfo.color'
      }
    },
    { $sort: { value: -1 } },
    { $limit: 5 }
  ]);

  return result;
};

module.exports = {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getSummary,
  getHistory,
  getCategoryStats
};

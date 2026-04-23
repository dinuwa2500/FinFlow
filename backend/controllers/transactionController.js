const transactionService = require('../services/transactionService');

const list = async (req, res) => {
  try {
    const result = await transactionService.getTransactions(req.user.id, req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const transaction = await transactionService.createTransaction(req.user.id, req.body);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const transaction = await transactionService.updateTransaction(req.user.id, req.params.id, req.body);
    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await transactionService.deleteTransaction(req.user.id, req.params.id);
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const summary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const result = await transactionService.getSummary(req.user.id, month, year);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  list,
  create,
  update,
  remove,
  summary
};

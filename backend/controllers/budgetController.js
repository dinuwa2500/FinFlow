const budgetService = require('../services/budgetService');

const listWithProgress = async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ error: 'Please provide both month and year' });
    }
    const result = await budgetService.getBudgetsWithProgress(req.user.id, month, year);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const budget = await budgetService.createBudget(req.user.id, req.body);
    res.status(201).json(budget);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const budget = await budgetService.updateBudget(req.user.id, req.params.id, req.body);
    res.status(200).json(budget);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await budgetService.deleteBudget(req.user.id, req.params.id);
    res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  listWithProgress,
  create,
  update,
  remove
};

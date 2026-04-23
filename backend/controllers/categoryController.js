const categoryService = require('../services/categoryService');

const getAll = async (req, res) => {
  try {
    const { type } = req.query;
    const categories = await categoryService.getCategoriesByUser(req.user.id, type);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.user.id, req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const category = await categoryService.updateCategory(req.user.id, req.params.id, req.body);
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await categoryService.deleteCategory(req.user.id, req.params.id);
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAll,
  create,
  update,
  remove
};

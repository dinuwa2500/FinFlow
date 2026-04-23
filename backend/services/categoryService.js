const Category = require('../models/Category');

const createCategory = async (userId, categoryData) => {
  const { name, type } = categoryData;
  
  // Check if category already exists for this user
  const existing = await Category.findOne({ name, userId, type });
  if (existing) {
    throw new Error(`Category "${name}" already exists for ${type}.`);
  }

  const category = new Category({
    name,
    type,
    userId
  });

  return await category.save();
};

const getCategoriesByUser = async (userId, type) => {
  const query = { userId };
  if (type) {
    query.type = type;
  }
  return await Category.find(query).sort({ name: 1 });
};

const updateCategory = async (userId, categoryId, updateData) => {
  const category = await Category.findOne({ _id: categoryId, userId });
  if (!category) {
    throw new Error('Category not found or you don\'t have permission to modify it.');
  }

  // Update fields
  if (updateData.name) category.name = updateData.name;
  if (updateData.type) category.type = updateData.type;

  return await category.save();
};

const deleteCategory = async (userId, categoryId) => {
  const category = await Category.findOneAndDelete({ _id: categoryId, userId });
  if (!category) {
    throw new Error('Category not found or you don\'t have permission to delete it.');
  }
  return category;
};

module.exports = {
  createCategory,
  getCategoriesByUser,
  updateCategory,
  deleteCategory
};

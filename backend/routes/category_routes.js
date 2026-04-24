const express = require('express');
const { z } = require('zod');
const categoryController = require('../controllers/categoryController');
const authenticate = require('../middlewares/authenticate');
const { validateBody, validateQuery } = require('../middlewares/validate');

const router = express.Router();

// Validation schemas
const createCategorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  type: z.enum(['income', 'expense'], { message: 'Type must be either income or expense' })
});

const updateCategorySchema = z.object({
  name: z.string().min(2).optional(),
  type: z.enum(['income', 'expense']).optional()
});

const listCategoriesSchema = z.object({
  type: z.enum(['income', 'expense']).optional()
});

router.use(authenticate);

router.get('/', validateQuery(listCategoriesSchema), categoryController.getAll);
router.post('/', validateBody(createCategorySchema), categoryController.create);
router.patch('/:id', validateBody(updateCategorySchema), categoryController.update);
router.delete('/:id', categoryController.remove);

module.exports = router;

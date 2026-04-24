const express = require('express');
const { z } = require('zod');
const budgetController = require('../controllers/budgetController');
const authenticate = require('../middlewares/authenticate');
const { validateBody, validateQuery } = require('../middlewares/validate');

const router = express.Router();

const createBudgetSchema = z.object({
  categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID'),
  amount: z.number().positive('Budget amount must be positive'),
  period: z.object({
    month: z.number().min(1).max(12),
    year: z.number().min(2000)
  })
});

const updateBudgetSchema = z.object({
  amount: z.number().positive().optional()
});

const budgetQuerySchema = z.object({
  month: z.string().regex(/^\d+$/).transform(Number),
  year: z.string().regex(/^\d+$/).transform(Number)
});

router.use(authenticate);

router.get('/', validateQuery(budgetQuerySchema), budgetController.listWithProgress);
router.post('/', validateBody(createBudgetSchema), budgetController.create);
router.patch('/:id', validateBody(updateBudgetSchema), budgetController.update);
router.delete('/:id', budgetController.remove);

module.exports = router;

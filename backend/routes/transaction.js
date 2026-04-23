const express = require('express');
const { z } = require('zod');
const transactionController = require('../controllers/transactionController');
const authenticate = require('../middlewares/authenticate');
const { validateBody, validateQuery } = require('../middlewares/validate');

const router = express.Router();

// Validation schemas
const createTransactionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  amount: z.number().positive('Amount must be positive'),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID'),
  type: z.enum(['income', 'expense']),
  date: z.string().datetime().optional().or(z.date().optional()),
  note: z.string().optional()
});

const updateTransactionSchema = createTransactionSchema.partial();

const transactionFiltersSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  type: z.enum(['income', 'expense']).optional(),
  page: z.string().regex(/^\d+$/).optional().transform(Number),
  limit: z.string().regex(/^\d+$/).optional().transform(Number)
});

const summarySchema = z.object({
  month: z.string().regex(/^\d+$/).optional().transform(Number),
  year: z.string().regex(/^\d+$/).optional().transform(Number)
});

router.use(authenticate);

router.get('/', validateQuery(transactionFiltersSchema), transactionController.list);
router.post('/', validateBody(createTransactionSchema), transactionController.create);
router.get('/summary', validateQuery(summarySchema), transactionController.summary);
router.patch('/:id', validateBody(updateTransactionSchema), transactionController.update);
router.delete('/:id', transactionController.remove);

module.exports = router;

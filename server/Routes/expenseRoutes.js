import { Router } from 'express';
import {
  getExpenses,
  createExpense,
  getExpenseSummary,
  deleteExpense,
} from '../controllers/expenseController.js';

const router = Router();

router.get('/',         getExpenses);
router.post('/',        createExpense);
router.get('/summary',  getExpenseSummary);
router.delete('/:id',   deleteExpense);

export default router;

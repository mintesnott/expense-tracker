
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    addExpense,
    getAllExpense,
    downloadExpenseExcel,
    deleteExpense,
    updateExpense,
} from '../controllers/expenseController.js';

const router = express.Router();

router.post('/', protect, addExpense).get('/', protect, getAllExpense);

router.delete('/:id', protect, deleteExpense).patch('/:id', protect, updateExpense);

router.get('/download-excel', protect, downloadExpenseExcel);


export default router;

import express from 'express';

import { protect } from '../middleware/authMiddleware.js'
import {
    addIncome,
    getAllIncome,
    deleteIncome,
    downloadIncomeExcel,
    updateIncome,
} from '../controllers/incomeController.js';

const router = express.Router();

router.post('/', protect, addIncome).get('/', protect, getAllIncome);

router.get('/download-excel', protect, downloadIncomeExcel);

router.delete('/:id', protect, deleteIncome).patch('/:id', protect, updateIncome);

export default router;
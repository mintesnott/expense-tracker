import { StatusCodes } from 'http-status-codes';
import xlsx from 'xlsx';
import Expense from '../models/Expense.js';

// Add Expense Category
export const addExpense = async (req, res) => {
    const userId = req.user.id;

    const { icon, category, amount, date } = req.body;

    const newExpense = await Expense.create({
        userId,
        icon,
        category,
        amount,
        date: date ? new Date(date) : undefined,
    });

    res.status(StatusCodes.CREATED).json(newExpense);
};

// Get All Expense Sources
export const getAllExpense = async (req, res) => {
    const userId = req.user.id;

    const expense = await Expense.find({ userId }).sort({ date: -1 });
    res.status(StatusCodes.OK).json(expense);
};

// Delete Expense Source
export const deleteExpense = async (req, res) => {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);

    // Check if expense is already deleted or not owned by user
    if (deletedExpense === null) {
        const error = new Error('Expense record not found or already deleted');
        error.statusCode = StatusCodes.NOT_FOUND;
        throw error;
    }

    res.status(StatusCodes.OK).json({
        message: 'Expense deleted successfully',
    });
};

// Download Excel
export const downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;

    // 1. Query records from database
    const expenses = await Expense.find({ userId }).sort({ date: -1 });

    // 2. Map MongoDB documents to clean row structures
    const data = expenses.map((item) => ({
        Category: item.category,
        'Amount (ETB)': item.amount,
        Date: new Date(item.date).toLocaleDateString(),
    }));

    // 3. Build workbook and sheet source
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, 'Expense Statement');

    // 4. Generate binary Buffer directly in RAM
    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // 5. Attach download headers for frontend file triggers
    res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
        'Content-Disposition',
        'attachment; filename=Expense_Report.xlsx'
    );

    res.status(StatusCodes.OK).send(buffer);
};

// Update (Patch) Expense Source
export const updateExpense = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    // 1. Find the expense document and ensure it belongs to the logged-in user
    const updatedExpense = await Expense.findOneAndUpdate(
        { _id: id, userId: userId },
        req.body,
        {
            returnDocument: 'after', // Return the newly updated document
            runValidators: true, // Run schema validations on updated fields
        }
    );

    // 2. Handle 404 if the expense record doesn't exist or doesn't belong to this user
    if (!updatedExpense) {
        const error = new Error('Expense record not found or unauthorized');
        error.statusCode = StatusCodes.NOT_FOUND;
        throw error;
    }

    // 3. Return updated object
    res.status(StatusCodes.OK).json(updatedExpense);
};
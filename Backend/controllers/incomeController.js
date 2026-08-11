
import { StatusCodes } from 'http-status-codes';

import xlsx from 'xlsx'
import Income from '../models/Income.js'

//Add Income Source
export const addIncome = async (req, res) => {
    const userId= req.user.id;

    const { icon, source, amount, date } = req.body;

    const newIncome = await Income.create({
        userId,
        icon,
        source,
        amount,
        date: new Date(date) 
    });

    res.status(StatusCodes.OK).json(newIncome)
}
//get All Income Sources
export const getAllIncome = async (req, res) => {
    const userId = req.user.id;

    const income = await Income.find({ userId }).sort({ date: -1})
    res.status(StatusCodes.OK).json(income);
}
//Delete Income Source
export const deleteIncome = async (req, res) => {
   const deletedIncome =  await Income.findByIdAndDelete(req.params.id);

   //check if income is already deleteted
   if(deletedIncome === null) {
    const error = new Error('It seems an income is already deleted');
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
   }

    res.status(StatusCodes.OK).json({message: "an Income is Deleted Successfully"})

}
//download Excel
export const downloadIncomeExcel = async (req, res) => {
    //React Frontend Download Implementation --> search
    const userId = req.user.id;
    // 1. Query records from database
    const incomes = await Income.find({ userId }).sort({ date: -1 });

    // 2. Map MongoDB documents to clean row structures
    const data = incomes.map((item) => ({
        Source: item.source,
        'Amount (ETB)': item.amount,
        Date: new Date(item.date).toLocaleDateString(),
    }));

    // 3. Build workbook and sheet
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, 'Income Statement');

    // 4. Generate binary Buffer directly in RAM
    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // 5. Attach download headers for frontend file triggers
    res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
        'Content-Disposition',
        'attachment; filename=Income_Report.xlsx'
    );

    res.status(StatusCodes.OK).send(buffer);
   
   
};
// Update (Patch) Income Source
export const updateIncome = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    // 1. Find the income document and ensure it belongs to the logged-in user
    const updatedIncome = await Income.findOneAndUpdate(
        { _id: id, userId: userId },
        req.body,
        {
            returnDocument: 'after', // Return the newly updated document instead of the old one
            runValidators: true, // Run schema validations on updated fields
        }
    );

    // 2. Handle 404 if the income record doesn't exist or doesn't belong to this user
    if (!updatedIncome) {
        const error = new Error('Income record not found or unauthorized');
        error.statusCode = StatusCodes.NOT_FOUND;
        throw error;
    }

    // 3. Return updated object
    res.status(StatusCodes.OK).json(updatedIncome);
};

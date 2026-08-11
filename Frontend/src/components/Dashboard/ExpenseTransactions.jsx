import React from "react";
import { format } from "date-fns";
import { LuArrowRight } from "react-icons/lu";
import TransactionInfoCard from "../cards/TransactionInfoCard";
import { formattedDate } from "../../utils/helper";

const ExpenseTransactions = ({ transactions, onSeeMore }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between ">
        <h5 className="text-lg">Expenses</h5>

        <button className="card-btn" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button>
      </div>
      <div className="mt-6">
        {transactions?.slice(0, 5)?.map((expense) => (
          <TransactionInfoCard
         
            key={expense._id}
            title={expense.category}
            icon={expense.icon}
            date={formattedDate(expense.date)}
            amount={expense.amount}
            type="expense"
            hideDeleteButton
          />
        ))}
      </div>
    </div>
  );
};

export default ExpenseTransactions;
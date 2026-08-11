import React from "react";
import { LuDownload } from "react-icons/lu";
import { format } from "date-fns";
import { formattedDate } from "../../utils/helper";
import TransactionInfoCard from "../cards/TransactionInfoCard";

const IncomeList = ({ transactions, onDelete, onUpdate, onDownload }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Income Sources</h5>

        <button className="card-btn" onClick={onDownload}>
          <LuDownload className="text-base" /> Download
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {transactions?.map((income) => (
          <TransactionInfoCard
            key={income._id}
            title={income.source}
            icon={income.icon}
            date={formattedDate(income.date)}
            amount={income.amount}
            type="income"
            onDelete={() => onDelete(income._id)}
            onUpdate={() => onUpdate(income)}
          />
        ))}
      </div>
    </div>
  );
};

export default IncomeList;
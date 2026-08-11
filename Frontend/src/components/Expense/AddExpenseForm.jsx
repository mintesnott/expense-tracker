import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";

const AddExpenseForm = ({ onAddExpense, initialData, isEdit }) => { //#income
  const [expense, setExpense] = useState({
    category: initialData?.category || "",
    amount: initialData?.amount || "",
    date: initialData?.date
      ? new Date(initialData.date).toISOString().split("T")[0]
      : "",
    icon: initialData?.icon || "",
  });

  const handleChange = (key, value) => setExpense({ ...expense, [key]: value });

  return (
    <div>
      <EmojiPickerPopup
        icon={expense.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      <Input
        value={expense.category}
        onChange={({ target }) => handleChange("category", target.value)}
        label="Category"
        placeholder="Rent, Groceries, etc"
        type="text"
      />

      <Input
        value={expense.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Amount"
        placeholder=""
        type="number"
      />

      <Input
        value={expense.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        placeholder=""
        type="date"
        max={new Date().toISOString().split("T")[0]}
      />

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={() => onAddExpense(expense)}
        >
          {isEdit ? "Update Expense" : "Add Expense"}
        </button>
      </div>
    </div>
  );
};

export default AddExpenseForm;
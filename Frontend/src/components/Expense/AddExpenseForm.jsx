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

  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
            setExpense({ ...expense, [key]: value });
            setErrors({ ...errors, [key]: "" });
          }

  const handleSubmit = () => {
      const newErrors = {};

      if (!expense.category.trim()) {
          newErrors.category = "Expense category is required";
      }

      if (
          !expense.amount ||
          isNaN(expense.amount) ||
          Number(expense.amount) <= 0
      ) {
          newErrors.amount = "Amount must be greater than 0";
      }

      if (!expense.date) {
          newErrors.date = "Date is required";
      }

       if (!expense.icon) {
          newErrors.icon = "Please select an icon";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
          onAddExpense(expense);
      }
  };

  return (
    <div>
      <EmojiPickerPopup
        icon={expense.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />
      {errors.icon && (
            <p className="text-red-500 text-xs mt-1">
                {errors.icon}
            </p>
        )}

      <Input
        value={expense.category}
        onChange={({ target }) => handleChange("category", target.value)}
        label="Category"
        placeholder="Rent, Groceries, etc"
        type="text"
      />
      {errors.category && (
          <p className="text-red-500 text-xs mt-1">
              {errors.category}
          </p>
      )}

      <Input
        value={expense.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Amount"
        placeholder=""
        type="number"
      />
       {errors.amount && (
          <p className="text-red-500 text-xs mt-1">
              {errors.amount}
          </p>
      )}

      <Input
        value={expense.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        placeholder=""
        type="date"
        max={new Date().toISOString().split("T")[0]}
      />
       {errors.date && (
          <p className="text-red-500 text-xs mt-1">
              {errors.date}
          </p>
      )}

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={handleSubmit}
        >
          {isEdit ? "Update Expense" : "Add Expense"}
        </button>
      </div>
    </div>
  );
};

export default AddExpenseForm;
import React, { useState } from 'react'
import Input from '../Inputs/Input';
import EmojiPickerPopup from '../EmojiPickerPopup';


export default function AddIncomeForm( { onAddIncome, initialData, isEdit }) {
    const [income, setIncome] = useState({
      source: initialData?.source || "",
      amount: initialData?.amount || "",
      date: initialData?.date
          ? new Date(initialData.date).toISOString().split("T")[0]
          : "",
      icon: initialData?.icon || "",
  });

    const [errors, setErrors] = useState({});


    const handleChange = (key, value) => {
            setIncome({...income, [key]: value });
            setErrors({...errors, [key]: ""
    });
        };

    const handleSubmit = () => {
      const newErrors = {};

      if (!income.source.trim()) {
          newErrors.source = "Income source is required";
      }

      if (!income.amount || isNaN(income.amount) || Number(income.amount) <= 0) {
          newErrors.amount = "Amount must be greater than 0";
      }

      if (!income.date) {
          newErrors.date = "Date is required";
      }
      if (!income.icon) {
          newErrors.icon = "Please select an icon";
      }
      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
          onAddIncome(income);
      }
  };

  return (
    <div className=''>

        <EmojiPickerPopup
            icon = {income.icon}
            onSelect= {(selectedIcon) => handleChange("icon", selectedIcon)}
        />
        {errors.icon && (
            <p className="text-red-500 text-xs mt-1">
                {errors.icon}
            </p>
        )}

      <Input
        value={income.source}
        onChange = {({target}) => {
            handleChange("source", target.value);
          }}
        label = "Income Source"
        placeholder="Freelance, salary, etc..."
        type="text"
      />
      {errors.source && (
          <p className="text-red-500 text-xs mt-1">
              {errors.source}
          </p>
      )}

      <Input 
        value={income.amount}
        onChange = {({target}) => {
            handleChange("amount", target.value);
          }}
        label = "Amount"
        placeholder=""
        type="number"
      />
       {errors.amount && (
          <p className="text-red-500 text-xs mt-1">
              {errors.amount}
          </p>
      )}

       <Input 
        value={income.date}
        onChange = {({target}) => {
                handleChange("date", target.value);
              }}
        label = "Date"
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
            className="add-btn add-btn-fill"
            type='button'
            onClick={handleSubmit}
            >
               {isEdit ? "Update Income" : "Add Income"}
        </button>
      </div>
    </div>
  )
}

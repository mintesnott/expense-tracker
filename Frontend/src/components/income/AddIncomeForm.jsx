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

    const handleChange = (key, value) => setIncome({...income, [key]: value });

  return (
    <div className=''>

        <EmojiPickerPopup
            icon = {income.icon}
            onSelect= {(selectedIcon) => handleChange("icon", selectedIcon)}
        />

      <Input
        value={income.source}
        onChange = {({target}) => handleChange("source", target.value)}
        label = "Income Source"
        placeholder="Freelance, salary, etc..."
        type="text"
      />

      <Input 
        value={income.amount}
        onChange = {({target}) => handleChange("amount", target.value)}
        label = "Amount"
        placeholder=""
        type="number"
      />

       <Input 
        value={income.date}
        onChange = {({target}) => handleChange("date", target.value)}
        label = "Date"
        placeholder=""
        type="date"
        max={new Date().toISOString().split("T")[0]}
      />

      <div className="flex justify-end mt-6">
        <button 
            className="add-btn add-btn-fill"
            type='button'
            onClick={() => onAddIncome(income)}
            >
               {isEdit ? "Update Income" : "Add Income"}
        </button>
      </div>
    </div>
  )
}

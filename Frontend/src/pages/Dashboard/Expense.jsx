import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import ExpenseOverview from '../../components/Expense/ExpenseOverview';
import Modal from '../../components/Modal';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import toast from 'react-hot-toast';
import ExpenseList from '../../components/Expense/ExpenseList';
import DeleteAlert from '../../components/DeleteAlert';
import { href } from 'react-router-dom';

const Expense = () => {

  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

  const [openEditExpenseModal, setOpenEditExpenseModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  //get all expense details
  const fetchExpenseDetails = async () => {
    //if(loading) return;
    setLoading(true);

    try {
          const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);

          if(Array.isArray(response.data)) {
          setExpenseData(response.data);
        } 
      } catch(err) {
          err.backendMessage;
          console.error('Failed to fetch income:', err);

          toast.error(err.backendMessage || 'Failed to load income data');
        } finally {
          setLoading(false);
        }
  };

  //Add Expense
  const handleAddExpense = async (expense) => {
    const {category, amount, date, icon} = expense;

    //validation
    if(!category?.trim()) {
      toast.error("Category is required");
      return;
    }

    if(!amount ||isNaN(amount) || Number(amount) <=0) {
      toast.error("Amount should be a valid number greater than 0");
      return;
    }
    if(!date) {
      toast.error("Date is required.");
      return;
    }
    const today = new Date();
    const localToday = new Date( today.getTime() - today.getTimezoneOffset() * 60000
    ).toISOString().split("T")[0];

    if (date > localToday) {
        toast.error("Date cannot be in the future.");
        return;
    }
    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      });

      await fetchExpenseDetails();
      setOpenAddExpenseModal(false);
      toast.success("Expense added successfully")
    } catch(err){
      console.error('Failed to add Expense:', err);

      toast.error(
      err.backendMessage || 'Failed to add income'
            );
    }
  };

   // delete Expense
  const deleteExpense = async (id) => {
    try{
        await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
        setOpenDeleteAlert({
          show: false,
          data: null,
        })
        await fetchExpenseDetails();
        toast.success("Expense Detail Deleted successfully");
    } catch(err) {
      console.error("Error deleting expense " + err.backendMessage || err.message);
      
    }
  };

  // update Expense
  const updateExpense = async (id, expense) => {
    const { category, amount, date, icon } = expense;

    if (!category?.trim()) {
      toast.error("Category is required");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0");
      return;
    }

    if (!date) {
      toast.error("Date is required.");
      return;
    }

    const today = new Date();
    const localToday = new Date( today.getTime() - today.getTimezoneOffset() * 60000
    ).toISOString().split("T")[0];

    if (date > localToday) {
        toast.error("Date cannot be in the future.");
        return;
    }

    try {
      await axiosInstance.patch(
        API_PATHS.EXPENSE.UPDATE_EXPENSE(id),
        {
          category,
          amount,
          date,
          icon,
        }
      );

      setOpenEditExpenseModal(false);
      setSelectedExpense(null);

      toast.success("Expense updated successfully");

      await fetchExpenseDetails();

    } catch (err) {
      console.error("Failed to update expense:", err);

      toast.error(
        err.backendMessage || "Failed to update expense"
      );
    }
};

    //download Expense details
  const handleDownloadExpenseDetails = async () => {
    try{
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,{
          responseType: "blob",
        }
      );

      //create a url for the blob

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx")
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);


    } catch(err){
      console.error("Error downloading expense details", err);
      toast.error("Failed to download expense details. Please Try again");
    }
  };

   useEffect(() => {
        fetchExpenseDetails();
        return () => {};
      },[])

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <ExpenseOverview
              transactions={expenseData}
              onExpense={() => setOpenAddExpenseModal(true)}
            />
          </div>

          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => {
              setOpenDeleteAlert({
                show: true,
                data: id
              })
            }}
            onUpdate={(expense) => {
              setSelectedExpense(expense);
              setOpenEditExpenseModal(true);
            }}
            onDownload={handleDownloadExpenseDetails}
           />
        </div>

        <Modal 
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        > 
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>

        <Modal
          isOpen={openEditExpenseModal}
          onClose={() => {
            setOpenEditExpenseModal(false);
            setSelectedExpense(null);
          }}
          title="Edit Expense"
        >
          <AddExpenseForm
            initialData={selectedExpense}
            isEdit
            onAddExpense={(expense) =>
              updateExpense(selectedExpense._id, expense)
            }
          />
        </Modal>

        <Modal
            isOpen={openDeleteAlert.show}
            onClose={() => setOpenDeleteAlert({ show: false, data: null})}
            title="Delete Expense"
          >
            <DeleteAlert 
              content='Are you sure Yow want to delete this Income detail?'
              onDelete={() => deleteExpense(openDeleteAlert.data)}
            />
        </Modal>

      </div>
    </DashboardLayout>
  );
}

export default Expense

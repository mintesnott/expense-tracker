import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import IncomeOverview from '../../components/income/IncomeOverview'
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import Modal from '../../components/Modal';
import AddIncomeForm from '../../components/income/AddIncomeForm';

import { toast } from 'react-hot-toast';
import IncomeList from '../../components/income/IncomeList';
import DeleteAlert from '../../components/DeleteAlert';
import { useUserAuth } from '../../hooks/useUserAuth';


const Income = () => {

  useUserAuth();

  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);

  const [openEditIncomeModal, setOpenEditIncomeModal] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);

  //get all income details
  const fetchIncomeDetails = async () => {
    //if(loading) return;
    setLoading(true);

    try {
          const response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);

          if(Array.isArray(response.data)) {
          setIncomeData(response.data);
        } 
      } catch(err) {
        err.backendMessage;
        console.error('Failed to fetch income:', err);
              toast.error(
                  err.backendMessage || 'Failed to load income data'
              );
              setIncomeData([]);
      
      } finally {
        setLoading(false);
      }
  };
  
  //Add income
  const handleAddIncome = async (income) => {
    const {source, amount, date, icon} = income;

    //validation
    if(!source?.trim()) {
      toast.error("Source is required");
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
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon,
      });
      setOpenAddIncomeModal(false);
      toast.success("Income added successfully")
      await fetchIncomeDetails();
    } catch(err){
      console.error('Failed to add income:', err);

      toast.error(
      err.backendMessage || 'Failed to add income'
            );
    }
  };

  // delete income
  const deleteIncome = async (id) => {
    try{
        await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));

        setOpenDeleteAlert({
          show: false,
          data: null,
        })
        toast.success("Income Detail Deleted successfully");
        await fetchIncomeDetails();
    } catch(err) {
      console.error("Error deleting income " + err.backendMessage || err.message);
      
    }
  };

  // update income
  const updateIncome = async (id, income) => {
    const { source, amount, date, icon } = income;

    if (!source?.trim()) {
      toast.error("Source is required");
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
        API_PATHS.INCOME.UPDATE_INCOME(id),
        {
          source,
          amount,
          date,
          icon,
        }
      );

      setOpenEditIncomeModal(false);
      setSelectedIncome(null);

      toast.success("Income updated successfully");

      await fetchIncomeDetails();

    } catch (err) {
       
        toast.error(
            err.backendMessage || "Failed to update income"
        );
    }

};

  //download income details
  const handleDownloadIncomeDetails = async () => {
    try{
      const response = await axiosInstance.get(
        API_PATHS.INCOME.DOWNLOAD_INCOME,{
          responseType: "blob",
        }
      );

      //create a url for the blob

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Income_details.xlsx")
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);


    } catch(err){
      console.error("Error downloading Income details", err);
      toast.error("Failed to download Income details. Please Try again");
    }
  };

    useEffect(() => {
      fetchIncomeDetails();
      return () => {};
    },[])

  return (
    <DashboardLayout activeMenu="Income" >
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <IncomeOverview 
              transactions={incomeData || []}
              onAddIncome={() => setOpenAddIncomeModal(true)}
            />
          </div>

          <IncomeList 
            transactions = {incomeData}
            onDelete={(id) => {
              setOpenDeleteAlert({
                show: true,
                data: id,
              })
            }}
            onUpdate={(income) => {
              setSelectedIncome(income);
              setOpenEditIncomeModal(true);
            }}
            onDownload={handleDownloadIncomeDetails}
          />
        </div>

        <Modal 
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >

          {/* Add Income form */}
          <AddIncomeForm onAddIncome={handleAddIncome} />

        </Modal>

        <Modal
          isOpen={openEditIncomeModal}
          onClose={() => {
              setOpenEditIncomeModal(false);
              setSelectedIncome(null);
          }}
          title="Edit Income"
        >
          {/* Update Income form */}
          <AddIncomeForm
              initialData={selectedIncome}
              isEdit
              onAddIncome={(income) =>
                  updateIncome(selectedIncome._id, income)
              }
          />
        </Modal>

        <Modal
            isOpen={openDeleteAlert.show}
            onClose={() => setOpenDeleteAlert({ show: false, data: null})}
            title="Delete Income"
          >
            <DeleteAlert 
              content='Are you sure Yow want to delete this Income detail?'
              onDelete={() => deleteIncome(openDeleteAlert.data)}
            />
        </Modal>

      </div>
    </DashboardLayout>
  )
}

export default Income

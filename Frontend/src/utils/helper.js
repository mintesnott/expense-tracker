
import { format } from 'date-fns';

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;

  // Standard email format regex: user@domain.tld
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  return emailRegex.test(email.trim());
};


export const getEmailValidationError = (email) => {
  const trimmed = email ? email.trim() : '';

  if (!trimmed) {
    return 'Email address is required.';
  }

  if (!validateEmail(trimmed)) {
    return 'Please enter a valid email address.';
  }

  return null; // No error
};


export const getInitials = (name) => {
  if(!name) return;

  const words = name.split("");
  let initials = "";

  for(let i=0; i<Math.min(words.length, 2); i++){
    initials += words[i][0];
  }

  return initials.toUpperCase();
}

export const addThousandsSeparator = (num) => {
  if ( num === null || isNaN(num)) return "" ;

  const [integerPart, fractionalPart] = num.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fractionalPart
  ? `${formattedInteger}.${fractionalPart}`
  : formattedInteger
};


export const formattedDate = (date) => date 
      ? format(new Date(date), "do MMM yyyy") 
      : "";

export const formattedMonth = (date) => date 
      ? format(new Date(date), "do MMM") 
      : "";


export const prepareExpenseBarChartData = (data = []) => {

  const grouped = data.reduce((acc, item) => {
    const sameDateExpenses = formattedMonth(item?.date);

    if(!acc[sameDateExpenses]) {
      acc[sameDateExpenses] = {
        month: sameDateExpenses,
        category: [],
        amount: 0,
      }
    }
    acc[sameDateExpenses].amount += Number(item?.amount);
    if(item?.category){
      acc[sameDateExpenses].category.push(item?.category);
    }
    return acc;
  }, {});

  // Format Category array as a comma-separated string
  return Object.values(grouped).map((entry) => ({
    ...entry,
    category: entry?.category.join(", ")
  }))
};

 /*
export const prepareIncomeBarChartData = (data = []) => {
  const sortedData = [...data].sort((a,b) => new Date(a.date) - new Date(b.date));

  const  chartData = sortedData.map((item) => ({
    month: formattedMonth(item?.date),
    amount: item?.amount,
    source: item?.source,
  }));
  return chartData;
}

*/
export const prepareIncomeBarChartData = (data = []) => {
  const sortedData = [...data].sort((a,b) => new Date(a.date) - new Date(b.date));

  const grouped = sortedData.reduce((acc, item) => {
    const sameDateIncomes = formattedMonth(item?.date);

    if(!acc[sameDateIncomes]){
      acc[sameDateIncomes] = {
        month: sameDateIncomes,
        amount: 0,
        source: [],
        rawDate: item.date,
      };
    }
    acc[sameDateIncomes].amount += Number(item?.amount || 0);
    if(item?.source){
      acc[sameDateIncomes].source.push(item?.source);
    }
    return acc;
  }, {});

 // Format source array as a comma-separated string
 return Object.values(grouped).map((entry) => ({
  ...entry,
  source: entry.source.join(", ")
 }))

}

/*

// export const prepareExpenseLineChartData = (data = []) => {
//   const sortedData = [...data].sort((a,b) => new Date(a.date) - new Date(b.date));

//   const  chartData = sortedData.map((item) => ({
//     month: formattedMonth(item?.date),
//     amount: item?.amount,
//     category: item?.category,
//   }));
//   return chartData;
// }

*/

export const prepareExpenseLineChartData = (data = []) => {
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Group items by formatted date
  const grouped = sortedData.reduce((acc, item) => {
    const sameDateExpences = formattedMonth(item?.date); // "11th Aug"
    if (!acc[sameDateExpences]) {
      acc[sameDateExpences] = {
        month: sameDateExpences,
        amount: 0,
        category: [],
        rawDate: item.date,
      };
    }

    acc[sameDateExpences].amount += Number(item?.amount || 0);
    if (item?.category) {
      acc[sameDateExpences].category.push(item.category);
    }

    return acc;
  }, {});

  // Format category array as a comma-separated string
  return Object.values(grouped).map((entry) => ({
    ...entry,
    category: entry.category.join(", "),
  }));
};
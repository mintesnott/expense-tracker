import React from 'react';
import { LuArrowRight } from 'react-icons/lu';

import { format } from "date-fns";
import TransactionInfoCard from '../../components/cards/TransactionInfoCard';
import { formattedDate } from '../../utils/helper';

function RecentTransactions({ transactions, onSeeMore}) {
  return (
    <div className='card'>
      <div className="flex items-center justify-between">
        <h5 className='text-lg'>Recent Transactios</h5>

        <button className="card-btn" onClick={onSeeMore} > 
            See All <LuArrowRight className='text-base' />
        </button>
      </div>

      <div className="mt-6">
        {transactions?.slice(0, 5)?.map((item) => (
          <TransactionInfoCard 
            key={item.id}
            title={item.type === 'expense' ? item.category : item.source}
            icon={item.icon}
            date={formattedDate(item.date)}
            amount={item.amount}
            type={item.type}
            hideDeleteButton
          />
        ))}
      </div>
    </div>
  )
}

export default RecentTransactions

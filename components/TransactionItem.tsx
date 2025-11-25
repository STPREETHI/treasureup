import React from 'react';
import { Transaction } from '../types';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: string) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onEdit, onDelete }) => {
  const { id, residentName, houseNo, amount, mode, reason, date, type } = transaction;

  const modeStyles = mode === 'Cash' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-blue-100 text-blue-800';
  
  const formattedDate = new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const amountColor = type === 'Received' ? 'text-green-600' : 'text-red-600';
  const amountPrefix = type === 'Received' ? '+' : '-';

  return (
    <li className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
      <div className="flex-1">
        <div className="flex items-center gap-2">
           <span className={`text-xs font-bold ${type === 'Received' ? 'text-green-500' : 'text-red-500'}`}>
             {type.toUpperCase()}
           </span>
           <p className="font-bold text-gray-800">{residentName} <span className="text-sm font-normal text-gray-500">({houseNo})</span></p>
        </div>
        <p className="text-sm text-gray-600 pl-20">{reason}</p>
        <p className="text-xs text-gray-400 mt-1 pl-20">{formattedDate}</p>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${modeStyles}`}>{mode}</span>
        <p className={`text-lg font-semibold w-28 text-right ${amountColor}`}>
          {amountPrefix}₹{amount.toLocaleString('en-IN')}
        </p>
        <div className="flex space-x-2">
            <button onClick={() => onEdit(transaction)} className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100" aria-label="Edit transaction">
                <PencilIcon />
            </button>
            <button onClick={() => onDelete(id)} className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100" aria-label="Delete transaction">
                <TrashIcon />
            </button>
        </div>
      </div>
    </li>
  );
};

const PencilIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

const TrashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export default TransactionItem;

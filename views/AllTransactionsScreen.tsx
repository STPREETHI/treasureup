// views/AllTransactionsScreen.tsx — FINAL PROFESSIONAL & WORKING VERSION
import React, { useMemo, useState } from 'react';
import { Transaction, Resident } from '../types';
import TransactionItem from '../components/TransactionItem';
import { generatePdf } from '../utils/pdfGenerator';
import { generateCsv } from '../utils/excelGenerator';
import { generateFinancialYearPDF } from '../utils/financialYearReport';

interface AllTransactionsScreenProps {
  transactions: Transaction[];
  residents: Resident[];
  onEditTransaction: (t: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

const AllTransactionsScreen: React.FC<AllTransactionsScreenProps> = ({
  transactions,
  residents,
  onEditTransaction,
  onDeleteTransaction
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'Cash' | 'Account'>('all');
  const [filterType, setFilterType] = useState<'all' | 'Received' | 'Paid'>('all');

  const filtered = useMemo(() => {
    return transactions
      .filter(t => 
        (filterMode === 'all' || t.mode === filterMode) && 
        (filterType === 'all' || t.type === filterType)
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filterMode, filterType]);

  const handleFYReport = () => {
    const fy = prompt("Enter Financial Year (e.g., 2025-2026)", "2025-2026");
    if (!fy || !fy.includes('-')) {
      alert("Please enter valid format: 2025-2026");
      return;
    }

    const openingInput = prompt("Opening Balance on 1st April?", "0");
    const openingBalance = Number(openingInput) || 0;

    // This will download the PDF instantly
    generateFinancialYearPDF(fy, transactions, residents, openingBalance);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Header + Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">All Transactions</h2>
        
        <div className="flex flex-wrap gap-3">
          {/* FY Report Button - CLEAN & PROFESSIONAL */}
          <button
            onClick={handleFYReport}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded transition shadow-md"
          >
            FY Report (PDF)
          </button>

          <button
            onClick={() => generateCsv("Nethaji_Nagar_Transactions", filtered)}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-5 rounded transition"
          >
            Export Excel
          </button>

          <button
            onClick={() => generatePdf("All Transactions", filtered)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded transition"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-6 text-sm">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-medium text-gray-700 min-w-20">Mode:</span>
            {(['all', 'Cash', 'Account'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={`px-4 py-1.5 rounded font-medium transition ${
                  filterMode === mode 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                {mode === 'all' ? 'All' : mode}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-medium text-gray-700 min-w-20">Type:</span>
            {(['all', 'Received', 'Paid'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-1.5 rounded font-medium transition ${
                  filterType === type 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                {type === 'all' ? 'All' : type === 'Received' ? 'Income' : 'Expense'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction List */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map(transaction => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onEdit={onEditTransaction}
              onDelete={onDeleteTransaction}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-gray-500">
            {transactions.length === 0 
              ? "No transactions recorded yet." 
              : "No transactions match the selected filters."
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default AllTransactionsScreen;
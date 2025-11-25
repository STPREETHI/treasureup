import React, { useState, useMemo } from 'react';
import { Transaction, Resident } from '../types';
import TransactionItem from '../components/TransactionItem';
import { generatePdf } from '../utils/pdfGenerator';
import { generateCsv } from '../utils/excelGenerator';

interface ResidentsScreenProps {
  residents: Resident[];
  transactions: Transaction[];
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (transactionId: string) => void;
}

const SearchResidentScreen: React.FC<ResidentsScreenProps> = ({ residents, transactions, onEditTransaction, onDeleteTransaction }) => {
  const [query, setQuery] = useState('');
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);

  const filteredResidents = useMemo(() => {
    const sortedResidents = [...residents].sort((a, b) => a.name.localeCompare(b.name));
    if (!query) return sortedResidents;
    const lowerCaseQuery = query.toLowerCase();
    return sortedResidents.filter(res =>
      res.name.toLowerCase().includes(lowerCaseQuery) ||
      res.houseNo.toLowerCase().includes(lowerCaseQuery)
    );
  }, [query, residents]);

  const residentTransactions = useMemo(() => {
    if (!selectedResident) return [];
    return transactions
      .filter(t => t.houseNo === selectedResident.houseNo && t.residentName === selectedResident.name)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedResident, transactions]);

  const handleExportPdf = () => {
    if (selectedResident && residentTransactions.length > 0) {
      generatePdf(`Transaction History for ${selectedResident.name}`, residentTransactions);
    }
  };
  
  const handleExportExcel = () => {
    if (selectedResident && residentTransactions.length > 0) {
      generateCsv(`Transaction_History_${selectedResident.name.replace(/\s/g, '_')}`, residentTransactions);
    }
  };

  // Render view for selected resident's history
  if (selectedResident) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <div>
            <button onClick={() => setSelectedResident(null)} className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 mb-2">
                <ArrowLeftIcon />
                Back to Residents List
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedResident.name} <span className="text-lg font-normal text-gray-500">({selectedResident.houseNo})</span>
            </h2>
            <p className="text-gray-600">Transaction History</p>
          </div>
          <div className="flex space-x-2">
            <button
                onClick={handleExportExcel}
                className="bg-teal-600 text-white font-bold py-2 px-4 rounded hover:bg-teal-700 transition duration-300 text-sm"
            >
                Export as Excel
            </button>
            <button
                onClick={handleExportPdf}
                className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-300 text-sm"
            >
                Export as PDF
            </button>
          </div>
        </div>

        {residentTransactions.length > 0 ? (
          <ul className="space-y-4">
            {residentTransactions.map(t => (
              <TransactionItem 
                key={t.id} 
                transaction={t} 
                onEdit={onEditTransaction} 
                onDelete={onDeleteTransaction} 
              />
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 py-4">No transactions found for this resident.</p>
        )}
      </div>
    );
  }

  // Render view for the list of all residents
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Residents</h2>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Resident Name or House No."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {filteredResidents.length > 0 ? (
        <ul className="space-y-3">
          {filteredResidents.map(res => (
            <li 
              key={res.id} 
              onClick={() => setSelectedResident(res)}
              className="bg-gray-50 p-4 rounded-lg hover:bg-indigo-50 transition-colors duration-200 cursor-pointer flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-gray-800">{res.name}</p>
                <p className="text-sm text-gray-500">{res.houseNo}</p>
              </div>
              <ChevronRightIcon />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 py-4">No residents found.</p>
      )}
    </div>
  );
};

// SVG Icons
const ArrowLeftIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const ChevronRightIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

export default SearchResidentScreen;
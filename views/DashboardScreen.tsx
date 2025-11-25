import React, { useMemo } from 'react';
import { Transaction } from '../types';
import TransactionItem from '../components/TransactionItem';

interface DashboardScreenProps {
  transactions: Transaction[];
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (transactionId: string) => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({
  transactions,
  onEditTransaction,
  onDeleteTransaction
}) => {

  const { cashTotal, accountTotal, treasuryTotal } = useMemo(() => {
    let cash = 0;
    let account = 0;

    transactions.forEach(t => {
      const value = t.type === 'Received' ? t.amount : -t.amount;
      if (t.mode === 'Cash') cash += value;
      else if (t.mode === 'Account') account += value;
    });

    return {
      cashTotal: cash,
      accountTotal: account,
      treasuryTotal: cash + account,
    };
  }, [transactions]);

  const recentTransactions = useMemo(() => {
    return transactions.slice(0, 7);
  }, [transactions]);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-10 p-4">

      {/* Financial Overview — Glassmorphism Style */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Financial Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Bank Balance */}
          <div className="bg-white/70 backdrop-blur-lg border border-gray-200/50 rounded-2xl shadow-lg p-8 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-lg font-medium">Bank / UPI Balance</p>
                <p className="text-4xl font-bold text-gray-800 mt-3">{formatAmount(accountTotal)}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-xl">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Cash in Hand */}
          <div className="bg-white/70 backdrop-blur-lg border border-gray-200/50 rounded-2xl shadow-lg p-8 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-lg font-medium">Cash in Hand</p>
                <p className="text-4xl font-bold text-gray-800 mt-3">{formatAmount(cashTotal)}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-xl">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Treasury */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200/50 rounded-2xl shadow-lg p-8 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-700 text-lg font-semibold">Total Treasury</p>
                <p className="text-5xl font-extrabold text-indigo-800 mt-3">{formatAmount(treasuryTotal)}</p>
              </div>
              <div className="bg-indigo-100 p-5 rounded-xl">
                <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-4m-6 0H5a2 2 0 002-2v-2m10 4h4m-4-8h4m-4-4h-4m-8 8h.01M12 8h.01M16 12h.01" />
                </svg>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Recent Transactions */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Transactions</h2>

        {recentTransactions.length > 0 ? (
          <div className="bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-lg overflow-hidden">
            <div className="divide-y divide-gray-200">
              {recentTransactions.map(transaction => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onEdit={onEditTransaction}
                  onDelete={onDeleteTransaction}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white/70 backdrop-blur-md rounded-2xl border border-gray-200">
            <p className="text-xl text-gray-600 font-medium">No transactions yet</p>
            <p className="text-gray-500 mt-2">Your treasury journey begins with the first entry</p>
          </div>
        )}
      </section>

    </div>
  );
};

export default DashboardScreen;
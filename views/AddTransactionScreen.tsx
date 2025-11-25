import React, { useState, useEffect } from 'react';
import { Transaction, Resident } from '../types';
import firebase from 'firebase/compat/app';
const Timestamp = firebase.firestore.Timestamp;

interface AddTransactionScreenProps {
  onClose: () => void;
  onSubmit: (transaction: any) => Promise<void>;
  transactionToEdit?: Transaction | null;
  residents: Resident[];
  existingTransactions: Transaction[]; // ← ADD THIS PROP
}

const AddTransactionScreen: React.FC<AddTransactionScreenProps> = ({
  onClose,
  onSubmit,
  transactionToEdit,
  residents,
  existingTransactions
}) => {
  const isEditMode = !!transactionToEdit;

  const [type, setType] = useState<'Received' | 'Paid'>('Received');
  const [incomeType, setIncomeType] = useState<'Subscription' | 'Other'>('Other');
  const [residentName, setResidentName] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState<'Cash' | 'Account'>('Account');
  const [reason, setReason] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [subscriptionStart, setSubscriptionStart] = useState('');
  const [subscriptionEnd, setSubscriptionEnd] = useState('');
  const [receiptNo, setReceiptNo] = useState('');
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<Resident[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Set current FY
  useEffect(() => {
    if (!isEditMode) {
      const today = new Date();
      const year = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
      setSubscriptionStart(`${year}-04`);
      setSubscriptionEnd(`${year + 1}-03`);
      setReceiptNo(`REC-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-`);
    }
  }, [isEditMode]);

  // Edit mode
  useEffect(() => {
    if (isEditMode && transactionToEdit) {
      setType(transactionToEdit.type);
      setResidentName(transactionToEdit.residentName);
      setHouseNo(transactionToEdit.houseNo);
      setAmount(String(transactionToEdit.amount));
      setMode(transactionToEdit.mode);
      setReason(transactionToEdit.reason || '');
      setPaymentDate(new Date(transactionToEdit.date).toISOString().split('T')[0]);
      setReceiptNo(transactionToEdit.receiptNo || '');

      if (transactionToEdit.reason.includes('Subscription')) {
        setIncomeType('Subscription');
        // Try to extract month from reason
        const match = transactionToEdit.reason.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4}/);
        if (match) {
          const [monthStr, yearStr] = match[0].split(' ');
          const monthIndex = monthNames.indexOf(monthStr);
          if (monthIndex !== -1) {
            setSubscriptionStart(`${yearStr}-${String(monthIndex + 1).padStart(2, '0')}`);
            setSubscriptionEnd(`${yearStr}-${String(monthIndex + 1).padStart(2, '0')}`);
          }
        }
      }
    }
  }, [transactionToEdit, isEditMode]);

  // Auto-fill for Expense
  useEffect(() => {
    if (type === 'Paid') {
      setResidentName('Society Expense');
      setHouseNo('N/A');
      setIncomeType('Other');
    }
  }, [type]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setResidentName(value);
    if (value && type !== 'Paid') {
      const filtered = residents.filter(r =>
        r.name.toLowerCase().includes(value.toLowerCase()) ||
        r.houseNo.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (resident: Resident) => {
    setResidentName(resident.name);
    setHouseNo(resident.houseNo);
    setSuggestions([]);
  };

  // MAIN VALIDATION: PREVENT DUPLICATE SUBSCRIPTION
  const checkDuplicateSubscription = (targetMonth: number, targetYear: number): boolean => {
    return existingTransactions.some(t => {
      if (t.id === transactionToEdit?.id) return false; // Allow editing same transaction
      if (t.residentName !== residentName && t.houseNo !== houseNo) return false;
      if (!t.reason.toLowerCase().includes('subscription')) return false;

      const date = new Date(t.date);
      return date.getMonth() === targetMonth && date.getFullYear() === targetYear;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError('');

    if (!receiptNo.trim()) {
      setError('Please enter Receipt Number');
      setIsSubmitting(false);
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Enter valid amount');
      setIsSubmitting(false);
      return;
    }

    try {
      if (incomeType === 'Subscription' && type === 'Received') {
        if (!subscriptionStart || !subscriptionEnd) {
          setError('Please select subscription period');
          setIsSubmitting(false);
          return;
        }

        const start = new Date(subscriptionStart + '-01');
        const end = new Date(subscriptionEnd + '-01');
        const monthsDiff = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth() + 1;

        if (numericAmount !== monthsDiff * 100) {
          if (!confirm(`Amount ₹${numericAmount} ≠ ₹${monthsDiff * 100} for ${monthsDiff} months. Continue?`)) {
            setIsSubmitting(false);
            return;
          }
        }

        // CHECK FOR DUPLICATES BEFORE SAVING
        for (let i = 0; i < monthsDiff; i++) {
          const current = new Date(start);
          current.setMonth(start.getMonth() + i);

          if (checkDuplicateSubscription(current.getMonth(), current.getFullYear())) {
            const monthDisplay = `${monthNames[current.getMonth()]} ${current.getFullYear()}`;
            alert(`ERROR: Subscription already paid for ${monthDisplay}!\nCannot add duplicate payment.`);
            setIsSubmitting(false);
            return;
          }
        }

        // SAVE ONLY IF NO DUPLICATES
        for (let i = 0; i < monthsDiff; i++) {
          const current = new Date(start);
          current.setMonth(start.getMonth() + i);
          const monthYear = `${monthNames[current.getMonth()]} ${current.getFullYear()}`;

          await onSubmit({
            residentName,
            houseNo,
            amount: 100,
            mode,
            type: 'Received',
            reason: `Monthly Subscription - ${monthYear}`,
            date: Timestamp.fromDate(current),
            paymentDate: Timestamp.fromDate(new Date(paymentDate)),
            receiptNo: receiptNo.trim() + (monthsDiff > 1 ? `/${i + 1}` : ''),
            subscriptionPeriod: `${subscriptionStart} to ${subscriptionEnd}`
          });
        }

        alert(`SUCCESS!\n₹${monthsDiff * 100} recorded for ${monthsDiff} months\nReceipt: ${receiptNo.trim()}`);
      } else {
        // Normal transaction
        await onSubmit({
          residentName,
          houseNo,
          amount: numericAmount,
          mode,
          type,
          reason: reason || (type === 'Paid' ? 'Society Expense' : 'Other Income'),
          date: Timestamp.fromDate(new Date(paymentDate)),
          receiptNo: receiptNo.trim()
        });
        alert('Transaction saved!');
      }

      onClose();
    } catch (err: any) {
      setError('Save failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-full overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              {isEditMode ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Receipt Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Receipt Number <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={receiptNo}
                onChange={e => setReceiptNo(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-indigo-600 text-xl font-mono"
                placeholder="REC-2025-04-001"
                required
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Transaction Type</label>
              <div className="grid grid-cols-2 gap-6">
                <label className="flex items-center p-5 border-2 rounded-xl cursor-pointer hover:bg-indigo-50">
                  <input type="radio" name="type" value="Received" checked={type === 'Received'} onChange={() => setType('Received')} className="w-6 h-6 text-indigo-600" />
                  <span className="ml-4 text-lg font-medium">Income</span>
                </label>
                <label className="flex items-center p-5 border-2 rounded-xl cursor-pointer hover:bg-red-50">
                  <input type="radio" name="type" value="Paid" checked={type === 'Paid'} onChange={() => setType('Paid')} className="w-6 h-6 text-red-600" />
                  <span className="ml-4 text-lg font-medium">Expense</span>
                </label>
              </div>
            </div>

            {/* Income Category */}
            {type === 'Received' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Income Category</label>
                <div className="grid grid-cols-2 gap-6">
                  <label className={`p-6 border-2 rounded-xl cursor-pointer text-center transition ${incomeType === 'Other' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'}`}>
                    <input type="radio" name="cat" value="Other" checked={incomeType === 'Other'} onChange={() => setIncomeType('Other')} className="hidden" />
                    <div className="text-xl font-bold">Other Income</div>
                  </label>
                  <label className={`p-6 border-2 rounded-xl cursor-pointer text-center transition ${incomeType === 'Subscription' ? 'border-green-600 bg-green-50' : 'border-gray-300'}`}>
                    <input type="radio" name="cat" value="Subscription" checked={incomeType === 'Subscription'} onChange={() => setIncomeType('Subscription')} className="hidden" />
                    <div className="text-xl font-bold text-green-700">Monthly Subscription</div>
                  </label>
                </div>
              </div>
            )}

            {/* Subscription Period */}
            {incomeType === 'Subscription' && type === 'Received' && (
              <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6">
                <h3 className="text-lg font-bold text-green-800 mb-4">Subscription Period</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                    <input type="month" value={subscriptionStart} onChange={e => setSubscriptionStart(e.target.value)} className="w-full px-4 py-3 border-2 border-green-400 rounded-lg" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                    <input type="month" value={subscriptionEnd} onChange={e => setSubscriptionEnd(e.target.value)} className="w-full px-4 py-3 border-2 border-green-400 rounded-lg" required />
                  </div>
                </div>
                <p className="text-sm text-green-700 mt-4 font-medium">
                  Payment received on: <strong>{new Date(paymentDate).toLocaleDateString('en-IN')}</strong>
                </p>
              </div>
            )}

            {/* Resident */}
            <div className="grid grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Resident Name</label>
                <input
                  type="text"
                  value={residentName}
                  onChange={handleNameChange}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-indigo-600"
                  placeholder={type === 'Paid' ? 'Society Expense' : 'Search by name or house no...'}
                  disabled={type === 'Paid'}
                  required
                />
                {suggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border mt-1 rounded-xl shadow-xl max-h-60 overflow-auto">
                    {suggestions.map(r => (
                      <li key={r.id} onClick={() => selectSuggestion(r)} className="px-5 py-4 hover:bg-indigo-50 cursor-pointer flex justify-between">
                        <span className="font-medium">{r.name}</span>
                        <span className="text-gray-500">{r.houseNo}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">House No.</label>
                <input
                  type="text"
                  value={houseNo}
                  onChange={e => setHouseNo(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl"
                  disabled={type === 'Paid'}
                  required
                />
              </div>
            </div>

            {/* Amount & Mode */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl text-2xl font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Mode</label>
                <select value={mode} onChange={e => setMode(e.target.value as any)} className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl text-lg">
                  <option value="Account">Bank / UPI</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
            </div>

            {/* Payment Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Received On</label>
              <input
                type="date"
                value={paymentDate}
                onChange={e => setPaymentDate(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl"
                required
              />
            </div>

            {/* Reason */}
            {(incomeType === 'Other' || type === 'Paid') && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {type === 'Paid' ? 'Expense Reason' : 'Description'}
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl"
                  placeholder="e.g., Water Tank Repair"
                  required
                />
              </div>
            )}

            {error && <div className="p-5 bg-red-100 border-2 border-red-400 text-red-800 rounded-xl font-medium">{error}</div>}

            <div className="flex justify-end gap-6 pt-8">
              <button type="button" onClick={onClose} className="px-8 py-4 bg-gray-200 text-gray-800 rounded-xl font-bold text-lg hover:bg-gray-300">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-10 py-4 rounded-xl font-bold text-white text-lg ${isSubmitting ? 'bg-gray-500' : incomeType === 'Subscription' ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                {isSubmitting ? 'Saving...' : 'Save Transaction'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionScreen;
// App.tsx — FINAL RESPONSIVE MASTERPIECE (Mobile + Desktop)
import React, { useState, useEffect, useCallback } from 'react';
import { Transaction, User, View, Resident, UserRole } from './types';
import { USERS } from './constants';
import LoginScreen from './views/LoginScreen';
import DashboardScreen from './views/DashboardScreen';
import AllTransactionsScreen from './views/AllTransactionsScreen';
import SearchResidentScreen from './views/SearchResidentScreen';
import AddTransactionScreen from './views/AddTransactionScreen';
import RegisterResidentScreen from './views/RegisterResidentScreen';
import { auth, db } from './firebaseConfig';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

type FirebaseUser = firebase.User;
const Timestamp = firebase.firestore.Timestamp;

const toDate = (input: any): Date => {
  if (!input) return new Date();
  if (input instanceof Date) return input;
  if (typeof input.toDate === 'function') return input.toDate();
  if (typeof input === 'string' && input.includes('-')) {
    const [y, m, d] = input.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(input);
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Auth & Data Loading (unchanged)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setFirebaseUser(currentUser);
      if (currentUser) {
        const appUser = USERS.find(u =>
          u.username.toLowerCase() === currentUser.email?.split('@')[0].toLowerCase()
        );
        setUser(appUser || null);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!firebaseUser) return;
    db.collection('residents').orderBy('name').onSnapshot(snap => {
      setResidents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resident)));
    });
    db.collection('transactions').orderBy('date', 'desc').onSnapshot(snapshot => {
      const list: Transaction[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        list.push({
          id: doc.id,
          residentName: data.residentName || 'Unknown',
          houseNo: data.houseNo || 'N/A',
          amount: Number(data.amount) || 0,
          mode: data.mode || 'Account',
          type: data.type || 'Received',
          reason: data.reason || '',
          date: data.date ? toDate(data.date).toISOString() : new Date().toISOString(),
          receiptNo: data.receiptNo || '',
          paymentDate: data.paymentDate ? toDate(data.paymentDate).toISOString() : undefined,
          subscriptionPeriod: data.subscriptionPeriod || null,
        } as Transaction);
      });
      setTransactions(list);
    });
  }, [firebaseUser]);

  const handleLogout = () => auth.signOut();

  const handleTransactionSubmit = useCallback(async (formData: any) => {
    if (!firebaseUser) return alert("Not authenticated");

    const payload: any = {
      residentName: formData.residentName || '',
      houseNo: formData.houseNo || '',
      amount: Number(formData.amount) || 0,
      mode: formData.mode || 'Account',
      type: formData.type || 'Received',
      reason: formData.reason || '',
      date: Timestamp.fromDate(toDate(formData.date)),
      receiptNo: formData.receiptNo || '',
      paymentDate: formData.paymentDate ? Timestamp.fromDate(toDate(formData.paymentDate)) : null,
      subscriptionPeriod: formData.subscriptionPeriod || null,
    };

    try {
      if (editingTransaction) {
        await db.collection('transactions').doc(editingTransaction.id).update(payload);
      } else {
        await db.collection('transactions').add(payload);
      }
      setAddModalOpen(false);
      setEditingTransaction(null);
    } catch (err: any) {
      alert('Save failed: ' + err.message);
    }
  }, [firebaseUser, editingTransaction]);

  const deleteTransaction = useCallback(async (id: string) => {
    if (confirm('Delete permanently?')) {
      await db.collection('transactions').doc(id).delete();
    }
  }, []);

  const addResident = useCallback(async (resident: Omit<Resident, 'id'>) => {
    await db.collection('residents').add(resident);
    alert('Resident registered!');
    setCurrentView('dashboard');
  }, []);

  const openEditModal = (t: Transaction) => {
    setEditingTransaction(t);
    setAddModalOpen(true);
  };

  const closeModal = () => {
    setAddModalOpen(false);
    setEditingTransaction(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-indigo-800 mb-4">NETHAJI NAGAR</h1>
          <p className="text-xl text-gray-700">Loading Treasury...</p>
        </div>
      </div>
    );
  }

  if (!user) return <LoginScreen />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* Header — Responsive */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-indigo-800">NETHAJI NAGAR</h1>
              <p className="text-sm sm:text-base text-indigo-600 font-medium">Residents Welfare Association</p>
            </div>
            <div className="text-right">
              <p className="text-base font-semibold text-gray-800">{user.name}</p>
              <p className="text-sm text-indigo-600">{user.role}</p>
              <button onClick={handleLogout} className="text-sm text-indigo-600 underline mt-1">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Navigation (Hidden on Mobile) */}
      <nav className="hidden md:block bg-white/70 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-center space-x-8">
            {[
              { view: 'dashboard', label: 'Dashboard' },
              { view: 'all_transactions', label: 'All Transactions' },
              { view: 'residents', label: 'Residents' },
              user.role === UserRole.Treasurer && { view: 'register_resident', label: 'Register Resident' }
            ].filter(Boolean).map((item: any) => (
              <button
                key={item.view}
                onClick={() => setCurrentView(item.view)}
                className={`px-8 py-3 rounded-xl font-medium text-lg transition ${
                  currentView === item.view
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-300 z-50">
        <div className="grid grid-cols-4 gap-1 p-3">
          {[
            { view: 'dashboard', icon: 'Home', label: 'Home' },
            { view: 'all_transactions', icon: 'List', label: 'All' },
            { view: 'residents', icon: 'Users', label: 'Residents' },
            user.role === UserRole.Treasurer && { view: 'register_resident', icon: 'Plus', label: 'Add' }
          ].filter(Boolean).map((item: any) => (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={`flex flex-col items-center py-3 rounded-lg transition ${
                currentView === item.view
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="text-2xl mb-1">{item.icon === 'Home' && 'Home'}{item.icon === 'List' && 'List'}{item.icon === 'Users' && 'Users'}{item.icon === 'Plus' && 'Plus'}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content — Responsive Padding */}
      <main className="px-4 py-6 pb-24 md:pb-10 max-w-7xl mx-auto">
        {currentView === 'dashboard' && <DashboardScreen transactions={transactions} onEditTransaction={openEditModal} onDeleteTransaction={deleteTransaction} />}
        {currentView === 'all_transactions' && <AllTransactionsScreen transactions={transactions} residents={residents} onEditTransaction={openEditModal} onDeleteTransaction={deleteTransaction} />}
        {currentView === 'residents' && <SearchResidentScreen residents={residents} transactions={transactions} onEditTransaction={openEditModal} onDeleteTransaction={deleteTransaction} />}
        {currentView === 'register_resident' && <RegisterResidentScreen onAddResident={addResident} onDone={() => setCurrentView('dashboard')} />}
      </main>

      {/* Floating + Button — Perfect on Mobile */}
      <button
        onClick={() => { setEditingTransaction(null); setAddModalOpen(true); }}
        className="fixed bottom-20 right-4 md:bottom-8 md:right-8 bg-indigo-600 hover:bg-indigo-700 text-white w-14 h-14 rounded-full shadow-2xl text-3xl font-bold flex items-center justify-center z-50 transition transform hover:scale-110"
      >
        Plus
      </button>

      {/* Full-Screen Modal for Mobile */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-full overflow-y-auto">
            <AddTransactionScreen
              onClose={closeModal}
              onSubmit={handleTransactionSubmit}
              transactionToEdit={editingTransaction || undefined}
              residents={residents}
              existingTransactions={transactions}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
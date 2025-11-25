import React, { useState } from 'react';
import { Resident } from '../types';

interface RegisterResidentScreenProps {
  onAddResident: (resident: Omit<Resident, 'id'>) => void;
  onDone: () => void;
}

const RegisterResidentScreen: React.FC<RegisterResidentScreenProps> = ({ onAddResident, onDone }) => {
  const [name, setName] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !houseNo.trim()) {
      setError('Resident Name and House No. are required.');
      return;
    }
    setError('');
    onAddResident({ name, houseNo, contact });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Register New Resident</h2>
            <button onClick={onDone} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Back to Dashboard
            </button>
        </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Resident Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., John Doe"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">House No.</label>
          <input 
            type="text" 
            value={houseNo} 
            onChange={e => setHouseNo(e.target.value)} 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., A-101"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Information (Optional)</label>
          <input 
            type="text" 
            value={contact} 
            onChange={e => setContact(e.target.value)} 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., 9876543210"
          />
        </div>
        
        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end pt-4">
          <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-semibold">
            Register Resident
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterResidentScreen;
import { Transaction, User, UserRole, Resident } from './types';

export const USERS: User[] = [
  { username: 'treasurer', role: UserRole.Treasurer },
  { username: 'secretary', role: UserRole.Secretary },
];

// NOTE: This data is now for demonstration purposes only.
// The app will fetch live data from Firestore once connected.
export const INITIAL_RESIDENTS: Resident[] = [
  { id: 'res-1', name: 'John Doe', houseNo: 'A-101', contact: '111-222-3333' },
  { id: 'res-2', name: 'Jane Smith', houseNo: 'B-203', contact: '222-333-4444' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', residentName: 'John Doe', houseNo: 'A-101', amount: 2500, mode: 'Account', type: 'Received', reason: 'Monthly Maintenance', date: '2023-10-01T10:00:00Z' },
  { id: '2', residentName: 'Jane Smith', houseNo: 'B-203', amount: 500, mode: 'Cash', type: 'Received', reason: 'Event Contribution', date: '2023-10-03T14:30:00Z' },
  { id: '3', residentName: 'Society Expense', houseNo: 'N/A', amount: 5000, mode: 'Account', type: 'Paid', reason: 'Security Services', date: '2023-10-05T09:00:00Z' },
  { id: '4', residentName: 'Mary Johnson', houseNo: 'C-301', amount: 3000, mode: 'Account', type: 'Received', reason: 'Maintenance + Arrears', date: '2023-10-05T11:00:00Z' },
  { id: '5', residentName: 'John Doe', houseNo: 'A-101', amount: 200, mode: 'Cash', type: 'Received', reason: 'Parking Fee', date: '2023-10-10T18:00:00Z' },
];

export interface Transaction {
  id: string;
  residentName: string;
  houseNo: string;
  amount: number;
  mode: 'Cash' | 'Account';
  type: 'Received' | 'Paid';
  reason: string;
  date: string;
  receiptNo?: string; // ← ADD THIS
}

export interface Resident {
  id: string;
  name: string;
  houseNo: string;
  contact?: string;
}

export enum UserRole {
  Treasurer = 'Treasurer',
  Secretary = 'Secretary',
}

export interface User {
  username: string;
  role: UserRole;
}

export type View = 'dashboard' | 'all_transactions' | 'residents' | 'register_resident';

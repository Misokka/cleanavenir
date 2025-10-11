export interface Account {
  id: string;
  accountNumber: string;
  type: 'checking' | 'savings' | 'investment';
  balance: number;
  currency: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  currency: string;
  type: 'credit' | 'debit';
  category: string;
  description: string;
  merchantName?: string;
  createdAt: Date;
}

export interface BankStats {
  totalUsers: number;
  totalTransactions: number;
  satisfactionRate: number;
}
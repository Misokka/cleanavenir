import { Account, Transaction, BankStats } from './types';

export const mockAccounts: Account[] = [
  {
    id: '1',
    accountNumber: 'FR76 1234 5678 9012 3456 78',
    type: 'checking',
    balance: 2450.75,
    currency: 'EUR',
    name: 'Compte Courant',
    isActive: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    accountNumber: 'FR76 9876 5432 1098 7654 32',
    type: 'savings',
    balance: 15230.00,
    currency: 'EUR',
    name: 'Livret Épargne',
    isActive: true,
    createdAt: new Date('2024-02-20'),
  },
  {
    id: '3',
    accountNumber: 'FR76 5678 1234 5678 9012 34',
    type: 'investment',
    balance: 8750.25,
    currency: 'EUR',
    name: 'Compte Investissement',
    isActive: true,
    createdAt: new Date('2024-03-10'),
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: 't1',
    accountId: '1',
    amount: -45.90,
    currency: 'EUR',
    type: 'debit',
    category: 'Alimentation',
    description: 'Courses hebdomadaires',
    merchantName: 'SuperMarché Plus',
    createdAt: new Date('2024-12-08'),
  },
  {
    id: 't2',
    accountId: '1',
    amount: 2500.00,
    currency: 'EUR',
    type: 'credit',
    category: 'Salaire',
    description: 'Virement salaire',
    merchantName: 'Entreprise ABC',
    createdAt: new Date('2024-12-01'),
  },
  {
    id: 't3',
    accountId: '2',
    amount: 500.00,
    currency: 'EUR',
    type: 'credit',
    category: 'Épargne',
    description: 'Virement vers épargne',
    createdAt: new Date('2024-12-01'),
  },
  {
    id: 't4',
    accountId: '1',
    amount: -89.99,
    currency: 'EUR',
    type: 'debit',
    category: 'Divertissement',
    description: 'Abonnement streaming',
    merchantName: 'StreamingService Pro',
    createdAt: new Date('2024-12-05'),
  },
];

export const mockBankStats: BankStats = {
  totalUsers: 125000,
  totalTransactions: 2500000,
  satisfactionRate: 98,
};

export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
};

export const getAccountTypeLabel = (type: Account['type'], locale: string = 'fr'): string => {
  const labels = {
    fr: {
      checking: 'Compte Courant',
      savings: 'Compte Épargne',
      investment: 'Compte Investissement',
    },
    en: {
      checking: 'Checking Account',
      savings: 'Savings Account',
      investment: 'Investment Account',
    },
  };
  
  return labels[locale as keyof typeof labels]?.[type] || type;
};

export const formatDate = (date: Date, locale: string = 'fr'): string => {
  return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US');
};
// Types pour le dashboard
export interface DashboardAccount {
  id: string;
  accountNumber: string;
  type: 'checking' | 'savings' | 'investment';
  balance: number;
  currency: 'EUR';
  isActive: boolean;
  createdAt: Date;
  interestRate?: number; // Pour les comptes d'épargne
}

export interface Operation {
  id: string;
  accountId: string;
  type: 'credit' | 'debit';
  amount: number;
  currency: 'EUR';
  description: string;
  date: Date;
  category: string;
}

export interface SavingsRate {
  baseRate: number; // Taux de base
  premiumRate: number; // Taux premium
  minimumAmount: number; // Montant minimum
  lastUpdated: Date;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'client' | 'business' | 'premium';
  joinedAt: Date;
}

// Mock des comptes utilisateur
export const mockAccounts: DashboardAccount[] = [
  {
    id: 'acc-001',
    accountNumber: 'FR76 1234 5678 9012 3456 789A',
    type: 'checking',
    balance: 2847.5,
    currency: 'EUR',
    isActive: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'acc-002',
    accountNumber: 'FR76 1234 5678 9012 3456 789B',
    type: 'savings',
    balance: 15420,
    currency: 'EUR',
    isActive: true,
    createdAt: new Date('2024-02-20'),
    interestRate: 2.5
  },
  {
    id: 'acc-003',
    accountNumber: 'FR76 1234 5678 9012 3456 789C',
    type: 'investment',
    balance: 8950.75,
    currency: 'EUR',
    isActive: true,
    createdAt: new Date('2024-03-10'),
    interestRate: 4.2
  }
];

// Mock des opérations récentes
export const mockOperations: Operation[] = [
  {
    id: 'op-001',
    accountId: 'acc-001',
    type: 'credit',
    amount: 2500,
    currency: 'EUR',
    description: 'Virement salaire',
    date: new Date('2025-10-28'),
    category: 'Salaire'
  },
  {
    id: 'op-002',
    accountId: 'acc-001',
    type: 'debit',
    amount: -85.2,
    currency: 'EUR',
    description: 'Supermarché Carrefour',
    date: new Date('2025-10-27'),
    category: 'Alimentation'
  },
  {
    id: 'op-003',
    accountId: 'acc-002',
    type: 'credit',
    amount: 500,
    currency: 'EUR',
    description: 'Versement épargne automatique',
    date: new Date('2025-10-26'),
    category: 'Épargne'
  },
  {
    id: 'op-004',
    accountId: 'acc-001',
    type: 'debit',
    amount: -1200,
    currency: 'EUR',
    description: 'Loyer appartement',
    date: new Date('2025-10-25'),
    category: 'Logement'
  },
  {
    id: 'op-005',
    accountId: 'acc-003',
    type: 'credit',
    amount: 150.25,
    currency: 'EUR',
    description: 'Dividendes investissement',
    date: new Date('2025-10-24'),
    category: 'Investissement'
  }
];

// Mock du taux d'épargne global (GetGlobalSavingRateUseCase)
export const mockSavingsRate: SavingsRate = {
  baseRate: 2.5,
  premiumRate: 3.2,
  minimumAmount: 1000,
  lastUpdated: new Date('2025-10-29')
};

// Mock du profil utilisateur
export const mockUserProfile: UserProfile = {
  id: 'user-001',
  firstName: 'Jean',
  lastName: 'Dupont',
  email: 'jean.dupont@email.com',
  role: 'client',
  joinedAt: new Date('2024-01-15')
};

// Utilitaires
export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const formatDate = (date: Date, locale: string = 'fr-FR'): string => {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

export const getTotalBalance = (accounts: DashboardAccount[]): number => {
  return accounts.reduce((total, account) => total + account.balance, 0);
};

export const getSavingsAccounts = (accounts: DashboardAccount[]): DashboardAccount[] => {
  return accounts.filter(account => account.type === 'savings');
};

export const getRecentOperations = (operations: Operation[], limit: number = 5): Operation[] => {
  const sortedOperations = operations.toSorted((a, b) => b.date.getTime() - a.date.getTime());
  return sortedOperations.slice(0, limit);
};
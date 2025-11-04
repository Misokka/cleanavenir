import { UserDTO } from '../../../application/dtos/UserDTO';
import { AccountDTO } from '../../../application/dtos/AccountDTO';
import { OperationDTO } from '../../../application/dtos/OperationDTO';
import { SavingAccountDTO } from '../../../application/dtos/SavingAccountDTO';
import { SavingRateDTO } from '../../../application/dtos/SavingRateDTO';

const toBool = (value: number | null | undefined): boolean => value === 1;

export function toUserDTO(user: {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  isActive: number;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}): UserDTO {
  return {
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    role: user.role as 'CLIENT' | 'DIRECTOR' | 'ADVISOR',
    isActive: toBool(user.isActive),
    emailVerifiedAt: user.emailVerifiedAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function toAccountDTO(account: {
  id: string;
  iban: string;
  name: string;
  balance: number;
}): AccountDTO {
  return {
    id: account.id,
    iban: account.iban,
    label: account.name, 
    balance: account.balance / 100, 
    currency: 'EUR',
  };
}

export function toOperationDTO(operation: {
  id: string;
  fromAccountId: string | null;
  toAccountId: string | null;
  amount: number;
  type: string;
  description: string | null;
  createdAt: string;
}): OperationDTO {
  const kind: 'CREDIT' | 'DEBIT' = 
    operation.type === 'CREDIT' || !operation.fromAccountId ? 'CREDIT' : 'DEBIT';

  const accountId = kind === 'CREDIT' 
    ? (operation.toAccountId || '') 
    : (operation.fromAccountId || '');

  return {
    id: operation.id,
    AccountId: accountId,
    kind,
    amount: Math.abs(operation.amount) / 100, 
    currency: 'EUR',
    label: operation.description || 'Opération',
    createdAt: operation.createdAt,
  };
}

export function toSavingAccountDTO(saving: {
  id: string;
  accountId: string;
  createdAt: string;
  updatedAt: string;
}): SavingAccountDTO {
  return {
    id: saving.id,
    AccountId: saving.accountId,
    isActive: true, 
    openedAt: saving.createdAt,
  };
}

export function toSavingRateDTO(rate: number, updatedAt: string): SavingRateDTO {
  return {
    value: rate / 100,
    updateAt: updatedAt,
  };
}

/**
 * Mock pour le taux d'épargne actuel
 * À remplacer par une vraie query quand la table sera disponible
 */
export function mockCurrentSavingRate(): SavingRateDTO {
  return {
    value: 3, 
    updateAt: new Date().toISOString(),
  };
}

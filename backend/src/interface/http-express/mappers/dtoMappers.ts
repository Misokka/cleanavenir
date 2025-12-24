import { UserDTO } from '../../../application/dtos/UserDTO';
import { AccountDTO } from '../../../application/dtos/AccountDTO';
import { TransactionDTO } from '../../../application/dtos/TransactionDTO';
import { SavingAccountDTO } from '../../../application/dtos/SavingAccountDTO';
import { User, UserRole } from '../../../domain/entities/User';
import { BankAccount } from '../../../domain/entities/BankAccount';
import { Transaction } from '../../../domain/entities/Transaction';
import { SavingAccount } from '../../../domain/entities/SavingAccount';
import { SavingProduct } from '../../../domain/entities/SavingProduct';
import { SavingProductDTO } from '../../../application/dtos/SavingProductDTO';

export function toUserDTO(user: User): UserDTO {
  return {
    id: user.userIdentifier,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    role: user.role as UserRole,
    isActive: user.active,
    emailVerifiedAt: user.emailVerifiedAt as string | null,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt?.toISOString() as string,
  };
}

export function toAccountDTO(account: BankAccount): AccountDTO {
  return {
    id: account.accountIdentifier,
    iban: account.iban.value,
    label: account.label, 
    balance: account.balance / 100, 
    currency: 'EUR',
  };
}

export function toOperationDTO(transaction: Transaction): TransactionDTO {
  const kind: 'CREDIT' | 'DEBIT' = 
    transaction.direction === 'CREDIT' || !transaction.fromAccountIdentifier ? 'CREDIT' : 'DEBIT';

  const accountId = kind === 'CREDIT' 
    ? (transaction.toAccountIdentifier || '') 
    : (transaction.fromAccountIdentifier || '');

  return {
    id: transaction.transactionIdentifier,
    accountId: accountId,
    kind,
    amount: Math.abs(transaction.amount) / 100, 
    currency: 'EUR',
    label: transaction.description || 'Opération',
    createdAt: transaction.createdAt.toISOString(),
  };
}

export function toSavingAccountDTO(saving: SavingAccount): SavingAccountDTO {
  return {
    id: saving.accountIdentifier,
    iban: saving.iban.value,
    ownerId: saving.clientIdentifier,
    label: saving.label,
    balance: saving.balance / 100, // à voir pour convertir en € ou centimes
    savingProductId: saving.productIdentifier,
    createdAt: saving.createdAt.toISOString(),
  };
}

export function toSavingProductDTO(savingProduct: SavingProduct): SavingProductDTO{
  return {
    ...savingProduct,
    id: savingProduct.savingProductIdentifier,
    rate: savingProduct.rate / 1_000_000, // conversion de micro pourcent à pourcent
  }
}

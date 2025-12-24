import { Transaction } from "../../../domain/entities/Transaction";
import { BankAccountNotFoundError } from "../../../domain/errors/BankAccountNotFoundError";
import { TransactionNotFoundError } from "../../../domain/errors/TransactionNotFoundError";
import { Result } from "../../../shared/Result";

export interface OperationFilters {
  type?: string[]; // ['CREDIT', 'DEBIT', 'TRANSFER', 'INTEREST']
  dateFrom?: string; // ISO date
  dateTo?: string; // ISO date
  amountMin?: number; // en centimes
  amountMax?: number; // en centimes
  accountId?: string; // filtrer par compte spécifique
}

export interface TransactionRepository{
  save(transaction: Transaction): Promise<Result<Transaction, Error>>;
  saveAll(transactions: Transaction[]): Promise<Result<boolean, Error>>
  findById(transactionIdentifier: string): Promise<Result<Transaction, TransactionNotFoundError>>;
  all(): Promise<Result<Transaction[], Error>>;

  listByAccountId (params: {
          accountId: string;
          limit?: number;
          offset?: number;
      }): Promise<Result<Transaction[], Error>>;
  
  listWithFilters(accountIds: string[], filters: OperationFilters): Promise<Result<Transaction[], Error>>;
  listRecentForUser(userAccountIds: string[], limit: number): Promise<Result<Transaction[], Error>>;
  listForAccount(accountIdentifier: string): Promise<Result<Transaction[], Error>>;
}
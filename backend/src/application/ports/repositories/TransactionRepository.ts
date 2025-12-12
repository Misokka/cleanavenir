import { Transaction } from "../../../domain/entities/Transaction";
import { TransactionNotFoundError } from "../../../domain/errors/TransactionNotFoundError";
import { Result } from "../../../shared/Result";

export interface TransactionRepository{
  save(transaction: Transaction): Promise<Result<Transaction, Error>>;
  saveAll(transactions: Transaction[]): Promise<Result<boolean, Error>>
  findById(transactionIdentifier: string): Promise<Result<Transaction, TransactionNotFoundError>>;
  all(): Promise<Result<Transaction[], Error>>;
}
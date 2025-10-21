import { Transaction } from "../../../domain/entities/Transaction";
import { Result } from "../../../shared/Result";

export interface TransactionRepository{
  save(transaction: Transaction): Promise<Result<Transaction, Error>>;
  saveAll(transactions: Transaction[]): Promise<Result<boolean, Error>>
  findById(transactionIdentifier: string): Promise<Result<Transaction, Error>>;
  all(): Promise<Result<Transaction[], Error>>;
}
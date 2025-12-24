import { Loan } from "../../../domain/entities/Loan";
import { BankAccountNotFoundError } from "../../../domain/errors/BankAccountNotFoundError";
import { InsufficientFundsError } from "../../../domain/errors/InsufficientFundsError";
import { LoanNotFoundError } from "../../../domain/errors/LoanNotFoundError";
import { UnexpectedBankAccountError } from "../../../domain/errors/UnexpectedBankAccountError";
import { Result } from "../../../shared/Result";

export interface LoanRepository{
  save(loan: Loan): Promise<Result<Loan, InsufficientFundsError | BankAccountNotFoundError | UnexpectedBankAccountError>>;
  findById(loanIdentifier: string): Promise<Result<Loan, LoanNotFoundError>>;
  findActiveLoansDueOn(date: Date): Promise<Result<Loan[], Error>>;
  findAllByUserId(userId: string): Promise<Result<Loan[], Error>>;
  all(): Promise<Result<Loan[], Error>>;
  delete(loanIdentifier: string): Promise<Result<string, LoanNotFoundError>>;
}
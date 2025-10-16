import { Loan } from "../../../domain/entities/Loan";
import { InsufficientFundsError } from "../../../domain/errors/InsufficientFundsError";
import { LoanNotFoundError } from "../../../domain/errors/LoanNotFoundError";
import { Result } from "../../../shared/Result";

export interface LoanRepository{
  save(loan: Loan): Promise<Result<Loan, InsufficientFundsError>>;
  findById(loanIdentifier: string): Promise<Result<Loan, LoanNotFoundError>>
  all(): Promise<Loan[]>
  delete(loanIdentifier: string): Promise<Result<string, LoanNotFoundError>>
}
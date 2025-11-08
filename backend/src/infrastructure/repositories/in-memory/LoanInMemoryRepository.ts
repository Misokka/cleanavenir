import { LoanRepository } from '../../../application/ports/repositories/LoanRepository';
import { Loan } from '../../../domain/entities/Loan';
import { LoanNotFoundError } from '../../../domain/errors/LoanNotFoundError';
import { InsufficientFundsError } from '../../../domain/errors/InsufficientFundsError';
import { Result, ok, err } from '../../../shared/Result';

// Map-backed implementation so signatures can return Result<> as required by the interface
export class LoanInMemoryRepository implements LoanRepository {
  private items = new Map<string, Loan>();

  private clone<T>(v: T): T {
    try {
      // Node 17+ / modern runtimes provide structuredClone
      // keep a fallback for older environments used in tests
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // en gros sa veut dire que si structuredClone n'est pas disponible, on utilise une méthode de secours
      return (structuredClone as any)(v);
    } catch {
      return JSON.parse(JSON.stringify(v));
    }
  }

  async save(loan: Loan): Promise<Result<Loan, InsufficientFundsError>> {
    // In-memory save never triggers InsufficientFundsError, but the interface requires the Result wrapper
    // si <loan.amount> est supérieur à <loan.client.balance>, on retourne une erreur
    this.items.set(loan.loanIdentifier, this.clone(loan));
    return ok(this.clone(loan));
  }

  async findById(loanIdentifier: string): Promise<Result<Loan, LoanNotFoundError>> {
    const l = this.items.get(loanIdentifier);
    if (!l) return err(new LoanNotFoundError(loanIdentifier));
    return ok(this.clone(l));
  }

  // Helper - not part of interface but used by some tests / code paths
  async findAllByUserId(userId: string): Promise<Loan[]> {
    return Array.from(this.items.values()).filter(l => l.clientIdentifier === userId).map(l => this.clone(l));
  }

  // Helper - return loans due on or before provided date
  async findDueLoans(date: Date): Promise<Loan[]> {
    return Array.from(this.items.values()).filter(
      (loan) => loan.status === 'ACTIVE' && loan.nextToPayAt && new Date(loan.nextToPayAt) <= date,
    ).map(l => this.clone(l));
  }

  async findActiveLoansDueOn(date: Date): Promise<Result<Loan[], Error>> {
    const loans = Array.from(this.items.values()).filter(
      (loan) =>
        loan.status === 'ACTIVE' &&
        loan.nextToPayAt &&
        new Date(loan.nextToPayAt).toDateString() === date.toDateString(),
    ).map(l => this.clone(l));
    return ok(loans);
  }

  async all(): Promise<Loan[]> {
    return Array.from(this.items.values()).map(l => this.clone(l));
  }

  async delete(loanIdentifier: string): Promise<Result<string, LoanNotFoundError>> {
    if (!this.items.has(loanIdentifier)) {
      return err(new LoanNotFoundError(loanIdentifier));
    }
    this.items.delete(loanIdentifier);
    return ok(loanIdentifier);
  }
}
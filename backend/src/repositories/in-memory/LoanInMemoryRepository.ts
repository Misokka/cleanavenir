import { LoanRepository } from '../../application/ports/repositories/LoanRepository';
import { Loan } from '../../domain/entities/Loan';
import { BaseInMemoryRepository } from './BaseInMemoryRepository';

export class LoanInMemoryRepository
  extends BaseInMemoryRepository<Loan>
  implements LoanRepository
{
  constructor() {
    super((loan) => loan.id);
  }

  async findAllByUserId(userId: string): Promise<Loan[]> {
    return this.where((loan) => loan.userId === userId);
  }

  async findDueLoans(date: Date): Promise<Loan[]> {
    return this.where(
      (loan) =>
        loan.status === 'ACTIVE' && new Date(loan.nextDueDate) <= date,
    );
  }
}
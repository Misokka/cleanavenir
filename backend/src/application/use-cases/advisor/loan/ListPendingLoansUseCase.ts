import { Result } from '../../../../shared/Result';
import { Loan } from '../../../../domain/entities/Loan';
import { LoanRepository } from '../../../ports/repositories/LoanRepository';

export class ListPendingLoansUseCase {
  constructor(private readonly loanRepository: LoanRepository) {}

  async execute(): Promise<Result<Loan[], Error>> {
    return await this.loanRepository.findByStatus('PENDING');
  }
}

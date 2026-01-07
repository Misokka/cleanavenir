import { Result, ok, err } from '../../../../shared/Result';
import { Loan } from '../../../../domain/entities/Loan';
import { LoanRepository } from '../../../ports/repositories/LoanRepository';
import { AdvisorRepository } from '../../../ports/repositories/AdvisorRepository';
import { ClientRepository } from '../../../ports/repositories/ClientRepository';
import { AdvisorNotFoundError } from '../../../../domain/errors/AdvisorNotFoundError';

export interface ListPendingLoansInput {
  userId: string;
}

export class ListPendingLoansUseCase {
  constructor(
    private readonly loanRepository: LoanRepository,
    private readonly advisorRepository: AdvisorRepository,
    private readonly clientRepository: ClientRepository
  ) {}

  async execute(input?: ListPendingLoansInput): Promise<Result<Loan[], Error>> {
    const loansResult = await this.loanRepository.findByStatus('PENDING');
    if (!loansResult.ok) {
      return err(loansResult.error);
    }

    if (!input?.userId) {
      return loansResult;
    }

    const advisorResult = await this.advisorRepository.findByUserId(input.userId);
    if (!advisorResult.ok) {
      return err(new AdvisorNotFoundError(input.userId));
    }
    const advisorId = advisorResult.value.advisorIdentifier;

    const filteredLoans: Loan[] = [];
    for (const loan of loansResult.value) {
      const clientResult = await this.clientRepository.findById(loan.clientIdentifier);
      if (clientResult.ok && clientResult.value.advisorIdentifier === advisorId) {
        filteredLoans.push(loan);
      }
    }

    return ok(filteredLoans);
  }
}

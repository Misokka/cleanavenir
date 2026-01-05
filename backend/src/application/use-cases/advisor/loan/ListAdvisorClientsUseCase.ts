import { Result } from '../../../../shared/Result';
import { Loan } from '../../../../domain/entities/Loan';
import { LoanRepository } from '../../../ports/repositories/LoanRepository';

export interface ListAdvisorClientsInput {
  advisorIdentifier: string;
}

export class ListAdvisorClientsUseCase {
  constructor(private readonly loanRepository: LoanRepository) {}

  async execute(input: ListAdvisorClientsInput): Promise<Result<Loan[], Error>> {
    return await this.loanRepository.findByAdvisorId(input.advisorIdentifier);
  }
}

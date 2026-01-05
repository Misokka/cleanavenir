import { Result, ok, err } from '../../../../shared/Result';
import { Loan } from '../../../../domain/entities/Loan';
import { LoanRepository } from '../../../ports/repositories/LoanRepository';
import { LoanNotFoundError } from '../../../../domain/errors/LoanNotFoundError';

export interface RejectLoanInput {
  loanIdentifier: string;
  advisorIdentifier: string; 
}

export class RejectLoanUseCase {
  constructor(private readonly loanRepository: LoanRepository) {}

  async execute(input: RejectLoanInput): Promise<Result<Loan, Error>> {
    const loanResult = await this.loanRepository.findById(input.loanIdentifier);
    if (!loanResult.ok) {
      return err(new LoanNotFoundError(input.loanIdentifier));
    }

    const loan = loanResult.value;

    if (loan.status !== 'PENDING') {
      return err(new Error('Ce prêt n\'est plus en attente'));
    }

    if (loan.advisorIdentifier && loan.advisorIdentifier !== input.advisorIdentifier) {
      return err(new Error('Vous n\'êtes pas autorisé à rejeter ce prêt'));
    }
    const rejectedLoan = Loan.create({
      loanIdentifier: loan.loanIdentifier,
      clientIdentifier: loan.clientIdentifier,
      advisorIdentifier: loan.advisorIdentifier,
      loanAmount: loan.loanAmount,
      durationInMonth: loan.durationInMonth,
      mensualities: loan.mensualities,
      insuranceMensualities: loan.insuranceMensualities,
      remainingAmountToPay: loan.loanAmount,
      annualInterestRate: loan.annualInterestRate,
      annualInsuranceRate: loan.annualInsuranceRate,
      status: 'REJECTED',
      createdAt: loan.createdAt,
      lastPaidAt: undefined,
      nextToPayAt: undefined,
    });

    return await this.loanRepository.update(rejectedLoan);
  }
}

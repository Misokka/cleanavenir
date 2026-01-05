import { Result, ok, err } from '../../../../shared/Result';
import { Loan } from '../../../../domain/entities/Loan';
import { LoanRepository } from '../../../ports/repositories/LoanRepository';
import { BankAccountRepository } from '../../../ports/repositories/BankAccountRepository';
import { TransactionRepository } from '../../../ports/repositories/TransactionRepository';
import { ClientRepository } from '../../../ports/repositories/ClientRepository';
import { Transaction } from '../../../../domain/entities/Transaction';
import { LoanNotFoundError } from '../../../../domain/errors/LoanNotFoundError';
import { randomUUID } from 'crypto';

export interface ApproveLoanInput {
  loanIdentifier: string;
  advisorIdentifier: string;
}

export class ApproveLoanUseCase {
  constructor(
    private readonly loanRepository: LoanRepository,
    private readonly bankAccountRepository: BankAccountRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly clientRepository: ClientRepository
  ) {}

  async execute(input: ApproveLoanInput): Promise<Result<Loan, Error>> {
    const loanResult = await this.loanRepository.findById(input.loanIdentifier);
    if (!loanResult.ok) {
      return err(new LoanNotFoundError(input.loanIdentifier));
    }

    const loan = loanResult.value;

    if (loan.status !== 'PENDING') {
      return err(new Error('Ce prêt n\'est plus en attente'));
    }

    if (loan.advisorIdentifier && loan.advisorIdentifier !== input.advisorIdentifier) {
      return err(new Error('Vous n\'êtes pas autorisé à approuver ce prêt'));
    }

    const nextPaymentDate = new Date();
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

    const bankAccountResult = await this.bankAccountRepository.findDefaultAccountByClientId(loan.clientIdentifier);
    if (!bankAccountResult.ok) {
      return err(new Error('Compte bancaire du client introuvable'));
    }

    const bankAccount = bankAccountResult.value;

    bankAccount.deposit(loan.loanAmount);

    const transactionIdentifier = randomUUID();
    const creditTransaction = Transaction.create({
      transactionIdentifier,
      bankAccountIdentifier: bankAccount.accountIdentifier,
      amount: loan.loanAmount,
      currency: 'EUR',
      direction: 'CREDIT',
      type: 'LOAN_DISBURSEMENT',
      description: `Déblocage du prêt ${loan.loanIdentifier.slice(0, 8)}`,
    });

    const assignedAdvisorId = loan.advisorIdentifier || input.advisorIdentifier;

    const updatedLoan = Loan.create({
      loanIdentifier: loan.loanIdentifier,
      clientIdentifier: loan.clientIdentifier,
      advisorIdentifier: assignedAdvisorId, 
      loanAmount: loan.loanAmount,
      durationInMonth: loan.durationInMonth,
      mensualities: loan.mensualities,
      insuranceMensualities: loan.insuranceMensualities,
      remainingAmountToPay: loan.loanAmount,
      annualInterestRate: loan.annualInterestRate,
      annualInsuranceRate: loan.annualInsuranceRate,
      status: 'ACTIVE',
      createdAt: loan.createdAt,
      lastPaidAt: undefined,
      nextToPayAt: nextPaymentDate,
    });

    const updateResult = await this.loanRepository.update(updatedLoan);
    if (!updateResult.ok) {
      return updateResult;
    }

    await this.bankAccountRepository.updateBalance(bankAccount.accountIdentifier, bankAccount.balance);
    await this.transactionRepository.save(creditTransaction);

    const clientResult = await this.clientRepository.findById(loan.clientIdentifier);
    if (clientResult.ok && !clientResult.value.advisorIdentifier) {
      await this.clientRepository.updateAdvisor(loan.clientIdentifier, assignedAdvisorId);
    }

    return updateResult;
  }
}

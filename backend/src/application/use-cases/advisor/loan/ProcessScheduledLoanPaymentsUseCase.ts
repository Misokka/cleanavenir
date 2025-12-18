import { LoanRepository } from "../../../ports/repositories/LoanRepository";
import { BankAccountRepository } from "../../../ports/repositories/BankAccountRepository";
import { TransactionRepository } from "../../../ports/repositories/TransactionRepository";
import { Transaction } from "../../../../domain/entities/Transaction";
import Result, { err, ok } from "../../../../shared/Result";
import { randomUUID } from "crypto";

export class ProcessScheduledLoanPaymentsUseCase {
  constructor(
    private readonly loanRepository: LoanRepository,
    private readonly bankAccountRepository: BankAccountRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(): Promise<Result<boolean, Error>> {
    const today = new Date();
    
    const loansToProcess = await this.loanRepository.findActiveLoansDueOn(today);

    if(!loansToProcess.ok){
      return err(new Error())
    }
    
    for (const loan of loansToProcess.value) {
      try {
        
        const bankAccount = await this.bankAccountRepository.findDefaultAccountByClientId(loan.clientIdentifier);

        if(!bankAccount.ok){
          return err(bankAccount.error);
        }

        bankAccount.value.withdraw(loan.mensualities);
        loan.processMonthlyPayment();
        
        const transactionIdentifier = randomUUID()
        const paymentTransaction = Transaction.create({
          transactionIdentifier,
          bankAccountIdentifier: bankAccount.value.accountIdentifier,
          amount: loan.mensualities,
          currency: "EUR",
          direction: "DEBIT",
          type: "LOAN_PAYMENT",
          description: `Payment for loan: ${loan.loanIdentifier}`
        });

        // 5. Sauvegarder toutes les entités modifiées (idéalement dans une transaction BDD)
        await this.bankAccountRepository.save(bankAccount.value);
        await this.loanRepository.save(loan);
        await this.transactionRepository.save(paymentTransaction);
        
        console.log(`Payment for loan ${loan.loanIdentifier} processed successfully.`);

      } catch (error) {
        return err(new Error(`Failed to process payment for loan ${loan.loanIdentifier}: ${error}`));
      }
    }

    return ok(true);
  }
}
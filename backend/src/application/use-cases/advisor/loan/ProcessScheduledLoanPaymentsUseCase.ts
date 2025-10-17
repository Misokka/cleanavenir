import { LoanRepository } from "../../../ports/repositories/LoanRepository";
import { BankAccountRepository } from "../../../ports/repositories/BankAccountRepository";
import { TransactionRepository } from "../../../ports/repositories/TransatcionRepository";
import { Transaction } from "../../../../domain/entities/Transaction";
import { err } from "../../../../shared/Result";
import { randomUUID } from "crypto";

export class ProcessScheduledLoanPaymentsUseCase {
  constructor(
    private readonly loanRepository: LoanRepository,
    private readonly bankAccountRepository: BankAccountRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute() {
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
        const paymentTransaction = new Transaction(
          transactionIdentifier,
          bankAccount.value.accountIdentifier,
          loan.mensualities,
          "DEBIT",
          "LOAN_PAYMENT",
          `Payment for loan: ${loan.loanIdentifier}`
        );

        // 5. Sauvegarder toutes les entités modifiées (idéalement dans une transaction BDD)
        await this.bankAccountRepository.save(bankAccount.value);
        await this.loanRepository.save(loan);
        await this.transactionRepository.save(paymentTransaction);
        
        console.log(`Payment for loan ${loan.loanIdentifier} processed successfully.`);

      } catch (error) {
        // Gérer les erreurs (ex: fonds insuffisants)
        // Envoyer une notification au client, au conseiller, etc.
        console.error(`Failed to process payment for loan ${loan.loanIdentifier}:`, error);
      }
    }
  }
}
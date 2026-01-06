import { randomUUID } from "node:crypto";
import { err, ok, Result } from "../../../../shared/Result";
import { BankAccountRepository } from "../../../ports/repositories/BankAccountRepository";
import { SavingAccountRepository } from "../../../ports/repositories/SavingAccountRepository";
import { TransactionRepository } from "../../../ports/repositories/TransactionRepository";
import { Transaction } from "../../../../domain/entities/Transaction";
import { ClientRepository } from "../../../ports/repositories/ClientRepository";

export interface DepositToSavingInput {
  userId: string;
  savingAccountId: string;
  sourceBankAccountId: string;
  amount: number; 
}

export class DepositToSavingUseCase {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly savingAccountRepository: SavingAccountRepository,
    private readonly bankAccountRepository: BankAccountRepository,
    private readonly transactionRepository: TransactionRepository
  ) {}

  public async execute(input: DepositToSavingInput): Promise<Result<true, Error>> {
    if (input.amount <= 0) {
      return err(new Error('Le montant doit être supérieur à 0'));
    }

    const amountInCents = Math.round(input.amount * 100);
    const clientResult = await this.clientRepository.findByUserId(input.userId);
    if (!clientResult.ok) {
      return err(clientResult.error);
    }
    const client = clientResult.value;
    const sourceAccountResult = await this.bankAccountRepository.findById(input.sourceBankAccountId);
    if (!sourceAccountResult.ok) {
      return err(new Error('Compte bancaire source introuvable'));
    }
    const sourceAccount = sourceAccountResult.value;

    if (sourceAccount.clientIdentifier !== client.clientIdentifier) {
      return err(new Error('Accès non autorisé au compte bancaire source'));
    }

    if (sourceAccount.balance < amountInCents) {
      return err(new Error('Solde insuffisant sur le compte bancaire'));
    }

    const savingResult = await this.savingAccountRepository.findById(input.savingAccountId);
    if (!savingResult.ok) {
      return err(new Error('Compte épargne introuvable'));
    }
    const savingAccount = savingResult.value;

    if (savingAccount.clientIdentifier !== client.clientIdentifier) {
      return err(new Error('Accès non autorisé au compte épargne'));
    }

    const newBankBalance = sourceAccount.balance - amountInCents;
    const updateBankResult = await this.bankAccountRepository.updateBalance(
      input.sourceBankAccountId,
      newBankBalance
    );

    if (!updateBankResult.ok) {
      return err(new Error('Erreur lors du débit du compte bancaire'));
    }

    const newSavingBalance = savingAccount.balance + amountInCents;
    const updateSavingResult = await this.savingAccountRepository.updateBalance(
      input.savingAccountId,
      newSavingBalance
    );

    if (!updateSavingResult.ok) {
      await this.bankAccountRepository.updateBalance(
        input.sourceBankAccountId,
        sourceAccount.balance
      );
      return err(new Error('Erreur lors du crédit du compte épargne'));
    }

    const debitTransactionId = randomUUID();
    const debitTransaction = Transaction.create({
      transactionIdentifier: debitTransactionId,
      bankAccountIdentifier: input.sourceBankAccountId,
      fromAccountIdentifier: input.sourceBankAccountId,
      toAccountIdentifier: undefined,
      toSavingAccountIdentifier: input.savingAccountId,
      amount: amountInCents,
      direction: 'DEBIT',
      currency: 'EUR',
      type: 'TRANSFER',
      description: `Dépôt vers compte épargne`,
    });

    const saveDebitResult = await this.transactionRepository.save(debitTransaction);
    if (!saveDebitResult.ok) {
      await this.savingAccountRepository.updateBalance(input.savingAccountId, savingAccount.balance);
      await this.bankAccountRepository.updateBalance(input.sourceBankAccountId, sourceAccount.balance);
      return err(new Error("Erreur lors de l'enregistrement de la transaction"));
    }

    return ok(true);
  }
}

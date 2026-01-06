import { randomUUID } from "node:crypto";
import { err, ok, Result } from "../../../../shared/Result";
import { BankAccountRepository } from "../../../ports/repositories/BankAccountRepository";
import { SavingAccountRepository } from "../../../ports/repositories/SavingAccountRepository";
import { TransactionRepository } from "../../../ports/repositories/TransactionRepository";
import { Transaction } from "../../../../domain/entities/Transaction";
import { ClientRepository } from "../../../ports/repositories/ClientRepository";

export interface TransferFromSavingInput {
  userId: string;
  savingAccountId: string;
  targetBankAccountId: string;
  amount: number; // en euros
}

export class TransferFromSavingUseCase {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly savingAccountRepository: SavingAccountRepository,
    private readonly bankAccountRepository: BankAccountRepository,
    private readonly transactionRepository: TransactionRepository
  ) {}

  public async execute(input: TransferFromSavingInput): Promise<Result<true, Error>> {
    if (input.amount <= 0) {
      return err(new Error('Le montant doit être supérieur à 0'));
    }

    const amountInCents = Math.round(input.amount * 100);

    const clientResult = await this.clientRepository.findByUserId(input.userId);
    if (!clientResult.ok) {
      return err(clientResult.error);
    }
    const client = clientResult.value;

    const savingResult = await this.savingAccountRepository.findById(input.savingAccountId);
    if (!savingResult.ok) {
      return err(new Error('Compte épargne introuvable'));
    }
    const savingAccount = savingResult.value;

    if (savingAccount.clientIdentifier !== client.clientIdentifier) {
      return err(new Error('Accès non autorisé au compte épargne'));
    }

    if (savingAccount.balance < amountInCents) {
      return err(new Error('Solde insuffisant sur le compte épargne'));
    }

    const targetAccountResult = await this.bankAccountRepository.findById(input.targetBankAccountId);
    if (!targetAccountResult.ok) {
      return err(new Error('Compte bancaire cible introuvable'));
    }
    const targetAccount = targetAccountResult.value;

    if (targetAccount.clientIdentifier !== client.clientIdentifier) {
      return err(new Error('Accès non autorisé au compte bancaire cible'));
    }

    const newSavingBalance = savingAccount.balance - amountInCents;
    const updateSavingResult = await this.savingAccountRepository.updateBalance(
      input.savingAccountId,
      newSavingBalance
    );

    if (!updateSavingResult.ok) {
      return err(new Error('Erreur lors du débit du compte épargne'));
    }

    const newBankBalance = targetAccount.balance + amountInCents;
    const updateBankResult = await this.bankAccountRepository.updateBalance(
      input.targetBankAccountId,
      newBankBalance
    );

    if (!updateBankResult.ok) {
      await this.savingAccountRepository.updateBalance(
        input.savingAccountId,
        savingAccount.balance
      );
      return err(new Error('Erreur lors du crédit du compte bancaire'));
    }

    const creditTransactionId = randomUUID();
    const creditTransaction = Transaction.create({
      transactionIdentifier: creditTransactionId,
      bankAccountIdentifier: input.targetBankAccountId,
      fromAccountIdentifier: undefined,
      toAccountIdentifier: input.targetBankAccountId,
      toSavingAccountIdentifier: input.savingAccountId,
      amount: amountInCents,
      direction: 'CREDIT',
      currency: 'EUR',
      type: 'TRANSFER',
      description: `Transfert depuis compte épargne`,
    });

    const saveCreditResult = await this.transactionRepository.save(creditTransaction);
    if (!saveCreditResult.ok) {
      await this.savingAccountRepository.updateBalance(input.savingAccountId, savingAccount.balance);
      await this.bankAccountRepository.updateBalance(input.targetBankAccountId, targetAccount.balance);
      return err(new Error("Erreur lors de l'enregistrement de la transaction"));
    }

    return ok(true);
  }
}

import { randomUUID } from "node:crypto";
import { err, ok, Result } from "../../../../shared/Result";
import { BankAccountRepository } from "../../../ports/repositories/BankAccountRepository";
import { SavingAccountRepository } from "../../../ports/repositories/SavingAccountRepository";
import { TransactionRepository } from "../../../ports/repositories/TransactionRepository";
import { Transaction } from "../../../../domain/entities/Transaction";
import { ClientRepository } from "../../../ports/repositories/ClientRepository";
import { AppError, appError, SavingErrorCodes } from "../../../../shared/errors";

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

  public async execute(input: DepositToSavingInput): Promise<Result<true, AppError>> {
    if (input.amount <= 0) {
      return err(appError(SavingErrorCodes.VALIDATION_ERROR));
    }

    const amountInCents = Math.round(input.amount * 100);
    const clientResult = await this.clientRepository.findByUserId(input.userId);
    if (!clientResult.ok) {
      return err(appError(SavingErrorCodes.UNAUTHORIZED));
    }
    const client = clientResult.value;
    const sourceAccountResult = await this.bankAccountRepository.findById(input.sourceBankAccountId);
    if (!sourceAccountResult.ok) {
      return err(appError(SavingErrorCodes.SOURCE_ACCOUNT_NOT_FOUND));
    }
    const sourceAccount = sourceAccountResult.value;

    if (sourceAccount.clientIdentifier !== client.clientIdentifier) {
      return err(appError(SavingErrorCodes.UNAUTHORIZED_SOURCE_ACCOUNT));
    }

    if (sourceAccount.balance < amountInCents) {
      return err(appError(SavingErrorCodes.INSUFFICIENT_SOURCE_BALANCE));
    }

    const savingResult = await this.savingAccountRepository.findById(input.savingAccountId);
    if (!savingResult.ok) {
      return err(appError(SavingErrorCodes.SAVING_NOT_FOUND));
    }
    const savingAccount = savingResult.value;

    if (savingAccount.clientIdentifier !== client.clientIdentifier) {
      return err(appError(SavingErrorCodes.UNAUTHORIZED_SAVING_ACCOUNT));
    }

    const newBankBalance = sourceAccount.balance - amountInCents;
    const updateBankResult = await this.bankAccountRepository.updateBalance(
      input.sourceBankAccountId,
      newBankBalance
    );

    if (!updateBankResult.ok) {
      return err(appError(SavingErrorCodes.DEBIT_BANK_FAILED));
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
      return err(appError(SavingErrorCodes.CREDIT_SAVING_FAILED));
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
      return err(appError(SavingErrorCodes.TRANSACTION_SAVE_FAILED));
    }

    return ok(true);
  }
}

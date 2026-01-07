import { randomUUID } from "node:crypto";
import { err, ok, Result } from "../../../../shared/Result";
import { BankAccountRepository } from "../../../ports/repositories/BankAccountRepository";
import { SavingAccountRepository } from "../../../ports/repositories/SavingAccountRepository";
import { TransactionRepository } from "../../../ports/repositories/TransactionRepository";
import { Transaction } from "../../../../domain/entities/Transaction";
import { ClientRepository } from "../../../ports/repositories/ClientRepository";
import { AppError, appError, SavingErrorCodes } from "../../../../shared/errors";

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

  public async execute(input: TransferFromSavingInput): Promise<Result<true, AppError>> {
    if (input.amount <= 0) {
      return err(appError(SavingErrorCodes.VALIDATION_ERROR));
    }

    const amountInCents = Math.round(input.amount * 100);

    const clientResult = await this.clientRepository.findByUserId(input.userId);
    if (!clientResult.ok) {
      return err(appError(SavingErrorCodes.UNAUTHORIZED));
    }
    const client = clientResult.value;

    const savingResult = await this.savingAccountRepository.findById(input.savingAccountId);
    if (!savingResult.ok) {
      return err(appError(SavingErrorCodes.SAVING_NOT_FOUND));
    }
    const savingAccount = savingResult.value;

    if (savingAccount.clientIdentifier !== client.clientIdentifier) {
      return err(appError(SavingErrorCodes.UNAUTHORIZED_SAVING_ACCOUNT));
    }

    if (savingAccount.balance < amountInCents) {
      return err(appError(SavingErrorCodes.INSUFFICIENT_SOURCE_BALANCE));
    }

    const targetAccountResult = await this.bankAccountRepository.findById(input.targetBankAccountId);
    if (!targetAccountResult.ok) {
      return err(appError(SavingErrorCodes.TARGET_ACCOUNT_NOT_FOUND));
    }
    const targetAccount = targetAccountResult.value;

    if (targetAccount.clientIdentifier !== client.clientIdentifier) {
      return err(appError(SavingErrorCodes.UNAUTHORIZED_TARGET_ACCOUNT));
    }

    const newSavingBalance = savingAccount.balance - amountInCents;
    const updateSavingResult = await this.savingAccountRepository.updateBalance(
      input.savingAccountId,
      newSavingBalance
    );

    if (!updateSavingResult.ok) {
      return err(appError(SavingErrorCodes.DEBIT_SAVING_FAILED));
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
      return err(appError(SavingErrorCodes.CREDIT_BANK_FAILED));
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
      return err(appError(SavingErrorCodes.TRANSACTION_SAVE_FAILED));
    }

    return ok(true);
  }
}

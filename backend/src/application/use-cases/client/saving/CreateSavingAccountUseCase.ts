import { randomUUID } from "node:crypto";
import { err, ok, Result } from "../../../../shared/Result";
import { BankAccountRepository } from "../../../ports/repositories/BankAccountRepository";
import { SavingAccountRepository } from "../../../ports/repositories/SavingAccountRepository";
import { TransactionRepository } from "../../../ports/repositories/TransactionRepository";
import { Transaction } from "../../../../domain/entities/Transaction";
import { SavingAccount } from "../../../../domain/entities/SavingAccount";
import { SavingProductRepository } from "../../../ports/repositories/SavingProductRepository";
import { IbanGenerator } from "../../../../infrastructure/adapters/IbanGenerator";
import { Iban } from "../../../../domain/value-objects/Iban";
import { ClientRepository } from "../../../ports/repositories/ClientRepository";
import { AppError, appError, SavingErrorCodes } from "../../../../shared/errors";

export interface CreateSavingAccountInput {
  userId: string;
  sourceAccountId: string; 
  initialAmount: number;
  savingProductIdentifier: string;

}

export class CreateSavingAccountUseCase {
  private readonly ibanGenerator: IbanGenerator;
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly savingAccountRepository: SavingAccountRepository,
    private readonly savingProductRepository: SavingProductRepository,
    private readonly bankAccountRepository: BankAccountRepository,
    private readonly transactionRepository: TransactionRepository
  ) {
    this.ibanGenerator = new IbanGenerator();
  }

  public async execute(input: CreateSavingAccountInput): Promise<Result<SavingAccount, AppError>> {
    const clientResult = await this.clientRepository.findByUserId(input.userId);
    if (!clientResult.ok) {
      return err(appError(SavingErrorCodes.UNAUTHORIZED));
    }

    const client = clientResult.value;
    const savingProductResult = await this.savingProductRepository.findById(input.savingProductIdentifier);
    if (!savingProductResult.ok) {
      return err(appError(SavingErrorCodes.SAVING_PRODUCT_NOT_FOUND));
    }

    const savingProduct = savingProductResult.value;
   
    if (input.initialAmount < 10) {
      return err(appError(SavingErrorCodes.INITIAL_AMOUNT_BELOW_MIN));
    }

    const amountInCents = Math.round(input.initialAmount * 100);

    const sourceAccount = await this.bankAccountRepository.findById(input.sourceAccountId);
    
    if (!sourceAccount.ok) {
      return err(appError(SavingErrorCodes.SOURCE_ACCOUNT_NOT_FOUND));
    }

    if (sourceAccount.value.clientIdentifier !== client.clientIdentifier) {
      return err(appError(SavingErrorCodes.UNAUTHORIZED_SOURCE_ACCOUNT));
    }

    if (sourceAccount.value.balance < amountInCents) {
      return err(appError(SavingErrorCodes.INSUFFICIENT_SOURCE_BALANCE));
    }

    const existingSaving = await this.savingAccountRepository.findByOwnerAndProductId(client.clientIdentifier, input.savingProductIdentifier);
    if (existingSaving.ok && existingSaving.value !== null) {
      return err(appError(SavingErrorCodes.SAVING_ALREADY_EXISTS));
    }

    

    // const rateInBasisPoints = Math.round(input.rate * 100);
    const savingId = randomUUID();

    const generatedIban = this.ibanGenerator.generate();

    let finalIban = generatedIban;
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const ibanCheck = await this.bankAccountRepository.findByIban(finalIban);
      if (!ibanCheck.ok) {
        break;
      }
      finalIban = this.ibanGenerator.generate();
      attempts++;
    }

    if (attempts >= maxAttempts) {
      return err(appError(SavingErrorCodes.IBAN_GENERATION_FAILED));
    }

    const finalIbanResult = Iban.from(finalIban);
    if (!finalIbanResult.ok) {
      return err(appError(SavingErrorCodes.IBAN_INVALID));
    }
    const finalIbanObject = finalIbanResult.value;

    const newSavingAccount = SavingAccount.create({
      accountIdentifier: savingId,
      clientIdentifier: client.clientIdentifier,
      productIdentifier: savingProduct.savingProductIdentifier,
      iban: finalIbanObject,
      label: "Compte d'Épargne",
      balance: amountInCents,
      createdAt: new Date()
    });

    const createSavingResult = await this.savingAccountRepository.save(newSavingAccount);

    // const createSavingResult = await this.savingAccountRepository.create({
    //   id: savingId,
    //   accountId: input.sourceAccountId,
    //   rate: rateInBasisPoints,
    //   balance: amountInCents,
    // });

    if (!createSavingResult.ok) {
      await this.bankAccountRepository.updateBalance(
        input.sourceAccountId,
        sourceAccount.value.balance
      );
      return err(appError(SavingErrorCodes.INTERNAL_ERROR, createSavingResult.error.message));
    }

    const newSourceBalance = sourceAccount.value.balance - amountInCents;
    const updateSourceResult = await this.bankAccountRepository.updateBalance(
      input.sourceAccountId,
      newSourceBalance
    );

    if (!updateSourceResult.ok) {
      return err(appError(SavingErrorCodes.DEBIT_SOURCE_FAILED));
    }

    const debitTransactionId = randomUUID();
    const debitTransaction = Transaction.create({
      transactionIdentifier: debitTransactionId,
      bankAccountIdentifier: input.sourceAccountId,
      fromAccountIdentifier: input.sourceAccountId,
      toAccountIdentifier: undefined,
      toSavingAccountIdentifier: newSavingAccount.accountIdentifier,
      amount: amountInCents,
      direction: 'DEBIT',
      currency: 'EUR',
      type: 'TRANSFER',
      description: `Ouverture compte épargne de type ${savingProduct.label}`,
    })
    // const debitTransaction = {
    //   id: debitTransactionId,
    //   fromAccountId: input.sourceAccountId,
    //   toAccountId: null,
    //   amount: amountInCents,
    //   type: 'DEBIT',
    //   description: `Ouverture compte épargne (${input.rate}% par an)`,
    // };

    const createDebitResult = await this.transactionRepository.save(debitTransaction);
    if (!createDebitResult.ok) {
      await this.bankAccountRepository.updateBalance(
        input.sourceAccountId,
        sourceAccount.value.balance
      );
      return err(appError(SavingErrorCodes.TRANSACTION_SAVE_FAILED));
    }

    return ok(newSavingAccount);
  }
}

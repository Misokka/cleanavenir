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

export interface CreateSavingAccountInput {
  userId: string;
  sourceAccountId: string; 
  initialAmount: number;
  savingProductIdentifier: string;

}

export class CreateSavingAccountUseCase {
  private readonly ibanGenerator: IbanGenerator;
  constructor(
    private readonly savingAccountRepository: SavingAccountRepository,
    private readonly savingProductRepository: SavingProductRepository,
    private readonly bankAccountRepository: BankAccountRepository,
    private readonly transactionRepository: TransactionRepository
  ) {
    this.ibanGenerator = new IbanGenerator();
  }

  public async execute(input: CreateSavingAccountInput): Promise<Result<SavingAccount, Error>> {
    const savingProductResult = await this.savingProductRepository.findById(input.savingProductIdentifier);
    if (!savingProductResult.ok) {
      return err(new Error('Produit d\'épargne introuvable'));
    }

    const savingProduct = savingProductResult.value;
   
    if (input.initialAmount < 10) {
      return err(new Error('Le montant initial doit être d\'au moins 10€'));
    }

    const amountInCents = Math.round(input.initialAmount * 100);

    const sourceAccount = await this.bankAccountRepository.findById(input.sourceAccountId);
    
    if (!sourceAccount.ok) {
      return err(new Error('Compte source introuvable'));
    }

    if (sourceAccount.value.clientIdentifier !== input.userId) {
      return err(new Error('Accès non autorisé au compte source'));
    }

    if (sourceAccount.value.balance < amountInCents) {
      return err(new Error('Solde insuffisant sur le compte source'));
    }

    const existingSavings = await this.savingAccountRepository.findByAccountIds([input.sourceAccountId]);
    if (existingSavings.ok && existingSavings.value.length > 0) {
      return err(new Error('Ce compte possède déjà une épargne associée'));
    }

    const newSourceBalance = sourceAccount.value.balance - amountInCents;
    const updateSourceResult = await this.bankAccountRepository.updateBalance(
      input.sourceAccountId,
      newSourceBalance
    );

    if (!updateSourceResult.ok) {
      return err(new Error('Erreur lors du débit du compte source'));
    }

    const debitOperationId = randomUUID();
    const debitOperation = Transaction.create({
      transactionIdentifier: debitOperationId,
      bankAccountIdentifier: input.sourceAccountId,
      fromAccountIdentifier: input.sourceAccountId,
      toAccountIdentifier: undefined,
      amount: amountInCents,
      direction: 'DEBIT',
      currency: 'EUR',
      type: 'TRANSFER',
      description: `Ouverture compte épargne de type ${savingProduct.label}`,
    })
    // const debitOperation = {
    //   id: debitOperationId,
    //   fromAccountId: input.sourceAccountId,
    //   toAccountId: null,
    //   amount: amountInCents,
    //   type: 'DEBIT',
    //   description: `Ouverture compte épargne (${input.rate}% par an)`,
    // };

    const createDebitResult = await this.transactionRepository.save(debitOperation);
    if (!createDebitResult.ok) {
      await this.bankAccountRepository.updateBalance(
        input.sourceAccountId,
        sourceAccount.value.balance
      );
      return err(new Error("Erreur lors de l'enregistrement de l'opération"));
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
      return err(new Error('Impossible de générer un IBAN unique'));
    }

    const finalIbanResult = Iban.from(finalIban);
    if (!finalIbanResult.ok) {
      return err(new Error('IBAN généré invalide'));
    }
    const finalIbanObject = finalIbanResult.value;

    const newSavingAccount = SavingAccount.create({
      accountIdentifier: savingId,
      clientIdentifier: input.userId,
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
      return err(new Error('Erreur lors de la création du compte épargne'));
    }

    return ok(newSavingAccount);
  }
}

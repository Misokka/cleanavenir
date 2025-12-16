import { randomUUID } from "node:crypto";
import { err, ok, Result } from "../../../../shared/Result";
import { BankAccountRepository } from "../../../ports/repositories/BankAccountRepository";
import { SavingAccountRepository } from "../../../ports/repositories/SavingAccountRepository";
import { OperationRepository } from "../../../ports/repositories/OperationRepository";

export interface CreateSavingAccountInput {
  userId: string;
  sourceAccountId: string; 
  initialAmount: number;
  rate: number; 
}

export class CreateSavingAccountUseCase {
  constructor(
    private readonly savingAccountRepository: SavingAccountRepository,
    private readonly bankAccountRepository: BankAccountRepository,
    private readonly operationRepository: OperationRepository
  ) {}

  public async execute(input: CreateSavingAccountInput): Promise<Result<any, Error>> {
    if (input.initialAmount < 10) {
      return err(new Error('Le montant initial doit être d\'au moins 10€'));
    }

    if (input.rate < 1.5 || input.rate > 3.5) {
      return err(new Error('Le taux doit être compris entre 1.5% et 3.5%'));
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
    const debitOperation = {
      id: debitOperationId,
      fromAccountId: input.sourceAccountId,
      toAccountId: null,
      amount: amountInCents,
      type: 'DEBIT',
      description: `Ouverture compte épargne (${input.rate}% par an)`,
    };

    const createDebitResult = await this.operationRepository.save(debitOperation);
    if (!createDebitResult.ok) {
      await this.bankAccountRepository.updateBalance(
        input.sourceAccountId,
        sourceAccount.value.balance
      );
      return err(new Error('Erreur lors de l\'enregistrement de l\'opération'));
    }

    const rateInBasisPoints = Math.round(input.rate * 100);
    const savingId = randomUUID();
    
    const createSavingResult = await this.savingAccountRepository.create({
      id: savingId,
      accountId: input.sourceAccountId,
      rate: rateInBasisPoints,
      balance: amountInCents,
    });

    if (!createSavingResult.ok) {
      await this.bankAccountRepository.updateBalance(
        input.sourceAccountId,
        sourceAccount.value.balance
      );
      return err(new Error('Erreur lors de la création du compte épargne'));
    }

    return ok({
      id: savingId,
      accountId: input.sourceAccountId,
      balance: input.initialAmount, 
      rate: input.rate, 
      createdAt: createSavingResult.value.createdAt,
    });
  }
}

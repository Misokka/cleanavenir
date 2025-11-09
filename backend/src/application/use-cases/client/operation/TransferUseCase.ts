import { Result, ok, err } from '../../../../shared/Result';
import { BankAccountRepositoryDrizzle } from '../../../../infrastructure/repositories/drizzle/BankAccountRepositoryDrizzle';
import { OperationRepositoryDrizzle } from '../../../../infrastructure/repositories/drizzle/OperationRepositoryDrizzle';
import { randomUUID } from 'node:crypto';

export interface TransferInput {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
  userId: string;
}

export class TransferUseCase {
  constructor(
    private readonly operationRepo: OperationRepositoryDrizzle,
    private readonly accountRepo: BankAccountRepositoryDrizzle
  ) {}

  async execute(input: TransferInput): Promise<Result<true, Error>> {
    if (input.amount <= 0) {
      return err(new Error('Le montant doit être positif'));
    }

    if (input.fromAccountId === input.toAccountId) {
      return err(new Error('Les comptes source et destination doivent être différents'));
    }

    const sourceResult = await this.accountRepo.findById(input.fromAccountId);
    if (!sourceResult.ok) {
      return err(new Error('Compte source introuvable'));
    }
    const sourceAccount = sourceResult.value;

    if (sourceAccount.ownerId !== input.userId) {
      return err(new Error('Vous n\'êtes pas autorisé à effectuer cette opération'));
    }

    const destResult = await this.accountRepo.findById(input.toAccountId);
    if (!destResult.ok) {
      return err(new Error('Compte destination introuvable'));
    }

    if (sourceAccount.balance < input.amount) {
      return err(new Error('Solde insuffisant'));
    }

    const debitId = randomUUID();
    const creditId = randomUUID();
    const description = input.description || 'Virement';

    const debitResult = await this.operationRepo.save({
      id: debitId,
      fromAccountId: input.fromAccountId,
      toAccountId: null,
      amount: -input.amount,
      type: 'DEBIT',
      description: description,
    });

    if (!debitResult.ok) {
      return err(new Error('Erreur lors de la création de l\'opération de débit'));
    }

    const creditResult = await this.operationRepo.save({
      id: creditId,
      fromAccountId: null,
      toAccountId: input.toAccountId,
      amount: input.amount,
      type: 'CREDIT',
      description: description,
    });

    if (!creditResult.ok) {
      return err(new Error('Erreur lors de la création de l\'opération de crédit'));
    }

    const newSourceBalance = sourceAccount.balance - input.amount;
    const updateSourceResult = await this.accountRepo.updateBalance(
      input.fromAccountId,
      newSourceBalance
    );

    if (!updateSourceResult.ok) {
      return err(new Error('Erreur lors de la mise à jour du solde source'));
    }

    const destAccount = destResult.value;
    const newDestBalance = destAccount.balance + input.amount;
    const updateDestResult = await this.accountRepo.updateBalance(
      input.toAccountId,
      newDestBalance
    );

    if (!updateDestResult.ok) {
      return err(new Error('Erreur lors de la mise à jour du solde destination'));
    }

    return ok(true);
  }
}

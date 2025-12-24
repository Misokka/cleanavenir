import { Result, ok, err } from '../../../../shared/Result';
import { randomUUID } from 'node:crypto';
import { TransactionRepository } from '../../../ports/repositories/TransactionRepository';
import { BankAccountRepository } from '../../../ports/repositories/BankAccountRepository';
import { Transaction } from '../../../../domain/entities/Transaction';

export interface TransferInput {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
  userId: string;
  currency?: string;
}

export class TransferUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: BankAccountRepository
  ) {}

  async execute(input: TransferInput): Promise<Result<true, Error>> {
    if (input.amount <= 0) {
      return err(new Error('Le montant doit être positif'));
    }

    if (input.fromAccountId === input.toAccountId) {
      return err(new Error('Les comptes source et destination doivent être différents'));
    }

    const sourceResult = await this.accountRepository.findById(input.fromAccountId);
    if (!sourceResult.ok) {
      return err(new Error('Compte source introuvable'));
    }
    const sourceAccount = sourceResult.value;

    if (sourceAccount.accountIdentifier !== input.userId) {
      return err(new Error("Vous n'êtes pas autorisé à effectuer cette opération"));
    }

    const destResult = await this.accountRepository.findById(input.toAccountId);
    if (!destResult.ok) {
      return err(new Error('Compte destination introuvable'));
    }

    if (sourceAccount.balance < input.amount) {
      return err(new Error('Solde insuffisant'));
    }

    const debitId = randomUUID();
    const creditId = randomUUID();
    const description = input.description || 'Virement';

    const debitTransaction = Transaction.create({
      transactionIdentifier: debitId,
      bankAccountIdentifier: input.fromAccountId,
      amount: -input.amount,
      currency: input.currency as string,
      direction: 'DEBIT',
      type: 'TRANSFER',
      description: description,
    });

    const debitResult = await this.transactionRepository.save(debitTransaction);
    if (!debitResult.ok) {
      return err(new Error('Erreur lors de la création de l\'opération de débit'));
    }

    const creditTransaction = Transaction.create({
      transactionIdentifier: creditId,
      bankAccountIdentifier: input.toAccountId,
      amount: input.amount,
      currency: input.currency as string,
      direction: 'CREDIT',
      type: 'TRANSFER',
      description: description,
    });
    const creditResult = await this.transactionRepository.save(creditTransaction);

    if (!creditResult.ok) {
      return err(new Error('Erreur lors de la création de l\'opération de crédit'));
    }

    const newSourceBalance = sourceAccount.balance - input.amount;
    const updateSourceResult = await this.accountRepository.updateBalance(
      input.fromAccountId,
      newSourceBalance
    );

    if (!updateSourceResult.ok) {
      return err(new Error('Erreur lors de la mise à jour du solde source'));
    }

    const destAccount = destResult.value;
    const newDestBalance = destAccount.balance + input.amount;
    const updateDestResult = await this.accountRepository.updateBalance(
      input.toAccountId,
      newDestBalance
    );

    if (!updateDestResult.ok) {
      return err(new Error('Erreur lors de la mise à jour du solde destination'));
    }

    return ok(true);
  }
}

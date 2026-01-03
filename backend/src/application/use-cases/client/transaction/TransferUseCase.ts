import { Result, ok, err } from '../../../../shared/Result';
import { randomUUID } from 'node:crypto';
import { TransactionRepository } from '../../../ports/repositories/TransactionRepository';
import { BankAccountRepository } from '../../../ports/repositories/BankAccountRepository';
import { Transaction } from '../../../../domain/entities/Transaction';
import { ClientRepository } from '../../../ports/repositories/ClientRepository';

export interface TransferInput {
  fromAccountId: string;
  toAccountId?: string;
  toIban?: string;
  amount: number;
  description?: string;
  userId: string;
  currency?: string;
}

export class TransferUseCase {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: BankAccountRepository
  ) {}

  async execute(input: TransferInput): Promise<Result<true, Error>> {
    if (input.amount <= 0) {
      return err(new Error('Le montant doit être positif'));
    }

    if (!input.toAccountId && !input.toIban) {
      return err(new Error('Compte ou IBAN de destination requis'));
    }

    let toAccountId = input.toAccountId;

    if (input.toIban && !toAccountId) {
      const destByIbanResult = await this.accountRepository.findByIban(input.toIban);
      if (!destByIbanResult.ok) {
        return err(new Error('Compte destination introuvable dans notre banque'));
      }
      toAccountId = destByIbanResult.value.accountIdentifier;
    }

    if (!toAccountId) {
      return err(new Error('Compte destination invalide'));
    }

    if (input.fromAccountId === toAccountId) {
      return err(new Error('Les comptes source et destination doivent être différents'));
    }

    const sourceResult = await this.accountRepository.findById(input.fromAccountId);
    if (!sourceResult.ok) {
      return err(new Error('Compte source introuvable'));
    }
    const sourceAccount = sourceResult.value;

    const clientResult = await this.clientRepository.findByUserId(input.userId);
    if (!clientResult.ok) {
      return err(clientResult.error);
    }

    const client = clientResult.value;

    if (sourceAccount.clientIdentifier !== client.clientIdentifier) {
      return err(new Error("Vous n'êtes pas autorisé à effectuer cette opération"));
    }

    const destResult = await this.accountRepository.findById(toAccountId);
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
      bankAccountIdentifier: sourceAccount.accountIdentifier,
      fromAccountIdentifier: sourceAccount.accountIdentifier,
      toAccountIdentifier: destResult.value.accountIdentifier,
      amount: -input.amount,
      currency: input.currency as string ?? "EUR",
      direction: 'DEBIT',
      type: 'TRANSFER',
      description: description,
    });

    const debitResult = await this.transactionRepository.save(debitTransaction);
    if (!debitResult.ok) {
      return err(debitResult.error);
    }

    const creditTransaction = Transaction.create({
      transactionIdentifier: creditId,
      bankAccountIdentifier: destResult.value.accountIdentifier,
      fromAccountIdentifier: sourceAccount.accountIdentifier,
      toAccountIdentifier: destResult.value.accountIdentifier,
      amount: input.amount,
      currency: input.currency as string ?? "EUR",
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
      toAccountId,
      newDestBalance
    );

    if (!updateDestResult.ok) {
      return err(new Error('Erreur lors de la mise à jour du solde destination'));
    }

    return ok(true);
  }
}

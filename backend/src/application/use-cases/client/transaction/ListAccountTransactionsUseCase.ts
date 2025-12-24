import { Transaction } from '../../../../domain/entities/Transaction';
import { Result, ok, err } from '../../../../shared/Result';
import { BankAccountRepository } from '../../../ports/repositories/BankAccountRepository';
import { ClientRepository } from '../../../ports/repositories/ClientRepository';
import { TransactionRepository } from '../../../ports/repositories/TransactionRepository';

export class ListAccountTransactionsUseCase {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly bankAccountRepository: BankAccountRepository
  ) {}

  async execute(params: {userId: string; accountId: string; }): Promise<Result<Transaction[], Error>> {
    const clientResult = await this.clientRepository.findByUserId(params.userId);
    if (!clientResult.ok) {
      return err(new Error('Client non trouvé'));
    }

    const client = clientResult.value;
    const accountResult = await this.bankAccountRepository.findById(params.accountId);

    if (!accountResult.ok) {
      return err(new Error('Compte non trouvé'));
    }

    const account = accountResult.value;

    if (account.clientIdentifier !== client.clientIdentifier) {
      return err(new Error('Accès non autorisé à ce compte'));
    }

    const transactionsResult = await this.transactionRepository.listForAccount(params.accountId);

    if (!transactionsResult.ok) {
      return transactionsResult;
    }

    return ok(transactionsResult.value);
  }
}

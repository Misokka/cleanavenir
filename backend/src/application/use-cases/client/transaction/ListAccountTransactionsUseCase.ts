import { Transaction } from '../../../../domain/entities/Transaction';
import { Result, ok, err } from '../../../../shared/Result';
import { BankAccountRepository } from '../../../ports/repositories/BankAccountRepository';
import { TransactionRepository } from '../../../ports/repositories/TransactionRepository';

export class ListAccountTransactionsUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly bankAccountRepository: BankAccountRepository
  ) {}

  async execute(params: {userId: string; accountId: string; }): Promise<Result<Transaction[], Error>> {
    const accountResult = await this.bankAccountRepository.findById(params.accountId);

    if (!accountResult.ok) {
      return err(new Error('Compte non trouvé'));
    }

    const account = accountResult.value;

    if (account.clientIdentifier !== params.userId) {
      return err(new Error('Accès non autorisé à ce compte'));
    }

    const transactionsResult = await this.transactionRepository.listForAccount(params.accountId);

    if (!transactionsResult.ok) {
      return transactionsResult;
    }

    return ok(transactionsResult.value);
  }
}

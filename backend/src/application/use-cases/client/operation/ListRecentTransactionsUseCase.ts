import { Transaction } from '../../../../domain/entities/Transaction';
import { Result, ok } from '../../../../shared/Result';
import { BankAccountRepository } from '../../../ports/repositories/BankAccountRepository';
import { TransactionRepository } from '../../../ports/repositories/TransactionRepository';


export class ListRecentOperationsUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly bankAccountRepository: BankAccountRepository
  ) {}

  async execute(params: {userId: string; limit?: number; }): Promise<Result<Transaction[], Error>> {
    const limit = params.limit || 5;

    const accountsResult = await this.bankAccountRepository.findByOwner(params.userId);

    if (!accountsResult.ok) {
      return accountsResult;
    }

    const accounts = accountsResult.value;

    if (accounts.length === 0) {
      return ok([]);
    }

    const accountIds = accounts.map((account) => account.accountIdentifier);

    return this.transactionRepository.listRecentForUser(accountIds, limit);
  }
}

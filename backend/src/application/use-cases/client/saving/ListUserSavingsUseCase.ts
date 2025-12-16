import { Result, ok } from '../../../../shared/Result';
import { BankAccountRepository } from '../../../ports/repositories/BankAccountRepository';
import { SavingAccountRepository } from '../../../ports/repositories/SavingAccountRepository';

export class ListUserSavingsUseCase {
  constructor(
    private readonly savingRepository: SavingAccountRepository,
    private readonly bankAccountRepository: BankAccountRepository
  ) {}

  async execute(params: { userId: string }): Promise<Result<any[], Error>> {
    const accountsResult = await this.bankAccountRepository.findByOwner(params.userId);

    if (!accountsResult.ok) {
      return accountsResult;
    }

    const accounts = accountsResult.value;

    if (accounts.length === 0) {
      return ok([]);
    }

    const accountIds = accounts.map((account) => account.accountIdentifier);

    return this.savingRepository.findByAccountIds(accountIds);
  }
}

import { SavingAccount } from '../../../../domain/entities/SavingAccount';
import { Result, ok } from '../../../../shared/Result';
import { BankAccountRepository } from '../../../ports/repositories/BankAccountRepository';
import { SavingAccountRepository } from '../../../ports/repositories/SavingAccountRepository';

export class ListUserSavingsUseCase {
  constructor(
    private readonly savingRepository: SavingAccountRepository,
    private readonly bankAccountRepository: BankAccountRepository
  ) {}

  async execute(params: { clientId: string }): Promise<Result<SavingAccount[], Error>> {
    const accountsResult = await this.bankAccountRepository.findByOwner(params.clientId);

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

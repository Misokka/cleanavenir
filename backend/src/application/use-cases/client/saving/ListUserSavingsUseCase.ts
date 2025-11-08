import { Result, ok } from '../../../../shared/Result';

export interface SavingRepository {
  findByAccountIds(accountIds: string[]): Promise<Result<any[], Error>>;
}

export interface BankAccountRepository {
  findByOwner(ownerId: string): Promise<Result<any[], Error>>;
}

export class ListUserSavingsUseCase {
  constructor(
    private readonly savingRepository: SavingRepository,
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

    const accountIds = accounts.map((account) => account.id);

    return this.savingRepository.findByAccountIds(accountIds);
  }
}

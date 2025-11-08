import { Result, ok } from '../../../../shared/Result';

export interface OperationRepository {
  listRecentForUser(userAccountIds: string[], limit: number): Promise<Result<any[], Error>>;
}

export interface BankAccountRepository {
  findByOwner(ownerId: string): Promise<Result<any[], Error>>;
}

export class ListRecentOperationsUseCase {
  constructor(
    private readonly operationRepository: OperationRepository,
    private readonly bankAccountRepository: BankAccountRepository
  ) {}

  async execute(params: {userId: string; limit?: number; }): Promise<Result<any[], Error>> {
    const limit = params.limit || 5;

    const accountsResult = await this.bankAccountRepository.findByOwner(params.userId);

    if (!accountsResult.ok) {
      return accountsResult;
    }

    const accounts = accountsResult.value;

    if (accounts.length === 0) {
      return ok([]);
    }

    const accountIds = accounts.map((account) => account.id);

    return this.operationRepository.listRecentForUser(accountIds, limit);
  }
}

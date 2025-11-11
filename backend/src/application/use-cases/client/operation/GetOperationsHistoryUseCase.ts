import { Result, ok, err } from '../../../../shared/Result';

export interface OperationFilters {
  type?: string[]; // ['CREDIT', 'DEBIT', 'TRANSFER', 'INTEREST']
  dateFrom?: string; // ISO date
  dateTo?: string; // ISO date
  amountMin?: number; // en centimes
  amountMax?: number; // en centimes
  accountId?: string; // filtrer par compte spécifique
}

export interface OperationRepository {
  listWithFilters(accountIds: string[], filters: OperationFilters): Promise<Result<any[], Error>>;
}

export interface BankAccountRepository {
  findByOwner(ownerId: string): Promise<Result<any[], Error>>;
}

export class GetOperationsHistoryUseCase {
  constructor(
    private readonly operationRepository: OperationRepository,
    private readonly bankAccountRepository: BankAccountRepository
  ) {}

  async execute(params: {
    userId: string;
    filters?: OperationFilters;
  }): Promise<Result<any[], Error>> {
    const accountsResult = await this.bankAccountRepository.findByOwner(params.userId);

    if (!accountsResult.ok) {
      return accountsResult;
    }

    const accounts = accountsResult.value;

    if (accounts.length === 0) {
      return ok([]);
    }

    const accountIds = accounts.map((account) => account.id);

    if (params.filters?.accountId) {
      const accountBelongsToUser = accountIds.includes(params.filters.accountId);
      if (!accountBelongsToUser) {
        return err(new Error('Compte non autorisé'));
      }
    }

    const operationsResult = await this.operationRepository.listWithFilters(
      accountIds,
      params.filters || {}
    );

    if (!operationsResult.ok) {
      return operationsResult;
    }

    const enrichedOperations = operationsResult.value.map((op) => {
      const isCredit = accountIds.includes(op.toAccountId);
      const isDebit = accountIds.includes(op.fromAccountId);
      const isInternal = isCredit && isDebit;

      let direction = 'OUTGOING';
      if (isInternal) {
        direction = 'INTERNAL';
      } else if (isCredit) {
        direction = 'INCOMING';
      }

      return {
        ...op,
        direction,
        userAccountId: isCredit ? op.toAccountId : op.fromAccountId,
      };
    });

    return ok(enrichedOperations);
  }
}

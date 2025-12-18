import { Result, ok, err } from '../../../../shared/Result';
import { BankAccountRepository } from '../../../ports/repositories/BankAccountRepository';
import { TransactionRepository } from '../../../ports/repositories/TransactionRepository';

export interface OperationFilters {
  type?: string[]; // ['CREDIT', 'DEBIT', 'TRANSFER', 'INTEREST']
  dateFrom?: string; // ISO date
  dateTo?: string; // ISO date
  amountMin?: number; // en centimes
  amountMax?: number; // en centimes
  accountId?: string; // filtrer par compte spécifique
}


export class GetOperationsHistoryUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
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

    const accountIds = accounts.map((account) => account.accountIdentifier);

    if (params.filters?.accountId) {
      const accountBelongsToUser = accountIds.includes(params.filters.accountId);
      if (!accountBelongsToUser) {
        return err(new Error('Compte non autorisé'));
      }
    }

    const operationsResult = await this.transactionRepository.listWithFilters(
      accountIds,
      params.filters || {}
    );

    if (!operationsResult.ok) {
      return operationsResult;
    }

    const enrichedOperations = operationsResult.value.map((op) => {
      const isCredit = accountIds.includes(op.toAccountIdentifier as string);
      const isDebit = accountIds.includes(op.fromAccountIdentifier as string);
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
        userAccountId: isCredit ? op.toAccountIdentifier : op.fromAccountIdentifier,
      };
    });

    return ok(enrichedOperations);
  }
}

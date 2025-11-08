import { Result, ok, err } from '../../../../shared/Result';

export interface OperationRepository {
  listForAccount(accountId: string): Promise<Result<any[], Error>>;
}

export interface BankAccountRepository {
  findById(id: string): Promise<Result<any, Error>>;
}

export class ListAccountOperationsUseCase {
  constructor(
    private readonly operationRepository: OperationRepository,
    private readonly bankAccountRepository: BankAccountRepository
  ) {}

  async execute(params: {userId: string; accountId: string; }): Promise<Result<any[], Error>> {
    const accountResult = await this.bankAccountRepository.findById(params.accountId);

    if (!accountResult.ok) {
      return err(new Error('Compte non trouvé'));
    }

    const account = accountResult.value;

    if (account.ownerId !== params.userId) {
      return err(new Error('Accès non autorisé à ce compte'));
    }

    return this.operationRepository.listForAccount(params.accountId);
  }
}

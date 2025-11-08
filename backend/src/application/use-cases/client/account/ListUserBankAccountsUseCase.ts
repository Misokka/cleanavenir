import { Result, ok } from '../../../../shared/Result';

export interface BankAccountRepository {
  findByOwner(ownerId: string): Promise<Result<any[], Error>>;
}

export class ListUserBankAccountsUseCase {
  constructor(private readonly bankAccountRepository: BankAccountRepository) {}

  async execute(params: { userId: string }): Promise<Result<any[], Error>> {
    return this.bankAccountRepository.findByOwner(params.userId);
  }
}

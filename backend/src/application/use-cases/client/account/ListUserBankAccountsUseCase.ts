import { BankAccount } from '../../../../domain/entities/BankAccount';
import { Result, ok } from '../../../../shared/Result';
import { BankAccountRepository } from '../../../ports/repositories/BankAccountRepository';

export class ListUserBankAccountsUseCase {
  constructor(private readonly bankAccountRepository: BankAccountRepository) {}

  async execute(params: { userId: string }): Promise<Result<BankAccount[], Error>> {
    return this.bankAccountRepository.findByOwner(params.userId);
  }
}

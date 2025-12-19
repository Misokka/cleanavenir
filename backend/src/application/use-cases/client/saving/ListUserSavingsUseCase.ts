import { SavingAccount } from '../../../../domain/entities/SavingAccount';
import { Result, err, ok } from '../../../../shared/Result';
import { SavingAccountRepository } from '../../../ports/repositories/SavingAccountRepository';

export class ListUserSavingsUseCase {
  constructor(
    private readonly savingRepository: SavingAccountRepository,
  ) {}

  async execute(params: { clientId: string }): Promise<Result<SavingAccount[], Error>> {
    const savingAccountsResult = await this.savingRepository.findManyByOwner(params.clientId);

    if (!savingAccountsResult.ok) {
      return err(savingAccountsResult.error);
    }

    const accounts = savingAccountsResult.value;

    return ok(accounts);
  }
}

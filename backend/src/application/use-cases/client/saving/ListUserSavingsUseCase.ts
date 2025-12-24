import { SavingAccount } from '../../../../domain/entities/SavingAccount';
import { Result, err, ok } from '../../../../shared/Result';
import { ClientRepository } from '../../../ports/repositories/ClientRepository';
import { SavingAccountRepository } from '../../../ports/repositories/SavingAccountRepository';

export class ListUserSavingsUseCase {
  constructor(
    private readonly savingRepository: SavingAccountRepository,
    private readonly clientRepository: ClientRepository
  ) {}

  async execute(params: { userId: string }): Promise<Result<SavingAccount[], Error>> {
    const clientResult = await this.clientRepository.findByUserId(params.userId);
    if(!clientResult.ok){
      return err(clientResult.error);
    }

    const client = clientResult.value;

    const savingAccountsResult = await this.savingRepository.findManyByOwner(client.clientIdentifier);

    if (!savingAccountsResult.ok) {
      return err(savingAccountsResult.error);
    }

    const accounts = savingAccountsResult.value;

    return ok(accounts);
  }
}

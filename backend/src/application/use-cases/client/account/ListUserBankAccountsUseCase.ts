import { BankAccount } from '../../../../domain/entities/BankAccount';
import { Result, err, ok } from '../../../../shared/Result';
import { BankAccountRepository } from '../../../ports/repositories/BankAccountRepository';
import { ClientRepository } from '../../../ports/repositories/ClientRepository';

export class ListUserBankAccountsUseCase {
  constructor(
    private readonly bankAccountRepository: BankAccountRepository,
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute(params: { userId: string }): Promise<Result<BankAccount[], Error>> {
    const clientResult = await this.clientRepository.findByUserId(params.userId);
    if(!clientResult.ok){
      return err(clientResult.error);
    }

    const client = clientResult.value

    return this.bankAccountRepository.findByOwner(client.clientIdentifier);
  }
}

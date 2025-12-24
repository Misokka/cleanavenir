import { BankAccount } from '../../../../domain/entities/BankAccount';
import { Result, ok, err } from '../../../../shared/Result';
import { BankAccountRepository } from '../../../ports/repositories/BankAccountRepository';
import { ClientRepository } from '../../../ports/repositories/ClientRepository';

export class GetBankAccountUseCase {
  constructor(
    private readonly bankAccountRepository: BankAccountRepository,
    private readonly clientRepository: ClientRepository
  ) {}

  async execute(params: {userId: string; accountId: string; }): Promise<Result<BankAccount, Error>> {
    const clientResult = await this.clientRepository.findByUserId(params.userId);
    if (!clientResult.ok) {
      return err(new Error('Client non trouvé'));
    }

    const client = clientResult.value;


    const accountResult = await this.bankAccountRepository.findById(params.accountId);

    if (!accountResult.ok) {
      return err(new Error('Compte non trouvé'));
    }

    const account = accountResult.value;

    if (account.clientIdentifier !== client.clientIdentifier) {
      return err(new Error('Accès non autorisé à ce compte'));
    }

    return ok(account);
  }
}

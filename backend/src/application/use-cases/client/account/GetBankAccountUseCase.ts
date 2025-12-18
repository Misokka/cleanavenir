import { BankAccount } from '../../../../domain/entities/BankAccount';
import { Result, ok, err } from '../../../../shared/Result';
import { BankAccountRepository } from '../../../ports/repositories/BankAccountRepository';

export class GetBankAccountUseCase {
  constructor(private readonly bankAccountRepository: BankAccountRepository) {}

  async execute(params: {clientId: string; accountId: string; }): Promise<Result<BankAccount, Error>> {
    const accountResult = await this.bankAccountRepository.findById(params.accountId);

    if (!accountResult.ok) {
      return err(new Error('Compte non trouvé'));
    }

    const account = accountResult.value;

    if (account.clientIdentifier !== params.clientId) {
      return err(new Error('Accès non autorisé à ce compte'));
    }

    return ok(account);
  }
}

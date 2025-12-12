import { Result, ok, err } from '../../../../shared/Result';
import { UserNotFoundError } from '../../../../domain/errors/UserNotFoundError';
import { BankAccountRepository } from '../../../ports/repositories/BankAccountRepository';

// export interface BankAccountRepository {
//   findById(id: string): Promise<Result<any, Error>>;
//   findByOwner(ownerId: string): Promise<Result<any[], Error>>;
//   create(account: {
//     id: string;
//     iban: string;
//     name: string;
//     ownerId: string;
//     balance?: number;
//   }): Promise<Result<any, Error>>;
//   updateBalance(id: string, newBalance: number): Promise<Result<number, Error>>;
// }

export class GetBankAccountUseCase {
  constructor(private readonly bankAccountRepository: BankAccountRepository) {}

  async execute(params: {userId: string; accountId: string; }): Promise<Result<any, Error>> {
    const accountResult = await this.bankAccountRepository.findById(params.accountId);

    if (!accountResult.ok) {
      return err(new Error('Compte non trouvé'));
    }

    const account = accountResult.value;

    if (account.clientIdentifier !== params.userId) {
      return err(new Error('Accès non autorisé à ce compte'));
    }

    return ok(account);
  }
}

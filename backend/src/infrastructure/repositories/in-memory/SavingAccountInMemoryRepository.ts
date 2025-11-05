import { SavingAccountRepository } from '../../../application/ports/repositories/SavingAccountRepository';
import { SavingAccount } from '../../../domain/entities/SavingAccount';
import { BaseInMemoryRepository } from './BaseInMemoryRepository';

export class SavingAccountInMemoryRepository
  extends BaseInMemoryRepository<SavingAccount>
  implements SavingAccountRepository
{
  constructor() {
    super((account) => account.id);
  }

  async findByUserId(userId: string): Promise<SavingAccount | null> {
    return this.firstWhere((account) => account.userId === userId);
  }
}
import { BankAccountRepository } from '../../../application/ports/repositories/BankAccountRepository';
import { BankAccount } from '../../../domain/entities/BankAccount';
import { BaseInMemoryRepository } from './BaseInMemoryRepository';

export class BankAccountInMemoryRepository
  extends BaseInMemoryRepository<BankAccount>
  implements BankAccountRepository
{
  constructor() {
    super((account) => account.id);
  }

  async findByIban(iban: string): Promise<BankAccount | null> {
    // On suppose que Iban est un Value Object avec un champ `value`
    return this.firstWhere((account) => account.iban.value === iban);
  }

  async findAllByUserId(userId: string): Promise<BankAccount[]> {
    return this.where((account) => account.userId === userId);
  }
}
import { OperationRepository } from '../../application/ports/repositories/OperationRepository';
import { Operation } from '../../domain/entities/Operation';
import { BaseInMemoryRepository } from './BaseInMemoryRepository';

export class OperationInMemoryRepository
  extends BaseInMemoryRepository<Operation>
  implements OperationRepository
{
  constructor() {
    super((operation) => operation.id);
  }

  async findAllByBankAccountId(bankAccountId: string): Promise<Operation[]> {
    return this.where(
      (operation) => operation.bankAccountId === bankAccountId,
    );
  }
}
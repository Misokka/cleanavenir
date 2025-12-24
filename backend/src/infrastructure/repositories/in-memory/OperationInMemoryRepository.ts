import { OperationRepository } from '../../../application/ports/repositories/OperationRepository';
import { OperationDTO } from '../../../application/dtos/TransactionDTO';
import { Result, ok, err } from '../../../shared/Result';
import { BankAccountNotFoundError } from '../../../domain/errors/BankAccountNotFoundError';
import { OperationNotFoundError } from '../../../domain/errors/OperationNotFoundError';
import { InsufficientFundsError } from '../../../domain/errors/InsufficientFundsError';
import { randomUUID } from 'crypto';

export class OperationInMemoryRepository implements OperationRepository {
  private operations = new Map<string, OperationDTO>();

  private clone<T>(v: T): T {
    try { return structuredClone(v); } catch { return JSON.parse(JSON.stringify(v)); }
  }

  async createCredit(input: { AccountId: string; amount: number; currency: string; label: string; }): Promise<Result<OperationDTO, BankAccountNotFoundError>> {
    if (!input.AccountId) return err(new BankAccountNotFoundError(String(input.AccountId)));

    const dto: OperationDTO = {
      id: randomUUID(),
      AccountId: input.AccountId,
      kind: 'CREDIT',
      amount: input.amount,
      currency: input.currency,
      label: input.label,
      createdAt: new Date().toISOString(),
    };

    this.operations.set(dto.id, this.clone(dto));
    return ok(this.clone(dto));
  }

  async createDebit(input: { AccountId: string; amount: number; currency: string; label: string; }): Promise<Result<OperationDTO, BankAccountNotFoundError | InsufficientFundsError>> {
    if (!input.AccountId) return err(new BankAccountNotFoundError(String(input.AccountId)));

    // For in-memory repository we don't track balances here; delegate to higher layer.
    const dto: OperationDTO = {
      id: randomUUID(),
      AccountId: input.AccountId,
      kind: 'DEBIT',
      amount: input.amount,
      currency: input.currency,
      label: input.label,
      createdAt: new Date().toISOString(),
    };

    this.operations.set(dto.id, this.clone(dto));
    return ok(this.clone(dto));
  }

  async findById(id: string): Promise<Result<OperationDTO, OperationNotFoundError>> {
    const op = this.operations.get(id);
    if (!op) return err(new OperationNotFoundError(id));
    return ok(this.clone(op));
  }

  async listByAccountId(params: { AccountId: string; limit?: number; offset?: number; }): Promise<Result<OperationDTO[], BankAccountNotFoundError>> {
    if (!params.AccountId) return err(new BankAccountNotFoundError(String(params.AccountId)));
    const all = Array.from(this.operations.values()).filter(o => o.AccountId === params.AccountId);
    const offset = params.offset ?? 0;
    const limit = params.limit ?? all.length;
    const slice = all.slice(offset, offset + limit).map(o => this.clone(o));
    return ok(slice);
  }
}
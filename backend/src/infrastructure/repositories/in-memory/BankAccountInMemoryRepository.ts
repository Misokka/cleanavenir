import { BankAccountRepository } from '../../../application/ports/repositories/BankAccountRepository';
import { BankAccount } from '../../../domain/entities/BankAccount';
import { BankAccountNotFoundError } from '../../../domain/errors/BankAccountNotFoundError';
import { Result, ok, err } from '../../../shared/Result';

export class BankAccountInMemoryRepository implements BankAccountRepository {
  private accounts = new Map<string, BankAccount>();

  private clone<T>(v: T): T {
    try {
      return structuredClone(v);
    } catch {
      return JSON.parse(JSON.stringify(v));
    }
  }

  async save(bankAccount: BankAccount): Promise<Result<BankAccount, BankAccountNotFoundError>> {
    const id = bankAccount.accountIdentifier;
    this.accounts.set(id, this.clone(bankAccount));
    return ok(bankAccount);
  }

  async findById(accountIdentifier: string): Promise<Result<BankAccount, BankAccountNotFoundError>> {
    const acc = this.accounts.get(accountIdentifier);
    if (!acc) return err(new BankAccountNotFoundError(accountIdentifier));
    return ok(this.clone(acc));
  }

  async findByIban(iban: string): Promise<BankAccount | null> {
    for (const acc of this.accounts.values()) {
      if (acc.iban.value === iban) return this.clone(acc);
    }
    return null;
  }

  async findAllByUserId(userId: string): Promise<BankAccount[]> {
    return Array.from(this.accounts.values())
      .filter((a) => a.clientIdentifier === userId)
      .map((a) => this.clone(a));
  }

  async findDefaultAccountByClientId(clientIdentifier: string): Promise<Result<BankAccount, BankAccountNotFoundError>> {
    const acc = Array.from(this.accounts.values()).find(a => a.clientIdentifier === clientIdentifier);
    if (!acc) return err(new BankAccountNotFoundError(clientIdentifier));
    return ok(this.clone(acc));
  }

  async rename(accountIdentifier: string, label: string): Promise<Result<BankAccount, BankAccountNotFoundError>> {
    const found = this.accounts.get(accountIdentifier);
    if (!found) return err(new BankAccountNotFoundError(accountIdentifier));
    found.label = label;
    this.accounts.set(accountIdentifier, this.clone(found));
    return ok(this.clone(found));
  }

  async remove(accountIdentifier: string): Promise<Result<true, BankAccountNotFoundError>> {
    if (!this.accounts.has(accountIdentifier)) return err(new BankAccountNotFoundError(accountIdentifier));
    this.accounts.delete(accountIdentifier);
    return ok(true);
  }
}
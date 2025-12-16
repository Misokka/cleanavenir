import { BankAccountRepository } from '../../../application/ports/repositories/BankAccountRepository';
import { BankAccount } from '../../../domain/entities/BankAccount';
import { BankAccountNotFoundError } from '../../../domain/errors/BankAccountNotFoundError';
import { UnexpectedBankAccountError } from '../../../domain/errors/UnexpectedBankAccountError';
import { ok, err, Result } from '../../../shared/Result';
import { DrizzleClient } from '../../drizzle/client';
import { bankAccounts } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

export class BankAccountRepositoryDrizzle implements BankAccountRepository {
  constructor(private readonly db: DrizzleClient) {}

  async save(account: BankAccount): Promise<Result<any, Error>> {
    try {
      const now = new Date().toISOString();
      await this.db.insert(bankAccounts).values({
        id: account.accountIdentifier,
        iban: account.iban.value,
        name: account.label,
        ownerId: account.clientIdentifier,
        balance: account.balance ?? 0,
        createdAt: now,
        updatedAt: now,
      });
      return ok(account);
    } catch (e: any) {
      return err(e);
    }
  }

  async findDefaultAccountByClientId(clientIdentifier: string): Promise<Result<BankAccount, BankAccountNotFoundError | UnexpectedBankAccountError>> {
    try {
      const rows = await this.db.select().from(bankAccounts).where(eq(bankAccounts.ownerId, clientIdentifier)).limit(1);
      if (!rows.length) return err(new Error('BankAccount not found'));
      return ok(rows[0]);
    } catch (e: any) {
      return err(e);
    }
  }

  async findById(id: string): Promise<Result<any, Error>> {
    try {
      const rows = await this.db.select().from(bankAccounts).where(eq(bankAccounts.id, id)).limit(1);
      if (!rows.length) return err(new Error('BankAccount not found'));
      return ok(rows[0]);
    } catch (e: any) {
      return err(e);
    }
  }

  async findByIban(iban: string): Promise<Result<any, Error>> {
    try {
      const rows = await this.db.select().from(bankAccounts).where(eq(bankAccounts.iban, iban)).limit(1);
      if (!rows.length) return err(new Error('BankAccount not found'));
      return ok(rows[0]);
    } catch (e: any) {
      return err(e);
    }
  }

  async findByOwner(ownerId: string): Promise<Result<any[], Error>> {
    try {
  const rows = await this.db.select().from(bankAccounts).where(eq(bankAccounts.ownerId, ownerId));
      return ok(rows);
    } catch (e: any) {
      return err(e);
    }
  }

  async updateBalance(id: string, newBalance: number): Promise<Result<number, Error>> {
    try {
  await this.db.update(bankAccounts).set({ balance: newBalance }).where(eq(bankAccounts.id, id));
      return ok(newBalance);
    } catch (e: any) {
      return err(e);
    }
  }

  async rename(id: string, newName: string): Promise<Result<any, Error>> {
    try {
      const now = new Date().toISOString();
      await this.db.update(bankAccounts).set({ name: newName, updatedAt: now }).where(eq(bankAccounts.id, id));
      return this.findById(id);
    } catch (e: any) {
      return err(e);
    }
  }

  async delete(id: string): Promise<Result<true, Error>> {
    try {
      await this.db.delete(bankAccounts).where(eq(bankAccounts.id, id));
      return ok(true);
    } catch (e: any) {
      return err(e);
    }
  }

  async remove(accountIdentifier: string): Promise<Result<true, BankAccountNotFoundError | UnexpectedBankAccountError>> {
    try{
      return this.delete(accountIdentifier);
    } catch (e: any){
      return err(e);
    }
  }
}

import { ok, err, Result } from '../../../shared/Result';
import { bankAccounts } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

// simple repo for bank accounts
export class BankAccountRepositoryDrizzle {
  constructor(private readonly db: any) {}

  async create(account: {
    id: string;
    iban: string;
    name: string;
    ownerId: string;
    balance?: number;
  }): Promise<Result<any, Error>> {
    try {
      const now = new Date().toISOString();
      await this.db.insert(bankAccounts).values({
        id: account.id,
        iban: account.iban,
        name: account.name,
        ownerId: account.ownerId,
        balance: account.balance ?? 0,
        createdAt: now,
        updatedAt: now,
      });
      return ok(account);
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
}

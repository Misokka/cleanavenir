import { eq, inArray } from 'drizzle-orm';
import { savings } from '../../drizzle/schema';
import { ok, err, Result } from '../../../shared/Result';
import { DrizzleClient } from '../../drizzle/client';
import { SavingAccountRepository } from '../../../application/ports/repositories/SavingAccountRepository';

export class SavingRepositoryDrizzle implements SavingAccountRepository{
  constructor(private readonly db: DrizzleClient) {}

  async create(saving: {
    id: string;
    accountId: string;
    rate: number; // taux annuel en basis points (ex: 250 = 2.5%)
    balance: number; // en centimes
  }): Promise<Result<any, Error>> {
    try {
      const now = new Date().toISOString();
      const savingData = {
        ...saving,
        createdAt: now,
        updatedAt: now,
      };
      await this.db.insert(savings).values(savingData);
      return ok(savingData);
    } catch (e: any) {
      return err(new Error(`Could not insert saving: ${e.message}`));
    }
  }

  async save(saving: any) {
    try {
      await this.db.insert(savings).values(saving);
      return ok(saving);
    } catch (e: any) {
      return err(new Error(`Could not insert saving: ${e.message}`));
    }
  }

  async findById(id: string): Promise<Result<any, Error>> {
    try {
      const row = await this.db.select().from(savings).where(eq(savings.id, id)).limit(1);
      if (!row || row.length === 0) {
        return err(new Error('Saving not found'));
      }
      return ok(row[0]);
    } catch (e: any) {
      return err(new Error(`Could not find saving by id: ${e.message}`));
    }
  }

  async findByAccountIds(accountIds: string[]): Promise<Result<any[], Error>> {
    try {
      if (accountIds.length === 0) {
        return ok([]);
      }
      const rows = await this.db.select().from(savings).where(inArray(savings.accountId, accountIds));
      return ok(rows);
    } catch (e: any) {
      return err(new Error(`Could not find savings by account ids: ${e.message}`));
    }
  }

  async findAll(): Promise<Result<any[], Error>> {
    try {
      const rows = await this.db.select().from(savings);
      return ok(rows);
    } catch (e: any) {
      return err(new Error(`Could not find all savings: ${e.message}`));
    }
  }

  async updateBalance(id: string, newBalance: number): Promise<Result<number, Error>> {
    try {
      const now = new Date().toISOString();
      await this.db.update(savings).set({ 
        balance: newBalance,
        updatedAt: now 
      }).where(eq(savings.id, id));
      return ok(newBalance);
    } catch (e: any) {
      return err(new Error(`Could not update saving balance: ${e.message}`));
    }
  }
}


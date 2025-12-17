import { eq, inArray } from 'drizzle-orm';
import { savingAccounts, savings } from '../../drizzle/schema';
import { ok, err, Result } from '../../../shared/Result';
import { DrizzleClient } from '../../drizzle/client';
import { SavingAccountRepository } from '../../../application/ports/repositories/SavingAccountRepository';
import { SavingAccount } from '../../../domain/entities/SavingAccount';
import { DrizzleSavingAccountMapper } from '../mappers/DrizzleMappers/DrizzleSavingAccountMapper';
import { SavingBankAccountNotFoundError } from '../../../domain/errors/SavingAccountNotFoundError';

export class SavingRepositoryDrizzle implements SavingAccountRepository{
  constructor(
    private readonly db: DrizzleClient,
    private readonly savingAccountMapper: DrizzleSavingAccountMapper
  ) {}

    async save(saving: SavingAccount): Promise<Result<SavingAccount, Error>> {
    try {
      const savingAccountToPersist = this.savingAccountMapper.toPersistence(saving);
      const registeredSavingAccountRows = await this.db.insert(savingAccounts).values(savingAccountToPersist).returning();
      const savingAccountToDomain = this.savingAccountMapper.toDomain(registeredSavingAccountRows[0]);
      return ok(savingAccountToDomain);
    } catch (e: any) {
      return err(new Error(`Could not insert saving: ${e.message}`));
    }
  }

  async saveAll(savingAccounts: SavingAccount[]): Promise<Result<SavingAccount[], Error>> {
    try{
      const savedSavingAccounts: SavingAccount[] = []
      savingAccounts.forEach(async (savingAccount) => {
        const savedResult = await this.save(savingAccount);
        if(!savedResult.ok){
          return err(new Error(`An error occured when saving savingAccount ${savingAccount.accountIdentifier}. Message:${savedResult.error.message}`))
        }
        savedSavingAccounts.push(savedResult.value);
      });

      return ok(savedSavingAccounts);
    } catch (error) {
      return err(new Error("An error occured when saving all savingAccounts"))
    }
  }

  async findById(id: string): Promise<Result<SavingAccount, Error>> {
    try {
      const row = await this.db.select().from(savingAccounts).where(eq(savingAccounts.id, id)).limit(1);
      if (!row || row.length === 0) {
        return err(new SavingBankAccountNotFoundError(id));
      }
      const savingAccountToDomain = this.savingAccountMapper.toDomain(row[0]);
      return ok(savingAccountToDomain);
    } catch (e: any) {
      return err(new Error(`Could not find saving by id: ${e.message}`));
    }
  }

  async findByAccountIds(accountIds: string[]): Promise<Result<SavingAccount[], Error>> {
    try {
      if (accountIds.length === 0) {
        return ok([]);
      }
      const rows = await this.db.select().from(savingAccounts).where(inArray(savingAccounts.id, accountIds));
      const savingAccountsToDomain = rows.map((row) => {
        return this.savingAccountMapper.toDomain(row);
      })
      return ok(savingAccountsToDomain);
    } catch (e: any) {
      return err(new Error(`Could not find saving by account ids: ${e.message}`));
    }
  }

  async all(): Promise<Result<SavingAccount[], Error>> {
    try {
      const rows = await this.db.select().from(savingAccounts);
      const savingAccountsToDomain = rows.map((row) => {
        return this.savingAccountMapper.toDomain(row);
      })
      return ok(savingAccountsToDomain);
    } catch (e: any) {
      return err(new Error(`Could not find all saving: ${e.message}`));
    }
  }

  async updateBalance(id: string, newBalance: number): Promise<Result<number, Error>> {
    try {
      const now = new Date().toISOString();
      await this.db.update(savingAccounts).set({ 
        balance: newBalance,
        updatedAt: now 
      }).where(eq(savingAccounts.id, id));
      return ok(newBalance);
    } catch (e: any) {
      return err(new Error(`Could not update saving balance: ${e.message}`));
    }
  }
}


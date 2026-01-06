import { BankAccountRepository } from '../../../application/ports/repositories/BankAccountRepository';
import { BankAccount } from '../../../domain/entities/BankAccount';
import { BankAccountNotFoundError } from '../../../domain/errors/BankAccountNotFoundError';
import { UnexpectedBankAccountError } from '../../../domain/errors/UnexpectedBankAccountError';
import { ok, err, Result } from '../../../shared/Result';
import { DrizzleClient } from '../../drizzle/client';
import { bankAccounts, users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { DrizzleBankAccountMapper } from '../mappers/DrizzleMappers/DrizzleBankAccountMapper';

export class BankAccountRepositoryDrizzle implements BankAccountRepository {
  constructor(
    private readonly db: DrizzleClient,
    private readonly bankAccountMapper: DrizzleBankAccountMapper
  ) {}

  async save(account: BankAccount): Promise<Result<BankAccount, Error>> {
    try {
      const bankAccountToPersist = this.bankAccountMapper.toPersistence(account)
      const registerdBankAccounts = await this.db.insert(bankAccounts).values(bankAccountToPersist).returning();
      const bankAccountToDomain = this.bankAccountMapper.toDomain(registerdBankAccounts[0]);
      return ok(bankAccountToDomain);
    } catch (e: any) {
      return err(e);
    }
  }

  async getSystemBankAccount(): Promise<Result<BankAccount, Error>> {
    try{
      const systemUserWithClient = await this.db.query.users.findFirst({
        where: eq(users.email, "sys@example.com"),
        with: { clientProfile: true}
      });

      if(!systemUserWithClient){
        return err(new Error("System account not found."))
      }

      const systemClient = systemUserWithClient.clientProfile

      const systemBankAccount = await this.db.select().from(bankAccounts).where(eq(bankAccounts.ownerId, systemClient.id));
      const toDomain = this.bankAccountMapper.toDomain(systemBankAccount[0]);
      return ok(toDomain);
    } catch (error){
      return err(new BankAccountNotFoundError("system bank account"))
    }
  }

  async findDefaultAccountByClientId(clientIdentifier: string): Promise<Result<BankAccount, BankAccountNotFoundError | UnexpectedBankAccountError>> {
    try {
      const rows = await this.db.select().from(bankAccounts).where(eq(bankAccounts.ownerId, clientIdentifier)).limit(1);
      if (!rows.length) return err(new BankAccountNotFoundError(`for client: ${clientIdentifier}`));
      const bankAccountToDomain = this.bankAccountMapper.toDomain(rows[0])
      return ok(bankAccountToDomain);
    } catch (e: any) {
      return err(e);
    }
  }

  async findById(bankAccountIdentifier: string): Promise<Result<BankAccount, BankAccountNotFoundError>> {
    try {
      const rows = await this.db.select().from(bankAccounts).where(eq(bankAccounts.id, bankAccountIdentifier)).limit(1);
      if (!rows.length) return err(new BankAccountNotFoundError(bankAccountIdentifier));
      const bankAccountToDomain = this.bankAccountMapper.toDomain(rows[0]);
      return ok(bankAccountToDomain);
    } catch (e: any) {
      return err(e);
    }
  }

  async findByIban(iban: string): Promise<Result<BankAccount, Error>> {
    try {
      // Normalize IBAN by removing spaces for comparison
      const normalizedSearchIban = iban.replace(/\s/g, '');
      
      // Get all accounts and filter by normalized IBAN
      const allRows = await this.db.select().from(bankAccounts);
      const matchingRow = allRows.find(row => row.iban.replace(/\s/g, '') === normalizedSearchIban);
      
      if (!matchingRow) return err(new Error('BankAccount not found'));
      const bankAccountToDomain = this.bankAccountMapper.toDomain(matchingRow);
      return ok(bankAccountToDomain);
    } catch (e: any) {
      return err(e);
    }
  }

  async findByOwner(clientIdentifier: string): Promise<Result<BankAccount[], Error>> {
    try {
      const rows = await this.db.select().from(bankAccounts).where(eq(bankAccounts.ownerId, clientIdentifier));
      const bankAccountsToDomain = rows.map((row) => {
        return this.bankAccountMapper.toDomain(row);
      })

      return ok(bankAccountsToDomain);
    } catch (e: any) {
      return err(e);
    }
  }

  async all(): Promise<Result<BankAccount[], Error>> {
    try {
      const rows = await this.db.select().from(bankAccounts);
      const bankAccountsToDomain = rows.map((row) => {
        return this.bankAccountMapper.toDomain(row);
      })

      return ok(bankAccountsToDomain);
    } catch (e: any) {
      return err(e);
    }
  }

  async updateBalance(bankAccountIdentifier: string, newBalance: number): Promise<Result<number, Error>> {
    try {
      const updatedBankAccounts = await this.db.update(bankAccounts).set({ balance: newBalance }).where(eq(bankAccounts.id, bankAccountIdentifier)).returning();
      const updatedToDomain = this.bankAccountMapper.toDomain(updatedBankAccounts[0])
      return ok(updatedToDomain.balance);
    } catch (e: any) {
      return err(e);
    }
  }

  async rename(bankAccountIdentifier: string, newName: string): Promise<Result<BankAccount, Error>> {
    try {
      const now = new Date().toISOString();
      const updatedBankAccounts = await this.db.update(bankAccounts).set({ name: newName, updatedAt: now }).where(eq(bankAccounts.id, bankAccountIdentifier)).returning();
       const updatedToDomain = this.bankAccountMapper.toDomain(updatedBankAccounts[0])
      return ok(updatedToDomain)
    } catch (e: any) {
      return err(e);
    }
  }

  async remove(accountIdentifier: string): Promise<Result<true, BankAccountNotFoundError | UnexpectedBankAccountError>> {
    try{
      const deleteResult = await this.delete(accountIdentifier);
      if (!deleteResult.ok) {
        return err(new UnexpectedBankAccountError(`Could not remove account: ${deleteResult.error.message}`));
      }
      return ok(true);
    } catch (e: any){
      return err(e);
    }
  }

  async delete(accountIdentifier: string): Promise<Result<boolean, Error>> {
    try {
      await this.db.delete(bankAccounts).where(eq(bankAccounts.id, accountIdentifier));
      return ok(true);
    } catch (e: any) {
      return err(new Error(`Could not delete bank account: ${e.message}`));
    }
  }
}

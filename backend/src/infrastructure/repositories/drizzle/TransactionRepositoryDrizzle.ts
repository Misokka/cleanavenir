import { TransactionRepository } from '../../../application/ports/repositories/TransactionRepository';
import { Transaction } from '../../../domain/entities/Transaction';
import { ok, err, Result } from '../../../shared/Result';
import { DrizzleClient } from '../../drizzle/client';
import { transactions } from '../../drizzle/schema';
import { eq, or, desc, inArray, gte, lte, and } from 'drizzle-orm';
import { DrizzleTransactionMapper } from '../mappers/DrizzleMappers/DrizzleTransactionMapper';
import { TransactionNotFoundError } from '../../../domain/errors/TransactionNotFoundError';

export class TransactionRepositoryDrizzle implements TransactionRepository {
  constructor(
    private readonly db: DrizzleClient,
    private readonly transactionMapper: DrizzleTransactionMapper
  ) {}

  async save(transaction: Transaction): Promise<Result<Transaction, Error>> {
    try {
      const transactionToPersist = this.transactionMapper.toPersistence(transaction)
      const registeredTransactions = await this.db.insert(transactions).values(transactionToPersist).returning();
      const transactionToDomain = this.transactionMapper.toDomain(registeredTransactions[0])
      return ok(transactionToDomain);
    } catch (e: any) {
      return err(e);
    }
  }

  async saveAll(transactions: Transaction[]): Promise<Result<boolean, Error>> {
    try{
      transactions.forEach(async (transaction) => {
        const saveTransactionResult = await this.save(transaction);
        if(!saveTransactionResult.ok){
          return err(new Error(`An error occured when saving transaction ${transaction.transactionIdentifier}`))
        }
      });

      return ok(true);
    } catch (error) {
      return err(new Error("An error occured when saving all transactions at onece."))
    }
  }

  async findById(transactionIdentifier: string): Promise<Result<Transaction, TransactionNotFoundError>> {
    try{
      const transactionsRows = await this.db.select().from(transactions).where(eq(transactions.id, transactionIdentifier));
      if(!transactionsRows.length){
        return err(new TransactionNotFoundError(transactionIdentifier));
      }

      const transactioToDomain = this.transactionMapper.toDomain(transactionsRows[0]);
      return ok(transactioToDomain);
    } catch (error) {
      return err(new Error(`An error happened when retrieving transaction ${transactionIdentifier}`))
    }
  }

  async listByAccountId(params: { accountId: string; limit?: number; offset?: number; }): Promise<Result<Transaction[], Error>> {
    try{
      const {accountId, limit, offset} = params;

      const accountTransactionsRows = await this.db
        .select()
        .from(transactions)
        .where(eq(transactions.accountId, accountId))
        .limit(limit ?? 10)
        .offset(offset ?? 0);
      
      const accountTransactionsToDomain = accountTransactionsRows.map((row) => {
        return this.transactionMapper.toDomain(row);
      });

      return ok(accountTransactionsToDomain);
    } catch (error) {
      return err(new Error(`An error occured when retrieving transactions from account: ${params.accountId}`))
    }
  }

  async all(): Promise<Result<Transaction[], Error>> {
    try{
      const allTransactionsRows = await this.db.select().from(transactions);
      const transactionsToDomain = allTransactionsRows.map((row) => {
        return this.transactionMapper.toDomain(row);
      });

      return ok(transactionsToDomain);
    } catch (error) {
      return err(new Error("An error occured when retrieving all transactions"))
    }
  }

  async listForAccount(accountId: string): Promise<Result<Transaction[], Error>> {
    try {
      const rows = await this.db
        .select()
        .from(transactions)
        .where(eq(transactions.accountId, accountId))
        .orderBy(desc(transactions.createdAt));

      const transactionsToDomain = rows.map((row) => {
        return this.transactionMapper.toDomain(row)
      })
      return ok(transactionsToDomain);
    } catch (e: any) {
      return err(e);
    }
  }

  async listRecentForUser(accountIds: string[], limit: number): Promise<Result<Transaction[], Error>> {
    try {
      const rows = await this.db
        .select()
        .from(transactions)
        .where(inArray(transactions.accountId, accountIds))
        .orderBy(desc(transactions.createdAt))
        .limit(limit);
      const transactionsToDomain = rows.map((row) => {
        return this.transactionMapper.toDomain(row)
      })
      return ok(transactionsToDomain);
    } catch (e: any) {
      return err(e);
    }
  }

  async listWithFilters(
    accountIds: string[],
    filters: {
      type?: string[];
      dateFrom?: string;
      dateTo?: string;
      amountMin?: number;
      amountMax?: number;
      accountId?: string;
    }
  ): Promise<Result<Transaction[], Error>> {
    try {
      const conditions: any[] = [
        inArray(transactions.accountId, accountIds)
      ];

      if (filters.type && filters.type.length > 0) {
        conditions.push(inArray(transactions.type, filters.type));
      }

      if (filters.dateFrom) {
        conditions.push(gte(transactions.createdAt, filters.dateFrom));
      }
      if (filters.dateTo) {
        conditions.push(lte(transactions.createdAt, filters.dateTo));
      }

      if (filters.amountMin !== undefined) {
        conditions.push(
          or(
            gte(transactions.amount, filters.amountMin),
            lte(transactions.amount, -filters.amountMin)
          )
        );
      }
      if (filters.amountMax !== undefined) {
        conditions.push(
          or(
            lte(transactions.amount, filters.amountMax),
            gte(transactions.amount, -filters.amountMax)
          )
        );
      }

      if (filters.accountId) {
        conditions.push(eq(transactions.accountId, filters.accountId));
      }

      const rows = await this.db
        .select()
        .from(transactions)
        .where(and(...conditions))
        .orderBy(desc(transactions.createdAt));

      const transactionsToDomain = rows.map((row) => {
        return this.transactionMapper.toDomain(row)
      })
      return ok(transactionsToDomain);
    } catch (e: any) {
      return err(e);
    }
  }
}


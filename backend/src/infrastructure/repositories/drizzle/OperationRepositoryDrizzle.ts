import { ok, err, Result } from '../../../shared/Result';
import { operations } from '../../drizzle/schema';
import { eq, or, desc, inArray, gte, lte, and } from 'drizzle-orm';

export class OperationRepositoryDrizzle {
  constructor(private readonly db: any) {}

  async save(op: {
    id: string;
    fromAccountId?: string | null;
    toAccountId?: string | null;
    amount: number;
    type: string;
    description?: string | null;
  }): Promise<Result<any, Error>> {
    try {
      const now = new Date().toISOString();
      await this.db.insert(operations).values({
        id: op.id,
        fromAccountId: op.fromAccountId ?? null,
        toAccountId: op.toAccountId ?? null,
        amount: op.amount,
        type: op.type,
        description: op.description ?? null,
        createdAt: now,
      });
      return ok(op);
    } catch (e: any) {
      return err(e);
    }
  }

  async listForAccount(accountId: string): Promise<Result<any[], Error>> {
    try {
      const rows = await this.db
        .select()
        .from(operations)
        .where(or(eq(operations.fromAccountId, accountId), eq(operations.toAccountId, accountId)))
        .orderBy(desc(operations.createdAt));
      return ok(rows);
    } catch (e: any) {
      return err(e);
    }
  }

  async listRecentForUser(accountIds: string[], limit: number): Promise<Result<any[], Error>> {
    try {
      const rows = await this.db
        .select()
        .from(operations)
        .where(
          or(
            inArray(operations.fromAccountId, accountIds),
            inArray(operations.toAccountId, accountIds)
          )
        )
        .orderBy(desc(operations.createdAt))
        .limit(limit);
      return ok(rows);
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
  ): Promise<Result<any[], Error>> {
    try {
      const conditions: any[] = [
        or(
          inArray(operations.fromAccountId, accountIds),
          inArray(operations.toAccountId, accountIds)
        )
      ];

      if (filters.type && filters.type.length > 0) {
        conditions.push(inArray(operations.type, filters.type));
      }

      if (filters.dateFrom) {
        conditions.push(gte(operations.createdAt, filters.dateFrom));
      }
      if (filters.dateTo) {
        conditions.push(lte(operations.createdAt, filters.dateTo));
      }

      if (filters.amountMin !== undefined) {
        conditions.push(
          or(
            gte(operations.amount, filters.amountMin),
            lte(operations.amount, -filters.amountMin)
          )
        );
      }
      if (filters.amountMax !== undefined) {
        conditions.push(
          or(
            lte(operations.amount, filters.amountMax),
            gte(operations.amount, -filters.amountMax)
          )
        );
      }

      if (filters.accountId) {
        conditions.push(
          or(
            eq(operations.fromAccountId, filters.accountId),
            eq(operations.toAccountId, filters.accountId)
          )
        );
      }

      const rows = await this.db
        .select()
        .from(operations)
        .where(and(...conditions))
        .orderBy(desc(operations.createdAt));

      return ok(rows);
    } catch (e: any) {
      return err(e);
    }
  }
}


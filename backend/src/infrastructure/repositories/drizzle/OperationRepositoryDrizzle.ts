import { ok, err, Result } from '../../../shared/Result';
import { operations } from '../../drizzle/schema';
import { eq, or, desc, inArray } from 'drizzle-orm';

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
}


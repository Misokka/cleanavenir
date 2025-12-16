import { eq } from 'drizzle-orm';
import { loans } from '../../drizzle/schema';
import { ok, err } from '../../../shared/Result';
import type { LoanRepository } from '../../../application/ports/repositories/LoanRepository';
import { DrizzleClient } from '../../drizzle/client';

export class LoanRepositoryDrizzle implements LoanRepository {
  constructor(private db: DrizzleClient) {}

  async save(loan: any) {
    try {
      await this.db.insert(loans).values(loan);
      return ok(loan);
    } catch (e: any) {
      return err(new Error(`Could not insert loan: ${e.message}`));
    }
  }

  async findById(id: string) {
    try {
      const row = await this.db.select().from(loans).where(eq(loans.id, id)).limit(1);
      if (!row?.[0]) return err(new Error('Loan not found'));
      return ok(row[0] as any);
    } catch (e: any) {
      return err(new Error(`Could not find loan by id: ${e.message}`));
    }
  }

  async findAllByUserId(userId: string) {
    try {
      const rows = await this.db.select().from(loans).where(eq(loans.clientId, userId));
      return ok(rows as any);
    } catch (e: any) {
      return err(new Error(`Could not list loans: ${e.message}`));
    }
  }

  findActiveLoansDueOn(date: Date): Promise<Result<Loan[], Error>> {
    
  }

  all(): Promise<Result<Loan[], Error>> {
    
  }

  delete(loanIdentifier: string): Promise<Result<string, LoanNotFoundError>> {
    
  }
}

import { eq } from 'drizzle-orm';
import { loans } from '../../drizzle/schema';
import { ok, err } from '../../../shared/Result';

export class LoanRepositoryDrizzle {
  constructor(private db: any) {}

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
      return ok(row?.[0] ?? null);
    } catch (e: any) {
      return err(new Error(`Could not find loan by id: ${e.message}`));
    }
  }
}

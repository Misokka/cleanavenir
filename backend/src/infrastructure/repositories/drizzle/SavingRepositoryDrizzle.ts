import { eq } from 'drizzle-orm';
import { savings } from '../../drizzle/schema';
import { ok, err } from '../../../shared/Result';

export class SavingRepositoryDrizzle {
  constructor(private db: any) {}

  async save(saving: any) {
    try {
      await this.db.insert(savings).values(saving);
      return ok(saving);
    } catch (e: any) {
      return err(new Error(`Could not insert saving: ${e.message}`));
    }
  }

  async findById(id: string) {
    try {
      const row = await this.db.select().from(savings).where(eq(savings.id, id)).limit(1);
      return ok(row?.[0] ?? null);
    } catch (e: any) {
      return err(new Error(`Could not find saving by id: ${e.message}`));
    }
  }
}

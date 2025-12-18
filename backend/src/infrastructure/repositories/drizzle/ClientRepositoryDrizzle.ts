import { eq } from 'drizzle-orm';
import { ok, err, Result } from '../../../shared/Result';
import { Client } from '../../../domain/entities/Client';
import { ClientRepository } from '../../../application/ports/repositories/ClientRepository';
import { InvalidRoleError } from '../../../domain/errors/InvalidRoleError';
import { UserNotFoundError } from '../../../domain/errors/UserNotFoundError';
import { clients } from '../../drizzle/schema';
import { DrizzleClient } from '../../drizzle/client';
import { DrizzleClientMapper } from '../mappers/DrizzleMappers/DrizzleClientMapper';

export class ClientRepositoryDrizzle implements ClientRepository {
  constructor(
    private readonly db: DrizzleClient,
    private readonly clientMapper: DrizzleClientMapper
  ) {}

  async save(client: Client): Promise<Result<Client, InvalidRoleError>> {
    try {
      const clientToPersist = this.clientMapper.toPersistence(client);
      const clientRows = await this.db.insert(clients).values(clientToPersist).returning();
      const clientToDomain = this.clientMapper.toDomain(clientRows[0]);

      return ok(clientToDomain);
    } catch (e: any) {
      return err(new InvalidRoleError(client.userIdentifier));
    }
  }

  async findById(clientIdentifier: string): Promise<Result<Client, UserNotFoundError>> {
    try {
      const clientRows = await this.db
        .select()
        .from(clients)
        .where(eq(clients.id, clientIdentifier))
        .limit(1);

      if (!clientRows.length) {
        return err(new UserNotFoundError(clientIdentifier));
      }

      const clientToDomain = this.clientMapper.toDomain(clientRows[0]);

      return ok(clientToDomain);
    } catch (e: any) {
      return err(new UserNotFoundError(clientIdentifier));
    }
  }

  async all(): Promise<Result<Client[], Error>> {
    try {
      const rows = await this.db.select().from(clients);
      const clientsToDomain = rows.map((row) => {
        return this.clientMapper.toDomain(row);
      })

      return ok(clientsToDomain);
    } catch (e: any) {
      return err(e);
    }
  }
}

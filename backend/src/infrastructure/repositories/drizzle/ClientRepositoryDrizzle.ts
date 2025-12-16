import { eq } from 'drizzle-orm';
import { ok, err, Result } from '../../../shared/Result';
import { Client } from '../../../domain/entities/Client';
import { ClientRepository } from '../../../application/ports/repositories/ClientRepository';
import { InvalidRoleError } from '../../../domain/errors/InvalidRoleError';
import { UserNotFoundError } from '../../../domain/errors/UserNotFoundError';
import { users } from '../../drizzle/schema';
import { DrizzleClient } from '../../drizzle/client';

export class ClientRepositoryDrizzle implements ClientRepository {
  constructor(private readonly db: DrizzleClient) {}

  async save(client: Client): Promise<Result<Client, InvalidRoleError>> {
    try {
      const userRow = await this.db
        .select()
        .from(users)
        .where(eq(users.id, client.userIdentifier))
        .limit(1);

      if (!userRow.length || userRow[0].role !== 'CLIENT') {
        return err(new InvalidRoleError(client.userIdentifier));
      }

      return ok(client);
    } catch (e: any) {
      return err(new InvalidRoleError(client.userIdentifier));
    }
  }

  async findById(userIdentifier: string): Promise<Result<Client, UserNotFoundError>> {
    try {
      const userRow = await this.db
        .select()
        .from(users)
        .where(eq(users.id, userIdentifier))
        .limit(1);

      if (!userRow.length || userRow[0].role !== 'CLIENT') {
        return err(new UserNotFoundError(userIdentifier));
      }

      const client = Client.create({
        clientIdentifier: userRow[0].id,
        userIdentifier
      });
      return ok(client);
    } catch (e: any) {
      return err(new UserNotFoundError(userIdentifier));
    }
  }
}

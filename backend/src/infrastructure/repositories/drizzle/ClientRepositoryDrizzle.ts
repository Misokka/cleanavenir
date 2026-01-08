import { eq } from 'drizzle-orm';
import { ok, err, Result } from '../../../shared/Result';
import { Client } from '../../../domain/entities/Client';
import { ClientRepository } from '../../../application/ports/repositories/ClientRepository';
import { InvalidRoleError } from '../../../domain/errors/InvalidRoleError';
import { UserNotFoundError } from '../../../domain/errors/UserNotFoundError';
import { clients } from '../../drizzle/schema';
import { DrizzleClient } from '../../drizzle/client';
import { DrizzleClientMapper } from '../mappers/DrizzleMappers/DrizzleClientMapper';
import { ClientNotFoundError } from '../../../domain/errors/ClientNotFoundError';

export class ClientRepositoryDrizzle implements ClientRepository {
  constructor(
    private readonly db: DrizzleClient,
    private readonly clientMapper: DrizzleClientMapper
  ) {}

  async save(client: Client): Promise<Result<Client, Error>> {
    try {
      const clientToPersist = this.clientMapper.toPersistence(client);
      const clientRows = await this.db.insert(clients).values(clientToPersist).returning();
      const clientToDomain = this.clientMapper.toDomain(clientRows[0]);

      return ok(clientToDomain);
    } catch (e: any) {
      return err(new Error(`An error occured when saving user: ${e}`));
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

  async findByUserId(userIdentifier: string): Promise<Result<Client, ClientNotFoundError>> {
    try{
      const clientRows = await this.db.select().from(clients).where(eq(clients.userId, userIdentifier));
      if(!clientRows.length){
        return err(new ClientNotFoundError('No client account is linked to this user.'))
      }

      const clientToDomain = this.clientMapper.toDomain(clientRows[0]);
      return ok(clientToDomain);
    } catch {
      return err(new Error(`An error occured when retrieving client linked to user: ${userIdentifier}`))
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

  async getSystemClient(systemUserIdentifier: string): Promise<Result<Client, Error>> {
    try{
      const rows = await this.db.select().from(clients).where(eq(clients.userId, systemUserIdentifier));
      const toDomain = this.clientMapper.toDomain(rows[0]);
      return ok(toDomain);
    } catch (error) {
      return err(new Error("System client account not found."))
    }
  }

  async delete(clientIdentifier: string): Promise<Result<void, ClientNotFoundError | Error>> {
    try {
      const result = await this.db.delete(clients).where(eq(clients.id, clientIdentifier)).returning();
      
      if (!result.length) {
        return err(new ClientNotFoundError(clientIdentifier));
      }
      
      return ok(undefined);
    } catch (e: any) {
      console.error('Error deleting client:', e);
      return err(new Error(e.message || 'Failed to delete client'));
    }
  }

  async updateAdvisor(clientIdentifier: string, advisorIdentifier: string): Promise<Result<Client, ClientNotFoundError>> {
    try {
      const result = await this.db
        .update(clients)
        .set({ advisorId: advisorIdentifier })
        .where(eq(clients.id, clientIdentifier))
        .returning();

      if (!result.length) {
        return err(new ClientNotFoundError(clientIdentifier));
      }

      const clientToDomain = this.clientMapper.toDomain(result[0]);
      return ok(clientToDomain);
    } catch (e: any) {
      console.error('Error updating client advisor:', e);
      return err(new ClientNotFoundError(clientIdentifier));
    }
  }
}

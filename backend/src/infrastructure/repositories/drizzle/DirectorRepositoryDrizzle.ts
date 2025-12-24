import { eq } from 'drizzle-orm';
import { ok, err, Result } from '../../../shared/Result';
import { Director } from '../../../domain/entities/Director';
import { DirectorRepository } from '../../../application/ports/repositories/DirectorRepository';
import { InvalidRoleError } from '../../../domain/errors/InvalidRoleError';
import { UserNotFoundError } from '../../../domain/errors/UserNotFoundError';
import { directors } from '../../drizzle/schema';
import { DrizzleClient } from '../../drizzle/client';
import { DrizzleDirectorMapper } from '../mappers/DrizzleMappers/DrizzleDirectorMapper';
import { DirectorNotFoundError } from '../../../domain/errors/DirectorNotFoundError';

export class DirectorRepositoryDrizzle implements DirectorRepository {
  constructor(
    private readonly db: DrizzleClient,
    private readonly directorMapper: DrizzleDirectorMapper
  ) {}

  async save(director: Director): Promise<Result<Director, InvalidRoleError>> {
    try {
      const directorToPersist = this.directorMapper.toPersistence(director);
      const registeredDirectors = await this.db.insert(directors).values(directorToPersist).returning();
      const directorToDomain = this.directorMapper.toDomain(registeredDirectors[0])

      return ok(directorToDomain);
    } catch (e: any) {
      return err(new InvalidRoleError(director.userIdentifier));
    }
  }

  async findById(directorIdentifier: string): Promise<Result<Director, UserNotFoundError>> {
    try {
      const directorRows = await this.db
        .select()
        .from(directors)
        .where(eq(directors.id, directorIdentifier))
        .limit(1);
      
      const directorToDomain = this.directorMapper.toDomain(directorRows[0]);
      return ok(directorToDomain);
    } catch (e: any) {
      return err(new UserNotFoundError(directorIdentifier));
    }
  }

  async findByUserId(userIdentifier: string): Promise<Result<Director, DirectorNotFoundError>> {
      try{
        const directorRows = await this.db.select().from(directors).where(eq(directors.userId, userIdentifier));
        if(!directorRows.length){
          return err(new DirectorNotFoundError('No director account is linked to this user.'))
        }
  
        const directorToDomain = this.directorMapper.toDomain(directorRows[0]);
        return ok(directorToDomain);
      } catch {
        return err(new Error(`An error occured when retrieving director linked to user: ${userIdentifier}`))
      }
    }
}

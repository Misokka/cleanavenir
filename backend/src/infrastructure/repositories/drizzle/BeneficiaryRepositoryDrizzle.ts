import { BeneficiaryRepository } from '../../../application/ports/repositories/BeneficiaryRepository';
import { Beneficiary } from '../../../domain/entities/Beneficiary';
import { BeneficiaryNotFoundError } from '../../../domain/errors/BeneficiaryNotFoundError';
import { UnexpectedBeneficiaryError } from '../../../domain/errors/UnexpectedBeneficiaryError';
import { ok, err, Result } from '../../../shared/Result';
import { DrizzleClient } from '../../drizzle/client';
import { beneficiaries } from '../../drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { DrizzleBeneficiaryMapper } from '../mappers/DrizzleMappers/DrizzleBeneficiaryMapper';

export class BeneficiaryRepositoryDrizzle implements BeneficiaryRepository {
  constructor(
    private readonly db: DrizzleClient,
    private readonly beneficiaryMapper: DrizzleBeneficiaryMapper
  ) {}

  async save(beneficiary: Beneficiary): Promise<Result<Beneficiary, Error>> {
    try {
      const beneficiaryToPersist = this.beneficiaryMapper.toPersistence(beneficiary);
      const rows = await this.db.insert(beneficiaries).values(beneficiaryToPersist).returning();
      const beneficiaryToDomain = this.beneficiaryMapper.toDomain(rows[0]);
      return ok(beneficiaryToDomain);
    } catch (e: any) {
      return err(new UnexpectedBeneficiaryError('Failed to save beneficiary', e));
    }
  }

  async findById(beneficiaryIdentifier: string): Promise<Result<Beneficiary, BeneficiaryNotFoundError | UnexpectedBeneficiaryError>> {
    try {
      const rows = await this.db
        .select()
        .from(beneficiaries)
        .where(eq(beneficiaries.id, beneficiaryIdentifier))
        .limit(1);
      
      if (!rows.length) {
        return err(new BeneficiaryNotFoundError(beneficiaryIdentifier));
      }
      
      const beneficiaryToDomain = this.beneficiaryMapper.toDomain(rows[0]);
      return ok(beneficiaryToDomain);
    } catch (e: any) {
      return err(new UnexpectedBeneficiaryError('Failed to find beneficiary by id', e));
    }
  }

  async findByClientIdentifier(clientIdentifier: string): Promise<Result<Beneficiary[], UnexpectedBeneficiaryError>> {
    try {
      const rows = await this.db
        .select()
        .from(beneficiaries)
        .where(eq(beneficiaries.clientId, clientIdentifier));
      
      const beneficiariesToDomain = rows.map((row) => this.beneficiaryMapper.toDomain(row));
      return ok(beneficiariesToDomain);
    } catch (e: any) {
      return err(new UnexpectedBeneficiaryError('Failed to find beneficiaries by client', e));
    }
  }

  async findByClientAndIban(clientIdentifier: string, iban: string): Promise<Result<Beneficiary | null, UnexpectedBeneficiaryError>> {
    try {
      const rows = await this.db
        .select()
        .from(beneficiaries)
        .where(and(eq(beneficiaries.clientId, clientIdentifier), eq(beneficiaries.iban, iban)))
        .limit(1);
      
      if (!rows.length) {
        return ok(null);
      }
      
      const beneficiaryToDomain = this.beneficiaryMapper.toDomain(rows[0]);
      return ok(beneficiaryToDomain);
    } catch (e: any) {
      return err(new UnexpectedBeneficiaryError('Failed to find beneficiary by client and IBAN', e));
    }
  }

  async delete(beneficiaryIdentifier: string): Promise<Result<true, BeneficiaryNotFoundError | UnexpectedBeneficiaryError>> {
    try {
      const result = await this.db
        .delete(beneficiaries)
        .where(eq(beneficiaries.id, beneficiaryIdentifier))
        .returning();
      
      if (!result.length) {
        return err(new BeneficiaryNotFoundError(beneficiaryIdentifier));
      }
      
      return ok(true);
    } catch (e: any) {
      return err(new UnexpectedBeneficiaryError('Failed to delete beneficiary', e));
    }
  }

  async updateLabel(beneficiaryIdentifier: string, label: string): Promise<Result<Beneficiary, BeneficiaryNotFoundError | UnexpectedBeneficiaryError>> {
    try {
      const rows = await this.db
        .update(beneficiaries)
        .set({ label })
        .where(eq(beneficiaries.id, beneficiaryIdentifier))
        .returning();
      
      if (!rows.length) {
        return err(new BeneficiaryNotFoundError(beneficiaryIdentifier));
      }
      
      const beneficiaryToDomain = this.beneficiaryMapper.toDomain(rows[0]);
      return ok(beneficiaryToDomain);
    } catch (e: any) {
      return err(new UnexpectedBeneficiaryError('Failed to update beneficiary label', e));
    }
  }
}

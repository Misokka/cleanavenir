import { eq } from "drizzle-orm";
import { CompanyRepository } from "../../../application/ports/repositories/CompanyRepository";
import { Company } from "../../../domain/entities/Company";
import { CouldNotCreateCompanyError } from "../../../domain/errors/CouldNotCreateCompanyError";
import Result, { err, ok } from "../../../shared/Result";
import { DrizzleClient } from "../../drizzle/client";
import { companies } from "../../drizzle/schema";
import { DrizzleCompanyMapper } from "../mappers/DrizzleMappers/DrizzleCompanyMapper";
import { CompanyNotFoundError } from "../../../domain/errors/CompanyNotFoundError";

export class CompanyRepositoryDrizzle implements CompanyRepository {
  constructor(
    private readonly db: DrizzleClient,
    private readonly companyMapper: DrizzleCompanyMapper
  ){}

  async save(company: Company): Promise<Result<Company, CouldNotCreateCompanyError>> {
    const companyToPersist = this.companyMapper.toPersistence(company);

    try{
      const insertedCompany = await this.db.insert(companies).values(companyToPersist).returning();
      const companyToDomain = this.companyMapper.toDomain(insertedCompany[0]);
      return ok(companyToDomain);
    } catch (e: any) {
      return err(new CouldNotCreateCompanyError(e.message));
    }
  }

  async findById(companyIdentifier: string): Promise<Result<Company, CompanyNotFoundError>> {
    const company = await this.db.select().from(companies).where(eq(companies.id, companyIdentifier));

    if (company.length === 0) {
      return err(new CompanyNotFoundError(companyIdentifier));
    }

    return ok(this.companyMapper.toDomain(company[0]));
  }

  async all(): Promise<Result<Company[], Error>> {
    try{
      const dbCompanies = await this.db.select().from(companies);
      const companiesToDomain = dbCompanies.map(company => this.companyMapper.toDomain(company));
      return ok(companiesToDomain);
    } catch (e: any) {
      return err(new Error(e.message));
    }
  }
}
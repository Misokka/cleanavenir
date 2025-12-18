import { CompanyRepository } from "../../../application/ports/repositories/CompanyRepository";
import { Company } from "../../../domain/entities/Company";
import { CouldNotCreateCompanyError } from "../../../domain/errors/CouldNotCreateCompanyError";
import Result from "../../../shared/Result";
import { DrizzleClient } from "../../drizzle/client";
import { DrizzleCompanyMapper } from "../mappers/DrizzleMappers/DrizzleCompanyMapper";

export class CompanyRepositoryDrizzle implements CompanyRepository {
  constructor(
    private readonly db: DrizzleClient,
    private readonly companyMapper: DrizzleCompanyMapper
  ){}

  async save(company: Company): Promise<Result<Company, CouldNotCreateCompanyError>> {
    
  }

  async findById(): Promise<Result<Company, CompanyNotFoundError>> {
    
  }

  async all(): Promise<Result<Company, CompanyNotFoundError>> {
    
  }
}
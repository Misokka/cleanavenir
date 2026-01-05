import { Company } from "../../../domain/entities/Company";
import { CompanyNotFoundError } from "../../../domain/errors/CompanyNotFoundError";
import { CouldNotCreateCompanyError } from "../../../domain/errors/CouldNotCreateCompanyError";
import { Result } from "../../../shared/Result";

export interface CompanyRepository{
  save(company: Company): Promise<Result<Company, CouldNotCreateCompanyError>>;
  findById(companyIdentifier: string): Promise<Result<Company, CompanyNotFoundError>>;
  all(): Promise<Result<Company[], Error>>;
  update(company: Company): Promise<Result<Company, Error>>;
  delete(companyIdentifier: string): Promise<Result<void, Error>>;
}
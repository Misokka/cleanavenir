import { Company } from "../../../domain/entities/Company";
import { CouldNotCreateCompanyError } from "../../../domain/errors/CouldNotCreateCompanyError";
import { Result } from "../../../shared/Result";

export interface CompanyRepository{
  save(company: Company): Promise<Result<Company, CouldNotCreateCompanyError>>
}
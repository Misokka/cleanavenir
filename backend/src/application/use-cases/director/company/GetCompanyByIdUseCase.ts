import { Company } from "../../../../domain/entities/Company";
import { CompanyRepository } from "../../../ports/repositories/CompanyRepository";
import Result, { err, ok } from "../../../../shared/Result";
import { CompanyNotFoundError } from "../../../../domain/errors/CompanyNotFoundError";

export class GetCompanyByIdUseCase {
  constructor(
    private readonly companyRepository: CompanyRepository
  ) {}

  public async execute(companyId: string): Promise<Result<Company, Error>> {
    const maybeCompany = await this.companyRepository.findById(companyId);

    if (!maybeCompany.ok) {
      return err(new CompanyNotFoundError(companyId));
    }

    return ok(maybeCompany.value);
  }
}

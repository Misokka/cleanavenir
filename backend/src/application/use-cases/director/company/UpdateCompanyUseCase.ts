import { Company } from "../../../../domain/entities/Company";
import { CompanyRepository } from "../../../ports/repositories/CompanyRepository";
import Result, { err, ok } from "../../../../shared/Result";
import { CompanyNotFoundError } from "../../../../domain/errors/CompanyNotFoundError";

export class UpdateCompanyUseCase {
  constructor(
    private readonly companyRepository: CompanyRepository
  ) {}

  public async execute(props: {
    companyId: string;
    name?: string;
    description?: string;
  }): Promise<Result<Company, Error>> {
    const maybeCompany = await this.companyRepository.findById(props.companyId);

    if (!maybeCompany.ok) {
      return err(new CompanyNotFoundError(props.companyId));
    }

    const company = maybeCompany.value;

    if (props.name !== undefined) {
      company.name = props.name;
    }
    if (props.description !== undefined) {
      company.description = props.description;
    }

    const updateResult = await this.companyRepository.update(company);

    if (!updateResult.ok) {
      return err(updateResult.error);
    }

    return ok(updateResult.value);
  }
}

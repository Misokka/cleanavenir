import { Company } from "../../../../domain/entities/Company";
import Result, { err, ok } from "../../../../shared/Result";
import { CompanyRepository } from "../../../ports/repositories/CompanyRepository";

export class ListCompaniesUseCase {
  constructor(private companyRepository: CompanyRepository) {}

  async execute(): Promise<Result<Company[], Error>> {
    const companiesResult = await this.companyRepository.all();
    if(!companiesResult.ok){
      return err(companiesResult.error);
    }

    return ok(companiesResult.value);
  }
}
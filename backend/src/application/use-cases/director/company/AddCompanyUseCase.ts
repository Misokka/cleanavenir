import { randomUUID } from "crypto";
import { Company } from "../../../../domain/entities/Company";
import { CompanyRepository } from "../../../ports/repositories/CompanyRepository";
import Result, { err, ok } from "../../../../shared/Result";
import { CouldNotCreateCompanyError } from "../../../../domain/errors/CouldNotCreateCompanyError";

export class AddCompanyUseCase{
  constructor(
    private readonly compoanyRepository: CompanyRepository
  ){}

  public async execute(name: string, description: string): Promise<Result<Company, Error>>{
    const companyIdentifier = randomUUID();
    const newCompany = Company.create({companyIdentifier, name, description});
    const maybeCompany = await this.compoanyRepository.save(newCompany);

    if(!maybeCompany.ok){
      return err(new CouldNotCreateCompanyError(`Couldn't create company ${companyIdentifier}`))
    }

    return ok(maybeCompany.value)
  }
}
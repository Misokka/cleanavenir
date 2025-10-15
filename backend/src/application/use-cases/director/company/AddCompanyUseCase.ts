import { randomUUID } from "crypto";
import { Company } from "../../../../domain/entities/Company";
import { CompanyRepository } from "../../../ports/repositories/CompanyRepository";
import { err, ok } from "../../../../shared/Result";
import { CouldNotCreateCompanyError } from "../../../../domain/errors/CouldNotCreateCompanyError";

export class AddCompanyUseCase{
  constructor(
    private readonly compoanyRepository: CompanyRepository
  ){}

  public async execute(name: string, description: string){
    const companyIdentifier = randomUUID();
    const newCompany = new Company(companyIdentifier, name, description);
    const maybeCompany = await this.compoanyRepository.save(newCompany);

    if(!maybeCompany.ok){
      return err(new CouldNotCreateCompanyError())
    }

    return ok(Company)
  }
}
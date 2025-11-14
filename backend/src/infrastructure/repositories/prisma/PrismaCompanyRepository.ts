import { PrismaClient } from "@prisma/client";
import { CompanyRepository } from "../../../application/ports/repositories/CompanyRepository";
import { Company } from "../../../domain/entities/Company";
import { CouldNotCreateCompanyError } from "../../../domain/errors/CouldNotCreateCompanyError";
import Result, { err, ok } from "../../../shared/Result";

export class PrismaCompanyRepository implements CompanyRepository {
  constructor(
    private readonly prismaClient: PrismaClient
  ){}

  async save(company: Company): Promise<Result<Company, CouldNotCreateCompanyError>> {
    try{
      const registeredCompany = await this.prismaClient.company.create({
        data: {
          companyIdentifier: company.companyIdentifier,
          name: company.name,
          description: company.description
        }
      });
  
      const newCompany = new Company(
        registeredCompany.companyIdentifier,
        registeredCompany.name,
        registeredCompany.description
      );
  
      return ok(newCompany);
    } catch (error){
      return err(new CouldNotCreateCompanyError());
    }
  }
}
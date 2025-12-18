import { PrismaClient } from "@prisma/client";
import { CompanyRepository } from "../../../application/ports/repositories/CompanyRepository";
import { Company } from "../../../domain/entities/Company";
import { CouldNotCreateCompanyError } from "../../../domain/errors/CouldNotCreateCompanyError";
import Result, { err, ok } from "../../../shared/Result";
import { PrismaCompanyMapper } from "../mappers/PrismaMappers/PrismaCompanyMapper";

export class PrismaCompanyRepository implements CompanyRepository {
  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly prismaCompanyMapper: PrismaCompanyMapper
  ){}

  async save(company: Company): Promise<Result<Company, CouldNotCreateCompanyError>> {
    try{
      const companyToPersistence = this.prismaCompanyMapper.toPersistence(company);
      const registeredCompany = await this.prismaClient.company.create({
        data: {
          ...companyToPersistence
        }
      });
  
      const companyToDomain = this.prismaCompanyMapper.toDomain(registeredCompany)
  
      return ok(companyToDomain);
    } catch (error){
      return err(new CouldNotCreateCompanyError());
    }
  }

  async findById(): Promise<Result<Company, CompanyNotFoundError>> {
    
  }

  async all(): Promise<Result<Company, CompanyNotFoundError>> {
    
  }
}
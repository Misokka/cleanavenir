import { PrismaClient } from "@prisma/client";
import { CompanyRepository } from "../../../application/ports/repositories/CompanyRepository";
import { Company } from "../../../domain/entities/Company";
import { CompanyNotFoundError } from "../../../domain/errors/CompanyNotFoundError";
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

  async findById(companyIdentifier: string): Promise<Result<Company, CompanyNotFoundError>> {
    try {
      const maybeCompany = await this.prismaClient.company.findUnique({
        where: { companyIdentifier }
      });

      if (!maybeCompany) {
        return err(new CompanyNotFoundError(companyIdentifier));
      }

      return ok(this.prismaCompanyMapper.toDomain(maybeCompany));
    } catch (error) {
      return err(new CompanyNotFoundError(companyIdentifier));
    }
  }

  async all(): Promise<Result<Company[], Error>> {
    try {
      const companies = await this.prismaClient.company.findMany();
      return ok(companies.map(c => this.prismaCompanyMapper.toDomain(c)));
    } catch (error: any) {
      return err(new Error(`Error fetching all companies: ${error.message}`));
    }
  }

  async update(company: Company): Promise<Result<Company, Error>> {
    try {
      const companyToPersist = this.prismaCompanyMapper.toPersistence(company);
      const updatedCompany = await this.prismaClient.company.update({
        where: { companyIdentifier: company.companyIdentifier },
        data: {
          name: companyToPersist.name,
          description: companyToPersist.description
        }
      });
      return ok(this.prismaCompanyMapper.toDomain(updatedCompany));
    } catch (error: any) {
      return err(new Error(`Error updating company: ${error.message}`));
    }
  }

  async delete(companyIdentifier: string): Promise<Result<void, Error>> {
    try {
      await this.prismaClient.company.delete({
        where: { companyIdentifier }
      });
      return ok(undefined);
    } catch (error: any) {
      return err(new Error(`Error deleting company: ${error.message}`));
    }
  }
}
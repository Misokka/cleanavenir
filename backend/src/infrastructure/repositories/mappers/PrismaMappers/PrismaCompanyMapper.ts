import { Mapper } from "../MapperInterface";
import { Company as PrismaCompany } from "@prisma/client";
import { Company } from "../../../../domain/entities/Company";

type CompanyToPersist = {
  companyIdentifier: string,
  name: string,
  description: string
}

export class PrismaCompanyMapper implements Mapper<PrismaCompany, Company, CompanyToPersist>{
  toDomain(raw: PrismaCompany): Company {
    return Company.create({
      ...raw
    })
  }

  toPersistence(obj: Company): CompanyToPersist {
    return {
      ...obj
    }
  }
}
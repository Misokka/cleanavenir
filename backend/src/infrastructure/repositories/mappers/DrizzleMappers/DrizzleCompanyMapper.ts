import { Company } from "../../../../domain/entities/Company";
import { CompanyDrizzle, NewCompanyDrizzle } from "../../../drizzle/schema";
import { Mapper } from "../MapperInterface";

export class DrizzleCompanyMapper implements Mapper<CompanyDrizzle, Company, NewCompanyDrizzle>{
  toDomain(raw: CompanyDrizzle): Company {
    return Company.create({
      ...raw,
      companyIdentifier: raw.id,
      
    })
  }

  toPersistence(obj: Company): NewCompanyDrizzle {
    return {
      ...obj,
      id: obj.companyIdentifier
    }
  }
}
import { Advisor } from "../../../../domain/entities/Advisor";
import { AdvisorDrizzle, NewAdvisorDrizzle } from "../../../drizzle/schema";
import { Mapper } from "../MapperInterface";

export class DrizzleAdvisorMapper implements Mapper<AdvisorDrizzle, Advisor, NewAdvisorDrizzle>{
  toDomain(raw: AdvisorDrizzle): Advisor {
    return Advisor.create({
      advisorIdentifier: raw.id,
      userIdentifier: raw.id,
    });
  }

  toPersistence(obj: Advisor): NewAdvisorDrizzle {
    return {
      id: obj.advisorIdentifier,
      userId: obj.userIdentifier,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }
}
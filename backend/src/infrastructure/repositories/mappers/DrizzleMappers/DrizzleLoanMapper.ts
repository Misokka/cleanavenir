import { Loan, LoanStatus } from "../../../../domain/entities/Loan";
import { LoanDrizzle, NewLoanDrizzle } from "../../../drizzle/schema";
import { Mapper } from "../MapperInterface";

export class DrizzleLoanMapper implements Mapper<LoanDrizzle, Loan, NewLoanDrizzle> {
  toDomain(raw: LoanDrizzle): Loan {
    return Loan.create({
      ...raw,
      loanIdentifier: raw.id,
      clientIdentifier: raw.clientId,
      advisorIdentifier: raw.advisorId,
      status: raw.status as LoanStatus | undefined,
      createdAt: new Date(raw.createdAt),
      lastPaidAt: new Date(raw.lastPaidAt as string),
      nextToPayAt: new Date(raw.nextToPayAt)
    });
  }

  toPersistence(entity: Loan): NewLoanDrizzle {
    return {
      ...entity,
      id: entity.loanIdentifier,
      clientId: entity.clientIdentifier,
      advisorId: entity.advisorIdentifier,
      createdAt: entity.createdAt.toISOString(),
      lastPaidAt: entity.lastPaidAt?.toISOString() || "",
      nextToPayAt: entity.nextToPayAt?.toISOString() || ""
    };
  }
}

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
      lastPaidAt: raw.lastPaidAt && raw.lastPaidAt !== "" ? new Date(raw.lastPaidAt) : undefined,
      nextToPayAt: raw.nextToPayAt && raw.nextToPayAt !== "" ? new Date(raw.nextToPayAt) : undefined
    });
  }

  toPersistence(entity: Loan): NewLoanDrizzle {
    const lastPaidAtValue = entity.lastPaidAt ? entity.lastPaidAt.toISOString() : null;
    
    const result: any = {
      id: entity.loanIdentifier,
      clientId: entity.clientIdentifier,
      advisorId: entity.advisorIdentifier,
      loanAmount: Math.round(entity.loanAmount),
      durationInMonth: Math.round(entity.durationInMonth),
      mensualities: Math.round(entity.mensualities),
      insuranceMensualities: Math.round(entity.insuranceMensualities),
      remainingAmountToPay: Math.round(entity.remainingAmountToPay),
      annualInterestRate: Math.round(entity.annualInterestRate),
      annualInsuranceRate: Math.round(entity.annualInsuranceRate),
      status: entity.status,
      createdAt: entity.createdAt.toISOString(),
      lastPaidAt: lastPaidAtValue,
      nextToPayAt: entity.nextToPayAt ? entity.nextToPayAt.toISOString() : ""
    };
    
    return result;
  }
}

import { Loan as PrismaLoan } from "@prisma/client";
import { Mapper } from "../MapperInterface";
import { Loan } from "../../../../domain/entities/Loan";

type LoanToPersist = {
    loanIdentifier: string,
    clientIdentifier : string,
    advisorIdentifier : string,
    loanAmount: number,
    durationInMonth: number,
    mensualities: number,
    insuranceMensualities: number,
    remainingAmountToPay: number,
    annualInterestRate: number,
    annualInsuranceRate: number,
    status: "ACTIVE" | "PAID_OFF",
    createdAt: Date,
    lastPaidAt?: Date,
    nextToPayAt?: Date,
}

export class PrismaLoanMapper implements Mapper<PrismaLoan, Loan, LoanToPersist> {
  toDomain(raw : PrismaLoan): Loan {
    return new Loan(
      raw.loanIdentifier,
      raw.clientIdentifier,
      raw.advisorIdentifier,
      raw.loanAmount,
      raw.durationInMonth,
      raw.mensualities,
      raw.insuranceMensualities,
      raw.remainingAmountToPay,
      raw.annualInterestRate,
      raw.annualInsuranceRate,
      raw.status,
      raw.createdAt,
      raw.lastPaidAt ?? undefined,
      raw.nextToPayAt ?? undefined,
    )
  }

  toPersistence(loan: Loan): LoanToPersist{
    return {
      ...loan
    }
  }
}
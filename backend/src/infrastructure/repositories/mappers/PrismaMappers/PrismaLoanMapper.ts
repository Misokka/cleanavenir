import { Loan as PrismaLoan } from "@prisma/client";
import { Mapper } from "../MapperInterface";
import { Loan, LoanStatus } from "../../../../domain/entities/Loan";

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
    status: LoanStatus,
    createdAt: Date,
    lastPaidAt?: Date,
    nextToPayAt?: Date,
}

export class PrismaLoanMapper implements Mapper<PrismaLoan, Loan, LoanToPersist> {
  toDomain(raw : PrismaLoan): Loan {
    return Loan.create({
      ...raw,
      lastPaidAt: raw.lastPaidAt as Date | undefined,
      nextToPayAt: raw.nextToPayAt as Date | undefined,
    })
  }

  toPersistence(loan: Loan): LoanToPersist{
    return {
      ...loan
    }
  }
}
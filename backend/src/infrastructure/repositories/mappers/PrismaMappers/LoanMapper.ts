import { Loan as PrismaLoan } from "@prisma/client";
import { Mapper } from "../MapperInterface";
import { Loan } from "../../../../domain/entities/Loan";

export class PrismaLoanMapper implements Mapper<PrismaLoan, Loan> {
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

  toPersistence(loan: Loan): PrismaLoan{
    return {
      loanIdentifier: loan.loanIdentifier,
      clientIdentifier : loan.clientIdentifier,
      advisorIdentifier : loan.advisorIdentifier,
      loanAmount: loan.loanAmount,
      durationInMonth: loan.durationInMonth,
      mensualities: loan.mensualities,
      insuranceMensualities: loan.insuranceMensualities,
      remainingAmountToPay: loan.remainingAmountToPay,
      annualInterestRate: loan.annualInterestRate,
      annualInsuranceRate: loan.annualInsuranceRate,
      status: loan.status,
      createdAt: loan.createdAt,
      lastPaidAt: loan.lastPaidAt as Date,
      nextToPayAt: loan.nextToPayAt as Date,
    }
  }
}
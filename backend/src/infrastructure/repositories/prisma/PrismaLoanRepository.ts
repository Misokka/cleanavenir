import { PrismaClient } from "@prisma/client";
import { LoanRepository } from "../../../application/ports/repositories/LoanRepository";
import { Loan } from "../../../domain/entities/Loan";
import { InsufficientFundsError } from "../../../domain/errors/InsufficientFundsError";
import { LoanNotFoundError } from "../../../domain/errors/LoanNotFoundError";
import Result, { err, ok } from "../../../shared/Result";
import { PrismaBankAccountRepository } from "./PrismaBankAccountRepository";
import { BankAccountNotFoundError } from "../../../domain/errors/BankAccountNotFoundError";
import { UnexpectedBankAccountError } from "../../../domain/errors/UnexpectedBankAccountError";

export class PrismaLoanRepository implements LoanRepository {
  constructor(
    private readonly prismaClient: PrismaClient,
  ){}

  async save(loan: Loan): Promise<Result<Loan, Error>> {
    try{

      await this.prismaClient.loan.create({
        data: {
          loanIdentifier: loan.loanIdentifier,
          clientIdentifier: loan.clientIdentifier,
          advisorIdentifier: loan.advisorIdentifier,
          annualInterestRate: loan.annualInterestRate,
          annualInsuranceRate: loan.annualInsuranceRate,
          loanAmount: loan.loanAmount,
          mensualities: loan.mensualities,
          durationInMonth: loan.durationInMonth,
          insuranceMensualities: loan.insuranceMensualities,
          remainingAmountToPay: loan.remainingAmoutToPay,
          status: loan.status,
          createAdt: loan.createdAt,
          lastPaidAt: loan.lastPaidAt,
          nextToPayAt: loan.nextToPayAt
        }
      });

      return ok(loan);
    } catch (error) {
      return err(new Error(`An error occured when creating the loan ${loan.loanIdentifier}`))
    }
  }

  async findById(loanIdentifier: string): Promise<Result<Loan, LoanNotFoundError>> {
    const loan = await this.prismaClient.loan.findUnique({
      where: {loanIdentifier}
    });

    if(!loan){
      return err(new LoanNotFoundError(loanIdentifier));
    }

    const loanObject = new Loan(
      loan.loanIdentifier,
      loan.clientIdentifier,
      loan.advisorIdentifier,
      loan.loanAmount,
      loan.durationInMonth,
      loan.mensualities,
      loan.insuranceMensualities,
      loan.remainingAmountToPay,
      loan.annualInterestRate,
      loan.annualInsuranceRate,
      loan.status,
      loan.createAdt,
      loan.lastPaidAt ?? undefined,
      loan.nextToPayAt ?? undefined
    );


    return ok(loanObject);
  }

  async findActiveLoansDueOn(date: Date): Promise<Result<Loan[], Error>> {
    
  }

  async all(): Promise<Loan[]> {
    
  }

  async delete(loanIdentifier: string): Promise<Result<string, LoanNotFoundError>> {
    
  }
}
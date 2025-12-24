import { PrismaClient } from "@prisma/client";
import { LoanRepository } from "../../../application/ports/repositories/LoanRepository";
import { Loan } from "../../../domain/entities/Loan";
import { InsufficientFundsError } from "../../../domain/errors/InsufficientFundsError";
import { LoanNotFoundError } from "../../../domain/errors/LoanNotFoundError";
import Result, { err, ok } from "../../../shared/Result";
import { PrismaBankAccountRepository } from "./PrismaBankAccountRepository";
import { BankAccountNotFoundError } from "../../../domain/errors/BankAccountNotFoundError";
import { UnexpectedBankAccountError } from "../../../domain/errors/UnexpectedBankAccountError";
import { PrismaLoanMapper } from "../mappers/PrismaMappers/PrismaLoanMapper";

export class PrismaLoanRepository implements LoanRepository {
  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly prismaLoanMapper: PrismaLoanMapper,
  ){}

  async save(loan: Loan): Promise<Result<Loan, Error>> {
    try{
      const loanToPersist = this.prismaLoanMapper.toPersistence(loan);

      const registeredLoan = await this.prismaClient.loan.create({
        data: {
          ...loanToPersist
        }
      });

      const loanToDomain = this.prismaLoanMapper.toDomain(registeredLoan)
      return ok(loanToDomain);
    } catch (error) {
      return err(new Error(`An error occured when creating the loan ${loan.loanIdentifier}`))
    }
  }

  async findById(loanIdentifier: string): Promise<Result<Loan, LoanNotFoundError>> {
    const maybeLoan = await this.prismaClient.loan.findUnique({
      where: {loanIdentifier}
    });

    if(!maybeLoan){
      return err(new LoanNotFoundError(loanIdentifier));
    }

    const loanToDomain = this.prismaLoanMapper.toDomain(maybeLoan)


    return ok(loanToDomain);
  }

  async findAllByUserId(clientIdentifier: string): Promise<Result<Loan[], Error>> {
    try{
      const allClientLoans = await this.prismaClient.loan.findMany({
        where: {clientIdentifier}
      });

      const allLoansToDomain = allClientLoans.map((loan) => {
        return this.prismaLoanMapper.toDomain(loan);
      });

      return ok(allLoansToDomain);
    } catch (error) {
      return err(new Error(`An error occured when retrieving loans for client: ${clientIdentifier}`))
    }
  }

  async findActiveLoansDueOn(date: Date): Promise<Result<Loan[], Error>> {
    try{
      const activeLoans = await this.prismaClient.loan.findMany({
        where: {
          nextToPayAt: date
        }
      });

      const activeLoansToDomain: Loan[] = [];
      activeLoans.forEach((loan) => {
        const loanToDomain = this.prismaLoanMapper.toDomain(loan);
        activeLoansToDomain.push(loanToDomain);
      })

      return ok(activeLoansToDomain)
    } catch (error){
      return err(new Error(`An error occured when retrive active loans due on ${date.getDate()}`)) // à préciser la date
    }
  }

  async all(): Promise<Result<Loan[], Error>> {
    try {
      const allLoans = await this.prismaClient.loan.findMany();
      const allLoansToDomain: Loan[] = [];

      allLoans.forEach((loan) => {
        const loanToDomain = this.prismaLoanMapper.toDomain(loan);
        allLoansToDomain.push(loanToDomain);
      });

      return ok(allLoansToDomain);
    } catch (error) {
      return err(new Error("An error occured when retrieving loans."))
    }
  }

  async delete(loanIdentifier: string): Promise<Result<string, LoanNotFoundError>> {
    try{
      const maybeLoan = await this.prismaClient.loan.findUnique({
        where: {
          loanIdentifier
        }
      });

      if(!maybeLoan){
        return err(new LoanNotFoundError(loanIdentifier));
      }

      const deletedLoan = await this.prismaClient.loan.delete({
        where: {loanIdentifier}
      })

      return ok(`Deleted loan: ${deletedLoan.loanIdentifier}.`);
    } catch (error) {
      return err(new Error(`An error occured when deleting loan: ${loanIdentifier}.`))
    }
  }


}
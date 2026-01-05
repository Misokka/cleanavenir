import { eq, sql } from 'drizzle-orm';
import { loans } from '../../drizzle/schema';
import Result, { ok, err } from '../../../shared/Result';
import type { LoanRepository } from '../../../application/ports/repositories/LoanRepository';
import { DrizzleClient } from '../../drizzle/client';
import { DrizzleLoanMapper } from '../mappers/DrizzleMappers/DrizzleLoanMapper';
import { Loan } from '../../../domain/entities/Loan';
import { LoanNotFoundError } from '../../../domain/errors/LoanNotFoundError';

export class LoanRepositoryDrizzle implements LoanRepository {
  constructor(
    private db: DrizzleClient,
    private loanMapper: DrizzleLoanMapper
  ) {}

  async save(loan: Loan): Promise<Result<Loan, Error>> {
    try {
      const loanToPersist = this.loanMapper.toPersistence(loan);
      const registeredLoans = await this.db.insert(loans).values(loanToPersist).returning();
      const loanToDomain = this.loanMapper.toDomain(registeredLoans[0]);
      return ok(loanToDomain);
    } catch (e: any) {
      return err(new Error(`Could not insert loan: ${e.message}`));
    }
  }

  async findById(loanIdentifier: string): Promise<Result<Loan, LoanNotFoundError>> {
    try {
      const rows = await this.db.select().from(loans).where(eq(loans.id, loanIdentifier)).limit(1);
      if (!rows.length) return err(new LoanNotFoundError(loanIdentifier));

      const loanToDomain = this.loanMapper.toDomain(rows[0]);
      return ok(loanToDomain);
    } catch (e: any) {
      return err(new Error(`Could not find loan by id: ${e.message}`));
    }
  }

  async findAllByUserId(clientIdentifier: string): Promise<Result<Loan[], Error>> {
    try {
      const loanRows = await this.db.select().from(loans).where(eq(loans.clientId, clientIdentifier));
      const clientLoansToDomain = loanRows.map((row) => {
        return this.loanMapper.toDomain(row);
      })
      return ok(clientLoansToDomain);
    } catch (e: any) {
      return err(new Error(`Could not list loans: ${e.message}`));
    }
  }

  async findActiveLoansDueOn(date: Date): Promise<Result<Loan[], Error>> {
    try{
      const activeLoansRows = await this.db
      .select()
      .from(loans)
      .where(eq(loans.nextToPayAt, date.toISOString()));

      const activeLoansToDomain = activeLoansRows.map((row) => {
        return this.loanMapper.toDomain(row);
      });

      return ok(activeLoansToDomain)
    } catch (error) {
      return err(new Error(`An error occured when trying to retrieve active loans due on ${date.toISOString()}`))
    }
  }

  async all(): Promise<Result<Loan[], Error>> {
    try {
      const loanRows = await this.db.select().from(loans);
      const loansToDomain = loanRows.map((row) => {
        return this.loanMapper.toDomain(row);
      });
      return ok(loansToDomain)
    } catch (error) {
      return err(new Error("An error occured when retrieving all loans"))
    }
    
  }

  async findByStatus(status: string): Promise<Result<Loan[], Error>> {
    try {
      const loanRows = await this.db.select().from(loans).where(eq(loans.status, status));
      const loansToDomain = loanRows.map((row) => this.loanMapper.toDomain(row));
      return ok(loansToDomain);
    } catch (e: any) {
      return err(new Error(`Could not find loans by status: ${e.message}`));
    }
  }

  async findByAdvisorId(advisorId: string): Promise<Result<Loan[], Error>> {
    try {
      const loanRows = await this.db.select().from(loans).where(eq(loans.advisorId, advisorId));
      const loansToDomain = loanRows.map((row) => this.loanMapper.toDomain(row));
      return ok(loansToDomain);
    } catch (e: any) {
      return err(new Error(`Could not find loans by advisor: ${e.message}`));
    }
  }

  async update(loan: Loan): Promise<Result<Loan, LoanNotFoundError>> {
    try {
      const loanToPersist = this.loanMapper.toPersistence(loan);
      
      const { id, ...dataToUpdate } = loanToPersist;
      
      const cleanedData: any = { ...dataToUpdate };
      if (cleanedData.lastPaidAt === null || cleanedData.lastPaidAt === undefined) {
        cleanedData.lastPaidAt = sql`NULL`;
      }
      
      const updatedLoanRows = await this.db
        .update(loans)
        .set(cleanedData)
        .where(eq(loans.id, loan.loanIdentifier))
        .returning();

      if (!updatedLoanRows.length) {
        return err(new LoanNotFoundError(loan.loanIdentifier));
      }

      const updatedLoan = this.loanMapper.toDomain(updatedLoanRows[0]);
      return ok(updatedLoan);
    } catch (e: any) {
      return err(new Error(`Could not update loan: ${e.message}`));
    }
  }

  async delete(loanIdentifier: string): Promise<Result<string, LoanNotFoundError>> {
    try{
      const deletedLoanRows = await this.db.delete(loans).where(eq(loans.id, loanIdentifier)).limit(1).returning();
      if(!deletedLoanRows.length){
        return err(new LoanNotFoundError(loanIdentifier));
      }
      const deletedLoanToDomain = this.loanMapper.toDomain(deletedLoanRows[0]);

      return ok(deletedLoanToDomain.loanIdentifier);
    } catch (error){
      return err(new Error(`An error occured when trying to delete loan: ${loanIdentifier}`));
    }
  }
}

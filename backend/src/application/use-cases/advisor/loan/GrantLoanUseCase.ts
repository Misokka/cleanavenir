import { randomUUID } from "crypto";
import { AdvisorRepository } from "../../../ports/repositories/AdvisorRepository";
import { ClientRepository } from "../../../ports/repositories/ClientRepository";
import { LoanRepository } from "../../../ports/repositories/LoanRepository";
import Result, { err, ok } from "../../../../shared/Result";
import { Loan } from "../../../../domain/entities/Loan";
import { LoanCalculator } from "../../../ports/services/LoanCalculator";

type LoanUseCaseProps = {
  clientIdentifier: string, 
  advisorIdentifier: string, 
  loanAmount: number, 
  durationInMonth: number, 
  annualInterestRate: number, 
  annualInsuranceRate: number
}
export class GrantLoanUseCase{
  constructor(
    private readonly loanRepository: LoanRepository,
    private readonly clientRepository: ClientRepository,
    private readonly advisorRepository: AdvisorRepository
  ){}

  public async execute({
    clientIdentifier,
    advisorIdentifier,
    loanAmount,
    durationInMonth,
    annualInterestRate,
    annualInsuranceRate
  }: LoanUseCaseProps): Promise<Result<Loan, Error>>{
    const loanIdentifier = randomUUID();

    const client = await this.clientRepository.findById(clientIdentifier);
    if(!client.ok){
      return err(client.error)
    }

    const advisor = await this.advisorRepository.findById(advisorIdentifier);
    if(!advisor.ok){
      return err(advisor.error);
    }

    const loanCalulator = new LoanCalculator();

    const mensualities = loanCalulator.getMensualities(loanAmount, annualInterestRate, durationInMonth, annualInsuranceRate);
    const insuranceMensualities = loanCalulator.computeInsuranceMensualities(loanAmount, annualInsuranceRate);

    // récupérer la loan lié au l'advisor plutôt que d'en créer une nouvelle
    const newLoan = Loan.create({
      loanIdentifier,
      clientIdentifier,
      advisorIdentifier,
      loanAmount,
      durationInMonth,
      mensualities, // mensualities à calculer
      insuranceMensualities,
      remainingAmountToPay: loanAmount,
      annualInterestRate,
      annualInsuranceRate,
      status: "ACTIVE",
      createdAt: new Date(),
      lastPaidAt: undefined,
      nextToPayAt: new Date(), // faire new date + 1 mois
    }
    );

    const loan = await this.loanRepository.save(newLoan);

    if(!loan.ok){
      return err(loan.error);
    }

    return ok(loan.value);
  }

}
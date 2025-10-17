import { randomUUID } from "crypto";
import { AdvisorRepository } from "../../../ports/repositories/AdvisorRepository";
import { ClientRepository } from "../../../ports/repositories/ClientRepository";
import { LoanRepository } from "../../../ports/repositories/LoanRepository";
import { err, ok } from "../../../../shared/Result";
import { Loan } from "../../../../domain/entities/Loan";
import { LoanCalculator } from "../../../ports/services/LoanCalculator";

export class GrantLoanUseCase{
  constructor(
    private readonly loanRepository: LoanRepository,
    private readonly clientRepository: ClientRepository,
    private readonly advisorRepository: AdvisorRepository
  ){}

  public async execute(clientIdentifier: string, advisorIdentifier: string, loanAmount: number, durationInMonth: number, annualInterestRate: number, annualInsuranceRate: number){
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

    const newLoan = new Loan(
      loanIdentifier,
      clientIdentifier,
      advisorIdentifier,
      loanAmount,
      durationInMonth,
      mensualities, // mensualities à calculer
      insuranceMensualities,
      loanAmount, // remainingAmountToPay commene à la même valeur que loanAmount
      annualInterestRate,
      annualInsuranceRate,
      "ACTIVE",
      new Date(),
      undefined,
      new Date(), // faire new date + 1 mois
    );

    const loan = await this.loanRepository.save(newLoan);

    if(!loan.ok){
      return err(loan.error);
    }

    return ok(loan);
  }

}
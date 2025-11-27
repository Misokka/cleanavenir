import { Result, ok } from '../../../../shared/Result';
import { StandardLoanCalculator } from '../../../../infrastructure/adapters/StandardLoanCalculator';

export interface SimulateLoanInput {
  amount: number; // en centimes
  durationInMonth: number;
  annualInterestRate: number; // en basis points
  annualInsuranceRate: number; // en basis points
}

export interface LoanSimulation {
  monthlyPayment: number; // mensualité totale
  totalInterest: number; // total des intérêts
  totalInsurance: number; // total de l'assurance
  totalCost: number; // coût total du crédit
}

export class SimulateLoanUseCase {
  private calculator = new StandardLoanCalculator();

  async execute(input: SimulateLoanInput): Promise<Result<LoanSimulation, Error>> {
    const monthlyPayment = this.calculator.getMensualities(
      input.amount,
      input.annualInterestRate,
      input.durationInMonth,
      input.annualInsuranceRate
    );

    const totalPayment = monthlyPayment * input.durationInMonth;
    const totalInterest = totalPayment - input.amount;
    const insuranceMonthly = this.calculator.computeInsuranceMensualities(
      input.amount,
      input.annualInsuranceRate
    );
    const totalInsurance = insuranceMonthly * input.durationInMonth;

    return ok({
      monthlyPayment,
      totalInterest,
      totalInsurance,
      totalCost: totalPayment,
    });
  }
}
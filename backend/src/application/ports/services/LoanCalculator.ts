type Amortizationtable = Record<string, {
  interestPart: number,
  insurancePart: number,
  capitalPart: number;
  remainingAmountToPay: string
}>

export class LoanCalculator{

  public getAmortizationTable(loanAmount: number, annualInterestRate: number, durationInMonth: number, annualInsuranceRate: number){
    const mensualities = this.getMensualities(loanAmount, annualInterestRate, durationInMonth, annualInsuranceRate);

    const MONTH_IN_YEAR = 12;
    const TOTAL_MONTH = durationInMonth * MONTH_IN_YEAR;
    const MONTHLY_INTEREST_RATE = (annualInterestRate / MONTH_IN_YEAR) / 100; //passage de % en décimal
    const MONTHLY_INSURANCE_RATE = (annualInsuranceRate / MONTH_IN_YEAR) / 100;
    let remainingAmountToPay = loanAmount;

    const amortizationTable: Amortizationtable = {};

    for(let i = 0; i < TOTAL_MONTH; i++){
      const interestPart = remainingAmountToPay * MONTHLY_INTEREST_RATE ;
      const insurancePart = loanAmount * MONTHLY_INSURANCE_RATE;
      const capitalPart = mensualities - interestPart - insurancePart;
  
      amortizationTable[`Month ${i + 1}`] = {
        interestPart,
        insurancePart,
        capitalPart,
        remainingAmountToPay: `${remainingAmountToPay} - ${capitalPart} = ${remainingAmountToPay - capitalPart}`
      }

      remainingAmountToPay-= capitalPart;
    }

    return amortizationTable;
  }

  public getMensualities(loanAmount: number, annualInterestRate: number, durationInMonth: number, annualInsuranceRate: number){
    const loanMensualites = this.computeLoanMensualities(loanAmount, annualInterestRate, durationInMonth);
    const insuranceMensualites = this.computeInsuranceMensualities(loanAmount, annualInsuranceRate)

    return loanMensualites + insuranceMensualites;
  }

  /**
   * @description menusalites formula (doesn't include insurance mensualities)
   */
  public computeLoanMensualities(loanAmount: number, annualInterestRate: number, durationInMonth: number){
    const MONTH_IN_YEAR = 12
    const MONTHLY_INTEREST_RATE = (annualInterestRate / MONTH_IN_YEAR) / 100

    const numberOfMensualities = durationInMonth * MONTH_IN_YEAR;

    const numerator = MONTHLY_INTEREST_RATE * (1 + MONTHLY_INTEREST_RATE) ** numberOfMensualities;
    const denominator = (1 + MONTHLY_INTEREST_RATE) ** numberOfMensualities - 1

    return loanAmount * (numerator / denominator);
  }


  public computeInsuranceMensualities(loanAmount: number, annualInsuranceRate: number){
    const MONTH_IN_YEAR = 12;

    return (loanAmount * annualInsuranceRate) / MONTH_IN_YEAR;
  }
}
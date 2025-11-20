export class Loan{
  constructor(
    public loanIdentifier: string,
    public clientIdentifier: string,
    public advisorIdentifier: string,
    public loanAmount: number,
    public durationInMonth: number,
    public mensualities: number,
    public insuranceMensualities: number,
    public remainingAmountToPay: number,
    public annualInterestRate: number,
    public annualInsuranceRate: number,
    public status: "ACTIVE" | "PAID_OFF",
    public createdAt: Date,
    public lastPaidAt?: Date,
    public nextToPayAt?: Date,
  ){}

  public processMonthlyPayment(): void {
    if (this.status === "PAID_OFF") {
      return;
    }

    const monthlyInterestRate = this.annualInterestRate / 12;
    const interestPortion = this.remainingAmountToPay * monthlyInterestRate;
    
    const capitalPortion = this.mensualities - interestPortion - this.insuranceMensualities;
    
    this.remainingAmountToPay -= capitalPortion;

    if (this.remainingAmountToPay <= 0) {
      this.remainingAmountToPay = 0;
      this.status = "PAID_OFF";
    }
  }
}
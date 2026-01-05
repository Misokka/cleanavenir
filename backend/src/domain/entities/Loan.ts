export type LoanStatus = "PENDING" | "ACTIVE" | "PAID_OFF" | "REJECTED"
export class Loan{
  private constructor(
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
    public status: LoanStatus,
    public createdAt: Date,
    public lastPaidAt?: Date,
    public nextToPayAt?: Date,
  ){}

  public static create(props: {
    loanIdentifier: string,
    clientIdentifier: string,
    advisorIdentifier: string,
    loanAmount: number,
    durationInMonth: number,
    mensualities: number,
    insuranceMensualities: number,
    remainingAmountToPay: number,
    annualInterestRate: number,
    annualInsuranceRate: number,
    status?: LoanStatus,
    createdAt?: Date,
    lastPaidAt?: Date,
    nextToPayAt?: Date,
  }): Loan {
    return new Loan(
      props.loanIdentifier,
      props.clientIdentifier,
      props.advisorIdentifier,
      props.loanAmount,
      props.durationInMonth,
      props.mensualities,
      props.insuranceMensualities,
      props.remainingAmountToPay,
      props.annualInterestRate,
      props.annualInsuranceRate,
      props.status ?? "ACTIVE",
      props.createdAt ?? new Date(),
      props.lastPaidAt,
      props.nextToPayAt
    );
  }

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
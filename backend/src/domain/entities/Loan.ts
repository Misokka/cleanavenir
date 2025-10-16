export class Loan{
  constructor(
    public loanIdentifier: string,
    public clientIdentifier: string,
    public advisorIdentifier: string,
    public loanAmount: number,
    public durationInMonth: number,
    public mensualities: number,
    public insuranceMensualities: number,
    public remainingAmoutToPay: number,
    public annualInterestRate: number,
    public annualInsuranceRate: number,
    public status: "ACTIVE" | "PAID_OFF",
    public createdAt: Date,
    public lastPaidAt?: Date,
    public nextToPayAt?: Date,
  ){}

  public processMonthlyPayment(): void {
    if (this.status === "PAID_OFF") {
      return; // Ne rien faire si déjà remboursé
    }

    // Calculer la part des intérêts pour le mois en cours
    const monthlyInterestRate = this.annualInterestRate / 12;
    const interestPortion = this.remainingAmoutToPay * monthlyInterestRate;
    
    // Calculer la part du capital remboursé ce mois-ci
    const capitalPortion = this.mensualities - interestPortion - this.insuranceMensualities;
    
    this.remainingAmoutToPay -= capitalPortion;

    // Vérifier si le prêt est terminé
    if (this.remainingAmoutToPay <= 0) {
      this.remainingAmoutToPay = 0;
      this.status = "PAID_OFF";
    }
  }
}
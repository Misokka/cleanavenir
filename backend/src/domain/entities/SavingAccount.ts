import { randomUUID } from "crypto";
import { Iban } from "../value-objects/Iban";
import { Transaction } from "./Transaction";
import { InsufficientFundsError } from "../errors/InsufficientFundsError";

export class SavingAccount  {
  private constructor(
    public accountIdentifier: string,
    public clientIdentifier: string,
    public productIdentifier: string,
    public iban: Iban,
    public label: string,
    public balance: number,
  ){}

  public static create(props: {
    accountIdentifier: string,
    clientIdentifier: string,
    productIdentifier: string,
    iban: Iban,
    label: string,
    balance: number
  }): SavingAccount {
    return new SavingAccount(
      props.accountIdentifier,
      props.clientIdentifier,
      props.productIdentifier,
      props.iban,
      props.label,
      props.balance
    );
  }

  public withdraw(amount: number): void {
    if (this.balance < amount) {
      throw new InsufficientFundsError(this.accountIdentifier);
    }
    this.balance -= amount;
  }

  public deposit(amount: number): void{
    this.balance += amount;
  }

  public applyTransaction(transaction: Transaction){
    if(transaction.direction === "CREDIT"){
      this.deposit(transaction.amount);
    } else {
      this.withdraw(transaction.amount);
    }
  }


  public applyDailyInterest(annualRate: number): Transaction | null {
    const DAYS_IN_YEAR = 365;
    const dailyInterest = (this.balance * annualRate) / DAYS_IN_YEAR;
    
    const interestAmount = Math.round(dailyInterest * 100) / 100;
    
    if (interestAmount <= 0) {
      return null;
    }

    const transactionIdentifier = randomUUID();
    const interestTransaction = new Transaction(
      transactionIdentifier,
      this.accountIdentifier,
      interestAmount * 100, // en centimes
      "CREDIT",
      "SAVINGS_INTEREST",
      "Daily interests",
      new Date()
    );

    // On applique la transaction pour mettre à jour le solde
    this.applyTransaction(interestTransaction);
    
    return interestTransaction;
  }
} 
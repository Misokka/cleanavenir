import { randomUUID } from "crypto";
import { Iban } from "../value-objects/Iban";
import { BankAccount } from "./BankAccount";
import { Transaction } from "./Transaction";

export class SavingAccount extends  BankAccount{
  constructor(
    accountIdentifier: string,
    clientIdentifier: string,
    iban: Iban,
    label: string,
    balance: number
  ){
    super(accountIdentifier, clientIdentifier, iban, label, balance);
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
import { InsufficientFundsError } from "../errors/InsufficientFundsError";
import { Iban } from "../value-objects/Iban";
import { Transaction } from "./Transaction";

export class BankAccount{
  private constructor(
    public accountIdentifier: string,
    public clientIdentifier: string,
    public iban: Iban,
    public label: string,
    public balance: number
  ){}

  public static create(props: {
    accountIdentifier: string,
    clientIdentifier: string,
    iban: Iban,
    label: string,
    balance: number
  }): BankAccount {
    return new BankAccount(
      props.accountIdentifier,
      props.clientIdentifier,
      props.iban,
      props.label,
      props.balance
    );
  }

  public withdraw(amount: number): void {
    if (this.balance < amount) {
      throw new InsufficientFundsError(`${this.accountIdentifier} ${amount / 100}`);
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

  public checkBalance(amount: number): boolean{
    return this.balance >= amount;
  }
}
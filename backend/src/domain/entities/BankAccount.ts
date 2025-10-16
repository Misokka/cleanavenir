import { InsufficientFundsError } from "../errors/InsufficientFundsError";
import { Iban } from "../value-objects/Iban";

export class BankAccount{
  constructor(
    public accountIdentifier: string,
    public clientIdentifier: string,
    public iban: Iban,
    public label: string,
    public balance: number
  ){}

  public withdraw(amount: number): void {
    if (this.balance < amount) {
      throw new InsufficientFundsError(this.accountIdentifier);
    }
    this.balance -= amount;
  }
}
import { Iban } from "../value-objects/Iban";

export class BankAccount{
  constructor(
    public accountIdentifier: string,
    public clientIdentifier: string,
    public iban: Iban,
    public label: string,
    public balance: number
  ){}
}
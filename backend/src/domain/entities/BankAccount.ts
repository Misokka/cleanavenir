import { Iban } from "../value-objects/Iban";
import { Client } from "./Client";

export class BankAccount{
  constructor(
    public accountIdentifier: string,
    public iban: Iban,
    public label: string,
    public client: Client
  ){}
}
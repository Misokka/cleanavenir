import { Iban } from "../value-objects/Iban";
import { Client } from "./Client";

export class BankAccount{
  constructor(
    public iban: Iban,
    public client: Client
  ){}
}
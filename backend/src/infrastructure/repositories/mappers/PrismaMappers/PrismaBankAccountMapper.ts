import { BankAccount as PrismaBankAccount } from "@prisma/client";
import { BankAccount } from "../../../../domain/entities/BankAccount";
import { Iban } from "../../../../domain/value-objects/Iban";
import { Mapper } from "../MapperInterface";

type BankAccountToPersist = {
  accountIdentifier: string,
  clientIdentifier: string,
  iban: string,
  label: string,
  balance: number
}
export class PrismaBankAccountMapper implements Mapper<PrismaBankAccount, BankAccount, BankAccountToPersist> {
  // Prisma -> Domaine
  toDomain(raw: PrismaBankAccount): BankAccount {
    return new BankAccount(
      raw.accountIdentifier,
      raw.clientIdentifier,
      new Iban(raw.iban),
      raw.label,
      raw.balance,
    );
  }

  // Domaine -> Prisma
  toPersistence(bankAccount: BankAccount): BankAccountToPersist {
    return {
      ...bankAccount,
      iban: bankAccount.iban.value
    };
  }
}

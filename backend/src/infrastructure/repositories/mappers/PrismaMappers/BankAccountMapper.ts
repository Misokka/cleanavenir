import { BankAccount as PrismaBankAccount } from "@prisma/client";
import { BankAccount } from "../../../../domain/entities/BankAccount";
import { Iban } from "../../../../domain/value-objects/Iban";
import { Mapper } from "../MapperInterface";

export class BankAccountMapper implements Mapper<PrismaBankAccount, BankAccount> {
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
  toPersistence(bankAccount: BankAccount): unknown {
    return {
      accountIdentifier: bankAccount.accountIdentifier,
      clientIdentifier: bankAccount.clientIdentifier,
      iban: bankAccount.iban.value,
      label: bankAccount.label,
      balance: bankAccount.balance,
    };
  }
}

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
    const ibanResult = Iban.from(raw.iban);
    if (!ibanResult.ok) {
      throw new Error('Invalid IBAN format');
    }
    return BankAccount.create({
      ...raw,
      iban: ibanResult.value,
    });
  }

  // Domaine -> Prisma
  toPersistence(bankAccount: BankAccount): BankAccountToPersist {
    return {
      ...bankAccount,
      iban: bankAccount.iban.value
    };
  }
}

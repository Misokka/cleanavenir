import { Mapper } from "../MapperInterface";
import { SavingAccount as PrismaSavingAccount } from "@prisma/client";
import { SavingAccount } from "../../../../domain/entities/SavingAccount";
import { Iban } from "../../../../domain/value-objects/Iban";

type SavingAccountToPersist = {
  accountIdentifier: string,
  clientIdentifier: string,
  productIdentifier: string,
  iban: string,
  label: string,
  balance: number,
}
export class PrismaSavingAccountMapper implements Mapper<PrismaSavingAccount, SavingAccount, SavingAccountToPersist>{
  toDomain(raw: PrismaSavingAccount): SavingAccount {
    return new SavingAccount(
      raw.accountIdentifier,
      raw.clientIdentifier,
      raw.productIdentifier,
      new Iban(raw.iban),
      raw.label,
      raw.balance,
    )
  }

  toPersistence(obj: SavingAccount): SavingAccountToPersist {
    return {
      ...obj,
      iban: obj.iban.value
    }
  }
}
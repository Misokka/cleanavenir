import { Mapper } from "../MapperInterface";
import { SavingAccount as PrismaSavingAccount } from "@prisma/client";
import { SavingAccount } from "../../../../domain/entities/SavingAccount";
import { Iban } from "../../../../domain/value-objects/Iban";
import { err } from "../../../../shared/Result";

type SavingAccountToPersist = {
  accountIdentifier: string,
  clientIdentifier: string,
  productIdentifier: string,
  iban: string,
  label: string,
  balance: number,
  createdAt: Date
}
export class PrismaSavingAccountMapper implements Mapper<PrismaSavingAccount, SavingAccount, SavingAccountToPersist>{
  toDomain(raw: PrismaSavingAccount): SavingAccount {
    return SavingAccount.create({
      ...raw,
      iban: new Iban(raw.iban)
    })
  }

  toPersistence(obj: SavingAccount): SavingAccountToPersist {
    return {
      ...obj,
      iban: obj.iban.value
    }
  }
}
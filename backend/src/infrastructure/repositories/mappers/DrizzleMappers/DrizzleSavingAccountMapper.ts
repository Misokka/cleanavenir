import { SavingAccount } from "../../../../domain/entities/SavingAccount";
import { Iban } from "../../../../domain/value-objects/Iban";
import { err } from "../../../../shared/Result";
import { SavingAccountDrizzle, NewSavingAccountDrizzle } from "../../../drizzle/schema";
import { Mapper } from "../MapperInterface";

export class DrizzleSavingAccountMapper implements Mapper<SavingAccountDrizzle, SavingAccount, NewSavingAccountDrizzle> {
  toDomain(raw: SavingAccountDrizzle): SavingAccount {
    const ibanResult = Iban.from(raw.iban);
    if(!ibanResult.ok){
      throw new Error("Invalid Iban");
    }

    return SavingAccount.create({
      ...raw,
      accountIdentifier: raw.id,
      clientIdentifier: raw.ownerId,
      productIdentifier: raw.savingProductId,
      iban: ibanResult.value,
      createdAt: new Date(raw.createdAt)
    }) ;
  }

  toPersistence(entity: SavingAccount): NewSavingAccountDrizzle {
    return {
      ...entity,
      id: entity.accountIdentifier,
      ownerId: entity.clientIdentifier,
      savingProductId: entity.productIdentifier,
      iban: entity.iban.value,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt?.toISOString() as string,
    };
  }
}

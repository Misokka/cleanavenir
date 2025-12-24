import { Mapper } from "../MapperInterface";
import { BankAccountDrizzle, bankAccounts, NewBankAccountDrizzle } from "../../../drizzle/schema";
import { BankAccount } from "../../../../domain/entities/BankAccount";
import { Iban } from "../../../../domain/value-objects/Iban";



export class DrizzleBankAccountMapper implements Mapper<BankAccountDrizzle, BankAccount, NewBankAccountDrizzle>{
  toDomain(raw: BankAccountDrizzle): BankAccount {
    const ibanResult = Iban.from(raw.iban);
    if (!ibanResult.ok) {
      throw new Error('Invalid IBAN format');
    }
    return BankAccount.create({
      accountIdentifier: raw.id,
      clientIdentifier: raw.ownerId,
      iban: ibanResult.value,
      label: raw.name,
      balance: raw.balance,
    });
  }

  toPersistence(obj: BankAccount): NewBankAccountDrizzle {
    return {
      id: obj.accountIdentifier,
      ownerId: obj.clientIdentifier,
      iban: obj.iban.value,
      name: obj.label,
      balance: obj.balance ?? 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }
}
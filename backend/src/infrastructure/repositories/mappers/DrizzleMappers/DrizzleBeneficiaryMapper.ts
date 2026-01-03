import { Mapper } from "../MapperInterface";
import { BeneficiaryDrizzle, NewBeneficiaryDrizzle } from "../../../drizzle/schema";
import { Beneficiary } from "../../../../domain/entities/Beneficiary";
import { Iban } from "../../../../domain/value-objects/Iban";

export class DrizzleBeneficiaryMapper implements Mapper<BeneficiaryDrizzle, Beneficiary, NewBeneficiaryDrizzle> {
  toDomain(raw: BeneficiaryDrizzle): Beneficiary {
    const ibanResult = Iban.from(raw.iban);
    if (!ibanResult.ok) {
      throw new Error('Invalid IBAN format in beneficiary');
    }
    return Beneficiary.create({
      beneficiaryIdentifier: raw.id,
      clientIdentifier: raw.clientId,
      iban: ibanResult.value,
      label: raw.label,
      accountName: raw.accountName || undefined,
      createdAt: new Date(raw.createdAt),
    });
  }

  toPersistence(obj: Beneficiary): NewBeneficiaryDrizzle {
    return {
      id: obj.beneficiaryIdentifier,
      clientId: obj.clientIdentifier,
      iban: obj.iban.value,
      label: obj.label,
      accountName: obj.accountName || null,
      createdAt: obj.createdAt.toISOString(),
    };
  }
}

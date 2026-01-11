import { Mapper } from "../MapperInterface";
import { Beneficiary as PrismaBeneficiary } from "@prisma/client";
import { Beneficiary } from "../../../../domain/entities/Beneficiary";
import { Iban } from "../../../../domain/value-objects/Iban";

type BeneficiaryToPersist = {
  beneficiaryIdentifier: string;
  clientIdentifier: string;
  iban: string;
  label: string;
  accountName: string | null;
  createdAt: Date;
}

export class PrismaBeneficiaryMapper implements Mapper<PrismaBeneficiary, Beneficiary, BeneficiaryToPersist> {
  toDomain(raw: PrismaBeneficiary): Beneficiary {
    const ibanResult = Iban.from(raw.iban);
    if (!ibanResult.ok) {
      throw new Error(`Invalid IBAN format: ${raw.iban}`);
    }
    
    return Beneficiary.create({
      ...raw,
      iban: ibanResult.value,
      accountName: raw.accountName as string | undefined
    });
  }

  toPersistence(obj: Beneficiary): BeneficiaryToPersist {
    return {
      ...obj,
      iban: obj.iban.value,
      accountName: obj.accountName as string | null
    };
  }
}

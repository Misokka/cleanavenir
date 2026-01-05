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
      beneficiaryIdentifier: raw.beneficiaryIdentifier,
      clientIdentifier: raw.clientIdentifier,
      iban: ibanResult.value,
      label: raw.label,
      createdAt: raw.createdAt,
      accountName: raw.accountName ?? undefined
    });
  }

  toPersistence(obj: Beneficiary): BeneficiaryToPersist {
    return {
      beneficiaryIdentifier: obj.beneficiaryIdentifier,
      clientIdentifier: obj.clientIdentifier,
      iban: obj.iban.value,
      label: obj.label,
      accountName: obj.accountName ?? null,
      createdAt: obj.createdAt
    };
  }
}

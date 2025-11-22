import { Mapper } from "../MapperInterface";
import { SavingProduct as PrismaSavingProduct } from "@prisma/client";
import { SavingProduct } from "../../../../domain/entities/SavingProduct";

type SavingProductToPersist = {
  savingProductIdentifier: string,
  label: string,
  rate: number
}

export class PrismaSavingProductMapper implements Mapper<PrismaSavingProduct, SavingProduct, SavingProductToPersist>{
  toDomain(raw: PrismaSavingProduct): SavingProduct {
    return new SavingProduct(
      raw.savingProductIdentifier,
      raw.label,
      raw.rate
    )
  }

  toPersistence(obj: SavingProduct): SavingProductToPersist {
    return {...obj}
  }
}
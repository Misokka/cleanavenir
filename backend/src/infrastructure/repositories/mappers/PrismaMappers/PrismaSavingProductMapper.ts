import { Mapper } from "../MapperInterface";
import { SavingProduct as PrismaSavingProduct } from "@prisma/client";
import { SavingProduct } from "../../../../domain/entities/SavingProduct";

type SavingProductToPersist = {
  savingProductIdentifier: string,
  label: string,
  rate: number,
  rateUpdatedAt?: Date
}

export class PrismaSavingProductMapper implements Mapper<PrismaSavingProduct, SavingProduct, SavingProductToPersist>{
  toDomain(raw: PrismaSavingProduct): SavingProduct {
    return SavingProduct.create({
      ...raw,
      rateUpdatedAt: raw.rateUpdatedAt as Date | undefined
    })
  }

  toPersistence(obj: SavingProduct): SavingProductToPersist {
    return {...obj}
  }
}
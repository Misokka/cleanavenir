import { SavingProduct } from "../../../../domain/entities/SavingProduct";
import { SavingProductDrizzle, NewSavingProductDrizzle } from "../../../drizzle/schema";
import { Mapper } from "../MapperInterface";

export class DrizzleSavingProductMapper implements Mapper<SavingProductDrizzle, SavingProduct, NewSavingProductDrizzle> {
  toDomain(raw: SavingProductDrizzle): SavingProduct {
    return SavingProduct.create({
      savingProductIdentifier: raw.id,
      label: raw.label,
      rate: raw.rate / 1000000,
      rateUpdatedAt: raw.rateUpdatedAt,
    });
  }

  toPersistence(entity: SavingProduct): NewSavingProductDrizzle {
    return {
      id: entity.savingProductIdentifier,
      label: entity.label,
      rate: Math.round(entity.rate * 1000000),
      rateUpdatedAt: entity.rateUpdatedAt ?? null,
    };
  }
}

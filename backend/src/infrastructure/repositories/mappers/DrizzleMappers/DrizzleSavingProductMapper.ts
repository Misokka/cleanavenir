import { SavingProduct } from "../../../../domain/entities/SavingProduct";
import { SavingProductDrizzle, NewSavingProductDrizzle } from "../../../drizzle/schema";
import { Mapper } from "../MapperInterface";

export class DrizzleSavingProductMapper implements Mapper<SavingProductDrizzle, SavingProduct, NewSavingProductDrizzle> {
  toDomain(raw: SavingProductDrizzle): SavingProduct {
    // ...mapping logic...
    return SavingProduct.create({
      ...raw,
      savingProductIdentifier: raw.id,
    });
  }

  toPersistence(entity: SavingProduct): NewSavingProductDrizzle {
    // ...mapping logic...
    return {
      ...entity,
      id: entity.savingProductIdentifier,
    };
  }
}

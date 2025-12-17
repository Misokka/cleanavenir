import { eq } from "drizzle-orm";
import { SavingProductRepository } from "../../../application/ports/repositories/SavingProductRepository";
import { SavingProduct } from "../../../domain/entities/SavingProduct";
import Result, { err, ok } from "../../../shared/Result";
import { DrizzleClient } from "../../drizzle/client";
import { savingProducts } from "../../drizzle/schema";
import { DrizzleSavingProductMapper } from "../mappers/DrizzleMappers/DrizzleSavingProductMapper";
import { SavingProductNotFoundError } from "../../../domain/errors/SavingProductNotFoundError";

export class SavingProductRepositoryDrizzle implements SavingProductRepository {
  constructor(
    private readonly db: DrizzleClient,
    private readonly savingProductMapper: DrizzleSavingProductMapper
  ){}

  async save(savingProduct: SavingProduct): Promise<Result<SavingProduct, Error>> {
    try{
      const savingProductToPersist = this.savingProductMapper.toPersistence(savingProduct);
      const savingProductRows = await this.db.insert(savingProducts).values(savingProductToPersist).returning();
      const savingProductToDomain = this.savingProductMapper.toDomain(savingProductRows[0]);

      return ok(savingProductToDomain);
    } catch (error: any){
      return err(new Error(`An error occured when saving savingProduct ${savingProduct.savingProductIdentifier}. Message: ${error.message}`))
    }
  }

  async findById(savingProductIdentifier: string): Promise<Result<SavingProduct, Error>> {
    try{
      const savingProductRows = await this.db.select().from(savingProducts).where(eq(savingProducts.id, savingProductIdentifier));
      if(!savingProductRows.length){
        return err(new SavingProductNotFoundError(savingProductIdentifier));
      }

      const savingProductToDomain = this.savingProductMapper.toDomain(savingProductRows[0]);
      return ok(savingProductToDomain);
    } catch (error: any) {
      return err(new Error(`An error occured when retrieving savingProduct: ${savingProductIdentifier}`))
    }
  }

  async findByLabel(label: string): Promise<Result<SavingProduct, Error>> {
    try{
      const savingProductRows = await this.db.select().from(savingProducts).where(eq(savingProducts.label, label));
      if(!savingProductRows.length){
        return err(new SavingProductNotFoundError(`SavingProduct for label ${label} not found.`));
      }

      const savingProductToDomain = this.savingProductMapper.toDomain(savingProductRows[0]);
      return ok(savingProductToDomain);
    } catch (error: any) {
      return err(new Error(`An error occured when retrieving savingProduct with label: ${label}`))
    }
  }

  async all(): Promise<Result<SavingProduct[], Error>> {
    try{
      const savingProductRows = await this.db.select().from(savingProducts);
      
      const savingProductsToDomain = savingProductRows.map((row) => {
        return this.savingProductMapper.toDomain(row);
      }) 
      return ok(savingProductsToDomain);
    } catch (error: any) {
      return err(new Error(`An error occured when retrieving all savingProducts`))
    }
  }

  async delete(savingProductIdentifier: string): Promise<Result<SavingProduct, Error>> {
    try{
      const deletedSavingProductRows = await this.db.delete(savingProducts).where(eq(savingProducts.id, savingProductIdentifier)).returning();
      const deletedSavingProductToDomain = this.savingProductMapper.toDomain(deletedSavingProductRows[0]);
      return ok(deletedSavingProductToDomain);
    } catch (error) {
      return err(new Error(`An error occured when deleting savingProduct ${savingProductIdentifier}`))
    }
  }
}
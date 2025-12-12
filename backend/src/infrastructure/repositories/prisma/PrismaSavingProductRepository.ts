import { PrismaClient } from "@prisma/client";
import { SavingProductRepository } from "../../../application/ports/repositories/SavingProductRepository";
import { SavingProduct } from "../../../domain/entities/SavingProduct";
import Result, { err, ok } from "../../../shared/Result";
import { PrismaSavingProductMapper } from "../mappers/PrismaMappers/PrismaSavingProductMapper";
import { SavingProductNotFoundError } from "../../../domain/errors/SavingProductNotFoundError";

export class PrismaSavingProductRepository implements SavingProductRepository {
  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly prismaSavingProductMapper: PrismaSavingProductMapper
  ){}

  async save(savingProduct: SavingProduct): Promise<Result<SavingProduct, Error>> {
    try {
      const savingProductToPersistence = this.prismaSavingProductMapper.toPersistence(savingProduct);
      const registeredSavingProduct = await this.prismaClient.savingProduct.create({
        data: {
          ...savingProductToPersistence
        }
      });

      const savingProductToDomain = this.prismaSavingProductMapper.toDomain(registeredSavingProduct);
      return ok(savingProductToDomain);
    } catch (error) {
      return err(new Error(`An error occured when saving saving-product: ${savingProduct.savingProductIdentifier}`))
    }
  }

  async findById(savingProductIdentifier: string): Promise<Result<SavingProduct, Error>> {
    try {
      const maybeSavingProduct = await this.prismaClient.savingProduct.findUnique({
        where: { savingProductIdentifier }
      });

      if(!maybeSavingProduct){
        return err(new SavingProductNotFoundError(savingProductIdentifier));
      }

      const savingProductToDomain = this.prismaSavingProductMapper.toDomain(maybeSavingProduct);
      return ok(savingProductToDomain);
    } catch (error) {
      return err(new Error(`An error occured when retrieving saving-product ${savingProductIdentifier}`))
    }
  }

  async findByLabel(label: string): Promise<Result<SavingProduct, Error>> {
    try {
      const maybeSavingProduct = await this.prismaClient.savingProduct.findUnique({
        where: { label }
      });

      if(!maybeSavingProduct){
        return err(new SavingProductNotFoundError(label));
      }

      const savingProductToDomain = this.prismaSavingProductMapper.toDomain(maybeSavingProduct);
      return ok(savingProductToDomain);
    } catch (error) {
      return err(new Error(`An error occured when retrieving saving-product ${label}`))
    }
  }

  async all(): Promise<Result<SavingProduct[], Error>> {
    try {
      const allSavingProducts = await this.prismaClient.savingProduct.findMany();
      const allSavingProductsToDomain: SavingProduct[] = [];

      allSavingProducts.forEach((savingProduct) => {
        const savingProductToDomain = this.prismaSavingProductMapper.toDomain(savingProduct);
        allSavingProductsToDomain.push(savingProductToDomain)
      });

      return ok(allSavingProductsToDomain);
    } catch (error) {
      return err(new Error("An error when retriving all saving products"))
    }
  }

  async delete(savingProductIdentifier: string): Promise<Result<SavingProduct, Error>> {
    try{
      const maybeSavingProduct = await this.prismaClient.savingProduct.findUnique({
        where: { savingProductIdentifier }
      });

      if(!maybeSavingProduct){
        return err(new SavingProductNotFoundError(savingProductIdentifier));
      }

      const deletedSavingProduct = await this.prismaClient.savingProduct.delete({
        where: { savingProductIdentifier }
      });

      const deletedSavingProductToDomain = this.prismaSavingProductMapper.toDomain(deletedSavingProduct);
      return ok(deletedSavingProductToDomain);
    } catch (error) {
      return err(new Error(`An error occured when deleting saving product: ${savingProductIdentifier}`))
    }
  }
}

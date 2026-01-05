import { PrismaClient } from "@prisma/client";
import { StockRepository } from "../../../application/ports/repositories/StockRepository";
import { Stock } from "../../../domain/entities/Stock";
import { StockNotFoundError } from "../../../domain/errors/StockNotFoundError";
import Result, { err, ok } from "../../../shared/Result";
import { PrismaStockMapper } from "../mappers/PrismaMappers/PrismaStockMapper";

export class PrismaStockRepository implements StockRepository {
  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly prismaStockMapper: PrismaStockMapper
  ) {}

  async save(stock: Stock): Promise<Result<Stock, Error>> {
    try {
      const stockToPersist = this.prismaStockMapper.toPersistence(stock);
      const registeredStock = await this.prismaClient.stock.create({
        data: { ...stockToPersist }
      });
      return ok(this.prismaStockMapper.toDomain(registeredStock));
    } catch (error: any) {
      return err(new Error(`Error saving stock: ${error.message}`));
    }
  }

  async findById(stockIdentifier: string): Promise<Result<Stock, StockNotFoundError>> {
    try {
      const maybeStock = await this.prismaClient.stock.findUnique({
        where: { stockIdentifier }
      });

      if (!maybeStock) {
        return err(new StockNotFoundError(stockIdentifier));
      }

      return ok(this.prismaStockMapper.toDomain(maybeStock));
    } catch (error) {
      return err(new StockNotFoundError(stockIdentifier));
    }
  }

  async findByTicker(ticker: string): Promise<Result<Stock, StockNotFoundError>> {
    try {
      const maybeStock = await this.prismaClient.stock.findUnique({
        where: { ticker }
      });

      if (!maybeStock) {
        return err(new StockNotFoundError(ticker));
      }

      return ok(this.prismaStockMapper.toDomain(maybeStock));
    } catch (error) {
      return err(new StockNotFoundError(ticker));
    }
  }

  async findByCompanyId(companyId: string): Promise<Result<Stock[], Error>> {
    try {
      const stocks = await this.prismaClient.stock.findMany({
        where: { companyIdentifier: companyId }
      });
      return ok(stocks.map(s => this.prismaStockMapper.toDomain(s)));
    } catch (error: any) {
      return err(new Error(`Error fetching stocks for company ${companyId}: ${error.message}`));
    }
  }

  async update(stock: Stock): Promise<Result<Stock, StockNotFoundError>> {
    try {
      const stockToPersist = this.prismaStockMapper.toPersistence(stock);
      const updatedStock = await this.prismaClient.stock.update({
        where: { stockIdentifier: stock.stockIdentifier },
        data: {
          ticker: stockToPersist.ticker,
          price: stockToPersist.price,
          isAvailable: stockToPersist.isAvailable
        }
      });
      return ok(this.prismaStockMapper.toDomain(updatedStock));
    } catch (error) {
      return err(new StockNotFoundError(stock.stockIdentifier));
    }
  }

  async remove(id: string): Promise<Result<true, StockNotFoundError>> {
    try {
      await this.prismaClient.stock.delete({
        where: { stockIdentifier: id }
      });
      return ok(true);
    } catch (error) {
      return err(new StockNotFoundError(id));
    }
  }

  async all(): Promise<Result<Stock[], Error>> {
    try {
      const stocks = await this.prismaClient.stock.findMany();
      return ok(stocks.map(s => this.prismaStockMapper.toDomain(s)));
    } catch (error: any) {
      return err(new Error(`Error fetching all stocks: ${error.message}`));
    }
  }

  async allAvailableStocks(): Promise<Result<Stock[], Error>> {
    try {
      const stocks = await this.prismaClient.stock.findMany({
        where: { isAvailable: true }
      });
      return ok(stocks.map(s => this.prismaStockMapper.toDomain(s)));
    } catch (error: any) {
      return err(new Error(`Error fetching available stocks: ${error.message}`));
    }
  }
}

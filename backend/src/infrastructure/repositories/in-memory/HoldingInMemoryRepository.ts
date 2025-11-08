import { HoldingRepository } from '../../../application/ports/repositories/HoldingRepository';
import { Holding } from '../../../domain/entities/Holding';
import { BaseInMemoryRepository } from './BaseInMemoryRepository';
import { Result, ok, err } from '../../../shared/Result';
import { PositionDTO } from '../../../application/dtos/PositionDTO';

export class HoldingInMemoryRepository
  extends BaseInMemoryRepository<Holding>
  implements HoldingRepository
{
  constructor() {
    // Compose a unique id from portfolioIdentifier + stockIdentifier
    super((holding) => `${(holding as any).portfolioIdentifier}::${(holding as any).stockIdentifier}`);
  }

  async findByPortfolioIdAndStockId(
    portfolioId: string,
    stockId: string,
  ): Promise<Holding | null> {
    return this.firstWhere(
      (h) => (h as any).portfolioIdentifier === portfolioId && (h as any).stockIdentifier === stockId,
    );
  }

  async findAllByPortfolioId(portfolioId: string): Promise<Holding[]> {
    return this.where((h) => (h as any).portfolioIdentifier === portfolioId);
  }

  async getPosition(userId: string, stockId: string): Promise<Result<PositionDTO, never>> {
    const holding = this.firstWhere(
      (h) => (h as any).portfolioIdentifier === userId && (h as any).stockIdentifier === stockId,
    );

    const quantity = holding ? holding.quantity : 0;
    const dto: PositionDTO = {
      userId,
      stockId,
      quantity,
      updatedAt: holding ? new Date().toISOString() : new Date().toISOString(),
    };

    return ok(dto);
  }

  async setPosition(userId: string, stockId: string, quantity: number): Promise<Result<PositionDTO, Error>> {
    try {
      // Crée ou met à jour une holding en traitant userId comme portfolioIdentifier
      const holding = new Holding(userId, stockId, quantity);
      await this.save(holding);

      const dto: PositionDTO = {
        userId,
        stockId,
        quantity,
        updatedAt: new Date().toISOString(),
      };

      return ok(dto);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }

  async listByUser(userId: string): Promise<Result<PositionDTO[], never>> {
    // Agrège toutes les holdings appartenant au 'userId' (portfolioIdentifier)
    const holdings = this.where((h) => (h as any).portfolioIdentifier === userId);
    const map = new Map<string, number>();
    for (const h of holdings) {
      const key = (h as any).stockIdentifier;
      map.set(key, (map.get(key) ?? 0) + h.quantity);
    }

    const results: PositionDTO[] = Array.from(map.entries()).map(([stockId, quantity]) => ({
      userId,
      stockId,
      quantity,
      updatedAt: new Date().toISOString(),
    }));

    return ok(results);
  }
}
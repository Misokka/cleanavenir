import { Result } from "../../../shared/Result";
import { PositionDTO } from "../../dtos/PositionDTO";

export interface HoldingsRepository {
  getPosition(userId: string, stockId: string): Promise<Result<PositionDTO, never>>; // si pas de position, retourner quantity 0
  setPosition(userId: string, stockId: string, quantity: number): Promise<Result<PositionDTO, Error>>;
  listByUser(userId: string): Promise<Result<PositionDTO[], never>>;
}
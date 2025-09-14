import { Result } from "../../shared/Result";
import { OrdreDTO, OrdreSide, OrdreStatus } from "../dtos/OrdreDTO";
import { ActionNotFoundError } from "../../domain/errors/ActionNotFoundError";
import { OrdreNotFoundError } from "../../domain/errors/OrdreNotFoundError";
import { InvalidOrdreQuantityError } from "../../domain/errors/InvalidOrdreQuantityError";
import { InvalidOrdrePriceError } from "../../domain/errors/InvalidOrdrePriceError";

export interface OrdreRepository {
  place(input: {
    actionId: string;
    userId: string;
    side: OrdreSide;
    quantity: number;
    limitPrice: number; 
    fees: number;     
  }): Promise<Result<OrdreDTO, ActionNotFoundError | InvalidOrdreQuantityError | InvalidOrdrePriceError>>;

  findById(id: string): Promise<Result<OrdreDTO, OrdreNotFoundError>>;

  setStatus(id: string, status: OrdreStatus): Promise<Result<OrdreDTO, OrdreNotFoundError>>;

  listOpenBuysByAction(actionId: string): Promise<Result<OrdreDTO[], ActionNotFoundError>>;
  listOpenSellsByAction(actionId: string): Promise<Result<OrdreDTO[], ActionNotFoundError>>;

  listByUser(userId: string): Promise<Result<OrdreDTO[], never>>;
}
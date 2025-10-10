import { Result } from "../../shared/Result";
import { ActionDTO } from "../dtos/ActionDTO";
import { ActionNotFoundError } from "../../domain/errors/ActionNotFoundError";

export interface ActionRepository {
  create(input: { symbol: string; name: string }): Promise<Result<ActionDTO, Error>>; // Error si doublon symbol
  findById(id: string): Promise<Result<ActionDTO, ActionNotFoundError>>;
  findBySymbol(symbol: string): Promise<Result<ActionDTO, ActionNotFoundError>>;
  update(input: { id: string; name?: string }): Promise<Result<ActionDTO, ActionNotFoundError>>;
  remove(id: string): Promise<Result<true, ActionNotFoundError>>;
  list(): Promise<Result<ActionDTO[], never>>;
}
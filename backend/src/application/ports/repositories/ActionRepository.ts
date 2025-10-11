import { Result } from "../../../shared/Result";
import { ActionNotFoundError } from "../../../domain/errors/ActionNotFoundError";
import { Action } from "../../../domain/entities/Action";

export interface ActionRepository {
  create(input: { symbol: string; name: string }): Promise<Result<Action, Error>>; // Error si doublon symbol
  findById(id: string): Promise<Result<Action, ActionNotFoundError>>;
  findBySymbol(symbol: string): Promise<Result<Action, ActionNotFoundError>>;
  update(input: { id: string; name?: string }): Promise<Result<Action, ActionNotFoundError>>;
  remove(id: string): Promise<Result<true, ActionNotFoundError>>;
  list(): Promise<Result<Action[], never>>;
}
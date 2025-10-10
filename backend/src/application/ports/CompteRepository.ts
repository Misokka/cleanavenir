import { Result } from "../../shared/Result";
import { CompteDTO } from "../dtos/CompteDTO";
import { CompteNotFoundError } from "../../domain/errors/CompteNotFoundError";

export interface CompteRepository {
    create(input: {label: string}): Promise<Result<CompteDTO, CompteNotFoundError>>;
    findById(id: string): Promise<Result<CompteDTO, CompteNotFoundError>>;
    rename(id: string, label: string): Promise<Result<CompteDTO, CompteNotFoundError>>;
    remove(id: string): Promise<Result<true, CompteNotFoundError>>;
}
import { Result } from "../../shared/Result";
import { EpargneAccountDTO } from "../dtos/EpargneAccountDTO";
import { EpargneRateDTO } from "../dtos/EpargneRateDTO";
import { CompteNotFoundError } from "../../domain/errors/CompteNotFoundError";
import { AlreadyHasEpargneAccountError } from "../../domain/errors/AlreadyHasEpargneAccountError";
import { EpargneAccountNotFoundError } from "../../domain/errors/EpargneAccountNotFoundError";
import { EpargneRateNotSetError } from "../../domain/errors/EpargneRateNotSetError";

export interface EpargneRepository {
    openForCompte(compteId: string): Promise<
        Result<EpargneAccountDTO, CompteNotFoundError | AlreadyHasEpargneAccountError>
    >;

    findByCompteId(compteId: string): Promise<
        Result<EpargneAccountDTO, EpargneAccountNotFoundError>
    >;

    setActive(compteId: string, active: boolean): Promise<
        Result<EpargneAccountDTO, EpargneAccountNotFoundError>
    >;

    setGlobalRate(value: number): Promise<Result<EpargneRateDTO, never>>;
    getGlobalRate(): Promise<Result<EpargneRateDTO, EpargneRateNotSetError>>;
}
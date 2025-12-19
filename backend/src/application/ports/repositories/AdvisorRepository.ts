import { Advisor } from "../../../domain/entities/Advisor";
import { CouldNotCreateAdvisorError } from "../../../domain/errors/CouldNotCreateAdvisorError";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError";
import { Result } from "../../../shared/Result";

export interface AdvisorRepository{
  save(advisor: Advisor): Promise<Result<Advisor, CouldNotCreateAdvisorError>>
  findById(advisorIdentifier: string): Promise<Result<Advisor, UserNotFoundError>>;
  findRandom(): Promise<Result<Advisor, Error>>;
}
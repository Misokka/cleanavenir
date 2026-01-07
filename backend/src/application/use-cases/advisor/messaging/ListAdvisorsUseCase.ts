import { Result, ok, err } from '../../../../shared/Result';
import { AdvisorRepository } from '../../../ports/repositories/AdvisorRepository';
import { UserRepository } from '../../../ports/repositories/UserRepository';
import { AdvisorNotFoundError } from '../../../../domain/errors/AdvisorNotFoundError';

export interface AdvisorListItemDTO {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
}

export interface ListAdvisorsInput {
  userId: string;
}

export class ListAdvisorsUseCase {
  constructor(
    private readonly advisorRepository: AdvisorRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(input: ListAdvisorsInput): Promise<Result<AdvisorListItemDTO[], Error>> {
    const currentAdvisorResult = await this.advisorRepository.findByUserId(input.userId);
    if (!currentAdvisorResult.ok) {
      return err(new AdvisorNotFoundError(input.userId));
    }
    const currentAdvisor = currentAdvisorResult.value;

    const advisorsResult = await this.advisorRepository.findAll();
    if (!advisorsResult.ok) {
      return err(advisorsResult.error);
    }

    const advisorDTOs: AdvisorListItemDTO[] = [];
    for (const advisor of advisorsResult.value) {
      if (advisor.advisorIdentifier === currentAdvisor.advisorIdentifier) {
        continue; 
      }
      
      const userResult = await this.userRepository.findById(advisor.userIdentifier);
      if (userResult.ok) {
        advisorDTOs.push({
          id: advisor.advisorIdentifier,
          firstname: userResult.value.firstname,
          lastname: userResult.value.lastname,
          email: userResult.value.email,
        });
      }
    }

    return ok(advisorDTOs);
  }
}

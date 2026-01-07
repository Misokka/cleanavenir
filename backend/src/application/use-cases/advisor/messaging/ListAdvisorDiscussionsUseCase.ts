import { Result, ok, err } from '../../../../shared/Result';
import { DiscussionRepository } from '../../../ports/repositories/DiscussionRepository';
import { AdvisorRepository } from '../../../ports/repositories/AdvisorRepository';
import { UserRepository } from '../../../ports/repositories/UserRepository';
import { ClientRepository } from '../../../ports/repositories/ClientRepository';
import { DiscussionDTO } from '../../../dtos/DiscussionDTO';
import { AdvisorNotFoundError } from '../../../../domain/errors/AdvisorNotFoundError';

export interface ListAdvisorDiscussionsInput {
  userId: string;
}

export interface AdvisorDiscussionsOutput {
  pending: DiscussionDTO[];
  assigned: DiscussionDTO[];
}

export class ListAdvisorDiscussionsUseCase {
  constructor(
    private readonly discussionRepository: DiscussionRepository,
    private readonly advisorRepository: AdvisorRepository,
    private readonly userRepository: UserRepository,
    private readonly clientRepository: ClientRepository
  ) {}

  async execute(input: ListAdvisorDiscussionsInput): Promise<Result<AdvisorDiscussionsOutput, Error>> {
    const advisorResult = await this.advisorRepository.findByUserId(input.userId);
    if (!advisorResult.ok) {
      return err(new AdvisorNotFoundError(input.userId));
    }
    const advisor = advisorResult.value;

    const pendingResult = await this.discussionRepository.listPending();
    if (!pendingResult.ok) {
      return err(pendingResult.error);
    }

    const assignedResult = await this.discussionRepository.listForAdvisor(advisor.advisorIdentifier);
    if (!assignedResult.ok) {
      return err(assignedResult.error);
    }

    const enrichDiscussion = async (d: any): Promise<DiscussionDTO> => {
      let clientName: string | undefined;
      const clientResult = await this.clientRepository.findById(d.clientIdentifier);
      if (clientResult.ok) {
        const userResult = await this.userRepository.findById(clientResult.value.userIdentifier);
        if (userResult.ok) {
          clientName = `${userResult.value.firstname} ${userResult.value.lastname}`;
        }
      }

      return {
        id: d.discussionIdentifier,
        clientId: d.clientIdentifier,
        advisorId: d.advisorIdentifier,
        subject: d.subject,
        status: d.status,
        createdAt: d.createdAt.toISOString(),
        updatedAt: d.updatedAt.toISOString(),
        clientName,
      };
    };

    const pendingDTOs = await Promise.all(pendingResult.value.map(enrichDiscussion));
    const assignedDTOs = await Promise.all(assignedResult.value.map(enrichDiscussion));

    return ok({
      pending: pendingDTOs,
      assigned: assignedDTOs,
    });
  }
}

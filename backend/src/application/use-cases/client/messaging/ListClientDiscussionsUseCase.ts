import { Result, ok, err } from '../../../../shared/Result';
import { DiscussionRepository } from '../../../ports/repositories/DiscussionRepository';
import { ClientRepository } from '../../../ports/repositories/ClientRepository';
import { AdvisorRepository } from '../../../ports/repositories/AdvisorRepository';
import { UserRepository } from '../../../ports/repositories/UserRepository';
import { DiscussionDTO } from '../../../dtos/DiscussionDTO';
import { ClientNotFoundError } from '../../../../domain/errors/ClientNotFoundError';

export interface ListClientDiscussionsInput {
  userId: string;
}

export class ListClientDiscussionsUseCase {
  constructor(
    private readonly discussionRepository: DiscussionRepository,
    private readonly clientRepository: ClientRepository,
    private readonly advisorRepository?: AdvisorRepository,
    private readonly userRepository?: UserRepository
  ) {}

  async execute(input: ListClientDiscussionsInput): Promise<Result<DiscussionDTO[], Error>> {
    const clientResult = await this.clientRepository.findByUserId(input.userId);
    if (!clientResult.ok) {
      return err(new ClientNotFoundError(input.userId));
    }
    const client = clientResult.value;

    const discussionsResult = await this.discussionRepository.listForClient(client.clientIdentifier);
    if (!discussionsResult.ok) {
      return err(discussionsResult.error);
    }

    const advisorNames: Record<string, string> = {};
    if (this.advisorRepository && this.userRepository) {
      const advisorIds = [...new Set(discussionsResult.value
        .filter(d => d.advisorIdentifier)
        .map(d => d.advisorIdentifier as string))];
      
      for (const advisorId of advisorIds) {
        const advisorResult = await this.advisorRepository.findById(advisorId);
        if (advisorResult.ok) {
          const userResult = await this.userRepository.findById(advisorResult.value.userIdentifier);
          if (userResult.ok) {
            advisorNames[advisorId] = `${userResult.value.firstname} ${userResult.value.lastname}`;
          }
        }
      }
    }

    const discussionDTOs: DiscussionDTO[] = discussionsResult.value.map(d => ({
      id: d.discussionIdentifier,
      clientId: d.clientIdentifier,
      advisorId: d.advisorIdentifier,
      subject: d.subject,
      status: d.status,
      createdAt: d.createdAt.toISOString(),
      updatedAt: d.updatedAt.toISOString(),
      advisorName: d.advisorIdentifier ? advisorNames[d.advisorIdentifier] : undefined,
    }));

    return ok(discussionDTOs);
  }
}

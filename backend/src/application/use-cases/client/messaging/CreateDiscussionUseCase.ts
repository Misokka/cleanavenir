import { randomUUID } from 'crypto';
import { Result, ok, err } from '../../../../shared/Result';
import { DiscussionRepository } from '../../../ports/repositories/DiscussionRepository';
import { ClientRepository } from '../../../ports/repositories/ClientRepository';
import { Discussion } from '../../../../domain/entities/Discussion';
import { ClientNotFoundError } from '../../../../domain/errors/ClientNotFoundError';

export interface CreateDiscussionInput {
  userId: string;
  subject?: string;
}

export interface CreateDiscussionOutput {
  id: string;
  clientId: string;
  advisorId: string | null;
  subject: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export class CreateDiscussionUseCase {
  constructor(
    private readonly discussionRepository: DiscussionRepository,
    private readonly clientRepository: ClientRepository
  ) {}

  async execute(input: CreateDiscussionInput): Promise<Result<CreateDiscussionOutput, Error>> {
    const clientResult = await this.clientRepository.findByUserId(input.userId);
    if (!clientResult.ok) {
      return err(new ClientNotFoundError(input.userId));
    }
    const client = clientResult.value;

    const discussion = new Discussion(
      randomUUID(),
      client.clientIdentifier,
      null, 
      input.subject ?? null,
      'PENDING',
      new Date(),
      new Date()
    );

    const saveResult = await this.discussionRepository.save(discussion);
    if (!saveResult.ok) {
      return err(saveResult.error);
    }

    const saved = saveResult.value;
    return ok({
      id: saved.discussionIdentifier,
      clientId: saved.clientIdentifier,
      advisorId: saved.advisorIdentifier,
      subject: saved.subject,
      status: saved.status,
      createdAt: saved.createdAt.toISOString(),
      updatedAt: saved.updatedAt.toISOString(),
    });
  }
}

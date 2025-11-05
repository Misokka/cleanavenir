// Imports à vérifier, surtout pour Discussion et DiscussionRepository
import { DiscussionRepository } from '../../application/ports/repositories/DiscussionRepository';
import { Discussion } from '../../domain/entities/Discussion'; // Ajustez ce chemin si nécessaire
import { BaseInMemoryRepository } from './BaseInMemoryRepository';

export class DiscussionInMemoryRepository
  extends BaseInMemoryRepository<Discussion>
  implements DiscussionRepository
{
  constructor() {
    super((discussion) => discussion.id);
  }

  async findAllByUserId(userId: string): Promise<Discussion[]> {
    return this.where((d) => d.userId === userId);
  }
}
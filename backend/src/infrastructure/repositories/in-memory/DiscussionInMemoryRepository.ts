import { DiscussionRepository } from '../../../application/ports/repositories/DiscussionRepository';
import { Discussion } from '../../../domain/entities/Discussion';
import { Result, ok, err } from '../../../shared/Result';
import { DiscussionNotFoundError } from '../../../domain/errors/DiscussionNotFoundError';
import { DiscussionAlreadyAssignedError } from '../../../domain/errors/DiscussionAlreadyAssignedError';

// Map-backed in-memory repository so we can return Result<> wrappers like the drizzle implementation
export class DiscussionInMemoryRepository implements DiscussionRepository {
  private items = new Map<string, Discussion>();

  private clone<T>(v: T): T {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // en gros sa veut dire que si structuredClone n'est pas disponible, on utilise une méthode de secours
      return (structuredClone as any)(v);
    } catch {
      return JSON.parse(JSON.stringify(v));
    }
  }

  async save(discussion: Discussion): Promise<Result<Discussion, Error>> {
    this.items.set(discussion.discussionIdentifier ?? (discussion as any).discussionIdentifier ?? String(Date.now()), this.clone(discussion));
    return ok(this.clone(discussion));
  }

  async findById(discussionId: string): Promise<Result<Discussion, Error>> {
    const discussion = this.items.get(discussionId);
    if (!discussion) {
      return err(new DiscussionNotFoundError(discussionId));
    }
    return ok(this.clone(discussion));
  }

  async listForClient(clientId: string): Promise<Result<Discussion[], Error>> {
    const rows = Array.from(this.items.values()).filter(d => d.clientIdentifier === clientId || (d as any).clientId === clientId).map(d => this.clone(d));
    return ok(rows);
  }

  async listPending(): Promise<Result<Discussion[], Error>> {
    const rows = Array.from(this.items.values()).filter(d => d.status === 'PENDING').map(d => this.clone(d));
    return ok(rows);
  }

  async listForAdvisor(advisorId: string): Promise<Result<Discussion[], Error>> {
    const rows = Array.from(this.items.values())
      .filter(d => d.advisorIdentifier === advisorId && d.status === 'ASSIGNED')
      .map(d => this.clone(d));
    return ok(rows);
  }

  async update(discussion: Discussion): Promise<Result<Discussion, Error>> {
    if (!this.items.has(discussion.discussionIdentifier)) {
      return err(new DiscussionNotFoundError(discussion.discussionIdentifier));
    }
    this.items.set(discussion.discussionIdentifier, this.clone(discussion));
    return ok(this.clone(discussion));
  }

  async claimDiscussion(discussionId: string, advisorId: string): Promise<Result<Discussion, Error>> {
    const discussion = this.items.get(discussionId);
    if (!discussion) {
      return err(new DiscussionNotFoundError(discussionId));
    }
    if (discussion.status !== 'PENDING') {
      return err(new DiscussionAlreadyAssignedError(discussionId));
    }
    // Update the discussion with advisor and status
    const updatedDiscussion = this.clone(discussion);
    (updatedDiscussion as any).advisorIdentifier = advisorId;
    (updatedDiscussion as any).status = 'ASSIGNED';
    this.items.set(discussionId, updatedDiscussion);
    return ok(this.clone(updatedDiscussion));
  }

  async markMessagesAsRead(_discussionId: string, _readerRole: 'CLIENT' | 'ADVISOR'): Promise<Result<number, Error>> {
    // In-memory implementation - just return 0 as no real messages are stored
    return ok(0);
  }
}
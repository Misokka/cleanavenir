import { DiscussionRepository } from '../../../application/ports/repositories/DiscussionRepository';
import { Discussion } from '../../../domain/entities/Discussion';
import { Result, ok } from '../../../shared/Result';

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

  async listForClient(clientId: string): Promise<Result<Discussion[], Error>> {
    const rows = Array.from(this.items.values()).filter(d => d.clientIdentifier === clientId || (d as any).clientId === clientId).map(d => this.clone(d));
    return ok(rows);
  }
}
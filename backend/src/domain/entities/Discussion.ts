export type DiscussionStatus = 'PENDING' | 'ASSIGNED' | 'CLOSED';

export class Discussion {
  constructor(
    public discussionIdentifier: string,
    public clientIdentifier: string,
    public advisorIdentifier: string | null = null,
    public subject: string | null = null,
    public status: DiscussionStatus = 'PENDING',
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  isPending(): boolean {
    return this.status === 'PENDING';
  }

  isAssigned(): boolean {
    return this.status === 'ASSIGNED';
  }

  canBeClaimedBy(advisorId: string): boolean {
    return this.status === 'PENDING';
  }

  canBeRespondedBy(advisorId: string): boolean {
    if (this.status === 'PENDING') return true;
    return this.status === 'ASSIGNED' && this.advisorIdentifier === advisorId;
  }

  assign(advisorId: string): void {
    this.advisorIdentifier = advisorId;
    this.status = 'ASSIGNED';
    this.updatedAt = new Date();
  }

  transfer(newAdvisorId: string): void {
    this.advisorIdentifier = newAdvisorId;
    this.updatedAt = new Date();
  }

  close(): void {
    this.status = 'CLOSED';
    this.updatedAt = new Date();
  }
}

export class DiscussionTransfer {
  constructor(
    public transferIdentifier: string,
    public discussionIdentifier: string,
    public fromAdvisorIdentifier: string,
    public toAdvisorIdentifier: string,
    public reason: string | null = null,
    public createdAt: Date = new Date(),
  ) {}
}
